# Backend Setup and API Contract

## Stack & Technologies

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database / ODM**: MongoDB with Mongoose 9 (supports Local MongoDB and MongoDB Atlas)
- **CORS**: Configurable origin allowlist (`FRONTEND_ORIGIN`)
- **Testing**: Node.js built-in test runner (`node --test`)

The AI extraction service uses Node.js `fetch()` with an OpenAI-compatible Chat Completions API. It does not yet use LangChain; the provider boundary is isolated in `services/aiExtractionService.js` so it can be replaced or wrapped with LangChain later. `OPENAI_BASE_URL` may be a base URL such as `http://localhost:11434/v1`; the service normalizes it to `/chat/completions`.

---

## Directory & File Structure

```text
backend/
├── app.js                          # Express app setup, middleware, error handlers and routes
├── config/
│   └── db.js                        # Connects to MongoDB with graceful error handling (won't crash HTTP server)
├── controllers/
│   ├── healthController.js          # Liveness status and DB connectivity
│   └── readinessController.js       # Readiness check (503 when MongoDB is disconnected)
├── middleware/
│   └── requireDatabase.js           # Guard middleware returning 503 when MongoDB is not connected
├── models/
│   ├── Form.js                      # Schema & model for dynamic form definitions
│   └── Submission.js                # Schema & model for persisted form responses
├── routes/
│   ├── index.js                     # Root API router (/api)
│   ├── healthRoutes.js              # /api/health route
│   ├── formRoutes.js                # /api/forms CRUD routes (protected by requireDatabase)
│   ├── submissionRoutes.js          # /api/submissions routes (protected by requireDatabase)
│   └── aiRoutes.js                  # /api/ai contract endpoints (extract, parse-resume)
├── services/
│   └── aiExtractionService.js       # AI Chat Completions extraction provider & data normalizer
├── utils/
│   ├── validateFormSchema.js        # Validates form schema structure, field types, and conditions
│   └── validateSubmissionPayload.js # Validates submission payload (formId, formTitle, data)
├── tests/
│   ├── api.test.js                  # HTTP smoke tests for health, readiness, malformed JSON and 404s
│   └── validation.test.js           # Unit tests for schema and submission validators
├── server.js                        # Starts HTTP server, connects/retries MongoDB, handles shutdown
├── package.json                     # Dependencies & scripts
├── .env.example                     # Environment template
└── .env                             # Local environment variables (do not commit)
```

---

## Daily Progress Log (Backend)

| Day | Milestone | Summary |
|---|---|---|
| **Days 1–4** | Architecture & Setup | Defined backend architecture, Express 5 server skeleton, route blueprints, and environment configurations. |
| **Day 5** | CORS & Health Endpoint | Configured configurable `FRONTEND_ORIGIN` allowlist for Vite dev server and established initial `/api/health` connectivity check. |
| **Days 6–7** | Readiness & DB Guard | Separated process liveness (`/api/health`) from operational readiness (`/api/ready`). Designed `requireDatabase` middleware returning 503 when DB is offline. |
| **Days 8–9** | Connection Resilience & Isolation | Split Express app (`app.js`) from HTTP listener (`server.js`) for testability. Implemented non-blocking MongoDB connection retries (`DB_RETRY_INTERVAL_MS`) maintaining strict TLS certificate verification. |
| **Day 10** | Schema & Submission Persistence | Implemented Mongoose models (`Form`, `Submission`), payload validation utilities (`validateFormSchema`, `validateSubmissionPayload`), and built unit/smoke test suites (`api.test.js`, `validation.test.js`). |
| **Day 11** | Phase 2 AI Integration & UI Alignment | Integrated OpenAI-compatible Chat Completions via `aiExtractionService.js` for natural language incident extraction (`/api/ai/extract`), supported field allowlisting, safe error boundaries, and aligned payload contracts with frontend form submission. |

---

## Environment Variables Configuration

Create a `.env` file inside the `backend/` directory by copying `.env.example`:

```powershell
cd backend
Copy-Item .env.example .env
```

