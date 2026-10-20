# Project Structure

## Overview
Forma AI is an AI-assisted dynamic form engine. This blended release keeps the latest team project as its base and brings in the schema-aware local Ollama integration, type-safe extraction, five workflow templates, and a modern responsive visual system.

```text
Forma-AI/
├── frontend/                 # React + Vite dynamic form experience
├── backend/                  # Express API, MongoDB, AI extraction
├── docs/                     # Architecture, setup, and next steps
└── README.md
```

## Responsibilities

| Member | Role | Responsibilities |
|---|---|---|
| Chandru | Team Lead | Frontend, database/testing, AI integration |
| Khushi | Backend Developer | Express APIs and database integration |
| Vishal | Frontend Support / Docs | UI components, styling, documentation |

## Main capabilities

- Schema-driven forms with client-side validation and conditional fields.
- AI-assisted structured extraction through Ollama by default or an OpenAI-compatible provider.
- Five starter workflows: insurance claim, patient intake, personal loan, legal intake, and job application.
- Reviewable AI-prefilled fields; AI output is not treated as verified fact.
- MongoDB-backed submissions, health/readiness endpoints, and explicit unavailable states.
- Responsive UI with ambient animated gradients, floating workflow preview, staggered cards, hover transitions, and reduced-motion support.

## Important implementation notes

- Keep frontend schemas in `frontend/src/schemas/formSchema.js` aligned with the backend `SCHEMA_CATALOG` in `backend/services/aiExtractionService.js`.
- AI extraction currently supports these five schemas; adding a UI template alone does not automatically add backend extraction support.
- Resume parsing remains unimplemented and explicitly returns a `501` response.
- Preserve TLS verification for MongoDB Atlas. Do not use insecure TLS flags as a workaround.
- Do not commit `.env` files, credentials, dependencies, or build output.
