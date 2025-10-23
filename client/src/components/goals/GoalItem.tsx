import React from "react";
import { UserGoal } from "@/hooks/useGoals";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface GoalItemProps {
  goal: UserGoal;
  handleMarkComplete: (goalId: number) => void;
  isMarkingComplete: boolean;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, handleMarkComplete, isMarkingComplete }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          {goal.goal_description}
        </CardTitle>
        <Badge
          variant={goal.status === "active" ? "default" : "secondary"}
          className="text-xs"
        >
          {goal.status === "active" ? "Aktif" : "Selesai"}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow flex items-end justify-between pt-0">
        <p className="text-sm text-muted-foreground">
          Dibuat: {new Date(goal.created_at).toLocaleDateString()}
        </p>
        {goal.status === "active" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`goal-${goal.id}`}
              onCheckedChange={() => handleMarkComplete(goal.id)}
              disabled={isMarkingComplete}
            />
            <Label htmlFor={`goal-${goal.id}`}>Tandai Selesai</Label>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalItem;
