# NutriHeal v3

NutriHeal v3 adalah aplikasi web inovatif yang dirancang untuk membantu Anda memahami rekam medis dan menerima rekomendasi gizi yang dipersonalisasi. Dengan memanfaatkan kecerdasan buatan (AI), aplikasi ini mampu menganalisis dokumen PDF rekam medis, menyajikan ringkasan yang mudah dipahami, serta memberikan saran praktis untuk kesehatan Anda.

## Fitur Utama

-   **Analisis Rekam Medis Berbasis AI**: Unggah file PDF rekam medis Anda dan biarkan sistem AI menganalisisnya untuk mengekstrak data penting.
-   **Ringkasan Kesehatan**: Dapatkan ringkasan diagnosis, metrik medis utama (tekanan darah, kolesterol, dll.), dan daftar obat yang tercatat.
-   **Rekomendasi Gizi Personal**: Terima saran menu harian (sarapan, makan siang, makan malam, camilan) yang disesuaikan dengan kondisi medis Anda.
-   **Asisten Chat AI**: Ajukan pertanyaan seputar kesehatan dan dapatkan jawaban informatif berdasarkan data kesehatan terakhir Anda.
-   **Manajemen Tujuan**: Tetapkan dan lacak tujuan kesehatan pribadi Anda, seperti "minum 8 gelas air setiap hari".
-   **Check-in Harian**: Catat tingkat energi, stres, dan kualitas tidur Anda setiap hari untuk memantau kemajuan dan mendapatkan *streak* (rentetan) harian.
-   **Notifikasi Push**: Dapatkan pengingat dan wawasan proaktif langsung di perangkat Anda (jika diizinkan).
-   **Riwayat Analisis**: Lihat kembali semua riwayat analisis rekam medis Anda yang tersimpan dengan aman.

## Teknologi yang Digunakan

| Kategori      | Teknologi                                                                                             |
| :------------ | :---------------------------------------------------------------------------------------------------- |
| **Frontend**  | React, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, shadcn/ui, Recharts, Sonner      |
| **Backend**   | Node.js, Express.js, MySQL                                                                            |
| **AI & Data** | Google Generative AI (Gemini API), `pdfreader`                                                        |
| **Lainnya**   | JWT (Autentikasi), `bcrypt` (Hashing), `multer` (File Upload), `web-push` (Notifikasi), Jest (Testing) |

## Panduan Penggunaan

### 1. Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut di sistem Anda:
-   Node.js (v18 atau lebih baru)
-   npm (biasanya terinstal bersama Node.js)
-   Server Database MySQL

### 2. Instalasi

A. **Kloning Repositori**
   Buka terminal Anda dan jalankan perintah berikut untuk mengkloning proyek ke komputer lokal Anda.
   ```bash
   git clone https://github.com/your-username/Nutriheal_v2.git
   cd Nutriheal_v2
   ```
   *(Ganti `your-username` dengan nama pengguna GitHub Anda)*

B. **Setup Backend (Server)**
   Buka terminal baru, masuk ke direktori `server`, dan ikuti langkah-langkah ini.
   ```bash
   cd server
   npm install
   ```
   Selanjutnya, buat file `.env` di dalam direktori `server` dengan menyalin dari contoh di bawah.
   
   **Contoh `server/.env`:**
   ```env
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

   # Web Push Notifications (VAPID Keys)
   VAPID_PUBLIC_KEY=your_vapid_public_key
   VAPID_PRIVATE_KEY=your_vapid_private_key
   ```
   **Penting**: Ganti nilai placeholder (seperti `your_mysql_password`, `your_google_gemini_api_key`, dll.) dengan kredensial Anda yang sebenarnya. Anda dapat membuat kunci VAPID baru menggunakan berbagai library online.

C. **Setup Frontend (Client)**
   Buka terminal lain, masuk ke direktori `client`, dan jalankan perintah instalasi.
   ```bash
   cd client
   npm install
   ```
   File `.env` untuk client bersifat opsional, karena secara default ia akan mencoba terhubung ke server di `http://localhost:5000`.

### 3. Inisialisasi Database

Jalankan server MySQL Anda dan gunakan query SQL berikut untuk membuat database dan semua tabel yang diperlukan.

```sql
-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS nutriheal_db;

-- Gunakan database
USE nutriheal_db;

-- Tabel untuk pengguna
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INT,
    weight DECIMAL(5, 2),
    height DECIMAL(5, 2),
    daily_checkin_streak INT DEFAULT 0,
    last_checkin_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk riwayat analisis medis
CREATE TABLE IF NOT EXISTS medical_analyses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    file_name VARCHAR(255) NOT NULL,
    analysis_summary JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel untuk log harian
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

-- Tabel untuk tujuan pengguna
CREATE TABLE IF NOT EXISTS user_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    goal_description VARCHAR(255) NOT NULL,
    status ENUM('active', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel untuk progres tujuan
CREATE TABLE IF NOT EXISTS goal_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    goal_id INT,
    progress_date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (goal_id) REFERENCES user_goals(id) ON DELETE CASCADE
);

-- Tabel untuk langganan notifikasi push
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

### 4. Menjalankan Aplikasi

Anda perlu menjalankan server backend dan client frontend secara bersamaan di dua terminal terpisah.

A. **Jalankan Backend**
   Di dalam direktori `server/`:
   ```bash
   npm run dev
   ```
   Server akan berjalan di `http://localhost:5000`.

B. **Jalankan Frontend**
   Di dalam direktori `client/`:
   ```bash
   npm run dev
   ```
   Aplikasi React akan berjalan dan dapat diakses di `http://localhost:5173` (atau port lain yang ditampilkan di terminal).

### 5. Menjalankan Tes (Opsional)

Untuk memastikan semua fungsi backend berjalan dengan baik, jalankan unit tests.
Di dalam direktori `server/`:
```bash
npm test
```
