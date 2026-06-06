import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../lib/firebase/config";
import { signupWithEmail, signInWithEmail, signOut as firebaseSignOut, getUserProfile } from "../services/authService";
import type { UserRole } from "../lib/types";
import type { FirestoreUser } from "../types/firestore";

interface AuthUser extends FirestoreUser {
  role: UserRole;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (data: { name: string; email: string; password: string; role: UserRole }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Get user profile from Firestore
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          setUser({
            uid: profile.uid,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            createdAt: profile.createdAt,
            photoURL: profile.photoURL,
          });
        } else {
          // Fallback if no profile in Firestore
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
            email: firebaseUser.email || "",
            role: "candidate" as UserRole,
            createdAt: null,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

const login: AuthCtx["login"] = async (email, password) => {
    // SAFETY: Explicitly verify we're calling signIn, not signup
    console.debug("[Auth] Login attempt for:", email);
    return signInWithEmail(email, password);
  };

  const signup: AuthCtx["signup"] = async ({ name, email, password, role }) => {
    // SAFETY: Explicitly verify we're calling signup, not login
    console.debug("[Auth] Signup attempt for:", email, "as", role);
    return signupWithEmail(email, password, name, role);
  };

  const logout = async () => {
    await firebaseSignOut();
  };

  return (
    <Ctx.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
