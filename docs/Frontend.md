# Frontend Guide

## Stack
- React + Vite
- React Hook Form for schema-driven field state and validation
- React Router for Home, Forms, and Resume Parser routes
- Axios API client

## Key files

- `src/pages/Home.jsx` — animated landing page, workflow cards, and feature overview.
- `src/pages/FormPage.jsx` — workflow selection, AI extraction, prefill, and dynamic form rendering.
- `src/pages/ResumePage.jsx` — resume upload interface; parsing is not yet implemented by the backend.
- `src/schemas/formSchema.js` — five starter form schemas.
- `src/components/ai/MagicInput.jsx` — natural-language prompt and extraction status.
- `src/components/forms/DynamicForm.jsx` — field rendering, validation, conditional logic, and submission.
- `src/services/aiService.js` — AI API client; no API secrets belong in the frontend.
- `src/index.css` — design tokens, responsive layouts, motion effects, and reduced-motion support.

## UI principles

- Use motion to reinforce hierarchy and feedback, not to distract from form completion.
- Respect `prefers-reduced-motion`.
- Keep focus states visible and form labels explicit.
- Treat extracted values as suggestions and allow users to edit them.
- Check layouts at 320px, 480px, 768px, 1024px, and desktop widths.

## Validation

```powershell
npm ci
npm run lint
npm run build
npm run dev
```
