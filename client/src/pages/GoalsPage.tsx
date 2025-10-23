import React from "react";
import { useGoals } from "@/hooks/useGoals";
import NewGoalForm from "@/components/goals/NewGoalForm";
import GoalList from "@/components/goals/GoalList";

const GoalsPage: React.FC = () => {
  const {
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
  } = useGoals();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Tujuan Saya</h1>
        <div>Memuat tujuan...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Tujuan Saya</h1>
        <div>Error: {error?.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tujuan Saya</h1>

      <NewGoalForm
        newGoalDescription={newGoalDescription}
        setNewGoalDescription={setNewGoalDescription}
        handleSubmitNewGoal={handleSubmitNewGoal}
        isSubmitting={addGoalMutation.isPending}
      />

      <GoalList
        goals={goals}
        handleMarkComplete={handleMarkComplete}
        isMarkingComplete={markGoalCompleteMutation.isPending}
      />
    </div>
  );
};

export default GoalsPage;
