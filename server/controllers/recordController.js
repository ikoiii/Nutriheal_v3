console.log("--- KODE ANALISIS PDF (STABIL) SEDANG BERJALAN ---");

const fs = require("fs");
const { pool } = require("../config/db");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PdfReader } = require("pdfreader");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY tidak ditemukan di .env");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function cleanupFile(filePath) {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

async function extractTextFromPdf(filePath) {
  return new Promise((resolve, reject) => {
    let text = "";
    new PdfReader().parseFileItems(filePath, (err, item) => {
      if (err) reject(err);
      else if (!item) resolve(text);
      else if (item.text) text += item.text + " ";
    });
  });
}

// --- MODIFIKASI DIMULAI: Fungsi Bantuan Penundaan ---
/**
 * Fungsi helper untuk membuat penundaan (delay) secara asynchronous.
 * @param {number} ms - Waktu tunda dalam milidetik.
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// --- MODIFIKASI SELESAI ---

const analyzeRecord = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File PDF rekam medis harus diunggah" });
  }

  const pdfPath = req.file.path;

  try {
  
    const pdfText = await extractTextFromPdf(pdfPath);
    if (!pdfText.trim()) {
      throw new Error("Tidak ada teks yang dapat diekstrak dari PDF.");
    }
    console.log("✅ Teks berhasil diekstrak:", pdfText.slice(0, 200), "...");

    
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      console.log("✅ Model gemini-2.5-flash tersedia");
    } catch (err) {
      // Perbaikan kecil pada komentar Anda:
      console.warn("⚠️ Model gemini-2.5-flash tidak tersedia, fallback ke gemini-pro");
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    // --- Prompt final ---
    const prompt = `
Anda adalah asisten medis AI profesional.
Analisis teks rekam medis berikut ini secara mendalam, ringkas, dan jelas.
Tambahkan juga rekomendasi makanan yang dapat dikonsumsi berdasarkan kondisi pasien.
Hasil analisis harus mencakup identitas pasien, ringkasan diagnosis, data medis utama, daftar obat (jika ada), rekomendasi umum, serta daftar makanan yang disarankan dalam setiap waktu makan.
Keluarkan hasil **DALAM FORMAT JSON VALID** tanpa teks tambahan di luar objek JSON.

Teks Rekam Medis:
"""
${pdfText}
"""

Struktur JSON:
{
  "patient_name": "...",
  "diagnosis_summary": "...",
  "key_metrics": [
    { "metric": "Tekanan Darah", "value": "..." },
    { "metric": "Kolesterol Total", "value": "..." },
    { "metric": "Gula Darah", "value": "..." }
  ],
  "medications": [
    { "name": "...", "dosage": "..." }
  ],
  "recommendations": "...",
  "food_recommendations": [
    { "category": "Sarapan", "items": ["..."] },
    { "category": "Makan Siang", "items": ["..."] },
    { "category": "Makan Malam", "items": ["..."] },
    { "category": "Camilan", "items": ["..."] }
  ]
}
`;

    // --- MODIFIKASI DIMULAI: Logika Exponential Backoff ---
    
    console.log("📤 Mengirim ke Gemini...");

    let result;
    let responseText = "";
    const MAX_RETRIES = 3; // Coba lagi maksimal 3 kali (total 4 percobaan)
    const BASE_DELAY_MS = 1000; // Waktu tunggu awal 1 detik

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Hanya lakukan penundaan SETELAH percobaan pertama gagal
        if (attempt > 0) {
          // Hitung waktu tunggu: 1s, 2s, 4s (+ "jitter" acak)
          const delayTime = (BASE_DELAY_MS * Math.pow(2, attempt - 1)) + (Math.random() * 1000);
          console.warn(`⚠️ Percobaan ${attempt} gagal. Mencoba lagi dalam ${Math.round(delayTime)}ms...`);
          await delay(delayTime);
        }

        result = await model.generateContent(prompt);
        responseText = result.response.text().trim();
        console.log("📥 Respons AI diterima (preview):", responseText.slice(0, 200));
        
        // Jika berhasil, keluar dari loop retry
        break;

      } catch (error) {
        // Cek apakah error bisa dicoba lagi (503 Service Unavailable atau 429 Too Many Requests)
        const isRetryable = error.status === 503 || error.status === 429;

        console.warn(`❌ Error (Percobaan ${attempt + 1}/${MAX_RETRIES + 1}): ${error.status} ${error.statusText || error.message}`);

        // Jika error BISA dicoba lagi dan masih ada sisa percobaan
        if (isRetryable && attempt < MAX_RETRIES) {
          // Biarkan loop berlanjut untuk mencoba lagi
          continue;
        } else {
          // Jika ini adalah percobaan terakhir ATAU error tidak bisa dicoba lagi (misal 400 Bad Request)
          console.error(`❌ Gagal total mengirim ke Gemini setelah ${attempt + 1} percobaan.`);
          // Lempar error untuk ditangkap oleh blok catch (error) utama di luar
          throw error; 
        }
      }
    }
    
    // --- MODIFIKASI SELESAI ---


    let analysisResult;
    try {
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        responseText = responseText.slice(jsonStart, jsonEnd + 1);
      }
      analysisResult = JSON.parse(responseText);
    } catch (err) {
      console.error("⚠️ Respons AI bukan JSON valid. Gunakan fallback default.");
      analysisResult = {
        patient_name: "Tidak ditemukan",
        diagnosis_summary: "Tidak dapat dianalisis (format tidak valid)",
        key_metrics: [],
        medications: [],
        recommendations: "Periksa ulang file PDF atau ulangi analisis.",
        food_recommendations: [],
      };
    }

    const userId = req.user?.id || 0; 
    const fileName = req.file.filename;
    await pool.query(
      "INSERT INTO medical_analyses (user_id, file_name, analysis_summary) VALUES (?, ?, ?)",
      [userId, fileName, JSON.stringify(analysisResult)]
    );

    console.log("✅ Data berhasil disimpan ke database.");
    res.status(200).json({
      message: "Analisis PDF berhasil",
      data: analysisResult,
    });
  } catch (error) {
    console.error("❌ Error saat analisis PDF:", error);
    // Cek apakah ini error dari Gemini atau error lain
    if (error.status === 503 || error.status === 429) {
         return res.status(503).json({ message: "Server AI sedang sibuk. Silakan coba lagi beberapa saat." });
    }
    if (error.message.includes("Tidak ada teks")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Gagal menganalisis PDF" });
  } finally {
    cleanupFile(pdfPath);
  }
};

const getRecordHistory = async (req, res) => {
  try {
    const userId = req.user?.id || 0;
    const query = `
      SELECT id, file_name, analysis_summary, created_at
      FROM medical_analyses
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 10;
    `;
    const [history] = await pool.query(query, [userId]);
    const parsedHistory = history.map((item) => ({
      ...item,
      analysis_summary: JSON.parse(item.analysis_summary),
    }));
    res.status(200).json(parsedHistory);
  } catch (error) {
    console.error("❌ Error saat mengambil riwayat rekam medis:", error);
    res.status(500).json({ message: "Gagal mengambil riwayat rekam medis" });
  }
};

module.exports = {
  analyzeRecord,
  getRecordHistory,
};