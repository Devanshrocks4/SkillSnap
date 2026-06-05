# 🤖 Gemini Integration

How SkillSnap uses the Google Gemini API for AI features.

---

## Why Gemini?

- State-of-the-art reasoning and summarization
- Multimodal (text, image, audio, video) — perfect for interview analysis
- Generous free tier (60 req/min on Gemini 2.0 Flash)
- Native Firebase integration via Vertex AI

---

## Setup

### 1. Get an API key

1. Go to https://aistudio.google.com/app/apikey
2. Click **Create API Key** and select your Firebase project
3. Copy the key

### 2. Server-side (recommended)

Store as a Cloud Functions secret:

```bash
firebase functions:secrets:set GEMINI_API_KEY
```

### 3. Client-side (demo only)

```env
VITE_GEMINI_API_KEY=...
```

⚠️ Client-side keys are rate-limited and visible to users. For production, always use Cloud Functions.

---

## Cloud Function Example

```ts
// functions/src/screenResume.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFirestore } from "firebase-admin/firestore";

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

export const screenResume = onCall(
  { secrets: [GEMINI_API_KEY] },
  async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "Login required");

    const { candidate, job } = request.data;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY.value());
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a senior technical recruiter. Screen this candidate against the job.

CANDIDATE:
Name: ${candidate.name}
Skills: ${candidate.skills.join(", ")}
Experience: ${candidate.experience} years
Education: ${candidate.education}

JOB:
Title: ${job.title}
Required skills: ${job.skills.join(", ")}
Requirements: ${job.requirements.join("; ")}

Return ONLY valid JSON with:
{
  "score": number (0-100),
  "summary": string (one paragraph),
  "strengths": string[],
  "weaknesses": string[],
  "matchedSkills": string[],
  "missingSkills": string[],
  "recommendation": string
}
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const json = JSON.parse(text.replace(/```json|```/g, "").trim());

    // Persist to Firestore
    await getFirestore()
      .collection("applications")
      .doc(request.data.applicationId)
      .update({
        aiScore: json.score,
        summary: json.summary,
        strengths: json.strengths,
        weaknesses: json.weaknesses,
        matchedSkills: json.matchedSkills,
        missingSkills: json.missingSkills,
        recommendation: json.recommendation,
        screenedAt: new Date().toISOString(),
      });

    return json;
  }
);
```

---

## Prompt Engineering

### Best practices

1. **Be explicit about output format** — request JSON with a schema.
2. **Give a persona** — "You are a senior technical recruiter…"
3. **Include concrete constraints** — score range 0-100, max 3 strengths.
4. **Use few-shot examples** for complex tasks.

### Prompts used in SkillSnap

| Feature | Model | Temperature |
|---------|-------|-------------|
| Resume Screening | gemini-2.0-flash | 0.3 |
| Summarization | gemini-2.0-flash | 0.4 |
| Job Recommendation | client-side heuristic | — |
| Interview Evaluation | gemini-2.0-flash | 0.3 |
| Ranking | client-side scoring | — |

---

## Cost Optimization

- Cache screening results in Firestore — never re-screen the same candidate+job.
- Use `gemini-2.0-flash` (cheapest) instead of `gemini-2.0-pro`.
- Rate-limit per user in Cloud Functions.
- Batch evaluations when possible.

---

## Error Handling

```ts
try {
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
} catch (err) {
  console.error("Gemini error:", err);
  throw new HttpsError("internal", "AI service unavailable");
}
```

On the client, surface a friendly message and offer retry.
