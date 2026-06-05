import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User, UserRole } from "../lib/types";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<{ ok: boolean; error?: string }>;
  signup: (data: { name: string; email: string; password: string; role: UserRole }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  demoLogin: (role: UserRole) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "skillsnap_user";

const demoUsers: Record<UserRole, User> = {
  candidate: {
    id: "u1",
    name: "Ava Chen",
    email: "ava@mail.com",
    role: "candidate",
    createdAt: new Date().toISOString(),
  },
  recruiter: {
    id: "r1",
    name: "Alex Rivera",
    email: "alex@nebulalabs.com",
    role: "recruiter",
    createdAt: new Date().toISOString(),
  },
  admin: {
    id: "a1",
    name: "Jordan Blake",
    email: "jordan@skillsnap.ai",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

// Hardcoded admin credentials
  const ADMIN_EMAIL = "devansh@gupta.com";
  const ADMIN_PASSWORD = "devansh2003";

  const login: AuthCtx["login"] = async (email, password, role) => {
    await new Promise((r) => setTimeout(r, 400));
    if (!email || !password) return { ok: false, error: "Email and password are required." };
    
    // Check for admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: "admin-1",
        name: "Devansh Gupta",
        email: ADMIN_EMAIL,
        role: "admin",
        createdAt: new Date().toISOString(),
      };
      setUser(adminUser);
      return { ok: true };
    }
    
    const u: User = {
      id: "u" + Math.random().toString(36).slice(2, 8),
      name: email.split("@")[0],
      email,
      role: role ?? "candidate",
      createdAt: new Date().toISOString(),
    };
    setUser(u);
    return { ok: true };
  };

  const signup: AuthCtx["signup"] = async ({ name, email, password, role }) => {
    await new Promise((r) => setTimeout(r, 500));
    if (!name || !email || !password) return { ok: false, error: "All fields are required." };
    const u: User = {
      id: "u" + Math.random().toString(36).slice(2, 8),
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    setUser(u);
    return { ok: true };
  };

  const logout = () => setUser(null);

  const demoLogin = (role: UserRole) => setUser(demoUsers[role]);

  return (
    <Ctx.Provider value={{ user, loading, login, signup, logout, demoLogin }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
