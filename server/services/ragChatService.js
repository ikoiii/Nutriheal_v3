const analysisRepository = require('../repositories/analysisRepository');
const dailyLogRepository = require('../repositories/dailyLogRepository');
const userGoalRepository = require('../repositories/userGoalRepository');
const { getChatCompletion } = require('./geminiService');

class RagChatError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'RagChatError';
    this.statusCode = statusCode;
  }
}

async function getChatResponse(userId, userQuestion) {
  if (!userId || !userQuestion) {
    throw new RagChatError('User ID dan pertanyaan pengguna harus diisi.', 400);
  }

  // 1. Retrieve Context
  // const latestAnalysis = await analysisRepository.getAnalysisHistory(userId); // Removed as per user request
  const dailyLogs = await dailyLogRepository.getDailyLogsByUserId(userId, 7); // Last 7 days
  const userGoals = await userGoalRepository.getUserGoalsByUserId(userId);

  // 2. Formulate Prompt (Augment)
  let contextPrompt = "";

  // if (latestAnalysis && latestAnalysis.length > 0) {
  //   contextPrompt += "\nKonteks Analisis Medis Terbaru:\n";
  //   contextPrompt += JSON.stringify(latestAnalysis[0].analysis_summary, null, 2);
  // }

  if (dailyLogs && dailyLogs.length > 0) {
    contextPrompt += "\nLog Harian Terbaru (7 hari terakhir):\n";
    dailyLogs.forEach(log => {
      contextPrompt += `- Tanggal: ${log.log_date}, Energi: ${log.energy_level}, Stres: ${log.stress_level}, Tidur: ${log.sleep_quality}, Catatan: ${log.notes || '-'}\n`;
    });
  }

  if (userGoals && userGoals.length > 0) {
    contextPrompt += "\nTujuan Aktif Pengguna:\n";
    userGoals.forEach(goal => {
      contextPrompt += `- Deskripsi: ${goal.goal_description}, Status: ${goal.status}\n`;
    });
  }

  const fullPrompt = `
Anda adalah asisten kesehatan AI yang ramah dan informatif.
**JANGAN** melakukan analisis PDF atau menghasilkan output dalam format JSON.
**JANGAN PERNAH** menggunakan format markdown apa pun, termasuk bold (**), italic (*), list (-), atau karakter khusus lainnya seperti bintang (*). Berikan respons dalam teks biasa saja.
Berikan jawaban yang **singkat, jelas, dan langsung pada intinya**.
Fokuslah hanya pada topik yang berkaitan dengan kesehatan dan nutrisi.
Jika pertanyaan pengguna tidak terkait dengan kesehatan atau nutrisi, tolak dengan sopan dan nyatakan bahwa Anda hanya dapat membantu dengan pertanyaan terkait kesehatan.
Berikan saran berdasarkan konteks pengguna yang diberikan di bawah ini. Jika informasi tidak cukup, katakan bahwa Anda membutuhkan lebih banyak data atau tidak dapat memberikan saran spesifik.

${contextPrompt}

Pertanyaan Pengguna: ${userQuestion}
`;

  // 3. Generate
  const geminiResponse = await getChatCompletion(fullPrompt);
  return { response: geminiResponse };
}

module.exports = {
  getChatResponse,
  RagChatError,
};
