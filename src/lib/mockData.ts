import type {
  Application,
  Candidate,
  Interview,
  Job,
  Onboarding,
} from "./types";

export const mockJobs: Job[] = [
  {
    id: "j1",
    title: "Senior Frontend Engineer",
    company: "Nebula Labs",
    location: "San Francisco, CA (Hybrid)",
    type: "Full-time",
    experience: "5+ years",
    salary: "$160k – $210k",
    description:
      "Build the next generation of AI-native products with a small, senior team. Ship fast, stay opinionated, stay kind.",
    requirements: [
      "5+ years of production React & TypeScript",
      "Strong design taste and comfort with motion",
      "Experience with Vite, Tailwind, and design systems",
      "Comfort with ambiguity and zero-to-one work",
    ],
    skills: ["React", "TypeScript", "Tailwind CSS", "Vite", "Framer Motion"],
    postedBy: "r1",
    postedAt: "2026-01-12",
    status: "open",
    applicantsCount: 42,
  },
  {
    id: "j2",
    title: "Applied AI Engineer",
    company: "Nebula Labs",
    location: "Remote (US/EU)",
    type: "Full-time",
    experience: "3+ years",
    salary: "$140k – $190k",
    description:
      "Design and ship LLM-powered features end-to-end — from prompts to evals to production.",
    requirements: [
      "Hands-on experience with LLM APIs (Gemini, OpenAI, Claude)",
      "Python or TypeScript fluency",
      "Prompt engineering, evals, and RAG",
      "Taste for UX of AI products",
    ],
    skills: ["Python", "TypeScript", "Gemini API", "RAG", "LangChain"],
    postedBy: "r1",
    postedAt: "2026-01-14",
    status: "open",
    applicantsCount: 68,
  },
  {
    id: "j3",
    title: "Product Designer",
    company: "Lumen Robotics",
    location: "New York, NY",
    type: "Full-time",
    experience: "4+ years",
    salary: "$130k – $170k",
    description:
      "Own the product surface for our AI assistant. Prototype, test, and ship with engineering.",
    requirements: [
      "4+ years product design",
      "Figma mastery with a design-systems mindset",
      "Strong prototyping and motion skills",
      "Experience shipping B2B SaaS",
    ],
    skills: ["Figma", "Prototyping", "Design Systems", "Motion"],
    postedBy: "r2",
    postedAt: "2026-01-18",
    status: "open",
    applicantsCount: 31,
  },
  {
    id: "j4",
    title: "Backend Engineer (Go)",
    company: "Helios Cloud",
    location: "Berlin (Remote)",
    type: "Remote",
    experience: "4+ years",
    salary: "€90k – €130k",
    description:
      "Scale our event-driven backend from 10M to 1B events per day. Rust-adjacent Go, gRPC, Temporal.",
    requirements: [
      "Go production experience",
      "Distributed systems fundamentals",
      "Familiarity with Kafka / Temporal",
      "On-call mindset and ownership",
    ],
    skills: ["Go", "gRPC", "Kafka", "PostgreSQL", "Kubernetes"],
    postedBy: "r1",
    postedAt: "2026-01-20",
    status: "open",
    applicantsCount: 27,
  },
  {
    id: "j5",
    title: "Data Scientist",
    company: "Orbit Analytics",
    location: "London, UK",
    type: "Full-time",
    experience: "3+ years",
    salary: "£80k – £110k",
    description:
      "Build the models behind our hiring intelligence product. Research → prototype → ship.",
    requirements: [
      "3+ years in applied ML / data science",
      "Python, PyTorch or TensorFlow",
      "Experience with NLP and embeddings",
      "Strong communication skills",
    ],
    skills: ["Python", "PyTorch", "NLP", "SQL", "Statistics"],
    postedBy: "r2",
    postedAt: "2026-01-22",
    status: "open",
    applicantsCount: 19,
  },
  {
    id: "j6",
    title: "DevOps Engineer",
    company: "Helios Cloud",
    location: "Remote",
    type: "Contract",
    experience: "5+ years",
    salary: "$90 / hr",
    description:
      "Harden our Kubernetes platform. Improve reliability, observability, and developer experience.",
    requirements: [
      "Deep Kubernetes expertise",
      "Terraform / Pulumi",
      "Prometheus / Grafana / OpenTelemetry",
      "Security-first mindset",
    ],
    skills: ["Kubernetes", "Terraform", "AWS", "Prometheus", "Go"],
    postedBy: "r1",
    postedAt: "2026-01-25",
    status: "open",
    applicantsCount: 14,
  },
];

