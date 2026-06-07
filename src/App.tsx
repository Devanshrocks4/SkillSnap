import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./pages/Landing";
import { LoginPage, SignupPage } from "./pages/Auth";
import { CandidateApp } from "./pages/candidate";
import { RecruiterApp } from "./pages/recruiter";
import { AdminApp } from "./pages/admin";
import { useAuth } from "./contexts/AuthContext";

// FIX: ProtectedRoute uses Navigate component (not useNavigate) to avoid hook-in-render
function ProtectedRoute({
  role,
  children,
}: {
  role: "candidate" | "recruiter" | "admin";
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  if (loading) return <AppSkeleton />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    const redirect =
      user.role === "candidate"
        ? "/candidate"
        : user.role === "recruiter"
        ? "/recruiter"
        : "/admin";
    return <Navigate to={redirect} replace />;
  }
  return <>{children}</>;
}

// FIX: Auth redirect for already-logged-in users
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <AppSkeleton />;
  if (user) {
    const redirect =
      user.role === "candidate"
        ? "/candidate"
        : user.role === "recruiter"
        ? "/recruiter"
        : "/admin";
    return <Navigate to={redirect} replace />;
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
  return (
    <Navigate
      to={
        user.role === "candidate"
          ? "/candidate"
          : user.role === "recruiter"
          ? "/recruiter"
          : "/admin"
      }
      replace
    />
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      {/* FIX: Auth pages redirect logged-in users away */}
      <Route path="/login" element={<AuthGuard><LoginPage /></AuthGuard>} />
      <Route path="/signup" element={<AuthGuard><SignupPage /></AuthGuard>} />
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
