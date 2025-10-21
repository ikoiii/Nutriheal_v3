import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('nutriheal-token'));
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('nutriheal-token', newToken);
    setToken(newToken);
    navigate('/dashboard'); 
  };

  const logout = () => {
    localStorage.removeItem('nutriheal-token');
    setToken(null);
    navigate('/login'); 
  };

  const value = {
    isLoggedIn,
    login,
    logout,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};