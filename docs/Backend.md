# Backend Setup and API Contract

## Stack and folders

- Node.js + Express API
- Mongoose + MongoDB Atlas
- `config/db.js`: connects to MongoDB without terminating the HTTP server if Atlas is unavailable.
- `controllers/healthController.js`: reports API and database state.
- `models/`: form definitions and form submissions.
- `routes/`: health, form, submission, and AI contract routes.
- `utils/`: schema and submission payload validation.
- `tests/`: Node's built-in test runner tests for validation utilities.

## Setup

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Set `MONGODB_URI` in `.env` to the URI copied from Atlas. Never commit `.env`. `FRONTEND_ORIGIN` is a comma-separated allowlist of frontend origins.

```powershell
npm run dev
npm test
```

## API endpoints

| Method | Path | Behavior |
|---|---|---|
| GET | `/` | Basic server response |
| GET | `/api/health` | API liveness and database readiness |
| POST | `/api/forms` | Create a validated form schema |
| GET | `/api/forms` | List saved form schemas |
| GET | `/api/forms/:id` | Get a saved form schema |
| DELETE | `/api/forms/:id` | Delete a saved form schema |
| POST | `/api/submissions` | Persist a completed form submission |
| GET | `/api/submissions/:id` | Retrieve a submission by ID |
| POST | `/api/ai/extract` | Reserved endpoint; currently responds with `501 AI_SERVICE_NOT_CONFIGURED` |
| POST | `/api/ai/parse-resume` | Reserved endpoint; currently responds with `501 AI_SERVICE_NOT_CONFIGURED` |

### Submission request

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

The API responds with HTTP `201` and a generated submission ID when MongoDB is connected. If MongoDB is disconnected, it returns HTTP `503` and does not claim that the submission was saved.

### Health response

`GET /api/health` returns `status: "ready"` when the database is connected and `status: "degraded"` when the HTTP API is running but MongoDB is unavailable. This keeps the health badge from confusing API availability with database readiness.

### AI integration handoff

The frontend now calls `/api/ai/extract` with `{ "text": "...", "schemaId": "insurance-claim" }`. The AI implementation owner should replace the current `501` handler with the LangChain/LLM provider, validate its structured output against the selected schema, and return `{ "success": true, "data": { ...fieldValues } }`.

Resume parsing uses multipart form data with the file field name `resume` at `/api/ai/parse-resume`. The route is a placeholder until the parser and upload limits are implemented.

## Security status

This is a development MVP without authentication or role-based access control. Before deployment, add authorization, rate limiting, request audit policy, data retention rules, and appropriate handling of sensitive submissions. Do not disable TLS certificate verification to work around MongoDB connectivity issues.
