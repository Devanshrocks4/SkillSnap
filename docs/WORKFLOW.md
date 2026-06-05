# 🔄 SkillSnap Workflows

End-to-end journeys for each user role.

---

## 1. Candidate Journey

### 1.1 Registration

1. Candidate visits `skillsnap.ai`
2. Clicks **Get started** → `/signup`
3. Selects role: **Candidate**
4. Enters name, email, password
5. Account created, redirected to `/candidate`

### 1.2 Profile Setup

1. Lands on Candidate Overview
2. Uploads resume (PDF) → stored in Firebase Storage
3. AI extracts skills, experience, education → stored on candidate document
4. AI generates a profile summary and profile-strength score

### 1.3 Job Discovery

1. Clicks **Browse Jobs**
2. Sees all open roles
3. Top of page: **AI-matched picks** — ranked by skill overlap
4. Filters by search, location, type

### 1.4 Application

1. Clicks **Apply now** on a job card
2. Optionally adds a cover letter
3. Application document created in Firestore
4. Cloud Function triggers → Gemini screens resume → `aiScore` + `summary` written back
5. Application appears in **My Applications** with status = `applied`

### 1.5 Status Tracking

1. Checks **My Applications** regularly
2. Status evolves: `applied` → `screening` → `shortlisted` → `interviewed` → `offered` → `hired`

### 1.6 AI Insights

1. Clicks **AI Insights**
2. Sees:
   - Skills to grow (and match % impact)
   - Market insights (salary, competition)
   - Best-matched roles right now

### 1.7 Interview

1. Recruiter schedules an interview
2. Candidate sees it in **Interviews**
3. Candidate can upload an interview video (optional)
4. After the interview, AI evaluation appears

### 1.8 Onboarding

1. Once `hired`, an onboarding document is created
2. Candidate uploads: ID, offer letter, education certificates
3. Status updates as each doc is approved
4. Joining date is displayed

---

## 2. Recruiter Journey

### 2.1 Registration & Login

1. Recruiter is invited by admin (or signs up)
2. Role is set to `recruiter` by admin
3. Logs in → redirected to `/recruiter`

### 2.2 Post a Job

1. Clicks **Post a job**
2. Fills: title, company, location, type, experience, salary, description, requirements, skills
3. Job saved to Firestore, appears in **Jobs**

### 2.3 View Applicants

1. Opens a job card → **View applicants**
2. Sees list of applicants ranked by AI score
3. Each row shows: name, skills, experience, AI score

### 2.4 AI Screening

1. Clicks **AI Screening** in sidebar
2. Selects a candidate
3. Gemini generates: score, summary, strengths, weaknesses, matched/missing skills, recommendation
4. Recruiter reviews the report

### 2.5 Shortlist / Reject

1. Clicks **Shortlist** or **Reject** on the screening report
2. Application status updated in Firestore
3. Candidate is notified

### 2.6 Interview Evaluation

1. Schedules an interview with a shortlisted candidate
2. After interview, pastes transcript into AI evaluator
3. AI returns: communication, confidence, technical, overall scores + highlights + concerns + recommendation

### 2.7 Onboarding

1. When offer is accepted, changes status to `hired`
2. Creates an onboarding document
3. Candidate uploads documents
4. Recruiter verifies each one (approve / reject)
5. Overall status evolves: `pending` → `under_review` → `approved`

### 2.8 Analytics

1. Clicks **Analytics**
2. Sees:
   - Total candidates, selected, rejected
   - Hiring funnel
   - Score distribution
   - Skills distribution
   - Recruitment trends
   - Pipeline health

---

## 3. Admin Journey

### 3.1 Platform Oversight

1. Logs in → `/admin`
2. Sees:
   - Total users, active recruiters, jobs, applications
   - Platform growth chart
   - System health (Firebase Auth, Firestore, Gemini, Storage)
   - Recent signups
   - Top active jobs

### 3.2 User Management

1. Clicks **Users**
2. Views all platform users
3. Can edit roles, suspend users, or delete accounts

### 3.3 Recruiter Management

1. Clicks **Recruiters**
2. Views all recruiter accounts
3. Sees per-recruiter: active jobs, total hires
4. Can invite new recruiters

### 3.4 Global Analytics

1. Clicks **Global Analytics**
2. Sees:
   - Total hires, avg. time to hire, offer acceptance, candidate NPS
   - Hiring velocity
   - Hires by role type
   - Platform metrics (screens/day, AI evaluations, interviews scheduled)

### 3.5 Platform Settings

1. Clicks **Settings**
2. Configures:
   - General (name, default role, timezone)
   - Security (2FA, email verification, IP whitelist, audit logs)
   - AI config (Gemini model, temperature, max tokens)

---

## Cross-Role Interactions

```
Candidate  →  applies  →  Job (Recruiter-owned)
                ↓
            Application (screened by AI)
                ↓
         Recruiter shortlists/rejects
                ↓
        Interview scheduled (Recruiter)
                ↓
         Interview evaluated (AI)
                ↓
         Offer → Onboarding (Recruiter manages)
                ↓
            Candidate joins
                ↓
     Admin sees hire in global analytics
```
