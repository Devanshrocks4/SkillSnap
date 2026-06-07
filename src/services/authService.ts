import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase/config";
import type { UserRole } from "../lib/types";
import type { FirestoreUser } from "../types/firestore";

export interface AuthResult {
  ok: boolean;
  error?: string;
  role?: UserRole;
}

// Hardcoded admin credentials — checked at signup
const ADMIN_EMAIL = "devansh@gupta.com";

export async function signupWithEmail(
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<AuthResult> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = cred.user;
    await updateProfile(firebaseUser, { displayName: name });

    // Hardcoded admin override
    const effectiveRole: UserRole =
      email.toLowerCase() === ADMIN_EMAIL ? "admin" : role;

    const userProfile: FirestoreUser = {
      uid: firebaseUser.uid,
      name,
      email: email.toLowerCase(),
      role: effectiveRole,
      createdAt: new Date(),
      photoURL: firebaseUser.photoURL || undefined,
    };

    // Write to Firestore users collection
    await setDoc(doc(db, "users", firebaseUser.uid), {
      ...userProfile,
      createdAt: serverTimestamp(),
    });

    return { ok: true, role: effectiveRole };
  } catch (error: unknown) {
    return { ok: false, error: parseFirebaseError(error) };
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // Read role from Firestore immediately
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    const role = snap.exists() ? (snap.data().role as UserRole) : "candidate";
    return { ok: true, role };
  } catch (error: unknown) {
    return { ok: false, error: parseFirebaseError(error) };
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function getUserProfile(uid: string): Promise<FirestoreUser | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      const data = snap.data();
      return {
        ...data,
        uid: data.uid || uid,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
      } as FirestoreUser;
    }
    return null;
  } catch {
    return null;
  }
}

function parseFirebaseError(error: unknown): string {
  if (!error || typeof error !== "object") return "An error occurred.";
  const e = error as { code?: string; message?: string };
  switch (e.code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please sign in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
      return "No account found with these credentials.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is not enabled. Contact support.";
    default:
      return e.message || "Authentication failed. Please try again.";
  }
}
