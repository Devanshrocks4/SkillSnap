# ✨ Features

Complete feature list for SkillSnap.

---

## Core Platform

- 🔐 Multi-role authentication (Candidate, Recruiter, Admin)
- 🛡️ Role-based access control (RBAC) with Firestore rules
- 🎨 Dark-mode-first premium UI
- 📱 Fully responsive (mobile, tablet, desktop)
- 🌊 Glassmorphism + floating gradients
- ⚡ Framer Motion animations
- 📊 Recharts-powered analytics

---

## Candidate Features

- 📝 Create account with role selection
- 📄 Upload resume (PDF)
- 💼 Browse all open jobs
- 🎯 AI-matched job recommendations
- 📨 Apply to jobs with cover letter
- 📈 Track application status (applied → screening → shortlisted → interviewed → offered → hired)
- 🤖 AI profile summary
- 📊 Profile strength meter
- 💡 Skills-to-grow recommendations
- 📉 Market insights (salary, competition, time-to-hire)
- 🎤 Interview scheduling view
- 📹 Upload interview video
- 📋 Onboarding document upload
- ✅ Document verification status tracking

---

## Recruiter Features

- 📋 Post new jobs with requirements & skills
- 📊 Dashboard: total candidates, active jobs, shortlisted, hired
- 🏆 AI-ranked candidate list per job
- 🤖 AI resume screening (score, summary, strengths, weaknesses, matched/missing skills)
- ⭐ Shortlist / reject candidates with one click
- 📅 Schedule interviews
- 🎤 AI interview evaluation (communication, confidence, technical, overall)
- 📝 Interview transcript analyzer
- 📋 Onboarding management (per-document verification)
- 📊 Analytics: funnel, score distribution, skills, trends, pipeline health
- 🔔 Live activity feed
- 🔍 Search candidates by name, skill, title

---

## Admin Features

- 🌍 Platform overview (total users, recruiters, jobs, applications)
- 📈 Platform growth chart
- 💚 System health dashboard (Firebase Auth, Firestore, Gemini, Storage)
- 👥 User management (list, edit, suspend, delete)
- 👔 Recruiter management
- 📊 Global analytics (hires, time to hire, offer acceptance, NPS)
- 📊 Hiring velocity chart
- 📊 Hires by role type
- ⚙️ Platform settings (general, security, AI config)
- 🔐 Security toggles (2FA, email verification, IP whitelist, audit logs)

---

## AI Features

### 1. Resume Screening

Input: candidate profile + job spec
Output:

- Score (0-100)
- One-paragraph recruiter summary
- Strengths (3)
- Weaknesses / concerns (2)
- Matched skills
- Missing skills
- Actionable recommendation

### 2. Candidate Ranking

- Rank applicants against job requirements
- Explainable fit level (excellent / good / average / poor)
- Rationale per candidate

### 3. Job Recommendation

- Match candidates to roles by skill overlap
- Match % displayed on each job card
- "Top picks for you" section

### 4. Resume Summarization

- One-paragraph recruiter-friendly summary
- Generated from candidate profile

### 5. Interview Evaluation

Input: interview transcript
Output:

- Communication score
- Confidence score
- Technical relevance score
- Overall score
- Highlights (3)
- Concerns (2)
- Hire / no-hire recommendation

---

## Analytics

- Hiring funnel (applied → screening → shortlisted → interviewed → offered → hired)
- Candidate score distribution
- Skills distribution (pie chart)
- Recruitment trends (line chart)
- Pipeline health (conversion rates across stages)
- Weekly activity (area chart)
- Platform growth (users + jobs over time)

---

## Security

- Firebase Auth with email/password
- Firestore rules per collection with role checks
- Storage rules (file type + size constraints)
- Environment variables for secrets
- Gemini API key stored as Cloud Functions secret
- HTTPS everywhere
- CSP headers
- Audit logs
- GDPR-ready data export & deletion

---

## Deployment

- Netlify (recommended)
- Firebase Hosting
- Vercel
- Cloudflare Pages
- GitHub Actions CI/CD
