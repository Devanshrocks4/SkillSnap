import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileCheck, Sparkles, TrendingUp, MapPin, Clock, DollarSign,
  ArrowRight, CheckCircle2, XCircle, AlertCircle, Zap, Target,
  Award, BookOpen, Upload, User, Briefcase, GraduationCap, Plus, X,
} from "lucide-react";
import { DashboardLayout, PageHeader } from "../../components/DashboardLayout";
import { StatCard, Badge } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { recommendJobs, summarizeResume } from "../../lib/ai";
import type { FirestoreJob, FirestoreApplication, FirestoreInterview, FirestoreOnboarding, FirestoreCandidate } from "../../types/firestore";
import { getAllOpenJobs } from "../../services/jobService";
import { getApplicationsByCandidate, createApplication, checkExistingApplication } from "../../services/applicationService";
import { getInterviewsByCandidate } from "../../services/interviewService";
import { getOnboardingByCandidate } from "../../services/onboardingService";
import { uploadResume } from "../../services/storageService";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase/config";

/* ─── Candidate Profile Helpers ──────────────────────────────── */
async function getCandidateProfile(uid: string): Promise<FirestoreCandidate | null> {
  try {
    const snap = await getDoc(doc(db, "candidates", uid));
    if (snap.exists()) {
      return snap.data() as FirestoreCandidate;
    }
    return null;
  } catch {
    return null;
  }
}

async function saveCandidateProfile(uid: string, data: Partial<FirestoreCandidate>): Promise<void> {
  const ref = doc(db, "candidates", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref, { ...data, uid, createdAt: serverTimestamp() });
  }
}

/* ─── App ─────────────────────────────────────────────────────── */
export function CandidateApp() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<FirestoreJob[]>([]);
  const [applications, setApplications] = useState<FirestoreApplication[]>([]);
  const [interviews, setInterviews] = useState<FirestoreInterview[]>([]);
  const [onboarding, setOnboarding] = useState<FirestoreOnboarding | null>(null);
  const [profile, setProfile] = useState<FirestoreCandidate | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    if (!user?.uid) return;
    try {
      const [jobsData, appsData, interviewData, onboardingData, profileData] = await Promise.all([
        getAllOpenJobs(),
        getApplicationsByCandidate(user.uid),
        getInterviewsByCandidate(user.uid),
        getOnboardingByCandidate(user.uid),
        getCandidateProfile(user.uid),
      ]);
      setJobs(jobsData);
      setApplications(appsData);
      setInterviews(interviewData);
      setOnboarding(onboardingData);
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [user?.uid]);

  const myProfile = {
    name: user?.name ?? "Candidate",
    title: profile?.title ?? "Software Engineer",
    skills: profile?.skills ?? [],
    experience: profile?.experience ?? 0,
    education: profile?.education ?? "",
    resumeUrl: profile?.resumeUrl,
  };

  return (
    <DashboardLayout role="candidate">
      <Routes>
        <Route index element={<Overview applications={applications} profile={myProfile} />} />
        <Route path="profile" element={<ProfilePage uid={user?.uid ?? ""} profile={profile} onSaved={fetchAll} />} />
        <Route path="jobs" element={<BrowseJobs jobs={jobs} profile={myProfile} applications={applications} onApplied={fetchAll} />} />
        <Route path="applications" element={<MyApplications applications={applications} />} />
        <Route path="ai" element={<AIInsights jobs={jobs} profile={myProfile} />} />
        <Route path="interviews" element={<Interviews interviews={interviews} />} />
        <Route path="onboarding" element={<OnboardingPage onboarding={onboarding} />} />
      </Routes>
    </DashboardLayout>
  );
}

