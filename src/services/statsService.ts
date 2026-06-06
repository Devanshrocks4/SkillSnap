import { 
  getTotalUserCount, 
  getUserCountByRole, 
  getAllUsers,
  getUsersByRole 
} from "./userService";
import { 
  getAllJobs, 
  getOpenJobs, 
  getJobCountByRecruiter 
} from "./jobService";
import { 
  getTotalApplicationCount, 
  getApplicationCountByRecruiter,
  getShortlistedCountByRecruiter,
  getHiredCountByRecruiter,
  getApplicationsByCandidate 
} from "./applicationService";
import { 
  getTotalInterviewCount, 
  getCompletedInterviewCount,
  getScheduledInterviews 
} from "./interviewService";
import { 
  getActiveOnboardingCount 
} from "./onboardingService";
import type { FirestoreUser } from "../types/firestore";

export interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  activeRecruiters: number;
  activeOnboarding: number;
}

export interface CandidateStats {
  applications: number;
  shortlisted: number;
  interviewed: number;
  hired: number;
  avgScore: number;
}

export interface RecruiterStats {
  totalCandidates: number;
  openJobs: number;
  shortlisted: number;
  hired: number;
  totalApplications: number;
}

// Candidate dashboard stats
export async function getCandidateStats(candidateId: string): Promise<CandidateStats> {
  const applications = await getApplicationsByCandidate(candidateId);
  
  const shortlisted = applications.filter(a => 
    ["shortlisted", "interviewed", "offered", "hired"].includes(a.status)
  ).length;
  
  const interviewed = applications.filter(a => 
    ["interviewed", "offered", "hired"].includes(a.status)
  ).length;
  
  const hired = applications.filter(a => a.status === "hired").length;
  
  const avgScore = applications.length > 0
    ? Math.round(applications.reduce((s, a) => s + (a.aiScore || 0), 0) / applications.length)
    : 0;
  
  return {
    applications: applications.length,
    shortlisted,
    interviewed,
    hired,
    avgScore
  };
}

// Recruiter dashboard stats
export async function getRecruiterStats(recruiterId: string): Promise<RecruiterStats> {
  const totalApplications = await getApplicationCountByRecruiter(recruiterId);
  const openJobs = await getJobCountByRecruiter(recruiterId);
  const shortlisted = await getShortlistedCountByRecruiter(recruiterId);
  const hired = await getHiredCountByRecruiter(recruiterId);
  
  // Get all candidates who have applied to recruiter's jobs
  const allUsers = await getUsersByRole("candidate");
  
  return {
    totalCandidates: allUsers.length,
    openJobs,
    shortlisted,
    hired,
    totalApplications
  };
}

// Admin dashboard stats
export async function getAdminStats(): Promise<DashboardStats> {
  const totalUsers = await getTotalUserCount();
  const activeRecruiters = await getUserCountByRole("recruiter");
  const totalJobs = (await getAllJobs()).length;
  const totalApplications = await getTotalApplicationCount();
  const activeOnboarding = await getActiveOnboardingCount();
  
  return {
    totalUsers,
    activeRecruiters,
    totalJobs,
    totalApplications,
    activeOnboarding
  };
}

// Get recent activity (simulated from recent data changes)
export async function getRecentActivity() {
  const users = await getAllUsers();
  const jobs = await getAllJobs();
  const applications = await getTotalApplicationCount();
  
  // Simulate activity based on data counts
  const activity = [];
  
  if (users.length > 0) {
    activity.push({
      id: "activity-1",
      type: "apply" as const,
      who: users[0]?.name || "User",
      action: "applied to",
      target: jobs[0]?.title || "a job",
      createdAt: new Date()
    });
  }
  
  if (applications > 0) {
    activity.push({
      id: "activity-2",
      type: "ai" as const,
      who: "SkillSnap AI",
      action: "scored",
      target: `${applications} applications`,
      createdAt: new Date()
    });
  }
  
  return activity;
}

// Get pipeline stages for recruiter
export async function getRecruiterPipeline(recruiterId: string) {
  const applications = await getApplicationsByCandidate(""); // This needs refactoring
  // Actually let's get applications by recruiter's jobs
  const allApps = await import("./applicationService");
  const recruiterApps = await allApps.getApplicationsByRecruiter(recruiterId);
  
  return [
    { stage: "Applied", count: recruiterApps.filter(a => a.status === "applied").length },
    { stage: "Screening", count: recruiterApps.filter(a => a.status === "screening").length },
    { stage: "Shortlisted", count: recruiterApps.filter(a => a.status === "shortlisted").length },
    { stage: "Interviewed", count: recruiterApps.filter(a => a.status === "interviewed").length },
    { stage: "Offered", count: recruiterApps.filter(a => a.status === "offered").length },
    { stage: "Hired", count: recruiterApps.filter(a => a.status === "hired").length },
  ];
}

// Get weekly trend data
export async function getWeeklyTrend() {
  // This would typically come from analytics/audit logs
  // For now, return placeholder data
  return [
    { d: "Mon", apps: 0, hires: 0 },
    { d: "Tue", apps: 0, hires: 0 },
    { d: "Wed", apps: 0, hires: 0 },
    { d: "Thu", apps: 0, hires: 0 },
    { d: "Fri", apps: 0, hires: 0 },
    { d: "Sat", apps: 0, hires: 0 },
    { d: "Sun", apps: 0, hires: 0 },
  ];
}

// Get monthly growth data for admin
export async function getMonthlyGrowth() {
  // This would typically come from analytics/audit logs
  // For now, return placeholder data
  return [
    { month: "Jan", users: 0, jobs: 0 },
    { month: "Feb", users: 0, jobs: 0 },
    { month: "Mar", users: 0, jobs: 0 },
    { month: "Apr", users: 0, jobs: 0 },
    { month: "May", users: 0, jobs: 0 },
    { month: "Jun", users: 0, jobs: 0 },
    { month: "Jul", users: 0, jobs: 0 },
  ];
}
