const { extractTextFromPdf, cleanupFile } = require("../utils/pdfUtils");
const { analyzeTextWithGemini } = require("../services/geminiService");
const { saveAnalysisRecord, getAnalysisHistory } = require("../repositories/analysisRepository");

const analyzeRecord = async (req, res, next) => {
  if (!req.file) {
    return next(new Error("File PDF rekam medis harus diunggah", { cause: { statusCode: 400 } }));
  }

  const pdfPath = req.file.path;

  try {
    const pdfText = await extractTextFromPdf(pdfPath);
    if (!pdfText.trim()) {
      throw new Error("Tidak ada teks yang dapat diekstrak dari PDF.", { cause: { statusCode: 400 } });
    }
    console.log("✅ Teks berhasil diekstrak:", pdfText.slice(0, 200), "...");

    let responseText = await analyzeTextWithGemini(pdfText);

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
    await saveAnalysisRecord(userId, fileName, analysisResult);

    console.log("✅ Data berhasil disimpan ke database.");
    res.status(200).json({
      message: "Analisis PDF berhasil",
      data: analysisResult,
    });
  } catch (error) {
    // Pass all errors to the error handling middleware
    if (error.status === 503 || error.status === 429) {
      return next(new Error("Server AI sedang sibuk. Silakan coba lagi beberapa saat.", { cause: { statusCode: 503 } }));
    }
    next(error);
  } finally {
    cleanupFile(pdfPath);
  }
};

const getRecordHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id || 0;
    const history = await getAnalysisHistory(userId);
    res.status(200).json(history);
  } catch (error) {
    // Pass all errors to the error handling middleware
    next(error);
  }
};

module.exports = {
  analyzeRecord,
  getRecordHistory,
};