# InteleSalud Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete, rebrand, and deploy the InteleSalud telemedicine portal to `intelesalud.medicalcore.app`.

**Architecture:** Next.js 15 App Router with Firebase Auth, Prisma/PostgreSQL, Plin payment (voucher-based), Google Calendar/Meet integration. Standalone build deployed via systemd + nginx on AWS Lightsail VPS.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Prisma, PostgreSQL, Firebase Auth, Google Calendar API, motion (animations), lucide-react (icons)

---

## Phase 1: Rebrand & Local Setup

### Task 1: Rebrand TuSalud → InteleSalud across codebase

**Files:**
- Modify: `lib/platform/catalog.js` (BRAND_NAME constant)
- Modify: `components/ui/AppLogo.jsx` (logo text)
- Modify: `app/layout.jsx` (metadata title/description)
- Modify: `metadata.json` (app metadata)
- Modify: `app/(public)/page.jsx` (hero copy)
- Modify: `prisma/seed.js` (log messages)
- Modify: `README.md` (project title)
- Modify: `CLAUDE.md` (remaining DrCardio references)

- [ ] **Step 1:** Search all files for `TuSalud`, `DrCardio`, `tusalud`, `drcardio` branding strings
- [ ] **Step 2:** Replace `BRAND_NAME = 'TuSalud'` → `'InteleSalud'` in `lib/platform/catalog.js`
- [ ] **Step 3:** Update `AppLogo.jsx` text from "TuSalud" → "InteleSalud"
- [ ] **Step 4:** Update `app/layout.jsx` metadata title/description
- [ ] **Step 5:** Update `metadata.json` from "DrCardio Telehealth" → "InteleSalud"
- [ ] **Step 6:** Update hero copy in `app/(public)/page.jsx`
- [ ] **Step 7:** Update `prisma/seed.js` log messages
- [ ] **Step 8:** Update `README.md` and `CLAUDE.md` remaining references
- [ ] **Step 9:** Run `npm run build` to verify no broken references
- [ ] **Step 10:** Commit: `feat: rebrand TuSalud to InteleSalud`

### Task 2: Create local .env.local for development

**Files:**
- Create: `.env.local`

- [ ] **Step 1:** Create `.env.local` with new Firebase `intelesalud` credentials, DATABASE_URL via SSH tunnel (`postgresql://intelesalud:InteleSalud2026Secure@127.0.0.1:5432/intelesalud?schema=public`), all Google Calendar vars, IP_HASH_SECRET, NEXT_PUBLIC_APP_URL=http://localhost:3000
- [ ] **Step 2:** Verify `.env.local` is in `.gitignore`
- [ ] **Step 3:** Run `npm run dev` to verify env loading

### Task 3: Push Prisma schema to new database & seed

**Files:**
- Uses: `prisma/schema.prisma`, `prisma/seed.js`

- [ ] **Step 1:** Open SSH tunnel: `ssh -L 5432:127.0.0.1:5432 -i "C:\Users\MAGNUS\.ssh\lightsail.pem" admin@44.235.121.195 -N`
- [ ] **Step 2:** Run `npx prisma db push` to create tables in intelesalud DB
- [ ] **Step 3:** Run `npx prisma generate` to generate client
- [ ] **Step 4:** Run `npm run db:seed` to populate catalog data
- [ ] **Step 5:** Verify data: `npx prisma studio` or query via psql
- [ ] **Step 6:** Commit if schema changed: `chore: sync prisma schema`

---

## Phase 2: Complete Stub Pages

### Task 4: Complete Virtual Room page (`/portal/sala`)

**Files:**
- Modify: `app/(portal)/portal/sala/page.jsx`

- [ ] **Step 1:** Read current stub implementation
- [ ] **Step 2:** Implement functional room page that:
  - Fetches user's next CONFIRMED appointment with a MeetingSession
  - Shows Google Meet join link (opens in new tab)
  - Shows appointment details (specialist, date, time)
  - Shows "no upcoming appointments" state when empty
  - Shows countdown or "session active" indicator
- [ ] **Step 3:** Use existing `EmptyStateCard` component for empty state
- [ ] **Step 4:** Verify page renders at `/portal/sala`
- [ ] **Step 5:** Commit: `feat: complete virtual room page with Meet link`

### Task 5: Complete Documents page (`/portal/documentos`)

**Files:**
- Modify: `app/(portal)/portal/documentos/page.jsx`

- [ ] **Step 1:** Read current mock implementation
- [ ] **Step 2:** Implement page that queries real `Document` records for authenticated user
- [ ] **Step 3:** Display documents grouped by kind (PRESCRIPTION, REPORT, CERTIFICATE)
- [ ] **Step 4:** Each document card shows: title, summary, issuedBy specialist name, date, download link
- [ ] **Step 5:** Empty state when no documents
- [ ] **Step 6:** Verify page renders at `/portal/documentos`
- [ ] **Step 7:** Commit: `feat: complete documents page with real data`

### Task 6: Complete Clinical History page (`/portal/historial`)

**Files:**
- Modify: `app/(portal)/portal/historial/page.jsx`

- [ ] **Step 1:** Read current mock implementation
- [ ] **Step 2:** Implement page that queries `ClinicalRecord` and past `Appointment` data
- [ ] **Step 3:** Display timeline of: past appointments, diagnoses, treatments, prescriptions
- [ ] **Step 4:** Each entry shows: date, type badge, title, summary, specialist
- [ ] **Step 5:** Empty state for new patients
- [ ] **Step 6:** Commit: `feat: complete clinical history page`

### Task 7: Complete Settings page (`/portal/configuracion`)

