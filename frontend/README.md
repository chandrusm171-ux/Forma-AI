# Forma-AI Frontend

React + Vite frontend for the Forma-AI dynamic form engine.

## Setup

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` if the backend API is not running at `http://localhost:5000/api`.

## Scripts

- `npm run dev` — start the Vite development server.
- `npm run lint` — run ESLint.
- `npm run build` — create the production build in `dist/`.
- `npm run preview` — preview the production build locally.

## Integration status

- Dynamic schema rendering, conditional fields, and field validation are implemented.
- Form submission calls `POST /api/submissions`; the UI only reports success after the API confirms persistence.
- The navbar health pill distinguishes API availability from MongoDB readiness.
- AI extraction and resume parsing call the backend contract endpoints. Those endpoints currently return `501 AI_SERVICE_NOT_CONFIGURED` until the AI integration is completed.
