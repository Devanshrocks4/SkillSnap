import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase/config";
import type { UserRole } from "../lib/types";
import type { FirestoreUser } from "../types/firestore";

export interface AuthResult {
  ok: boolean;
  error?: string;
}

export async function signupWithEmail(
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<AuthResult> {
  // SAFETY: Ensure we're using createUserWithEmailAndPassword for signup
  // This explicitly prevents any chance of using signInWithEmailAndPassword
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    await updateProfile(firebaseUser, { displayName: name });
    await sendEmailVerification(firebaseUser);
    const userProfile: FirestoreUser = {
      uid: firebaseUser.uid,
      name,
      email,
      role,
      createdAt: new Date(),
      photoURL: firebaseUser.photoURL || undefined,
    };
    await setDoc(doc(db, "users", firebaseUser.uid), userProfile);
    return { ok: true };
  } catch (error: unknown) {
    // Extract Firebase error code properly
    let errorMessage = "Signup failed";
    if (error && typeof error === "object") {
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code) {
        // Map Firebase error codes to user-friendly messages
        const errorCode = firebaseError.code;
        switch (errorCode) {
          case "auth/email-already-in-use":
            errorMessage = "An account with this email already exists. Please sign in instead.";
            break;
          case "auth/weak-password":
            errorMessage = "Password is too weak. Please use at least 6 characters.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address.";
            break;
          case "auth/operation-not-allowed":
            errorMessage = "Signup is currently disabled. Contact support.";
            break;
          default:
            errorMessage = firebaseError.message || "Signup failed. Please try again.";
        }
      }
    }
    return { ok: false, error: errorMessage };
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  // SAFETY: Ensure we're using signInWithEmailAndPassword for login
  // This explicitly prevents any chance of using createUserWithEmailAndPassword
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { ok: true };
  } catch (error: unknown) {
    // Extract Firebase error code properly
    let errorMessage = "Login failed";
    if (error && typeof error === "object") {
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code) {
        // Map Firebase error codes to user-friendly messages
        const errorCode = firebaseError.code;
        switch (errorCode) {
          case "auth/user-not-found":
            errorMessage = "No account found with this email. Please sign up first.";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password. Please try again.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address.";
            break;
          case "auth/user-disabled":
            errorMessage = "This account has been disabled. Contact support.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many failed attempts. Please try again later.";
            break;
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your connection.";
            break;
          default:
            errorMessage = firebaseError.message || "Login failed. Please try again.";
        }
      }
    }
    return { ok: false, error: errorMessage };
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function getUserProfile(uid: string): Promise<FirestoreUser | null> {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data() as FirestoreUser;
    }
    return null;
  } catch {
    return null;
  }
}
