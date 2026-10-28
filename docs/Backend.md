# Backend Setup and API Contract

## Stack & Technologies

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database / ODM**: MongoDB with Mongoose 9 (supports Local MongoDB and MongoDB Atlas)
- **Real-Time Collaboration**: Socket.IO 4 & Yjs 13 (CRDT document synchronization)
- **Authentication**: JWT (HMAC-SHA256) & Scrypt password hashing with unique random salts
- **CORS**: Configurable origin allowlist (`FRONTEND_ORIGIN`)
- **Testing**: Node.js built-in test runner (`node --test`)

The AI extraction service uses Node.js `fetch()` with an OpenAI-compatible Chat Completions API. Ollama is the default local provider, so no paid API key is needed for local development. The provider boundary is isolated in `services/aiExtractionService.js`.

---

## Directory & File Structure

```text
backend/
├── app.js                          # Express app setup, middleware, error handlers, and route mounts
├── server.js                       # Starts HTTP + Socket.IO server, MongoDB retry loop, graceful shutdown
├── config/
│   └── db.js                        # Connects to MongoDB with graceful error handling & reconnection
├── controllers/
│   ├── healthController.js          # Liveness status and DB connectivity
│   └── readinessController.js       # Readiness check (503 when MongoDB is disconnected)
├── middleware/
│   ├── authenticate.js              # Bearer token verification and req.user attachment
│   ├── rateLimit.js                 # In-memory fixed-window rate limiter for sensitive endpoints
│   └── requireDatabase.js           # Guard middleware returning 503 when MongoDB is not connected
├── models/
│   ├── Form.js                      # Schema & model for dynamic form definitions
│   ├── Submission.js                # Schema & model for persisted form responses (supports ownerId)
│   └── User.js                      # Schema & model for registered accounts (email, passwordHash, role)
├── realtime/
│   └── socketServer.js              # Socket.IO + Yjs collaboration server (rooms, steps, cursor updates)
├── routes/
│   ├── index.js                     # Root API router (/api)
│   ├── authRoutes.js                # /api/auth routes (register, login, me)
│   ├── aiRoutes.js                  # /api/ai endpoints (extract, parse-resume)
│   ├── formRoutes.js                # /api/forms CRUD routes (protected by requireDatabase)
│   ├── healthRoutes.js              # /api/health route
│   └── submissionRoutes.js          # /api/submissions routes (protected by requireDatabase & authenticate)
├── services/
│   └── aiExtractionService.js       # AI Chat Completions extraction provider & data normalizer
├── utils/
│   ├── authTokens.js                # JWT signing (HMAC-SHA256) and verification utilities
│   ├── extractDocumentText.js       # PDF and DOCX text extraction parser
│   ├── passwords.js                 # Scrypt password hashing and verification
│   ├── readResumeUpload.js          # In-memory multipart resume upload reader & validator
│   ├── validateFormSchema.js        # Validates form schema structure, field types, and conditions
│   └── validateSubmissionPayload.js # Validates submission payload (formId, formTitle, data)
├── tests/
│   ├── aiExtraction.test.js         # AI extraction service unit tests (timeout, malformed JSON, provider failure)
│   ├── api.test.js                  # HTTP smoke tests for health, readiness, malformed JSON and 404s
│   ├── auth.test.js                 # Authentication unit tests (register, login, /me, token expiry)
│   ├── documentText.test.js         # PDF/DOCX document text extraction tests
│   ├── rateLimit.test.js            # Rate limiter unit tests (allowance, block, headers, resets)
│   ├── readResumeUpload.test.js     # Resume upload reading and bounds tests
│   ├── realtime.test.js             # Socket.IO & Yjs real-time collaboration tests
│   └── validation.test.js           # Unit tests for schema and submission validators
├── .env.example                     # Environment template
├── .env                             # Local environment variables (never commit)
└── package.json                     # Dependencies & scripts
```

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
| `DB_RETRY_INTERVAL_MS` | Delay between retries after connection failure | `15000` |
| `AUTH_TOKEN_SECRET` | Secret key for signing JWT tokens (min 32 characters) | **Required** (e.g. random 64-char hex string) |
| `AUTH_TOKEN_TTL_SECONDS` | Lifetime of generated auth tokens | `28800` (8 hours) |
| `AUTH_RATE_LIMIT_WINDOW_MS`| Rate limit window for auth routes | `60000` (1 minute) |
| `AUTH_RATE_LIMIT_MAX` | Max auth requests per window per IP | `8` |
| `AI_PROVIDER` | Select `ollama` (default) or `openai` | `ollama` |
| `OLLAMA_BASE_URL` | Ollama base URL or full Chat Completions endpoint | `http://localhost:11434/v1/chat/completions` |
| `OLLAMA_MODEL` | Model installed in Ollama | `llama3.2` |
| `OPENAI_API_KEY` | Server-side key when `AI_PROVIDER=openai` | Required only for cloud OpenAI |
| `OPENAI_MODEL` | Cloud model name | `gpt-4o-mini` |
| `OPENAI_BASE_URL` | Cloud Chat Completions base URL | `https://api.openai.com/v1/chat/completions` |
| `AI_RATE_LIMIT_MAX` | Max AI extract requests per minute | `10` |
| `RESUME_RATE_LIMIT_MAX` | Max resume parse requests per minute | `3` |

