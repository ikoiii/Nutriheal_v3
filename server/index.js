// server/index.js

// Import modul
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');

// Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 5000;

// --- URUTAN MIDDLEWARE YANG BENAR ---

// 1. CORS HARUS SELALU DI PALING ATAS
// Ini memastikan SEMUA respons (API dan file) mendapatkan header izin yang benar.
app.use(cors());

// 2. Body Parser (untuk membaca JSON dari request)
app.use(express.json());

// 3. Static File Server (untuk menyajikan gambar dari folder 'uploads')
// Ini harus sebelum rute API jika ada kemungkinan konflik path di masa depan.
app.use('/uploads', express.static('uploads'));

// 4. Rute API
app.use('/api/auth', authRoutes);
app.use('/api/meals', recordRoutes);

// --- AKHIR DARI URUTAN PENTING ---


// Tes koneksi database saat server dimulai
testConnection();

// Rute dasar untuk mengecek apakah server hidup
app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di NutriHeal API!' });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});