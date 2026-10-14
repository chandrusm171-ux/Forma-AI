# Backend Setup and API Contract

## Stack & Technologies

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database / ODM**: MongoDB with Mongoose 9 (supports Local MongoDB and MongoDB Atlas)
- **CORS**: Configurable origin allowlist (`FRONTEND_ORIGIN`)
- **Testing**: Node.js built-in test runner (`node --test`)

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

### Sample `.env` Setup:

#### 1. Local MongoDB:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/forma-ai
FRONTEND_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
DB_RETRY_INTERVAL_MS=15000
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
| **POST** | `/api/ai/extract` | None | AI field extraction from natural language (contract placeholder) | `501 Not Implemented` |
| **POST** | `/api/ai/parse-resume` | None | AI resume parsing endpoint (contract placeholder) | `501 Not Implemented` |

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

### 3. AI Extraction Handoff (`POST /api/ai/extract`)
The frontend sends:
```json
{
  "text": "My car was hit from behind on Main Street yesterday.",
  "schemaId": "insurance-claim"
}
```
*Current Behavior*: Returns HTTP `501` with code `AI_SERVICE_NOT_CONFIGURED` until the LangChain / LLM provider integration is wired up.

### 4. AI Resume Parser Handoff (`POST /api/ai/parse-resume`)
Uses `multipart/form-data` with the file field named `resume`.
*Current Behavior*: Returns HTTP `501` with code `AI_SERVICE_NOT_CONFIGURED` until parsing logic is implemented.

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
- Configure proper TLS verification and keep connection credentials in environment variables only.