/* ─── Overview ───────────────────────────────────────────────── */
function Overview({ applications, profile }: { applications: FirestoreApplication[]; profile: any }) {
  const stats = {
    applied: applications.length,
    shortlisted: applications.filter((a) => ["shortlisted", "interviewed", "offered", "hired"].includes(a.status)).length,
    interviewed: applications.filter((a) => ["interviewed", "offered", "hired"].includes(a.status)).length,
    avgScore: Math.round(applications.reduce((s, a) => s + (a.aiScore || 0), 0) / Math.max(1, applications.length)),
  };
  const summary = summarizeResume({ name: profile.name, title: profile.title, experience: profile.experience, skills: profile.skills, education: profile.education });

  return (
    <div>
      <PageHeader title={`Welcome back, ${profile.name.split(" ")[0]} 👋`} description="Your application pipeline at a glance." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Applications" value={stats.applied} icon={<FileCheck className="h-4 w-4" />} accent="brand" />
        <StatCard label="Shortlisted" value={stats.shortlisted} icon={<CheckCircle2 className="h-4 w-4" />} accent="teal" />
        <StatCard label="Interviewed" value={stats.interviewed} icon={<Award className="h-4 w-4" />} accent="pink" />
        <StatCard label="Avg. AI Score" value={stats.avgScore || 0} icon={<TrendingUp className="h-4 w-4" />} accent="amber" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-violet-500/5 to-transparent p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-teal-400">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">AI Profile Summary</div>
              <div className="text-[11px] text-white/50">Generated from your profile data</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-white/80">{summary}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {profile.skills.slice(0, 6).map((s: string) => (<Badge key={s} tone="brand">{s}</Badge>))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="text-sm font-semibold text-white">Profile Completion</div>
          <div className="mt-4 flex items-center justify-center">
            <div className="relative h-28 w-28">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#cg)" strokeWidth="10" strokeLinecap="round"
                  style={{ strokeDasharray: "263.9", strokeDashoffset: `${263.9 * (1 - (profile.skills.length > 0 ? 0.9 : 0.3))}` }} />
                <defs><linearGradient id="cg" x1="0%" y1="0%"><stop offset="0%" stopColor="#7c5cff"/><stop offset="100%" stopColor="#5eead4"/></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{profile.skills.length > 0 ? "90" : "30"}%</div>
                  <div className="text-[10px] text-white/40">{profile.skills.length > 0 ? "Complete" : "Incomplete"}</div>
                </div>
              </div>
            </div>
          </div>
          {profile.skills.length === 0 && (
            <p className="mt-3 text-center text-xs text-amber-300">
              Complete your profile to get AI-matched jobs.
            </p>
          )}
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div className="text-sm font-semibold text-white">Recent Applications</div>
        </div>
        <div className="divide-y divide-white/5">
          {applications.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-white/40">No applications yet. Browse jobs to get started.</div>
          ) : applications.slice(0, 4).map((a) => (<ApplicationRow key={a.id} a={a} />))}
        </div>
      </div>
    </div>
  );
}

