import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase/config";
import {
  signupWithEmail,
  signInWithEmail,
  signOut as firebaseSignOut,
  getUserProfile,
} from "../services/authService";
import type { UserRole } from "../lib/types";
import type { FirestoreUser } from "../types/firestore";

interface AuthUser extends FirestoreUser {
  role: UserRole;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; role?: UserRole }>;
  signup: (data: { name: string; email: string; password: string; role: UserRole }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

const loadUserProfile = async (firebaseUser: User): Promise<AuthUser | null> => {
  try {
    const profile = await getUserProfile(firebaseUser.uid);
    if (profile) {
      return {
        uid: profile.uid,
        name: profile.name,
        email: profile.email,
        role: profile.role as UserRole,
        createdAt: profile.createdAt,
        photoURL: profile.photoURL,
      };
    }
    return {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
      email: firebaseUser.email || "",
      role: "candidate" as UserRole,
      createdAt: null,
    };
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const profile = await loadUserProfile(firebaseUser);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // FIX: login now returns actual Firestore role - no dynamic imports
  const login: AuthCtx["login"] = async (email, password) => {
    try {
      const result = await signInWithEmail(email, password);
      if (!result.ok) return result;
      // Get role directly from Firestore (static import, no dynamic)
      if (auth.currentUser) {
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        const role = snap.exists() ? (snap.data().role as UserRole) : "candidate";
        return { ok: true, role };
      }
      return { ok: true, role: result.role ?? "candidate" };
    } catch {
      return { ok: false, error: "Login failed. Please try again." };
    }
  };

  const signup: AuthCtx["signup"] = async ({ name, email, password, role }) => {
    return signupWithEmail(email, password, name, role);
  };

  // FIX: logout properly awaited, clears state
  const logout = async () => {
    await firebaseSignOut();
    setUser(null);
  };

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    const profile = await loadUserProfile(auth.currentUser);
    if (profile) setUser(profile);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
