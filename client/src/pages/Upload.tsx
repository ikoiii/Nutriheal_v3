import { useNavigate } from "react-router-dom";
import { FileText, UploadCloud, X, Eye } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "sonner";

import LoadingOverlay from "@/components/LoadingOverlay";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";

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
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <label htmlFor="file-upload" className="relative cursor-pointer">
              <Button asChild variant="outline">
                <span>Pilih File</span>
              </Button>
              <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" />
            </label>
            <p className="text-xs text-muted-foreground mt-2">atau seret & lepaskan file disini (PDF)</p>
          </div>
          {selectedFile && (
            <div className="mt-6 flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
              <FileText className="h-6 w-6 text-muted-foreground" />
              <Badge variant="secondary">{selectedFile.name}</Badge>
              <Button variant="ghost" size="icon" onClick={clearSelectedFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          {selectedFile && (
            <div className="mt-6 flex justify-center">
              <Button onClick={handleSubmit} disabled={isUploading} size="lg">
                {isUploading ? "Menganalisis..." : "Mulai Analisis"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Analisis</CardTitle>
          <CardDescription>Lihat hasil analisis rekam medis Anda sebelumnya.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tampilan Tabel untuk Desktop */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama File</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetchingHistory ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={`desktop-skeleton-${i}`}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : history.length > 0 ? (
                  history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{item.file_name}</TableCell>
                      <TableCell>
                        <Badge variant={item.analysis_summary.diagnosis_summary.toLowerCase().includes('normal') ? 'default' : 'destructive'}>{item.analysis_summary.diagnosis_summary.toLowerCase().includes('normal') ? 'Normal' : 'Perlu Perhatian'}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => navigate("/results", { state: { analysisData: item } })}>
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Belum ada riwayat.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Tampilan Kartu untuk Mobile */}
          <div className="space-y-4 md:hidden">
            {isFetchingHistory ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={`mobile-skeleton-${i}`} className="h-28 w-full rounded-lg" />)
            ) : history.length > 0 ? (
              history.map((item) => (
                <Card key={item.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm truncate max-w-[150px]">{item.file_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
                    <Badge variant={item.analysis_summary.diagnosis_summary.toLowerCase().includes('normal') ? 'default' : 'destructive'}>{item.analysis_summary.diagnosis_summary.toLowerCase().includes('normal') ? 'Normal' : 'Perlu Perhatian'}</Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate("/results", { state: { analysisData: item } })}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </Card>
              ))
            ) : (
              <div className="h-24 flex items-center justify-center text-center text-muted-foreground">
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Belum ada riwayat.
                  </TableCell>
                </TableRow>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}