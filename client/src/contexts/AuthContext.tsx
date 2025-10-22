import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import axios from "axios";
import { authService } from "@/services/authService";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("token") ? true : false;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const { handleError } = useClientErrorHandler();

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setToken(response.token);
    } catch (error) {
      handleError(error);
      throw error; // Re-throw to allow components to handle specific logic if needed
    }
  }, [handleError]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await authService.signup(name, email, password);
      // After successful signup, automatically log in the user
      const loginResponse = await authService.login(email, password);
      setToken(loginResponse.token);
    } catch (error) {
      handleError(error);
      throw error; // Re-throw to allow components to handle specific logic if needed
    }
  }, [handleError]);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  useEffect(() => {
    apiClient.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        handleError(error); // Centralized error handling
        return Promise.reject(error); // Re-throw to propagate error
      }
    );
  }, [token, logout, handleError]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};