import React from 'react';
import { SleepEnergyChart } from '@/components/charts/SleepEnergyChart';

interface SleepEnergyInsightCardProps {
  userId: number | string | undefined;
}

const SleepEnergyInsightCard: React.FC<SleepEnergyInsightCardProps> = ({ userId }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Sleep Quality vs. Energy Level (Last 30 Days)</h2>
      {userId ? (
        <SleepEnergyChart userId={userId.toString()} />
      ) : (
        <div className="text-center text-gray-500">User ID not available. Please log in.</div>
      )}
    </div>
  );
};

export default SleepEnergyInsightCard;
