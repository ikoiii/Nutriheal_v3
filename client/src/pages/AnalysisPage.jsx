// src/pages/AnalysisPage.jsx
import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const AnalysisPage = () => {
  const location = useLocation();
  
  // Jika halaman diakses tanpa data, kembalikan ke upload
  if (!location.state || !location.state.result) {
    return <Navigate to="/upload" replace />;
  }

  const { result } = location.state;
  const { 
    patient_name, 
    diagnosis_summary, 
    key_metrics, 
    medications, 
    recommendations 
  } = result;

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg space-y-6">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        Hasil Analisis Rekam Medis
      </h1>

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
          {key_metrics.map((item, index) => (
            <li key={index} className="text-lg text-gray-700">
              <strong>{item.metric}:</strong> {item.value}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">Obat-obatan:</h2>
        <ul className="list-disc list-inside space-y-2 mt-2">
          {medications.map((item, index) => (
            <li key={index} className="text-lg text-gray-700">
              <strong>{item.name}:</strong> {item.dosage}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">Rekomendasi:</h2>
        <p className="text-lg text-gray-700 mt-1 whitespace-pre-wrap">{recommendations}</p>
      </div>
      
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