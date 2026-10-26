# Forma-AI — Next Steps and Phase Roadmap

## Completed baseline

- [x] Five dynamic workflows: Insurance Claim, Patient Intake, Personal Loan, Legal Intake, and Job Application.
- [x] React/Vite frontend, Express API, MongoDB persistence, and Ollama/OpenAI-compatible schema-aware extraction.
- [x] Modern responsive visual system, ambient animation, transitions, and reduced-motion support.
- [x] AI extraction rate limiting, safe provider errors, `Cache-Control: no-store`, and GitHub Actions CI workflow.

## Phase 6 — Resume parsing (implemented; local verification required)

- [x] Implemented `POST /api/ai/parse-resume` for multipart uploads with the field name `resume`.
- [x] Added 10 MB upload size limits, in-memory handling, extension/signature checks, and a dedicated rate limit (3 requests/minute by default).
- [x] Added lightweight text extraction for text-based PDF and DOCX files using Node.js built-ins; the original document is not persisted.
- [x] Added an internal `resume-profile` schema and returns `name`, `email`, `role`, `experience`, `education`, `skills`, and `summary` suggestions.
- [x] Updated ResumePage and the frontend client to use the live endpoint and accurately describe supported formats.
- [x] Added unit tests for PDF/DOCX text extraction, file validation, upload parsing, and resume schema normalization.
- [ ] Verify with real PDF and DOCX files on Windows and the configured Ollama model.
- [ ] Verify malformed, encrypted, unusually encoded, and empty documents fail safely.

### Known limits

- Legacy `.doc` files are not supported; save as PDF or DOCX.
- Scanned/image-only PDFs require OCR and return `NO_READABLE_TEXT`.
- The dependency-free PDF text reader is lightweight and cannot guarantee support for every PDF encoding/layout. Before production, consider replacing it with a maintained PDF parser and adding OCR/malware scanning if required.
- Resume content may contain personal information. The endpoint uses `Cache-Control: no-store` and does not save the file, but data is sent to the configured AI provider. Use a local provider if resume text must stay on the machine/network.

## Phase 7 — Production hardening (not complete; required before multi-user deployment)

- [ ] Add authentication and authorization before exposing stored forms/submissions.
- [ ] Scope each form/submission read and mutation to an authorized user/role.
- [ ] Consider a shared rate-limit store such as Redis before multiple backend instances.
- [ ] Configure trusted proxy handling only behind a known proxy; do not blindly trust forwarded IP headers.
- [ ] Add CSRF protections if cookie-based authentication is introduced.
- [ ] Review data retention, deletion, and access policies for personal/health/financial/legal/resume data.
- [ ] Add request audit logs that exclude secrets and personal document content.
- [ ] Verify secure deployment headers, TLS, and production environment configuration.

## Phase 8 — End-to-end verification and team release

- [ ] In `backend/`, run `npm ci`, `npm test`, then `npm run dev`.
- [ ] Verify `POST /api/ai/extract` against Ollama for all five starter workflow schema IDs.
- [ ] Verify `POST /api/ai/parse-resume` with real text-based PDF and DOCX files.
- [ ] Verify form prefill, conditional fields, and MongoDB submission persistence.
- [ ] In `frontend/`, run `npm ci`, `npm run lint`, `npm run build`, then `npm run dev`.
- [ ] Check keyboard navigation, reduced motion, and responsive layouts at mobile/tablet/desktop sizes.
- [ ] Ensure `.env`, `.env.local`, `.git`, `node_modules`, `dist`, and credentials are excluded from shared ZIPs.
- [ ] Review `git diff --check`, commit source/tests/docs, push the feature branch, and open a pull request into `develop`.

## Configuration

In `backend/.env`:

```env
AI_RATE_LIMIT_WINDOW_MS=60000
AI_RATE_LIMIT_MAX=10
RESUME_RATE_LIMIT_WINDOW_MS=60000
RESUME_RATE_LIMIT_MAX=3
```

These in-memory limits apply per backend process and reset on restart. They are not a substitute for a distributed rate limiter in multi-instance production.

## Git workflow

```powershell
git status
git diff --check
git add .github README.md docs backend frontend
git commit -m "Implement safe PDF and DOCX resume parsing"
git push origin feature/chandru-frontend
```

