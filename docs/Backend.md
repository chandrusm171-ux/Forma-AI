# Backend Setup and API Contract

## Stack & Technologies

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database / ODM**: MongoDB with Mongoose 9 (supports Local MongoDB and MongoDB Atlas)
- **CORS**: Configurable origin allowlist (`FRONTEND_ORIGIN`)
- **Testing**: Node.js built-in test runner (`node --test`)

The AI extraction service uses Node.js `fetch()` with an OpenAI-compatible Chat Completions API. Ollama is the default local provider, so no paid API key is needed for local development. The provider boundary is isolated in `services/aiExtractionService.js`; LangChain is not currently required.

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
│   ├── requireDatabase.js           # Guard middleware returning 503 when MongoDB is not connected
│   └── rateLimit.js                 # In-memory fixed-window rate limiter for sensitive endpoints
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
│   ├── aiExtraction.test.js         # AI extraction service unit tests (timeout, malformed JSON, provider failure)
│   ├── api.test.js                  # HTTP smoke tests for health, readiness, malformed JSON and 404s
│   ├── rateLimit.test.js            # Rate limiter unit tests (allowance, block, headers, resets)
│   └── validation.test.js           # Unit tests for schema and submission validators
├── server.js                        # Starts HTTP server, connects/retries MongoDB, handles shutdown
├── package.json                     # Dependencies & scripts
├── .env.example                     # Environment template
└── .env                             # Local environment variables (do not commit)
```

---

## Submission History API

- `POST /api/submissions` validates the payload and persists it to MongoDB. If a valid bearer token is present, `ownerId` is assigned to that account; anonymous submissions remain supported and use `ownerId: null`.
- `GET /api/submissions?page=1&limit=10&search=insurance` requires authentication and returns only the current user's submissions. The list contains summary metadata and pagination information, not the submitted field values.
- `GET /api/submissions/:id` requires authentication and returns the full submission only to its owner (or an admin).
- The frontend route `/submissions` is linked as **My Submissions** in the main navigation. It supports search, pagination, refresh, and loading full values on demand.
- Existing anonymous submissions are not automatically attached to an account and therefore do not appear in a user's history.

Example list response:

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "formId": "insurance-claim",
      "formTitle": "Insurance Claim",
      "createdAt": "2026-10-26T10:00:00.000Z",
      "updatedAt": "2026-10-26T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

The API clamps page size to a maximum of 50 and escapes search input before using it in a MongoDB regular expression. A compound index on `ownerId` and `createdAt` supports owner-scoped newest-first queries.

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
| **Days 12–13** | Blended Modern Release | Schema-aware extraction across 5 workflow templates, type-safe output normalization, enum and date validation, and safe prompt parsing. |
| **Day 14** | Rate Limiting & Security Hardening | Implemented configurable in-memory rate limiting middleware with standard headers (`RateLimit-*`, `Retry-After`), structured 429 response, and comprehensive unit tests. Added GitHub Actions CI pipeline. |
| **Day 15** | Branch & Dependency Alignment | Synchronized development branches, validated npm dependencies, verified MongoDB Atlas connection resilience, and ensured all 20 tests pass. |
| **Day 16** | Visual Refresh & Documentation Update | Comprehensive documentation updates across all guidebooks, added detailed API contracts, and aligned documentation with frontend Day 16 UI overhaul. |

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
| `AI_PROVIDER` | Select `ollama` (default) or `openai` | `ollama` |
| `OLLAMA_BASE_URL` | Ollama base URL or full Chat Completions endpoint | `http://localhost:11434/v1/chat/completions` |
| `OLLAMA_MODEL` | Model installed in Ollama | `llama3.2` |
| `OPENAI_API_KEY` | Server-side key when `AI_PROVIDER=openai` | Required only for cloud OpenAI |
| `OPENAI_MODEL` | Cloud model name | `gpt-4o-mini` |
| `OPENAI_BASE_URL` | Optional OpenAI-compatible base URL or full endpoint | `https://api.openai.com/v1/chat/completions` |

### Sample `.env` Setup:

#### 1. Local MongoDB:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/forma-ai
FRONTEND_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
DB_RETRY_INTERVAL_MS=15000
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434/v1/chat/completions
OLLAMA_MODEL=llama3.2

