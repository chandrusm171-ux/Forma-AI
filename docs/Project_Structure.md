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
- **`backend/`**: Express API, MongoDB database connection, and LangChain LLM integration.
- **`docs/`**: Documentation and architecture notes.

---

## Team Responsibilities

| Member | Role | Responsibilities |
|---|---|---|
| **Chandru** | Team Lead | Frontend + Database / Testing |
| **Khushi** | Backend Developer | Express APIs & DB Integration |
| **Akshaya** | AI Developer | LangChain & LLM Extraction |
| **Vishal** | Frontend & Docs | UI Components, Styling & Documentation |

---

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

- **Day 10**: Fixed select/textarea/checkbox validation feedback, aligned the frontend form service with backend routes, added persisted form submissions and API/database-aware health reporting, established explicit AI endpoint contracts, and added backend validation tests.