Before sharing any archive, exclude `.git`, all real `.env` files, dependencies, and build output. Rotate any database password or API key that was included in a screenshot/archive.

## Phase 7 — Authentication and access control (baseline implemented; security review required)

- [x] Added account registration and sign-in endpoints: `POST /api/auth/register`, `POST /api/auth/login`, and `GET /api/auth/me`.
- [x] Added password hashing using Node.js `scrypt` with random salts; plaintext passwords are never stored.
- [x] Added signed, expiring HS256 bearer tokens using Node.js crypto, without adding a JWT package dependency.
- [x] Public registration always creates a regular `user`; the client cannot assign itself the `admin` role.
- [x] Added in-memory rate limiting for sign-in and registration requests.
- [x] Form creation/deletion requires authentication; form deletion is scoped to its creator unless the token has the admin role.
- [x] Submission reads require authentication and are scoped to the owner, unless the token has the admin role. New submissions made by a signed-in user are associated with that account; anonymous form submission remains available for public workflows.
- [x] Added a responsive sign-in/register page and request interceptor for bearer tokens stored in `sessionStorage`.
- [x] Added basic response security headers and unit tests for password hashing and token validation.
- [ ] Configure a unique `AUTH_TOKEN_SECRET` of at least 32 characters on every backend environment.
- [ ] Test register/login/me against a connected MongoDB instance and verify owner isolation with two different accounts.
- [ ] Decide whether anonymous submissions should remain enabled for the production use case.
- [ ] For sensitive production data, replace browser-stored bearer tokens with a reviewed secure HttpOnly cookie/session approach and appropriate CSRF protection.
- [ ] Replace in-memory auth rate limiting with a shared store before running multiple backend instances.

### Authentication configuration

In `backend/.env`, set a unique secret. PowerShell can generate one with:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
```

Then configure:

```env
AUTH_TOKEN_SECRET=paste-the-generated-random-value-here
AUTH_TOKEN_TTL_SECONDS=28800
AUTH_RATE_LIMIT_WINDOW_MS=60000
AUTH_RATE_LIMIT_MAX=8
```

Do not use the example placeholder as a real secret. Keep the value private and different across development/production. Existing anonymous submissions do not have an owner and cannot be retrieved through the protected submission-read endpoint. New authenticated submissions are associated with their account.

## Phase 8 — End-to-end verification and release (next)

- [ ] Run `npm ci` and `npm test` in `backend/`.
- [ ] Run `npm ci`, `npm run lint`, and `npm run build` in `frontend/`.
- [ ] Verify account registration, login, expired/invalid tokens, and sign-out in the browser.
- [ ] Verify one account cannot read or delete another account's submissions/forms.
- [ ] Verify all five AI form workflows and resume parsing against local Ollama.
- [ ] Verify MongoDB persistence, responsive layout, keyboard navigation, and reduced-motion behavior.
- [ ] Review data retention, account deletion, admin provisioning, parser hardening, and deployment TLS before production.
- [ ] Run `git diff --check`, commit source/tests/docs only, push the feature branch, and open a pull request into `develop`.


## Phase 9 — Submission history (implemented; live database verification required)

- [x] Confirmed `Submission` model stores `formId`, `formTitle`, submitted `data`, `ownerId`, and timestamps.
- [x] Added authenticated `GET /api/submissions` with owner-scoped listing, safe search, pagination, and newest-first sorting.
- [x] Kept list responses limited to summary metadata; full values are retrieved through the existing owner-checked `GET /api/submissions/:id` endpoint.
- [x] Added `/submissions` React page with search, pagination, refresh, empty/loading/error states, and on-demand submission details.
- [x] Added a **My Submissions** navigation link and a compound database index for owner/date queries.
- [x] Added an API smoke test to confirm history cannot be accessed without authentication.
- [ ] Verify save → history list → details flow with a connected MongoDB instance and a signed-in test account.
- [ ] Verify two accounts cannot list or open each other's submissions.
- [ ] Confirm anonymous submissions are not shown in user history; older anonymous records are not automatically linked to users.
- [ ] Check mobile layout, long field values, pagination, and expired-session behavior in the browser.
