# Forma-AI — Next Steps

## Current milestone: Phase 3 — Local AI integration and end-to-end verification

The current backend supports OpenAI-compatible Chat Completions and can use Ollama locally. The base URL normalizer turns `http://localhost:11434/v1` into `http://localhost:11434/v1/chat/completions`. Ollama is local and does not require paid OpenAI API credits.

### Step 1 — Configure Ollama

In the private `backend/.env`, configure:

```env
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_API_KEY=ollama-local
OPENAI_MODEL=llama3.2
```

Keep the existing MongoDB URI and other variables. Do not commit or share `.env`.

### Step 2 — Run backend tests and server

```powershell
cd backend
npm test
npm run dev
```

Keep the backend terminal open. Confirm it listens on port 5000. MongoDB should report connected for database-backed tests.

### Step 3 — Test the AI API

Run this from a second PowerShell terminal:

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

Expected: HTTP success and a `success: true` response with supported extracted fields. Model wording and optional fields can vary; the user must review the result.

### Step 4 — Verify the frontend flow

- Start the frontend using `npm run dev` in `frontend/`.
- Open the Form page and enter a short incident description.
- Select Analyze with AI.
- Confirm loading/error feedback works and extracted values prefill the correct fields.
- Confirm the conditional fields update from extracted values.
- Correct any AI mistakes manually before submission.

### Step 5 — Verify persistence

- Submit the completed insurance form.
- Confirm the API returns a successful submission response.
- Confirm the saved submission can be retrieved through the backend API.
- Test a missing/invalid field and verify validation messages.

### Step 6 — Frontend quality checks

```powershell
cd frontend
npm run lint
npm run build
```

Fix any errors before opening a pull request.


## Troubleshooting

- **`AI_PROVIDER_REJECTED`**: confirm Ollama is running, the model exists (`ollama list`), and the configured base URL is `http://localhost:11434/v1`.
- **Connection refused**: start Ollama and test `http://localhost:11434/v1/chat/completions`.
- **Invalid JSON response**: inspect the returned model content and improve the extraction prompt/normalizer without accepting unsupported fields.
- **MongoDB unavailable**: check the Atlas URI, database user/password, and network access. Keep TLS verification enabled.
- **Frontend cannot reach backend**: confirm port 5000 is running and the frontend API base URL is correct.

## Later milestones

1. Improve structured extraction reliability and add an integration test against a running local Ollama instance.
2. Add authentication/authorization and rate limiting before any public deployment.
3. Implement resume parsing as a separate feature with secure file validation and document text extraction.
4. Prepare deployment configuration and secret management only after local end-to-end verification is complete.
