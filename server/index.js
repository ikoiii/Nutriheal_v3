require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/meals', recordRoutes);

testConnection();

app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di NutriHeal API!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});