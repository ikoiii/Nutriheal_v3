import { useState, useCallback } from "react";
import { toast } from "sonner";
import { apiClient } from "@/contexts/AuthContext";

interface UseFileUploadOptions {
  onUploadSuccess?: (data: any) => void;
  onUploadError?: (error: any) => void;
}

export function useFileUpload(options?: UseFileUploadOptions) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), []);
  const handleDragEnter = useCallback(() => setIsDragging(true), []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (selectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("pdfFile", selectedFile);

      try {
        const response = await apiClient.post("/records/analyze", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        options?.onUploadSuccess?.(response.data);
      } catch (err) {
        // Error handled by AuthContext's apiClient interceptor
        // No need for toast.error here unless specific local handling is required
        console.error("File upload failed in useFileUpload:", err);
        options?.onUploadError?.(err);
      } finally {
        setIsUploading(false);
      }
    }
  }, [selectedFile, options]);

  const clearSelectedFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return {
    selectedFile,
    setSelectedFile,
    isUploading,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleSubmit,
    clearSelectedFile,
  };
}