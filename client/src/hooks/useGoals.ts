import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export interface UserGoal {
  id: number;
  goal_description: string;
  status: "active" | "completed";
  created_at: string;
}

export const useGoals = () => {
  const [newGoalDescription, setNewGoalDescription] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading, isError, error } = useQuery<UserGoal[]>({
    queryKey: ["userGoals"],
    queryFn: async () => {
      const response = await apiClient.get("/goals");
      return response.data;
    },
  });

  const addGoalMutation = useMutation({
    mutationFn: async (goal: { goal_description: string }) => {
      const response = await apiClient.post("/goals", goal);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Sukses!",
        description: "Tujuan baru berhasil ditambahkan.",
      });
      setNewGoalDescription("");
      queryClient.invalidateQueries({ queryKey: ["userGoals"] });
    },
    onError: (err: any) => {
      toast({
        title: "Gagal menambahkan tujuan.",
        description:
          err.response?.data?.message ||
          "Terjadi kesalahan saat menambahkan tujuan.",
        variant: "destructive",
      });
    },
  });

  const markGoalCompleteMutation = useMutation({
    mutationFn: async (goalId: number) => {
      const today = new Date().toISOString().split("T")[0];
      await apiClient.post(`/goals/${goalId}/progress`, {
        progress_date: today,
        completed: true,
      });
      // Also update goal status to 'completed'
      const response = await apiClient.put(`/goals/${goalId}`, { status: "completed" });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Sukses!",
        description: "Tujuan berhasil ditandai selesai.",
      });
      queryClient.invalidateQueries({ queryKey: ["userGoals"] });
    },
    onError: (err: any) => {
      toast({
        title: "Gagal menandai tujuan selesai.",
        description:
          err.response?.data?.message ||
          "Terjadi kesalahan saat menandai tujuan selesai.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitNewGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalDescription.trim()) {
      toast({
        title: "Input tidak valid",
        description: "Deskripsi tujuan tidak boleh kosong.",
        variant: "destructive",
      });
      return;
    }
    addGoalMutation.mutate({ goal_description: newGoalDescription });
  };

  const handleMarkComplete = (goalId: number) => {
    markGoalCompleteMutation.mutate(goalId);
  };

  return {
    goals,
    isLoading,
    isError,
    error,
    newGoalDescription,
    setNewGoalDescription,
    addGoalMutation,
    markGoalCompleteMutation,
    handleSubmitNewGoal,
    handleMarkComplete,
  };
};
