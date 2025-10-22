import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// --- Axios Instance ---
export const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // Sesuaikan dengan URL server Anda
});

// --- Interfaces ---
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string; // Avatar is optional
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

// --- Auth Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Auth Provider Component ---
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for token in localStorage on initial load
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ id: decoded.id, name: decoded.name, email: decoded.email });
          // Set token for all subsequent requests
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          // Token is expired
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password });
    const { token } = response.data;

    localStorage.setItem("token", token);
    const decoded = jwtDecode<JwtPayload>(token);
    setUser({ id: decoded.id, name: decoded.name, email: decoded.email });

    // Set token for all subsequent requests
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const signup = async (name: string, email: string, password: string) => {
    await apiClient.post("/auth/register", { name, email, password });
    // Automatically log in the user after successful registration
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    delete apiClient.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// --- Custom Hook ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}