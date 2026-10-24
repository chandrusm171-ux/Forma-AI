# Forma AI — Next Steps

## Phase 3 — Blend and verify the AI workflows

- [ ] Confirm `ollama list` includes `llama3.2` and the local API responds.
- [ ] Run `npm test` in `backend/`.
- [ ] Start the backend and test `POST /api/ai/extract` for each supported `schemaId`.
- [ ] Start the frontend and test the five workflows from the Home page.
- [ ] Verify AI suggestions prefill only valid fields, and conditional fields respond correctly.
- [ ] Submit each workflow and confirm MongoDB persistence.
- [ ] Run frontend `npm run lint` and `npm run build` on Windows.
- [ ] Test responsive layouts and keyboard focus on mobile, tablet, and desktop widths.

## Phase 4 — Security and reliability (Completed)

### Implemented in this release

- [x] Added configurable in-memory rate limiting to `POST /api/ai/extract`.
- [x] Added `RateLimit-*` and `Retry-After` headers and a structured 429 response.
- [x] Added tests for rate-limit allowance, blocking, reset windows, and separate clients.
- [x] Added AI service tests for provider timeout, unreachable provider, and malformed model JSON.
- [x] Set `Cache-Control: no-store` on AI extraction responses.
- [x] Added a GitHub Actions workflow to run backend tests, frontend lint, and frontend build on pull requests and pushes.
- [x] Fixed existing frontend lint errors in the navigation health-check effect and an unused import.

## Phase 5 — Day 16 Visual Overhaul & Documentation (Completed)

- [x] Upgraded frontend typography with Google Fonts Outfit + Inter pairing.
- [x] Swapped generic blue palette for modern indigo-violet theme (`#4f46e5` / `#7c3aed`).
- [x] Built keyframe animations (`gradientShimmer`, `glowPulse`, `badgeGlow`).
- [x] Upgraded card glassmorphism, glowing borders, and focus rings.
- [x] Added dynamic form progress bar and responsive improvements.
- [x] Refreshed all repository documentation (`README.md`, `docs/Backend.md`, `docs/Frontend.md`, `docs/Project_Structure.md`, `docs/Release_Notes.md`).

## Phase 6 — Production Hardening (Required before multi-user deployment)

- [ ] Add authentication and authorization before exposing stored forms/submissions. Submission lookup is currently not a substitute for access control.
- [ ] Consider a shared rate-limit store (such as Redis) before running multiple backend instances. The included limiter is in-memory and resets on server restart.
- [ ] Configure trusted proxy handling only when deployed behind a known proxy; do not blindly trust forwarded IP headers.
- [ ] Add CSRF protections if cookie-based authentication is introduced.
- [ ] Review retention, deletion, and access policies for personal/health/financial/legal data.
- [ ] Perform an end-to-end test against a running Ollama instance and MongoDB.
- [ ] Verify the frontend production build on Windows and ensure CI passes.

### Rate limit configuration

In `backend/.env`:

```env
AI_RATE_LIMIT_WINDOW_MS=60000
AI_RATE_LIMIT_MAX=10
```

This default permits up to 10 AI extraction requests per client in a 60-second window. Tune it to your usage and hardware.

## Phase 5 — Resume parsing

Resume parsing is intentionally not implemented yet. Before enabling it, add secure upload handling, size limits, MIME/extension checks, file signature validation, PDF/DOC/DOCX text extraction, and tests for malformed or unsafe files. Do not report a successful parse until actual extracted data is returned.

## Phase 6 — Team workflow and deployment

- Review `git status` and `git diff --check`.
- Keep `.env`, `.env.local`, `node_modules`, `dist`, and credentials out of commits and shared ZIPs.
- Commit source, tests, and documentation only.
- Push `feature/chandru-frontend` and open a pull request into `develop`.
- Deploy only after the production environment variables, database access rules, authentication, and error handling have been reviewed.

## Git workflow

```powershell
git status
git diff --check
git add .github README.md docs backend frontend
git commit -m "Add AI rate limiting and reliability checks"
git push origin feature/chandru-frontend
```

Before sharing any archive, exclude `.git`, all real `.env` files, dependencies, and build output. If a database password or API key has been shared in a screenshot/archive, rotate it.
