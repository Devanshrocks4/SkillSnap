# 🏛️ SkillSnap Architecture

This document explains the architecture of SkillSnap across every layer.

---

## High-Level Overview

```
┌──────────────────────────────────────────────────────────┐
│                        FRONTEND                          │
│  React + Vite + Tailwind + Framer Motion + Recharts      │
└──────────────────────────────────────────────────────────┘
          │                     │                   │
          ▼                     ▼                   ▼
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │  Firebase    │     │   Gemini     │     │   Firebase   │
  │    Auth      │     │     API      │     │   Storage    │
  └──────────────┘     └──────────────┘     └──────────────┘
          │                                          │
          ▼                                          ▼
  ┌──────────────────────────────────────────────────────┐
  │              Firestore Database                       │
  │   users · jobs · candidates · applications · ...      │
  └──────────────────────────────────────────────────────┘
```

---

## 1. Frontend Flow

### Folder Structure

```
src/
├── App.tsx                     # Root routes + protected routes
├── main.tsx                    # App bootstrap with providers
├── index.css                   # Tailwind + custom design tokens
├── components/
│   ├── ui.tsx                  # Logo, Badge, StatCard, AuroraBackground
│   └── DashboardLayout.tsx     # Shared sidebar + topbar
├── pages/
│   ├── Landing.tsx             # Marketing page
│   ├── Auth.tsx                # Login / Signup
│   ├── candidate/              # Candidate workspace
│   ├── recruiter/              # Recruiter workspace
│   └── admin/                  # Admin workspace
├── contexts/
│   └── AuthContext.tsx         # Auth state + Firebase integration
└── lib/
    ├── types.ts                # TypeScript interfaces
    ├── mockData.ts             # Demo data (swap with Firestore)
    └── ai.ts                   # Gemini wrappers (resume, ranking, eval)
```

### State Management

- **Auth state** — React Context (`AuthContext`) wrapping the app; persists to `localStorage` for the demo. In production, replace with Firebase Auth `onAuthStateChanged`.
- **Data** — Firestore snapshot listeners via `useEffect`. For the demo, we use deterministic mock data.
- **UI state** — Local `useState` / `useMemo` for per-component state (search, filters, modals).

### Routing

- `/` — Public landing (redirects to workspace if logged in)
- `/login`, `/signup` — Auth flows
- `/candidate/*`, `/recruiter/*`, `/admin/*` — Protected workspaces with `ProtectedRoute` wrapper that enforces role.

---

## 2. Authentication Flow

```
User → Login form → Firebase Auth (email/password)
                   ↓
           Firebase issues ID token
                   ↓
           AuthContext updates user state
                   ↓
           ProtectedRoute redirects to role-based dashboard
                   ↓
           All Firestore reads/writes attach user's auth token
```

### Roles

| Role | Capabilities |
|------|--------------|
| Candidate | Upload resume, apply to jobs, view own applications, receive AI recommendations |
| Recruiter | Create jobs, screen candidates, shortlist, manage interviews, view analytics |
| Admin | Manage users & recruiters, global analytics, platform settings |

The role is stored on the user document in `users/{uid}` and checked by Firestore security rules on every request.

---

## 3. Firestore Flow

Collections:

- `users/{uid}` — profile + role
- `jobs/{jobId}` — posted jobs
- `candidates/{candidateId}` — candidate profile + resume URL
- `applications/{applicationId}` — link between candidate and job, status, AI score
- `interviews/{interviewId}` — scheduled interviews, evaluation scores
- `onboarding/{onboardingId}` — document verification status
- `analytics/{aggregate}` — platform-wide aggregates (optional)

Read [FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md) for field-level detail.

### Reads

- Candidates subscribe to `/applications?candidateId=me` for their own applications.
- Recruiters subscribe to `/applications?jobId=xyz` for a job's applicants.
- Admins read aggregated analytics.

### Writes

- Candidates create applications → triggers a Cloud Function that calls Gemini to screen and write `aiScore` + `summary`.
- Recruiters update application status (shortlist / reject / hire).
- Admins update user roles (elevated write).

---

## 4. Storage Flow

Used for:

- Candidate resumes (PDF)
- Interview recordings (video/audio)
- Onboarding documents (ID, offer letter, etc.)

Structure:

```
/{uid}/resumes/{filename}
/{uid}/interviews/{filename}
/{uid}/onboarding/{filename}
```

Security rules ensure only the owner or an authorized recruiter/admin can read these files.

---

## 5. AI Flow

All AI features go through a single service layer (`src/lib/ai.ts`) which wraps Gemini API calls. In production these calls are made from **Firebase Cloud Functions** so the API key is never exposed to the client.

### Feature 1 — Resume Screening

Input: candidate profile + job spec
Output: score, summary, strengths, weaknesses, matched/missing skills, recommendation

```
Client → Cloud Function → Gemini → structured JSON → Firestore
```

### Feature 2 — Candidate Ranking

Pure client-side scoring using deterministic skill-overlap + experience weighting. Cloud-side re-rank with Gemini for deeper semantic matching.

### Feature 3 — Job Recommendations

Same technique: skill-overlap scoring per candidate × job.

### Feature 4 — Resume Summarization

Gemini prompt: "Summarize this candidate profile in one recruiter-friendly paragraph."

### Feature 5 — Interview Evaluation

Gemini analyzes the transcript and returns 4 scores + highlights + concerns + recommendation.

---

## 6. Design System

- **Dark mode first** — base background `#05050a`, surfaces `#0d0d16`.
- **Glassmorphism** — `.glass` and `.glass-strong` utility classes.
- **Floating gradients** — aurora background with three animated gradient blobs.
- **Grid pattern overlay** — subtle 48px grid.
- **Typography** — Inter for body, JetBrains Mono for code.
- **Motion** — Framer Motion for page transitions, staggered lists, and hover effects.
- **Charts** — Recharts with custom gradients matching brand palette.

---

## 7. Performance

- **Code splitting** — Vite automatically splits per-route chunks.
- **Lazy imports** — dashboards can be lazy-loaded with `React.lazy`.
- **Image optimization** — SVG + CSS gradients used instead of images.
- **Deterministic mock data** — no network waterfall on first load.

---

## 8. Testing Strategy

- Unit tests for AI scoring logic (`src/lib/ai.ts`).
- Component tests with React Testing Library for dashboards.
- E2E with Playwright for end-to-end candidate → recruiter flow.

---

## 9. Scaling

- **Firebase** scales to millions of reads/writes automatically.
- **Firestore composite indexes** pre-declared for common queries.
- **Cloud Functions** can be deployed across multiple regions.
- **Gemini API** has generous free tier; upgrade to Vertex AI for enterprise.