# To use a cloud OpenAI-compatible provider instead:
# AI_PROVIDER=openai
# OPENAI_API_KEY=your_key_here
# OPENAI_MODEL=gpt-4o-mini
# OPENAI_BASE_URL=https://api.openai.com/v1/chat/completions
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
| **POST** | `/api/ai/extract` | `rateLimit` (10 req/min default) | AI field extraction from natural language (local Ollama by default) | `200`, `400`, `429`, `502`, `503`, or `504` |
| **POST** | `/api/ai/parse-resume` | `resumeRateLimit` (3 req/min default) | In-memory PDF/DOCX text extraction and AI resume profile suggestions | `200`, `400`, `413`, `415`, `422`, `429`, `502`, `503`, or `504` |

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

The backend sends a structured extraction prompt to the configured provider: local Ollama by default, or an OpenAI-compatible Chat Completions endpoint when configured. The response is parsed and normalized against the allowlisted insurance-claim fields. Unknown fields and unsupported incident types are discarded. Unknown values are omitted instead of fabricated. The UI must let the user review and correct extracted values before submission.

If no provider key is configured, the endpoint returns HTTP `503` with `AI_SERVICE_NOT_CONFIGURED`. Provider failures return safe errors without forwarding the provider's raw response body. Request text is limited to 10,000 characters.

### 4. AI Resume Parser (`POST /api/ai/parse-resume`)
Send one file as multipart/form-data using the field name `resume`. PDF and DOCX are supported; legacy `.doc` is rejected. The upload is held in memory, limited to 10 MB, checked against its file signature, and not saved to disk or MongoDB by the parser. Extracted text is bounded before it is sent to the configured AI provider using the internal `resume-profile` schema. The response contains `name`, `email`, `role`, `experience`, `education`, `skills`, and `summary`; these are suggestions and must be reviewed.

The built-in PDF text reader is intentionally lightweight and supports many text-based PDFs, not every PDF encoding/layout. Scanned/image-only PDFs require OCR and return `422 NO_READABLE_TEXT`. Complex PDFs with custom font encodings, encrypted documents, malformed archives, or documents that yield no usable text may fail safely. For production use, consider replacing the lightweight PDF reader with a maintained PDF extraction library and adding malware scanning/OCR as needed.

Example frontend usage is implemented in `frontend/src/services/aiService.js` via `parseResume(file)`. The route applies a separate in-memory rate limit (3 requests per 60 seconds by default), sets `Cache-Control: no-store`, and does not persist the source document.

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
- In-memory rate limiting (`middleware/rateLimit.js`) is active on `POST /api/ai/extract` (default 10 requests / 60 seconds per IP) and `POST /api/ai/parse-resume` (default 3 requests / 60 seconds per IP), returning standard `RateLimit-*` headers and `429` status.
- Add distributed rate limiting (e.g., Redis-backed) before scaling to multi-instance deployments.
- Add JWT or session-based authentication before deploying to production.
- Add authentication/authorization before exposing saved submissions or forms in production.
- Request payloads are limited to 1MB; extraction text input is capped at 10,000 characters.
- Responses on sensitive AI routes set `Cache-Control: no-store`.
- Maintain strict TLS verification for MongoDB Atlas and keep all secrets in `.env` only.


## Authentication (Phase 7)

The API exposes `/api/auth/register`, `/api/auth/login`, and `/api/auth/me`. Passwords are hashed with Node.js `scrypt` and random salts. Tokens are signed with HMAC-SHA256, expire after `AUTH_TOKEN_TTL_SECONDS`, and are accepted through the `Authorization: Bearer` header. Set `AUTH_TOKEN_SECRET` to a unique random value of at least 32 characters. Public registration only creates the `user` role.

Form creation/deletion requires authentication; delete operations are scoped to the form creator unless the user role is `admin`. Submission reads require authentication and are scoped to `ownerId` unless admin. Public form submission remains enabled; if a valid bearer token is supplied, the new submission is assigned to that user. Anonymous submissions are stored with no owner and cannot be retrieved using the protected read endpoint.

The in-memory auth rate limiter is for local/single-instance use only. The frontend stores bearer tokens in `sessionStorage`; for sensitive production deployments, review an HttpOnly-cookie session approach and CSRF protection.