/* ─── Profile Page (NEW) ──────────────────────────────────────── */
function ProfilePage({ uid, profile, onSaved }: { uid: string; profile: FirestoreCandidate | null; onSaved: () => void }) {
  const { showSuccess, showError } = useToast();
  const { refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState(profile?.title ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [education, setEducation] = useState(profile?.education ?? "");
  const [experience, setExperience] = useState(String(profile?.experience ?? "0"));
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(profile?.skills ?? []);
  const [resumeUrl, setResumeUrl] = useState(profile?.resumeUrl ?? "");

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillInput("");
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uid) return;
    if (file.size > 5 * 1024 * 1024) { showError("File must be under 5MB"); return; }
    setUploading(true);
    try {
      const url = await uploadResume(uid, file, (p) => setUploadProgress(Math.round(p.progress * 100)));
      setResumeUrl(url);
      await saveCandidateProfile(uid, { resumeUrl: url });
      showSuccess("Resume uploaded successfully!");
      onSaved();
    } catch {
      showError("Upload failed. Check Firebase Storage rules.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const save = async () => {
    if (!uid) return;
    setSaving(true);
    try {
      await saveCandidateProfile(uid, {
        title, location, education,
        experience: parseInt(experience) || 0,
        skills,
        resumeUrl,
        uid,
        name: "",
        email: "",
        createdAt: null,
      });
      await refreshUser();
      onSaved();
      showSuccess("Profile saved!");
    } catch {
      showError("Failed to save profile. Check Firestore rules.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="My Profile" description="Complete your profile to get AI-matched job recommendations." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2"><User className="h-4 w-4 text-violet-300" /> Professional Info</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Job Title" value={title} onChange={setTitle} placeholder="e.g. Frontend Engineer" />
              <FormField label="Location" value={location} onChange={setLocation} placeholder="e.g. Mumbai, India" />
              <FormField label="Years of Experience" value={experience} onChange={setExperience} type="number" placeholder="3" />
              <FormField label="Education" value={education} onChange={setEducation} placeholder="e.g. B.Tech Computer Science" />
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2"><Sparkles className="h-4 w-4 text-teal-300" /> Skills</h3>
            <div className="flex gap-2 mb-3">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Add a skill (Enter to add)"
                className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none"
              />
              <button onClick={addSkill} className="rounded-lg bg-violet-500/20 px-3 py-2 text-sm text-violet-300 hover:bg-violet-500/30 transition">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
                  {s}
                  <button onClick={() => setSkills((p) => p.filter((x) => x !== s))} className="text-violet-400 hover:text-white"><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          </div>
          <button onClick={save} disabled={saving} className="btn-glow inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2"><Upload className="h-4 w-4 text-teal-300" /> Resume</h3>
            {resumeUrl ? (
              <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
                <div className="flex items-center gap-2 text-sm text-teal-300">
                  <CheckCircle2 className="h-4 w-4" /> Resume uploaded
                </div>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-xs text-white/50 hover:text-white truncate">View resume →</a>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-white/30" />
                <p className="mt-2 text-xs text-white/50">Upload your resume (PDF, max 5MB)</p>
              </div>
            )}
            {uploading && (
              <div className="mt-3">
                <div className="h-1.5 w-full rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="mt-1 text-[11px] text-white/40">{uploadProgress}%</p>
              </div>
            )}
            <label className="mt-3 block cursor-pointer">
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} disabled={uploading} className="hidden" />
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] py-2 text-xs text-white hover:bg-white/[0.06] transition cursor-pointer">
                <Upload className="h-3.5 w-3.5" /> {resumeUrl ? "Replace Resume" : "Upload Resume"}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/60 mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none" />
    </div>
  );
}

/* ─── Browse Jobs ─────────────────────────────────────────────── */
function BrowseJobs({ jobs, profile, applications, onApplied }: { jobs: FirestoreJob[]; profile: any; applications: FirestoreApplication[]; onApplied: () => void }) {
  const [query, setQuery] = useState("");
  const recs = useMemo(() => recommendJobs(profile.skills, jobs), [profile.skills, jobs]);
  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(query.toLowerCase()) ||
    j.company.toLowerCase().includes(query.toLowerCase()) ||
    j.skills?.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  );
  const appliedIds = new Set(applications.map((a) => a.jobId));

  return (
    <div>
      <PageHeader title="Browse Jobs" description="AI-ranked roles matched to your profile." actions={
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search roles, companies, skills..."
          className="w-64 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none" />
      } />
      {recs.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-300" />
            <h2 className="text-sm font-semibold text-white">Top picks for you</h2>
            <Badge tone="brand">AI-matched</Badge>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {recs.slice(0, 3).map((j) => (<JobCard key={j.id} job={j} matchScore={j.matchScore} alreadyApplied={appliedIds.has(j.id)} onApplied={onApplied} profile={profile} />))}
          </div>
        </div>
      )}
      <div className="mb-3 text-sm font-semibold text-white">All open roles ({filtered.length})</div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {filtered.map((j) => (<JobCard key={j.id} job={j} alreadyApplied={appliedIds.has(j.id)} onApplied={onApplied} profile={profile} />))}
      </div>
    </div>
  );
}

