import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import Service from "./pages/Service";
import Layout from "./components/Layout"; // Assuming this is still used
import LandingLayout from "./components/LandingLayout";
import Index from "./pages/Index"; // Use the new consolidated landing page

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rute untuk pengguna yang sudah login */}
      {isAuthenticated && (
        <Route
          path="/*" // Mencakup semua rute di bawah Layout jika sudah login
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/upload" replace />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/results" element={<Results />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          }
        />
      )}

      {/* Rute untuk halaman publik (landing page, login, signup, service) */}
      {!isAuthenticated && (
        <Route
          path="/"
          element={
            <LandingLayout>
              <Index />
            </LandingLayout>
          }
        />
      )}
      
      {/* Rute yang selalu dapat diakses, terlepas dari status login */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/service" element={<LandingLayout><Service /></LandingLayout>} />

      {/* Catch-all untuk rute yang tidak ditemukan jika tidak login */}
      {!isAuthenticated && <Route path="*" element={<LandingLayout><NotFound /></LandingLayout>} />}
      {/* Catch-all untuk rute yang tidak ditemukan jika login (sudah ditangani di atas) */}
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toaster dari shadcn/ui */}
      <Toaster /> 
      {/* Sonner untuk notifikasi toast */}
      <Sonner /> 
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
