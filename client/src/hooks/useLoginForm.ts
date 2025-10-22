import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner"; // Keep toast for success messages

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login berhasil! Mengalihkan ke halaman upload...");
      navigate("/upload");
    } catch (err) {
      // Error handled by AuthContext's apiClient interceptor
      // No need for toast.error here unless specific local handling is required
      console.error("Login failed in useLoginForm:", err);
    } finally {
      setLoading(false);
    }
  }, [email, password, navigate, login]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
  };
}