function JobCard({ job, matchScore, alreadyApplied, onApplied, profile }: { job: FirestoreJob; matchScore?: number; alreadyApplied: boolean; onApplied: () => void; profile: any }) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    if (!user?.uid) { showError("Please log in to apply."); return; }
    if (alreadyApplied) return;
    setApplying(true);
    try {
      const existing = await checkExistingApplication(job.id, user.uid);
      if (existing) { showError("You've already applied to this job."); onApplied(); return; }
      await createApplication({
        jobId: job.id,
        candidateId: user.uid,
        candidateName: user.name,
        candidateEmail: user.email,
        jobTitle: job.title,
        company: job.company,
        resumeUrl: profile.resumeUrl || "",
        appliedAt: new Date().toISOString(),
        skills: profile.skills,
        experience: profile.experience,
        aiScore: matchScore || Math.floor(Math.random() * 30) + 60,
      });
      showSuccess(`Applied to ${job.title} at ${job.company}!`);
      onApplied();
    } catch {
      showError("Failed to apply. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition hover:border-violet-500/20 hover:bg-white/[0.04]">
      {matchScore !== undefined && (
        <div className="absolute right-4 top-4">
          <div className="flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-2.5 py-1 text-[11px] font-medium text-teal-300">
            <Target className="h-3 w-3" /> {matchScore}% match
          </div>
        </div>
      )}
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500/20 to-teal-400/20 text-sm font-semibold text-white">
        {job.company?.slice(0, 1) || "J"}
      </div>
      <div className="text-sm font-semibold text-white">{job.title}</div>
      <div className="mt-0.5 text-xs text-white/50">{job.company}</div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/60">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {job.type}</span>
        {job.salary && <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" /> {job.salary}</span>}
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-white/60">{job.description}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {job.skills?.slice(0, 4).map((s) => (<Badge key={s}>{s}</Badge>))}
      </div>
      <button onClick={handleApply} disabled={alreadyApplied || applying}
        className={`mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
          alreadyApplied ? "bg-teal-500/10 text-teal-300 border border-teal-500/20 cursor-default"
            : "bg-gradient-to-br from-violet-500 to-violet-600 text-white hover:shadow-lg hover:shadow-violet-500/20"
        }`}>
        {applying ? "Applying…" : alreadyApplied ? <><CheckCircle2 className="h-3.5 w-3.5" /> Applied</> : <>Apply now <ArrowRight className="h-3 w-3" /></>}
      </button>
    </motion.div>
  );
}

/* ─── My Applications ─────────────────────────────────────────── */
function MyApplications({ applications }: { applications: FirestoreApplication[] }) {
  return (
    <div>
      <PageHeader title="My Applications" description="Track the status of every role you've applied to." />
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="grid grid-cols-12 gap-4 border-b border-white/5 px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-white/40">
          <div className="col-span-4">Role</div>
          <div className="col-span-2">Applied</div>
          <div className="col-span-2">AI Score</div>
          <div className="col-span-4">Status</div>
        </div>
        {applications.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-white/40">No applications yet. Browse jobs to get started.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {applications.map((a) => (
              <div key={a.id} className="grid grid-cols-12 items-center gap-4 px-5 py-4">
                <div className="col-span-4">
                  <div className="text-sm font-medium text-white">{a.jobTitle || "Unknown Role"}</div>
                  <div className="text-xs text-white/50">{a.company || "Unknown Company"}</div>
                </div>
                <div className="col-span-2 text-xs text-white/60">{a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : "—"}</div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400" style={{ width: `${a.aiScore || 0}%` }} />
                    </div>
                    <span className="text-xs font-medium text-white">{a.aiScore || 0}</span>
                  </div>
                </div>
                <div className="col-span-4"><Badge tone={statusTone(a.status)}>{a.status}</Badge></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── AI Insights ─────────────────────────────────────────────── */
function AIInsights({ jobs, profile }: { jobs: FirestoreJob[]; profile: any }) {
  const recs = recommendJobs(profile.skills, jobs);
  return (
    <div>
      <PageHeader title="AI Insights" description="Personalized recommendations based on your profile." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-violet-500/5 to-transparent p-6">
          <div className="mb-3 flex items-center gap-2"><Zap className="h-4 w-4 text-amber-400" /><h3 className="text-sm font-semibold text-white">Skills to grow</h3></div>
          <div className="space-y-2">
            {[{ skill: "GraphQL", impact: "+12% match" }, { skill: "System Design", impact: "+8% match" }, { skill: "Vitest", impact: "+6% match" }].map((s) => (
              <div key={s.skill} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-violet-300" /><span className="text-sm text-white">{s.skill}</span></div>
                <Badge tone="teal">{s.impact}</Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-teal-500/5 to-transparent p-6">
          <div className="mb-3 flex items-center gap-2"><Target className="h-4 w-4 text-teal-300" /><h3 className="text-sm font-semibold text-white">Best-matched roles</h3></div>
          <div className="space-y-3">
            {recs.slice(0, 4).map((j) => (
              <div key={j.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-500/20 to-teal-400/20 text-xs font-semibold text-white">{j.company.slice(0, 1)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{j.title}</div>
                  <div className="text-xs text-white/50 truncate">{j.company}</div>
                </div>
                <div className="text-right flex-shrink-0"><div className="text-sm font-semibold text-teal-300">{j.matchScore}%</div></div>
              </div>
            ))}
            {recs.length === 0 && <p className="text-sm text-white/40">Add skills to your profile to see AI-matched jobs.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Interviews ──────────────────────────────────────────────── */
function Interviews({ interviews }: { interviews: FirestoreInterview[] }) {
  return (
    <div>
      <PageHeader title="Interviews" description="Your scheduled and completed interviews." />
      {interviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-white/30" />
          <div className="mt-3 text-sm text-white/60">No interviews scheduled yet.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {interviews.map((iv) => (
            <div key={iv.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="mb-3 flex items-center justify-between">
                <Badge tone={iv.status === "completed" ? "success" : "warning"}>{iv.status}</Badge>
                <span className="text-xs text-white/50">{iv.scheduledAt ? new Date(iv.scheduledAt instanceof Date ? iv.scheduledAt : (iv.scheduledAt as any).toDate?.() ?? iv.scheduledAt).toLocaleString() : "—"}</span>
              </div>
              <div className="text-sm font-semibold text-white">Interview</div>
              {iv.status === "completed" && iv.overallScore && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {[{ l: "Comm.", v: iv.communicationScore }, { l: "Conf.", v: iv.confidenceScore }, { l: "Tech.", v: iv.technicalScore }, { l: "Overall", v: iv.overallScore }].map((s) => (
                    <div key={s.l} className="rounded-lg border border-white/5 bg-white/[0.02] p-2 text-center">
                      <div className="text-[10px] uppercase text-white/40">{s.l}</div>
                      <div className="text-lg font-semibold text-white">{s.v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Onboarding ──────────────────────────────────────────────── */
function OnboardingPage({ onboarding }: { onboarding: FirestoreOnboarding | null }) {
  if (!onboarding) {
    return (
      <div>
        <PageHeader title="Onboarding" description="Track your onboarding once an offer is accepted." />
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
          <FileCheck className="mx-auto h-8 w-8 text-white/30" />
          <div className="mt-3 text-sm text-white/60">No active onboarding yet.</div>
        </div>
      </div>
    );
  }
  const docs = [{ key: "idDoc", label: "Government ID" }, { key: "offerLetter", label: "Offer Letter" }, { key: "education", label: "Education Certificates" }, { key: "backgroundCheck", label: "Background Check" }];
  return (
    <div>
      <PageHeader title="Onboarding" description="Track your document status." />
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {docs.map((d) => {
            const s = onboarding.documents[d.key as keyof typeof onboarding.documents];
            return (
              <div key={d.key} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div>
                  <div className="text-sm font-medium text-white">{d.label}</div>
                  <div className="mt-0.5 text-xs capitalize text-white/50">{s?.replace("_", " ")}</div>
                </div>
                {s === "approved" ? <CheckCircle2 className="h-4 w-4 text-teal-400" /> :
                 s === "rejected" ? <XCircle className="h-4 w-4 text-rose-400" /> :
                 s === "under_review" ? <AlertCircle className="h-4 w-4 text-amber-400" /> :
                 <Clock className="h-4 w-4 text-white/40" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────── */
function statusTone(s: string) {
  const map: Record<string, any> = { applied: "default", screening: "brand", shortlisted: "teal", interviewed: "warning", offered: "success", hired: "success", rejected: "danger" };
  return map[s] ?? "default";
}

function ApplicationRow({ a }: { a: FirestoreApplication }) {
  return (
    <div className="flex flex-col gap-2 px-5 py-3 md:flex-row md:items-center md:gap-4">
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{a.jobTitle || "Unknown Role"}</div>
        <div className="text-xs text-white/50">{a.company || "Unknown Company"}</div>
      </div>
      <Badge tone={statusTone(a.status)}>{a.status}</Badge>
    </div>
  );
}

// Declare Clock for onboarding
// function Clock({ className }: { className?: string }) {
//   return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
// }
