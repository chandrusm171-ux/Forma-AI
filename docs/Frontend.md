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
| **Day 6** | Loading States & User Feedback | Added and improved loading states, skeleton placeholders, progress bars, toast notifications, and inline status banners for all asynchronous frontend operations. Enhanced `MagicInput`, `DynamicForm`, `FormPage`, and `ResumePage` with comprehensive user feedback. |
| **Day 7** | Error & Empty States | Added user-friendly error, empty, and fallback states (`ErrorState`, `EmptyState`) to improve the frontend user experience in edge cases (no data, API failure, etc.). Updated documentation. |

---

## Folder Structure (`frontend/src/`)

```text
src/
├── assets/          # Images and static files
├── components/
│   ├── ai/          # MagicInput – AI natural-language prompt section
│   ├── forms/       # DynamicForm, FieldRenderer, Input field wrappers
│   ├── layout/      # Navbar (with mobile hamburger), PageLayout
│   └── ui/          # Button, Input, Loading, Toast, Skeleton, ProgressBar
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

---

## Day 6 — Loading States & User Feedback Update

### Objective
Add and improve loading states and user feedback for all relevant asynchronous frontend operations — AI extraction, form submission, and resume parsing — so users always know what is happening and receive clear success/error outcomes.

### New UI Primitives (`components/ui/`)

#### 1. `Toast.jsx` — Notification Component
- **Variants**: `success`, `error`, `warning`, `info` — each with a distinct colour palette, border, and SVG icon.
- **Auto-dismiss**: Configurable duration (default 4 000 ms); set `duration={0}` to disable.
- **Manual dismiss**: Close button in the top-right corner.
- **Animations**: Slide-in from right on mount, slide-out on dismiss (CSS `toastSlideIn` / `toastSlideOut` keyframes).
- **Accessibility**: `role="alert"`, `aria-live="assertive"`.
- **Responsive**: On ≤ 768 px the toast spans the full viewport width with side margins.

#### 2. `Skeleton.jsx` — Placeholder Loader
- **Variants**: `line` (text placeholder), `circle` (avatar), `card` (content card).
- **Shimmer animation**: Gradient-based sweep animation via `@keyframes shimmer`.
- **Line groups**: Pass `lines={n}` for multi-line skeletons; the last line auto-shortens to 60 % width for a natural look.

#### 3. `ProgressBar.jsx` — Progress Indicator
- **Determinate mode**: Pass `value` (0–100) for a filled bar.
- **Indeterminate mode**: Omit `value` for an animated sliding bar.
- **Sizes**: `sm` (4 px) and `md` (8 px) track heights.
- **Gradient fill**: Uses `var(--color-primary)` → `#6366f1` for a polished look.

#### Barrel Export Updated
`components/ui/index.js` now exports: `Button`, `Input`, `Loading`, `Toast`, `Skeleton`, `ProgressBar`.

### Page-Level Enhancements

#### 1. `MagicInput.jsx` — AI Analysis Feedback
- **Progress bar**: An indeterminate `ProgressBar` appears below the textarea while the AI call is in progress.
- **Status banners**: Inline success (green) and error (red) banners with dismiss buttons appear after the operation completes.
- **Busy state**: The entire section card receives a blue border glow (`magic-input-busy`) during analysis.
- **Hint text**: A "This may take a few seconds…" label fades in next to the button.
- **Error handling**: Catches and surfaces errors from `extractFormData`.

#### 2. `FormPage.jsx` — Extraction Overlay & Toast
- **Loading overlay**: A blurred `<Loading overlay />` covers the form card while AI extraction is in progress — prevents interaction and clearly signals progress.
- **Toast notifications**: A `<Toast>` at the bottom-right confirms successful extraction or reports errors.
- **Form section wrapper**: `.form-section-wrapper` has `position: relative` so the overlay correctly contains within the form card.

#### 3. `DynamicForm.jsx` — Submission Feedback
- **Async submit**: Submission now simulates an async call (`1 500 ms` delay) and shows the button spinner via `isSubmitting`.
- **Success / Error banner**: A status banner (green or red) appears at the top of the form after submission.
- **Fieldset disabling**: All form inputs are wrapped in a `<fieldset disabled>` during submission to prevent double-submit.
- **Loading text**: Button label changes to "Submitting…" during the operation.

