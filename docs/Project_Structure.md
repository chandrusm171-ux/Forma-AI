# Project Structure

## Overview
Forma AI is an AI-assisted dynamic form and document intelligence platform. This release incorporates schema-aware local Ollama & OpenAI-compatible extraction, dynamic multi-step form rendering, resume profile parsing, secure user authentication with JWT, submission history tracking, real-time collaboration with Socket.IO and Yjs, in-memory rate limiting, and an accessible modern UI component system.

```text
Forma-AI/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI (Backend tests, Frontend lint, Frontend build)
├── frontend/                  # React 19 + Vite client application
│   ├── src/
│   │   ├── components/        # UI components, layout, dynamic form controls, and AI inputs
│   │   ├── pages/             # Home, FormPage, ResumePage, AuthPage, SubmissionHistory
│   │   ├── schemas/           # Client-side workflow form schemas
│   │   ├── services/          # API, Auth, AI, and Form HTTP services
│   │   └── store/             # Zustand state management
├── backend/                   # Express 5 API, MongoDB, Socket.IO + Yjs collaboration, Auth & AI
│   ├── config/                # Database connection & retry handling
│   ├── controllers/           # Health, readiness, and endpoint handlers
│   ├── middleware/            # Authenticate, rate limiting, and database guards
│   ├── models/                # User, Form, and Submission Mongoose models
│   ├── realtime/              # Socket.IO + Yjs CRDT real-time collaboration server
│   ├── routes/                # Auth, AI, Form, Submission, and Health API routers
│   ├── services/              # AI Chat Completions extraction provider
│   ├── utils/                 # Auth tokens, passwords, schema & upload validators
│   └── tests/                 # Unit tests (Auth, AI, Rate limiting, Realtime, Uploads)
├── docs/                      # Architecture, setup, API contracts, and release notes
└── README.md                  # Comprehensive root documentation & onboarding guide
```

## Team Responsibilities

| Member | Role | Responsibilities |
|---|---|---|
| Chandru | Team Lead | Architecture, AI extraction, backend APIs, real-time collaboration |
| Khushi | Backend Developer | Express APIs, validation schemas, database models & tests |
| Vishal | Frontend Support / Docs | UI component library, responsive styling, auth/submission pages, documentation & testing |

## Main Capabilities

- **User Authentication & Session Management**: Secure registration, login, and `/me` profile endpoints with Scrypt password hashing, JWT bearer tokens, in-memory rate limiting, and minimum 6-character password rules.
- **Schema-Driven Dynamic Forms**: Dynamic field rendering (`TextField`, `SelectField`, `CheckboxField`, `TextareaField`, `ConditionalField`), client-side validation, live conditional visibility, and progress tracking.
- **AI-Assisted Field Extraction**: Natural language extraction via local Ollama (`llama3.2`) or OpenAI-compatible Chat Completions, with type-safe normalization and bounding.
- **Resume Parsing**: In-memory PDF/DOCX file uploads, file signature verification, bounded text extraction, and schema-driven candidate profile prefilling.
- **Submission History**: Persisted submissions in MongoDB tied to authenticated user accounts (`/submissions`), with server-side pagination, search filtering, and submission detail modal.
- **Real-Time Collaboration**: Collaborative form editing powered by Socket.IO and Yjs CRDT document synchronization with room isolation and cursor updates.
- **Database Resilience**: MongoDB persistence with automatic reconnect retries, `/api/health` liveness checks, `/api/ready` readiness checks, and `requireDatabase` guards.
- **API Security & Rate Limiting**: In-memory fixed-window rate limiters on authentication, AI extraction, and resume parsing; bounded multipart uploads; file signature checks; request size guards; and `Cache-Control: no-store`.
- **Reusable UI Component System**: Modern design system in `frontend/src/components/ui/` (`EmptyState`, `ErrorState`, `Button`, `Input`, `Loading`, `ProgressBar`, `Skeleton`, `Toast`, `AiBadge`).
- **Automated CI/CD**: GitHub Actions workflow executing backend test suite, frontend ESLint checks, and Vite production bundle builds.

## Important Implementation Notes

- **Environment Configuration**: `backend/.env` requires `AUTH_TOKEN_SECRET` (at least 32 characters) for authentication and token signing. `frontend/.env` specifies `VITE_API_BASE_URL`.
- **Schema Parity**: Ensure frontend schemas in `frontend/src/schemas/formSchema.js` stay aligned with backend `SCHEMA_CATALOG` in `backend/services/aiExtractionService.js`.
- **Password Policy**: Passwords must contain at least 6 characters (up to 128 characters).
- **Rate Limiting**: Rate limiting is currently in-memory per-instance; use Redis for multi-instance deployments.
- **Security**: Never commit `.env` files, production credentials, or dependency archives.
