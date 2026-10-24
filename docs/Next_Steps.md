# Forma-AI — Next Steps and Phase Roadmap

## Completed baseline

- [x] Five dynamic workflows: Insurance Claim, Patient Intake, Personal Loan, Legal Intake, and Job Application.
- [x] React/Vite frontend, Express API, MongoDB persistence, and Ollama/OpenAI-compatible schema-aware extraction.
- [x] Modern responsive visual system, ambient animation, transitions, and reduced-motion support.
- [x] AI extraction rate limiting, safe provider errors, `Cache-Control: no-store`, and GitHub Actions CI workflow.

## Phase 6 — Resume parsing (implemented; local verification required)

- [x] Implemented `POST /api/ai/parse-resume` for multipart uploads with the field name `resume`.
- [x] Added 10 MB upload size limits, in-memory handling, extension/signature checks, and a dedicated rate limit (3 requests/minute by default).
- [x] Added lightweight text extraction for text-based PDF and DOCX files using Node.js built-ins; the original document is not persisted.
- [x] Added an internal `resume-profile` schema and returns `name`, `email`, `role`, `experience`, `education`, `skills`, and `summary` suggestions.
- [x] Updated ResumePage and the frontend client to use the live endpoint and accurately describe supported formats.
- [x] Added unit tests for PDF/DOCX text extraction, file validation, upload parsing, and resume schema normalization.
- [ ] Verify with real PDF and DOCX files on Windows and the configured Ollama model.
- [ ] Verify malformed, encrypted, unusually encoded, and empty documents fail safely.

### Known limits

- Legacy `.doc` files are not supported; save as PDF or DOCX.
- Scanned/image-only PDFs require OCR and return `NO_READABLE_TEXT`.
- The dependency-free PDF text reader is lightweight and cannot guarantee support for every PDF encoding/layout. Before production, consider replacing it with a maintained PDF parser and adding OCR/malware scanning if required.
- Resume content may contain personal information. The endpoint uses `Cache-Control: no-store` and does not save the file, but data is sent to the configured AI provider. Use a local provider if resume text must stay on the machine/network.

## Phase 7 — Production hardening (not complete; required before multi-user deployment)

- [ ] Add authentication and authorization before exposing stored forms/submissions.
- [ ] Scope each form/submission read and mutation to an authorized user/role.
- [ ] Consider a shared rate-limit store such as Redis before multiple backend instances.
- [ ] Configure trusted proxy handling only behind a known proxy; do not blindly trust forwarded IP headers.
- [ ] Add CSRF protections if cookie-based authentication is introduced.
- [ ] Review data retention, deletion, and access policies for personal/health/financial/legal/resume data.
- [ ] Add request audit logs that exclude secrets and personal document content.
- [ ] Verify secure deployment headers, TLS, and production environment configuration.

## Phase 8 — End-to-end verification and team release

- [ ] In `backend/`, run `npm ci`, `npm test`, then `npm run dev`.
- [ ] Verify `POST /api/ai/extract` against Ollama for all five starter workflow schema IDs.
- [ ] Verify `POST /api/ai/parse-resume` with real text-based PDF and DOCX files.
- [ ] Verify form prefill, conditional fields, and MongoDB submission persistence.
- [ ] In `frontend/`, run `npm ci`, `npm run lint`, `npm run build`, then `npm run dev`.
- [ ] Check keyboard navigation, reduced motion, and responsive layouts at mobile/tablet/desktop sizes.
- [ ] Ensure `.env`, `.env.local`, `.git`, `node_modules`, `dist`, and credentials are excluded from shared ZIPs.
- [ ] Review `git diff --check`, commit source/tests/docs, push the feature branch, and open a pull request into `develop`.

## Configuration

In `backend/.env`:

```env
AI_RATE_LIMIT_WINDOW_MS=60000
AI_RATE_LIMIT_MAX=10
RESUME_RATE_LIMIT_WINDOW_MS=60000
RESUME_RATE_LIMIT_MAX=3
```

These in-memory limits apply per backend process and reset on restart. They are not a substitute for a distributed rate limiter in multi-instance production.

## Git workflow

```powershell
git status
git diff --check
git add .github README.md docs backend frontend
git commit -m "Implement safe PDF and DOCX resume parsing"
git push origin feature/chandru-frontend
```

Before sharing any archive, exclude `.git`, all real `.env` files, dependencies, and build output. Rotate any database password or API key that was included in a screenshot/archive.
