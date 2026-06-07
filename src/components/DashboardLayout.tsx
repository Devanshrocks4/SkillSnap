import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Sparkles,
  MessageSquare,
  FileCheck,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Logo } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../lib/types";

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const candidateNav: NavItem[] = [
  { to: "/candidate", label: "Overview", icon: LayoutDashboard },
  { to: "/candidate/profile", label: "My Profile", icon: Users },
  { to: "/candidate/jobs", label: "Browse Jobs", icon: Briefcase },
  { to: "/candidate/applications", label: "My Applications", icon: FileCheck },
  { to: "/candidate/ai", label: "AI Insights", icon: Sparkles },
  { to: "/candidate/interviews", label: "Interviews", icon: MessageSquare },
  { to: "/candidate/onboarding", label: "Onboarding", icon: FileCheck },
];

const recruiterNav: NavItem[] = [
  { to: "/recruiter", label: "Dashboard", icon: LayoutDashboard },
  { to: "/recruiter/jobs", label: "Jobs", icon: Briefcase },
  { to: "/recruiter/candidates", label: "Candidates", icon: Users },
  { to: "/recruiter/screening", label: "AI Screening", icon: Sparkles },
  { to: "/recruiter/interviews", label: "Interviews", icon: MessageSquare },
  { to: "/recruiter/onboarding", label: "Onboarding", icon: FileCheck },
  { to: "/recruiter/analytics", label: "Analytics", icon: BarChart3 },
];

const adminNav: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/recruiters", label: "Recruiters", icon: Briefcase },
  { to: "/admin/analytics", label: "Global Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const navByRole: Record<UserRole, NavItem[]> = {
  candidate: candidateNav,
  recruiter: recruiterNav,
  admin: adminNav,
};

const roleColors: Record<UserRole, string> = {
  candidate: "from-teal-500 to-emerald-500",
  recruiter: "from-violet-500 to-blue-500",
  admin: "from-rose-500 to-pink-500",
};

export function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = navByRole[role] ?? [];

  // FIX: logout properly awaited and redirects to /login
  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/5 px-4 py-5">
        <Logo size={24} />
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === `/${role}`}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                isActive
                  ? "bg-violet-500/10 border border-violet-500/20 text-violet-200 font-medium"
                  : "text-white/45 hover:text-white/80 hover:bg-white/[0.03]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`h-4 w-4 flex-shrink-0 transition ${
                    isActive
                      ? "text-violet-300"
                      : "text-white/40 group-hover:text-white/70"
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-violet-500/25 px-1.5 py-0.5 text-[10px] font-medium text-violet-300">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <ChevronRight className="h-3 w-3 text-violet-400/60" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3 rounded-xl p-2.5">
          <div
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${roleColors[role]} text-xs font-bold text-white`}
          >
            {(user?.name ?? "U")[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-white">
              {user?.name ?? "User"}
            </div>
            <div className="truncate text-[11px] text-white/35 capitalize">
              {user?.role}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white/30 hover:bg-rose-500/10 hover:text-rose-400 transition"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#05050a]">
      {/* Desktop sidebar */}
      <div className="hidden w-60 flex-shrink-0 border-r border-white/5 bg-[#07071a]/80 backdrop-blur-xl lg:block">
        <SidebarContent />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-60 border-r border-white/5 bg-[#07071a] lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-5">
                <Logo size={22} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-white/40 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-[#05050a]/80 px-4 py-3 backdrop-blur-xl lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/[0.05] hover:text-white transition lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
              <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${roleColors[role]}`} />
              <span className="capitalize">{role}</span>
            </span>
            <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/[0.05] hover:text-white transition">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-white/45">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
