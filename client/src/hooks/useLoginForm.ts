import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth(); // Get isAuthenticated from AuthContext

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login berhasil! Memverifikasi status...");
      // Navigation will now be handled by the useEffect below
    } catch (err) {
      console.error("Login failed in useLoginForm:", err);
    } finally {
      setLoading(false);
    }
  }, [email, password, login]);

  // Effect to navigate after successful authentication
  useEffect(() => {
    if (isAuthenticated && !loading) {
      toast.success("Status terverifikasi! Mengalihkan ke halaman upload...");
      navigate("/upload");
    }
  }, [isAuthenticated, loading, navigate]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
  };
}