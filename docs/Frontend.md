# Frontend Guide

## Stack
- React 19 + Vite
- React Hook Form for schema-driven field state and validation
- Zustand for lightweight client state management (`src/store/useWorkflowStore.js`)
- React Router v7 for Home, Forms, and Resume Parser routes
- Axios API client (`src/services/api.js`, `src/services/aiService.js`)
- Modern Vanilla CSS design system with CSS custom properties (tokens)

## Key Files & Structure

- `src/pages/Home.jsx` — Hero section with glowing brand badge, animated headline shimmer, workflow category filters, interactive preview cards, and stats counters.
- `src/pages/FormPage.jsx` — Multi-step dynamic form interface, workflow template switcher, prefill handling, and review modal.
- `src/pages/ResumePage.jsx` — Resume file dropzone interface (backend parsing placeholder returning 501).
- `src/schemas/formSchema.js` — Client schemas for 5 workflows (Insurance Claim, Patient Intake, Personal Loan, Legal Intake, Job Application).
- `src/components/ai/MagicInput.jsx` — Natural language prompt text area with live extraction status, sample quick-pick chips, and `glowPulse` busy animations.
- `src/components/forms/DynamicForm.jsx` — Recursive field renderer, live conditional visibility, inline validation errors, and submission handling.
- `src/components/common/Navbar.jsx` — Saturated backdrop-filter navigation bar with active route indicators and brand badge.
- `src/services/aiService.js` — Frontend AI client communicating with `/api/ai/extract` (keeps all API tokens backend-side).
- `src/index.css` — Central design system with custom properties, typography, keyframe animations, glassmorphism cards, and reduced-motion rules.

## Day 16 UI Visual Overhaul

- **Typography**: Paired Google Font **Outfit** (headings, bold modern display) with **Inter** (readable body text).
- **Curated Palette**: Modern deep indigo-violet color scheme (`--color-primary: #4f46e5`, `--color-accent: #7c3aed`).
- **Glassmorphism & Depth**: Multi-layered backdrop blurs (`backdrop-filter: blur(16px)`), luminous border gradients, and elevation shadows (`--shadow-glow`).
- **Micro-Animations**:
  - `gradientShimmer`: Animated fluid gradient across the hero heading.
  - `glowPulse`: Breathing violet aura around the AI MagicInput during inference.
  - `badgeGlow`: Soft pulsing halo behind the navbar Forma-AI brand badge.
- **Form Controls**: Crisp 1.5px borders, smooth indigo focus rings (`0 0 0 4px rgba(79, 70, 229, 0.15)`), and animated form completion progress bar.
- **Accessibility**: Full `prefers-reduced-motion: reduce` query compliance disabling heavy animations while preserving functionality.

## UI Principles

- Use motion to reinforce hierarchy and feedback, not to distract from form completion.
- Respect `prefers-reduced-motion`.
- Keep focus states visible and form labels explicit.
- Treat extracted values as editable suggestions, never auto-committing without user review.
- Fully responsive across 320px, 480px, 768px, 1024px, and ultra-wide displays.

## Validation & Commands

```powershell
npm ci
npm run lint
npm run build
npm run dev
```
