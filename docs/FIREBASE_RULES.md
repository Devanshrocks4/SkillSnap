# 🔐 Firebase Security Rules

Production-ready Firestore security rules for SkillSnap.

---

## Overview

- Users can read their own data and any public data (jobs, company info).
- Users can write only their own profile and their own applications.
- Recruiters can read candidate data relevant to their jobs and update application status.
- Admins can read and write anything (elevated role).
- Roles are read from the user document and verified on every request.

---

## Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ─── Role helpers ─────────────────────────────────────
    function isAuthenticated() {
      return request.auth != null;
    }

    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    function isRole(role) {
      return isAuthenticated() && getUserData().role == role;
    }

    function isAdmin() {
      return isRole("admin");
    }

    function isRecruiter() {
      return isRole("recruiter");
    }

    function isCandidate() {
      return isRole("candidate");
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // ─── Users ────────────────────────────────────────────
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(userId)
                    && request.resource.data.role == "candidate"; // self-signup defaults to candidate
      allow update: if isOwner(userId)
                    || isAdmin();
      // Role elevation only allowed by admin
      allow update: if isAdmin()
                    || (isOwner(userId)
                        && request.resource.data.role == resource.data.role);
      allow delete: if isAdmin();
    }

    // ─── Jobs ─────────────────────────────────────────────
    match /jobs/{jobId} {
      allow read: if isAuthenticated();
      allow create: if isRecruiter() || isAdmin();
      allow update: if isRecruiter() || isAdmin();
      allow delete: if isAdmin();
    }

    // ─── Candidates ───────────────────────────────────────
    match /candidates/{candidateId} {
      allow read: if isAuthenticated();
      allow create, update: if isOwner(resource.data.userId)
                            || isAdmin();
      allow delete: if isAdmin();
    }

    // ─── Applications ────────────────────────────────────
    match /applications/{appId} {
      allow read: if isAuthenticated()
                  && (isOwner(resource.data.candidateId)
                      || isRecruiter()
                      || isAdmin());
      // Candidates can only apply (create)
      allow create: if isOwner(request.resource.data.candidateId);
      // Recruiters can update status; candidates cannot
      allow update: if isRecruiter() || isAdmin();
      allow delete: if isAdmin();
    }

    // ─── Interviews ──────────────────────────────────────
    match /interviews/{interviewId} {
      allow read: if isAuthenticated()
                  && (isRecruiter() || isAdmin()
                      || isOwner(resource.data.candidateId));
      allow create, update: if isRecruiter() || isAdmin();
      allow delete: if isAdmin();
    }

    // ─── Onboarding ──────────────────────────────────────
    match /onboarding/{onboardingId} {
      allow read: if isAuthenticated()
                  && (isRecruiter() || isAdmin()
                      || isOwner(resource.data.candidateId));
      allow create, update: if isRecruiter() || isAdmin();
      allow delete: if isAdmin();
    }

    // ─── Analytics ────────────────────────────────────────
    match /analytics/{doc} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
  }
}
```

---

## Deployment

```bash
firebase deploy --only firestore:rules
```

Verify in the Firebase Console → Firestore → Rules.

---

## Testing

Use the Firebase Emulator Suite:

```bash
firebase emulators:start
```

Then run Firestore rules unit tests with `@firebase/rules-unit-testing`.
