// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
  // State untuk menyimpan data form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // State untuk pesan error
  const [error, setError] = useState(null);

  // Hook untuk navigasi setelah berhasil mendaftar
  const navigate = useNavigate();

  // Fungsi untuk meng-handle perubahan input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fungsi untuk meng-handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setError(null); // Bersihkan error sebelumnya

    try {
      // Kirim data ke backend
      await axios.post('http://localhost:5000/api/auth/register', formData);

      // Jika berhasil:
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login'); // Arahkan ke halaman login

    } catch (err) {
      // Jika gagal:
      console.error('Error saat registrasi:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Buat Akun Baru
        </h1>

        {/* Form Pendaftaran */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Nama */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700"
            >
              Nama Lengkap
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Input Email */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              Alamat Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Input Password */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Tampilkan pesan error jika ada */}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          {/* Tombol Submit */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Daftar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;