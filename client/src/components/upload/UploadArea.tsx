import React from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UploadAreaProps {
  isDragging: boolean;
  selectedFile: File | null;
  isUploading: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  clearSelectedFile: () => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({
  isDragging,
  selectedFile,
  isUploading,
  handleDragOver,
  handleDragEnter,
  handleDragLeave,
  handleDrop,
  handleFileChange,
  handleSubmit,
  clearSelectedFile,
}) => {
  return (
    <>
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
            {isUploading ? 'Menganalisis...' : 'Mulai Analisis'}
          </Button>
        </div>
      )}
    </>
  );
};

export default UploadArea;
