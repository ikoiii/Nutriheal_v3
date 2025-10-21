const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  
  if (file.mimetype === 'application/pdf') {
    return cb(null, true);
  }
  cb(new Error('Hanya file PDF yang diizinkan!'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter, 
  limits: {
    fileSize: 10 * 1024 * 1024 
  }
});

module.exports = upload;