require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const errorHandler = require('./middleware/errorHandler'); // Import the error handler

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);

testConnection();

app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di NutriHeal API!' });
});

// Error handling middleware - MUST be placed last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
