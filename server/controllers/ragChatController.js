const { getChatResponse, RagChatError } = require('../services/ragChatService');

const getChatReply = async (req, res, next) => {
  try {
    const { user_question } = req.body;
    const userId = req.user.id; // Assuming user ID is available from authentication middleware

    if (!user_question) {
      return next(new RagChatError('Pertanyaan pengguna harus diisi.', 400));
    }

    const result = await getChatResponse(userId, user_question);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChatReply,
};
