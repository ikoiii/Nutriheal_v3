import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/contexts/AuthContext";

export interface Message {
  sender: "user" | "ai";
  text: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Halo! Saya asisten kesehatan AI Anda. Ada yang bisa saya bantu hari ini?" },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (user_question: string) => {
      const response = await apiClient.post("/chat", { user_question });
      return response.data;
    },
    onMutate: async (user_question) => {
      setMessages((prev) => [...prev, { sender: "user", text: user_question }]);
      setCurrentQuestion("");
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { sender: "ai", text: data.response }]);
    },
    onError: (error: any) => {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Maaf, terjadi kesalahan. Silakan coba lagi." },
      ]);
      console.error("Chat error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuestion.trim() && !chatMutation.isPending) {
      chatMutation.mutate(currentQuestion);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return {
    messages,
    currentQuestion,
    setCurrentQuestion,
    handleSubmit,
    isPending: chatMutation.isPending,
    messagesEndRef,
  };
};
