import type { UserRole } from "../lib/types";

/**
 * Firestore type definitions for SkillSnap
 */

// User profile stored in Firestore
export interface FirestoreUser {
  uid: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date | null;
  photoURL?: string;
  // Extended properties for recruiter/admin views
  title?: string;
  location?: string;
  skills?: string[];
  experience?: number;
  aiScore?: number;
  jobs?: number;
  hires?: number;
}

// Extended user for candidate (stores additional profile info)
export interface FirestoreCandidate {
  uid: string;
  name: string;
  email: string;
  title: string;
  experience: number;
  skills: string[];
  education: string;
  location: string;
  resumeUrl?: string;
  aiScore?: number;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  createdAt: Date | null;
}

// Job posting stored in Firestore
export interface FirestoreJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  recruiterId: string;
  companyId?: string;
  status: "open" | "closed";
  createdAt: Date | null;
  postedAt?: string;
  postedBy?: string;
  applicantsCount: number;
}

// Job application stored in Firestore
export interface FirestoreApplication {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName?: string;
  candidateEmail?: string;
  jobTitle?: string;
  company?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  createdAt: Date | null;
  appliedAt?: string;
  aiScore?: number;
  skills?: string[];
  experience?: number;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendation?: string;
}

// Application status enum
export type ApplicationStatus =
  | "applied"
  | "screening"
  | "shortlisted"
  | "interviewed"
  | "offered"
  | "hired"
  | "rejected";

// Company stored in Firestore
export interface FirestoreCompany {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  website?: string;
  location: string;
  createdAt: Date | null;
}

// Resume storage path
export type ResumePath = `resumes/${string}/${string}`;

// Interview stored in Firestore
export interface FirestoreInterview {
  id: string;
  applicationId: string;
  candidateId: string;
  jobId: string;
  recruiterId: string;
  scheduledAt: Date | null;
  status: "scheduled" | "completed" | "cancelled";
  transcript?: string;
  communicationScore?: number;
  confidenceScore?: number;
  technicalScore?: number;
  overallScore?: number;
  aiRecommendation?: string;
  createdAt: Date | null;
}

// Onboarding stored in Firestore
export interface FirestoreOnboarding {
  id: string;
  candidateId: string;
  jobId: string;
  companyId: string;
  joiningDate: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  documents: {
    idDoc: "pending" | "under_review" | "approved" | "rejected";
    offerLetter: "pending" | "under_review" | "approved" | "rejected";
    education: "pending" | "under_review" | "approved" | "rejected";
    backgroundCheck: "pending" | "under_review" | "approved" | "rejected";
  };
  createdAt: Date | null;
}

// Activity feed item
export interface FirestoreActivity {
  id: string;
  type: "apply" | "ai" | "shortlist" | "interview" | "job" | "onboard";
  who: string;
  action: string;
  target: string;
  createdAt: Date | null;
}
