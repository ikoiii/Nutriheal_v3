// server/middleware/upload.js
const multer = require('multer');
const path = require('path');

// Tentukan lokasi penyimpanan
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Pastikan folder 'uploads/' sudah ada
  },
  filename: function (req, file, cb) {
    // Buat nama file yang unik untuk menghindari konflik
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter untuk hanya menerima file PDF
const fileFilter = (req, file, cb) => {
  // Hanya izinkan mimetype 'application/pdf'
  if (file.mimetype === 'application/pdf') {
    return cb(null, true);
  }
  cb(new Error('Hanya file PDF yang diizinkan!'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter, // Gunakan filter baru
  limits: {
    fileSize: 10 * 1024 * 1024 // Naikkan batas jadi 10MB (opsional)
  }
});

module.exports = upload;