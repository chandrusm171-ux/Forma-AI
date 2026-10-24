# Project Structure

## Overview
Forma AI is an AI-assisted dynamic form engine. This blended release keeps the latest team project as its base and brings in schema-aware local Ollama integration, type-safe extraction, five workflow templates, in-memory rate limiting, automated CI testing, and an upgraded Day 16 modern responsive visual system.

```text
Forma-AI/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI (Backend tests, Frontend lint, Frontend build)
├── frontend/                  # React 19 + Vite dynamic form experience
├── backend/                   # Express 5 API, MongoDB, in-memory rate limiter, AI extraction
├── docs/                      # Architecture, setup, API contracts, and release notes
└── README.md                  # Comprehensive root documentation & onboarding guide
```

## Responsibilities

| Member | Role | Responsibilities |
|---|---|---|
| Chandru | Team Lead | Frontend, database/testing, AI integration |
| Khushi | Backend Developer | Express APIs, validation schemas, and database integration |
| Vishal | Frontend Support / Docs | UI components, styling overhaul, documentation & testing |

## Main capabilities

- **Schema-Driven Forms**: Dynamic field rendering with client-side validation, live conditions, and progress tracking.
- **AI-Assisted Field Extraction**: Natural language processing via local Ollama (`llama3.2`) or OpenAI-compatible Chat Completions.
- **Five Prebuilt Workflows**: Insurance claim, patient intake, personal loan, legal intake, and job application.
- **Human-in-the-Loop Review**: AI-prefilled fields are treated as suggestions that users can inspect and modify before submitting.
- **Database Resilience**: MongoDB persistence with graceful fallback, `/api/health` liveness, `/api/ready` readiness checks, and `requireDatabase` guards.
- **API Security & Rate Limiting**: In-memory fixed-window rate limiter on sensitive endpoints (`POST /api/ai/extract`), request size guards, and `Cache-Control: no-store`.
- **Automated CI/CD**: GitHub Actions workflow executing backend test suite (20 tests), frontend ESLint checks, and production bundle builds.
- **Modern Day 16 UI**: Google Outfit & Inter typography, deep indigo-violet color palette, glassmorphism cards, ambient animated gradients, glow effects, and `prefers-reduced-motion` compliance.

## Important implementation notes

- Keep frontend schemas in `frontend/src/schemas/formSchema.js` aligned with the backend `SCHEMA_CATALOG` in `backend/services/aiExtractionService.js`.
- AI extraction currently supports these five schemas; adding a UI template alone does not automatically add backend extraction support.
- Resume parsing remains unimplemented and explicitly returns a `501 Not Implemented` response.
- Rate limiting is currently in-memory per-process; for multi-instance deployments, use a distributed store such as Redis.
- Preserve TLS verification for MongoDB Atlas. Do not use insecure TLS flags as a workaround.
- Do not commit `.env` files, credentials, dependencies, or build output.
