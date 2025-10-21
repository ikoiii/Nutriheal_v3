import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const AnalysisPage = () => {
  const location = useLocation();
  
  // Jika halaman diakses tanpa data, kembalikan ke upload
  if (!location.state || !location.state.result) {
    return <Navigate to="/upload" replace />;
  }

  const { result } = location.state;
  // Menambahkan nilai default yang aman untuk semua properti
  const { 
    patient_name = "N/A", 
    diagnosis_summary = "Tidak ada ringkasan.", 
    key_metrics = [], 
    medications = [], 
    recommendations = "Tidak ada rekomendasi.",
    food_recommendations = [] // <-- 1. Ambil data baru dengan nilai default
  } = result;

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg space-y-6">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        Hasil Analisis Rekam Medis
      </h1>

      {/* --- Bagian Data Pasien (Tetap Sama) --- */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">Nama Pasien:</h2>
        <p className="text-lg text-gray-700 mt-1">{patient_name}</p>
      </div>
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">Ringkasan Diagnosis:</h2>
        <p className="text-lg text-gray-700 mt-1 whitespace-pre-wrap">{diagnosis_summary}</p>
      </div>
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">Metrik Kunci:</h2>
        <ul className="list-disc list-inside space-y-2 mt-2">
          {key_metrics?.map((item, index) => (
            <li key={index} className="text-lg text-gray-700">
              <strong>{item.metric}:</strong> {item.value}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">Obat-obatan:</h2>
        <ul className="list-disc list-inside space-y-2 mt-2">
          {medications?.map((item, index) => (
            <li key={index} className="text-lg text-gray-700">
              <strong>{item.name}:</strong> {item.dosage}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">Rekomendasi Umum:</h2>
        <p className="text-lg text-gray-700 mt-1 whitespace-pre-wrap">{recommendations}</p>
      </div>
      
      {/* --- 2. BAGIAN BARU: REKOMENDASI MAKANAN --- */}
      {food_recommendations?.length > 0 && (
        <div className="p-4 border rounded-lg bg-green-50">
          <h2 className="text-xl font-semibold text-green-800">Rekomendasi Makanan:</h2>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {food_recommendations.map((meal, index) => (
              <div key={index}>
                <h3 className="font-bold text-lg text-green-700">{meal.category}</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {meal.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ------------------------------------------- */}
      
      <div className="text-center mt-8">
        <Link 
          to="/upload" 
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Analisis PDF Lain
        </Link>
      </div>
    </div>
  );
};

export default AnalysisPage;

