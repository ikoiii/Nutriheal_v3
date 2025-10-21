// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
// HAPUS SEMUA IMPORT DARI 'recharts'

const DashboardPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/meals', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setHistory(response.data);
      } catch (err) {
        console.error("Gagal mengambil riwayat:", err);
        setError("Gagal memuat data riwayat Anda.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  if (loading) {
    return <div className="text-center text-lg">Memuat data dashboard...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Analisis</h1>

      {/* HAPUS SEMUA BAGIAN GRAFIK */}

      {/* Bagian Riwayat Analisis */}
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Riwayat Analisis PDF</h2>
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-gray-500">Anda belum menganalisis PDF apapun. Coba <a href="/upload" className="text-green-600 hover:underline">upload sekarang</a>.</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-green-700">{item.file_name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <p className="mt-2 text-gray-600">
                  <strong>Pasien:</strong> {item.analysis_summary.patient_name}
                </p>
                <p className="mt-1 text-gray-600">
                  <strong>Ringkasan:</strong> {item.analysis_summary.diagnosis_summary.substring(0, 150)}...
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;