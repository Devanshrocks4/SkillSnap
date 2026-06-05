import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Mail, Lock, User, Shield, Briefcase, UserCircle2 } from "lucide-react";
import { Logo, AuroraBackground } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../lib/types";

export function LoginPage() {
  return <AuthShell mode="login" />;
}

export function SignupPage() {
  return <AuthShell mode="signup" />;
}

function AuthShell({ mode }: { mode: "login" | "signup" }) {
  const { login, signup, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>("candidate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res =
      mode === "login"
        ? await login(email, password, role)
        : await signup({ name, email, password, role });
    setLoading(false);
    if (!res.ok) setError(res.error ?? "Something went wrong");
    else navigate(roleRoute(role));
  };

  const runDemo = (r: UserRole) => {
    demoLogin(r);
    navigate(roleRoute(r));
  };

  return (
    <AuroraBackground>
      <div className="min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
          <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left */}
            <div className="hidden lg:flex lg:flex-col lg:justify-between">
              <div>
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to home
                </Link>
                <div className="mt-10">
                  <Logo size={36} />
                  <h1 className="mt-8 text-4xl font-bold tracking-tight">
                    <span className="gradient-text">Hire the best,</span>
                    <br />
                    <span className="gradient-text-brand">faster than ever.</span>
                  </h1>
                  <p className="mt-4 max-w-md text-white/60">
                    Sign in to screen resumes, rank candidates, and run
                    AI-assisted interviews in one workspace.
                  </p>
                </div>
              </div>

              {/* Quick demo */}
              <div className="mt-10">
                <div className="text-xs font-medium uppercase tracking-wider text-white/40">
                  Explore the demo
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { r: "candidate" as UserRole, label: "Candidate", icon: UserCircle2 },
                    { r: "recruiter" as UserRole, label: "Recruiter", icon: Briefcase },
                    { r: "admin" as UserRole, label: "Admin", icon: Shield },
                  ].map(({ r, label, icon: Icon }) => (
                    <button
                      key={r}
                      onClick={() => runDemo(r)}
                      className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs transition hover:border-violet-500/30 hover:bg-violet-500/5"
                    >
                      <Icon className="h-4 w-4 text-white/60 transition group-hover:text-violet-300" />
                      <span className="text-white/70 transition group-hover:text-white">{label}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-white/40">
                  Click any role to enter a fully-featured demo dashboard.
                </p>
              </div>
            </div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="lg:hidden mb-6">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Link>
                <div className="mt-4"><Logo /></div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d0d16]/80 to-[#05050a]/80 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-[11px] text-violet-300">
                    <Sparkles className="h-3 w-3" /> Public beta
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    {mode === "login" ? "Welcome back" : "Create your account"}
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    {mode === "login"
                      ? "Sign in to your SkillSnap workspace."
                      : "Start screening candidates in minutes."}
                  </p>
                </div>

                {mode === "signup" && (
                  <div className="mb-4">
                    <div className="mb-2 text-xs font-medium text-white/60">I am a...</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { r: "candidate" as UserRole, label: "Candidate", icon: UserCircle2 },
                        { r: "recruiter" as UserRole, label: "Recruiter", icon: Briefcase },
                        { r: "admin" as UserRole, label: "Admin", icon: Shield },
                      ].map(({ r, label, icon: Icon }) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs transition ${
                            role === r
                              ? "border-violet-500/40 bg-violet-500/10 text-violet-200"
                              : "border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.05]"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={submit} className="space-y-3">
                  {mode === "signup" && (
                    <Field label="Full name" icon={User} value={name} onChange={setName} placeholder="Ada Lovelace" />
                  )}
                  <Field label="Email" icon={Mail} value={email} onChange={setEmail} type="email" placeholder="you@company.com" />
                  <Field label="Password" icon={Lock} value={password} onChange={setPassword} type="password" placeholder="••••••••" />

                  {mode === "login" && (
                    <div>
                      <div className="mb-2 text-xs font-medium text-white/60">Sign in as</div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { r: "candidate" as UserRole, label: "Candidate" },
                          { r: "recruiter" as UserRole, label: "Recruiter" },
                          { r: "admin" as UserRole, label: "Admin" },
                        ].map(({ r, label }) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`rounded-lg border px-3 py-2 text-xs transition ${
                              role === r
                                ? "border-violet-500/40 bg-violet-500/10 text-violet-200"
                                : "border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.05]"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-glow inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:shadow-violet-500/40 disabled:opacity-60"
                  >
                    {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
                  </button>
                </form>

                <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-white/30">
                  <div className="h-px flex-1 bg-white/5" /> or <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { r: "candidate" as UserRole, label: "Candidate demo" },
                    { r: "recruiter" as UserRole, label: "Recruiter demo" },
                    { r: "admin" as UserRole, label: "Admin demo" },
                  ].map(({ r, label }) => (
                    <button
                      key={r}
                      onClick={() => runDemo(r)}
                      className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-[11px] text-white/70 transition hover:bg-white/[0.06]"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 text-center text-xs text-white/50">
                  {mode === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-violet-300 hover:text-violet-200">Sign up</Link>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <Link to="/login" className="text-violet-300 hover:text-violet-200">Sign in</Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  icon: any;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-white/60">{label}</div>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white placeholder-white/30 transition focus:border-violet-500/40 focus:bg-white/[0.05] focus:outline-none"
        />
      </div>
    </label>
  );
}

function roleRoute(role: UserRole) {
  if (role === "candidate") return "/candidate";
  if (role === "recruiter") return "/recruiter";
  return "/admin";
}
