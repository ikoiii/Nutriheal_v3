const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY tidak ditemukan di .env");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getGeminiModel() {
  let model;
  try {
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("✅ Model gemini-2.5-flash tersedia");
  } catch (err) {
    console.warn("⚠️ Model gemini-2.5-flash tidak tersedia, fallback ke gemini-pro");
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }
  return model;
}

async function analyzeTextWithGemini(pdfText) {
  const model = await getGeminiModel();

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

  console.log("📤 Mengirim ke Gemini...");

  let result;
  let responseText = "";
  const MAX_RETRIES = 3;
  const BASE_DELAY_MS = 1000;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        const delayTime = (BASE_DELAY_MS * Math.pow(2, attempt - 1)) + (Math.random() * 1000);
        console.warn(`⚠️ Percobaan ${attempt} gagal. Mencoba lagi dalam ${Math.round(delayTime)}ms...`);
        await delay(delayTime);
      }

      result = await model.generateContent(prompt);
      responseText = result.response.text().trim();
      console.log("📥 Respons AI diterima (preview):", responseText.slice(0, 200));
      
      break;

    } catch (error) {
      const isRetryable = error.status === 503 || error.status === 429;

      console.warn(`❌ Error (Percobaan ${attempt + 1}/${MAX_RETRIES + 1}): ${error.status} ${error.statusText || error.message}`);

      if (isRetryable && attempt < MAX_RETRIES) {
        continue;
      } else {
        console.error(`❌ Gagal total mengirim ke Gemini setelah ${attempt + 1} percobaan.`);
        throw error; 
      }
    }
  }
  return responseText;
}

module.exports = {
  analyzeTextWithGemini,
};
