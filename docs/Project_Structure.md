# Project Structure

## Overview
Forma-AI is an AI-augmented dynamic form engine. This document outlines the repository structure.

```text
Forma-AI/
├── frontend/                 # React 19 + Vite frontend
├── backend/                  # Node.js + Express backend
├── docs/                     # Project documentation
│   ├── Project_Structure.md  # Folder structure & team roles
│   ├── Frontend.md           # React components & UI guide
│   └── Backend.md            # Backend setup & API documentation
└── README.md
```

---

## Directory Roles

- **`frontend/`**: Dynamic form rendering using `react-hook-form`, UI components, and state management.
- **`backend/`**: Express API, MongoDB persistence, and AI extraction provider integration.
- **`docs/`**: Documentation and architecture notes.

---

## Team Responsibilities

| Member | Role | Responsibilities |
|---|---|---|
| **Chandru** | Team Lead | Frontend, Database / Testing, and AI integration |
| **Khushi** | Backend Developer | Express APIs & DB Integration |
| **Vishal** | Frontend & Docs | UI Components, Styling & Documentation |

---

## Current Stabilization Work

- Split Express app configuration into `backend/app.js` and process startup into `backend/server.js`.
- Added separate liveness (`GET /api/health`) and readiness (`GET /api/ready`) checks.
- Added safe initial MongoDB connection retries without disabling TLS verification.
- Added HTTP smoke tests for health, readiness, invalid JSON, and unknown routes.
- MongoDB Atlas TLS alert 80 remains an external connection issue to resolve; database-dependent features stay unavailable until a secure connection succeeds.

## Phase 2 — AI Incident Extraction

- Replaced the `/api/ai/extract` placeholder with an OpenAI-compatible Chat Completions integration using server-side environment configuration.
- Added request limits, supported-schema allowlisting, structured JSON parsing, field/type allowlisting, safe provider errors, and timeout handling.
- The frontend already calls `/api/ai/extract`; extracted values can prefill the insurance claim form after the provider key is configured.
- Resume parsing remains a separate follow-up feature and is explicitly marked as not implemented.

## Daily Progress Tracker

- **Day 1**: Initialized Vite + React 19 environment, planned dynamic form engine and core schemas.
- **Day 2**: Planned reusable component hierarchy, responsive styling strategy, and documentation structure.
- **Day 3**: Implemented and improved reusable React UI components (`Button`, `Input`, `Loading`), integrated layout shells (`Navbar`, `PageLayout`), and verified components locally.
- **Day 4**: Developed main pages (`Home`, `FormPage`, `ResumePage`), integrated reusable React components, and refined styling (spacing scale, Inter font typography, alignment, focus rings, and overall UI consistency).
- **Day 5**: Implemented comprehensive responsive layouts for mobile (≤ 480 px), tablet (481–768 px), and desktop (769 px+). Added animated hamburger menu for mobile navigation, fluid typography, and tested the UI at multiple viewport widths (320 px – 1920 px). Updated all documentation.
- **Day 6**: Added and improved loading states and user feedback for all asynchronous frontend operations. Created new UI primitives (`Toast`, `Skeleton`, `ProgressBar`). Enhanced `MagicInput`, `DynamicForm`, `FormPage`, and `ResumePage` with loading overlays, progress bars, status banners, and toast notifications. Updated documentation.
- **Day 7**: Added user-friendly error, empty, and fallback states (`ErrorState`, `EmptyState`) to improve the frontend user experience. Updated documentation to reflect these changes.
- **Day 8**: Frontend support — Worked on frontend integration and resolved UI and integration issues found during development.
- **Day 9**: UI refactoring — Refactored frontend components and improved code organization, readability, and maintainability. Centralized schema validation rules, added module barrel exports, eliminated redundant error states, and organized service layers.

- **Day 10**: UI Refactoring — Refactored frontend components and improved code organization, readability, and maintainability. Created root barrel exports (`components/index.js`, `pages/index.js`), standardized clean component imports across all pages (`Home`, `FormPage`, `ResumePage`, `App`), unified form field validation in `CheckboxField`, and documented component architecture.
- **Day 10 (Backend & API)**: Aligned the frontend form service with backend routes, added persisted form submissions and API/database-aware health reporting, established explicit AI endpoint contracts, and added backend validation tests.
- **Day 11**: UI Consistency & Documentation — Improved consistency across pages, components, buttons, forms, and user interactions. Standardized page headers and semantic landmarks across `Home`, `FormPage`, and `ResumePage`. Unified button hover, elevation, and active states across all variants (`primary`, `secondary`, `outline`, `ghost`, `danger`). Achieved full prop parity (`disabled`, `helperText`, `required`) across all form components (`TextField`, `SelectField`, `TextareaField`, `CheckboxField`) matching the `Input` UI primitive. Polished dismiss controls (`type="button"`, hover scaling, focus rings) on Toast and status banners, added responsive mobile action stacking for `.form-submit-actions`, and updated comprehensive frontend/backend documentation.
