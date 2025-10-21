// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to={isLoggedIn ? "/dashboard" : "/"} className="text-2xl font-bold text-green-600">
          NutriHeal {/* Anda bisa ganti nama ini juga jika mau */}
        </Link>

        {/* Link Navigasi */}
        <div className="flex space-x-4 items-center">
          {isLoggedIn ? (
            // JIKA SUDAH LOGIN
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-green-600 transition"
              >
                Dashboard
              </Link>
              {/* === PERUBAHAN DI SINI === */}
              <Link
                to="/upload"
                className="text-gray-700 hover:text-green-600 transition"
              >
                Upload File {/* <-- Ubah teks ini */}
              </Link>
              {/* ========================== */}
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            // JIKA BELUM LOGIN
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-green-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;