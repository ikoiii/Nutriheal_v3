// server/controllers/authController.js

const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fungsi untuk Registrasi User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validasi input dasar
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan password harus diisi' });
    }

    // 2. Cek apakah email sudah terdaftar
    const [existingUser] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    // 3. Enkripsi password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Simpan user baru ke database
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    await pool.query(query, [name, email, hashedPassword]);

    res.status(201).json({ message: 'Registrasi berhasil!' });

  } catch (error) {
    console.error('Error saat registrasi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// Fungsi untuk Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validasi input dasar
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password harus diisi' });
    }

    // 2. Cari user berdasarkan email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }
    const user = users[0];

    // 3. Bandingkan password yang diinput dengan yang ada di database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // 4. Buat JSON Web Token (JWT)
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '1d', // Token berlaku selama 1 hari
    });

    res.status(200).json({
      message: 'Login berhasil!',
      token: token,
    });

  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};


module.exports = {
  registerUser,
  loginUser,
};