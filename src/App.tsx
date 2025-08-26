import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import RegisterStudent from "./pages/RegisterStudent";
import RegisterTeacher from "./pages/RegisterTeacher";
import StudentDashboard from "./pages/student/Dashboard";
import RequestLesson from "./pages/student/RequestLesson";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherProfile from "./pages/teacher/Profile";
import NotFound from "./pages/NotFound";
import WaitingForTeacher from "./pages/student/WaitingForTeacher";
import DebugWaiting from "./pages/student/DebugWaiting";
import WaitingRoom from "./pages/student/WaitingRoom";
import ZoomMeeting from "./pages/ZoomMeeting";
import PaymentPage from "./pages/student/PaymentPage";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./lib/stripe";

function ProtectedRoute({ children, requiredUserType }: { children: React.ReactNode; requiredUserType?: "student" | "teacher" }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredUserType && user.type !== requiredUserType) {
    return <Navigate to={user.type === "student" ? "/student/dashboard" : "/teacher/dashboard"} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.type === "student" ? "/student/dashboard" : "/teacher/dashboard"} replace /> : <Index />} />
      <Route
        path="/login"
        element={user ? <Navigate to={user.type === "student" ? "/student/dashboard" : "/teacher/dashboard"} replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to={user.type === "student" ? "/student/dashboard" : "/teacher/dashboard"} replace /> : <RegisterStudent />}
      />
      <Route
        path="/register/teacher"
        element={user ? <Navigate to={user.type === "student" ? "/student/dashboard" : "/teacher/dashboard"} replace /> : <RegisterTeacher />}
      />

      {/* Student routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredUserType="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/request-lesson"
        element={
          <ProtectedRoute requiredUserType="student">
            <RequestLesson />
          </ProtectedRoute>
        }
      />

      {/* <Route
        path="/student/waiting/:courseId"
        element={
          <ProtectedRoute requiredUserType="student">
            <WaitingForTeacher />
          </ProtectedRoute>
        }
      /> */}

      <Route
        path="/student/waiting-room/:courseId"
        element={
          <ProtectedRoute requiredUserType="student">
            <WaitingRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/debug-jitsi"
        element={
          <ProtectedRoute requiredUserType="student">
            <DebugWaiting />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/zoom-meeting/:courseId"
        element={
          <ProtectedRoute requiredUserType="student">
            <ZoomMeeting />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/payment"
        element={
          <ProtectedRoute requiredUserType="student">
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      {/* Teacher routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute requiredUserType="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile"
        element={
          <ProtectedRoute requiredUserType="teacher">
            <TeacherProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/zoom-meeting/:courseId"
        element={
          <ProtectedRoute requiredUserType="teacher">
            <ZoomMeeting />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Elements stripe={stripePromise}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </Elements>
  </QueryClientProvider>
);

export default App;
