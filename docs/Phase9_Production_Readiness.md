# Phase 9 — Production Deployment & Final Security Hardening

## Changes in this phase
- Socket.IO connections now require a valid signed authentication token.
- Realtime user identity is derived from the verified token rather than a client-supplied `userId`.
- Realtime tests authenticate clients before joining rooms.
- Release checks and end-to-end verification remain required before production.

## Before submission
1. In `backend`, run `npm ci` and `npm test`.
2. In `frontend`, run `npm ci`, `npm run lint`, and `npm run build`.
3. Start MongoDB and Ollama; verify AI extraction and a saved submission.
4. Sign in as two users and verify submission ownership.
5. Verify realtime clients without a token are rejected.
6. Review environment variables and never commit `.env`.

## Deployment checklist
- Set a unique `AUTH_TOKEN_SECRET` (at least 32 bytes) in the host's secret manager.
- Configure `MONGODB_URI`, `FRONTEND_ORIGIN`, `AI_PROVIDER`, and the correct AI endpoint/model.
- For local Ollama, ensure the backend can reach the Ollama host; `localhost` only works when both run on the same machine.
- Use HTTPS in production.
- Configure a shared rate-limit store before scaling to multiple backend instances.
- Define retention/deletion rules for submissions and resume data.
- Review Socket.IO room authorization: token authentication establishes identity, but room-level access should also be bound to a persisted collaboration/resource permission before enabling sensitive shared documents in production.

## Known limitations
This phase adds a Socket.IO authentication gate but does not by itself make every collaborative room private. Room membership is still based on a room identifier; production collaboration must validate room access against a database record or disable collaboration until that is implemented. Live database/provider tests and deployment smoke tests must be run in the target environment.


## Resume parser and profile prefill hotfix

- Removed the API client's forced global `Content-Type: application/json` header. Axios/browser now sets the correct multipart boundary for resume `FormData` uploads, allowing `/api/ai/parse-resume` to read the file.
- Increased the resume upload request timeout to 120 seconds to align with the backend AI provider's extraction timeout.
- The resume profile action now passes parsed profile data through React Router navigation state. The job application page maps candidate name, email, experience, and role into the corresponding job-application fields.
