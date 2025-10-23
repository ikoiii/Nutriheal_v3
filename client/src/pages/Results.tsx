import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { useAnalysisData } from "@/hooks/useAnalysisData";
import NoDataAlert from "@/components/results/NoDataAlert";
import AnalysisSummaryCard from "@/components/results/AnalysisSummaryCard";
import KeyMetricsCard from "@/components/results/KeyMetricsCard";
import MedicationsCard from "@/components/results/MedicationsCard";
import GeneralRecommendationsCard from "@/components/results/GeneralRecommendationsCard";
import FoodRecommendationsAccordion from "@/components/results/FoodRecommendationsAccordion";

export default function Results() {
  const navigate = useNavigate();
  const { analysisData, isLoading } = useAnalysisData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat hasil analisis...</p>
      </div>
    );
  }

  if (!analysisData) {
    return <NoDataAlert />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Hasil Analisis Gizi</h1>
          <Button onClick={() => navigate("/upload")} variant="outline">
            Analisis File Lain
          </Button>
        </div>

        <AnalysisSummaryCard
          patientName={analysisData.patient_name}
          diagnosisSummary={analysisData.diagnosis_summary}
        />

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2 space-y-6">
            <KeyMetricsCard metrics={analysisData.key_metrics} />
            <MedicationsCard medications={analysisData.medications} />
          </div>

          <div className="md:col-span-3 space-y-6">
            <GeneralRecommendationsCard recommendations={analysisData.recommendations} />
            <FoodRecommendationsAccordion foodRecommendations={analysisData.food_recommendations} />
          </div>
        </div>
      </div>
    </div>
  );
}
