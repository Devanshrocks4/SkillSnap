import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Shield,
  Settings,
  Globe,
  Activity,
  Database,
  Server,
  Lock,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardLayout, PageHeader } from "../../components/DashboardLayout";
import { StatCard, Badge } from "../../components/ui";
import { mockCandidates, mockJobs, mockApplications, mockOnboarding } from "../../lib/mockData";

export function AdminApp() {
  return (
    <DashboardLayout role="admin">
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="recruiters" element={<RecruitersPage />} />
        <Route path="analytics" element={<GlobalAnalytics />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}

function AdminDashboard() {
  const totalUsers = mockCandidates.length + 8; // + recruiters + admins
  const activeRecruiters = 8;
  const totalJobs = mockJobs.length;
  const totalApplications = mockApplications.length;

  const monthlyGrowth = [
    { month: "Jul", users: 120, jobs: 12 },
    { month: "Aug", users: 180, jobs: 18 },
    { month: "Sep", users: 240, jobs: 24 },
    { month: "Oct", users: 310, jobs: 32 },
    { month: "Nov", users: 380, jobs: 41 },
    { month: "Dec", users: 460, jobs: 52 },
    { month: "Jan", users: 540, jobs: 64 },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Overview"
        description="Global platform health and user management."
        actions={
          <Badge tone="brand">
            <Shield className="h-3 w-3" /> Admin access
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Users" value={totalUsers} icon={<Users className="h-4 w-4" />} accent="brand" delta="+18% MoM" />
        <StatCard label="Active Recruiters" value={activeRecruiters} icon={<Briefcase className="h-4 w-4" />} accent="teal" />
        <StatCard label="Total Jobs" value={totalJobs} icon={<Globe className="h-4 w-4" />} accent="pink" />
        <StatCard label="Applications" value={totalApplications} icon={<Activity className="h-4 w-4" />} accent="amber" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Growth chart */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 lg:col-span-2">
          <div className="mb-4 text-sm font-semibold text-white">Platform Growth</div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyGrowth}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0d0d16", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="users" stroke="#7c5cff" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="jobs" stroke="#5eead4" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* System health */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="mb-4 text-sm font-semibold text-white">System Health</div>
          <div className="space-y-3">
            {[
              { label: "Firebase Auth", status: "operational", icon: Lock },
              { label: "Firestore", status: "operational", icon: Database },
              { label: "Gemini API", status: "operational", icon: Sparkles },
              { label: "Storage", status: "operational", icon: Server },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-center gap-2">
                  <s.icon className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white">{s.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-400 pulse-dot" />
                  <span className="text-xs text-teal-300">operational</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent signups */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <div className="text-sm font-semibold text-white">Recent Signups</div>
            <Badge tone="brand">Last 7 days</Badge>
          </div>
          <div className="divide-y divide-white/5">
            {mockCandidates.slice(0, 6).map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-5 py-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-xs font-semibold text-white">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{c.name}</div>
                  <div className="text-xs text-white/50">{c.email}</div>
                </div>
                <Badge tone="brand">candidate</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Active jobs */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <div className="text-sm font-semibold text-white">Top Active Jobs</div>
            <Badge tone="teal">{mockJobs.length} open</Badge>
          </div>
          <div className="divide-y divide-white/5">
            {mockJobs.slice(0, 6).map((j) => (
              <div key={j.id} className="flex items-center gap-3 px-5 py-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500/20 to-teal-400/20 text-xs font-semibold text-white">
                  {j.company.slice(0, 1)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{j.title}</div>
                  <div className="text-xs text-white/50">{j.company} · {j.applicantsCount} applicants</div>
                </div>
                <Badge tone="success">{j.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersPage() {
  return (
    <div>
      <PageHeader title="Users" description="Manage all platform users." />
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="grid grid-cols-12 gap-4 border-b border-white/5 px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-white/40">
          <div className="col-span-4">User</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Action</div>
        </div>
        <div className="divide-y divide-white/5">
          {mockCandidates.map((c) => (
            <div key={c.id} className="grid grid-cols-12 items-center gap-4 px-5 py-3">
              <div className="col-span-4 flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-xs font-semibold text-white">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="text-sm font-medium text-white">{c.name}</div>
              </div>
              <div className="col-span-3 text-xs text-white/60">{c.email}</div>
              <div className="col-span-2">
                <Badge tone="brand">candidate</Badge>
              </div>
              <div className="col-span-2">
                <Badge tone="success">active</Badge>
              </div>
              <div className="col-span-1 text-right">
                <button className="text-xs text-white/50 hover:text-white">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecruitersPage() {
  const recruiters = [
    { id: "r1", name: "Alex Rivera", email: "alex@nebulalabs.com", jobs: 4, hires: 12 },
    { id: "r2", name: "Sarah Kim", email: "sarah@lumenrobotics.com", jobs: 3, hires: 8 },
    { id: "r3", name: "Marcus Chen", email: "marcus@helioscloud.com", jobs: 2, hires: 6 },
    { id: "r4", name: "Priya Patel", email: "priya@orbitanalytics.com", jobs: 1, hires: 4 },
  ];
  return (
    <div>
      <PageHeader title="Recruiters" description="Manage recruiter accounts and permissions." />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {recruiters.map((r) => (
          <div key={r.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-sm font-semibold text-white">
                {r.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">{r.name}</div>
                <div className="text-xs text-white/50">{r.email}</div>
              </div>
              <Badge tone="brand">recruiter</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-center">
                <div className="text-lg font-semibold text-white">{r.jobs}</div>
                <div className="text-[10px] uppercase text-white/40">Active Jobs</div>
              </div>
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-center">
                <div className="text-lg font-semibold text-white">{r.hires}</div>
                <div className="text-[10px] uppercase text-white/40">Total Hires</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GlobalAnalytics() {
  const roleDistribution = [
    { role: "Frontend", count: 18 },
    { role: "Backend", count: 14 },
    { role: "AI/ML", count: 12 },
    { role: "Design", count: 8 },
    { role: "DevOps", count: 6 },
  ];

  const hiringVelocity = [
    { week: "W1", hires: 8 },
    { week: "W2", hires: 12 },
    { week: "W3", hires: 15 },
    { week: "W4", hires: 18 },
    { week: "W5", hires: 22 },
    { week: "W6", hires: 28 },
  ];

  return (
    <div>
      <PageHeader title="Global Analytics" description="Platform-wide hiring performance." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Hires" value={42} icon={<CheckCircle2 className="h-4 w-4" />} accent="teal" delta="+24% QoQ" />
        <StatCard label="Avg. Time to Hire" value="18d" icon={<Clock className="h-4 w-4" />} accent="brand" delta="-3d" />
        <StatCard label="Offer Acceptance" value="88%" icon={<CheckCircle2 className="h-4 w-4" />} accent="pink" />
        <StatCard label="Candidate NPS" value="72" icon={<Activity className="h-4 w-4" />} accent="amber" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="mb-4 text-sm font-semibold text-white">Hiring Velocity (Last 6 Weeks)</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hiringVelocity}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0d0d16", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="hires" fill="#7c5cff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="mb-4 text-sm font-semibold text-white">Hires by Role Type</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={roleDistribution} layout="vertical">
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="role" type="category" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: "#0d0d16", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#5eead4" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
        <div className="mb-4 text-sm font-semibold text-white">Platform Metrics</div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Resume Screens / day", value: "1,247" },
            { label: "AI Evaluations", value: "892" },
            { label: "Interviews Scheduled", value: "134" },
            { label: "Onboarding Active", value: mockOnboarding.length },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <div className="text-2xl font-semibold text-white">{m.value}</div>
              <div className="mt-1 text-xs text-white/50">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Platform configuration and security." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4 text-violet-300" />
            <h3 className="text-sm font-semibold text-white">General</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Platform Name", value: "SkillSnap" },
              { label: "Default Role", value: "Candidate" },
              { label: "Timezone", value: "UTC" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <span className="text-sm text-white/70">{s.label}</span>
                <span className="text-sm font-medium text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-4 w-4 text-teal-300" />
            <h3 className="text-sm font-semibold text-white">Security</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Two-Factor Auth", enabled: true },
              { label: "Email Verification", enabled: true },
              { label: "IP Whitelisting", enabled: false },
              { label: "Audit Logs", enabled: true },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <span className="text-sm text-white/70">{s.label}</span>
                <div className={`h-5 w-9 rounded-full ${s.enabled ? "bg-teal-500" : "bg-white/10"} relative transition`}>
                  <motion.div
                    className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow"
                    animate={{ x: s.enabled ? 16 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-300" />
            <h3 className="text-sm font-semibold text-white">AI Configuration</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              { label: "Gemini Model", value: "gemini-2.0-flash" },
              { label: "Temperature", value: "0.7" },
              { label: "Max Tokens", value: "2048" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="text-xs text-white/50">{s.label}</div>
                <div className="mt-1 text-sm font-medium text-white">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
