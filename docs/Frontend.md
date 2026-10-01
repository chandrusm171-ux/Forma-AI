# Frontend Structure & Planning

## Tech Stack
- **React 19** + **Vite 8**
- **React Hook Form** (Form handling & validation)
- **React Router DOM** (Routing)
- **Zustand** (State management)
- **Axios** (API requests)

---

## Daily Progress Log

| Day | Task | Update |
|---|---|---|
| **Day 1** | Setup & Structure | Set up Vite + React 19 environment, analyzed folder structure, and planned form engine architecture. |
| **Day 2** | UI/Component Planning | **Day 2 Update:** Planned the reusable React components and page-wise UI structure. Identified areas requiring UI and responsive improvements. |

---

## Folder Structure (`frontend/src/`)

```text
src/
├── assets/          # Images and static files
├── components/
│   ├── forms/       # DynamicForm, FieldRenderer, Input fields
│   ├── layout/      # Navbar, PageLayout
│   └── ui/          # Button, Input, Loading (Vishal)
├── pages/           # Home, FormPage, ResumePage
├── schemas/         # Form JSON schemas (e.g. formSchema.js)
├── services/        # API and AI services
├── store/           # Zustand store (formStore.js)
├── App.jsx          # Root component
└── index.css        # Global styles, design tokens & responsive utilities
```

---

## Component Architecture & Planning (Day 2)

### 1. UI Primitives (`components/ui/`) — Vishal
Pure, reusable presentational components with zero schema coupling:

- **`Button.jsx`**:
  - **Props**: `variant` (`primary`, `secondary`, `outline`, `ghost`, `danger`), `size` (`sm`, `md`, `lg`), `isLoading`, `disabled`, `fullWidth`, `leftIcon`, `rightIcon`.
  - **Features**: Built-in animated SVG spinner on `isLoading`, proper `aria-busy` and `disabled` states, micro-transitions on hover/active.
- **`Input.jsx`**:
  - **Props**: `label`, `error`, `helperText`, `required`, `leftIcon`, `rightIcon`, standard input props.
  - **Features**: Implements `forwardRef` for seamless integration with `react-hook-form`, accessible `aria-invalid` and `aria-describedby` error handling, distinct focus rings.
- **`Loading.jsx`**:
  - **Props**: `size` (`sm`, `md`, `lg`), `text`, `overlay`, `fullScreen`.
  - **Features**: Smooth CSS SVG spinner, backdrop-blur overlay mode for disabling interaction during AI data extraction/population.

### 2. Layout Components (`components/layout/`)
- **`Navbar.jsx`**: Global top navigation featuring branding, AI engine status pill, and primary navigation links.
- **`PageLayout.jsx`**: Consistent page wrapper enforcing max-width constraints, fluid spacing, and common footer.

### 3. Page-Wise UI Structure (`pages/`)
- **`Home.jsx`**: Landing page showcasing Forma AI features, schema selector, and quick start demo triggers.
- **`FormPage.jsx`**: Main dynamic form generation screen with JSON schema rendering, interactive controls, and AI prompt input drawer.
- **`ResumePage.jsx`**: Specialized resume parsing interface extracting candidate details into structured forms.

### 4. Form Engine (`components/forms/`)
- **`DynamicForm.jsx`**: Handles `react-hook-form` initialization, schema traversal, and submit handlers.
- **`FieldRenderer.jsx`**: Dispatches form schema fields to corresponding input primitives.
- **Field Wrappers**: `TextField`, `SelectField`, `TextareaField`, `CheckboxField`, `ConditionalField`.

---

## Identified Areas Requiring UI & Responsive Improvements

1. **Mobile Responsiveness (<640px)**:
   - Form container needs fluid padding (`16px` vs `32px` on desktop) to prevent horizontal overflow on smaller screens.
   - Header navigation should collapse cleanly, keeping action buttons compact.
   - Action buttons (`Submit`, `Reset`, `AI Autofill`) should stretch to full width (`ui-btn-full`) on mobile viewports for easy thumb tap targets.

2. **Visual Hierarchy & Modern Design System**:
   - Replaced flat borders with subtle elevation (`--shadow-md`, `--shadow-lg`) and rounded corners (`--radius-md`, `--radius-lg`).
   - Integrated semantic color tokens (`--color-primary`, `--color-danger`, `--color-border`, `--color-focus-ring`) to ensure accessible contrast ratios (WCAG AA compliant).

3. **Interactive & AI State Feedback**:
   - Provide visual feedback (skeleton or overlay loader via `Loading.jsx`) when the LLM parses natural language text into the form.
   - Add inline error badges below form inputs rather than generic alert popups.
   - Smooth focus indicators on inputs using CSS box-shadow rings to improve keyboard accessibility.
