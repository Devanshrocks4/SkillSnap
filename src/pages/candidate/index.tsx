import { Routes, Route } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileCheck,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  Target,
  Award,
  BookOpen,
} from "lucide-react";
import { DashboardLayout, PageHeader } from "../../components/DashboardLayout";
import { StatCard, Badge } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import { mockJobs, mockApplications, mockInterviews, mockOnboarding } from "../../lib/mockData";
import { recommendJobs, summarizeResume } from "../../lib/ai";
import type { Application } from "../../lib/types";

export function CandidateApp() {
  const { user } = useAuth();
  // The candidate is the first candidate in our data
  const myCandidateId = "c1";
  const myApplications = mockApplications.filter((a) => a.candidateId === myCandidateId);
  const myInterviews = mockInterviews.filter((iv) =>
    myApplications.some((a) => a.id === iv.applicationId)
  );
  const myOnboarding = mockOnboarding.find((o) => o.candidateId === myCandidateId);
  const myProfile = {
    name: user?.name ?? "Ava Chen",
    title: "Senior Frontend Engineer",
    skills: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Node.js", "GraphQL"],
    experience: 6,
    education: "M.S. Computer Science, Stanford",
  };

  return (
    <DashboardLayout role="candidate">
      <Routes>
        <Route
          index
          element={
            <Overview
              applications={myApplications}
              profile={myProfile}
            />
          }
        />
        <Route path="jobs" element={<BrowseJobs profile={myProfile} />} />
        <Route path="applications" element={<MyApplications applications={myApplications} />} />
        <Route path="ai" element={<AIInsights profile={myProfile} />} />
        <Route path="interviews" element={<Interviews interviews={myInterviews} />} />
        <Route path="onboarding" element={<OnboardingPage onboarding={myOnboarding} />} />
      </Routes>
    </DashboardLayout>
  );
}

