import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner"; // Keep toast for success messages
import { apiClient } from "@/contexts/AuthContext";

interface AnalysisHistory {
  id: number;
  file_name: string;
  analysis_result: string;
  status: string;
  created_at: string;
}

export function useAnalysisHistory() {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);

  const fetchHistory = useCallback(async () => {
    setIsFetchingHistory(true);
    try {
      const response = await apiClient.get("/records/history");
      setHistory(response.data);
    } catch (err) {
      // Error handled by AuthContext's apiClient interceptor
      // No need for toast.error here unless specific local handling is required
      console.error("Failed to fetch history in useAnalysisHistory:", err);
    } finally {
      setIsFetchingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    isFetchingHistory,
    fetchHistory,
  };
}