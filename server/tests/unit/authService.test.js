const { register, login, AuthError } = require('../../services/authService');
const authRepository = require('../../repositories/authRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../repositories/authRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('authService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      authRepository.findUserByEmail.mockResolvedValueOnce(undefined);
      bcrypt.genSalt.mockResolvedValueOnce('salt');
      bcrypt.hash.mockResolvedValueOnce('hashedPassword');
      authRepository.createUser.mockResolvedValueOnce({});

      const result = await register('Test User', 'test@example.com', 'password123');
      expect(authRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(authRepository.createUser).toHaveBeenCalledWith('Test User', 'test@example.com', 'hashedPassword');
      expect(result).toEqual({ message: 'Registrasi berhasil!' });
    });

    it('should throw AuthError if email is already registered', async () => {
      authRepository.findUserByEmail.mockResolvedValueOnce({ email: 'test@example.com' });

      await expect(register('Test User', 'test@example.com', 'password123')).rejects.toThrow(new AuthError('Email sudah terdaftar', 409));
      expect(authRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', password: 'hashedPassword' };

    it('should log in a user successfully and return a token', async () => {
      authRepository.findUserByEmail.mockResolvedValueOnce(mockUser);
      bcrypt.compare.mockResolvedValueOnce(true);
      jwt.sign.mockReturnValueOnce('mockToken');

      process.env.JWT_SECRET = 'test_secret'; // Mock JWT_SECRET

      const result = await login('test@example.com', 'password123');
      expect(authRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, name: mockUser.name, email: mockUser.email },
        'test_secret',
        { expiresIn: '1d' }
      );
      expect(result).toEqual({ message: 'Login berhasil!', token: 'mockToken' });
    });

    it('should throw AuthError if user not found', async () => {
      authRepository.findUserByEmail.mockResolvedValueOnce(undefined);

      await expect(login('nonexistent@example.com', 'password123')).rejects.toThrow(new AuthError('Email atau password salah', 401));
      expect(authRepository.findUserByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw AuthError if password does not match', async () => {
      authRepository.findUserByEmail.mockResolvedValueOnce(mockUser);
      bcrypt.compare.mockResolvedValueOnce(false);

      await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow(new AuthError('Email atau password salah', 401));
      expect(authRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});
