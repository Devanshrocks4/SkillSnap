import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase/config";
import type { FirestoreOnboarding } from "../types/firestore";

export async function createOnboarding(
  onboarding: Omit<FirestoreOnboarding, "id" | "createdAt">
): Promise<string> {
  const onboardingRef = doc(collection(db, "onboarding"));
  const onboardingId = onboardingRef.id;
  const newOnboarding: FirestoreOnboarding = {
    ...onboarding,
    id: onboardingId,
    createdAt: new Date(),
  };
  await setDoc(onboardingRef, newOnboarding);
  return onboardingId;
}

export async function getOnboarding(
  onboardingId: string
): Promise<FirestoreOnboarding | null> {
  const onboardingDoc = await getDoc(doc(db, "onboarding", onboardingId));
  if (onboardingDoc.exists()) {
    return onboardingDoc.data() as FirestoreOnboarding;
  }
  return null;
}

export async function updateOnboarding(
  onboardingId: string,
  updates: Partial<FirestoreOnboarding>
): Promise<void> {
  await updateDoc(doc(db, "onboarding", onboardingId), updates);
}

export async function deleteOnboarding(onboardingId: string): Promise<void> {
  await deleteDoc(doc(db, "onboarding", onboardingId));
}

export async function getOnboardingByCandidate(
  candidateId: string
): Promise<FirestoreOnboarding | null> {
  const onboardingRef = collection(db, "onboarding");
  const q = query(onboardingRef, where("candidateId", "==", candidateId));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].data() as FirestoreOnboarding;
  }
  return null;
}

export async function getOnboardingByJob(
  jobId: string
): Promise<FirestoreOnboarding[]> {
  const onboardingRef = collection(db, "onboarding");
  const q = query(onboardingRef, where("jobId", "==", jobId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreOnboarding);
}

export async function getAllOnboarding(): Promise<FirestoreOnboarding[]> {
  const onboardingRef = collection(db, "onboarding");
  const q = query(onboardingRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreOnboarding);
}

export async function updateDocumentStatus(
  onboardingId: string,
  documentKey: keyof FirestoreOnboarding["documents"],
  status: "pending" | "under_review" | "approved" | "rejected"
): Promise<void> {
  const onboardingDoc = await getDoc(doc(db, "onboarding", onboardingId));
  if (onboardingDoc.exists()) {
    const onboarding = onboardingDoc.data() as FirestoreOnboarding;
    await updateDoc(doc(db, "onboarding", onboardingId), {
      documents: {
        ...onboarding.documents,
        [documentKey]: status,
      },
    });
  }
}

export function subscribeToCandidateOnboarding(
  candidateId: string,
  callback: (onboarding: FirestoreOnboarding | null) => void
): Unsubscribe {
  const onboardingRef = collection(db, "onboarding");
  const q = query(onboardingRef, where("candidateId", "==", candidateId));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      callback(snapshot.docs[0].data() as FirestoreOnboarding);
    } else {
      callback(null);
    }
  });
}

export function subscribeToAllOnboarding(
  callback: (onboarding: FirestoreOnboarding[]) => void
): Unsubscribe {
  const onboardingRef = collection(db, "onboarding");
  const q = query(onboardingRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const onboarding = snapshot.docs.map(
      (doc) => doc.data() as FirestoreOnboarding
    );
    callback(onboarding);
  });
}

/**
 * Get active onboarding count (for admin)
 */
export async function getActiveOnboardingCount(): Promise<number> {
  const snapshot = await getAllOnboarding();
  return snapshot.filter(o => o.status === "pending" || o.status === "under_review").length;
}

/**
 * Get onboarding count by status
 */
export async function getOnboardingCountByStatus(
  status: "pending" | "under_review" | "approved" | "rejected"
): Promise<number> {
  const onboardingRef = collection(db, "onboarding");
  const q = query(onboardingRef, where("status", "==", status));
  const snapshot = await getDocs(q);
  return snapshot.size;
}
