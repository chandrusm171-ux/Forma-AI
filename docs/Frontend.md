# Frontend Structure & Planning

## Tech Stack
- **React 19** + **Vite 8**
- **React Hook Form** (Form handling & validation)
- **React Router DOM** (Routing)
- **Zustand** (State management)
- **Axios** (API requests)

---

## Daily Progress Log

| **Day 1** | Setup & Structure | Set up Vite + React 19 environment, analyzed folder structure, and planned form engine architecture. |
| **Day 2** | UI/Component Planning | **Day 2 Update:** Planned the reusable React components and page-wise UI structure. Identified areas requiring UI and responsive improvements. |
| **Day 3** | React UI Components | **Day 3 Update:** Implemented and improved reusable React UI components. Verified the updated components locally. |

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

---

## Day 3 Implementation & Verification Update

### 1. UI Components Implemented & Enhanced (`frontend/src/components/ui/`)
- **`Button.jsx`**:
  - Implemented 5 variants (`primary`, `secondary`, `outline`, `ghost`, `danger`) and 3 size variants (`sm`, `md`, `lg`).
  - Added loading indicator with SVG spinner, auto-disabling click events and applying `aria-busy="true"`.
  - Added support for leading/trailing icons (`leftIcon`, `rightIcon`) and full-width mobile stretching (`fullWidth`).
  - Verified button interactions, focus outlines, and hover states locally.

- **`Input.jsx`**:
  - Implemented with React 19 `forwardRef` for seamless integration with `react-hook-form`.
  - Added dynamic validation error rendering with `role="alert"`, `aria-invalid`, and `aria-describedby`.
  - Added support for input icons, helper text, and mandatory indicator (`*`).
  - Styled with CSS variables for focus ring effects and `.has-error` state highlights.

- **`Loading.jsx`**:
  - Implemented customizable SVG spinner with rotating dash animations.
  - Supports 3 sizing tiers (`sm`, `md`, `lg`) and optional progress caption (`text`).
  - Built-in overlay mode (`overlay`) with backdrop blur (`rgba(255, 255, 255, 0.8)`) and full-screen blocking mode (`fullScreen`).

- **Barrel Export (`index.js`)**:
  - Added `components/ui/index.js` to enable clean named imports across the app.

### 2. Layout & Form Integration
- **`Navbar.jsx` & `PageLayout.jsx`**:
  - Added sticky application shell with brand badge, navigation links, and dynamic engine status pill.
  - Connected `PageLayout` to `FormPage.jsx` to establish consistent spacing, max-width bounds, and sticky navigation.
  - Added barrel export in `components/layout/index.js`.
- **`DynamicForm.jsx` & `TextField.jsx`**:
  - Replaced native HTML button with `Button` primitive supporting loading and variant states.
  - Upgraded `TextField` to use the reusable `Input` component, delegating field validation and error styling cleanly.

### 3. Local Verification Results
- **Component Rendering**: Checked that buttons, input fields, labels, and loading states render with proper design tokens and typography.
- **Form Validation**: Triggered required field validation; verified inline error message display and focus rings.
- **Responsiveness**: Tested on mobile (<640px) and desktop viewports; confirmed form padding and button tap targets adjust smoothly without horizontal scroll.

