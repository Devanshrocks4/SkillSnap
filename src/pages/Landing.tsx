import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Users,
  CheckCircle2,
  Brain,
  FileText,
  BarChart3,
  Rocket,
} from "lucide-react";
import { Logo, AuroraBackground } from "../components/ui";

export default function LandingPage() {
  return (
    <AuroraBackground>
      <div className="min-h-screen">
        {/* Nav */}
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Logo />
            <div className="hidden items-center gap-8 md:flex">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition">Features</a>
              <a href="#ai" className="text-sm text-white/60 hover:text-white transition">AI</a>
              <a href="#pricing" className="text-sm text-white/60 hover:text-white transition">Pricing</a>
              <a href="#docs" className="text-sm text-white/60 hover:text-white transition">Docs</a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-white/70 hover:text-white transition"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="btn-glow inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition hover:shadow-violet-500/40"
              >
                Get started <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative px-6 pt-24 pb-20">
          <div className="mx-auto max-w-6xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              Powered by Gemini AI · Now in public beta
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
            >
              <span className="gradient-text">AI-powered recruitment,</span>
              <br />
              <span className="gradient-text-brand">shipped in minutes.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-white/60"
            >
              SkillSnap screens resumes, ranks candidates, and runs AI-assisted
              interviews — so your team can hire the right people, faster.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                to="/signup"
                className="btn-glow group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-2xl shadow-violet-500/30 transition hover:shadow-violet-500/50"
              >
                Start hiring free
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/demo/recruiter"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
              >
                <Sparkles className="h-4 w-4 text-teal-300" />
                Try live demo
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/40"
            >
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> SOC 2 Type II ready</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> GDPR compliant</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> 99.99% uptime SLA</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> Firebase + Gemini</span>
            </motion.div>
          </div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="relative mx-auto mt-20 max-w-6xl"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-violet-500/20 via-teal-400/20 to-pink-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d0d16] to-[#05050a] shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-white/5 bg-black/40 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-rose-500/60" />
                <div className="h-3 w-3 rounded-full bg-amber-500/60" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
                <div className="ml-3 text-xs text-white/40">skillsnap.ai / dashboard</div>
              </div>
              <div className="grid grid-cols-12 gap-4 p-6">
                <div className="col-span-3 space-y-2">
                  {["Dashboard", "Jobs", "Candidates", "AI Screening", "Interviews", "Onboarding", "Analytics"].map((item, i) => (
                    <div
                      key={item}
                      className={`rounded-lg px-3 py-2 text-sm ${i === 0 ? "bg-violet-500/10 text-violet-300 border border-violet-500/20" : "text-white/50"}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="col-span-9 space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { l: "Candidates", v: "1,247" },
                      { l: "Active Jobs", v: "18" },
                      { l: "AI Score Avg", v: "82" },
                      { l: "Hired", v: "34" },
                    ].map((s) => (
                      <div key={s.l} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <div className="text-[10px] uppercase text-white/40">{s.l}</div>
                        <div className="mt-1 text-xl font-semibold text-white">{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                      <div className="mb-3 text-xs text-white/50">Candidate pipeline</div>
                      <div className="flex h-32 items-end gap-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                            className="flex-1 rounded-t-md bg-gradient-to-t from-violet-500/60 to-teal-400/60"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                      <div className="mb-3 text-xs text-white/50">Top skills</div>
                      {["React", "TypeScript", "Python"].map((s, i) => (
                        <div key={s} className="mb-2">
                          <div className="mb-1 flex justify-between text-[11px] text-white/60">
                            <span>{s}</span><span>{90 - i * 8}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400"
                              style={{ width: `${90 - i * 8}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section id="features" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                <Zap className="h-3 w-3 text-amber-400" /> Built for speed
              </div>
              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                <span className="gradient-text">Everything you need to hire.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-white/60">
                From the first application to the final offer — SkillSnap automates the
                tedious parts and surfaces the signals that matter.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { icon: Brain, title: "AI Resume Screening", desc: "Extract skills, experience, and education. Score every candidate against the job spec." },
                { icon: TrendingUp, title: "Smart Candidate Ranking", desc: "Rank applicants instantly with explainable scores and matched/missing skills." },
                { icon: FileText, title: "Recruiter Summaries", desc: "One-paragraph AI summaries that make 500 resumes feel like 50." },
                { icon: Users, title: "Multi-role Workflows", desc: "Candidate, recruiter, and admin views with role-based access control." },
                { icon: BarChart3, title: "Hiring Analytics", desc: "Funnel metrics, skills distribution, and time-to-hire in real time." },
                { icon: Shield, title: "Enterprise Security", desc: "Firebase Auth, Firestore rules, encrypted storage, and audit logs." },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl opacity-0 transition group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-500/20 to-teal-400/20">
                      <f.icon className="h-5 w-5 text-white/80" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI section */}
        <section id="ai" className="relative px-6 py-24">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />
          </div>
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                  <Sparkles className="h-3 w-3 text-violet-400" /> Gemini-powered
                </div>
                <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                  <span className="gradient-text">Hire with AI that</span>
                  <br />
                  <span className="gradient-text-brand">explains itself.</span>
                </h2>
                <p className="mt-4 text-white/60">
                  Every recommendation comes with a clear summary, strengths,
                  concerns, and a recruiter-ready recommendation. No black boxes.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    "Resume parsing & skill extraction",
                    "Candidate ranking with fit rationale",
                    "Job recommendations from candidate profiles",
                    "AI-assisted interview evaluation",
                    "Automated onboarding document review",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-violet-500/20 to-teal-400/20 blur-3xl" />
                <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d0d16] to-[#05050a] p-6 shadow-2xl">
                  <div className="mb-4 flex items-center gap-2 text-xs">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-teal-400">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="font-medium text-white">AI Screening Report</span>
                    <span className="ml-auto rounded-full border border-teal-400/30 bg-teal-400/10 px-2 py-0.5 text-[10px] text-teal-300">92 / 100</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="mb-1 text-xs uppercase tracking-wider text-white/40">Summary</div>
                      <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-white/80">
                        Ava is an excellent fit for Senior Frontend Engineer. Deep
                        React & TypeScript expertise with 6 years shipping
                        production systems. Demonstrates strong design taste.
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="mb-1 text-xs uppercase tracking-wider text-teal-300/80">Strengths</div>
                        <div className="space-y-1 text-xs text-white/70">
                          <div className="flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-teal-400" /> Deep React proficiency</div>
                          <div className="flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-teal-400" /> Strong communicator</div>
                          <div className="flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-teal-400" /> Product-minded</div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-xs uppercase tracking-wider text-amber-300/80">Concerns</div>
                        <div className="space-y-1 text-xs text-white/70">
                          <div className="flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-amber-400" /> Limited backend scope</div>
                          <div className="flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-amber-400" /> No GraphQL exp</div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
                      <div className="mb-1 text-xs uppercase tracking-wider text-violet-300">Recommendation</div>
                      <div className="text-sm text-white/90">Strong hire — proceed to technical interview.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                <span className="gradient-text">Simple, transparent pricing.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/60">Start free. Scale when you hire.</p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { name: "Starter", price: "$0", desc: "For indie teams exploring AI hiring.", features: ["Up to 50 candidates/mo", "AI resume screening", "1 job posting", "Email support"] },
                { name: "Growth", price: "$99", desc: "For teams hiring their first 10.", features: ["Unlimited candidates", "AI ranking & summaries", "10 job postings", "Interview evaluation", "Priority support"], featured: true },
                { name: "Enterprise", price: "Custom", desc: "For scaling organizations.", features: ["Everything in Growth", "SSO & SCIM", "Custom AI fine-tuning", "Dedicated CSM", "99.99% SLA"] },
              ].map((p) => (
                <div
                  key={p.name}
                  className={`relative overflow-hidden rounded-2xl border p-8 ${
                    p.featured
                      ? "border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent shadow-2xl shadow-violet-500/10"
                      : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  {p.featured && (
                    <div className="absolute right-4 top-4 rounded-full border border-violet-400/30 bg-violet-500/20 px-2 py-0.5 text-[10px] font-medium text-violet-200">
                      Most popular
                    </div>
                  )}
                  <div className="text-sm font-medium text-white/80">{p.name}</div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{p.price}</span>
                    {p.price !== "Custom" && <span className="text-sm text-white/50">/mo</span>}
                  </div>
                  <div className="mt-2 text-sm text-white/50">{p.desc}</div>
                  <ul className="mt-6 space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      p.featured
                        ? "bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40"
                        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {p.name === "Enterprise" ? "Contact sales" : "Start free"} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-[#0d0d16] to-teal-400/10 p-12 text-center">
            <div className="absolute inset-0 grid-pattern opacity-40" />
            <div className="relative">
              <Rocket className="mx-auto h-10 w-10 text-violet-300" />
              <h2 className="mt-6 text-4xl font-bold tracking-tight">
                <span className="gradient-text-brand">Ready to hire smarter?</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/60">
                Join thousands of teams using SkillSnap to find, evaluate, and
                onboard the best talent — faster.
              </p>
              <Link
                to="/signup"
                className="btn-glow mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-2xl shadow-violet-500/30 transition hover:shadow-violet-500/50"
              >
                Create free account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <Logo />
            <div className="text-xs text-white/40">
              © 2026 SkillSnap · Built with Firebase, Gemini & React
            </div>
            <div className="flex gap-5 text-xs text-white/50">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Security</a>
            </div>
          </div>
        </footer>
      </div>
    </AuroraBackground>
  );
}
