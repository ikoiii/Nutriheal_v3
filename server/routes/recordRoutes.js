const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { analyzeRecord, getRecordHistory } = require("../controllers/recordController");
const { protect } = require("../middleware/authMiddleware"); // Asumsi Anda punya middleware ini

// Konfigurasi Multer untuk menangani upload file
// Menyimpan file di folder 'uploads/' dengan nama file asli
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Definisikan rute
router.post("/analyze", protect, upload.single("pdfFile"), analyzeRecord);
router.get("/history", protect, getRecordHistory);

module.exports = router;