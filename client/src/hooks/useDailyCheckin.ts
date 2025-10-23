import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export const useDailyCheckin = (onClose: () => void) => {
  const [energyLevel, setEnergyLevel] = useState<string>("3");
  const [stressLevel, setStressLevel] = useState<string>("3");
  const [sleepQuality, setSleepQuality] = useState<string>("3");
  const [notes, setNotes] = useState<string>("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const dailyLogMutation = useMutation({
    mutationFn: async (newLog: {
      log_date: string;
      energy_level: number;
      stress_level: number;
      sleep_quality: number;
      notes?: string;
    }) => {
      const response = await apiClient.post("/daily-logs", newLog);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Sukses!",
        description: "Log harian Anda berhasil disimpan.",
      });
      queryClient.invalidateQueries({ queryKey: ["dailyLogs", "userProfile"] }); // Invalidate both for streak update
      // Reset form state
      setEnergyLevel("3");
      setStressLevel("3");
      setSleepQuality("3");
      setNotes("");
      onClose(); // Close modal on success
    },
    onError: (error: any) => {
      toast({
        title: "Gagal menyimpan log harian.",
        description:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan log harian.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    dailyLogMutation.mutate({
      log_date: today,
      energy_level: parseInt(energyLevel),
      stress_level: parseInt(stressLevel),
      sleep_quality: parseInt(sleepQuality),
      notes: notes || undefined,
    });
  };

  return {
    energyLevel,
    setEnergyLevel,
    stressLevel,
    setStressLevel,
    sleepQuality,
    setSleepQuality,
    notes,
    setNotes,
    handleSubmit,
    isPending: dailyLogMutation.isPending,
  };
};
