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
import type { FirestoreInterview } from "../types/firestore";

export async function createInterview(
  interview: Omit<FirestoreInterview, "id" | "createdAt">
): Promise<string> {
  const interviewRef = doc(collection(db, "interviews"));
  const interviewId = interviewRef.id;
  const newInterview: FirestoreInterview = {
    ...interview,
    id: interviewId,
    createdAt: new Date(),
  };
  await setDoc(interviewRef, newInterview);
  return interviewId;
}

export async function getInterview(
  interviewId: string
): Promise<FirestoreInterview | null> {
  const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
  if (interviewDoc.exists()) {
    return interviewDoc.data() as FirestoreInterview;
  }
  return null;
}

export async function updateInterview(
  interviewId: string,
  updates: Partial<FirestoreInterview>
): Promise<void> {
  await updateDoc(doc(db, "interviews", interviewId), updates);
}

export async function deleteInterview(interviewId: string): Promise<void> {
  await deleteDoc(doc(db, "interviews", interviewId));
}

export async function getInterviewsByCandidate(
  candidateId: string
): Promise<FirestoreInterview[]> {
  const interviewsRef = collection(db, "interviews");
  const q = query(
    interviewsRef,
    where("candidateId", "==", candidateId),
    orderBy("scheduledAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreInterview);
}

export async function getInterviewsByRecruiter(
  recruiterId: string
): Promise<FirestoreInterview[]> {
  const interviewsRef = collection(db, "interviews");
  const q = query(
    interviewsRef,
    where("recruiterId", "==", recruiterId),
    orderBy("scheduledAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreInterview);
}

export async function getInterviewsByApplication(
  applicationId: string
): Promise<FirestoreInterview[]> {
  const interviewsRef = collection(db, "interviews");
  const q = query(
    interviewsRef,
    where("applicationId", "==", applicationId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreInterview);
}

export async function getScheduledInterviews(
  recruiterId: string
): Promise<FirestoreInterview[]> {
  const interviewsRef = collection(db, "interviews");
  const q = query(
    interviewsRef,
    where("recruiterId", "==", recruiterId),
    where("status", "==", "scheduled"),
    orderBy("scheduledAt", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreInterview);
}

export async function getCompletedInterviews(
  recruiterId: string
): Promise<FirestoreInterview[]> {
  const interviewsRef = collection(db, "interviews");
  const q = query(
    interviewsRef,
    where("recruiterId", "==", recruiterId),
    where("status", "==", "completed"),
    orderBy("scheduledAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreInterview);
}

export function subscribeToCandidateInterviews(
  candidateId: string,
  callback: (interviews: FirestoreInterview[]) => void
): Unsubscribe {
  const interviewsRef = collection(db, "interviews");
  const q = query(
    interviewsRef,
    where("candidateId", "==", candidateId),
    orderBy("scheduledAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const interviews = snapshot.docs.map(
      (doc) => doc.data() as FirestoreInterview
    );
    callback(interviews);
  });
}

export function subscribeToRecruiterInterviews(
  recruiterId: string,
  callback: (interviews: FirestoreInterview[]) => void
): Unsubscribe {
  const interviewsRef = collection(db, "interviews");
  const q = query(
    interviewsRef,
    where("recruiterId", "==", recruiterId),
    orderBy("scheduledAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const interviews = snapshot.docs.map(
      (doc) => doc.data() as FirestoreInterview
    );
    callback(interviews);
  });
}

/**
 * Get total interview count (for admin)
 */
export async function getTotalInterviewCount(): Promise<number> {
  const interviewsRef = collection(db, "interviews");
  const snapshot = await getDocs(interviewsRef);
  return snapshot.size;
}

/**
 * Get completed interview count (for admin)
 */
export async function getCompletedInterviewCount(): Promise<number> {
  const interviewsRef = collection(db, "interviews");
  const q = query(interviewsRef, where("status", "==", "completed"));
  const snapshot = await getDocs(q);
  return snapshot.size;
}
