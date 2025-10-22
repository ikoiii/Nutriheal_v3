// Set GEMINI_API_KEY before requiring geminiService to prevent process.exit
process.env.GEMINI_API_KEY = 'test-key';

const { analyzeTextWithGemini } = require('../../services/geminiService');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Use jest.hoisted to define mocks before they are accessed
const { mockGetGenerativeModel, mockGenerateContent } = jest.hoisted(() => ({
  mockGetGenerativeModel: jest.fn(),
  mockGenerateContent: jest.fn(),
}));

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: mockGetGenerativeModel,
  })),
}));

// Mock process.exit globally for this test file
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

describe('geminiService', () => {
  const mockGeminiApiKey = 'test-api-key';
  let originalGeminiApiKey;

  beforeAll(() => {
    originalGeminiApiKey = process.env.GEMINI_API_KEY;
  });

  beforeEach(() => {
    mockGenerateContent.mockClear();
    mockGetGenerativeModel.mockClear();
    mockGetGenerativeModel.mockImplementation((options) => {
      if (options.model === 'gemini-2.5-flash') {
        if (process.env.TEST_GEMINI_MODEL_FAIL_FLASH) {
          throw new Error('Mock gemini-2.5-flash failed');
        }
      }
      return {
        generateContent: mockGenerateContent,
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.TEST_GEMINI_MODEL_FAIL_FLASH;
    mockExit.mockClear(); // Clear mockExit calls
  });

  afterAll(() => {
    process.env.GEMINI_API_KEY = originalGeminiApiKey;
    mockExit.mockRestore(); // Restore original process.exit
  });

  it('should analyze text with gemini-2.5-flash successfully', async () => {
    mockGenerateContent.mockResolvedValueOnce({ response: { text: () => 'mocked AI response' } });

    const result = await analyzeTextWithGemini('test pdf text');
    expect(result).toBe('mocked AI response');
    expect(GoogleGenerativeAI).toHaveBeenCalledWith(mockGeminiApiKey);
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-2.5-flash' });
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('should fallback to gemini-pro if gemini-2.5-flash fails', async () => {
    process.env.TEST_GEMINI_MODEL_FAIL_FLASH = 'true';

    mockGenerateContent.mockResolvedValueOnce({ response: { text: () => 'mocked gemini-pro response' } });

    const result = await analyzeTextWithGemini('test pdf text');
    expect(result).toBe('mocked gemini-pro response');
    expect(GoogleGenerativeAI).toHaveBeenCalledWith(mockGeminiApiKey);
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-2.5-flash' });
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-pro' });
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('should retry on 503 error with exponential backoff', async () => {
    mockGenerateContent
      .mockRejectedValueOnce({ status: 503, message: 'Service Unavailable' })
      .mockRejectedValueOnce({ status: 503, message: 'Service Unavailable' })
      .mockResolvedValueOnce({ response: { text: () => 'successful retry' } });
    
    jest.useFakeTimers();

    const promise = analyzeTextWithGemini('test text');

    jest.advanceTimersByTime(1000);
    jest.advanceTimersByTime(2000);
    jest.advanceTimersByTime(4000);

    const result = await promise;

    expect(mockGenerateContent).toHaveBeenCalledTimes(3);
    expect(result).toBe('successful retry');
    expect(mockExit).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('should throw error after max retries', async () => {
    mockGenerateContent.mockRejectedValue({ status: 503, message: 'Service Unavailable' });
    
    jest.useFakeTimers();

    const promise = analyzeTextWithGemini('test text');

    jest.advanceTimersByTime(1000);
    jest.advanceTimersByTime(2000);
    jest.advanceTimersByTime(4000);
    jest.advanceTimersByTime(8000);

    await expect(promise).rejects.toThrow('Service Unavailable');
    expect(mockGenerateContent).toHaveBeenCalledTimes(4);
    expect(mockExit).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('should throw non-retryable error immediately', async () => {
    mockGenerateContent.mockRejectedValueOnce({ status: 400, message: 'Bad Request' });

    await expect(analyzeTextWithGemini('test text')).rejects.toThrow('Bad Request');
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockExit).not.toHaveBeenCalled();
  });
});
