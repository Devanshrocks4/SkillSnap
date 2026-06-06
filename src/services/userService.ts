import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase/config";
import type { FirestoreUser } from "../types/firestore";

export async function getUserByUid(uid: string): Promise<FirestoreUser | null> {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data() as FirestoreUser;
  }
  return null;
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<FirestoreUser>
): Promise<void> {
  await updateDoc(doc(db, "users", uid), {
    ...updates,
    updatedAt: new Date(),
  });
}

export async function getUsersByRole(
  role: "candidate" | "recruiter" | "admin"
): Promise<FirestoreUser[]> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("role", "==", role));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreUser);
}

export async function getAllUsers(): Promise<FirestoreUser[]> {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map((doc) => doc.data() as FirestoreUser);
}

export async function createUserProfile(user: FirestoreUser): Promise<void> {
  await setDoc(doc(db, "users", user.uid), user);
}

/**
 * Get total user count (for admin dashboard)
 */
export async function getTotalUserCount(): Promise<number> {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  return snapshot.size;
}

/**
 * Get user count by role
 */
export async function getUserCountByRole(role: "candidate" | "recruiter" | "admin"): Promise<number> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("role", "==", role));
  const snapshot = await getDocs(q);
  return snapshot.size;
}
