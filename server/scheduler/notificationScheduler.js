const cron = require('node-cron');

const startNotificationScheduler = () => {
  // Job 1: Pengingat Harian Sederhana (setiap hari pukul 8 malam)
  cron.schedule('0 20 * * *', () => {
    console.log('Memicu pengingat log harian...');
    // Logika untuk mengirim notifikasi pengingat harian akan ditambahkan di sini
  }, {
    scheduled: true,
    timezone: "Asia/Jakarta" // Sesuaikan dengan zona waktu yang relevan
  });

  // Job 2: Wawasan Proaktif (setiap hari pukul 10 pagi)
  cron.schedule('0 10 * * *', () => {
    console.log('Memicu analisis wawasan proaktif...');
    // Logika untuk analisis AI dan pengiriman notifikasi proaktif akan ditambahkan di sini
  }, {
    scheduled: true,
    timezone: "Asia/Jakarta" // Sesuaikan dengan zona waktu yang relevan
  });

  console.log('Notification scheduler started.');
};

module.exports = startNotificationScheduler;
