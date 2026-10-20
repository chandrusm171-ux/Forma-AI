# Forma AI — Next Steps

## Phase 3 — Blend and verify the AI workflows

- [ ] Install backend dependencies with `npm ci`.
- [ ] Confirm `ollama list` includes `llama3.2` and the local API responds.
- [ ] Set `AI_PROVIDER=ollama`, `OLLAMA_MODEL=llama3.2`, and the correct `OLLAMA_BASE_URL` in `backend/.env`.
- [ ] Run `npm test` in `backend/`.
- [ ] Start the backend and test `POST /api/ai/extract` for each supported `schemaId`.
- [ ] Start the frontend and test the five workflows from the Home page.
- [ ] Verify AI suggestions prefill only valid fields, and conditional fields respond correctly.
- [ ] Submit each workflow and confirm MongoDB persistence.
- [ ] Run frontend `npm run lint` and `npm run build` on Windows.
- [ ] Test responsive layouts and keyboard focus on mobile, tablet, and desktop widths.

## Included workflows

- `insurance-claim`
- `patient-intake`
- `personal-loan`
- `legal-intake`
- `job-application`

Frontend starter schemas and the backend AI schema catalog must remain aligned. When changing a field, update both definitions and add/adjust tests.

## Phase 4 — Security and reliability

- Add route-level tests for AI success, timeout, malformed model output, unavailable Ollama, and unsupported schema IDs.
- Add rate limiting to AI extraction and cap request size.
- Avoid logging full incident descriptions or other personal data.
- Validate model output against field types, enum options, and date formats before prefill and before persistence.
- Add authentication and authorization before exposing stored forms or submissions to multiple users.
- Add CI checks for backend tests, frontend lint, and frontend build.
- Clearly label AI values as suggestions and require user review.

## Phase 5 — Resume parsing

Resume parsing is intentionally not implemented yet. Before enabling it, add secure upload handling, size limits, MIME/extension checks, file signature validation, PDF/DOC/DOCX text extraction, and tests for malformed or unsafe files. Do not report a successful parse until actual extracted data is returned.

## Phase 6 — Team workflow and deployment

- Review `git status` and `git diff --check`.
- Keep `.env`, `.env.local`, `node_modules`, `dist`, and credentials out of commits and shared ZIPs.
- Commit source, tests, and documentation only.
- Push `feature/chandru-frontend` and open a pull request into `develop`.
- Deploy only after the production environment variables, database access rules, and error handling have been reviewed.

## Git workflow

```powershell
git status
git diff --check
git add README.md docs backend frontend
git commit -m "Blend AI workflows and modernize Forma UI"
git push origin feature/chandru-frontend
```

Before sharing any archive, exclude `.git`, all real `.env` files, dependencies, and build output. If a database password or API key has been shared in a screenshot/archive, rotate it.