const skillPool = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Go",
  "Tailwind CSS",
  "Framer Motion",
  "GraphQL",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Figma",
  "PyTorch",
  "Gemini API",
  "RAG",
  "LangChain",
  "Next.js",
  "Rust",
];

const names = [
  "Ava Chen",
  "Marcus Okafor",
  "Priya Raman",
  "Liam Novak",
  "Sofia Reyes",
  "Noah Becker",
  "Zara Ahmed",
  "Ethan Park",
  "Maya Lindqvist",
  "Theo Martin",
  "Ines Costa",
  "Kai Tanaka",
];

const titles = [
  "Senior Frontend Engineer",
  "Applied AI Engineer",
  "Product Designer",
  "Backend Engineer",
  "Data Scientist",
  "DevOps Engineer",
  "Full-Stack Engineer",
  "ML Engineer",
];

const statuses: Application["status"][] = [
  "applied",
  "screening",
  "shortlisted",
  "interviewed",
  "offered",
  "hired",
  "rejected",
];

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

function seededScore(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return Math.round((x - Math.floor(x)) * 40 + 55); // 55-95
}

export const mockCandidates: Candidate[] = names.map((name, i) => {
  const skills = pick(skillPool, 4 + (i % 4));
  const score = seededScore(i + 1);
  return {
    id: `c${i + 1}`,
    userId: `u${i + 1}`,
    name,
    email: name.toLowerCase().replace(/\s/g, ".") + "@mail.com",
    title: titles[i % titles.length],
    experience: 2 + (i % 8),
    skills,
    education: i % 3 === 0 ? "M.S. Computer Science, Stanford" : "B.S. Computer Science, MIT",
    location: ["San Francisco", "New York", "Berlin", "London", "Remote"][i % 5],
    resumeUrl: "/resumes/" + name.toLowerCase().replace(/\s/g, "_") + ".pdf",
    aiScore: score,
    summary:
      score >= 80
        ? `Strong ${skills[0]} engineer with ${2 + (i % 8)} years shipping production systems. Excellent system design instincts and a track record of ownership.`
        : score >= 65
          ? `Solid mid-level engineer with hands-on ${skills.slice(0, 2).join(" & ")} experience. Growing into senior-level responsibilities.`
          : `Junior engineer with foundational ${skills[0]} skills. Shows curiosity and willingness to learn.`,
    strengths:
      score >= 80
        ? ["Deep technical depth", "Strong communicator", "Product-minded"]
        : ["Fast learner", "Good fundamentals", "Team player"],
    weaknesses:
      score >= 80
        ? ["Limited domain experience"]
        : ["Needs mentorship on scale", "Sparse open-source presence"],
  };
});

export const mockApplications: Application[] = mockCandidates.flatMap((c, ci) => {
  const jobs = pick(mockJobs, 1 + (ci % 2));
  return jobs.map((j, ji) => {
    const score = seededScore(ci * 17 + ji);
    return {
      id: `a${ci * 10 + ji}`,
      candidateId: c.id,
      candidateName: c.name,
      candidateEmail: c.email,
      jobId: j.id,
      jobTitle: j.title,
      company: j.company,
      status: statuses[(ci + ji) % statuses.length],
      aiScore: score,
      appliedAt: new Date(2026, 0, 5 + ((ci + ji) % 25)).toISOString().slice(0, 10),
      skills: c.skills,
      experience: c.experience,
      summary: c.summary,
      strengths: c.strengths,
      weaknesses: c.weaknesses,
      recommendation:
        score >= 85
          ? "Strong hire — schedule interview immediately."
          : score >= 70
            ? "Good fit — worth a screening call."
            : score >= 55
              ? "Borderline — review manually."
              : "Not a fit for this role.",
    };
  });
});

