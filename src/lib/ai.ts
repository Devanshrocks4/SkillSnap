import type { Application } from "./types";

/**
 * Simulated Gemini-powered AI engine.
 *
 * In production this calls the Gemini API via Firebase Functions / Cloud Run.
 * In this demo we produce deterministic, plausible output based on inputs so
 * the UX of the AI features can be demonstrated end-to-end.
 */

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export interface ScreeningResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

export async function screenResume(
  candidate: { name: string; skills: string[]; experience: number; education?: string },
  job: { title: string; skills: string[]; requirements: string[] }
): Promise<ScreeningResult> {
  await sleep(900 + Math.random() * 700);

  const matched = candidate.skills.filter((s) =>
    job.skills.some((js) => js.toLowerCase() === s.toLowerCase())
  );
  const missing = job.skills.filter(
    (js) => !candidate.skills.some((s) => s.toLowerCase() === js.toLowerCase())
  );
  const matchRatio = job.skills.length ? matched.length / job.skills.length : 0;
  const expScore = Math.min(1, candidate.experience / 6);
  const raw = matchRatio * 0.7 + expScore * 0.3;
  const score = Math.round(55 + raw * 40); // 55-95

  const summary =
    score >= 85
      ? `${candidate.name} is an excellent fit for ${job.title}. Strong alignment on ${matched.slice(0, 3).join(", ")} with ${candidate.experience} years of relevant experience. Demonstrates the depth and ownership we look for in senior hires.`
      : score >= 70
        ? `${candidate.name} is a solid candidate for ${job.title}. Core skills in ${matched.slice(0, 2).join(", ")} are present; gaps in ${missing.slice(0, 2).join(", ")} can be addressed on the job.`
        : `${candidate.name} shows foundational ability but lacks key ${missing.slice(0, 2).join(", ")} experience required for ${job.title}. Consider for a more junior track.`;

  const strengths = [
    matched.length ? `Strong ${matched[0]} proficiency` : "Demonstrates learning agility",
    candidate.experience >= 4 ? "Significant production experience" : "Recent, relevant project work",
    score >= 80 ? "Excellent technical communication" : "Clear written profile",
  ];

  const weaknesses = [
    missing.length ? `Missing ${missing[0]} experience` : "Consider deeper system-design evaluation",
    candidate.experience < 3 ? "Limited years of experience" : "Narrow domain exposure",
  ].filter(Boolean);

  const recommendation =
    score >= 85
      ? "Strong hire — proceed to technical interview."
      : score >= 70
        ? "Good fit — schedule a screening call."
        : score >= 55
          ? "Borderline — manual review recommended."
          : "Not a fit for this role at this time.";

  return { score, summary, strengths, weaknesses, matchedSkills: matched, missingSkills: missing, recommendation };
}

export interface RankingRow {
  candidate: Application;
  score: number;
  rank: number;
  fit: "excellent" | "good" | "average" | "poor";
  reason: string;
}

export function rankCandidates(
  applications: Application[],
  requiredSkills: string[]
): RankingRow[] {
  const rows = applications.map((a) => {
    const matched = a.skills.filter((s) =>
      requiredSkills.some((r) => r.toLowerCase() === s.toLowerCase())
    ).length;
    const ratio = requiredSkills.length ? matched / requiredSkills.length : 0;
    const score = Math.round(a.aiScore * 0.6 + ratio * 100 * 0.4);
    const fit: RankingRow["fit"] =
      score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 55 ? "average" : "poor";
    const reason =
      fit === "excellent"
        ? `Strong alignment on ${matched}/${requiredSkills.length} skills, ${a.experience}y experience.`
        : fit === "good"
          ? `Solid match — ${matched}/${requiredSkills.length} skills present.`
          : fit === "average"
            ? `Partial match — missing ${requiredSkills.length - matched} key skills.`
            : `Low alignment for this role.`;
    return { candidate: a, score, rank: 0, fit, reason };
  });
  rows.sort((a, b) => b.score - a.score);
  rows.forEach((r, i) => (r.rank = i + 1));
  return rows;
}

export function recommendJobs<T extends { skills: string[] }>(candidateSkills: string[], jobs: T[]) {
  return jobs
    .map((j) => {
      const matched = candidateSkills.filter((s) =>
        j.skills.some((r) => r.toLowerCase() === s.toLowerCase())
      ).length;
      const ratio = j.skills.length ? matched / j.skills.length : 0;
      const score = Math.round(ratio * 100);
      return { ...j, matchScore: score, matched };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function summarizeResume(candidate: {
  name: string;
  title: string;
  experience: number;
  skills: string[];
  education: string;
}) {
  return `${candidate.name} is a ${candidate.title} with ${candidate.experience} years of experience. Core stack: ${candidate.skills.slice(0, 4).join(", ")}. Education: ${candidate.education}. Profile signals suggest strong execution and product sensibility.`;
}

export interface InterviewEval {
  communicationScore: number;
  confidenceScore: number;
  technicalScore: number;
  overallScore: number;
  recommendation: string;
  highlights: string[];
  concerns: string[];
}

export async function evaluateInterview(transcript: string): Promise<InterviewEval> {
  await sleep(1100);
  const words = transcript.trim().split(/\s+/).length;
  const base = Math.min(95, 60 + Math.round(words / 6));
  const jitter = (n: number) => n + Math.round((Math.random() - 0.5) * 10);
  const communication = jitter(base);
  const confidence = jitter(base - 3);
  const technical = jitter(base + 2);
  const overall = Math.round((communication + confidence + technical) / 3);

  return {
    communicationScore: Math.max(40, Math.min(99, communication)),
    confidenceScore: Math.max(40, Math.min(99, confidence)),
    technicalScore: Math.max(40, Math.min(99, technical)),
    overallScore: Math.max(40, Math.min(99, overall)),
    recommendation:
      overall >= 85
        ? "Strong hire — proceed to final round."
        : overall >= 70
          ? "Good candidate — consider with minor concerns."
          : overall >= 55
            ? "Borderline — debrief with hiring team."
            : "Not recommended at this stage.",
    highlights: [
      "Clear, structured answers to behavioral questions.",
      "Demonstrated system-design thinking with real examples.",
      "Asked thoughtful questions about the team and product.",
    ],
    concerns: [
      words < 60 ? "Short responses — probe deeper in follow-up." : "Could strengthen answers with measurable impact.",
      "Limited discussion of trade-offs under scale.",
    ],
  };
}
