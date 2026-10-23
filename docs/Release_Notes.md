# Blended Modern Release Notes

## Included

- Merged the latest team project with the previously reviewed Ollama extraction implementation.
- Enabled five schema-aware workflows in the UI and AI service.
- Added type-safe output normalization and exact enum/date validation.
- Updated the AI extraction success message for all workflow types.
- Redesigned Home and Form pages with a responsive visual system, animated ambient gradients, floating preview elements, staggered workflow cards, hover transitions, and reduced-motion support.
- Added explicit messaging that resume parsing is planned but not implemented in this release.
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
