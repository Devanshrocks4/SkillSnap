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
  limit,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase/config";
import type { FirestoreJob } from "../types/firestore";

export async function createJob(
  job: Omit<FirestoreJob, "id" | "createdAt" | "applicantsCount">
): Promise<string> {
  const jobRef = doc(collection(db, "jobs"));
  const jobId = jobRef.id;
  const newJob: FirestoreJob = {
    ...job,
    id: jobId,
    createdAt: new Date(),
    postedAt: new Date().toISOString().split("T")[0],
    applicantsCount: 0,
  };
  await setDoc(jobRef, newJob);
  return jobId;
}

export async function getJob(jobId: string): Promise<FirestoreJob | null> {
  const jobDoc = await getDoc(doc(db, "jobs", jobId));
  if (jobDoc.exists()) {
    return jobDoc.data() as FirestoreJob;
  }
  return null;
}

export async function updateJob(
  jobId: string,
  updates: Partial<FirestoreJob>
): Promise<void> {
  await updateDoc(doc(db, "jobs", jobId), updates);
}

export async function deleteJob(jobId: string): Promise<void> {
  await deleteDoc(doc(db, "jobs", jobId));
}

export async function getJobsByRecruiter(recruiterId: string): Promise<FirestoreJob[]> {
  const jobsRef = collection(db, "jobs");
  const q = query(jobsRef, where("recruiterId", "==", recruiterId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreJob);
}

export async function getOpenJobs(): Promise<FirestoreJob[]> {
  const jobsRef = collection(db, "jobs");
  const q = query(
    jobsRef,
    where("status", "==", "open"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreJob);
}

export async function getRecentJobs(count: number = 10): Promise<FirestoreJob[]> {
  const jobsRef = collection(db, "jobs");
  const q = query(
    jobsRef,
    where("status", "==", "open"),
    orderBy("createdAt", "desc"),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreJob);
}

export async function incrementApplicantsCount(jobId: string): Promise<void> {
  const jobDoc = await getDoc(doc(db, "jobs", jobId));
  if (jobDoc.exists()) {
    const job = jobDoc.data() as FirestoreJob;
    await updateDoc(doc(db, "jobs", jobId), {
      applicantsCount: (job.applicantsCount || 0) + 1,
    });
  }
}

export function subscribeToJobs(
  callback: (jobs: FirestoreJob[]) => void
): Unsubscribe {
  const jobsRef = collection(db, "jobs");
  const q = query(jobsRef, where("status", "==", "open"));
  return onSnapshot(q, (snapshot) => {
    const jobs = snapshot.docs.map((doc) => doc.data() as FirestoreJob);
    callback(jobs);
  });
}

/**
 * Get all jobs (for admin dashboard)
 */
export async function getAllJobs(): Promise<FirestoreJob[]> {
  const jobsRef = collection(db, "jobs");
  const snapshot = await getDocs(jobsRef);
  return snapshot.docs.map((doc) => doc.data() as FirestoreJob);
}

/**
 * Get job count by recruiter
 */
export async function getJobCountByRecruiter(recruiterId: string): Promise<number> {
  const jobsRef = collection(db, "jobs");
  const q = query(jobsRef, where("recruiterId", "==", recruiterId));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

/**
 * Get all open jobs (for candidate browse)
 */
export async function getAllOpenJobs(): Promise<FirestoreJob[]> {
  const jobsRef = collection(db, "jobs");
  const q = query(
    jobsRef,
    where("status", "==", "open"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreJob);
}
