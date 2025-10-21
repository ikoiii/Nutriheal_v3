import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('nutriheal-token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;