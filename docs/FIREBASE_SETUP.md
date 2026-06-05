# 🔥 Firebase Setup

Step-by-step guide to creating and configuring a Firebase project for SkillSnap.

---

## 1. Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click **Add project**
3. Enter a project name (e.g. `skillsnap-prod`)
4. (Optional) enable Google Analytics
5. Click **Create project**

---

## 2. Enable Authentication

1. In the Firebase Console, go to **Authentication → Get started**
2. Under **Sign-in method**, enable **Email/Password**
3. (Optional) enable Google, GitHub, etc.
4. Under **Templates**, customize the email verification template

---

## 3. Create Firestore Database

1. Go to **Firestore Database → Create database**
2. Choose **Start in production mode**
3. Pick the region closest to your users (e.g. `us-central1`)
4. Wait for provisioning (~1 minute)

---

## 4. Enable Storage

1. Go to **Storage → Get started**
2. Start in **production mode**
3. Same region as Firestore

---

## 5. Register Your Web App

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** and click the web icon (`</>`)
3. Enter an app nickname (e.g. `skillsnap-web`)
4. Check **Also set up Firebase Hosting** if you want
5. Click **Register app**
6. Copy the `firebaseConfig` object — you'll need these values for `.env`

---

## 6. Add Environment Variables

Create `.env` at the project root:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=skillsnap-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=skillsnap-prod
VITE_FIREBASE_STORAGE_BUCKET=skillsnap-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
```

---

## 7. Deploy Firestore Rules

See [FIREBASE_RULES.md](./FIREBASE_RULES.md) for the full rule set.

```bash
firebase deploy --only firestore:rules
```

---

## 8. Deploy Firestore Indexes

Create `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "applications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "jobId", "order": "ASCENDING" },
        { "fieldPath": "aiScore", "order": "DESCENDING" }
      ]
    }
  ]
}
```

```bash
firebase deploy --only firestore:indexes
```

---

## 9. Set Up Cloud Functions (Optional)

For server-side Gemini calls:

```bash
firebase init functions
# Choose TypeScript
# Install dependencies
cd functions
npm install @google/generative-ai
```

See [GEMINI_INTEGRATION.md](./GEMINI_INTEGRATION.md) for code.

---

## 10. Enable Billing (Required for Cloud Functions)

1. Go to **Project Settings → Usage and billing → Link a billing account**
2. The free Spark plan does not allow outbound network calls from Cloud Functions
3. The Blaze pay-as-you-go plan has a generous free tier — you likely won't be charged.

---

## 11. Verify

1. Run the app locally: `npm run dev`
2. Sign up with a test email
3. Verify a `users/{uid}` document was created
4. Verify auth works end-to-end

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Missing or insufficient permissions" | Check Firestore rules and role field on user document |
| "Firebase App not initialized" | Ensure `.env` is loaded and `initializeApp()` runs before any Firestore call |
| Auth works locally but not in production | Add production domain to **Authentication → Settings → Authorized domains** |
