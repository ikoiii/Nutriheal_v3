import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewGoalFormProps {
  newGoalDescription: string;
  setNewGoalDescription: (value: string) => void;
  handleSubmitNewGoal: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const NewGoalForm: React.FC<NewGoalFormProps> = ({
  newGoalDescription,
  setNewGoalDescription,
  handleSubmitNewGoal,
  isSubmitting,
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Buat Tujuan Baru</CardTitle>
        <CardDescription>Tambahkan tujuan kesehatan yang ingin Anda capai.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitNewGoal} className="flex gap-4">
          <Input
            type="text"
            placeholder="Contoh: Minum 8 gelas air setiap hari"
            value={newGoalDescription}
            onChange={(e) => setNewGoalDescription(e.target.value)}
            className="flex-grow"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menambah..." : "Tambah Tujuan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewGoalForm;
