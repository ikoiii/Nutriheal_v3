import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { apiClient, useAuth } from "@/contexts/AuthContext";

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
  const { isAuthenticated, token } = useAuth(); // Get auth state

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setIsFetchingHistory(false);
      setHistory([]); // Clear history if not authenticated
      return;
    }

    setIsFetchingHistory(true);
    try {
      const response = await apiClient.get("/records/history");
      setHistory(response.data);
    } catch (err) {
      // Error is already handled and logged by the central apiClient interceptor.
      // No need to log it again here.
    } finally {
      setIsFetchingHistory(false);
    }
  }, [isAuthenticated, token]); // Depend on isAuthenticated and token

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]); // fetchHistory itself now depends on isAuthenticated and token

  return {
    history,
    isFetchingHistory,
    fetchHistory,
  };
}