import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileWarning, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

// --- Data Structures Matching Server Output ---
interface KeyMetric {
  metric: string;
  value: string;
}

interface Medication {
  name: string;
  dosage: string;
}

interface FoodRecommendation {
  category: string;
  items: string[];
}

interface AnalysisData {
  patient_name: string;
  diagnosis_summary: string;
  key_metrics: KeyMetric[];
  medications: Medication[];
  recommendations: string;
  food_recommendations: FoodRecommendation[];
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let data: AnalysisData | null = null;
    const rawData = location.state?.analysisData;

    if (rawData) {
      // Case 1: Data dari riwayat (history)
      if (rawData.analysis_summary) {
        try {
          // analysis_summary bisa berupa string JSON atau sudah menjadi objek
          data = typeof rawData.analysis_summary === 'string' 
            ? JSON.parse(rawData.analysis_summary) 
            : rawData.analysis_summary;
        } catch (error) {
          console.error("Gagal mem-parsing analysis_summary:", error);
        }
      } 
      // Case 2: Data dari upload baru (mungkin bersarang di dalam properti `data`)
      else if (rawData.data && rawData.data.patient_name) {
        data = rawData.data;
      }
      // Case 3: Data dari upload baru (tidak bersarang)
      else if (rawData.patient_name) {
        data = rawData.data;
      }
    }

    setAnalysisData(data);
    setIsLoading(false);
  }, [location.state]);

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Memuat hasil analisis...</p>
        </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <Alert variant="destructive" className="max-w-lg text-center">
          <FileWarning className="h-6 w-6 mx-auto mb-4" />
          <AlertTitle className="text-xl font-bold">Error: Data Analisis Tidak Ditemukan</AlertTitle>
          <AlertDescription className="mt-2">
            Tidak ada data valid untuk ditampilkan. Silakan kembali dan unggah file rekam medis terlebih dahulu.
            <Button onClick={() => navigate("/upload")} className="mt-6 w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Halaman Upload
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
                Hasil Analisis Gizi
            </h1>
            <Button onClick={() => navigate("/upload")} variant="outline">Analisis File Lain</Button>
        </div>

        <Card className="mb-6 border-l-4 border-green-600 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Ringkasan untuk: <span className="text-green-700">{analysisData.patient_name}</span></CardTitle>
            <CardDescription className="text-md">{analysisData.diagnosis_summary}</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Metrik Medis Kunci</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metrik</TableHead>
                      <TableHead className="text-right">Nilai</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisData.key_metrics?.map((metric, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{metric.metric}</TableCell>
                        <TableCell className="text-right">{metric.value}</TableCell>
                      </TableRow>
                    )) || <TableRow><TableCell colSpan={2}>Data tidak tersedia.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Daftar Obat</CardTitle>
              </CardHeader>
              <CardContent>
                {analysisData.medications && analysisData.medications.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Obat</TableHead>
                        <TableHead className="text-right">Dosis</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysisData.medications.map((med, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{med.name}</TableCell>
                          <TableCell className="text-right">{med.dosage}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Tidak ada daftar obat yang tercatat.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3 space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Rekomendasi Umum</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{analysisData.recommendations || "Data tidak tersedia."}</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Rekomendasi Makanan</CardTitle>
                <CardDescription>Berikut adalah saran makanan yang disesuaikan dengan kondisi Anda.</CardDescription>
              </CardHeader>
              <CardContent>
                {analysisData.food_recommendations && analysisData.food_recommendations.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                        {analysisData.food_recommendations.map((food, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="font-bold text-lg">{food.category}</AccordionTrigger>
                            <AccordionContent>
                            <ul className="list-disc pl-5 space-y-2 text-md">
                                {food.items.map((item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                                ))}
                            </ul>
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Tidak ada rekomendasi makanan.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
