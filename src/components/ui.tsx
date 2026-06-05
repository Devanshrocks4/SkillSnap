import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <img
src="/skillsnap-logo.png"
        alt="SkillSnap Logo"
        className="rounded-xl"
        style={{
          width: size + 8,
          height: size + 8,
          objectFit: "contain",
        }}
      />
      <span className="text-[17px] font-semibold tracking-tight text-white">
        Skill<span className="gradient-text-brand">Snap</span>
      </span>
    </div>
  );
}

export function AuroraBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="aurora-bg" />
      <div className="aurora-bg-3" />
      <div className="absolute inset-0 grid-pattern opacity-60" />
      
      {/* Glitter Particles */}
      <div className="glitter-container">
        <div className="glitter-particle large" />
        <div className="glitter-particle small" />
        <div className="glitter-particle" />
        <div className="glitter-particle large" />
        <div className="glitter-particle small" />
        <div className="glitter-particle" />
        <div className="glitter-particle large" />
        <div className="glitter-particle small" />
        <div className="glitter-particle" />
        <div className="glitter-particle large" />
        <div className="glitter-particle small" />
        <div className="glitter-particle" />
        <div className="glitter-particle large" />
        <div className="glitter-particle small" />
        <div className="glitter-particle" />
        <div className="glitter-particle large" />
        <div className="glitter-particle small" />
        <div className="glitter-particle" />
        <div className="glitter-particle large" />
        <div className="glitter-particle small" />
        <div className="glitter-particle" />
        <div className="glitter-particle large" />
        <div className="glitter-particle small" />
        <div className="glitter-particle" />
        <div className="glitter-particle large" />
        <div className="glitter-particle small" />
        <div className="glitter-particle" />
        <div className="glitter-particle large" />
      </div>
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function Shimmer({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded-md ${className}`} />;
}

export function Badge({
  children,
  tone = "default",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "brand" | "teal" | "pink";
  className?: string;
}) {
  const map: Record<string, string> = {
    default: "bg-white/5 text-white/70 border-white/10",
    success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    brand: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    teal: "bg-teal-500/10 text-teal-300 border-teal-500/20",
    pink: "bg-pink-500/10 text-pink-300 border-pink-500/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${map[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  accent = "brand",
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon?: React.ReactNode;
  accent?: "brand" | "teal" | "pink" | "amber" | "sky";
}) {
  const accents: Record<string, string> = {
    brand: "from-violet-500/20 to-violet-500/0 border-violet-500/20",
    teal: "from-teal-500/20 to-teal-500/0 border-teal-500/20",
    pink: "from-pink-500/20 to-pink-500/0 border-pink-500/20",
    amber: "from-amber-500/20 to-amber-500/0 border-amber-500/20",
    sky: "from-sky-500/20 to-sky-500/0 border-sky-500/20",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5"
    >
      <div
        className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${accents[accent]} blur-2xl`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-white/40">
            {label}
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {value}
          </div>
          {delta && (
            <div className="mt-1 text-xs text-teal-300/80">{delta}</div>
          )}
        </div>
        {icon && (
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/5 bg-white/[0.03] text-white/60">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function AnimatedCounter({
  value,
  duration = 1.2,
  prefix = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setStarted(true);
  }, []);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, started]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
