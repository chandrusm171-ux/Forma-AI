# Frontend Guide

## Stack
- **Framework**: React 19 + Vite
- **Form State & Validation**: React Hook Form for schema-driven validation
- **State Management**: Zustand (`src/store/formStore.js`)
- **Routing**: React Router v7 (`src/App.jsx`)
- **HTTP Client**: Axios with request/response interceptors for Bearer auth tokens (`src/services/api.js`)
- **Design System**: Vanilla CSS design system with custom properties, responsive glassmorphism, Google Fonts (**Outfit** & **Inter**), and `prefers-reduced-motion` compliance.

---

## Directory & File Structure

```text
frontend/
├── src/
│   ├── assets/                # Brand SVGs, images and hero assets
│   ├── components/
│   │   ├── ai/
│   │   │   ├── MagicInput.jsx # Natural language AI prompt input with extraction preview & status
│   │   │   └── index.js
│   │   ├── forms/             # Modular dynamic form field renderers
│   │   │   ├── CheckboxField.jsx
│   │   │   ├── ConditionalField.jsx
│   │   │   ├── DynamicForm.jsx
│   │   │   ├── FieldRenderer.jsx
│   │   │   ├── SelectField.jsx
│   │   │   ├── TextareaField.jsx
│   │   │   ├── TextField.jsx
│   │   │   ├── validation.js
│   │   │   └── index.js
│   │   ├── layout/            # Application layout wrappers
│   │   │   ├── Navbar.jsx     # Navigation header with auth state, theme & routes
│   │   │   ├── PageLayout.jsx # Base page container wrapper
│   │   │   └── index.js
│   │   ├── ui/                # Core reusable UI component library
│   │   │   ├── AiBadge.jsx    # Pulsing AI feature indicator badge
│   │   │   ├── Button.jsx     # Primary, secondary, outline button variants
│   │   │   ├── EmptyState.jsx # Visual empty placeholder with action button
│   │   │   ├── ErrorState.jsx # Error alert display with retry action
│   │   │   ├── Input.jsx      # Styled form text input
│   │   │   ├── Loading.jsx    # Animated loading spinner
│   │   │   ├── ProgressBar.jsx# Stepped form completion progress indicator
│   │   │   ├── Skeleton.jsx   # Shimmer placeholder skeleton loader
│   │   │   ├── Toast.jsx      # Feedback notification toasts
│   │   │   └── index.js       # Barrel export for UI components
│   │   └── index.js
│   ├── pages/
│   │   ├── Home.jsx           # Landing page with hero banner, workflow cards, & stats
│   │   ├── FormPage.jsx       # Multi-step dynamic form interface & AI prefill
│   │   ├── ResumePage.jsx     # PDF/DOCX resume uploader & profile extraction
│   │   ├── AuthPage.jsx       # User authentication (Sign in & Sign up tabbed form)
│   │   ├── SubmissionHistory.jsx # Stored submissions list with search & pagination
│   │   └── index.js
│   ├── schemas/
│   │   └── formSchema.js      # Schemas for 5 prebuilt workflows (Insurance, Patient, Loan, Legal, Job)
│   ├── services/
│   │   ├── api.js             # Base Axios instance with Bearer token interceptor
│   │   ├── authService.js     # User registration, login, logout, and current user lookup
│   │   ├── aiService.js       # AI prompt extraction and resume parsing calls
│   │   ├── formService.js     # Submissions persistence and query API calls
│   │   └── index.js
│   ├── store/
│   │   └── formStore.js       # Central client state store
│   ├── App.jsx                # Router setup and global providers
│   ├── App.css                # Global app styles
│   ├── index.css              # Design tokens, typography, keyframes, and utilities
│   └── main.jsx               # React DOM entry point
├── .env.example               # Frontend environment template
├── .env                       # Local environment configuration (VITE_API_BASE_URL)
└── package.json
```

---

## Routes & Navigation

| Route | Page Component | Description | Access |
|---|---|---|---|
| `/` | `Home.jsx` | Landing page, workflow showcases, and feature highlights | Public |
| `/forms` | `FormPage.jsx` | Dynamic form workflow builder, AI MagicInput, and submission | Public |
| `/resume` | `ResumePage.jsx` | Resume upload and parsed candidate profile viewer | Public |
| `/auth` | `AuthPage.jsx` | Sign in / Create account tabbed interface (`?mode=register` / `?mode=login`) | Public |
| `/submissions` | `SubmissionHistory.jsx` | Authenticated user submission history, search, and detail modal | Authenticated |

---

## Authentication & API Interceptor

- **Session Tokens**: Bearer JWT tokens received from `/api/auth/register` or `/api/auth/login` are stored in `sessionStorage` under `forma-ai-session-token`.
- **Axios Interceptor (`services/api.js`)**:
  - Automatically attaches `Authorization: Bearer <token>` to all outbound requests if a token is present.
  - Automatically catches HTTP `401 Unauthorized` responses and clears stored session data.
- **Password Rules**: Minimum 6 characters required on registration.

---

## Reusable UI Component Library (`src/components/ui/`)

- `<Button variant="primary|secondary|outline|danger" size="sm|md|lg" />`: Accessible button with loading states.
- `<EmptyState icon title description action />`: Clean fallback when lists or submissions are empty.
- `<ErrorState title message onRetry />`: User-friendly error message display with optional retry trigger.
- `<ProgressBar value={percentage} />`: Animated progress bar reflecting step completion.
- `<Loading size="sm|md|lg" message />`: Indigo spinner for asynchronous operations.
- `<AiBadge text />`: Glowing violet pill denoting AI-powered functionality.

---

## Environment Variables

Create `frontend/.env` locally:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Build & Test Commands

```powershell
npm run dev      # Start Vite local development server
npm run build    # Build production bundle with Vite
npm run lint     # Run ESLint validation
```
