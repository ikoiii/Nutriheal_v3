import { apiClient } from "@/contexts/AuthContext"; // Assuming apiClient is exported from AuthContext

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },

  signup: async (name: string, email: string, password: string) => {
    const response = await apiClient.post("/auth/register", { name, email, password });
    return response.data;
  },

  // Potentially add other auth-related API calls here, e.g., logout, refresh token
};
