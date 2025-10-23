require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const dailyLogRoutes = require('./routes/dailyLogRoutes');
const userGoalRoutes = require('./routes/userGoalRoutes');
const ragChatRoutes = require('./routes/ragChatRoutes');
const insightRoutes = require('./routes/insightRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const startNotificationScheduler = require('./scheduler/notificationScheduler');
const errorHandler = require('./middleware/errorHandler'); // Import the error handler

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/daily-logs', dailyLogRoutes);
app.use('/api/goals', userGoalRoutes);
app.use('/api/chat', ragChatRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/notifications', notificationRoutes);

testConnection();
startNotificationScheduler(); // Start the scheduler

app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di NutriHeal API!' });
});

// Error handling middleware - MUST be placed last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
