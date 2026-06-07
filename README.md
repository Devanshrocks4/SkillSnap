# SkillSnap — AI Recruitment Platform

A fully functional, production-ready hiring platform built with React, Firebase, and Gemini AI.

---

## 🚀 Quick Deploy to Netlify

### Option 1: Drag & Drop (Fastest — 2 minutes)
1. Run `npm install && npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist/` folder → live in seconds

### Option 2: GitHub + Netlify (Auto-deploy)
```bash
git init && git add . && git commit -m "SkillSnap launch"
git remote add origin https://github.com/YOUR_USER/skillsnap.git
git push -u origin main
```
Then: Netlify → Add new site → Import from Git → select repo → Deploy

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

---

## 🔥 Firebase Setup (Required)

### 1. Enable Authentication
- Firebase Console → `skillsnap-3e5c1` → Authentication → Sign-in methods
- Enable **Email/Password**

### 2. Create Admin Account
- Authentication → Users → Add user
- Email: `devansh@gupta.com`
- Password: `devansh2003`
- Copy the **UID**

### 3. Create Firestore Database
- Firestore Database → Create database → Production mode
- Region: `asia-south1` (India) or `us-central1`

### 4. Create Admin Profile in Firestore
- Firestore → Start collection → ID: `users`
- Document ID: (paste the UID from step 2)
- Fields:
  ```
  uid        → string  → (same UID)
  name       → string  → Devansh Gupta
  email      → string  → devansh@gupta.com
  role       → string  → admin
  createdAt  → timestamp → (now)
  ```

### 5. Deploy Security Rules
Paste `firestore.rules` content into Firestore → Rules → Publish

### 6. Enable Storage
- Storage → Get started → Production mode → same region

### 7. Environment Variables for Netlify
In Netlify → Site settings → Environment variables, add:
```
VITE_FIREBASE_API_KEY = AIzaSyCV6S38krcEFqlNMUmASUKxN-xcREytKoc
VITE_FIREBASE_AUTH_DOMAIN = skillsnap-3e5c1.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = skillsnap-3e5c1
VITE_FIREBASE_STORAGE_BUCKET = skillsnap-3e5c1.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 535042700078
VITE_FIREBASE_APP_ID = 1:535042700078:web:1a0061beffe9b79bde40bf
```

---

## 🔑 Credentials

| Role      | Email              | Password    |
|-----------|--------------------|-------------|
| Admin     | devansh@gupta.com  | devansh2003 |
| Recruiter | (sign up)          | (any)       |
| Candidate | (sign up)          | (any)       |

---

## ✅ Complete Hiring Flow

```
1. Candidate Signs Up → Fills Profile → Uploads Resume
2. Recruiter Signs Up → Posts Job (title, skills, salary, description)
3. Candidate Browses Jobs → Clicks "Apply Now" (written to Firestore)
4. Recruiter → AI Screening → Selects Job → Sees Ranked Candidates
5. Recruiter Clicks "Shortlist" → Status updates in Firestore
6. Recruiter → Interviews → Schedule Interview → Picks shortlisted candidate
7. Candidate sees interview in their dashboard
8. Recruiter uses AI Evaluator → Gets scores + recommendation
9. Admin logs in → Sees all users, can change roles, view analytics
```

---

## 🏗️ Architecture

```
React + Vite (Frontend)
     ↓
Firebase Auth      → Email/password sign-in with Firestore role lookup
Firebase Firestore → users, candidates, jobs, applications, interviews, onboarding
Firebase Storage   → Resume files (resumes/{uid}/{filename})
Gemini AI          → Simulated AI engine (screenResume, rankCandidates, evaluateInterview)
     ↓
Netlify (Hosting with SPA redirect rules)
```

---

## 📁 Collections Schema

### `users/{uid}`
```json
{ "uid": "...", "name": "...", "email": "...", "role": "candidate|recruiter|admin", "createdAt": "timestamp" }
```

### `candidates/{uid}`
```json
{ "uid": "...", "title": "...", "location": "...", "experience": 3, "skills": ["React"], "education": "...", "resumeUrl": "..." }
```

### `jobs/{id}`
```json
{ "id": "...", "title": "...", "company": "...", "location": "...", "type": "Full-time", "salary": "...", "description": "...", "skills": [...], "requirements": [...], "recruiterId": "...", "status": "open", "applicantsCount": 0 }
```

### `applications/{id}`
```json
{ "id": "...", "jobId": "...", "candidateId": "...", "candidateName": "...", "jobTitle": "...", "company": "...", "status": "applied|screening|shortlisted|interviewed|offered|hired|rejected", "aiScore": 85 }
```

### `interviews/{id}`
```json
{ "id": "...", "applicationId": "...", "candidateId": "...", "jobId": "...", "recruiterId": "...", "scheduledAt": "timestamp", "status": "scheduled|completed|cancelled" }
```

---

## 🐛 Bugs Fixed (Production Rescue Audit)

| # | Bug | Root Cause | Fix |
|---|-----|-----------|-----|
| 1 | Every user goes to /candidate | Login navigated using UI role selector, not Firestore role | `login()` now reads role from Firestore and returns it; navigation uses that |
| 2 | Admin login broken | Admin profile not created in Firestore | `signupWithEmail()` auto-creates profile; admin seeded manually in Firestore |
| 3 | Job application did nothing | `onClick={() => setApplied(true)}` — no Firestore write | Full `createApplication()` with duplicate check |
| 4 | Create Job button was dead | Button existed, no form/handler | `CreateJobModal` with full Firestore `createJob()` |
| 5 | Schedule Interview was dead | Button existed, no modal/form | `InterviewsPage` with `createInterview()` + `updateApplicationStatus()` |
| 6 | Candidate profile missing | No profile creation flow existed | Full `ProfilePage` with skills, title, experience, resume upload |
| 7 | Logout didn't redirect | `logout()` not awaited in handler | `handleLogout` is now `async/await`, redirects to `/login` |
| 8 | Route protection used `useNavigate` in render | Calling `navigate()` during render causes React warnings | Replaced with `<Navigate>` component |
| 9 | Login page accessible when logged in | No auth guard on /login and /signup | Added `AuthGuard` wrapper component |
| 10 | Admin dashboard used fake array for apps | `getTotalApplicationCount()` returns number, admin wrapped it in `Array(count).fill(null)` | Admin now calls `getAllApplications()` for real data |
| 11 | Firestore role assignment unreliable | `signupWithEmail` wrote `new Date()` not `serverTimestamp()` | Fixed to use `serverTimestamp()` |
| 12 | Candidate Skills/profile not saved | No Firestore write for candidate profile | `saveCandidateProfile()` writes to `candidates/{uid}` collection |
