import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalysisSummaryCardProps {
  patientName: string;
  diagnosisSummary: string;
}

const AnalysisSummaryCard: React.FC<AnalysisSummaryCardProps> = ({ patientName, diagnosisSummary }) => {
  return (
    <Card className="mb-6 border-l-4 border-green-600 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Ringkasan untuk: <span className="text-green-700">{patientName}</span></CardTitle>
        <CardDescription className="text-md">{diagnosisSummary}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default AnalysisSummaryCard;
