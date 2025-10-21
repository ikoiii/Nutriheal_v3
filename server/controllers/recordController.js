// server/controllers/recordController.js
// MENGGUNAKAN pdfreader DAN PROMPT BARU

console.log("--- KODE ANALISIS PDF (DENGAN pdfreader & PROMPT BARU) SEDANG BERJALAN ---");

const fs = require('fs');
const { pool } = require('../config/db');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PdfReader } = require("pdfreader"); // Import pdfreader

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function cleanupFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

const analyzeRecord = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File PDF rekam medis harus diunggah' });
  }

  const pdfPath = req.file.path;

  try {
    // Ekstrak teks menggunakan pdfreader
    const pdfText = await new Promise((resolve, reject) => {
      let extractedText = "";
      new PdfReader().parseFileItems(pdfPath, (err, item) => {
        if (err) {
          console.error("Error parsing PDF:", err);
          reject(new Error("Gagal mem-parsing file PDF"));
        } else if (!item) {
          console.log("Ekstraksi teks PDF selesai.");
          resolve(extractedText);
        } else if (item.text) {
          extractedText += item.text + " ";
        }
      });
    });

    if (!pdfText.trim()) {
       throw new Error("Tidak ada teks yang dapat diekstrak dari PDF.");
    }

    // Siapkan model AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    // --- 👇 PROMPT BARU DARI ANDA 👇 ---
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
    // --- 👆 AKHIR PROMPT BARU 👆 ---

    // Kirim prompt ke Gemini
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const analysisResult = JSON.parse(responseText); // Parse respons JSON

    // Simpan ke Database
    const userId = req.user.id;
    const fileName = req.file.filename;
    await pool.query(
      'INSERT INTO medical_analyses (user_id, file_name, analysis_summary) VALUES (?, ?, ?)',
      [userId, fileName, JSON.stringify(analysisResult)]
    );

    // Kirim respons sukses
    res.status(200).json({
      message: "Analisis PDF berhasil",
      data: analysisResult
    });

  } catch (error) {
    console.error("Error saat analisis PDF:", error);
    if (error instanceof SyntaxError) {
       console.error("Error: Respons AI bukan JSON yang valid.");
       return res.status(500).json({ message: "Gagal mem-parsing respons AI. Coba lagi." });
    }
    if (error.message.includes("Tidak ada teks")) {
       return res.status(400).json({ message: error.message });
    }
    if (error.message.includes("Gagal mem-parsing")) {
       return res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Gagal menganalisis PDF" });

  } finally {
     cleanupFile(pdfPath);
  }
};

// Fungsi getRecordHistory tetap sama
const getRecordHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT
        id, file_name, analysis_summary, created_at
      FROM medical_analyses
      WHERE user_id = ? ORDER BY created_at DESC LIMIT 10;
    `;
    const [history] = await pool.query(query, [userId]);
    const parsedHistory = history.map(item => ({
      ...item,
      analysis_summary: JSON.parse(item.analysis_summary)
    }));
    res.status(200).json(parsedHistory);
  } catch (error) {
    console.error("Error saat mengambil riwayat rekam medis:", error);
    res.status(500).json({ message: "Gagal mengambil riwayat rekam medis" });
  }
};

module.exports = {
  analyzeRecord,
  getRecordHistory
};