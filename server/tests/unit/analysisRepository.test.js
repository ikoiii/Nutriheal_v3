const { saveAnalysisRecord, getAnalysisHistory } = require('../../repositories/analysisRepository');
const { pool } = require('../../config/db');

jest.mock('../../config/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('analysisRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveAnalysisRecord', () => {
    it('should save an analysis record successfully', async () => {
      pool.query.mockResolvedValueOnce([{}]);

      const userId = 1;
      const fileName = 'test.pdf';
      const analysisResult = { patient_name: 'John Doe' };

      await saveAnalysisRecord(userId, fileName, analysisResult);

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO medical_analyses (user_id, file_name, analysis_summary) VALUES (?, ?, ?)',
        [userId, fileName, JSON.stringify(analysisResult)]
      );
    });
  });

  describe('getAnalysisHistory', () => {
    it('should return a list of analysis history for a user', async () => {
      const mockHistory = [
        { id: 1, file_name: 'file1.pdf', analysis_summary: JSON.stringify({ patient_name: 'Jane Doe' }), created_at: new Date() },
        { id: 2, file_name: 'file2.pdf', analysis_summary: JSON.stringify({ patient_name: 'John Smith' }), created_at: new Date() },
      ];
      pool.query.mockResolvedValueOnce([mockHistory]);

      const userId = 1;
      const history = await getAnalysisHistory(userId);

      expect(history).toEqual(mockHistory.map(item => ({
        ...item,
        analysis_summary: JSON.parse(item.analysis_summary),
      })));
      // Use a regex to match the SQL query, ignoring whitespace and newlines
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT\s+id,\s+file_name,\s+analysis_summary,\s+created_at\s+FROM\s+medical_analyses\s+WHERE\s+user_id\s+=\s+\?\s+ORDER\s+BY\s+created_at\s+DESC\s+LIMIT\s+10/),
        [userId]
      );
    });

    it('should return an empty array if no history is found', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const userId = 99;
      const history = await getAnalysisHistory(userId);

      expect(history).toEqual([]);
    });
  });
});
