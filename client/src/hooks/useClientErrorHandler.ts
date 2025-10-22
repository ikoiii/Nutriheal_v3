import { useCallback } from "react";
import { toast } from "sonner";

interface ErrorResponse {
  message?: string;
  errors?: Array<{ msg: string }>;
}

export function useClientErrorHandler() {
  const handleError = useCallback((error: any) => {
    let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
    let errorDetails: string | undefined;

    if (error.response) {
      // Server responded with a status other than 2xx
      const data: ErrorResponse = error.response.data;
      if (data.message) {
        errorMessage = data.message;
      } else if (data.errors && data.errors.length > 0) {
        errorMessage = data.errors[0].msg; // Take the first validation error message
        errorDetails = data.errors.map(e => e.msg).join(", ");
      } else if (error.response.statusText) {
        errorMessage = error.response.statusText;
      }
    } else if (error.request) {
      // Request was made but no response was received
      errorMessage = "Tidak ada respons dari server. Periksa koneksi internet Anda.";
    } else if (error.message) {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }

    console.error("Client-side error:", error);
    toast.error(errorMessage, {
      description: errorDetails,
      duration: 5000,
    });
  }, []);

  return { handleError };
}
