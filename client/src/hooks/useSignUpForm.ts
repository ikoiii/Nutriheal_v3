import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner"; // Keep toast for success messages

export function useSignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success("Akun berhasil dibuat! Mengalihkan ke halaman upload...");
      navigate("/upload");
    } catch (err) {
      // Error handled by AuthContext's apiClient interceptor
      // No need for toast.error here unless specific local handling is required
      console.error("Signup failed in useSignUpForm:", err);
    } finally {
      setLoading(false);
    }
  }, [name, email, password, navigate, signup]);

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
  };
}