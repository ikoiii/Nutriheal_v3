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
import GoalsPage from "./pages/GoalsPage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import Service from "./pages/Service";
import About from "./pages/About"; // Import About page
import Contact from "./pages/Contact"; // Import Contact page
import FeaturesPage from "./pages/Features"; // Import Features page
import Layout from "./components/Layout"; // Assuming this is still used
import LandingLayout from "./components/LandingLayout";
import Index from "./pages/Index"; // Use the new consolidated landing page

import ProtectedRoute from "./components/ProtectedRoute";
import InsightsPage from "./pages/InsightsPage";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rute publik yang dapat diakses semua orang */}
      <Route
        path="/"
        element={
          <LandingLayout>
            <Index />
          </LandingLayout>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<LandingLayout><About /></LandingLayout>} />
      <Route path="/service" element={<LandingLayout><Service /></LandingLayout>} />

      {/* Rute yang dilindungi hanya untuk pengguna yang sudah login */}
      <Route element={<ProtectedRoute />}>
        <Route path="/upload" element={<Upload />} />
        <Route path="/results" element={<Results />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/features" element={<FeaturesPage />} /> {/* Add Features route here */}
      </Route>

      {/* Rute Not Found untuk menangani semua rute yang tidak cocok */}
      <Route path="*" element={<LandingLayout><NotFound /></LandingLayout>} />
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
      <BrowserRouter future={{ v7_startTransition: true }}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
