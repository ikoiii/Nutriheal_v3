import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// --- Data Structures Matching Server Output ---
export interface KeyMetric {
  metric: string;
  value: string;
}

export interface Medication {
  name: string;
  dosage: string;
}

export interface FoodRecommendation {
  category: string;
  items: string[];
}

export interface AnalysisData {
  patient_name: string;
  diagnosis_summary: string;
  key_metrics: KeyMetric[];
  medications: Medication[];
  recommendations: string;
  food_recommendations: FoodRecommendation[];
}

export const useAnalysisData = () => {
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let data: AnalysisData | null = null;
    const rawData = location.state?.analysisData;

    if (rawData) {
      // Case 1: Data from history (analysis_summary is the main object)
      if (rawData.analysis_summary) {
        try {
          data = typeof rawData.analysis_summary === 'string' 
            ? JSON.parse(rawData.analysis_summary) 
            : rawData.analysis_summary;
        } catch (error) {
          console.error("Failed to parse analysis_summary:", error);
        }
      } 
      // Case 2: Data from new upload (nested inside a `data` property)
      else if (rawData.data && rawData.data.patient_name) {
        data = rawData.data;
      }
      // Case 3: Data from new upload (flat structure)
      else if (rawData.patient_name) {
        data = rawData;
      }
    }

    setAnalysisData(data);
    setIsLoading(false);
  }, [location.state]);

  return { analysisData, isLoading };
};
