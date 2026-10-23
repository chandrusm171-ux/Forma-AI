# Forma AI — Blended Modern Release

Forma AI is an AI-assisted dynamic form engine. Users describe information in natural language, receive schema-aware extraction suggestions, review/edit the values, and submit structured data to the API.

## What's included in this release

- The latest team project as the base, with Git metadata and secrets excluded from this distribution.
- Five selectable starter workflows: Insurance Claim, Patient Intake, Personal Loan, Legal Intake, and Job Application.
- Local Ollama support by default, plus an optional OpenAI-compatible provider configuration.
- Schema-aware extraction that rejects unknown fields, mismatched primitive types, and invalid enum/date values.
- Animated, responsive UI refresh: ambient gradient motion, glass surfaces, floating workflow preview, hover transitions, staggered cards, and reduced-motion support.
- Added configurable AI extraction rate limiting, timeout/provider failure tests, and GitHub Actions CI.
- Updated setup and Phase 4 security/reliability checklist.

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

## Routes

- `GET /api/health` — liveness
- `GET /api/ready` — readiness / database status
- `POST /api/ai/extract` — schema-aware AI extraction
- `POST /api/ai/parse-resume` — intentionally returns `501` until resume parsing is implemented
- Form and submission routes — see `docs/Backend.md`

## Roadmap

1. Run backend tests and verify all five workflow extraction paths with Ollama.
2. Verify form prefill, conditional fields, submission persistence, and API errors.
3. Run frontend lint and production build on Windows.
4. Complete live Ollama + MongoDB end-to-end verification.
5. Add authentication/authorization before exposing stored forms/submissions to multiple users.
6. Implement safe resume parsing as a separate milestone.
7. Commit source/docs/tests only, push the feature branch, and open a PR into `develop`.

## Security notes

- Do not add credentials to `VITE_*` variables.
- Never commit `.env`, `.env.local`, `node_modules`, or build output.
- Rotate any database credential that has been included in a screenshot or shared archive.
- AI output is untrusted input and must be reviewed by a person.
- The included AI rate limiter is in-memory and per backend process; use a shared store for multi-instance deployments.
- Do not expose form/submission endpoints publicly until authentication and authorization are implemented.
