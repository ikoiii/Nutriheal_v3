import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, UploadCloud, X, Eye } from "lucide-react"; 
import { apiClient } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner"; // Import Toaster dan toast

import LoadingOverlay from "@/components/LoadingOverlay"; // Import komponen LoadingOverlay yang baru

interface AnalysisHistory {
  id: number;
  file_name: string;
  analysis_result: string;
  status: string;
  created_at: string;
}

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      setIsFetchingHistory(true);
      try {
        const response = await apiClient.get("/records/history");
        setHistory(response.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        toast.error("Gagal memuat riwayat analisis.");
      } finally {
        setIsFetchingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]); 
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("pdfFile", selectedFile);

      try {
        const response = await apiClient.post("/records/analyze", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigate("/results", { state: { analysisData: response.data } });
      } catch (err) {
        console.error("File upload failed:", err);
        toast.error("Upload gagal. Pastikan file Anda valid dan coba lagi.");
      } finally {
        setIsUploading(false);
      }
    }
  };

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
              <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
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
                        <Badge variant={item.status === 'Normal' ? 'default' : 'destructive'}>{item.status}</Badge>
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
                    <Badge variant={item.status === 'Normal' ? 'default' : 'destructive'} className="mt-2">{item.status}</Badge>
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