export const mockInterviews: Interview[] = [
  {
    id: "iv1",
    applicationId: "a0",
    candidateName: "Ava Chen",
    role: "Senior Frontend Engineer",
    scheduledAt: "2026-02-04T15:00:00",
    status: "completed",
    communicationScore: 92,
    confidenceScore: 88,
    technicalScore: 94,
    overallScore: 91,
    aiRecommendation:
      "Ava communicates with exceptional clarity and demonstrates deep technical reasoning. Strongly recommend proceeding to final round.",
  },
  {
    id: "iv2",
    applicationId: "a10",
    candidateName: "Priya Raman",
    role: "Applied AI Engineer",
    scheduledAt: "2026-02-05T11:00:00",
    status: "completed",
    communicationScore: 85,
    confidenceScore: 80,
    technicalScore: 89,
    overallScore: 85,
    aiRecommendation:
      "Solid technical foundation with room to grow on cross-functional communication. Recommend offer with mentorship track.",
  },
  {
    id: "iv3",
    applicationId: "a30",
    candidateName: "Sofia Reyes",
    role: "Product Designer",
    scheduledAt: "2026-02-07T14:00:00",
    status: "scheduled",
  },
  {
    id: "iv4",
    applicationId: "a40",
    candidateName: "Noah Becker",
    role: "Backend Engineer",
    scheduledAt: "2026-02-08T10:00:00",
    status: "scheduled",
  },
];

export const mockOnboarding: Onboarding[] = [
  {
    id: "ob1",
    candidateId: "c1",
    candidateName: "Ava Chen",
    role: "Senior Frontend Engineer",
    company: "Nebula Labs",
    joiningDate: "2026-03-03",
    documents: {
      idDoc: "approved",
      offerLetter: "approved",
      education: "under_review",
      backgroundCheck: "pending",
    },
    overallStatus: "under_review",
  },
  {
    id: "ob2",
    candidateId: "c3",
    candidateName: "Priya Raman",
    role: "Applied AI Engineer",
    company: "Nebula Labs",
    joiningDate: "2026-03-10",
    documents: {
      idDoc: "approved",
      offerLetter: "approved",
      education: "approved",
      backgroundCheck: "approved",
    },
    overallStatus: "approved",
  },
  {
    id: "ob3",
    candidateId: "c5",
    candidateName: "Sofia Reyes",
    role: "Product Designer",
    company: "Lumen Robotics",
    joiningDate: "2026-03-17",
    documents: {
      idDoc: "under_review",
      offerLetter: "pending",
      education: "pending",
      backgroundCheck: "pending",
    },
    overallStatus: "pending",
  },
];

// Activity feed
export const mockActivity = [
  { id: 1, who: "Ava Chen", action: "applied to", target: "Senior Frontend Engineer", time: "2m ago", type: "apply" as const },
  { id: 2, who: "SkillSnap AI", action: "scored", target: "Marcus Okafor — 92/100", time: "8m ago", type: "ai" as const },
  { id: 3, who: "HR · Priya", action: "shortlisted", target: "3 candidates for Applied AI", time: "22m ago", type: "shortlist" as const },
  { id: 4, who: "SkillSnap AI", action: "generated summary for", target: "Liam Novak", time: "41m ago", type: "ai" as const },
  { id: 5, who: "Ava Chen", action: "completed interview for", target: "Senior Frontend", time: "1h ago", type: "interview" as const },
  { id: 6, who: "HR · Alex", action: "posted", target: "Staff Engineer, Platform", time: "2h ago", type: "job" as const },
  { id: 7, who: "Onboarding", action: "approved documents for", target: "Priya Raman", time: "3h ago", type: "onboard" as const },
];