#### 4. `ResumePage.jsx` — Parse Lifecycle
- **Loading overlay**: A `<Loading overlay />` covers the upload card during parsing.
- **Indeterminate progress**: A `ProgressBar` appears during parsing.
- **Button spinner**: The "Parse Resume" button shows a spinner and changes text to "Parsing…".
- **Parsed results card**: After successful parsing, a styled results card appears with extracted data (name, email, experience, skills as pill tags).
- **Toast feedback**: Success and error toasts provide clear outcome notifications.
- **File input disabling**: The file picker is disabled during parsing to prevent re-selection.

#### 5. `aiService.js` — Simulated Delays & Error Handling
- All AI service functions now include simulated network delays (`2 000 ms` for extraction, `2 500 ms` for resume parsing) so loading states can be observed during development.
- Added `parseResume(file)` stub that returns structured candidate data.
- Functions throw descriptive `Error` objects on invalid input, enabling error-state UI paths.

### CSS Additions (`index.css`)

| Section | Purpose |
|---------|---------|
| **Toast Notifications** | Fixed position, 4 colour variants, slide-in/out animations, backdrop blur |
| **Skeleton Placeholders** | Gradient shimmer animation, circle/line/card shapes |
| **Progress Bar** | Track/fill with gradient, indeterminate sliding animation |
| **MagicInput Loading** | Busy border glow, progress container, status banners (success/error) |
| **DynamicForm Submit Status** | Fieldset reset styles, submit success/error banners |
| **FormPage Section Wrapper** | `position: relative` for overlay containment |
| **ResumePage Results** | Results card, header with badge, 2-column grid, skill pill tags |
| **New Animations** | `shimmer`, `toastSlideIn`, `toastSlideOut`, `progressIndeterminate` |

### Responsive Adjustments

| Breakpoint | Changes |
|------------|---------|
| **≤ 768 px** | Toast spans full width; resume results grid → single column; magic-input actions wrap |
| **≤ 480 px** | Toast bottom-positioned with compact margins; actions stack vertically; results card compact padding; status banners compact size |

### Key Design Decisions
1. **Inline status banners over modals** — less intrusive; users can dismiss and continue without losing context.
2. **Toast for page-level feedback, banners for section-level** — toasts are for global outcomes (extraction complete), banners are for contextual feedback (form submitted).
3. **Overlay on the form card, not fullscreen** — keeps the MagicInput visible so users can track what they typed while the form populates.
4. **Fieldset disabling vs. individual field disabling** — a single `<fieldset disabled>` is cleaner and catches all inputs without needing per-field logic.
5. **Simulated delays in aiService** — enables realistic loading-state testing during development without requiring backend availability.

---

## Day 7 — Error & Empty States Update

### Objective
Enhance user experience and handle edge cases gracefully by implementing robust error, empty, and fallback states across the application. These states ensure users receive clear, actionable feedback when data is unavailable or an error occurs.

### New UI Primitives (`components/ui/`)

#### 1. `EmptyState.jsx`
- **Purpose**: Displays a friendly fallback when no data is available (e.g. no resume parsed, no form schema loaded).
- **Features**: Customizable title, description, icon, and primary action button to guide users on what to do next.

#### 2. `ErrorState.jsx`
- **Purpose**: Handles API failures, unexpected exceptions, or failed extractions gracefully.
- **Features**: Displays an error icon, helpful context, and an optional retry button to encourage users to attempt the action again without a full page reload.

### CSS Enhancements (`index.css`)
- **Shared Styles**: Both `EmptyState` and `ErrorState` share consistent layouts (centered flexbox, padding, background colors, and subtle box-shadows).
- **Responsive Handling**: The components automatically adjust their internal spacing and typography for mobile and tablet viewports to maintain readability.

### Barrel Export Updated
`components/ui/index.js` now exports `EmptyState` and `ErrorState` alongside the existing primitives, enabling clean imports across all pages.
