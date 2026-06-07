import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, Briefcase, CheckCircle2, Shield, Settings, Activity,
  Trash2, RefreshCw, UserCheck, Search, BarChart3,
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DashboardLayout, PageHeader } from "../../components/DashboardLayout";
import { StatCard, Badge } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import type { FirestoreUser, FirestoreJob, FirestoreApplication, FirestoreOnboarding } from "../../types/firestore";
import { getAllUsers, getUsersByRole, updateUserProfile } from "../../services/userService";
import { getAllJobs } from "../../services/jobService";
import { getAllOnboarding } from "../../services/onboardingService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase/config";

async function getAllApplications(): Promise<FirestoreApplication[]> {
  const snap = await getDocs(collection(db, "applications"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreApplication));
}

export function AdminApp() {
  const [allUsers, setAllUsers] = useState<FirestoreUser[]>([]);
  const [candidates, setCandidates] = useState<FirestoreUser[]>([]);
  const [recruiters, setRecruiters] = useState<FirestoreUser[]>([]);
  const [jobs, setJobs] = useState<FirestoreJob[]>([]);
  const [applications, setApplications] = useState<FirestoreApplication[]>([]);
  const [onboarding, setOnboarding] = useState<FirestoreOnboarding[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [usersData, cData, rData, jobsData, appsData, onboardingData] = await Promise.all([
        getAllUsers(),
        getUsersByRole("candidate"),
        getUsersByRole("recruiter"),
        getAllJobs(),
        getAllApplications(),
        getAllOnboarding(),
      ]);
      setAllUsers(usersData);
      setCandidates(cData);
      setRecruiters(rData);
      setJobs(jobsData);
      setApplications(appsData);
      setOnboarding(onboardingData);
    } catch (error) {
      console.error("Admin data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <DashboardLayout role="admin">
      <Routes>
        <Route index element={<AdminDashboard candidates={candidates} recruiters={recruiters} jobs={jobs} applications={applications} onboarding={onboarding} />} />
        <Route path="users" element={<UsersPage users={allUsers} onRefresh={fetchAll} />} />
        <Route path="recruiters" element={<RecruitersPage recruiters={recruiters} jobs={jobs} applications={applications} />} />
        <Route path="analytics" element={<GlobalAnalytics candidates={candidates} recruiters={recruiters} applications={applications} jobs={jobs} />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}

/* ─── Admin Dashboard ─────────────────────────────────────────── */
function AdminDashboard({ candidates, recruiters, jobs, applications, onboarding }: any) {
  const recentActivity = [
    ...applications.slice(0, 3).map((a: FirestoreApplication) => ({ type: "apply", text: `${a.candidateName || "Candidate"} applied for ${a.jobTitle || "a role"}` })),
    ...jobs.slice(0, 2).map((j: FirestoreJob) => ({ type: "job", text: `New job posted: ${j.title} at ${j.company}` })),
  ];

  return (
    <div>
      <PageHeader title="Admin Overview" description="Platform-wide metrics and activity." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Users" value={candidates.length + recruiters.length} icon={<Users className="h-4 w-4" />} accent="brand" />
        <StatCard label="Candidates" value={candidates.length} icon={<UserCheck className="h-4 w-4" />} accent="teal" />
        <StatCard label="Recruiters" value={recruiters.length} icon={<Briefcase className="h-4 w-4" />} accent="pink" />
        <StatCard label="Active Jobs" value={jobs.filter((j: FirestoreJob) => j.status === "open").length} icon={<CheckCircle2 className="h-4 w-4" />} accent="amber" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Applications" value={applications.length} icon={<Activity className="h-4 w-4" />} accent="brand" />
        <StatCard label="Hired" value={applications.filter((a: FirestoreApplication) => a.status === "hired").length} icon={<CheckCircle2 className="h-4 w-4" />} accent="teal" />
        <StatCard label="Onboarding" value={onboarding.length} icon={<Shield className="h-4 w-4" />} accent="pink" />
        <StatCard label="Total Jobs" value={jobs.length} icon={<BarChart3 className="h-4 w-4" />} accent="amber" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="mb-4 text-sm font-semibold text-white">Recent Activity</div>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-white/40">No activity yet.</p>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
                  <div className={`h-2 w-2 rounded-full ${a.type === "apply" ? "bg-teal-400" : "bg-violet-400"}`} />
                  <span className="text-xs text-white/70">{a.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="mb-4 text-sm font-semibold text-white">Platform Health</div>
          <div className="space-y-3">
            {[
              { label: "Firebase Auth", status: "operational", color: "bg-teal-400" },
              { label: "Firestore Database", status: "operational", color: "bg-teal-400" },
              { label: "Firebase Storage", status: "operational", color: "bg-teal-400" },
              { label: "Gemini AI Engine", status: "active", color: "bg-violet-400" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
                <span className="text-xs text-white/70">{s.label}</span>
                <span className="flex items-center gap-1.5 text-xs text-white/60">
                  <span className={`h-2 w-2 animate-pulse rounded-full ${s.color}`} /> {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Users Page ──────────────────────────────────────────────── */
function UsersPage({ users, onRefresh }: { users: FirestoreUser[]; onRefresh: () => void }) {
  const { showSuccess, showError } = useToast();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "candidate" | "recruiter" | "admin">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchesQuery = u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const changeRole = async (uid: string, newRole: "candidate" | "recruiter" | "admin") => {
    setUpdatingId(uid);
    try {
      await updateUserProfile(uid, { role: newRole });
      showSuccess(`Role updated to ${newRole}`);
      onRefresh();
    } catch {
      showError("Failed to update role. Check Firestore rules.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <PageHeader title="User Management" description="View and manage all platform users." actions={
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users..." className="w-56 rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white focus:border-violet-500/40 focus:outline-none">
            <option value="all">All Roles</option>
            <option value="candidate">Candidates</option>
            <option value="recruiter">Recruiters</option>
            <option value="admin">Admins</option>
          </select>
          <button onClick={onRefresh} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white hover:bg-white/[0.07]">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>
      } />
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="grid grid-cols-12 gap-4 border-b border-white/5 px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-white/40">
          <div className="col-span-4">User</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-3">Joined</div>
          <div className="col-span-3 text-right">Change Role</div>
        </div>
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-white/40">No users found.</div>
        ) : filtered.map((u) => (
          <motion.div key={u.uid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-12 items-center gap-4 border-b border-white/5 px-5 py-4 last:border-0">
            <div className="col-span-4 flex items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-xs font-bold text-white">
                {u.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white">{u.name}</div>
                <div className="truncate text-xs text-white/50">{u.email}</div>
              </div>
            </div>
            <div className="col-span-2">
              <Badge tone={u.role === "admin" ? "pink" : u.role === "recruiter" ? "brand" : "teal"}>
                {u.role}
              </Badge>
            </div>
            <div className="col-span-3 text-xs text-white/50">
              {u.createdAt ? (u.createdAt instanceof Date ? u.createdAt : (u.createdAt as any).toDate?.())?.toLocaleDateString() ?? "—" : "—"}
            </div>
            <div className="col-span-3 flex justify-end">
              {updatingId === u.uid ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
              ) : (
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.uid, e.target.value as any)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-white focus:border-violet-500/40 focus:outline-none"
                >
                  <option value="candidate">Candidate</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Recruiters Page ─────────────────────────────────────────── */
function RecruitersPage({ recruiters, jobs, applications }: { recruiters: FirestoreUser[]; jobs: FirestoreJob[]; applications: FirestoreApplication[] }) {
  return (
    <div>
      <PageHeader title="Recruiters" description="All active recruiters and their activity." />
      {recruiters.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-sm text-white/40">No recruiters registered yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recruiters.map((r) => {
            const rJobs = jobs.filter((j) => j.recruiterId === r.uid);
            const rApps = applications.filter((a) => rJobs.some((j) => j.id === a.jobId));
            const hired = rApps.filter((a) => a.status === "hired").length;
            return (
              <div key={r.uid} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
                    {r.name?.[0]?.toUpperCase() ?? "R"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{r.name}</div>
                    <div className="text-xs text-white/50">{r.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2 text-center">
                    <div className="text-lg font-bold text-white">{rJobs.length}</div>
                    <div className="text-[10px] text-white/40">Jobs</div>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2 text-center">
                    <div className="text-lg font-bold text-white">{rApps.length}</div>
                    <div className="text-[10px] text-white/40">Apps</div>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2 text-center">
                    <div className="text-lg font-bold text-teal-300">{hired}</div>
                    <div className="text-[10px] text-white/40">Hired</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Global Analytics ────────────────────────────────────────── */
function GlobalAnalytics({ candidates, recruiters, applications, jobs }: any) {
  const statusData = [
    { name: "Applied", value: applications.filter((a: any) => a.status === "applied").length },
    { name: "Screening", value: applications.filter((a: any) => a.status === "screening").length },
    { name: "Shortlisted", value: applications.filter((a: any) => a.status === "shortlisted").length },
    { name: "Interviewed", value: applications.filter((a: any) => a.status === "interviewed").length },
    { name: "Hired", value: applications.filter((a: any) => a.status === "hired").length },
    { name: "Rejected", value: applications.filter((a: any) => a.status === "rejected").length },
  ];

  return (
    <div>
      <PageHeader title="Global Analytics" description="Platform-wide hiring intelligence." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Users" value={candidates.length + recruiters.length} icon={<Users className="h-4 w-4" />} accent="brand" />
        <StatCard label="Total Jobs" value={jobs.length} icon={<Briefcase className="h-4 w-4" />} accent="teal" />
        <StatCard label="Applications" value={applications.length} icon={<Activity className="h-4 w-4" />} accent="pink" />
        <StatCard label="Success Rate" value={`${Math.round((applications.filter((a: any) => a.status === "hired").length / Math.max(1, applications.length)) * 100)}%`} icon={<CheckCircle2 className="h-4 w-4" />} accent="amber" />
      </div>
      <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
        <div className="mb-4 text-sm font-semibold text-white">Application Pipeline</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={statusData}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0d0d16", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="value" fill="#7c5cff" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─── Settings Page ───────────────────────────────────────────── */
function SettingsPage() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader title="Platform Settings" description="Admin configuration and platform controls." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2"><Shield className="h-4 w-4 text-violet-300" /> Admin Account</h3>
          <div className="space-y-2 text-sm text-white/60">
            <div className="flex justify-between"><span>Name</span><span className="text-white">{user?.name}</span></div>
            <div className="flex justify-between"><span>Email</span><span className="text-white">{user?.email}</span></div>
            <div className="flex justify-between"><span>Role</span><Badge tone="pink">admin</Badge></div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2"><Settings className="h-4 w-4 text-teal-300" /> Firebase Project</h3>
          <div className="space-y-2 text-sm text-white/60">
            <div className="flex justify-between"><span>Project</span><span className="text-white font-mono text-xs">skillsnap-3e5c1</span></div>
            <div className="flex justify-between"><span>Auth</span><Badge tone="success">enabled</Badge></div>
            <div className="flex justify-between"><span>Firestore</span><Badge tone="success">enabled</Badge></div>
            <div className="flex justify-between"><span>Storage</span><Badge tone="success">enabled</Badge></div>
          </div>
        </div>
      </div>
    </div>
  );
}