function Overview({
  applications,
  profile,
}: {
  applications: Application[];
  profile: { name: string; title: string; skills: string[]; experience: number; education: string };
}) {
  const stats = {
    applied: applications.length,
    shortlisted: applications.filter((a) => ["shortlisted", "interviewed", "offered", "hired"].includes(a.status)).length,
    interviewed: applications.filter((a) => ["interviewed", "offered", "hired"].includes(a.status)).length,
    avgScore: Math.round(applications.reduce((s, a) => s + a.aiScore, 0) / Math.max(1, applications.length)),
  };
  const summary = summarizeResume({
    name: profile.name,
    title: profile.title,
    experience: profile.experience,
    skills: profile.skills,
    education: profile.education,
  });

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${profile.name.split(" ")[0]} 👋`}
        description="Here's what's happening with your applications today."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Applications" value={stats.applied} icon={<FileCheck className="h-4 w-4" />} accent="brand" />
        <StatCard label="Shortlisted" value={stats.shortlisted} icon={<CheckCircle2 className="h-4 w-4" />} accent="teal" />
        <StatCard label="Interviewed" value={stats.interviewed} icon={<Award className="h-4 w-4" />} accent="pink" />
        <StatCard label="Avg. AI Score" value={stats.avgScore} icon={<TrendingUp className="h-4 w-4" />} accent="amber" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* AI summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-violet-500/5 to-transparent p-6 lg:col-span-2"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-teal-400">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">AI Profile Summary</div>
              <div className="text-[11px] text-white/50">Generated from your resume · Updated 2 hours ago</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-white/80">{summary}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {profile.skills.slice(0, 6).map((s) => (
              <Badge key={s} tone="brand">{s}</Badge>
            ))}
          </div>
        </motion.div>

        {/* Profile strength */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="text-sm font-semibold text-white">Profile Strength</div>
          <div className="mt-4 flex items-center justify-center">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#g)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 0.87 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  style={{ strokeDasharray: "263.9" }}
                />
                <defs>
                  <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c5cff" />
                    <stop offset="100%" stopColor="#5eead4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div>
                  <div className="text-center text-3xl font-semibold text-white">87</div>
                  <div className="text-center text-[10px] uppercase tracking-wider text-white/50">Strong</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            <Row label="Skills match" value={92} tone="teal" />
            <Row label="Experience" value={85} tone="brand" />
            <Row label="Resume quality" value={88} tone="pink" />
          </div>
        </div>
      </div>

      {/* Recent applications */}
      <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div className="text-sm font-semibold text-white">Recent Applications</div>
          <a href="#/candidate/applications" className="text-xs text-violet-300 hover:text-violet-200">View all →</a>
        </div>
        <div className="divide-y divide-white/5">
          {applications.slice(0, 4).map((a) => (
            <ApplicationRow key={a.id} a={a} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: number; tone: "teal" | "brand" | "pink" }) {
  const color: Record<string, string> = {
    teal: "from-teal-500 to-teal-400",
    brand: "from-violet-500 to-violet-400",
    pink: "from-pink-500 to-pink-400",
  };
  return (
    <div>
      <div className="mb-1 flex justify-between text-white/60">
        <span>{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color[tone]}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>
    </div>
  );
}

function statusTone(s: Application["status"]) {
  const map: Record<Application["status"], any> = {
    applied: "default",
    screening: "brand",
    shortlisted: "teal",
    interviewed: "warning",
    offered: "success",
    hired: "success",
    rejected: "danger",
  };
  return map[s];
}

function ApplicationRow({ a }: { a: Application }) {
  return (
    <div className="flex flex-col gap-2 px-5 py-3 md:flex-row md:items-center md:gap-4">
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{a.jobTitle}</div>
        <div className="text-xs text-white/50">{a.company} · Applied {a.appliedAt}</div>
      </div>
      <div className="hidden items-center gap-4 md:flex">
        <div className="text-right">
          <div className="text-xs text-white/40">AI Score</div>
          <div className="text-sm font-semibold text-white">{a.aiScore}</div>
        </div>
        <Badge tone={statusTone(a.status)}>{a.status.replace("_", " ")}</Badge>
      </div>
    </div>
  );
}

function BrowseJobs({ profile }: { profile: any }) {
  const [query, setQuery] = useState("");
  const recs = useMemo(() => recommendJobs(profile.skills, mockJobs), [profile.skills]);
  const filtered = mockJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.company.toLowerCase().includes(query.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        title="Browse Jobs"
        description="AI-ranked roles matched to your profile."
        actions={
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles, companies, skills..."
            className="w-64 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-violet-500/40 focus:outline-none"
          />
        }
      />

      {/* Top AI picks */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-300" />
          <h2 className="text-sm font-semibold text-white">Top picks for you</h2>
          <Badge tone="brand">AI-matched</Badge>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {recs.slice(0, 3).map((j) => (
            <JobCard key={j.id} job={j} matchScore={j.matchScore} />
          ))}
        </div>
      </div>

      <div className="mb-3 text-sm font-semibold text-white">All open roles ({filtered.length})</div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {filtered.map((j) => (
          <JobCard key={j.id} job={j} />
        ))}
      </div>
    </div>
  );
}

function JobCard({ job, matchScore }: { job: any; matchScore?: number }) {
  const [applied, setApplied] = useState(false);
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition hover:border-violet-500/20 hover:bg-white/[0.04]"
    >
      {matchScore !== undefined && (
        <div className="absolute right-4 top-4">
          <div className="flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-2.5 py-1 text-[11px] font-medium text-teal-300">
            <Target className="h-3 w-3" /> {matchScore}% match
          </div>
        </div>
      )}
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500/20 to-teal-400/20 text-sm font-semibold text-white">
        {job.company.slice(0, 1)}
      </div>
      <div className="text-sm font-semibold text-white">{job.title}</div>
      <div className="mt-0.5 text-xs text-white/50">{job.company}</div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/60">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {job.type}</span>
        <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" /> {job.salary}</span>
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-white/60">{job.description}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {job.skills.slice(0, 4).map((s: string) => (
          <Badge key={s}>{s}</Badge>
        ))}
      </div>
      <button
        onClick={() => setApplied(true)}
        disabled={applied}
        className={`mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
          applied
            ? "bg-teal-500/10 text-teal-300 border border-teal-500/20"
            : "bg-gradient-to-br from-violet-500 to-violet-600 text-white hover:shadow-lg hover:shadow-violet-500/20"
        }`}
      >
        {applied ? <><CheckCircle2 className="h-3.5 w-3.5" /> Applied</> : <>Apply now <ArrowRight className="h-3 w-3" /></>}
      </button>
    </motion.div>
  );
}

function MyApplications({ applications }: { applications: Application[] }) {
  return (
    <div>
      <PageHeader
        title="My Applications"
        description="Track the status of every role you've applied to."
      />
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="grid grid-cols-12 gap-4 border-b border-white/5 px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-white/40">
          <div className="col-span-4">Role</div>
          <div className="col-span-2">Applied</div>
          <div className="col-span-2">AI Score</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Action</div>
        </div>
        <div className="divide-y divide-white/5">
          {applications.map((a) => (
            <div key={a.id} className="grid grid-cols-12 items-center gap-4 px-5 py-4">
              <div className="col-span-4">
                <div className="text-sm font-medium text-white">{a.jobTitle}</div>
                <div className="text-xs text-white/50">{a.company}</div>
              </div>
              <div className="col-span-2 text-xs text-white/60">{a.appliedAt}</div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400"
                      style={{ width: `${a.aiScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-white">{a.aiScore}</span>
                </div>
              </div>
              <div className="col-span-2"><Badge tone={statusTone(a.status)}>{a.status}</Badge></div>
              <div className="col-span-2 text-right">
                <button className="text-xs text-violet-300 hover:text-violet-200">View →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIInsights({ profile }: { profile: any }) {
  const recs = recommendJobs(profile.skills, mockJobs);
  return (
    <div>
      <PageHeader
        title="AI Insights"
        description="Personalized recommendations based on your profile and market trends."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-violet-500/5 to-transparent p-6">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Skills to grow</h3>
          </div>
          <p className="text-xs text-white/60">Based on the roles you're targeting, adding these skills could increase your match score by up to 18%.</p>
          <div className="mt-4 space-y-2">
            {[
              { skill: "GraphQL", impact: "+12% match" },
              { skill: "System Design", impact: "+8% match" },
              { skill: "Testing (Vitest)", impact: "+6% match" },
            ].map((s) => (
              <div key={s.skill} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-violet-300" />
                  <span className="text-sm text-white">{s.skill}</span>
                </div>
                <Badge tone="teal">{s.impact}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-teal-500/5 to-transparent p-6">
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-teal-300" />
            <h3 className="text-sm font-semibold text-white">Market insights</h3>
          </div>
          <div className="space-y-3">
            <Insight label="Senior Frontend roles posted this week" value="+34" trend="up" />
            <Insight label="Avg. salary for your profile" value="$185k" trend="up" />
            <Insight label="Competition level" value="Medium" trend="neutral" />
            <Insight label="Time to hire (median)" value="18 days" trend="down" />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-300" />
          <h3 className="text-sm font-semibold text-white">Best-matched roles right now</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {recs.slice(0, 4).map((j) => (
            <div key={j.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-500/20 to-teal-400/20 text-sm font-semibold text-white">
                {j.company.slice(0, 1)}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{j.title}</div>
                <div className="text-xs text-white/50">{j.company} · {j.location}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-teal-300">{j.matchScore}%</div>
                <div className="text-[10px] text-white/40">match</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Insight({ label, value, trend }: { label: string; value: string; trend: "up" | "down" | "neutral" }) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingUp : AlertCircle;
  const color = trend === "up" ? "text-teal-300" : trend === "down" ? "text-rose-300 rotate-180" : "text-white/50";
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <div className="text-xs text-white/70">{label}</div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-white">{value}</span>
        <Icon className={`h-3.5 w-3.5 ${color}`} />
      </div>
    </div>
  );
}

function Interviews({ interviews }: { interviews: any[] }) {
  return (
    <div>
      <PageHeader
        title="Interviews"
        description="Schedule, record, and review your interview sessions."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition hover:bg-white/10">
            <Upload className="h-3.5 w-3.5" /> Upload video
          </button>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {interviews.length === 0 && (
          <div className="col-span-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-white/30" />
            <div className="mt-3 text-sm text-white/60">No interviews scheduled yet.</div>
          </div>
        )}
        {interviews.map((iv) => (
          <div key={iv.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className="mb-3 flex items-center justify-between">
              <Badge tone={iv.status === "completed" ? "success" : "warning"}>{iv.status}</Badge>
              <span className="text-xs text-white/50">{new Date(iv.scheduledAt).toLocaleString()}</span>
            </div>
            <div className="text-sm font-semibold text-white">{iv.role}</div>
            <div className="text-xs text-white/50">with {iv.candidateName}</div>
            {iv.status === "completed" && iv.overallScore && (
              <>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {[
                    { l: "Comm.", v: iv.communicationScore },
                    { l: "Conf.", v: iv.confidenceScore },
                    { l: "Tech.", v: iv.technicalScore },
                    { l: "Overall", v: iv.overallScore },
                  ].map((s) => (
                    <div key={s.l} className="rounded-lg border border-white/5 bg-white/[0.02] p-2 text-center">
                      <div className="text-[10px] uppercase text-white/40">{s.l}</div>
                      <div className="text-lg font-semibold text-white">{s.v}</div>
                    </div>
                  ))}
                </div>
                {iv.aiRecommendation && (
                  <div className="mt-3 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-violet-300">
                      <Sparkles className="h-3 w-3" /> AI Feedback
                    </div>
                    <div className="text-xs text-white/80">{iv.aiRecommendation}</div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function OnboardingPage({ onboarding }: { onboarding: any }) {
  if (!onboarding) {
    return (
      <div>
        <PageHeader title="Onboarding" description="Track your onboarding progress once an offer is accepted." />
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
          <FileCheck className="mx-auto h-8 w-8 text-white/30" />
          <div className="mt-3 text-sm text-white/60">No active onboarding yet.</div>
        </div>
      </div>
    );
  }
  const docs = [
    { key: "idDoc", label: "Government ID" },
    { key: "offerLetter", label: "Offer Letter" },
    { key: "education", label: "Education Certificates" },
    { key: "backgroundCheck", label: "Background Check" },
  ];
  return (
    <div>
      <PageHeader title="Onboarding" description={`Joining ${onboarding.company} as ${onboarding.role} · ${onboarding.joiningDate}`} />
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-white/40">Overall Status</div>
            <div className="mt-1 text-lg font-semibold text-white capitalize">{onboarding.overallStatus.replace("_", " ")}</div>
          </div>
          <Badge tone={onboarding.overallStatus === "approved" ? "success" : onboarding.overallStatus === "rejected" ? "danger" : "warning"}>
            {onboarding.overallStatus.replace("_", " ")}
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {docs.map((d) => {
            const s = onboarding.documents[d.key];
            return (
              <div key={d.key} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div>
                  <div className="text-sm font-medium text-white">{d.label}</div>
                  <div className="mt-0.5 text-xs capitalize text-white/50">{s.replace("_", " ")}</div>
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
