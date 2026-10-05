# Frontend Structure & Planning

## Tech Stack
- **React 19** + **Vite 8**
- **React Hook Form** (Form handling & validation)
- **React Router DOM** (Routing)
- **Zustand** (State management)
- **Axios** (API requests)

---

## Daily Progress Log

| Day | Focus | Summary |
|-----|-------|---------|
| **Day 1** | Setup & Structure | Set up Vite + React 19 environment, analysed folder structure, and planned form engine architecture. |
| **Day 2** | UI/Component Planning | Planned the reusable React components and page-wise UI structure. Identified areas requiring UI and responsive improvements. |
| **Day 3** | React UI Components | Implemented and improved reusable React UI components (`Button`, `Input`, `Loading`). Verified the updated components locally. |
| **Day 4 (Main Pages)** | Main Pages & Sections | Developed the assigned frontend sections (`Home`, `FormPage`, `ResumePage`) and integrated reusable React components into the UI. |
| **Day 4 (Styling)** | Styling & UI Consistency | Improved styling including spacing scale, Inter font typography, alignment, select arrow, checkbox hover states, focus rings, and overall UI consistency across assigned sections. |
| **Day 5** | Responsive Design | Implemented comprehensive responsive layouts for **mobile** (≤ 480 px), **tablet** (481–768 px), and **desktop** (769 px+). Added animated hamburger menu for mobile navigation, fluid typography via `clamp()`, and tested the UI at multiple viewport widths. Updated all documentation. |

---

## Folder Structure (`frontend/src/`)

```text
src/
├── assets/          # Images and static files
├── components/
│   ├── ai/          # MagicInput – AI natural-language prompt section
│   ├── forms/       # DynamicForm, FieldRenderer, Input field wrappers
│   ├── layout/      # Navbar (with mobile hamburger), PageLayout
│   └── ui/          # Button, Input, Loading (reusable primitives)
├── pages/           # Home, FormPage, ResumePage
├── schemas/         # Form JSON schemas (e.g. formSchema.js)
├── services/        # API and AI services (aiService.js)
├── store/           # Zustand store (formStore.js)
├── App.jsx          # Root component with React Router routes
├── App.css          # Vite default styles (unused by app pages)
├── main.jsx         # Entry point – renders App into the DOM
└── index.css        # Global styles, design tokens, responsive breakpoints
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
- **`Navbar.jsx`**: Global top navigation featuring branding, AI engine status pill, primary navigation links, and an **animated hamburger toggle** with a slide-down drawer for mobile/tablet viewports (≤ 768 px). Auto-closes the mobile drawer on route change and prevents body scroll while open.
- **`PageLayout.jsx`**: Consistent page wrapper enforcing max-width constraints, fluid spacing, and common footer.

### 3. Page-Wise UI Structure (`pages/`)
- **`Home.jsx`**: Landing page showcasing Forma AI features, schema selector, and quick start demo triggers.
- **`FormPage.jsx`**: Main dynamic form generation screen with JSON schema rendering, interactive controls, and AI prompt input drawer.
- **`ResumePage.jsx`**: Specialised resume parsing interface extracting candidate details into structured forms.

### 4. Form Engine (`components/forms/`)
- **`DynamicForm.jsx`**: Handles `react-hook-form` initialisation, schema traversal, and submit handlers.
- **`FieldRenderer.jsx`**: Dispatches form schema fields to corresponding input primitives.
- **Field Wrappers**: `TextField`, `SelectField`, `TextareaField`, `CheckboxField`, `ConditionalField`.

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
  - Implemented customisable SVG spinner with rotating dash animations.
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
- **Responsiveness**: Tested on mobile (< 640 px) and desktop viewports; confirmed form padding and button tap targets adjust smoothly without horizontal scroll.

---

## Day 5 — Responsive Design Update

### Objective
Make the entire frontend UI fully responsive across **mobile**, **tablet**, and **desktop** viewport widths, and ensure a professional, consistent experience at every breakpoint.

### Breakpoint Strategy

| Tier | Range | Key Adjustments |
|------|-------|-----------------|
| **Small Mobile** | ≤ 360 px | Ultra-compact padding, smaller brand text, single-column layouts |
| **Mobile** | ≤ 480 px | Full-width buttons, stacked actions, reduced form/card padding, compact hero |
| **Tablet** | 481–768 px | 2-column feature grid, centered hero copy, hamburger menu replaces desktop nav |
| **Desktop** | 769–1199 px | Full desktop nav visible, 3-column feature grid, side-by-side hero layout |
| **Large Desktop** | ≥ 1200 px | Wider navbar container, increased grid gap for breathing room |

### Changes Made

#### 1. Navbar – Mobile Hamburger Menu (`Navbar.jsx`)
- **Animated hamburger toggle**: Three lines morph into an ✕ with CSS transitions when open.
- **Slide-down drawer** (`mobile-nav-drawer`): Contains all navigation links and the engine status pill; animates in with `max-height`, `opacity`, and `transform` transitions.
- **Backdrop overlay** (`mobile-backdrop`): Semi-transparent blurred overlay behind the drawer; clicking it closes the menu.
- **Auto-close on route change**: `useEffect` on `location.pathname` closes the drawer on every navigation.
- **Scroll lock**: `document.body.style.overflow` is set to `"hidden"` while the drawer is open to prevent background scroll on mobile.
- The hamburger and drawer are **hidden on desktop** (≥ 769 px) and only displayed via `@media (max-width: 768px)`.

#### 2. CSS Responsive Overhaul (`index.css`)
- **Fluid typography**: Replaced fixed font sizes in hero headings with `clamp()` functions (e.g. `clamp(1.75rem, 5vw, 4rem)`) so text scales smoothly.
- **Tablet (≤ 768 px)**:
  - Hero switches from 2-column grid to stacked single-column with centered copy.
  - Feature grid moves from 3 → 2 columns.
  - Form/card padding reduced one step; upload area height decremented.
- **Mobile (≤ 480 px)**:
  - Full-width CTA buttons with vertical stacking.
  - Feature grid moves to single column.
  - Form fields, cards, and upload areas receive compact padding.
  - Button sizes slightly reduced for touch comfort while maintaining 44 px min tap height.
  - Footer font size reduced.
  - Loading spinner sizes reduced.
- **Small Mobile (≤ 360 px)**:
  - Edge-case adjustments for very narrow devices: minimal side padding, smaller brand text, ultra-compact form cards.
- **Large Desktop (≥ 1200 px)**:
  - Expanded navbar max-width and grid gaps for wider screens.

#### 3. Tested Viewport Widths
- **320 px** (iPhone SE / small Android)
- **375 px** (iPhone 12 Mini)
- **414 px** (iPhone 12 / Pixel 5)
- **768 px** (iPad portrait)
- **1024 px** (iPad landscape / small laptop)
- **1440 px** (standard desktop)
- **1920 px** (full HD desktop)

### Key Design Decisions
1. **Breakpoint at 768 px** (not 640 px) for the mobile-to-desktop switch — aligns with standard tablet portrait widths and ensures the hamburger menu appears early enough to avoid cramped navigation.
2. **Separate 480 px breakpoint** — targets phones specifically, applying full-width buttons and single-column grids that are too aggressive for tablets.
3. **360 px breakpoint** — ensures tiny devices (Galaxy Fold, small Android) don't clip content.
4. **`clamp()` for headings** — eliminates abrupt font-size jumps between breakpoints and creates a seamless scaling curve.
5. **Hamburger implemented in JSX + CSS only** — no third-party library needed; keeps bundle lean.
