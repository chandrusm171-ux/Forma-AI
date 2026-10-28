# Forma AI — Blended Modern Release

Forma AI is an AI-assisted dynamic form engine. Users describe information in natural language, receive schema-aware extraction suggestions, review/edit the values, and submit structured data to the API.

## What's included in this release

- The latest team project as the base, with Git metadata and secrets excluded from this distribution.
- Five selectable starter workflows: Insurance Claim, Patient Intake, Personal Loan, Legal Intake, and Job Application.
- Local Ollama support by default, plus an optional OpenAI-compatible provider configuration.
- Schema-aware extraction that rejects unknown fields, mismatched primitive types, and invalid enum/date values.
- Animated, responsive UI refresh: ambient gradient motion, glass surfaces, floating workflow preview, hover transitions, staggered cards, and reduced-motion support.
- Added configurable AI extraction rate limiting, timeout/provider failure tests, and GitHub Actions CI.
- Implemented Phase 6 resume parsing for text-based PDF and DOCX files with in-memory upload handling, signature validation, size limits, and schema-aware AI extraction.
- Added resume upload rate limiting and parser/document tests.
- Added Phase 7 baseline authentication: account registration/login, salted password hashing, signed expiring tokens, owner-scoped submission reads, form mutation protection, and a sign-in/register screen.
- Added authenticated submission history: paginated/searchable `GET /api/submissions`, a “My Submissions” page, and on-demand detail viewing restricted to the signed-in owner.

## Team roles

| Member | Role |
|---|---|
| Chandru | Team lead, frontend, database/testing, AI integration |
| Khushi | Backend and database integration |
| Vishal | Frontend support, UI components, documentation |

## Requirements

- Node.js 22 or later recommended
- MongoDB local or Atlas for persistence
- Ollama for no-per-request-cost local AI, or an OpenAI-compatible provider

## Run locally (Windows PowerShell)

### Backend

```powershell
cd backend
Copy-Item .env.example .env
npm ci
npm test
npm run dev
```

Set `MONGODB_URI` in `backend/.env` to your own connection string. Never commit `.env`. Keep MongoDB TLS verification enabled.

### Local AI with Ollama

Install Ollama, then run:

```powershell
ollama pull llama3.2
ollama run llama3.2
```

Exit the interactive chat with `/bye`. Ollama should remain available locally. The default example uses:

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434/v1/chat/completions
OLLAMA_MODEL=llama3.2
```

No paid OpenAI API key is needed for local inference. If the computer already has an older `.env` with `OPENAI_*` values, preserve the database settings and update the AI lines to match `.env.example`.

### Frontend

Open a second terminal:

```powershell
cd frontend
npm ci
npm run lint
npm run build
npm run dev
```

Vite normally serves the UI at `http://localhost:5173`; the API defaults to `http://localhost:5000/api`.

## Test AI extraction

```powershell
$body = @{
  text = "My Honda City hit a deer. The front bumper was damaged."
  schemaId = "insurance-claim"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:5000/api/ai/extract" `
  -ContentType "application/json" `
  -Body $body
```

The endpoint returns suggestions only. Users should review every value before submission.

## Authentication setup

Copy `backend/.env.example` to `backend/.env` and set a unique `AUTH_TOKEN_SECRET` of at least 32 characters. On Windows PowerShell, generate a random value with:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
```

Authentication routes:

- `POST /api/auth/register` — create a regular user account
- `POST /api/auth/login` — sign in and receive an expiring bearer token
- `GET /api/auth/me` — retrieve the current account using `Authorization: Bearer <token>`
- `GET /api/submissions?page=1&limit=10&search=insurance` — list the signed-in user's submissions, newest first; results are paginated and search matches workflow title/ID.

Form creation/deletion and submission reads require authentication. Public form reading and public form submissions remain enabled for the current demo workflow. Submission reads are owner-scoped; `GET /api/submissions` lists only the signed-in user's records, and detail reads are owner-scoped. Submissions created anonymously have no owner and cannot be retrieved through the protected read endpoints. Open **My Submissions** from the navbar to browse saved responses. Public registration cannot create admins.

The frontend stores the short-lived bearer token in `sessionStorage`. This is a development baseline, not the strongest option for sensitive production data; consider secure HttpOnly cookies plus CSRF protection. In-memory rate limits are per process and need a shared store for multi-instance deployment.

## Routes

- `GET /api/health` — liveness
- `GET /api/ready` — readiness / database status
- `POST /api/ai/extract` — schema-aware AI extraction
- `POST /api/ai/parse-resume` — accepts one PDF/DOCX resume as multipart field `resume`, extracts readable text, then returns structured profile suggestions
- Form and submission routes — see `docs/Backend.md`

## Roadmap

1. Run backend tests and verify all five workflow extraction paths with Ollama.
2. Verify form prefill, conditional fields, submission persistence, My Submissions listing/detail view, and API errors.
3. Run frontend lint and production build on Windows.
4. Complete live Ollama + MongoDB end-to-end verification.
5. Verify resume parsing using real text-based PDF and DOCX files; scanned PDFs need OCR and legacy `.doc` is not supported.
6. Add authentication/authorization before exposing stored forms/submissions to multiple users.
7. Review document parser limitations and consider a mature PDF library/OCR pipeline before production.
8. Commit source/docs/tests only, push the feature branch, and open a PR into `develop`.

## Security notes

- Do not add credentials to `VITE_*` variables.
- Never commit `.env`, `.env.local`, `node_modules`, or build output.
- Rotate any database credential that has been included in a screenshot or shared archive.
- AI output is untrusted input and must be reviewed by a person.
- Resume uploads are processed in memory and not saved by the parser. The built-in PDF text reader supports text-based PDFs; scanned/image-only documents require OCR and are rejected with a clear error. Legacy `.doc` files are not supported; use PDF or DOCX.
- The included AI rate limiter is in-memory and per backend process; use a shared store for multi-instance deployments.
- Do not expose form/submission endpoints publicly until authentication and authorization are implemented.

## Phase 9 — Production readiness

- Socket.IO connections require a valid signed bearer token in the handshake `auth.token` field.
- Realtime identity is derived from the verified token; client-supplied user IDs are ignored.
- CI includes a tracked-file release-artifact check.
- Before production, verify room-level authorization against persisted resource permissions, end-to-end MongoDB/Ollama behavior, frontend build, HTTPS, and data-retention policy.
