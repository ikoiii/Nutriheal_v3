import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "sonner";

import LoadingOverlay from "@/components/LoadingOverlay";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import UploadArea from "@/components/upload/UploadArea";
import AnalysisHistoryList from "@/components/upload/AnalysisHistoryList";

export default function Upload() {
  const navigate = useNavigate();

  const { history, isFetchingHistory, fetchHistory } = useAnalysisHistory();

  const { 
    selectedFile,
    isUploading,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleSubmit,
    clearSelectedFile,
  } = useFileUpload({
    onUploadSuccess: (analysisData) => {
      navigate("/results", { state: { analysisData } });
      fetchHistory(); // Refresh history after successful upload
    },
  });

  return (
    <>
      <Toaster richColors position="top-center" />
      {isUploading && <LoadingOverlay text="Menganalisis file Anda, mohon tunggu..." />}
      <div className="bg-background text-foreground p-4 md:p-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Rekam Medis</CardTitle>
            <CardDescription>Unggah file PDF rekam medis Anda untuk dianalisis oleh AI kami.</CardDescription>
          </CardHeader>
          <CardContent>
            <UploadArea 
              isDragging={isDragging}
              selectedFile={selectedFile}
              isUploading={isUploading}
              handleDragOver={handleDragOver}
              handleDragEnter={handleDragEnter}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
              clearSelectedFile={clearSelectedFile}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Analisis</CardTitle>
            <CardDescription>Lihat hasil analisis rekam medis Anda sebelumnya.</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalysisHistoryList 
              isFetchingHistory={isFetchingHistory}
              history={history}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}