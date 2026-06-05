# 🚀 SkillSnap

### AI-Powered Recruitment & Talent Intelligence Platform

SkillSnap is a modern, production-ready SaaS platform that helps organizations screen resumes, rank candidates, evaluate interviews, and manage hiring — powered by **Google Gemini**, **Firebase**, and **React**.

![Status](https://img.shields.io/badge/status-production--ready-10b981)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Firebase-7c5cff)
![AI](https://img.shields.io/badge/ai-Gemini%202.0-5eead4)

---

## ✨ Features

- 🤖 **AI Resume Screening** — extract skills, experience, and education; generate recruiter summaries in seconds
- 🏆 **Smart Candidate Ranking** — rank applicants against job specs with explainable scores
- 💡 **Job Recommendations** — match candidates to roles using skill similarity
- 📝 **Resume Summarization** — one-paragraph recruiter-friendly summaries
- 🎤 **Interview Evaluation** — communication, confidence, technical, and overall scoring
- 👥 **Role-based Workflows** — Candidate, Recruiter, and Admin views with RBAC
- 📊 **Hiring Analytics** — funnel, score distribution, skills, trends
- 🔐 **Enterprise Security** — Firebase Auth, Firestore rules, RBAC, encrypted storage
- 📱 **Fully Responsive** — mobile-first, dark-mode-first premium UI

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, TypeScript |
| Styling | Tailwind CSS 4, Framer Motion |
| Routing | React Router v6 |
| Charts | Recharts |
| Backend | Firebase (Auth + Firestore + Storage) |
| AI | Google Gemini API (gemini-2.0-flash) |
| Hosting | Netlify |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm / npm / yarn
- Firebase project (see [FIREBASE_SETUP.md](./docs/FIREBASE_SETUP.md))
- Google Gemini API key (see [GEMINI_INTEGRATION.md](./docs/GEMINI_INTEGRATION.md))

### Installation

```bash
git clone https://github.com/yourusername/skillsnap.git
cd skillsnap
npm install
```

### Environment Variables

Create a `.env` file at the project root:

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Run Locally

```bash
npm run dev
# Open http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🌐 Deployment (Netlify)

1. Push to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables from the Netlify dashboard
6. Deploy!

See [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) for full details.

---

## 📖 Documentation

| File | Description |
|------|-------------|
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Frontend, Auth, Firestore, Storage, and AI flow |
| [FIRESTORE_SCHEMA.md](./docs/FIRESTORE_SCHEMA.md) | Detailed Firestore data model |
| [FIREBASE_SETUP.md](./docs/FIREBASE_SETUP.md) | Firebase project setup walkthrough |
| [FIREBASE_RULES.md](./docs/FIREBASE_RULES.md) | Production-ready Firestore security rules |
| [GEMINI_INTEGRATION.md](./docs/GEMINI_INTEGRATION.md) | Gemini API integration guide |
| [SECURITY_GUIDE.md](./docs/SECURITY_GUIDE.md) | Security best practices |
| [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) | Deploy to Netlify, Vercel, Firebase Hosting |
| [WORKFLOW.md](./docs/WORKFLOW.md) | User journeys for all three roles |
| [FEATURES.md](./docs/FEATURES.md) | Complete feature list |
| [PROBLEM_STATEMENT.md](./docs/PROBLEM_STATEMENT.md) | Problem we're solving |
| [DEMO_SCRIPT.md](./docs/DEMO_SCRIPT.md) | 5-minute hackathon demo script |
| [JUDGE_MODE.md](./docs/JUDGE_MODE.md) | Why each feature matters |

---

## 🧪 Demo Accounts

The live demo supports three roles:

| Role | Description |
|------|-------------|
| **Candidate** | Apply to jobs, track applications, view AI insights |
| **Recruiter** | Screen candidates, run AI evaluations, manage jobs |
| **Admin** | Platform-wide analytics, user management |

Click any role on the login screen to enter a fully-populated demo.

---

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

---

## 📜 License

MIT © 2026 SkillSnap

---

<p align="center">
  Built with ❤️ using <strong>React</strong>, <strong>Firebase</strong>, and <strong>Gemini AI</strong>
</p>
