# 🚀 Deployment Guide

How to deploy SkillSnap to production.

---

## Option 1 — Netlify (Recommended)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/you/skillsnap.git
git push -u origin main
```

### 2. Create Netlify site

1. Go to https://app.netlify.com
2. Click **Add new site → Import an existing project**
3. Choose GitHub, select your repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy**

### 3. Set environment variables

In Netlify → Site settings → Environment variables, add:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4. Configure custom domain

1. Netlify → Domain settings → Add custom domain
2. Point DNS to Netlify (or use Netlify DNS)
3. SSL auto-provisioned via Let's Encrypt

### 5. Headers & Redirects

Add `public/_headers`:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com
```

Add `public/_redirects`:

```
/*  /index.html  200
```

---

## Option 2 — Firebase Hosting

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 2. Initialize

```bash
firebase init hosting
# - Use existing project
# - Public directory: dist
# - Single-page app: Yes
# - GitHub deploys: Optional
```

### 3. Deploy

```bash
npm run build
firebase deploy --only hosting
```

---

## Option 3 — Vercel

1. Push to GitHub
2. Import project at https://vercel.com/new
3. Framework preset: Vite
4. Add env vars
5. Deploy

---

## Option 4 — Cloudflare Pages

1. Connect GitHub repo
2. Build command: `npm run build`
3. Output dir: `dist`
4. Deploy

---

## CI/CD with GitHub Actions

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: ./dist
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Post-Deploy Checklist

- [ ] Add production domain to Firebase Auth authorized domains
- [ ] Add production domain to Firestore authorized origins (if using CORS)
- [ ] Verify Firestore rules are deployed
- [ ] Verify Cloud Functions are deployed (if any)
- [ ] Test sign-up / login flow
- [ ] Test file upload
- [ ] Check analytics
- [ ] Set up error monitoring (Sentry)
- [ ] Set up uptime monitoring (Better Stack, Pingdom)

---

## Performance

- Enable Netlify **Edge Functions** for server-rendered routes
- Use Netlify **Image CDN** for image optimization
- Enable **Brotli** compression (default on Netlify)
- Set long cache headers for hashed assets

---

## Monitoring

- Firebase Console → Crashlytics (mobile) / Performance (web)
- Netlify analytics (paid)
- Cloud Logging for Cloud Functions
- Sentry for runtime errors
