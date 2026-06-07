import { Routes, Route } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Briefcase, Sparkles, CheckCircle2, XCircle, Plus, Search,
  Calendar, MapPin, Clock, Zap, Brain, ChevronRight, X, DollarSign,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { DashboardLayout, PageHeader } from "../../components/DashboardLayout";
import { StatCard, Badge } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { screenResume, rankCandidates, evaluateInterview } from "../../lib/ai";
import type { Application } from "../../lib/types";
import type { FirestoreJob, FirestoreApplication, FirestoreUser, FirestoreInterview, FirestoreOnboarding } from "../../types/firestore";
import { getJobsByRecruiter, getOpenJobs, createJob } from "../../services/jobService";
import { getApplicationsByRecruiter, getApplicationsByJob, updateApplicationStatus } from "../../services/applicationService";
import { getUsersByRole } from "../../services/userService";
import { getInterviewsByRecruiter, createInterview } from "../../services/interviewService";
import { getAllOnboarding } from "../../services/onboardingService";

export function RecruiterApp() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<FirestoreJob[]>([]);
  const [allJobs, setAllJobs] = useState<FirestoreJob[]>([]);
  const [applications, setApplications] = useState<FirestoreApplication[]>([]);
  const [candidates, setCandidates] = useState<FirestoreUser[]>([]);
  const [interviews, setInterviews] = useState<FirestoreInterview[]>([]);
  const [onboarding, setOnboarding] = useState<FirestoreOnboarding[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    if (!user?.uid) return;
    try {
      const [recruiterJobs, openJobs, appsData, candidatesData, interviewData, onboardingData] = await Promise.all([
        getJobsByRecruiter(user.uid),
        getOpenJobs(),
        getApplicationsByRecruiter(user.uid),
        getUsersByRole("candidate"),
        getInterviewsByRecruiter(user.uid),
        getAllOnboarding(),
      ]);
      setJobs(recruiterJobs);
      setAllJobs(openJobs);
      setApplications(appsData);
      setCandidates(candidatesData);
      setInterviews(interviewData);
      setOnboarding(onboardingData);
    } catch (error) {
      console.error("Error fetching recruiter data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [user?.uid]);

  const shortlistCount = applications.filter((a) => ["shortlisted", "interviewed", "offered", "hired"].includes(a.status)).length;
  const hiredCount = applications.filter((a) => a.status === "hired").length;
  const openJobCount = jobs.filter((j) => j.status === "open").length;

  const pipeline = [
    { stage: "Applied", count: applications.filter((a) => a.status === "applied").length },
    { stage: "Screening", count: applications.filter((a) => a.status === "screening").length },
    { stage: "Shortlisted", count: applications.filter((a) => a.status === "shortlisted").length },
    { stage: "Interviewed", count: applications.filter((a) => a.status === "interviewed").length },
    { stage: "Offered", count: applications.filter((a) => a.status === "offered").length },
    { stage: "Hired", count: applications.filter((a) => a.status === "hired").length },
  ];

  return (
    <DashboardLayout role="recruiter">
      <Routes>
        <Route index element={<RecruiterDashboard candidates={candidates} jobs={allJobs} applications={applications} pipeline={pipeline} shortlistCount={shortlistCount} hiredCount={hiredCount} openJobCount={openJobCount} interviews={interviews} />} />
        <Route path="jobs" element={<JobsPage jobs={jobs} recruiterId={user?.uid ?? ""} onRefresh={fetchAll} />} />
        <Route path="candidates" element={<CandidatesPage candidates={candidates} applications={applications} jobs={jobs} />} />
        <Route path="screening" element={<ScreeningPage applications={applications} jobs={jobs} onStatusChange={fetchAll} />} />
        <Route path="interviews" element={<InterviewsPage interviews={interviews} applications={applications} recruiterId={user?.uid ?? ""} onRefresh={fetchAll} />} />
        <Route path="onboarding" element={<OnboardingPage onboarding={onboarding} />} />
        <Route path="analytics" element={<AnalyticsPage candidates={candidates} applications={applications} jobs={jobs} />} />
      </Routes>
    </DashboardLayout>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────── */
function RecruiterDashboard({ candidates, jobs, applications, pipeline, shortlistCount, hiredCount, openJobCount, interviews }: any) {
  const weeklyTrend = [
    { d: "Mon", apps: 12, hires: 1 }, { d: "Tue", apps: 18, hires: 0 },
    { d: "Wed", apps: 24, hires: 2 }, { d: "Thu", apps: 15, hires: 1 },
    { d: "Fri", apps: 28, hires: 3 }, { d: "Sat", apps: 8, hires: 0 }, { d: "Sun", apps: 5, hires: 0 },
  ];
  return (
    <div>
      <PageHeader title="Recruiter Dashboard" description="Your hiring pipeline at a glance." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Candidates" value={candidates.length} icon={<Users className="h-4 w-4" />} accent="brand" />
        <StatCard label="Active Jobs" value={openJobCount} icon={<Briefcase className="h-4 w-4" />} accent="teal" />
        <StatCard label="Shortlisted" value={shortlistCount} icon={<CheckCircle2 className="h-4 w-4" />} accent="pink" />
        <StatCard label="Hired" value={hiredCount} icon={<Sparkles className="h-4 w-4" />} accent="amber" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 lg:col-span-2">
          <div className="mb-4 text-sm font-semibold text-white">Weekly Activity</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7c5cff" stopOpacity={0.3} /><stop offset="95%" stopColor="#7c5cff" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="d" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0d0d16", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="apps" stroke="#7c5cff" strokeWidth={2} fill="url(#ag)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="mb-4 text-sm font-semibold text-white">Pipeline</div>
          <div className="space-y-2">
            {pipeline.map((p: any) => (
              <div key={p.stage}>
                <div className="mb-1 flex justify-between text-xs text-white/60">
                  <span>{p.stage}</span><span className="text-white font-medium">{p.count}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400" style={{ width: `${Math.min(100, p.count * 10)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="border-b border-white/5 px-5 py-4 text-sm font-semibold text-white">Recent Applications</div>
        <div className="divide-y divide-white/5">
          {applications.length === 0 ? (
            <div className="px-5 py-6 text-center text-sm text-white/40">No applications yet. Post a job to get started.</div>
          ) : applications.slice(0, 5).map((a: FirestoreApplication) => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3">
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{a.candidateName || "Candidate"}</div>
                <div className="text-xs text-white/50">{a.jobTitle} · {a.company}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/40">{a.aiScore || 0} score</span>
                <Badge tone={statusTone(a.status)}>{a.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Create Job Modal ────────────────────────────────────────── */
function CreateJobModal({ recruiterId, onCreated, onClose }: { recruiterId: string; onCreated: () => void; onClose: () => void }) {
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [reqInput, setReqInput] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);

  const addSkill = () => { const s = skillInput.trim(); if (s && !skills.includes(s)) setSkills((p) => [...p, s]); setSkillInput(""); };
  const addReq = () => { const r = reqInput.trim(); if (r) setRequirements((p) => [...p, r]); setReqInput(""); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !location || !description) { showError("Please fill all required fields."); return; }
    if (skills.length === 0) { showError("Add at least one required skill."); return; }
    setSaving(true);
    try {
      await createJob({
        title, company, location,
        type: type as any, salary, experience,
        description, skills, requirements,
        recruiterId: user?.uid ?? recruiterId,
        postedBy: user?.name ?? "Recruiter",
        status: "open",
      });
      showSuccess(`Job "${title}" posted successfully!`);
      onCreated();
      onClose();
    } catch {
      showError("Failed to create job. Check Firestore rules.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0d16] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Post a New Job</h2>
            <p className="text-sm text-white/50 mt-1">Fill in the details to publish this role.</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FField label="Job Title *" value={title} onChange={setTitle} placeholder="Senior Frontend Engineer" />
            <FField label="Company *" value={company} onChange={setCompany} placeholder="Acme Corp" />
            <FField label="Location *" value={location} onChange={setLocation} placeholder="Mumbai, India / Remote" />
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">Employment Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-violet-500/40 focus:outline-none">
                {["Full-time", "Part-time", "Contract", "Remote"].map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
            <FField label="Salary Range" value={salary} onChange={setSalary} placeholder="$80k–$120k" />
            <FField label="Experience Required" value={experience} onChange={setExperience} placeholder="3–5 years" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">Job Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Describe the role, responsibilities, and team..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">Required Skills *</label>
            <div className="flex gap-2 mb-2">
              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Type a skill and press Enter" className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none" />
              <button type="button" onClick={addSkill} className="rounded-lg bg-violet-500/20 px-3 py-2 text-violet-300 hover:bg-violet-500/30"><Plus className="h-4 w-4" /></button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (<span key={s} className="inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-200">{s}<button type="button" onClick={() => setSkills((p) => p.filter((x) => x !== s))}><X className="h-3 w-3" /></button></span>))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">Requirements</label>
            <div className="flex gap-2 mb-2">
              <input value={reqInput} onChange={(e) => setReqInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addReq())}
                placeholder="Add a requirement" className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none" />
              <button type="button" onClick={addReq} className="rounded-lg bg-white/5 px-3 py-2 text-white/60 hover:bg-white/10"><Plus className="h-4 w-4" /></button>
            </div>
            <div className="space-y-1">
              {requirements.map((r, i) => (<div key={i} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-white/70"><span className="flex-1">{r}</span><button type="button" onClick={() => setRequirements((p) => p.filter((_, j) => j !== i))}><X className="h-3 w-3 text-white/30 hover:text-white/60" /></button></div>))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-sm text-white hover:bg-white/[0.07]">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
              {saving ? "Publishing…" : "Publish Job"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function FField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/60 mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none" />
    </div>
  );
}

/* ─── Jobs Page ───────────────────────────────────────────────── */
function JobsPage({ jobs, recruiterId, onRefresh }: { jobs: FirestoreJob[]; recruiterId: string; onRefresh: () => void }) {
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const filtered = jobs.filter((j) => j.title.toLowerCase().includes(query.toLowerCase()) || j.company?.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <AnimatePresence>{showCreate && <CreateJobModal recruiterId={recruiterId} onCreated={onRefresh} onClose={() => setShowCreate(false)} />}</AnimatePresence>
      <PageHeader title="Jobs" description="Manage your posted roles." actions={
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search jobs..." className="w-56 rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none" />
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-glow inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 px-3 py-2 text-xs font-medium text-white">
            <Plus className="h-3.5 w-3.5" /> New job
          </button>
        </>
      } />
      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
          <Briefcase className="mx-auto h-8 w-8 text-white/30" />
          <div className="mt-3 text-sm text-white/60">No jobs posted yet.</div>
          <button onClick={() => setShowCreate(true)} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-violet-500/20 px-4 py-2 text-sm text-violet-300 hover:bg-violet-500/30">
            <Plus className="h-3.5 w-3.5" /> Post your first job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((j) => (
            <div key={j.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="mb-3 flex items-center justify-between">
                <Badge tone={j.status === "open" ? "success" : "default"}>{j.status}</Badge>
                <span className="text-xs text-white/50">{j.applicantsCount} applicants</span>
              </div>
              <div className="text-sm font-semibold text-white">{j.title}</div>
              <div className="text-xs text-white/50">{j.company}</div>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/60">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {j.type}</span>
                {j.salary && <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" /> {j.salary}</span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">{j.skills.slice(0, 3).map((s) => (<Badge key={s}>{s}</Badge>))}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Candidates Page ─────────────────────────────────────────── */
function CandidatesPage({ candidates, applications, jobs }: { candidates: FirestoreUser[]; applications: FirestoreApplication[]; jobs: FirestoreJob[] }) {
  const [query, setQuery] = useState("");
  const filtered = candidates.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div>
      <PageHeader title="Candidates" description="All registered candidates." actions={
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name..." className="w-64 rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none" />
        </div>
      } />
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="grid grid-cols-12 gap-4 border-b border-white/5 px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-white/40">
          <div className="col-span-4">Candidate</div>
          <div className="col-span-3">Skills</div>
          <div className="col-span-2">Experience</div>
          <div className="col-span-3">Applications</div>
        </div>
        {filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-white/40">No candidates registered yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((c) => {
              const cApps = applications.filter((a) => a.candidateId === c.uid);
              return (
                <div key={c.uid} className="grid grid-cols-12 items-center gap-4 px-5 py-3">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-xs font-semibold text-white">
                      {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{c.name}</div>
                      <div className="text-xs text-white/50">{c.email}</div>
                    </div>
                  </div>
                  <div className="col-span-3 flex flex-wrap gap-1">
                    {(c.skills ?? []).slice(0, 2).map((s) => (<Badge key={s}>{s}</Badge>))}
                    {!c.skills?.length && <span className="text-xs text-white/30">No skills added</span>}
                  </div>
                  <div className="col-span-2 text-xs text-white/70">{c.experience ?? "—"} yrs</div>
                  <div className="col-span-3">
                    <Badge tone="brand">{cApps.length} applied</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Screening Page ──────────────────────────────────────────── */
function ScreeningPage({ applications, jobs, onStatusChange }: { applications: FirestoreApplication[]; jobs: FirestoreJob[]; onStatusChange: () => void }) {
  const { showSuccess, showError } = useToast();
  const [selectedJob, setSelectedJob] = useState<FirestoreJob | null>(jobs[0] ?? null);
  const [selected, setSelected] = useState<FirestoreApplication | null>(null);
  const [screening, setScreening] = useState<any>(null);
  const [loadingScreen, setLoadingScreen] = useState(false);

  useEffect(() => { if (!selectedJob && jobs[0]) setSelectedJob(jobs[0]); }, [jobs]);

  const jobApplications = applications.filter((a) => a.jobId === selectedJob?.id);
  const ranked = useMemo(() => {
    if (!selectedJob) return [];
    return rankCandidates(jobApplications as unknown as Application[], selectedJob.skills || []);
  }, [jobApplications, selectedJob]);

  const runScreening = async (app: FirestoreApplication) => {
    if (!selectedJob) return;
    setSelected(app);
    setLoadingScreen(true);
    setScreening(null);
    const result = await screenResume(
      { name: app.candidateName ?? "Candidate", skills: app.skills ?? [], experience: app.experience ?? 0 },
      { title: selectedJob.title, skills: selectedJob.skills, requirements: selectedJob.requirements ?? [] }
    );
    setScreening(result);
    setLoadingScreen(false);
  };

  const handleAction = async (action: "shortlisted" | "rejected", appId: string) => {
    try {
      await updateApplicationStatus(appId, action);
      showSuccess(`Candidate ${action === "shortlisted" ? "shortlisted" : "rejected"}.`);
      onStatusChange();
    } catch { showError("Failed to update status."); }
  };

  return (
    <div>
      <PageHeader title="AI Screening" description="AI-ranked applicants with Gemini screening reports." actions={<Badge tone="brand"><Brain className="h-3 w-3" /> Gemini-powered</Badge>} />
      {jobs.length > 0 && (
        <div className="mb-4">
          <select value={selectedJob?.id ?? ""} onChange={(e) => setSelectedJob(jobs.find((j) => j.id === e.target.value) ?? null)}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-violet-500/40 focus:outline-none">
            {jobs.map((j) => (<option key={j.id} value={j.id}>{j.title} — {j.company}</option>))}
          </select>
        </div>
      )}
      {!selectedJob ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
          <Brain className="mx-auto h-8 w-8 text-white/30" />
          <div className="mt-3 text-sm text-white/60">Post a job first to start screening applicants.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-white">AI-ranked applicants</div>
              <Badge tone="teal">{ranked.length} total</Badge>
            </div>
            {jobApplications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-white/40">No applications yet for this job.</div>
            ) : ranked.map((r, i) => {
              const app = jobApplications.find((a) => a.candidateId === (r.candidate as any).candidateId);
              const isActive = selected?.id === app?.id;
              const fitColor = r.fit === "excellent" ? "teal" : r.fit === "good" ? "brand" : r.fit === "average" ? "warning" : "danger";
              return (
                <button key={i} onClick={() => app && runScreening(app)} className={`w-full rounded-xl border p-3 text-left transition ${isActive ? "border-violet-500/40 bg-violet-500/5" : "border-white/5 bg-white/[0.02] hover:border-white/10"}`}>
                  <div className="flex items-start gap-3">
                    <div className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-white/70">#{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{(r.candidate as any).candidateName || "Candidate"}</div>
                      <div className="text-[11px] text-white/50">{(r.candidate as any).experience || 0}y exp</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-white">{r.score}</div>
                      <Badge tone={fitColor}>{r.fit}</Badge>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="lg:col-span-3">
            {!selected && !loadingScreen && (
              <div className="grid h-full min-h-[300px] place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
                <div><Brain className="mx-auto h-10 w-10 text-white/30" /><div className="mt-3 text-sm text-white">Select a candidate to screen</div></div>
              </div>
            )}
            {loadingScreen && (
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <div className="flex items-center gap-2 mb-4"><div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /><span className="text-sm text-white/70">Analyzing with Gemini…</span></div>
                <div className="space-y-3"><div className="h-4 w-2/3 rounded shimmer" /><div className="h-4 w-full rounded shimmer" /><div className="h-4 w-5/6 rounded shimmer" /></div>
              </div>
            )}
            {screening && selected && !loadingScreen && (
              <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d0d16] to-[#05050a] p-6">
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-teal-400"><Sparkles className="h-4 w-4 text-white" /></div>
                    <div><div className="text-sm font-semibold text-white">AI Screening Report</div><div className="text-[11px] text-white/50">{selected.candidateName}</div></div>
                  </div>
                  <div className="text-right"><div className="text-3xl font-bold text-white">{screening.score}</div><div className="text-[10px] uppercase tracking-wider text-white/40">AI Score</div></div>
                </div>
                <div className="mb-4 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-sm leading-relaxed text-white/80">{screening.summary}</div>
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-3">
                    <div className="mb-2 text-[10px] uppercase tracking-wider text-teal-300">Strengths</div>
                    <ul className="space-y-1 text-xs text-white/80">{screening.strengths.map((s: string, i: number) => (<li key={i} className="flex items-start gap-1.5"><CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-teal-400" /> {s}</li>))}</ul>
                  </div>
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                    <div className="mb-2 text-[10px] uppercase tracking-wider text-amber-300">Concerns</div>
                    <ul className="space-y-1 text-xs text-white/80">{screening.weaknesses.map((s: string, i: number) => (<li key={i} className="flex items-start gap-1.5"><XCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-400" /> {s}</li>))}</ul>
                  </div>
                </div>
                <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 p-3 mb-4">
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-violet-300">Recommendation</div>
                  <div className="text-sm font-medium text-white">{screening.recommendation}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction("shortlisted", selected.id)} className="flex-1 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 px-3 py-2 text-xs font-medium text-white">Shortlist</button>
                  <button onClick={() => handleAction("rejected", selected.id)} className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10">Reject</button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Interviews Page ─────────────────────────────────────────── */
function InterviewsPage({ interviews, applications, recruiterId, onRefresh }: { interviews: FirestoreInterview[]; applications: FirestoreApplication[]; recruiterId: string; onRefresh: () => void }) {
  const { showSuccess, showError } = useToast();
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedApp, setSelectedApp] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [transcript, setTranscript] = useState("I've been working with React and TypeScript for six years. I led a migration from class components to hooks and introduced a component library used by 14 teams. I'm comfortable with system design, especially around performance and state management.");
  const [evalResult, setEvalResult] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);

  const shortlistedApps = applications.filter((a) => ["shortlisted", "screening"].includes(a.status));

  const scheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !scheduledAt) { showError("Select an application and a date/time."); return; }
    const app = applications.find((a) => a.id === selectedApp);
    if (!app) return;
    setSaving(true);
    try {
      await createInterview({
        applicationId: app.id,
        candidateId: app.candidateId,
        jobId: app.jobId,
        recruiterId,
        scheduledAt: new Date(scheduledAt),
        status: "scheduled",
      });
      await updateApplicationStatus(app.id, "interviewed");
      showSuccess("Interview scheduled!");
      setShowSchedule(false);
      setSelectedApp(""); setScheduledAt("");
      onRefresh();
    } catch { showError("Failed to schedule. Check Firestore rules."); }
    finally { setSaving(false); }
  };

  const runEval = async () => {
    setEvaluating(true); setEvalResult(null);
    const r = await evaluateInterview(transcript);
    setEvalResult(r); setEvaluating(false);
  };

  return (
    <div>
      <AnimatePresence>
        {showSchedule && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d16] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">Schedule Interview</h2>
                <button onClick={() => setShowSchedule(false)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={scheduleInterview} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Select Candidate (shortlisted)</label>
                  <select value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-violet-500/40 focus:outline-none">
                    <option value="">Choose application…</option>
                    {shortlistedApps.map((a) => (<option key={a.id} value={a.id}>{a.candidateName || "Candidate"} — {a.jobTitle}</option>))}
                  </select>
                  {shortlistedApps.length === 0 && <p className="mt-1 text-xs text-amber-300">Shortlist candidates from AI Screening first.</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Date & Time</label>
                  <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-violet-500/40 focus:outline-none" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowSchedule(false)} className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-sm text-white">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Scheduling…" : "Schedule"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <PageHeader title="Interviews" description="Schedule and evaluate candidate interviews." actions={
        <button onClick={() => setShowSchedule(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 px-3 py-2 text-xs font-medium text-white">
          <Plus className="h-3.5 w-3.5" /> Schedule
        </button>
      } />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="border-b border-white/5 px-5 py-3 text-sm font-semibold text-white">Upcoming ({interviews.filter(i => i.status === "scheduled").length})</div>
            <div className="divide-y divide-white/5">
              {interviews.filter((i) => i.status === "scheduled").length === 0 ? (
                <div className="px-5 py-4 text-xs text-white/40">No upcoming interviews</div>
              ) : interviews.filter((i) => i.status === "scheduled").map((iv) => {
                const app = applications.find((a) => a.id === iv.applicationId);
                return (
                  <div key={iv.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-500/10"><Calendar className="h-4 w-4 text-amber-300" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{app?.candidateName || "Candidate"}</div>
                      <div className="text-xs text-white/50">{iv.scheduledAt ? new Date(iv.scheduledAt instanceof Date ? iv.scheduledAt : (iv.scheduledAt as any).toDate?.() ?? iv.scheduledAt).toLocaleString() : "—"}</div>
                    </div>
                    <Badge tone="warning">scheduled</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d0d16] to-[#05050a] p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-teal-400"><Brain className="h-4 w-4 text-white" /></div>
              <div><div className="text-sm font-semibold text-white">AI Interview Evaluator</div><div className="text-[11px] text-white/50">Paste a transcript for instant evaluation.</div></div>
            </div>
            <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} rows={5}
              className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none" />
            <button onClick={runEval} disabled={evaluating}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-60">
              {evaluating ? <><div className="h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-transparent" /> Analyzing…</> : <><Sparkles className="h-3.5 w-3.5" /> Evaluate with AI</>}
            </button>
            {evalResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {[{ l: "Comm.", v: evalResult.communicationScore }, { l: "Conf.", v: evalResult.confidenceScore }, { l: "Tech.", v: evalResult.technicalScore }, { l: "Overall", v: evalResult.overallScore }].map((s) => (
                    <div key={s.l} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
                      <div className="text-[10px] uppercase tracking-wider text-white/40">{s.l}</div>
                      <div className="mt-1 text-2xl font-bold text-white">{s.v}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 p-3">
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-violet-300">Recommendation</div>
                  <div className="text-sm font-medium text-white">{evalResult.recommendation}</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Onboarding Page ─────────────────────────────────────────── */
function OnboardingPage({ onboarding }: { onboarding: FirestoreOnboarding[] }) {
  return (
    <div>
      <PageHeader title="Onboarding" description="Track document verification for hired candidates." />
      {onboarding.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-sm text-white/40">No active onboarding candidates yet.</div>
      ) : (
        <div className="space-y-3">
          {onboarding.map((o) => {
            const docs = [{ key: "idDoc", label: "Gov ID" }, { key: "offerLetter", label: "Offer" }, { key: "education", label: "Education" }, { key: "backgroundCheck", label: "Background" }];
            const approved = docs.filter((d) => o.documents[d.key as keyof typeof o.documents] === "approved").length;
            return (
              <div key={o.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-white">{o.candidateId}</div>
                  <Badge tone={o.status === "approved" ? "success" : o.status === "rejected" ? "danger" : "warning"}>{o.status.replace("_", " ")}</Badge>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5 mb-3">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400" style={{ width: `${(approved / docs.length) * 100}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {docs.map((d) => (<div key={d.key} className="rounded-lg border border-white/5 bg-white/[0.02] p-2 text-center"><div className="text-[10px] text-white/50">{d.label}</div><div className="text-xs font-medium text-white mt-0.5 capitalize">{o.documents[d.key as keyof typeof o.documents]?.replace("_", " ") ?? "—"}</div></div>))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Analytics Page ──────────────────────────────────────────── */
function AnalyticsPage({ candidates, applications, jobs }: any) {
  const trend = [{ month: "Oct", apps: 8, hires: 1 }, { month: "Nov", apps: 15, hires: 2 }, { month: "Dec", apps: 12, hires: 1 }, { month: "Jan", apps: 22, hires: 3 }, { month: "Feb", apps: applications.length, hires: applications.filter((a: any) => a.status === "hired").length }];
  return (
    <div>
      <PageHeader title="Analytics" description="Hiring performance." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Candidates" value={candidates.length} icon={<Users className="h-4 w-4" />} accent="brand" />
        <StatCard label="Hired" value={applications.filter((a: any) => a.status === "hired").length} icon={<CheckCircle2 className="h-4 w-4" />} accent="teal" />
        <StatCard label="Rejected" value={applications.filter((a: any) => a.status === "rejected").length} icon={<XCircle className="h-4 w-4" />} accent="pink" />
        <StatCard label="Open Jobs" value={jobs.filter((j: any) => j.status === "open").length} icon={<Briefcase className="h-4 w-4" />} accent="amber" />
      </div>
      <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
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
    </div>
  );
}

function statusTone(s: string): any {
  const map: Record<string, any> = { applied: "default", screening: "brand", shortlisted: "teal", interviewed: "warning", offered: "success", hired: "success", rejected: "danger" };
  return map[s] ?? "default";
}
