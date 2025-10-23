const { findUserByEmail, createUser, getUserById } = require('../repositories/authRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Custom Error Class for better error handling
class AuthError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

async function register(name, email, password) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AuthError('Email sudah terdaftar', 409); // 409 Conflict
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await createUser(name, email, hashedPassword);
  return { message: 'Registrasi berhasil!' };
}

async function login(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AuthError('Email atau password salah', 401); // 401 Unauthorized
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AuthError('Email atau password salah', 401); // 401 Unauthorized
  }

  const tokenPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  return { message: 'Login berhasil!', token: token };
}

async function getUserProfile(userId) {
  const user = await getUserById(userId);
  if (!user) {
    throw new AuthError('Pengguna tidak ditemukan.', 404);
  }
  // Exclude sensitive information like password
  const { password, ...userProfile } = user;
  return userProfile;
}

module.exports = {
  register,
  login,
  getUserProfile,
  AuthError, // Export AuthError so controllers can catch it specifically if needed
};