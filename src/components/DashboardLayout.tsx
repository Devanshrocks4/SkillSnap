import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
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
  Search,
  Command,
  HelpCircle,
} from "lucide-react";
import { Logo } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../lib/types";

interface NavItem {
  to: string;
  label: string;
  icon: any;
  badge?: string;
}

const candidateNav: NavItem[] = [
  { to: "/candidate", label: "Overview", icon: LayoutDashboard },
  { to: "/candidate/jobs", label: "Browse Jobs", icon: Briefcase },
  { to: "/candidate/applications", label: "My Applications", icon: FileCheck, badge: "4" },
  { to: "/candidate/ai", label: "AI Insights", icon: Sparkles },
  { to: "/candidate/interviews", label: "Interviews", icon: MessageSquare },
  { to: "/candidate/onboarding", label: "Onboarding", icon: FileCheck },
];

const recruiterNav: NavItem[] = [
  { to: "/recruiter", label: "Dashboard", icon: LayoutDashboard },
  { to: "/recruiter/jobs", label: "Jobs", icon: Briefcase },
  { to: "/recruiter/candidates", label: "Candidates", icon: Users, badge: "12" },
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

export function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nav = navByRole[role] ?? [];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#05050a]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/5 bg-gradient-to-b from-[#0a0a12] to-[#05050a] lg:flex">
        <div className="flex h-16 items-center border-b border-white/5 px-5">
          <Link to={`/${role}`}>
            <Logo />
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          <div className="mb-2 px-2 text-[10px] font-medium uppercase tracking-wider text-white/30">
            Workspace
          </div>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${role}`}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-gradient-to-r from-violet-500/10 to-transparent text-white"
                    : "text-white/60 hover:bg-white/[0.03] hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-gradient-to-b from-violet-400 to-teal-400"
                    />
                  )}
                  <item.icon className={`h-4 w-4 ${isActive ? "text-violet-300" : "text-white/50 group-hover:text-white/80"}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-medium text-violet-300">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-xs font-semibold text-white">
              {user?.name?.slice(0, 2).toUpperCase() ?? "SK"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-white">{user?.name}</div>
              <div className="truncate text-[11px] capitalize text-white/50">{user?.role}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="grid h-7 w-7 place-items-center rounded-md text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-[#05050a]/80 px-4 backdrop-blur-xl lg:px-8">
          <div className="hidden flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 md:flex md:max-w-md">
            <Search className="h-4 w-4 text-white/40" />
            <input
              placeholder="Search candidates, jobs, applications..."
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
            />
            <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/50 md:inline-flex md:items-center md:gap-0.5">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-white/5 bg-white/[0.02] text-white/70 transition hover:bg-white/[0.05]">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400 pulse-dot" />
            </button>
            <button className="hidden h-9 items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 text-xs text-white/70 transition hover:bg-white/[0.05] md:inline-flex">
              <HelpCircle className="h-3.5 w-3.5" /> Help
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] py-1 pl-1 pr-3">
              <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-violet-500 to-teal-400 text-[10px] font-semibold text-white">
                {user?.name?.slice(0, 2).toUpperCase() ?? "SK"}
              </div>
              <div className="hidden text-xs md:block">
                <div className="font-medium text-white">{user?.name}</div>
                <div className="text-[10px] capitalize text-white/50">{user?.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-7xl p-4 md:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
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
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-white/50">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
