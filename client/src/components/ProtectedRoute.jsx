// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('nutriheal-token');

  // Jika ada token, tampilkan halaman yang diminta (Outlet)
  // Jika tidak, arahkan ke halaman login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;