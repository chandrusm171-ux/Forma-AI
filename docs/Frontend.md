# Frontend Structure

## Tech Stack
- **React 19** + **Vite 8**
- **React Hook Form** (Form handling & validation)
- **React Router DOM** (Routing)
- **Zustand** (State management)
- **Axios** (API requests)

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
└── index.css        # Global styles & design tokens
```

---

## Component Overview

### 1. Forms (`components/forms/`)
- **`DynamicForm.jsx`**: Renders forms dynamically from JSON schemas using `react-hook-form`.
- **`FieldRenderer.jsx`**: Decides which input component to render based on field type (`text`, `select`, `textarea`, `checkbox`).
- **Input Fields**: `TextField`, `SelectField`, `TextareaField`, `CheckboxField`.

### 2. UI Components (`components/ui/`) — Vishal
- **`Button.jsx`**: Reusable button (variants, loading spinner, disabled states).
- **`Input.jsx`**: Base input with label and error handling.
- **`Loading.jsx`**: Spinners and loaders for AI/form actions.

### 3. Layout & Pages
- **Layout**: `Navbar.jsx`, `PageLayout.jsx`.
- **Pages**: `FormPage.jsx` (current form demo), `Home.jsx`, `ResumePage.jsx`.
