// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('nutriheal-token'));
  const navigate = useNavigate();

  // Cek status login saat aplikasi dimuat
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    // Perbarui status jika token berubah
    setIsLoggedIn(!!token);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('nutriheal-token', newToken);
    setToken(newToken);
    navigate('/dashboard'); // Arahkan ke dashboard setelah login
  };

  const logout = () => {
    localStorage.removeItem('nutriheal-token');
    setToken(null);
    navigate('/login'); // Arahkan ke login setelah logout
  };

  // Nilai yang akan dibagikan ke semua komponen
  const value = {
    isLoggedIn,
    login,
    logout,
    token, // Kita sertakan token untuk kemudahan pemanggilan API
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook kustom untuk memudahkan penggunaan context
export const useAuth = () => {
  return useContext(AuthContext);
};