# Nutriheal v2

## Deskripsi Proyek

Nutriheal v2 adalah aplikasi web inovatif yang dirancang untuk membantu pengguna memahami rekam medis mereka dengan lebih baik dan menerima rekomendasi gizi yang dipersonalisasi. Dengan memanfaatkan kecerdasan buatan Google Gemini, aplikasi ini mampu mengekstrak informasi kunci dari dokumen PDF rekam medis, menganalisisnya, dan menyajikan ringkasan yang mudah dipahami, serta saran makanan yang disesuaikan dengan kondisi kesehatan pengguna.

## Fitur Utama

-   **Analisis Rekam Medis Berbasis AI**: Unggah file PDF rekam medis Anda dan biarkan Gemini AI menganalisisnya untuk mengekstrak data penting.
-   **Ringkasan Diagnosis & Metrik Kunci**: Dapatkan ringkasan diagnosis, identitas pasien, metrik medis utama (seperti tekanan darah, kolesterol, gula darah), dan daftar obat yang tercatat.
-   **Rekomendasi Gizi Personal**: Terima saran makanan yang disesuaikan untuk sarapan, makan siang, makan malam, dan camilan, berdasarkan kondisi medis yang terdeteksi.
-   **Rekomendasi Umum**: Dapatkan saran kesehatan umum yang relevan dengan hasil analisis Anda.
-   **Riwayat Analisis**: Lihat kembali riwayat analisis rekam medis Anda yang tersimpan.
-   **Autentikasi Pengguna**: Sistem login dan pendaftaran untuk mengelola data pengguna dengan aman.
-   **Antarmuka Pengguna Intuitif**: Desain responsif dan mudah digunakan yang dibangun dengan React dan shadcn/ui.

## Teknologi yang Digunakan

### Frontend

-   **React**: Pustaka JavaScript untuk membangun antarmuka pengguna.
-   **TypeScript**: Superset JavaScript yang menambahkan pengetikan statis.
-   **React Router DOM**: Untuk navigasi deklaratif di aplikasi React.
-   **React Query (TanStack Query)**: Untuk manajemen data, caching, dan sinkronisasi data server-side.
-   **shadcn/ui**: Komponen UI yang dapat disesuaikan dan mudah diakses, dibangun di atas Tailwind CSS dan Radix UI.
-   **Tailwind CSS**: Kerangka kerja CSS utility-first untuk styling yang cepat.

### Backend

-   **Node.js**: Lingkungan runtime JavaScript.
-   **Express.js**: Kerangka kerja aplikasi web untuk Node.js.
-   **Google Generative AI (Gemini API)**: Untuk pemrosesan bahasa alami dan analisis teks dari rekam medis.
-   **PDFReader**: Pustaka untuk mengekstrak teks dari file PDF.
-   **MySQL**: Sistem manajemen basis data relasional untuk menyimpan data pengguna dan riwayat analisis.
-   **`fs` module**: Untuk operasi sistem file (misalnya, menghapus file PDF setelah diproses).
-   **`express-validator`**: Middleware untuk validasi input.
-   **`Jest`**: Framework pengujian JavaScript.

## Struktur Proyek

Proyek ini dibagi menjadi dua bagian utama, `client` (frontend) dan `server` (backend), dengan struktur modular untuk memisahkan kekhawatiran:

### `server/`
-   `config/`: Konfigurasi database.
-   `controllers/`: Logika penanganan permintaan HTTP, berinteraksi dengan layanan.
-   `middleware/`: Middleware Express untuk autentikasi, validasi, dan penanganan kesalahan.
-   `repositories/`: Abstraksi untuk interaksi database.
-   `routes/`: Definisi rute API.
-   `services/`: Logika bisnis inti, berinteraksi dengan repositori dan utilitas eksternal (misalnya, Gemini AI).
-   `tests/`: Unit tests untuk backend.
-   `utils/`: Fungsi utilitas umum (misalnya, ekstraksi PDF).

### `client/src/`
-   `components/`: Komponen UI yang dapat digunakan kembali, termasuk komponen landing page yang lebih kecil.
-   `contexts/`: Konteks React untuk manajemen state global (misalnya, autentikasi).
-   `hooks/`: Custom React Hooks untuk logika stateful yang dapat digunakan kembali (misalnya, form handling, data fetching).
-   `lib/`: Fungsi utilitas frontend.
-   `pages/`: Komponen halaman utama aplikasi.
-   `services/`: Logika untuk interaksi API dari sisi klien.

## Instalasi dan Setup

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

### Prasyarat

-   Node.js (v18 atau lebih baru)
-   npm atau Yarn
-   MySQL Server

### Langkah-langkah

1.  **Kloning Repositori:**
    ```bash
    git clone https://github.com/your-username/Nutriheal_v2.git
    cd Nutriheal_v2
    ```

2.  **Setup Backend (Server):**
    ```bash
    cd server
    npm install # atau yarn install
    ```
    Buat file `.env` di direktori `server` dan tambahkan variabel lingkungan berikut:
    ```env
    PORT=5000
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=nutriheal_db
    GEMINI_API_KEY=your_google_gemini_api_key
    JWT_SECRET=your_jwt_secret_key
    ```
    **Catatan**: Ganti `your_mysql_user`, `your_mysql_password`, `nutriheal_db`, `your_google_gemini_api_key`, dan `your_jwt_secret_key` dengan kredensial Anda.

    **Inisialisasi Database MySQL:**
    Buat database `nutriheal_db` di MySQL Anda. Struktur tabel `medical_analyses` dan `users` akan dibuat secara otomatis atau Anda perlu membuatnya secara manual jika tidak ada skrip migrasi. Contoh skema untuk `medical_analyses`:
    ```sql
    CREATE TABLE medical_analyses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        file_name VARCHAR(255) NOT NULL,
        analysis_summary JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    -- Dan tabel users jika belum ada
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

    Jalankan server:
    ```bash
    npm start # atau node server.js
    ```

    Jalankan tes (opsional):
    ```bash
    npm test
    ```
    **Catatan**: Unit tests telah ditambahkan untuk `authRepository`, `authService`, `analysisRepository`, `pdfUtils`, `geminiService`, dan `recordController` untuk memastikan keandalan backend.

3.  **Setup Frontend (Client):**
    ```bash
    cd ../client
    npm install # atau yarn install
    ```
    Buat file `.env` di direktori `client` dan tambahkan variabel lingkungan berikut:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
    Jalankan aplikasi frontend:
    ```bash
    npm run dev # atau yarn dev
    ```

4.  **Akses Aplikasi:**
    Buka browser Anda dan navigasikan ke `http://localhost:5173` (atau port yang digunakan oleh Vite).

## Penggunaan

1.  **Daftar/Login**: Buat akun baru atau masuk menggunakan kredensial Anda.
2.  **Unggah PDF**: Navigasikan ke halaman unggah dan pilih file PDF rekam medis Anda.
3.  **Lihat Hasil**: Setelah analisis selesai, Anda akan diarahkan ke halaman hasil yang menampilkan ringkasan diagnosis, metrik kunci, rekomendasi obat, dan saran gizi.
4.  **Riwayat**: Anda dapat melihat semua analisis sebelumnya di halaman riwayat.

## Kontribusi

Kami menyambut kontribusi! Jika Anda ingin berkontribusi pada proyek ini, silakan fork repositori, buat branch baru, lakukan perubahan Anda, dan kirimkan pull request.

**Catatan**: Pastikan untuk mengganti placeholder seperti `your-username` dan detail kredensial lainnya dengan informasi yang benar.