**Files:**
- Modify: `app/(portal)/portal/configuracion/page.jsx`

- [ ] **Step 1:** Read current stub
- [ ] **Step 2:** Implement settings page with sections:
  - Notification preferences (email/SMS toggles — UI only for now)
  - Session info (last login, session duration)
  - Consent management (link to consent page)
  - Account actions (logout)
- [ ] **Step 3:** Use existing `ProfileForm` pattern for form layout
- [ ] **Step 4:** Commit: `feat: complete settings page`

### Task 8: Complete Appointment Detail API

**Files:**
- Modify: `app/api/appointments/[appointmentId]/route.js`

- [ ] **Step 1:** Read current stub (1.2K file)
- [ ] **Step 2:** Implement GET handler that returns full appointment with:
  - Appointment data + status
  - Service details (name, price, duration)
  - Specialist profile (name, title, photo)
  - Payment status + voucher
  - MeetingSession (join URL)
  - Messages
- [ ] **Step 3:** Add auth check (only owner or specialist can view)
- [ ] **Step 4:** Commit: `feat: complete appointment detail API endpoint`

---

## Phase 3: Code Quality & Cleanup

### Task 9: Clean up legacy routes

**Files:**
- Modify: `app/book/[serviceId]/page.jsx` (verify redirect works)
- Modify: `app/checkout/[appointmentId]/page.jsx` (verify redirect or remove)
- Modify: `app/confirmation/[appointmentId]/page.jsx` (verify redirect or remove)
- Modify: `app/dashboard/` (verify redirects)

- [ ] **Step 1:** Audit each legacy route — confirm redirects are working
- [ ] **Step 2:** Add proper redirect responses for any that just show stale UI
- [ ] **Step 3:** Commit: `chore: clean up legacy route redirects`

### Task 10: Review and improve API route error handling

**Files:**
- Modify: All `app/api/*/route.js` files

- [ ] **Step 1:** Audit each API route for consistent error handling patterns
- [ ] **Step 2:** Ensure all routes: validate auth, return proper HTTP status codes, catch exceptions with 500 responses, log errors
- [ ] **Step 3:** Ensure no stack traces leak to client in production
- [ ] **Step 4:** Commit: `fix: standardize API error handling`

### Task 11: Update CLAUDE.md to reflect current state

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1:** Update project overview (InteleSalud, multi-specialty)
- [ ] **Step 2:** Update API routes section (current routes, not legacy)
- [ ] **Step 3:** Update page routes section (portal structure)
- [ ] **Step 4:** Update data model section if needed
- [ ] **Step 5:** Update environment variables section with new Firebase project
- [ ] **Step 6:** Remove references to missing skills files or create them
- [ ] **Step 7:** Commit: `docs: update CLAUDE.md to reflect current codebase`

---

## Phase 4: Build & Deploy

### Task 12: Local build verification

- [ ] **Step 1:** Run `npm run lint` — fix any errors
- [ ] **Step 2:** Run `npm run build` — must succeed with zero errors
- [ ] **Step 3:** Run `npm start` — verify production server works on localhost:3000
- [ ] **Step 4:** Test key flows: homepage, login, portal navigation
- [ ] **Step 5:** Fix any build/runtime issues found

### Task 13: Configure Cloudflare DNS

- [ ] **Step 1:** In Cloudflare dashboard for `medicalcore.app`
- [ ] **Step 2:** Add DNS A record: `intelesalud` → `44.235.121.195` (Proxied/orange cloud)
- [ ] **Step 3:** Verify DNS propagation: `nslookup intelesalud.medicalcore.app`

### Task 14: First deploy to VPS

- [ ] **Step 1:** Ensure SSH tunnel is closed (deploy uses direct connection)
- [ ] **Step 2:** Run `.\deploy.ps1` from project root
- [ ] **Step 3:** Monitor deploy output for errors
- [ ] **Step 4:** If deploy.ps1 fails, deploy manually:
  ```bash
  npm ci && npx prisma generate && npm run build
  # Then SCP .next/standalone, .next/static, public, prisma to VPS
  ```
- [ ] **Step 5:** On VPS: push schema and seed
  ```bash
  cd /var/www/intelesalud
  npx prisma db push
  npm run db:seed
  ```
- [ ] **Step 6:** Start service: `sudo systemctl start intelesalud`
- [ ] **Step 7:** Check logs: `sudo journalctl -u intelesalud -f`

### Task 15: Post-deploy verification

- [ ] **Step 1:** Visit `https://intelesalud.medicalcore.app` — homepage loads
- [ ] **Step 2:** Test Google Sign-In flow
- [ ] **Step 3:** Test portal navigation (all pages load)
- [ ] **Step 4:** Test booking flow (agendar)
- [ ] **Step 5:** Verify SSL certificate (padlock icon, no warnings)
- [ ] **Step 6:** Check nginx logs: `sudo tail -f /var/log/nginx/access.log`

---

## Phase 5: Post-Launch Quality Checkpoints

### Checkpoint 1: Security Audit
- [ ] Verify all API routes require auth where needed
- [ ] Verify CORS/CSP headers in production
- [ ] Verify session cookies are secure + httpOnly
- [ ] Verify no secrets in client-side bundle

### Checkpoint 2: Performance
- [ ] Lighthouse audit on homepage (target: 90+ performance)
- [ ] Check static asset caching (/_next/static/ → 365d)
- [ ] Verify gzip is active

### Checkpoint 3: UX Review
- [ ] Mobile responsiveness on all portal pages
- [ ] Spanish copy review (no English leaking)
- [ ] Empty states render properly
- [ ] Error states show user-friendly messages