### Environment Keys:

| Key | Description | Example / Default |
|---|---|---|
| `PORT` | Port for the Express server to listen on | `5000` |
| `MONGODB_URI` | MongoDB connection string (Local or Atlas) | `mongodb://127.0.0.1:27017/forma-ai` |
| `FRONTEND_ORIGIN` | Comma-separated list of allowed frontend origins for CORS | `http://localhost:5173,http://127.0.0.1:5173` |
| `DB_RETRY_INTERVAL_MS` | Delay between retries after an initial Atlas connection failure (minimum 5000 ms) | `15000` |
| `OPENAI_API_KEY` | Server-side key for the AI extraction provider | Required for AI extraction |
| `OPENAI_MODEL` | Model name accepted by the configured provider | `gpt-4o-mini` |
| `OPENAI_BASE_URL` | Optional OpenAI-compatible API base URL or full Chat Completions URL | `https://api.openai.com/v1` by default |

### Sample `.env` Setup:

#### 1. Local MongoDB:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/forma-ai
FRONTEND_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
DB_RETRY_INTERVAL_MS=15000
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
# Optional OpenAI-compatible API base URL:
# OPENAI_BASE_URL=https://api.openai.com/v1

# Local Ollama (free local inference; Ollama must be running):
# OPENAI_API_KEY=ollama-local
# OPENAI_MODEL=llama3.2
# OPENAI_BASE_URL=http://localhost:11434/v1
```

#### 2. MongoDB Atlas (Cloud):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/forma-ai?retryWrites=true&w=majority
FRONTEND_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
DB_RETRY_INTERVAL_MS=15000
```

> **Note:** Never commit the `.env` file to version control.

---

## Running the Backend

### Install Dependencies:
```powershell
cd backend
npm install
```

### Start in Development Mode (Nodemon):
```powershell
npm run dev
```

### Start in Production Mode:
```powershell
npm start
```

### Run Validation Tests:
```powershell
npm test
```

---

## API Endpoints & Contract

| Method | Path | Middleware | Description | Success Code |
|---|---|---|---|---|
| **GET** | `/` | None | Basic server heartbeat | `200 OK` |
| **GET** | `/api/health` | None | Liveness endpoint; reports API and MongoDB status | `200 OK` |
| **GET** | `/api/ready` | None | Readiness endpoint; indicates whether DB-backed operations can run | `200 OK` or `503` |
| **POST** | `/api/forms` | `requireDatabase` | Creates a validated dynamic form schema | `201 Created` |
| **GET** | `/api/forms` | `requireDatabase` | Retrieves list of all saved forms | `200 OK` |
| **GET** | `/api/forms/:id` | `requireDatabase` | Retrieves a specific form schema by its ID | `200 OK` |
| **DELETE** | `/api/forms/:id` | `requireDatabase` | Deletes a form schema by its ID | `200 OK` |
| **POST** | `/api/submissions` | `requireDatabase` | Validates and persists a completed form submission | `201 Created` |
| **GET** | `/api/submissions/:id` | `requireDatabase` | Retrieves a form submission by its ID | `200 OK` |
| **POST** | `/api/ai/extract` | None | AI field extraction from natural language (requires provider key) | `200`, `400`, `429`, `502`, `503`, or `504` |
| **POST** | `/api/ai/parse-resume` | None | Resume parser placeholder | `501 Not Implemented` |

---

## Detailed Payload Specifications

### 1. Health Status (`GET /api/health`)
Returns `status: "ready"` when MongoDB is connected, and `status: "degraded"` when the server is alive but MongoDB is disconnected.

```json
{
  "success": true,
  "status": "ready",
  "service": "Forma-AI API",
  "database": "connected",
  "message": "API and database are ready",
  "timestamp": "2026-10-14T02:40:00.000Z"
}
```

