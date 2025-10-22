const { extractTextFromPdf, cleanupFile } = require('../../utils/pdfUtils');
const fs = require('fs');
const { PdfReader } = require('pdfreader');

jest.mock('fs');
jest.mock('pdfreader');

describe('pdfUtils', () => {
  const mockFilePath = '/tmp/test.pdf';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('extractTextFromPdf', () => {
    it('should extract text from a PDF file', async () => {
      const mockText = 'Ini adalah teks dari PDF.';
      
      // Mock PdfReader to emit text items
      PdfReader.mockImplementation(() => ({
        parseFileItems: jest.fn((filePath, callback) => {
          callback(null, { text: 'Ini' });
          callback(null, { text: 'adalah' });
          callback(null, { text: 'teks' });
          callback(null, { text: 'dari' });
          callback(null, { text: 'PDF.' });
          callback(null, null); // End of items
        }),
      }));

      const extractedText = await extractTextFromPdf(mockFilePath);
      expect(extractedText.trim()).toBe(mockText);
    });

    it('should reject if PdfReader encounters an error', async () => {
      const mockError = new Error('PDF parsing error');

      PdfReader.mockImplementation(() => ({
        parseFileItems: jest.fn((filePath, callback) => {
          callback(mockError); // Simulate an error
        }),
      }));

      await expect(extractTextFromPdf(mockFilePath)).rejects.toThrow(mockError);
    });

    it('should return empty string if no text is extracted', async () => {
      PdfReader.mockImplementation(() => ({
        parseFileItems: jest.fn((filePath, callback) => {
          callback(null, null); // End of items with no text
        }),
      }));

      const extractedText = await extractTextFromPdf(mockFilePath);
      expect(extractedText.trim()).toBe('');
    });
  });

  describe('cleanupFile', () => {
    it('should delete the file if it exists', () => {
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockImplementation(() => {});

      cleanupFile(mockFilePath);
      expect(fs.existsSync).toHaveBeenCalledWith(mockFilePath);
      expect(fs.unlinkSync).toHaveBeenCalledWith(mockFilePath);
    });

    it('should not attempt to delete if file does not exist', () => {
      fs.existsSync.mockReturnValue(false);
      fs.unlinkSync.mockImplementation(() => {});

      cleanupFile(mockFilePath);
      expect(fs.existsSync).toHaveBeenCalledWith(mockFilePath);
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });
  });
});
