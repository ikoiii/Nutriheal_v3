import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GeneralRecommendationsCardProps {
  recommendations: string;
}

const GeneralRecommendationsCard: React.FC<GeneralRecommendationsCardProps> = ({ recommendations }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Rekomendasi Umum</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground leading-relaxed">{recommendations || "Data tidak tersedia."}</p>
      </CardContent>
    </Card>
  );
};

export default GeneralRecommendationsCard;
