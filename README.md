# Forma AI

AI-Augmented Dynamic Form Engine.

Forma AI is an AI-powered dynamic form system that allows users to describe information using natural language. The system extracts structured information using an LLM and dynamically populates a form based on a JSON schema.

## Project Goal

The goal of Forma AI is to simplify complex forms by combining:

- React
- React Hook Form
- Node.js
- Express.js
- MongoDB
- LangChain
- LLM-based structured data extraction

## Team

| Member | Role |
|---|---|
| Chandru | Team Lead + Frontend + Database/Testing + AI integration |
| Khushi | Backend Developer |
| Vishal | Frontend UI Components + Styling + Documentation |

## Project Structure

```text
Forma-AI/
│
├── frontend/       # React frontend (Vite + React 19 + React Hook Form)
├── backend/        # Node.js + Express backend
├── docs/           # Project documentation & updates
└── README.md
```

## Documentation

- [Project Structure & Roles](docs/Project_Structure.md)
- [Frontend Structure & Component Guide](docs/Frontend.md)
- [Backend Structure & Setup Guide](docs/Backend.md)
- [Next Steps & Phase 3 Checklist](docs/Next_Steps.md)

## Getting Started

### 1. Backend

```powershell
cd backend
Copy-Item .env.example .env
npm ci
npm test
npm run dev
```

Set `MONGODB_URI` in `backend/.env` to your own local MongoDB or Atlas URI. Keep TLS verification enabled. The API starts in degraded mode if the database is unavailable and retries the initial connection every 15 seconds.

- Liveness: `http://localhost:5000/api/health`
- Readiness: `http://localhost:5000/api/ready` (returns HTTP 503 while MongoDB is disconnected)

### 2. Frontend

Open a second terminal:

```powershell
cd frontend
npm ci
npm run lint
npm run build
npm run dev
```

The frontend uses `http://localhost:5000/api` by default. To override it, copy `frontend/.env.example` to `frontend/.env.local` and set `VITE_API_BASE_URL`.

### Phase 1 stabilization notes

- The backend process does not crash when Atlas is unavailable.
- Database-backed routes return `503 DATABASE_UNAVAILABLE` until the database connects.
- Keep TLS certificate verification enabled for MongoDB Atlas.
- Do not commit `.env` or `.env.local` files, credentials, or `node_modules`.

### Phase 2 — AI incident extraction

The backend now supports real incident-description extraction through an OpenAI-compatible Chat Completions API.

1. Set `OPENAI_API_KEY` in `backend/.env`.
2. Set `OPENAI_MODEL` (default: `gpt-4o-mini`). `OPENAI_BASE_URL` is an optional OpenAI-compatible API base URL; the backend appends `/chat/completions` when needed.
   - For local Ollama, use `OPENAI_BASE_URL=http://localhost:11434/v1`, `OPENAI_API_KEY=ollama-local`, and `OPENAI_MODEL=llama3.2`.
   - Ollama must be installed, the model downloaded, and its local server running. No paid API key is required for local inference.
3. Start the backend and submit a natural-language incident description from the Form page.
4. Review all extracted values before submitting the form. The AI must not be treated as the source of truth.

`POST /api/ai/extract` returns only supported fields for the `insurance-claim` schema. It returns `503 AI_SERVICE_NOT_CONFIGURED` if no key is configured and safe error responses for provider failures. The key remains server-side and must never be added to a `VITE_*` variable. This first provider integration uses Node.js `fetch()` directly; LangChain is not yet part of the runtime path.

Resume parsing remains a separate, not-yet-implemented feature and returns `501 RESUME_PARSER_NOT_CONFIGURED`.

### Phase 3 — Local AI integration and end-to-end verification

1. Run `ollama run llama3.2` once to confirm the model is available, then exit the interactive prompt with `/bye`. The Ollama service should remain available on `http://localhost:11434`.
2. Configure the three Ollama environment variables in `backend/.env`; never commit `.env`.
3. Run `npm test` in `backend/` and start the API with `npm run dev`.
4. Test `POST http://localhost:5000/api/ai/extract` with an insurance-claim description.
5. Open the frontend, use Analyze with AI, review the extracted fields, and submit a test form.
6. Verify the saved submission through the API and confirm conditional form fields respond correctly.
7. Run frontend `npm run lint` and `npm run build`.
8. Review `git status`, commit only source/docs/tests, push `feature/chandru-frontend`, and open a pull request into `develop`.

If AI extraction returns `AI_PROVIDER_REJECTED`, first confirm Ollama responds at `http://localhost:11434/v1/chat/completions`; then inspect the backend terminal. Never disable database TLS verification to work around MongoDB connection issues.
