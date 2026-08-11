---
title: 'Training Slide & Chart Builder'
type: 'feature'
created: '2026-08-11'
status: 'in-review'
baseline_commit: 'NO_VCS'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Training participants learn frameworks like Fishbone, Pareto, and SWOT during workshops but have no fast way to turn their live session data into a clean, branded slide. Manual slide building afterward is slow, inconsistent, and disconnected from the learning moment.

**Approach:** A standalone AI-powered web app with two input modes: (1) guided manual forms, and (2) AI-assisted — paste unstructured text or notes and the AI extracts structured framework data. Users pick from multiple visual templates per framework (modern, 3D, minimal, etc.) and customize colors. Live ConextLab-branded preview with PDF download. No login, no session codes.

## Boundaries & Constraints

**Always:**
- ConextLab brand: Geist font, JetBrains Mono for labels, color palette (Ink #0A0A0A, Blue #1652F0, Slate #1E293B, Surface #FFFFFF, Mist #F8FAFC, Hairline #E5E7EB, Muted #6B7280, Blue Soft #DCE5FE), logo from `https://conextlab.net/assets/conextlab-logo-rounded-BcrUS9UU.png`
- Mobile-responsive layout (participants join from phones on venue wifi)
- PDF export only — no PPTX
- No authentication, no session codes, no backend persistence
- All three frameworks (Fishbone, Pareto, SWOT) must work end-to-end
- SWOT uses a 2x2 grid with engaging visual treatment (not a plain table)
- At least 3 visual template variants per framework (e.g. modern, 3D, minimal, bold)
- Color customization: users can pick from preset palettes or adjust accent colors per template
- AI input mode: users can paste unstructured text; the AI extracts structured data for the selected framework

**Ask First:**
- Any deviation from the ConextLab brand palette or typography
- Adding any framework beyond Fishbone, Pareto, SWOT
- Adding any backend, database, or authentication
- Changing the PDF-only export constraint
- Which AI provider/model to use (default: OpenAI GPT-4o-mini via a Next.js API route; the API key is configured via environment variable)

**Never:**
- User accounts, login, or session persistence
- Real-time collaboration between participants
- Aggregated analytics, reporting, or scoring
- PPTX export
- Frameworks beyond Fishbone, Pareto, SWOT (5-Why, S-Curve, Impact-Effort Matrix, Flowchart are backlog)
- Exposing the AI API key to the client

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy path — Fishbone (manual) | Problem statement + at least 1 category with 1 cause | Rendered Fishbone diagram with selected template, branded preview, downloadable PDF | N/A |
| Happy path — Pareto (manual) | 3+ items with positive numeric counts | Sorted descending bar chart with cumulative line, 80% threshold, selected template, branded preview, downloadable PDF | N/A |
| Happy path — SWOT (manual) | All four quadrants filled | 2x2 grid with selected template, branded preview, downloadable PDF | N/A |
| Happy path — AI input (any framework) | User pastes unstructured text (meeting notes, raw data) and clicks "Generate with AI" | AI extracts structured data, populates the form, preview renders with selected template | Show loading spinner during API call; on success, populate form fields |
| AI input — ambiguous text | Pasted text lacks enough structure for the framework | AI returns best-effort extraction with a note about low confidence | Show amber banner: "Some fields could not be determined. Please review and fill in missing data." |
| AI input — API error | API key missing, rate limited, or network failure | Graceful fallback to manual mode | Show toast: "AI generation unavailable right now. You can still fill the form manually." with the form visible |
| Template switch | User cycles through template variants | Preview re-renders immediately with new template style, form data preserved | N/A |
| Color customization | User changes accent color via color picker or preset | Preview updates with new color applied to chart/diagram elements | N/A |
| Empty required field — any framework | Missing title/problem statement | Generation blocked, inline validation error shown | Show red border + message: "A title is required before generating the slide" |
| Fishbone — no causes | All categories empty | Generation blocked | Show message: "Add at least one cause to any category before generating" |
| Pareto — fewer than 3 items | 1 or 2 items entered | Generation blocked | Show message: "Enter at least 3 items for a meaningful Pareto chart" |
| Pareto — invalid count | Zero, negative, or non-numeric value | Generation blocked | Show message: "Count values must be positive numbers" |
| SWOT — empty quadrant | One or more quadrants left empty | Slide still generates, but a gentle warning appears | Show amber warning: "Quadrant X is empty — your slide will still generate" |
| Text overflow | Very long text in any field | Text truncated or scaled to fit slide layout | Character counter with soft limit (e.g. 200 chars per field) |
| Mobile viewport | Phone-width screen (320-428px) | Forms stack vertically, preview scales down, template picker is a horizontal scroll, download works | N/A |
| PDF download failure | Browser blocks download or jsPDF error | User sees an error toast with retry option | Show toast: "Download failed. Check your browser settings and try again." with Retry button |

</frozen-after-approval>

## Code Map

- `package.json` — project dependencies (Next.js, React, Tailwind, Recharts, jsPDF, html2canvas, openai)
- `tailwind.config.ts` — Tailwind config with ConextLab brand tokens
- `.env.local.example` — template for `OPENAI_API_KEY` environment variable
- `src/app/layout.tsx` — root layout with Geist + JetBrains Mono fonts, metadata
- `src/app/page.tsx` — main page: framework picker, input mode toggle, form, template selector, preview, download orchestration
- `src/app/globals.css` — global styles, brand CSS variables, Tailwind directives
- `src/app/api/generate/route.ts` — Next.js API route: receives framework type + unstructured text, calls OpenAI, returns structured data
- `src/components/framework-picker.tsx` — three-card framework selection UI
- `src/components/input-mode-toggle.tsx` — toggle between "Manual" and "AI Assist" input modes
- `src/components/ai-input.tsx` — textarea for pasting unstructured text + "Generate with AI" button with loading/error states
- `src/components/forms/fishbone-form.tsx` — Fishbone input form (problem, categories, causes), populated by manual or AI
- `src/components/forms/pareto-form.tsx` — Pareto input form (items + counts), populated by manual or AI
- `src/components/forms/swot-form.tsx` — SWOT input form (four quadrants), populated by manual or AI
- `src/components/template-selector.tsx` — horizontal scrollable template variant picker with thumbnail previews
- `src/components/color-customizer.tsx` — preset palette chips + optional custom color picker
- `src/components/preview/fishbone-preview.tsx` — Fishbone diagram renderer (SVG), template-aware with color overrides
- `src/components/preview/pareto-preview.tsx` — Pareto chart renderer (Recharts), template-aware with color overrides
- `src/components/preview/swot-preview.tsx` — SWOT 2x2 grid renderer, template-aware with color overrides
- `src/components/slide/slide-shell.tsx` — branded slide wrapper (logo, colors, layout)
- `src/components/download-button.tsx` — PDF generation via html2canvas + jsPDF
- `src/lib/validation.ts` — shared validation logic (required fields, numeric checks, min items)
- `src/lib/types.ts` — TypeScript types: framework data, templates, color schemes, AI response shapes
- `src/lib/templates.ts` — template definitions: 3-4 variants per framework with color schemes and visual style configs
- `src/lib/ai-prompts.ts` — prompt templates for each framework's AI extraction

## Tasks & Acceptance

**Execution:**
- [x] `package.json` — scaffold Next.js project with dependencies: next, react, react-dom, recharts, jspdf, html2canvas, tailwindcss, openai, typescript, @types/react
- [x] `.env.local.example` — document `OPENAI_API_KEY` variable with instructions
- [x] `tailwind.config.ts` — configure Tailwind with ConextLab brand tokens (colors, fontFamily)
- [x] `src/app/globals.css` — define CSS custom properties for brand colors, import Geist + JetBrains Mono, Tailwind layers
- [x] `src/app/layout.tsx` — root layout with font loading, viewport meta for mobile, ConextLab favicon
- [x] `src/lib/types.ts` — define FishboneData, ParetoData, SWOTData, FrameworkType, TemplateConfig, ColorScheme, AIExtractionResult, ValidationError types
- [x] `src/lib/templates.ts` — define 3-4 template variants per framework (modern/flat, 3D/gradient, minimal/monochrome, bold/high-contrast) with color schemes and style configs
- [x] `src/lib/ai-prompts.ts` — system + user prompt templates for Fishbone, Pareto, SWOT AI extraction with structured JSON output format
- [x] `src/lib/validation.ts` — implement validateFishbone, validatePareto, validateSWOT with all edge cases from I/O matrix
- [x] `src/app/api/generate/route.ts` — POST endpoint: validates input, calls OpenAI with framework-specific prompt, parses structured JSON response, returns AIExtractionResult
- [x] `src/components/framework-picker.tsx` — three-card picker (Fishbone, Pareto, SWOT) with icons and descriptions, mobile-stacked
- [x] `src/components/input-mode-toggle.tsx` — segmented control: "Manual" / "AI Assist", preserves data when switching modes
- [x] `src/components/ai-input.tsx` — textarea with placeholder examples, "Generate with AI" button, loading spinner, error/empty-state handling
- [x] `src/components/forms/fishbone-form.tsx` — problem statement input, 4M category selector, repeatable cause fields per category, inline validation, accepts pre-populated data from AI
- [x] `src/components/forms/pareto-form.tsx` — repeatable item name + count rows, add/remove, inline numeric validation, accepts pre-populated data from AI
- [x] `src/components/forms/swot-form.tsx` — four quadrant textareas with repeatable list per quadrant, accepts pre-populated data from AI
- [x] `src/components/template-selector.tsx` — horizontal scrollable chips/cards showing template name + style preview, active state, applies selected template to preview
- [x] `src/components/color-customizer.tsx` — preset palette chips (3-5 options) + optional hex color picker for accent override, updates template color scheme
- [x] `src/components/preview/fishbone-preview.tsx` — SVG Fishbone diagram: problem head on right, category spines, cause branches; reads template config for colors, line styles, typography
- [x] `src/components/preview/pareto-preview.tsx` — Recharts combo chart: descending bars, cumulative line, 80% threshold; reads template config for bar colors, gradients, line styles
- [x] `src/components/preview/swot-preview.tsx` — engaging 2x2 grid with colored quadrant backgrounds, icons, typographic hierarchy; reads template config for quadrant tints, borders, shadows
- [x] `src/components/slide/slide-shell.tsx` — ConextLab branded wrapper: logo top-left, Ink header bar, Surface background, Geist typography, footer with ConextLab mark
- [x] `src/components/download-button.tsx` — captures slide-shell + active preview via html2canvas, generates PDF via jsPDF, triggers browser download
- [x] `src/app/page.tsx` — orchestrates state: framework selection → input mode → form/AI → template → color → preview → download, mobile-responsive layout

**Acceptance Criteria:**
- Given a participant opens the app on a phone, when they pick Fishbone and fill the form, then a branded Fishbone diagram preview appears and downloads as PDF
- Given a participant pastes unstructured meeting notes and clicks "Generate with AI", when the AI call succeeds, then the form is populated with extracted data and the preview renders
- Given the AI API is unavailable, when a participant tries AI mode, then a clear message appears and manual form mode is offered as fallback
- Given a participant switches templates, when they select a different variant, then the preview re-renders with the new visual style while preserving all data
- Given a participant customizes the accent color, when they pick a new color, then the chart/diagram updates immediately
- Given a participant enters 2 items in Pareto, when they try to generate, then a clear error message blocks generation
- Given a participant enters a negative count in Pareto, when they try to generate, then a clear error message blocks generation
- Given a participant leaves a SWOT quadrant empty, when they generate, then a gentle warning appears but the slide still generates
- Given a participant fills any framework form, when they edit inputs, then the live preview updates immediately
- Given a participant taps Download, when the PDF generation completes, then a PDF file downloads with the ConextLab brand visible
- Given the app is viewed on a 375px-wide phone, when scrolling through the form and preview, then all elements are readable and usable without horizontal scroll

## Spec Change Log

- **2026-08-11 — Review loopback #1**: Three-reviewer audit found 9 bad_spec deviations. **Amendments**: (1) PDF: remove `allowTaint`, embed logo locally to avoid cross-origin taint, size PDF to captured slide; (2) AI: validate parsed JSON against framework schema before returning, compute confidence dynamically; (3) Slide shell: keep 16:9 (practical for slides), add Ink bar below logo, footer wordmark Geist 800; (4) SWOT: templates control border/shadow only, quadrant tints hardcoded; (5) Fishbone SVG: XML-escape text, cap at 6 categories, remove SVG filters for PDF compatibility; (6) AI input: 10K char limit; (7) Pareto: X-axis interval for label density, empty-state message; (8) Download/AI buttons: ref-based double-click guards; (9) Error boundary added; (10) Bar colors: use proper hex parsing; (11) Fishbone head text: contrast-aware coloring; (12) API route: 30s timeout, extract first fenced block only; (13) Forms: allow removing last item; (14) Slide shell: apply template background to entire shell; (15) Color customizer: warn on low contrast. **KEEP**: All three framework forms with inline validation, template selector with horizontal scroll, color customizer with 5 presets + hex picker, Recharts Pareto combo chart, SWOT 2x2 grid with colored quadrants, slide shell with logo/header/footer/forwardRef, download button with loading/error/retry, main page orchestrator flow, validation logic, AI prompts, API route structure, mobile-responsive layout, brand colors/fonts, SWOT empty quadrant warnings, Pareto/Fishbone validation rules.

## Design Notes

- **Template system**: Each framework has 3-4 template variants defined in `src/lib/templates.ts`. A template specifies: name, description, color scheme (accent, background, text, secondary), chart style (flat/gradient/3D), line weight, border radius, shadow depth. Templates are framework-specific — a Pareto "3D" template uses gradient bars with drop shadows; a Fishbone "modern" template uses thin crisp lines with Blue accents; a SWOT "bold" template uses high-contrast quadrant fills with heavy borders.
- **AI extraction flow**: User selects framework → switches to "AI Assist" mode → pastes text (max 10K chars) → clicks "Generate with AI" → API route calls OpenAI GPT-4o-mini (30s timeout) with a framework-specific system prompt instructing it to extract structured JSON → response is parsed, validated against framework schema, and confidence is computed dynamically → form fields are populated → user can review and edit before generating the slide. If confidence is low, an amber banner appears: "Some fields could not be determined. Please review and fill in missing data."
- **Fishbone diagram**: SVG-based (no SVG filters — use plain strokes for PDF compatibility). Problem statement as the "head" on the right. Up to 6 category spines branching from a central backbone. Causes rendered as smaller branches off each spine. All text XML-escaped. Head text color computed for contrast against accent background. Template controls line styles, colors, and typography.
- **Pareto chart**: Recharts BarChart + LineChart combo. Bars sorted descending. Cumulative percentage line. 80% threshold as a dashed horizontal line. X-axis uses interval to prevent label overlap with many items. Empty state shows "No data to display" message. Template controls bar styling (flat/gradient/3D), line color, and grid appearance.
- **SWOT grid**: 2x2 CSS Grid. Strengths tinted Blue Soft, Weaknesses tinted amber, Opportunities tinted green-soft, Threats tinted red-soft. Each quadrant has an icon, bold header, and bulleted list. Template controls border radius, shadow depth, and border style.
- **Slide shell**: 16:9 aspect ratio container (scalable, max 960px wide). Logo top-left, thin Ink bar (#0A0A0A, 2px) below logo area. Title in Geist 700. Content area centered. Footer with "ConextLab." wordmark in Geist 800 (font-extrabold). Template background color applied to entire shell. Clean white space — restraint over decoration.
- **PDF generation**: Logo embedded as local asset (downloaded to `/public/` at build time or served from same origin) to avoid cross-origin canvas tainting. html2canvas renders the slide-shell DOM node at 2x resolution with `allowTaint: false`. jsPDF creates a page matching the captured canvas dimensions. File named `conextlab-{framework}-{timestamp}.pdf`.

## Verification

**Commands:**
- `npm run build` — expected: zero TypeScript errors, successful production build
- `npm run lint` — expected: zero lint errors
- `npm run dev` — expected: app starts on localhost:3000, all three framework flows work end-to-end (manual + AI modes)

**Manual checks (if no CLI):**
- Open app on a mobile viewport (375px) in Chrome DevTools — verify no horizontal scroll, forms stack vertically, template selector scrolls horizontally, preview is readable
- Test AI input mode for each framework with realistic workshop notes — verify extracted data is reasonable and form is populated
- Test AI fallback by temporarily removing the API key — verify graceful error message and manual mode availability
- Cycle through all template variants for each framework — verify visual differences are distinct and preview updates instantly
- Test color customization — change accent color and verify it applies to the chart/diagram
- Generate and download a PDF for each framework — verify brand elements (logo, colors, fonts) render correctly in the PDF
- Test each validation error case from the I/O matrix — verify correct error messages appear

## Suggested Review Order

**Entry point — page orchestrator**

- Main state machine: framework selection → input mode → form/AI → template → color → preview → download. Data loss warning on framework switch, error boundary wrapper, SWOT warnings after AI extraction.
  [`page.tsx:74`](../../src/app/page.tsx#L74)

**PDF generation — critical fix**

- Removed `allowTaint: true` (broke `toDataURL()` with cross-origin logo). Added ref-based double-click guard. Logo now served locally from `/public/`.
  [`download-button.tsx:22`](../../src/components/download-button.tsx#L22)

**AI API route — schema validation + confidence**

- Parsed AI JSON now validated against framework schema before returning. Dynamic confidence computation (high/medium/low). 10K char input limit, 30s timeout, first-fenced-block extraction.
  [`route.ts:6`](../../src/app/api/generate/route.ts#L6)

**Slide shell — brand fidelity**

- Ink bar (#0A0A0A, 2px) below logo area. Footer wordmark now Geist 800 (font-extrabold). Template background color applied to entire shell. Logo loaded from local `/public/conextlab-logo.png`.
  [`slide-shell.tsx:13`](../../src/components/slide/slide-shell.tsx#L13)

**Fishbone preview — SVG safety**

- All text XML-escaped to prevent SVG injection. SVG filters removed for html2canvas PDF compatibility. Categories capped at 6. Head text color computed for contrast against accent background.
  [`fishbone-preview.tsx:10`](../../src/components/preview/fishbone-preview.tsx#L10)

**Pareto preview — chart robustness**

- Bar colors use proper hex→RGB→rgba conversion instead of fragile string concatenation. Empty state message when no data. X-axis interval prevents label overlap with many items. Name truncation relaxed to 20 chars.
  [`pareto-preview.tsx:23`](../../src/components/preview/pareto-preview.tsx#L23)

**Validation — exhaustive switch**

- `validateFrameworkData` now has a `default` case returning a validation error for unknown framework types.
  [`validation.ts:108`](../../src/lib/validation.ts#L108)

**AI input — abuse prevention**

- 10K character limit with counter. Ref-based double-click guard prevents duplicate API calls.
  [`ai-input.tsx:14`](../../src/components/ai-input.tsx#L14)

**Color customizer — contrast safety**

- WCAG luminance-based contrast check between accent and background. Amber warning when contrast ratio < 3:1.
  [`color-customizer.tsx:14`](../../src/components/color-customizer.tsx#L14)

**Error boundary — crash recovery**

- New React error boundary wrapping the entire app. Catches render errors and shows a refresh button instead of a blank white screen.
  [`error-boundary.tsx:1`](../../src/components/error-boundary.tsx#L1)

**Forms — last-item removal**

- Fishbone, Pareto, and SWOT forms now allow removing the last item row (remove button always visible).
  [`fishbone-form.tsx:135`](../../src/components/forms/fishbone-form.tsx#L135)
  [`pareto-form.tsx:100`](../../src/components/forms/pareto-form.tsx#L100)
  [`swot-form.tsx:95`](../../src/components/forms/swot-form.tsx#L95)

**Supporting — types, templates, prompts, config**

- Type definitions, 12 template variants, AI prompt templates, Tailwind brand config, global CSS.
  [`types.ts:1`](../../src/lib/types.ts#L1)
  [`templates.ts:1`](../../src/lib/templates.ts#L1)
  [`ai-prompts.ts:1`](../../src/lib/ai-prompts.ts#L1)
  [`tailwind.config.ts:1`](../../tailwind.config.ts#L1)
