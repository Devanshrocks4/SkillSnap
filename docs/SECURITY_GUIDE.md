# 🔐 Security Guide

Security best practices implemented in SkillSnap.

---

## 1. Authentication

- Firebase Authentication (email/password, Google, GitHub)
- Session tokens verified on every Firestore request
- Email verification required for new accounts (configurable)
- Optional 2FA via Firebase MFA

---

## 2. Authorization (RBAC)

Every Firestore document access is checked against the user's role:

| Role | Permissions |
|------|-------------|
| Candidate | Own data + public jobs |
| Recruiter | Candidates/applications for their jobs |
| Admin | Full read/write |

See [FIREBASE_RULES.md](./FIREBASE_RULES.md) for the complete rule set.

---

## 3. API Key Protection

- **Never** hardcode API keys in source code.
- Client-exposed keys are scoped to Firebase project and domain-restricted.
- Gemini API key is stored as a **Cloud Functions secret**, never sent to the client.
- `.env` is in `.gitignore`.

---

## 4. Input Validation

- All user inputs are validated client-side (type, length, format).
- Server-side validation in Cloud Functions before passing to Gemini.
- Sanitize all strings before rendering (React auto-escapes by default).

---

## 5. File Upload Security

- Firebase Storage rules enforce:
  - File type (`application/pdf`, `video/*`, `image/*`)
  - Max file size (10 MB for resumes, 100 MB for video)
  - Owner-only write, role-based read
- Virus scanning via Cloud Function on upload (optional)

Example Storage rule:

```
match /b/{bucket}/o {
  match /{uid}/resumes/{file} {
    allow write: if request.auth.uid == uid
                 && request.resource.size < 10 * 1024 * 1024
                 && request.resource.contentType == "application/pdf";
    allow read: if request.auth.uid == uid;
  }
}
```

---

## 6. XSS Prevention

- React auto-escapes all JSX output.
- No `dangerouslySetInnerHTML` anywhere.
- Content-Security-Policy headers via Netlify `_headers` file.

---

## 7. CSRF Protection

- Firebase Auth uses secure, httpOnly cookies.
- All mutations are token-authenticated.

---

## 8. Data Privacy

- Candidate data is only visible to:
  - The candidate themselves
  - Recruiters for jobs they applied to
  - Admins
- GDPR-ready: user can request data export and deletion.
- PII (email, phone) never logged.

---

## 9. Rate Limiting

- Cloud Functions rate-limit Gemini calls per user (e.g. 10 screens / hour).
- Firebase Auth has built-in abuse protection.

---

## 10. Audit Logging

- All write operations are logged to a Cloud Function.
- Logs stored in Cloud Logging with 30-day retention.
- Admin can view recent activity in the dashboard.

---

## 11. Dependency Security

- `npm audit` run on every CI build.
- Dependabot enabled for automatic security patches.
- Lockfile committed.

---

## 12. Transport Security

- All traffic over HTTPS (enforced by Firebase / Netlify).
- HSTS header set via Netlify.
- TLS 1.2+ enforced.

---

## 13. Secrets Management

- Gemini key stored in **Secret Manager** (Cloud Functions secrets).
- Firebase config is safe to commit (public, non-sensitive).
- Never log secrets.

---

## Checklist

- [x] Firebase Auth with verified email
- [x] Firestore rules covering every collection
- [x] Storage rules with size/type constraints
- [x] API keys in secrets / env vars, never in code
- [x] Input validation client + server
- [x] Rate limiting on AI endpoints
- [x] HTTPS everywhere
- [x] CSP headers
- [x] Audit logs for writes
- [x] Data deletion API (GDPR)
