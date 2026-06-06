import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./pages/Landing";
import { LoginPage, SignupPage } from "./pages/Auth";
import { CandidateApp } from "./pages/candidate";
import { RecruiterApp } from "./pages/recruiter";
import { AdminApp } from "./pages/admin";
import { useAuth } from "./contexts/AuthContext";

function ProtectedRoute({
  role,
  children,
}: {
  role: "candidate" | "recruiter" | "admin";
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) return <AppSkeleton />;
  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }
  if (user.role !== role) {
    navigate(user.role === "candidate" ? "/candidate" : user.role === "recruiter" ? "/recruiter" : "/admin", { replace: true });
    return null;
  }
  return <>{children}</>;
}

function AppSkeleton() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#05050a]">
      <div className="flex items-center gap-3 text-white/60">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        <span className="text-sm">Loading SkillSnap…</span>
      </div>
    </div>
  );
}

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <AppSkeleton />;
  if (!user) return <LandingPage />;
  return <Navigate to={user.role === "candidate" ? "/candidate" : user.role === "recruiter" ? "/recruiter" : "/admin"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/candidate/*"
        element={
          <ProtectedRoute role="candidate">
            <CandidateApp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/*"
        element={
          <ProtectedRoute role="recruiter">
            <RecruiterApp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminApp />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
