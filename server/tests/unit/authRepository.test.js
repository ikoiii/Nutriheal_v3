const { findUserByEmail, createUser } = require('../../repositories/authRepository');
const { pool } = require('../../config/db');

// Mock the pool.query function
jest.mock('../../config/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('authRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      pool.query.mockResolvedValueOnce([[mockUser]]);

      const user = await findUserByEmail('test@example.com');
      expect(user).toEqual(mockUser);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', ['test@example.com']);
    });

    it('should return undefined if user not found', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const user = await findUserByEmail('nonexistent@example.com');
      expect(user).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      pool.query.mockResolvedValueOnce([{ insertId: 1 }]);

      await createUser('Test User', 'test@example.com', 'hashedpassword');
      expect(pool.query).toHaveBeenCalledWith('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', ['Test User', 'test@example.com', 'hashedpassword']);
    });
  });
});
