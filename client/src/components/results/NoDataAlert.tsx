import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileWarning, ArrowLeft } from "lucide-react";

const NoDataAlert: React.FC = () => {
  const navigate = useNavigate();

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
};

export default NoDataAlert;
