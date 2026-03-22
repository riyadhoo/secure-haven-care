import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import FindTherapist from "./pages/FindTherapist.tsx";
import DoctorApply from "./pages/DoctorApply.tsx";
import Login from "./pages/Login.tsx";
import PatientDashboard from "./pages/PatientDashboard.tsx";
import DoctorDashboard from "./pages/DoctorDashboard.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import SessionRoom from "./pages/SessionRoom.tsx";
import SessionReport from "./pages/SessionReport.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/find-therapist" element={<FindTherapist />} />
            <Route path="/doctor-apply" element={<DoctorApply />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/session-room"
              element={
                <ProtectedRoute allowedRoles={["patient", "doctor"]}>
                  <SessionRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/session-report"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <SessionReport />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
