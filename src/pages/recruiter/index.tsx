import { Routes, Route } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Sparkles,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Calendar,
  MapPin,
  Clock,
  Star,
  Zap,
  Brain,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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
import {
  mockJobs,
  mockApplications,
  mockCandidates,
  mockInterviews,
  mockOnboarding,
  mockActivity,
} from "../../lib/mockData";
import { screenResume, rankCandidates, evaluateInterview } from "../../lib/ai";
import type { Application } from "../../lib/types";

export function RecruiterApp() {
  return (
    <DashboardLayout role="recruiter">
      <Routes>
        <Route index element={<RecruiterDashboard />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="candidates" element={<CandidatesPage />} />
        <Route path="screening" element={<ScreeningPage />} />
        <Route path="interviews" element={<InterviewsPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Routes>
    </DashboardLayout>
  );
}

function RecruiterDashboard() {
  const shortlisted = mockApplications.filter((a) =>
    ["shortlisted", "interviewed", "offered", "hired"].includes(a.status)
  ).length;
  const hired = mockApplications.filter((a) => a.status === "hired").length;
  const openJobs = mockJobs.filter((j) => j.status === "open").length;

  const pipeline = [
    { stage: "Applied", count: mockApplications.filter((a) => a.status === "applied").length },
    { stage: "Screening", count: mockApplications.filter((a) => a.status === "screening").length },
    { stage: "Shortlisted", count: mockApplications.filter((a) => a.status === "shortlisted").length },
    { stage: "Interviewed", count: mockApplications.filter((a) => a.status === "interviewed").length },
    { stage: "Offered", count: mockApplications.filter((a) => a.status === "offered").length },
    { stage: "Hired", count: mockApplications.filter((a) => a.status === "hired").length },
  ];

  const weeklyTrend = [
    { d: "Mon", apps: 12, hires: 1 },
    { d: "Tue", apps: 18, hires: 0 },
    { d: "Wed", apps: 24, hires: 2 },
    { d: "Thu", apps: 15, hires: 1 },
    { d: "Fri", apps: 28, hires: 3 },
    { d: "Sat", apps: 8, hires: 0 },
    { d: "Sun", apps: 5, hires: 0 },
  ];

  return (
    <div>
      <PageHeader
        title="Recruiter Dashboard"
        description="Your hiring pipeline at a glance."
        actions={
<motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="neon-glow btn-3d-press btn-glow btn-modern inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-teal-400 px-3 py-2 text-xs font-medium text-white shadow-lg shadow-violet-500/30"
          >
            <Plus className="h-3.5 w-3.5" /> Post a job
          </motion.button>
        }
      />

<motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        <motion.div 
          whileHover={{ y: -8, rotateX: 5, rotateY: -5 }} 
          transition={{ duration: 0.3 }}
          className="depth-card tilt-3d rounded-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(124,92,255,0.05) 0%, rgba(94,234,212,0.02) 100%)' }}
        >
          <StatCard label="Total Candidates" value={mockCandidates.length} icon={<Users className="h-4 w-4" />} accent="brand" />
        </motion.div>
        <motion.div 
          whileHover={{ y: -8, rotateX: 5, rotateY: -5 }} 
          transition={{ duration: 0.3 }}
          className="depth-card tilt-3d rounded-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(94,234,212,0.05) 0%, rgba(124,92,255,0.02) 100%)' }}
        >
          <StatCard label="Active Jobs" value={openJobs} icon={<Briefcase className="h-4 w-4" />} accent="teal" />
        </motion.div>
        <motion.div 
          whileHover={{ y: -8, rotateX: 5, rotateY: -5 }} 
          transition={{ duration: 0.3 }}
          className="depth-card tilt-3d rounded-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,126,182,0.05) 0%, rgba(124,92,255,0.02) 100%)' }}
        >
          <StatCard label="Shortlisted" value={shortlisted} icon={<Star className="h-4 w-4" />} accent="pink" />
        </motion.div>
        <motion.div 
          whileHover={{ y: -8, rotateX: 5, rotateY: -5 }} 
          transition={{ duration: 0.3 }}
          className="depth-card tilt-3d rounded-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(255,126,182,0.02) 100%)' }}
        >
          <StatCard label="Hired" value={hired} icon={<CheckCircle2 className="h-4 w-4" />} accent="amber" delta="+12% vs last month" />
        </motion.div>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Hiring funnel */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Hiring Funnel</div>
              <div className="text-xs text-white/50">Conversion across stages</div>
            </div>
            <Badge tone="brand">Live</Badge>
          </div>
          <div className="space-y-2">
            {pipeline.map((p, i) => {
              const max = Math.max(...pipeline.map((x) => x.count));
              const pct = max ? (p.count / max) * 100 : 0;
              return (
                <div key={p.stage}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-white/70">{p.stage}</span>
                    <span className="font-medium text-white">{p.count}</span>
                  </div>
                  <div className="relative h-7 overflow-hidden rounded-lg border border-white/5 bg-white/[0.02]">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-lg"
                      style={{
                        background: `linear-gradient(90deg, rgba(124,92,255,${0.4 + i * 0.08}) 0%, rgba(94,234,212,${0.4 + i * 0.08}) 100%)`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08 }}
                    />
                    <div className="absolute inset-0 flex items-center px-3 text-[11px] font-medium text-white/80">
                      {p.stage} · {p.count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly trend */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="mb-4 text-sm font-semibold text-white">Weekly Activity</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c5cff" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#7c5cff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#0d0d16", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="apps" stroke="#7c5cff" strokeWidth={2} fill="url(#a1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Top candidates */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-300" />
              <span className="text-sm font-semibold text-white">Top AI-ranked candidates</span>
            </div>
            <a href="#/recruiter/candidates" className="text-xs text-violet-300 hover:text-violet-200">View all →</a>
          </div>
          <div className="divide-y divide-white/5">
            {mockCandidates
              .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))
              .slice(0, 5)
              .map((c) => (
                <div key={c.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-xs font-semibold text-white">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{c.name}</div>
                    <div className="text-xs text-white/50">{c.title} · {c.experience}y exp · {c.location}</div>
                  </div>
                  <div className="hidden flex-wrap gap-1 md:flex">
                    {c.skills.slice(0, 3).map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">{c.aiScore}</div>
                    <div className="text-[10px] uppercase text-white/40">AI Score</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="mb-4 text-sm font-semibold text-white">Live activity</div>
          <div className="space-y-3">
            {mockActivity.map((a) => {
              const colors: Record<string, string> = {
                apply: "bg-violet-500/10 text-violet-300 border-violet-500/20",
                ai: "bg-teal-500/10 text-teal-300 border-teal-500/20",
                shortlist: "bg-amber-500/10 text-amber-300 border-amber-500/20",
                interview: "bg-pink-500/10 text-pink-300 border-pink-500/20",
                job: "bg-sky-500/10 text-sky-300 border-sky-500/20",
                onboard: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
              };
              return (
                <div key={a.id} className="flex items-start gap-3 text-xs">
                  <div className={`mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-md border ${colors[a.type]}`}>
                    {a.type === "ai" ? <Sparkles className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-white/80">
                      <span className="font-medium text-white">{a.who}</span> {a.action}{" "}
                      <span className="text-white">{a.target}</span>
                    </div>
                    <div className="mt-0.5 text-[10px] text-white/40">{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function JobsPage() {
  const [query, setQuery] = useState("");
  const filtered = mockJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.company.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Manage all open roles and their applicant pools."
        actions={
          <>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40 group-hover:text-white/60 transition" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs..."
                className="w-56 rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none transition-all"
              />
            </div>
            <button className="btn-glow btn-modern inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 px-3 py-2 text-xs font-medium text-white">
              <Plus className="h-3.5 w-3.5" /> New job
            </button>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
{filtered.map((j, i) => (
          <motion.div
            key={j.id}
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -10, rotateX: 3, rotateY: -3, scale: 1.02 }}
            className="holographic depth-card rounded-2xl border border-white/5 bg-white/[0.02] p-5"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="mb-3 flex items-center justify-between">
              <Badge tone={j.status === "open" ? "success" : "default"}>{j.status}</Badge>
              <span className="text-xs text-white/50">{j.applicantsCount} applicants</span>
            </div>
            <div className="text-sm font-semibold text-white">{j.title}</div>
            <div className="text-xs text-white/50">{j.company}</div>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/60">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {j.type}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {j.skills.slice(0, 3).map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
            <button className="btn-glow btn-modern mt-4 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] py-2 text-xs text-white">
              View applicants <ChevronRight className="h-3 w-3" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CandidatesPage() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "experience">("score");

  const filtered = useMemo(() => {
    const list = mockCandidates.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(query.toLowerCase())) ||
        c.title.toLowerCase().includes(query.toLowerCase())
    );
    return list.sort((a, b) =>
      sortBy === "score" ? (b.aiScore ?? 0) - (a.aiScore ?? 0) : b.experience - a.experience
    );
  }, [query, sortBy]);

  return (
    <div>
      <PageHeader
        title="Candidates"
        description="Browse all candidates with AI-ranked scores."
        actions={
          <>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40 group-hover:text-white/60 transition" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or skill..."
                className="w-64 rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none transition-all"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white focus:border-violet-500/40 focus:outline-none"
            >
              <option value="score">Sort by AI Score</option>
              <option value="experience">Sort by Experience</option>
            </select>
          </>
        }
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]"
      >
        <div className="grid grid-cols-12 gap-4 border-b border-white/5 px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-white/40">
          <div className="col-span-4">Candidate</div>
          <div className="col-span-3">Skills</div>
          <div className="col-span-2">Experience</div>
          <div className="col-span-2">AI Score</div>
          <div className="col-span-1 text-right">Rank</div>
        </div>
        <div className="divide-y divide-white/5">
{filtered.map((c, i) => (
            <motion.div 
              key={c.id} 
              initial={{ opacity: 0, x: -30, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ 
                x: 6, 
                rotateY: 5,
                scale: 1.01,
                backgroundColor: "rgba(255,255,255,0.04)",
                boxShadow: "0 10px 40px -10px rgba(124,92,255,0.3)"
              }}
              className="magnetic depth-card grid grid-cols-12 items-center gap-4 px-5 py-3 cursor-pointer rounded-xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-xs font-semibold text-white">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{c.name}</div>
                  <div className="text-xs text-white/50">{c.title} · {c.location}</div>
                </div>
              </div>
              <div className="col-span-3 flex flex-wrap gap-1">
                {c.skills.slice(0, 3).map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
              <div className="col-span-2 text-xs text-white/70">{c.experience} years</div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400"
                      style={{ width: `${c.aiScore}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${c.aiScore}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                    />
                  </div>
                  <span className="text-xs font-medium text-white">{c.aiScore}</span>
                </div>
              </div>
              <div className="col-span-1 text-right">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-medium text-white/70">
                  {i + 1}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ScreeningPage() {
  const targetJob = mockJobs[0]; // Senior Frontend Engineer
  const jobApplications = mockApplications.filter((a) => a.jobId === targetJob.id);
  const ranked = useMemo(() => rankCandidates(jobApplications, targetJob.skills), [jobApplications]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [screening, setScreening] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runScreening = async (app: Application) => {
    setSelected(app);
    setLoading(true);
    setScreening(null);
    const result = await screenResume(
      {
        name: app.candidateName,
        skills: app.skills,
        experience: app.experience,
      },
      { title: targetJob.title, skills: targetJob.skills, requirements: targetJob.requirements }
    );
    setScreening(result);
    setLoading(false);
  };

  return (
    <div>
      <PageHeader
        title="AI Screening"
        description={`Screening candidates for ${targetJob.title} · ${targetJob.company}`}
        actions={
          <Badge tone="brand">
            <Brain className="h-3 w-3" /> Gemini-powered
          </Badge>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Ranked list */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-white">AI-ranked applicants</div>
            <Badge tone="teal">{ranked.length} ranked</Badge>
          </div>
          <div className="space-y-2">
            {ranked.map((r) => {
              const isActive = selected?.id === r.candidate.id;
              const fitColor =
                r.fit === "excellent"
                  ? "teal"
                  : r.fit === "good"
                    ? "brand"
                    : r.fit === "average"
                      ? "warning"
                      : "danger";
              return (
                <button
                  key={r.candidate.id}
                  onClick={() => runScreening(r.candidate)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    isActive
                      ? "border-violet-500/40 bg-violet-500/5"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-white/70">
                      #{r.rank}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{r.candidate.candidateName}</div>
                      <div className="mt-0.5 text-[11px] text-white/50">{r.candidate.experience}y exp · {r.candidate.skills.slice(0, 3).join(", ")}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">{r.score}</div>
                      <Badge tone={fitColor}>{r.fit}</Badge>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Screening report */}
        <div className="lg:col-span-3">
          {!selected && !loading && (
            <div className="grid h-full min-h-[400px] place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
              <div>
                <Brain className="mx-auto h-10 w-10 text-white/30" />
                <div className="mt-3 text-sm font-medium text-white">Select a candidate to screen</div>
                <div className="mt-1 text-xs text-white/50">AI will generate a detailed screening report.</div>
              </div>
            </div>
          )}

          {loading && (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                <span className="text-sm text-white/70">Analyzing resume with Gemini…</span>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-2/3 rounded shimmer" />
                <div className="h-4 w-full rounded shimmer" />
                <div className="h-4 w-5/6 rounded shimmer" />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="h-24 rounded-lg shimmer" />
                  <div className="h-24 rounded-lg shimmer" />
                </div>
              </div>
            </div>
          )}

          {screening && selected && !loading && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d0d16] to-[#05050a] p-6"
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-teal-400">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">AI Screening Report</div>
                      <div className="text-[11px] text-white/50">{selected.candidateName} · {selected.jobTitle}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{screening.score}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">AI Score</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-1 text-[10px] uppercase tracking-wider text-white/40">Recruiter Summary</div>
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-sm leading-relaxed text-white/80">
                  {screening.summary}
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-wider text-teal-300">Matched Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {screening.matchedSkills.map((s: string) => (
                      <Badge key={s} tone="teal">{s}</Badge>
                    ))}
                    {screening.matchedSkills.length === 0 && <span className="text-xs text-white/40">None</span>}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-wider text-amber-300">Missing Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {screening.missingSkills.map((s: string) => (
                      <Badge key={s} tone="warning">{s}</Badge>
                    ))}
                    {screening.missingSkills.length === 0 && <span className="text-xs text-white/40">None</span>}
                  </div>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-3">
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-teal-300">Strengths</div>
                  <ul className="space-y-1 text-xs text-white/80">
                    {screening.strengths.map((s: string) => (
                      <li key={s} className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-teal-400" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-amber-300">Concerns</div>
                  <ul className="space-y-1 text-xs text-white/80">
                    {screening.weaknesses.map((s: string) => (
                      <li key={s} className="flex items-start gap-1.5">
                        <XCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-400" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-violet-300">
                  <Zap className="h-3 w-3" /> Recommendation
                </div>
                <div className="text-sm font-medium text-white">{screening.recommendation}</div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 px-3 py-2 text-xs font-medium text-white transition hover:shadow-lg hover:shadow-teal-500/20">
                  Shortlist
                </button>
                <button className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10">
                  Schedule Interview
                </button>
                <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition hover:bg-white/10">
                  Reject
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function InterviewsPage() {
  const [evaluating, setEvaluating] = useState<string | null>(null);
  const [evalResult, setEvalResult] = useState<any>(null);
  const [transcript, setTranscript] = useState(
    "I've been working with React and TypeScript for about six years now. At my last role, I led a migration from class components to hooks and introduced a component library that's now used by 14 teams. I'm comfortable with system design, especially around performance and state management at scale. I'm excited about this role because it combines technical depth with product ownership."
  );

  const runEval = async () => {
    setEvaluating("now");
    setEvalResult(null);
    const r = await evaluateInterview(transcript);
    setEvalResult(r);
    setEvaluating(null);
  };

  return (
    <div>
      <PageHeader
        title="Interviews"
        description="Schedule, run, and evaluate candidate interviews."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 px-3 py-2 text-xs font-medium text-white">
            <Plus className="h-3.5 w-3.5" /> Schedule interview
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Upcoming & completed */}
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="border-b border-white/5 px-5 py-3 text-sm font-semibold text-white">Upcoming</div>
            <div className="divide-y divide-white/5">
              {mockInterviews.filter((i) => i.status === "scheduled").map((iv) => (
                <div key={iv.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5">
                    <Calendar className="h-4 w-4 text-amber-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{iv.candidateName}</div>
                    <div className="text-xs text-white/50">{iv.role} · {new Date(iv.scheduledAt).toLocaleString()}</div>
                  </div>
                  <Badge tone="warning">scheduled</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="border-b border-white/5 px-5 py-3 text-sm font-semibold text-white">Completed</div>
            <div className="divide-y divide-white/5">
              {mockInterviews.filter((i) => i.status === "completed").map((iv) => (
                <div key={iv.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-xs font-semibold text-white">
                    {iv.candidateName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{iv.candidateName}</div>
                    <div className="text-xs text-white/50">{iv.role}</div>
                  </div>
                  {iv.overallScore && (
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">{iv.overallScore}</div>
                      <div className="text-[10px] text-white/40">overall</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Interview evaluator */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d0d16] to-[#05050a] p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-teal-400">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">AI Interview Evaluator</div>
                <div className="text-[11px] text-white/50">Paste a transcript or candidate answers for instant evaluation.</div>
              </div>
            </div>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={7}
              className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none"
              placeholder="Paste interview transcript..."
            />
            <button
              onClick={runEval}
              disabled={evaluating === "now"}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 px-3 py-2 text-xs font-medium text-white shadow-lg shadow-violet-500/20 transition hover:shadow-violet-500/40 disabled:opacity-60"
            >
              {evaluating ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" /> Evaluate with AI
                </>
              )}
            </button>

            {evalResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 space-y-4"
              >
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { l: "Communication", v: evalResult.communicationScore },
                    { l: "Confidence", v: evalResult.confidenceScore },
                    { l: "Technical", v: evalResult.technicalScore },
                    { l: "Overall", v: evalResult.overallScore },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
                      <div className="text-[10px] uppercase tracking-wider text-white/40">{s.l}</div>
                      <div className="mt-1 text-2xl font-bold text-white">{s.v}</div>
                      <div className="mt-1 h-1 rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400"
                          style={{ width: `${s.v}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-violet-300">
                    <Zap className="h-3 w-3" /> Recommendation
                  </div>
                  <div className="text-sm font-medium text-white">{evalResult.recommendation}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-3">
                    <div className="mb-2 text-[10px] uppercase tracking-wider text-teal-300">Highlights</div>
                    <ul className="space-y-1 text-xs text-white/80">
                      {evalResult.highlights.map((h: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-teal-400" /> {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                    <div className="mb-2 text-[10px] uppercase tracking-wider text-amber-300">Concerns</div>
                    <ul className="space-y-1 text-xs text-white/80">
                      {evalResult.concerns.map((h: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <XCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-400" /> {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingPage() {
  return (
    <div>
      <PageHeader title="Onboarding" description="Track document verification and joining status for selected candidates." />
      <div className="grid grid-cols-1 gap-3">
        {mockOnboarding.map((o) => {
          const docs = [
            { key: "idDoc" as const, label: "Government ID" },
            { key: "offerLetter" as const, label: "Offer Letter" },
            { key: "education" as const, label: "Education" },
            { key: "backgroundCheck" as const, label: "Background Check" },
          ];
          const progress = docs.filter((d) => o.documents[d.key] === "approved").length;
          return (
            <div key={o.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-xs font-semibold text-white">
                    {o.candidateName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{o.candidateName}</div>
                    <div className="text-xs text-white/50">{o.role} · {o.company} · Joins {o.joiningDate}</div>
                  </div>
                </div>
                <Badge
                  tone={
                    o.overallStatus === "approved"
                      ? "success"
                      : o.overallStatus === "rejected"
                        ? "danger"
                        : o.overallStatus === "under_review"
                          ? "warning"
                          : "default"
                  }
                >
                  {o.overallStatus.replace("_", " ")}
                </Badge>
              </div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400"
                    style={{ width: `${(progress / docs.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-white/60">{progress}/{docs.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {docs.map((d) => {
                  const s = o.documents[d.key];
                  return (
                    <div key={d.key} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                      <div className="text-xs font-medium text-white">{d.label}</div>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] capitalize text-white/60">
                        {s === "approved" ? <CheckCircle2 className="h-3 w-3 text-teal-400" /> :
                         s === "rejected" ? <XCircle className="h-3 w-3 text-rose-400" /> :
                         s === "under_review" ? <Clock className="h-3 w-3 text-amber-400" /> :
                         <Clock className="h-3 w-3 text-white/30" />}
                        {s.replace("_", " ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const scoreDistribution = [
    { range: "55-65", count: 18 },
    { range: "65-75", count: 32 },
    { range: "75-85", count: 28 },
    { range: "85-95", count: 14 },
  ];
  const skills = [
    { name: "React", value: 42, color: "#7c5cff" },
    { name: "TypeScript", value: 38, color: "#5eead4" },
    { name: "Python", value: 28, color: "#ff7eb6" },
    { name: "Node.js", value: 22, color: "#22d3ee" },
    { name: "Go", value: 12, color: "#f59e0b" },
  ];
  const trend = [
    { month: "Sep", hires: 8, apps: 120 },
    { month: "Oct", hires: 12, apps: 160 },
    { month: "Nov", hires: 15, apps: 180 },
    { month: "Dec", hires: 10, apps: 140 },
    { month: "Jan", hires: 22, apps: 240 },
    { month: "Feb", hires: 28, apps: 310 },
  ];

  return (
    <div>
      <PageHeader title="Analytics" description="Hiring performance and pipeline intelligence." />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="card-glow">
          <StatCard label="Total Candidates" value={mockCandidates.length} icon={<Users className="h-4 w-4" />} accent="brand" delta="+18% MoM" />
        </motion.div>
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="card-glow">
          <StatCard label="Selected" value={42} icon={<CheckCircle2 className="h-4 w-4" />} accent="teal" delta="+24%" />
        </motion.div>
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="card-glow">
          <StatCard label="Rejected" value={186} icon={<XCircle className="h-4 w-4" />} accent="pink" />
        </motion.div>
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="card-glow">
          <StatCard label="Avg. Time to Hire" value="18d" icon={<Clock className="h-4 w-4" />} accent="amber" delta="-3d vs Q3" />
        </motion.div>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="mb-4 text-sm font-semibold text-white">Recruitment Trend</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0d0d16", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="apps" stroke="#7c5cff" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="hires" stroke="#5eead4" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="mb-4 text-sm font-semibold text-white">Candidate Score Distribution</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="range" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0d0d16", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#7c5cff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="mb-4 text-sm font-semibold text-white">Top Skills Across Candidates</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={skills}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                {skills.map((s) => (
                  <Cell key={s.name} fill={s.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0d0d16", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 flex flex-wrap gap-3">
            {skills.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-white/70">
                <div className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.name}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="mb-4 text-sm font-semibold text-white">Pipeline Health</div>
          <div className="space-y-4">
            {[
              { label: "Application → Screening", value: 68 },
              { label: "Screening → Shortlist", value: 42 },
              { label: "Shortlist → Interview", value: 71 },
              { label: "Interview → Offer", value: 55 },
              { label: "Offer → Hired", value: 88 },
            ].map((r) => (
              <div key={r.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-white/70">{r.label}</span>
                  <span className="font-medium text-white">{r.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400"
                    style={{ width: `${r.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
