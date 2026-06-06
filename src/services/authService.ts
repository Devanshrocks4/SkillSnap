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
    const errorMessage = error instanceof Error ? error.message : "Signup failed";
    return { ok: false, error: errorMessage };
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { ok: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Login failed";
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
