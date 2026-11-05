# 🧪 API Testing Guide — Forma-AI

> **Local Base URL:** `http://localhost:5000`  
> **Live Base URL:** [https://forma-ai-qut7.onrender.com](https://forma-ai-qut7.onrender.com)  
> **GitHub:** [chandrusm171-ux/Forma-AI](https://github.com/chandrusm171-ux/Forma-AI)

---

## Table of Contents

- [Base URLs](#base-urls)
- [Authentication](#authentication)
- [Rate Limits](#rate-limits)
- [Endpoint Reference](#endpoint-reference)
- [Auth Endpoints](#auth-endpoints)
- [Health Endpoints](#health-endpoints)
- [Form Endpoints](#form-endpoints)
- [Submission Endpoints](#submission-endpoints)
- [AI Endpoints](#ai-endpoints)
- [Error Reference](#error-reference)

---

## Base URLs

| Environment | URL                                                                 |
|-------------|---------------------------------------------------------------------|
| Local Dev   | `http://localhost:5000`                                             |
| Production  | [https://forma-ai-qut7.onrender.com](https://forma-ai-qut7.onrender.com) |

Set a shell variable for convenience:

```bash
# Local
BASE=http://localhost:5000

# Production
BASE=https://forma-ai-qut7.onrender.com
```

---

## Authentication

Protected routes require a **Bearer JWT token** in the `Authorization` header:

```
Authorization: Bearer <token>
```

Obtain a token via `POST /api/auth/login` and store it for subsequent requests.

---

## Rate Limits

| Route Group         | Limit       | Window   |
|---------------------|-------------|----------|
| Auth (`/api/auth/*`)| 8 requests  | 1 minute |
| AI Extract          | 10 requests | 1 minute |
| Resume Parse        | 3 requests  | 1 minute |

Exceeding the limit returns `429 Too Many Requests`.

---

## Endpoint Reference

| #  | Method | Path                      | Auth Required | Description                        |
|----|--------|---------------------------|---------------|------------------------------------|
| 1  | POST   | `/api/auth/register`      | ❌            | Register a new user                |
| 2  | POST   | `/api/auth/login`         | ❌            | Login and receive JWT              |
| 3  | GET    | `/api/auth/me`            | ✅            | Get current authenticated user     |
| 4  | GET    | `/api/health`             | ❌            | Liveness probe                     |
| 5  | GET    | `/api/ready`              | ❌            | Readiness probe (DB check)         |
| 6  | POST   | `/api/forms`              | ✅            | Create a new dynamic form          |
| 7  | GET    | `/api/forms`              | ❌            | List all forms                     |
| 8  | GET    | `/api/forms/:id`          | ❌            | Get a single form by ID            |
| 9  | DELETE | `/api/forms/:id`          | ✅            | Delete a form (owner or admin)     |
| 10 | POST   | `/api/submissions`        | ❌ (optional) | Submit form data                   |
| 11 | GET    | `/api/submissions`        | ✅            | List user's submissions (paginated)|
| 12 | GET    | `/api/submissions/:id`    | ✅            | Get a single submission            |
| 13 | POST   | `/api/ai/extract`         | ❌            | AI field extraction from text      |
| 14 | POST   | `/api/ai/parse-resume`    | ❌            | Parse resume PDF/DOCX              |
| 15 | GET    | `/api/ai/models`          | ❌            | List available AI models (debug)   |

---

## Auth Endpoints

### 1. Register

```bash
curl -X POST $BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chandru SM",
    "email": "chandru@example.com",
    "password": "mypass123"
  }'
```

**Request Body:**

```json
{
  "name": "Chandru SM",
  "email": "chandru@example.com",
  "password": "mypass123"
}
```

**Success Response `201`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64ab12cd34ef5678ab901234",
    "name": "Chandru SM",
    "email": "chandru@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

| Status | Code                  | Reason                       |
|--------|-----------------------|------------------------------|
| 400    | `WEAK_PASSWORD`       | Password shorter than 6 chars|
| 409    | `EMAIL_EXISTS`        | Email already registered     |
| 503    | `DATABASE_UNAVAILABLE`| MongoDB not connected        |

---

### 2. Login

```bash
curl -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "chandru@example.com",
    "password": "mypass123"
  }'
```

**Success Response `200`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64ab12cd34ef5678ab901234",
    "name": "Chandru SM",
    "email": "chandru@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

| Status | Code               | Reason                   |
|--------|--------------------|--------------------------|
| 401    | `INVALID_CREDENTIALS` | Wrong email or password |
| 503    | `DATABASE_UNAVAILABLE` | MongoDB not connected  |

---

### 3. Get Current User

```bash
curl $BASE/api/auth/me \
  -H "Authorization: Bearer <token>"
```

**Success Response `200`:**

```json
{
  "_id": "64ab12cd34ef5678ab901234",
  "name": "Chandru SM",
  "email": "chandru@example.com",
  "role": "user",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

**Error Responses:**

| Status | Reason              |
|--------|---------------------|
| 401    | Missing/invalid token |

---

## Health Endpoints

### 4. Liveness Check

```bash
curl $BASE/api/health
```

**Response `200`:**

```json
{
  "status": "ok",
  "timestamp": "2025-11-05T10:00:00.000Z"
}
```

---

### 5. Readiness Check

```bash
curl $BASE/api/ready
```

**Response `200` (DB connected):**

```json
{
  "status": "ready",
  "db": "connected"
}
```

**Response `503` (DB not connected):**

```json
{
  "status": "not ready",
  "db": "disconnected"
}
```

---

## Form Endpoints

### 6. Create Form

```bash
curl -X POST $BASE/api/forms \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Job Application Form",
    "description": "Apply for open positions",
    "fields": [
      {
        "id": "fullName",
        "type": "text",
        "label": "Full Name",
        "required": true
      },
      {
        "id": "email",
        "type": "email",
        "label": "Email Address",
        "required": true
      }
    ]
  }'
```

**Success Response `201`:**

```json
{
  "_id": "64ab77cc88dd1122ef334455",
  "title": "Job Application Form",
  "description": "Apply for open positions",
  "fields": [...],
  "ownerId": "64ab12cd34ef5678ab901234",
  "createdAt": "2025-01-20T09:00:00.000Z"
}
```

---

### 7. List Forms

```bash
curl $BASE/api/forms
```

**Success Response `200`:**

```json
[
  {
    "_id": "64ab77cc88dd1122ef334455",
    "title": "Job Application Form",
    "description": "Apply for open positions",
    "fields": [...],
    "createdAt": "2025-01-20T09:00:00.000Z"
  }
]
```

---

### 8. Get Form by ID

```bash
curl $BASE/api/forms/64ab77cc88dd1122ef334455
```

**Success Response `200`:** Full form object  
**Error `404`:** Form not found

---

### 9. Delete Form

```bash
curl -X DELETE $BASE/api/forms/64ab77cc88dd1122ef334455 \
  -H "Authorization: Bearer <token>"
```

**Success Response `200`:**

```json
{ "message": "Form deleted successfully" }
```

**Error Responses:**

| Status | Reason                     |
|--------|----------------------------|
| 403    | Not the owner or admin     |
| 404    | Form not found             |

---

## Submission Endpoints

### 10. Submit Form

```bash
curl -X POST $BASE/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "formId": "job-application",
    "formTitle": "Job Application Form",
    "data": {
      "fullName": "Vishal Kumar",
      "email": "vishal@example.com",
      "position": "Frontend Developer"
    }
  }'
```

> **Note:** Include `Authorization: Bearer <token>` to associate the submission with a user. Omit for anonymous submissions.

**Success Response `201`:**

```json
{
  "_id": "64ab99ff11cc2244bb556677",
  "formId": "job-application",
  "formTitle": "Job Application Form",
  "data": { "fullName": "Vishal Kumar", "email": "vishal@example.com" },
  "ownerId": "64ab12cd34ef5678ab901234",
  "createdAt": "2025-01-20T14:45:00.000Z"
}
```

---

### 11. List My Submissions

```bash
curl "$BASE/api/submissions?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters:**

| Param   | Default | Description              |
|---------|---------|--------------------------|
| `page`  | 1       | Page number              |
| `limit` | 10      | Results per page (max 50)|

**Success Response `200`:**

```json
{
  "submissions": [...],
  "total": 25,
  "page": 1,
  "pages": 3
}
```

---

### 12. Get Submission by ID

```bash
curl $BASE/api/submissions/64ab99ff11cc2244bb556677 \
  -H "Authorization: Bearer <token>"
```

**Success Response `200`:** Full submission object  
**Error `403`:** Not the owner or admin  
**Error `404`:** Submission not found

---

## AI Endpoints

### 13. AI Field Extraction

Extracts structured form fields from free-form text using the Groq AI model.

```bash
curl -X POST $BASE/api/ai/extract \
  -H "Content-Type: application/json" \
  -d '{
    "text": "My name is Vishal Kumar, I am 24 years old, my email is vishal@example.com and I want to apply for the Frontend Developer position.",
    "formType": "job-application"
  }'
```

**Success Response `200`:**

```json
{
  "extracted": {
    "fullName": "Vishal Kumar",
    "age": "24",
    "email": "vishal@example.com",
    "position": "Frontend Developer"
  }
}
```

**Error Responses:**

| Status | Code                    | Reason                       |
|--------|-------------------------|------------------------------|
| 429    | —                       | Rate limit exceeded (10/min) |
| 503    | `AI_PROVIDER_UNREACHABLE` | Groq API not reachable     |
| 500    | `AI_EXTRACTION_FAILED`  | Model returned invalid data  |

---

### 14. Resume Parse

Parses a resume PDF or DOCX file and extracts structured data.

```bash
curl -X POST $BASE/api/ai/parse-resume \
  -F "resume=@/path/to/resume.docx"
```

> **Important:** Use DOCX or Word-exported PDFs. Canva/Adobe PDFs with custom font encoding cannot be parsed — text will appear garbled.

**Success Response `200`:**

```json
{
  "extracted": {
    "fullName": "Chandru SM",
    "email": "chandru@example.com",
    "phone": "+91 98765 43210",
    "skills": ["React", "Node.js", "MongoDB"],
    "experience": "2 years"
  }
}
```

**Error Responses:**

| Status | Code                      | Reason                              |
|--------|---------------------------|-------------------------------------|
| 400    | `NO_FILE`                 | No file attached                    |
| 400    | `UNREADABLE_DOCUMENT`     | PDF encoding not parseable          |
| 429    | —                         | Rate limit exceeded (3/min)         |
| 503    | `AI_PROVIDER_UNREACHABLE` | Groq API unavailable                |

---

### 15. List AI Models (Debug)

```bash
curl $BASE/api/ai/models
```

Returns the list of models available via the configured Groq API key. Used for debugging model availability.

---

## Error Reference

| HTTP Status | Error Code                | Meaning                                       |
|-------------|---------------------------|-----------------------------------------------|
| 400         | `WEAK_PASSWORD`           | Password must be at least 6 characters        |
| 400         | `NO_FILE`                 | Multipart file missing from request           |
| 400         | `UNREADABLE_DOCUMENT`     | File text could not be parsed                 |
| 401         | `UNAUTHORIZED`            | Missing or expired JWT token                  |
| 403         | `FORBIDDEN`               | Authenticated but not the resource owner      |
| 404         | `NOT_FOUND`               | Resource does not exist                       |
| 409         | `EMAIL_EXISTS`            | Email already registered                      |
| 429         | `RATE_LIMIT_EXCEEDED`     | Too many requests in the time window          |
| 500         | `AI_EXTRACTION_FAILED`    | AI model returned invalid / empty response    |
| 503         | `DATABASE_UNAVAILABLE`    | MongoDB connection not established            |
| 503         | `AI_PROVIDER_UNREACHABLE` | Groq API endpoint not reachable               |

---

## Testing with Postman / Thunder Client

1. Import the base URL as an environment variable
2. Create a collection: **Forma-AI API**
3. Add a folder per group: Auth, Forms, Submissions, AI
4. After login, set `token` environment variable from the response body
5. Use `{{token}}` in the Authorization header: `Bearer {{token}}`

---

*Last updated: November 2025 — Forma-AI v1.0*

