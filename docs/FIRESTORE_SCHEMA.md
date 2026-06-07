# 📊 Firestore Schema

This document describes the complete Firestore data model for SkillSnap.

---

## Collections

### 1. `users/{uid}`

Core user profile. Every authenticated user has a document.

```ts
{
  uid: string,              // Firebase Auth UID
  name: string,
  email: string,
  role: "candidate" | "recruiter" | "admin",
  avatarUrl?: string,       // Firebase Storage URL
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastLoginAt: Timestamp,
  status: "active" | "suspended",
}
```

---

### 2. `jobs/{jobId}`

Job postings created by recruiters.

```ts
{
  id: string,
  title: string,
  company: string,
  location: string,
  type: "Full-time" | "Part-time" | "Contract" | "Remote",
  experience: string,            // e.g. "5+ years"
  salary: string,                // e.g. "$160k – $210k"
  description: string,
  requirements: string[],
  skills: string[],
  postedBy: string,              // recruiter uid
  postedAt: Timestamp,
  status: "open" | "closed",
  applicantsCount: number,       // denormalized counter
}
```

Subcollection: `applications` — see below.

---

### 3. `candidates/{candidateId}`

Candidate profile — linked to a user.

```ts
{
  userId: string,
  name: string,
  email: string,
  title: string,                 // e.g. "Senior Frontend Engineer"
  experience: number,            // years
  skills: string[],
  education: string,
  location: string,
  avatarUrl?: string,
  resumeUrl?: string,            // Firebase Storage URL
  linkedinUrl?: string,
  portfolioUrl?: string,
  aiScore?: number,              // aggregate score
  summary?: string,              // AI-generated
  strengths?: string[],
  weaknesses?: string[],
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

---

### 4. `applications/{applicationId}`

Link between candidate and job.

```ts
{
  candidateId: string,
  candidateName: string,         // denormalized for fast reads
  candidateEmail: string,
  jobId: string,
  jobTitle: string,
  company: string,
  status:
    | "applied"
    | "screening"
    | "shortlisted"
    | "interviewed"
    | "offered"
    | "hired"
    | "rejected",
  aiScore: number,               // 0-100
  summary?: string,              // AI-generated
  strengths?: string[],
  weaknesses?: string[],
  matchedSkills?: string[],
  missingSkills?: string[],
  recommendation?: string,
  appliedAt: Timestamp,
  updatedAt: Timestamp,
  coverLetter?: string,
}
```

---

### 5. `interviews/{interviewId}`

Scheduled and completed interviews.

```ts
{
  applicationId: string,
  candidateId: string,
  candidateName: string,
  role: string,
  jobId: string,
  scheduledAt: Timestamp,
  status: "scheduled" | "completed" | "cancelled",
  mode: "video" | "audio" | "onsite",
  videoUrl?: string,             // Firebase Storage URL
  transcript?: string,
  communicationScore?: number,   // 0-100
  confidenceScore?: number,      // 0-100
  technicalScore?: number,       // 0-100
  overallScore?: number,         // 0-100
  aiRecommendation?: string,
  highlights?: string[],
  concerns?: string[],
  evaluatedBy?: string,          // recruiter uid
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

---

### 6. `onboarding/{onboardingId}`

Document verification and joining status.

```ts
{
  candidateId: string,
  candidateName: string,
  jobId: string,
  role: string,
  company: string,
  joiningDate: Timestamp,
  documents: {
    idDoc: OnboardingStatus,
    offerLetter: OnboardingStatus,
    education: OnboardingStatus,
    backgroundCheck: OnboardingStatus,
  },
  overallStatus: OnboardingStatus,
  notes?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
}

// OnboardingStatus = "pending" | "under_review" | "approved" | "rejected"
```

---

### 7. `analytics/{aggregate}` (optional)

Platform-wide aggregated metrics, updated by Cloud Functions.

```ts
{
  totalCandidates: number,
  totalRecruiters: number,
  totalJobs: number,
  totalApplications: number,
  totalHires: number,
  avgTimeToHire: number,         // days
  avgOfferAcceptance: number,    // percent
  skillDistribution: Record<string, number>,
  scoreDistribution: {
    "55-65": number,
    "65-75": number,
    "75-85": number,
    "85-95": number,
  },
  updatedAt: Timestamp,
}
```

---

## Indexes

Recommended composite indexes:

```
applications:
  - jobId (asc), aiScore (desc)
  - candidateId (asc), appliedAt (desc)
  - status (asc), appliedAt (desc)

jobs:
  - status (asc), postedAt (desc)
  - company (asc), postedAt (desc)

interviews:
  - status (asc), scheduledAt (asc)
```

---

## Denormalization Strategy

To keep reads fast we denormalize:

- `candidateName`, `candidateEmail`, `jobTitle`, `company` on applications (avoids join reads)
- `applicantsCount` on jobs (incremented via Cloud Function on application create/delete)
- `aiScore`, `summary`, etc. written once by Cloud Function, then read many times.

---

## Security

See [FIREBASE_RULES.md](./FIREBASE_RULES.md) for production-ready rules.
