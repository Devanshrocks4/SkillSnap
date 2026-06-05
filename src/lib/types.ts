export type UserRole = "candidate" | "recruiter" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedBy: string;
  postedAt: string;
  status: "open" | "closed";
  applicantsCount: number;
}

export interface Candidate {
  id: string;
  userId: string;
  name: string;
  email: string;
  title: string;
  experience: number;
  skills: string[];
  education: string;
  location: string;
  avatar?: string;
  resumeUrl?: string;
  aiScore?: number;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
}

export type ApplicationStatus =
  | "applied"
  | "screening"
  | "shortlisted"
  | "interviewed"
  | "offered"
  | "hired"
  | "rejected";

export interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  aiScore: number;
  appliedAt: string;
  skills: string[];
  experience: number;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendation?: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  candidateName: string;
  role: string;
  scheduledAt: string;
  status: "scheduled" | "completed" | "cancelled";
  communicationScore?: number;
  confidenceScore?: number;
  technicalScore?: number;
  overallScore?: number;
  aiRecommendation?: string;
  transcript?: string;
}

export type OnboardingStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected";

export interface Onboarding {
  id: string;
  candidateId: string;
  candidateName: string;
  role: string;
  company: string;
  joiningDate: string;
  documents: {
    idDoc: OnboardingStatus;
    offerLetter: OnboardingStatus;
    education: OnboardingStatus;
    backgroundCheck: OnboardingStatus;
  };
  overallStatus: OnboardingStatus;
}
