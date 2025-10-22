import React from 'react';
import { Loader2 } from 'lucide-react'; 

interface LoadingOverlayProps {
  text?: string; 
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ text = "Memuat data, mohon tunggu..." }) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" /> {/* Spinner */}
        <p className="text-lg font-semibold text-foreground">{text}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;