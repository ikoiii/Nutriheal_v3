import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SleepEnergyInsightCard from '@/components/insights/SleepEnergyInsightCard';

const InsightsPage: React.FC = () => {
  const { user } = useAuth(); // Get user from AuthContext

  if (!user) {
    // Handle case where user is not logged in or user data is not yet available
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Please log in to view insights.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Health Insights</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SleepEnergyInsightCard userId={user?.id} />
        {/* You can now easily add more insight cards here */}
        {/* <AnotherInsightCard /> */}
      </div>
    </div>
  );
};

export default InsightsPage;
