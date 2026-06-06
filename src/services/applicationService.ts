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
import type { FirestoreApplication, ApplicationStatus } from "../types/firestore";

export async function createApplication(
  application: Omit<FirestoreApplication, "id" | "createdAt" | "status">
): Promise<string> {
  const applicationRef = doc(collection(db, "applications"));
  const applicationId = applicationRef.id;
  const newApplication: FirestoreApplication = {
    ...application,
    id: applicationId,
    createdAt: new Date(),
    status: "applied",
  };
  await setDoc(applicationRef, newApplication);
  return applicationId;
}

export async function getApplication(
  applicationId: string
): Promise<FirestoreApplication | null> {
  const applicationDoc = await getDoc(doc(db, "applications", applicationId));
  if (applicationDoc.exists()) {
    return applicationDoc.data() as FirestoreApplication;
  }
  return null;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<void> {
  await updateDoc(doc(db, "applications", applicationId), { status });
}

export async function deleteApplication(applicationId: string): Promise<void> {
  await deleteDoc(doc(db, "applications", applicationId));
}

export async function getApplicationsByCandidate(
  candidateId: string
): Promise<FirestoreApplication[]> {
  const applicationsRef = collection(db, "applications");
  const q = query(
    applicationsRef,
    where("candidateId", "==", candidateId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreApplication);
}

export async function getApplicationsByJob(jobId: string): Promise<FirestoreApplication[]> {
  const applicationsRef = collection(db, "applications");
  const q = query(
    applicationsRef,
    where("jobId", "==", jobId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreApplication);
}

export async function getApplicationsByRecruiter(
  recruiterId: string
): Promise<FirestoreApplication[]> {
  // Get all jobs by recruiter first, then get applications for those jobs
  const { getJobsByRecruiter } = await import("./jobService");
  const recruiterJobs = await getJobsByRecruiter(recruiterId);
  const jobIds = recruiterJobs.map((j) => j.id);
  
  const applications: FirestoreApplication[] = [];
  for (const jobId of jobIds) {
    const jobApplications = await getApplicationsByJob(jobId);
    applications.push(...jobApplications);
  }
  
  return applications.sort((a, b) => 
    (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
  );
}

export async function checkExistingApplication(
  jobId: string,
  candidateId: string
): Promise<FirestoreApplication | null> {
  const applicationsRef = collection(db, "applications");
  const q = query(
    applicationsRef,
    where("jobId", "==", jobId),
    where("candidateId", "==", candidateId)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].data() as FirestoreApplication;
  }
  return null;
}

export function subscribeToCandidateApplications(
  candidateId: string,
  callback: (applications: FirestoreApplication[]) => void
): Unsubscribe {
  const applicationsRef = collection(db, "applications");
  const q = query(
    applicationsRef,
    where("candidateId", "==", candidateId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const applications = snapshot.docs.map(
      (doc) => doc.data() as FirestoreApplication
    );
    callback(applications);
  });
}

/**
 * Get total application count for all jobs by a recruiter
 */
export async function getApplicationCountByRecruiter(
  recruiterId: string
): Promise<number> {
  const { getJobsByRecruiter } = await import("./jobService");
  const recruiterJobs = await getJobsByRecruiter(recruiterId);
  const jobIds = recruiterJobs.map((j) => j.id);

  let totalCount = 0;
  for (const jobId of jobIds) {
    const applicationsRef = collection(db, "applications");
    const q = query(applicationsRef, where("jobId", "==", jobId));
    const snapshot = await getDocs(q);
    totalCount += snapshot.size;
  }

  return totalCount;
}

/**
 * Get shortlisted count for a recruiter's jobs
 */
export async function getShortlistedCountByRecruiter(
  recruiterId: string
): Promise<number> {
  const { getJobsByRecruiter } = await import("./jobService");
  const recruiterJobs = await getJobsByRecruiter(recruiterId);
  const jobIds = recruiterJobs.map((j) => j.id);

  let totalCount = 0;
  for (const jobId of jobIds) {
    const applicationsRef = collection(db, "applications");
    const q = query(
      applicationsRef,
      where("jobId", "==", jobId),
      where("status", "in", ["shortlisted", "interviewed", "offered", "hired"])
    );
    const snapshot = await getDocs(q);
    totalCount += snapshot.size;
  }

  return totalCount;
}

/**
 * Get hired count for a recruiter's jobs
 */
export async function getHiredCountByRecruiter(recruiterId: string): Promise<number> {
  const { getJobsByRecruiter } = await import("./jobService");
  const recruiterJobs = await getJobsByRecruiter(recruiterId);
  const jobIds = recruiterJobs.map((j) => j.id);

  let totalCount = 0;
  for (const jobId of jobIds) {
    const applicationsRef = collection(db, "applications");
    const q = query(
      applicationsRef,
      where("jobId", "==", jobId),
      where("status", "==", "hired")
    );
    const snapshot = await getDocs(q);
    totalCount += snapshot.size;
  }

  return totalCount;
}

/**
 * Get total application count (for admin)
 */
export async function getTotalApplicationCount(): Promise<number> {
  const applicationsRef = collection(db, "applications");
  const snapshot = await getDocs(applicationsRef);
  return snapshot.size;
}
