import React from "react";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  streakCount: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ streakCount }) => {
  return (
    <div className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-md">
      <Flame className="h-5 w-5" />
      <span className="font-bold text-lg">{streakCount} Hari</span>
    </div>
  );
};

export default StreakCounter;
