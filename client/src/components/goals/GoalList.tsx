import React from "react";
import { UserGoal } from "@/hooks/useGoals";
import GoalItem from "./GoalItem";

interface GoalListProps {
  goals: UserGoal[];
  handleMarkComplete: (goalId: number) => void;
  isMarkingComplete: boolean;
}

const GoalList: React.FC<GoalListProps> = ({ goals, handleMarkComplete, isMarkingComplete }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Daftar Tujuan Anda</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.length === 0 ? (
          <p className="text-muted-foreground">Anda belum memiliki tujuan. Buat tujuan pertama Anda!</p>
        ) : (
          goals.map((goal) => (
            <GoalItem 
              key={goal.id} 
              goal={goal} 
              handleMarkComplete={handleMarkComplete} 
              isMarkingComplete={isMarkingComplete}
            />
          ))
        )}
      </div>
    </>
  );
};

export default GoalList;
