# Blended Modern Release Notes

## Included

- Merged the latest team project with the previously reviewed Ollama extraction implementation.
- Enabled five schema-aware workflows in the UI and AI service.
- Added type-safe output normalization and exact enum/date validation.
- Updated the AI extraction success message for all workflow types.
- Redesigned Home and Form pages with a responsive visual system, animated ambient gradients, floating preview elements, staggered workflow cards, hover transitions, and reduced-motion support.
- Implemented resume parsing for text-based PDF and DOCX uploads using bounded in-memory processing and schema-aware AI extraction.
- Added upload size limits, file signature checks, dedicated resume parsing rate limiting, and `Cache-Control: no-store`.
- Added document extraction and multipart upload unit tests; legacy `.doc` and scanned/image-only PDF files return clear errors.
- Updated setup, architecture, frontend, backend, and next-step documentation.
- Corrected the root `.gitignore` dependency entry and removed the unnecessary root lockfile.

## Checks performed in the build environment

- Backend tests: **20 passed, 0 failed**.
- Frontend ESLint: **passed**.
- All five frontend schemas pass the backend schema validator.
- All five frontend schema IDs and field keys align with the backend AI schema catalog.
- Production Vite build could not be verified in the Linux build environment because the uploaded `node_modules` contained a platform-specific/missing Rolldown native optional binding. Run `npm ci` and `npm run build` on Windows to install the correct platform dependencies and verify the production build.
- Live Ollama extraction and MongoDB persistence still require testing on the user's computer.

## Security

This ZIP excludes `.git`, actual `.env` files, `node_modules`, and build output. Create `backend/.env` locally from `.env.example` and add the correct MongoDB URI. Rotate any credentials previously included in a screenshot or archive.


## Phase 4 — Security and reliability update

- Added an in-memory, configurable rate limiter to `POST /api/ai/extract`.
- Added standard rate-limit response headers and structured HTTP 429 errors.
- Added tests for timeout, unavailable provider, malformed model JSON, and rate-limit behavior.
- Added `Cache-Control: no-store` to AI extraction responses.
- Added GitHub Actions CI for backend tests, frontend lint, and frontend build.
- Fixed two existing frontend lint errors.
- Authentication/authorization for stored forms and submissions remains a required production blocker; the rate limiter is per-process and is not a distributed quota.

---

## Day 16 — Visual Overhaul & Documentation Refresh

- **UI Aesthetics Upgrade**:
  - Replaced browser default typography with paired Google Fonts: **Outfit** (headings, bold modern display) and **Inter** (clean readable body).
  - Elevated palette from default blue to an indigo-violet theme (`--color-primary: #4f46e5`, `--color-accent: #7c3aed`).
  - Implemented dynamic CSS keyframes: `gradientShimmer` on the hero display title, `glowPulse` on active AI MagicInput inference states, and `badgeGlow` behind the navigation badge.
  - Enhanced card glassmorphism with layered blur, subtle translucent border gradients, and elevation depth shadows (`--shadow-glow`).
  - Added animated progress bar on multi-step forms and upgraded input focus rings (`0 0 0 4px rgba(79, 70, 229, 0.15)`).
- **Comprehensive Documentation Refresh**:
  - Rewrote root `README.md` with complete project overview, feature matrix, full directory tree, and 5-step local setup guide.
  - Updated `Backend.md` with `rateLimit.js`, all 4 test suites, Day 12–16 milestones, and rate-limit endpoint contract.
  - Updated `Frontend.md` with Zustand store details, design tokens, and UI overhaul specifications.
  - Aligned `Project_Structure.md` with CI workflow, rate limiter, and updated team roles.
  - Updated `Next_Steps.md` reflecting completed Phase 4 security and Day 16 UI polish.


## Phase 6 — Resume parsing

- Replaced the `501 Not Implemented` placeholder for `POST /api/ai/parse-resume` with multipart PDF/DOCX upload handling.
- Added a bounded, dependency-free PDF/DOCX text extraction utility using Node.js built-ins.
- Added an internal `resume-profile` extraction schema without exposing it as a sixth starter workflow.
- Normalizes extracted profile fields and splits skills into a deduplicated array.
- Updated ResumePage copy and file picker to reflect supported file types and explain the OCR limitation.
- Added tests for text extraction, malformed signatures, unsupported formats, upload field checks, and resume schema normalization.

## Phase 6 — Resume parsing (current update)

- Replaced the `501 Not Implemented` placeholder for `POST /api/ai/parse-resume` with multipart PDF/DOCX upload handling.
- Added bounded in-memory upload processing (10 MB maximum), file signature validation, and a separate configurable rate limit (3 requests per 60 seconds by default).
- Added lightweight text extraction for text-based PDFs and DOCX documents using Node.js built-ins, without adding runtime dependencies.
- Added an internal `resume-profile` schema and normalized candidate fields: name, email, role, experience, education, skills, and summary.
- Updated the Resume page to call the live endpoint and clearly communicate supported file formats, privacy handling, and the OCR limitation.
- Added unit tests for PDF/DOCX text extraction, malformed file signatures, unsupported formats, upload field validation, and resume schema normalization.
- 32 focused backend unit tests pass in the available environment. The API integration test file could not be executed in this environment because project dependencies (including Express) were not installed; run `npm ci` then `npm test` locally/CI.
