import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/contexts/AuthContext"; // Assuming apiClient is exported
import LoadingOverlay from "@/components/LoadingOverlay"; // Assuming a LoadingOverlay component exists

interface SleepEnergyData {
  date: string;
  sleep_quality: number;
  energy_level: number;
}

interface SleepEnergyChartProps {
  userId: string; // Assuming userId is passed as a prop
}

export const SleepEnergyChart: React.FC<SleepEnergyChartProps> = ({ userId }) => {
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery<SleepEnergyData[], Error>({
    queryKey: ["sleepEnergyCorrelation", userId],
    queryFn: async () => {
      const apiUrl = `/insights/sleep-energy/${userId}`;
      const response = await apiClient.get(apiUrl);
      return response.data;
    },
    enabled: !!userId, // Only run the query if userId is available
  });

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center">
        Error loading data: {error?.message}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500">No sleep and energy data available for the last 30 days.</div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="sleep_quality"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="Sleep Quality"
          />
          <Line
            type="monotone"
            dataKey="energy_level"
            stroke="#82ca9d"
            name="Energy Level"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
