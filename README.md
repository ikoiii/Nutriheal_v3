# 🌿 NutriHeal v3 — Analisis Rekam Medis & Rekomendasi Gizi Berbasis AI

NutriHeal v3 adalah aplikasi web modern yang membantu Anda **memahami rekam medis dengan lebih cerdas** dan **mendapatkan rekomendasi gizi yang dipersonalisasi**.  
Dengan dukungan **kecerdasan buatan (AI)**, aplikasi ini mampu membaca file PDF rekam medis Anda, mengekstrak data penting, serta memberikan **saran pola makan yang sesuai dengan kondisi kesehatan** Anda.

## 🌐 Live Demo
https://nutriheal-v3.vercel.app/

---

## 🧠 Fitur Unggulan

| Fitur | Deskripsi |
| :---- | :--------- |
| 🩺 **Analisis Rekam Medis Berbasis AI** | Unggah file PDF rekam medis Anda, dan sistem AI akan mengekstrak informasi penting seperti diagnosis, obat, dan hasil lab. |
| 📊 **Ringkasan Kesehatan Otomatis** | Dapatkan tampilan ringkas mengenai tekanan darah, kadar kolesterol, berat badan, dan metrik penting lainnya. |
| 🥗 **Rekomendasi Gizi Personal** | AI memberikan saran menu harian (sarapan, makan siang, makan malam, dan camilan) sesuai dengan kebutuhan tubuh Anda. |
| 💬 **Asisten Chat AI** | Ajukan pertanyaan seputar kesehatan dan gizi berdasarkan data terakhir Anda. |
| 🎯 **Manajemen Tujuan Sehat** | Tetapkan target pribadi seperti *“minum 8 gelas air per hari”* dan pantau progres Anda setiap hari. |
| 📅 **Check-in Harian & Streaks** | Catat energi, stres, dan kualitas tidur Anda. Dapatkan *reward streak* untuk konsistensi. |
| 🔔 **Notifikasi Push** | Terima pengingat dan insight langsung ke perangkat Anda. |
| 🗂 **Riwayat Analisis Aman** | Semua rekam medis tersimpan dengan aman dan dapat diakses kembali kapan pun. |

---

## ⚙️ Teknologi yang Digunakan

| Kategori | Teknologi |
| :-------- | :--------- |
| **Frontend** | React, **TypeScript**, Vite, React Router, TanStack Query, Tailwind CSS, shadcn/ui, Recharts, Sonner |
| **Backend** | Node.js, **Express.js**, MySQL |
| **AI & Data** | Google Generative AI (Gemini API), `pdfreader` |
| **Security & Utility** | JWT (Autentikasi), `bcrypt` (Hashing), `multer` (File Upload), `web-push` (Notifikasi), Jest (Testing) |
| **Tools & Environment** | Visual Studio Code, XAMPP, MySQL Workbench, Git, Postman, CLI Gemini, Gemini PRO |

---

## 👨‍💻 Tentang Pengembang

> **Angger Bayu Sentiko**  
> Mahasiswa **Teknik Informatika – Universitas Pamulang**  
> Seorang **Fullstack Developer** atau bisa juga disebut dengan **vibe coder** dengan ketertarikan pada pengembangan aplikasi AI dan kesehatan digital.  
> Menguasai stack modern seperti React, TypeScript, Tailwind, Node.js, dan Express dengan menggunakan tools AI secara keseluruhan

---

## 🚀 Panduan Instalasi & Setup

### 1️⃣ Prasyarat

Pastikan perangkat Anda telah menginstal:

- Node.js **v18+**
- npm (terpasang otomatis bersama Node.js)
- MySQL Server (bisa dari XAMPP)
- Visual Studio Code

---

### 2️⃣ Kloning Repositori

```bash
git clone https://github.com/your-username/NutriHeal_v3.git
cd NutriHeal_v3
```
💡 Ganti your-username dengan nama akun GitHub Anda.

### 3️⃣ Setup Backend (Server)
Masuk ke direktori server:
```bash
cd server
npm install
```
Buat file .env di dalam direktori server/ seperti contoh berikut:
```bash
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nutriheal_db

# Security
JWT_SECRET=kunci_rahasia_super_aman_dan_panjang

# Gemini AI API Key
GEMINI_API_KEY=your_google_gemini_api_key

# Web Push Notifications
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```
⚠️ Jangan pernah upload file .env ke GitHub publik! ⚠️

### 4️⃣ Setup Frontend (Client)

Masuk ke direktori client:
```bash
cd client
npm install
npm run dev
```
Frontend akan berjalan di:
👉 http://localhost:5173

### 5️⃣ Inisialisasi Database

Jalankan perintah SQL berikut di MySQL Workbench / phpMyAdmin:

```bash
CREATE DATABASE IF NOT EXISTS nutriheal_db;
USE nutriheal_db;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INT,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    daily_checkin_streak INT DEFAULT 0,
    last_checkin_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical Analyses
CREATE TABLE IF NOT EXISTS medical_analyses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    file_name VARCHAR(255) NOT NULL,
    analysis_summary JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Daily Logs
CREATE TABLE IF NOT EXISTS daily_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    log_date DATE NOT NULL,
    energy_level INT NOT NULL,
    stress_level INT NOT NULL,
    sleep_quality INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, log_date)
);

-- User Goals
CREATE TABLE IF NOT EXISTS user_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    goal_description VARCHAR(255) NOT NULL,
    status ENUM('active','completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Goal Progress
CREATE TABLE IF NOT EXISTS goal_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    goal_id INT,
    progress_date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (goal_id) REFERENCES user_goals(id) ON DELETE CASCADE
);

-- Push Notifications
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    endpoint TEXT NOT NULL,
    p256dh_key VARCHAR(255) NOT NULL,
    auth_key VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```
### 6️⃣ Menjalankan Server
Backend
```bash
cd server
node server.js
```
Server berjalan di 👉 http://localhost:5000

Frontend

```bash
cd server
npm run dev
```
Akses aplikasi di 👉 http://localhost:5173

### 7️⃣ Testing (Opsional)

Gunakan Jest untuk menguji endpoint backend:
```bash
cd server
npm test
```

🧩 Struktur Direktori Proyek

```bash
NutriHeal_v3/
├── client/              # Frontend (React + TypeScript + Tailwind)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/              # Backend (Node.js + Express.js + MySQL)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── package.json
│
├── database/
│   └── init.sql         # Skrip pembuatan tabel
│
└── README.md
```
🎓 Tentang Proyek

NutriHeal dikembangkan sebagai proyek teknologi kesehatan cerdas yang memanfaatkan AI untuk meningkatkan kesadaran gizi dan kesehatan masyarakat.
Dibuat oleh Angger Bayu Sentiko, mahasiswa Teknik Informatika – Universitas Pamulang.

## 🤝 Kontribusi

Kontribusi selalu terbuka untuk siapa pun!
Silakan fork repository ini, buat branch baru, lalu kirim pull request Anda.

```bash
git checkout -b fitur-baru
git commit -m "Menambahkan fitur baru"
git push origin fitur-baru
```
## ⚖️ License

This project is licensed under the MIT License 
