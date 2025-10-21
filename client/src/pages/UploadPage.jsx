// src/pages/UploadPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth(); // Ambil token dari context
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Silakan pilih file PDF terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('pdfFile', file); 

    try {
      if (!token) {
        setError('Anda harus login untuk mengupload.');
        setLoading(false);
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/meals/analyze', // Endpoint tetap sama
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Kirim data hasil analisis ke halaman berikutnya
      navigate('/analysis', { state: { result: response.data.data } });

    } catch (err) {
      console.error('Error saat upload:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Upload PDF gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 space-y-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-900">
        Analisis Rekam Medis
      </h1>
      <p className="text-center text-gray-600">
        Upload file PDF rekam medis Anda untuk mendapatkan ringkasan.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
            Pilih File PDF
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            accept="application/pdf" // <-- HANYA MENERIMA PDF
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100"
          />
        </div>

        {/* Tampilkan pesan error jika ada */}
        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                      ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
          >
            {loading ? 'Menganalisis...' : 'Analisis Sekarang'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;