---

## API Endpoints & Contract

### Authentication Endpoints (`/api/auth`)

| Method | Path | Middleware | Description | Success Code |
|---|---|---|---|---|
| **POST** | `/api/auth/register` | `authLimiter`, `requireDatabase` | Register new account (name, email, password >= 6 chars) | `201 Created` |
| **POST** | `/api/auth/login` | `authLimiter`, `requireDatabase` | Sign in with email and password | `200 OK` |
| **GET** | `/api/auth/me` | `authenticate`, `requireDatabase` | Retrieve current authenticated user profile | `200 OK` |

#### 1. Register Account (`POST /api/auth/register`)
**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strongPassword123"
}
```
**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "user": {
      "id": "670c7913e8b09088ab123456",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "createdAt": "2026-10-28T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 28800
  }
}
```

#### 2. Sign In (`POST /api/auth/login`)
**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "strongPassword123"
}
```
**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Signed in successfully.",
  "data": {
    "user": {
      "id": "670c7913e8b09088ab123456",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 28800
  }
}
```

---

### Core & Data Endpoints

| Method | Path | Middleware | Description | Success Code |
|---|---|---|---|---|
| **GET** | `/` | None | Basic server heartbeat | `200 OK` |
| **GET** | `/api/health` | None | Liveness endpoint; reports API and MongoDB status | `200 OK` |
| **GET** | `/api/ready` | None | Readiness endpoint; indicates whether DB-backed operations can run | `200 OK` or `503` |
| **POST** | `/api/forms` | `authenticate`, `requireDatabase` | Creates a validated dynamic form schema | `201 Created` |
| **GET** | `/api/forms` | `requireDatabase` | Retrieves list of all saved forms | `200 OK` |
| **GET** | `/api/forms/:id` | `requireDatabase` | Retrieves a specific form schema by its ID | `200 OK` |
| **DELETE** | `/api/forms/:id` | `authenticate`, `requireDatabase` | Deletes a form schema by its ID (owner or admin) | `200 OK` |
| **POST** | `/api/submissions` | `requireDatabase` | Validates & persists submission (attaches `ownerId` if authenticated) | `201 Created` |
| **GET** | `/api/submissions` | `authenticate`, `requireDatabase` | Paginated submission history for authenticated user | `200 OK` |
| **GET** | `/api/submissions/:id`| `authenticate`, `requireDatabase` | Retrieves full submission by ID (scoped to owner/admin) | `200 OK` |
| **POST** | `/api/ai/extract` | `rateLimit` (10 req/min) | Natural language field extraction via Ollama or OpenAI | `200 OK` |
| **POST** | `/api/ai/parse-resume` | `resumeRateLimit` (3 req/min) | PDF/DOCX text extraction & resume profile suggestion | `200 OK` |

---

## Real-Time Collaboration (Socket.IO & Yjs)

The HTTP server in `server.js` initializes a Socket.IO collaboration server attached to `backend/realtime/socketServer.js`.

- **Rooms**: Clients join form-scoped rooms using `join-room` with `{ room, userId, userName }`.
- **Yjs CRDT Document Sync**:
  - `sync-step-1`: Initiates document vector state exchange.
  - `sync-step-2`: Exchanges missing document updates.
  - `sync-update`: Broadcasts atomic document updates to all other peers in the room.
- **Cursor Awareness**: `cursor-update` broadcasts live client cursor positions and selections.
- **Presence**: `user-joined` and `user-left` events inform peers when collaborators enter or exit a room.

---

## Running the Backend

```powershell
cd backend
npm install        # Install dependencies
npm run dev        # Run with nodemon on port 5000
npm test           # Run unit test suite
```
