// Set GEMINI_API_KEY before requiring recordController to prevent process.exit in geminiService
process.env.GEMINI_API_KEY = 'test-key';

const { extractTextFromPdf, cleanupFile } = require('../../utils/pdfUtils');
const { saveAnalysisRecord, getAnalysisHistory } = require('../../repositories/analysisRepository');

jest.mock('../../utils/pdfUtils');
jest.mock('../../repositories/analysisRepository');

// Mock the entire geminiService module to prevent process.exit from being called on load
jest.mock('../../services/geminiService', () => ({
  analyzeTextWithGemini: jest.fn(),
}));
const { analyzeTextWithGemini } = require('../../services/geminiService');

// Mock process.exit globally for this test file
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

describe('recordController', () => {
  let mockReq, mockRes, mockNext;

  beforeAll(() => {
    // The actual recordController will be required in beforeEach to ensure mocks are in place
  });

  beforeEach(() => {
    // Dynamically require the module AFTER mocks are in place
    const { analyzeRecord, getRecordHistory } = require('../../controllers/recordController');
    this.analyzeRecord = analyzeRecord;
    this.getRecordHistory = getRecordHistory;

    mockReq = {
      file: { path: '/tmp/test.pdf', filename: 'test.pdf' },
      user: { id: 1 },
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
    mockExit.mockClear(); // Clear mockExit calls
  });

  afterAll(() => {
    mockExit.mockRestore(); // Restore original process.exit
    delete process.env.GEMINI_API_KEY; // Clean up env var
  });

  describe('analyzeRecord', () => {
    it('should call next with 400 error if no file is uploaded', async () => {
      mockReq.file = undefined;
      await this.analyzeRecord(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'File PDF rekam medis harus diunggah', cause: { statusCode: 400 } }));
      expect(cleanupFile).not.toHaveBeenCalled();
      expect(mockExit).not.toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should call next with 400 error if no text can be extracted from PDF', async () => {
      extractTextFromPdf.mockResolvedValueOnce(' '); // Empty text after trim

      await this.analyzeRecord(mockReq, mockRes, mockNext);

      expect(extractTextFromPdf).toHaveBeenCalledWith(mockReq.file.path);
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'Tidak ada teks yang dapat diekstrak dari PDF.', cause: { statusCode: 400 } }));
      expect(cleanupFile).toHaveBeenCalledWith(mockReq.file.path);
      expect(mockExit).not.toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should analyze PDF, save record, and return 200', async () => {
      const mockPdfText = 'Extracted PDF text';
      const mockGeminiResponse = JSON.stringify({ patient_name: 'John Doe' });
      const mockAnalysisResult = { patient_name: 'John Doe' };

      extractTextFromPdf.mockResolvedValueOnce(mockPdfText);
      analyzeTextWithGemini.mockResolvedValueOnce(mockGeminiResponse);
      saveAnalysisRecord.mockResolvedValueOnce({});

      await this.analyzeRecord(mockReq, mockRes, mockNext);

      expect(extractTextFromPdf).toHaveBeenCalledWith(mockReq.file.path);
      expect(analyzeTextWithGemini).toHaveBeenCalledWith(mockPdfText);
      expect(saveAnalysisRecord).toHaveBeenCalledWith(mockReq.user.id, mockReq.file.filename, mockAnalysisResult);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Analisis PDF berhasil', data: mockAnalysisResult });
      expect(cleanupFile).toHaveBeenCalledWith(mockReq.file.path);
      expect(mockExit).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle invalid JSON response from Gemini', async () => {
      // ----- 👇 SAYA MENAMBAHKAN KODE INI UNTUK MEMBUNGKAM LOG -----
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      // -----------------------------------------------------------

      const mockPdfText = 'Extracted PDF text';
      const mockGeminiResponse = 'This is not JSON';
      const expectedFallbackResult = {
        patient_name: "Tidak ditemukan",
        diagnosis_summary: "Tidak dapat dianalisis (format tidak valid)",
        key_metrics: [],
        medications: [],
        recommendations: "Periksa ulang file PDF atau ulangi analisis.",
        food_recommendations: [],
      };

      extractTextFromPdf.mockResolvedValueOnce(mockPdfText);
      analyzeTextWithGemini.mockResolvedValueOnce(mockGeminiResponse);
      saveAnalysisRecord.mockResolvedValueOnce({});

      await this.analyzeRecord(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Analisis PDF berhasil', data: expectedFallbackResult });
      expect(cleanupFile).toHaveBeenCalledWith(mockReq.file.path);
      expect(mockExit).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();

      // ----- 👇 SAYA JUGA MENAMBAHKAN INI UNTUK MENGEMBALIKAN FUNGSI -----
      consoleErrorSpy.mockRestore();
      // ---------------------------------------------------------------
    });

    it('should call next with error if PDF extraction fails', async () => {
      const mockError = new Error('PDF error');
      extractTextFromPdf.mockRejectedValueOnce(mockError);

      await this.analyzeRecord(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(cleanupFile).toHaveBeenCalledWith(mockReq.file.path);
      expect(mockExit).not.toHaveBeenCalled();
    });

    it('should call next with error if Gemini analysis fails', async () => {
      const mockError = new Error('Gemini error');
      extractTextFromPdf.mockResolvedValueOnce('some text');
      analyzeTextWithGemini.mockRejectedValueOnce(mockError);

      await this.analyzeRecord(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(cleanupFile).toHaveBeenCalledWith(mockReq.file.path);
      expect(mockExit).not.toHaveBeenCalled();
    });

    it('should call next with 503 error for Gemini service busy error', async () => {
      const mockError = { status: 503, message: 'Service Unavailable' };
      extractTextFromPdf.mockResolvedValueOnce('some text');
      analyzeTextWithGemini.mockRejectedValueOnce(mockError);

      await this.analyzeRecord(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'Server AI sedang sibuk. Silakan coba lagi beberapa saat.', cause: { statusCode: 503 } }));
      expect(cleanupFile).toHaveBeenCalledWith(mockReq.file.path);
      expect(mockExit).not.toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('getRecordHistory', () => {
    it("should return 200 with user's record history", async () => {
      const mockHistory = [
        { id: 1, file_name: 'file1.pdf', analysis_summary: { patient_name: 'Jane Doe' }, created_at: new Date() },
      ];
      getAnalysisHistory.mockResolvedValueOnce(mockHistory);

      await this.getRecordHistory(mockReq, mockRes, mockNext);

      expect(getAnalysisHistory).toHaveBeenCalledWith(mockReq.user.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockHistory);
      expect(mockExit).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if fetching history fails', async () => {
      const mockError = new Error('DB error');
      getAnalysisHistory.mockRejectedValueOnce(mockError);

      await this.getRecordHistory(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockExit).not.toHaveBeenCalled();
    });
  });
});