### 2. Create Form Submission (`POST /api/submissions`)
**Request Body:**
```json
{
  "formId": "insurance-claim",
  "formTitle": "Insurance Claim Form",
  "data": {
    "fullName": "Alex Example",
    "incidentType": "accident",
    "hasDamage": false
  }
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Form submission saved successfully",
  "data": {
    "id": "670c7913e8b09088ab123456",
    "formId": "insurance-claim",
    "formTitle": "Insurance Claim Form",
    "createdAt": "2026-10-14T02:45:00.000Z"
  }
}
```

**Database Disconnected Response (`503 Service Unavailable`):**
```json
{
  "success": false,
  "code": "DATABASE_UNAVAILABLE",
  "message": "The database is not connected. Please try again later."
}
```

### 3. AI Extraction (`POST /api/ai/extract`)
The frontend sends:
```json
{
  "text": "My Honda City hit a deer and the front bumper was damaged.",
  "schemaId": "insurance-claim"
}
```

When `OPENAI_API_KEY` is configured, the backend sends a structured extraction prompt to the configured OpenAI-compatible Chat Completions endpoint. For Ollama, a placeholder key such as `ollama-local` is accepted by the local OpenAI-compatible endpoint; no OpenAI credits are needed. The response is parsed and normalized against the allowlisted insurance-claim fields. Unknown fields and unsupported incident types are discarded. Unknown values are omitted instead of fabricated. The UI must let the user review and correct extracted values before submission.

If no provider key is configured, the endpoint returns HTTP `503` with `AI_SERVICE_NOT_CONFIGURED`. Provider failures return safe errors without forwarding the provider's raw response body. Request text is limited to 10,000 characters.

### 4. AI Resume Parser (`POST /api/ai/parse-resume`)
Resume parsing remains a separate follow-up feature. It returns HTTP `501` with `RESUME_PARSER_NOT_CONFIGURED` until file type validation, document text extraction, and structured resume parsing are implemented.

---

## Error Handling & Resilience
- **Database Independence**: `app.js` configures the Express application separately from `server.js`, so HTTP routes can be tested without starting a real MongoDB connection. The server catches initial connection failures and retries every `DB_RETRY_INTERVAL_MS` (default 15 seconds) without terminating the API. `/api/health` stays functional while MongoDB is offline.
- **Liveness vs readiness**: `/api/health` returns HTTP 200 if the API process is responding and includes the database state. `/api/ready` returns HTTP 503 until MongoDB is connected.
- **Database Guard**: Database-dependent routes use `requireDatabase` middleware to prevent unhandled promise rejections and return an explicit `503 DATABASE_UNAVAILABLE`.
- **JSON & Body Guard**: Malformed JSON triggers a `400 Bad Request` and payloads exceeding 1MB trigger a `413 Request body is too large`.
- **404 Handler**: Catches any unmapped API endpoints.

---

## Security & Production Readiness
This project is currently in the development MVP phase:
- Add JWT or session-based authentication before deploying to production.
- Add rate limiting (e.g. `express-rate-limit`) on sensitive submission and AI endpoints.
- Add authentication/authorization before exposing saved submissions or forms in production.
- Consider a provider-specific LangChain adapter if the team needs model switching or more advanced output parsing.
- Configure proper TLS verification and keep connection credentials in environment variables only.


## Phase 3 — Ollama local AI verification

1. Verify Ollama's model is installed with `ollama list`.
2. Confirm `OPENAI_BASE_URL=http://localhost:11434/v1`, `OPENAI_API_KEY=ollama-local`, and `OPENAI_MODEL=llama3.2` in the private `backend/.env`.
3. Run `npm test`, then `npm run dev`.
4. Send a test request to `POST /api/ai/extract` with `text` and `schemaId: "insurance-claim"`.
5. Verify the frontend's Analyze with AI flow, form prefill, conditional fields, and persisted submission.
6. Run frontend lint/build and review the pull request.

Troubleshooting: `AI_PROVIDER_REJECTED` is a generic provider response error. Check that Ollama is running and that the backend is calling `http://localhost:11434/v1/chat/completions`. Do not put provider credentials in frontend environment variables or commit `.env`.
