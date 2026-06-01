# Handoff: Gustav Mattsson Personal Design System

## Overview
A complete personal brand design system for **Gustav Mattsson** — a
designer/developer based in Stockholm. The mark is the binary string
**0100 0111** (ASCII `G`) beside a hand-drawn paintbrush. The system
pairs a quiet, technical foundation (Montserrat, neutral greys,
restrained color) with playful hand-drawn accents (Patrick Hand, a
coral brushstroke).

This bundle covers the **token system**, **typography**, **components**,
and a reference **personal-site UI kit** that shows the system in use.

## About the Design Files
The files in this bundle are **design references created in HTML** —
prototypes that demonstrate the intended look, tokens, and behavior.
They are **not production code to copy verbatim**. The task is to
**recreate these designs in the target codebase's environment** (React,
Vue, Svelte, SwiftUI, native, etc.) using its established patterns,
component primitives, and build tooling. If no codebase exists yet,
choose an appropriate framework and implement there.

The single most reusable artifact is **`colors_and_type.css`** — it is
framework-agnostic (plain CSS custom properties + `@font-face`) and can
be dropped into almost any web project as-is, or translated into the
target platform's token format (Tailwind config, JS theme object,
SwiftUI Color set, etc.).

## Fidelity
**High-fidelity.** Final colors, typography, spacing, radii, shadows,
and interaction states are all specified. Recreate the UI faithfully
using the codebase's existing libraries; exact values are below and in
`colors_and_type.css`.

## Theme model
One palette (**Ember**) with **light + dark** modes. The default
(`:root`) is dark. Add `data-theme="light"` on the root element (or any
wrapper) to switch. **Token names never change between modes — only
their values** — so components never branch on theme; they just read
tokens.

```html
<html data-theme="dark">   <!-- default -->
<html data-theme="light">
```

## Design Tokens

### Color — Ember

| Token | Role | Dark | Light |
| --- | --- | --- | --- |
| `--color-bg` | Page background | `#242425` | `#F4F4F3` |
| `--color-surface` | Card / panel | `#2E2E30` | `#FFFFFF` |
| `--color-surface-2` | Raised surface | `#38383A` | `#ECECEB` |
| `--color-surface-3` | Hover surface | `#424244` | `#E2E2E0` |
| `--color-border` | Hairline border | `#4E4E50` | `#DEDEDC` |
| `--color-border-strong` | Focused-input border | `#636365` | `#C4C4C1` |
| `--color-text` (`--fg1`) | Primary text | `#F2F1EF` | `#1C1B1A` |
| `--color-text-muted` (`--fg2`) | Secondary text | `#B3B1AD` | `#66645F` |
| `--color-text-faint` (`--fg3`) | Tertiary / metadata | `#828079` | `#94928D` |
| `--color-text-inverse` | Text on accent | `#242425` | `#FFFFFF` |
| `--color-accent` | Coral (CTAs, brush, active) | `#FF582D` | `#E8431B` |
| `--color-accent-hover` | Accent hover | `#FF6F47` | `#FF582D` |
| `--color-link` | Teal (links, focus) | `#3AA59C` | `#1E8077` |
| `--color-link-hover` | Link hover | `#4FBDB3` | `#2E8B83` |

Semantic: `--color-success #5BAE6E`, `--color-warn #E0A93B`,
`--color-danger` = accent. Legacy aliases `--color-red` → accent,
`--color-blue` → link (kept for back-compat; prefer the semantic names).

Coral accent = **Pantone 17-1363 TSX**. Neutrals anchored on `#5F615F`
and Pantone Cool Gray 9 C. **Use color sparingly** — most of any screen
is `--color-bg` + `--fg1`; accent is reserved for the brush, active nav,
a single CTA, and selection; link color is for inline links + focus
rings only. **No gradients.**

### Typography
- **Display + body:** `Montserrat` (variable, weights 100–900).
- **Hand accent:** `Patrick Hand` — tiny doses only (annotations,
  signatures, a highlighted word). Never body copy.
- **Mono:** system mono stack (`ui-monospace, …`) for code, timestamps,
  the binary "0100 0111".

| Token | px | Use |
| --- | --- | --- |
| `--fs-xs` | 12 | eyebrow, small meta |
| `--fs-sm` | 14 | secondary / labels |
| `--fs-md` | 16 | body (base) |
| `--fs-lg` | 18 | lead body |
| `--fs-xl` | 22 | h4 |
| `--fs-2xl` | 28 | h3 |
| `--fs-3xl` | 36 | h2 |
| `--fs-4xl` | 48 | h1 |
| `--fs-5xl` | 64 | display |
| `--fs-6xl` | 88 | hero display |

Weights: `--fw-light 300`, `--fw-regular 400`, `--fw-medium 500`,
`--fw-semibold 600`, `--fw-bold 700`, `--fw-black 900`.
Line-heights: `--lh-tight 1.05`, `--lh-snug 1.2`, `--lh-normal 1.5`,
`--lh-loose 1.7`.
Tracking: headings `-0.02em` (`--tr-tight`); eyebrows uppercase
`0.12em` (`--tr-wider`); body `0`.
Headings use Montserrat 600–700, tight tracking, `text-wrap: balance`.

### Spacing — 4px base
`--sp-1 4` · `--sp-2 8` · `--sp-3 12` · `--sp-4 16` · `--sp-5 24` ·
`--sp-6 32` · `--sp-7 48` · `--sp-8 64` · `--sp-9 96` · `--sp-10 128`.
Default section padding: 64px mobile / 96px desktop. Content max-width
**1120px**.

### Radii
`--r-xs 4` (chips, code) · `--r-sm 8` (buttons, inputs) ·
`--r-md 12` (cards) · `--r-lg 16` (modals) · `--r-pill 999`.

### Shadows / elevation
- `--shadow-sm 0 1px 2px rgba(0,0,0,.4)`
- `--shadow-md 0 4px 16px rgba(0,0,0,.45)`
- `--shadow-lg 0 16px 40px rgba(0,0,0,.55)`
- `--shadow-glow-red` / `--shadow-glow-blue` — accent-tinted glow for
  rare emphasis CTAs.
- Light mode softens all three (`rgba(30,28,26,…)` at 8–14%).
- No inset shadows.

### Motion
- `--ease-out cubic-bezier(.22,1,.36,1)` (default).
- `--ease-spring cubic-bezier(.34,1.56,.64,1)` (brush / hand accents only).
- Durations: `--dur-fast 120ms`, `--dur-base 200ms`, `--dur-slow 400ms`.
- No bounces on UI controls, no parallax. Restraint is the brand.

## Components

### Buttons (`preview/buttons.html`, `ui_kits/personal-site/site.css`)
- **Primary:** bg `--color-accent`, text `--color-text-inverse`, radius
  `--r-sm` (8px), padding `12px 20px`, font Montserrat 600 / 14px.
  Hover → `--color-accent-hover` + `translateY(-1px)`. Press →
  `translateY(0) scale(.98)`.
- **Secondary:** bg `--color-surface-2`, 1px `--color-border`, text
  `--color-text`. Hover → bg `--color-surface-3`.
- **Ghost:** transparent, 1px `--color-border`.
- **Link button:** transparent, text `--color-link`, no border.
- Disabled: `opacity .45`, `cursor: not-allowed`. Sentence case labels.
  A trailing `→` arrow is on-brand on primary CTAs.

### Inputs (`preview/inputs.html`)
- bg `--color-surface`, 1px `--color-border`, radius 8px, padding
  `10–14px 12–16px`, font body 14–15px.
- Focus: border `--color-link` + `0 0 0 3px` link-tint ring.
- Error: border `--color-accent` + helper text in accent.
- Checkbox: 16px box, `--r-xs`; checked = accent fill + inverse check.

### Cards (`preview/card.html`)
- bg `--color-surface`, 1px `--color-border`, radius `--r-md` (12px),
  padding 20–24px. **No shadow at rest.** Hover → bg `--color-surface-2`,
  `translateY(-2px)`, `--shadow-lg`, border `--color-border-strong`.

### Tags / pills (`preview/tags-pills.html`)
- Pill radius `--r-pill`. Outline (default), solid
  (`--color-surface-2`), active (accent fill + inverse text). Optional
  leading status dot in accent.

### Iconography (`preview/icons.html`)
- **Lucide**, stroke **1.75px**, 20px in UI / 24px in hero, color
  `currentColor`. ⚠ Substitution — no icon set was specified; swap for
  the codebase's set if one exists.
- Brand brush motif comes from the **logo asset**, not an icon.
- No emoji as UI.

## Screens / Views — reference UI kit (`ui_kits/personal-site/`)
A one-person portfolio site demonstrating the system. Built as React +
Babel components; **treat as layout/behavior reference**, recreate in
the target stack.

- **Nav** (`Nav.jsx`): sticky top bar, 64px tall, translucent
  `--color-bg` + `blur(12px)`, 1px bottom border. Left: 28px logo +
  "Gustav Mattsson" (Montserrat 600/14). Right: text links (`--fg2`,
  active = `--fg1` with 2px accent underline) + a primary "Get in touch →"
  button.
- **Hero** (`Hero.jsx`): two-column grid (1.4fr / 1fr), 64px gap.
  Left: uppercase eyebrow, then h1 split across two lines — "Hej, jag
  heter" small + muted (`0.55em`, weight 500) over "Gustav." large in
  Patrick Hand coral, rotated `-2deg`, `1.4em`. Lead paragraph (`--fg2`,
  18px). Primary + secondary buttons. Mono availability meta with accent
  dots. Right: portrait in a 4:5 rounded frame, `grayscale(1)
  contrast(1.05)`. Oversized brush watermark behind at ~4% opacity.
- **WorkGrid** (`WorkGrid.jsx`): eyebrow + h2, a row of filter pills
  (active = accent), then a 2-col card grid. Each card: mono meta, h3
  title, muted description, read-more link in `--color-link`. Filter
  state is local.
- **About** (`About.jsx`): two columns — narrative copy (17px `--fg2`,
  emphasized phrases in `--fg1`) and a bordered key/value skills list.
- **Contact** (`Contact.jsx`): centered, max 560px. Eyebrow + h2 +
  lead, single email input + "Send →" button inline; on submit shows a
  Patrick Hand "Tack — …" confirmation. Secondary `hej@gustav.se` note.
- **Footer** (`Footer.jsx`): 1px top border, logo + mono copyright on
  the left, three link columns (Site / Elsewhere / Contact) on the right.

## Interactions & Behavior
- **Nav links / CTAs:** smooth-scroll to the section, offset by the
  64px sticky nav; active link tracks the current section.
- **Work filters:** client-side filter of the project list by tag.
- **Contact form:** required email; on submit swap the form for a
  thank-you note (no backend in the prototype — wire to real handler).
- **Hover/press:** per the component specs above; all transitions
  `--dur-base` / `--ease-out`.
- **Theme:** driven entirely by `data-theme` on the root; no per-component
  logic.

## State Management
Minimal: active-section string (nav), selected-filter string
(WorkGrid), email + submitted boolean (Contact). No data fetching in the
reference; replace mock arrays (`WORK` in `WorkGrid.jsx`) with real data.

## Assets
- `assets/logo-black.png` — logo for light backgrounds.
- `assets/logo-white.png` — logo for dark backgrounds.
- `assets/gustav-portrait.jpg` — B&W portrait (apply `grayscale(1)
  contrast(1.05)` to keep treatment consistent).
- `fonts/` — Montserrat (variable + italic) and Patrick Hand `.ttf`.
  Self-host these; `@font-face` declarations are in `colors_and_type.css`.

## Files in this bundle
```
colors_and_type.css        — START HERE. Tokens + type + base styles.
README.md (this file)       — full spec.
assets/                     — logos + portrait.
fonts/                      — Montserrat + Patrick Hand.
ui_kits/personal-site/      — reference site (index.html + *.jsx + site.css).
preview/                    — per-token / per-component spec cards.
SOURCE_SYSTEM_README.md     — the design system's own README (voice,
                              tone, content & visual foundations).
SKILL.md                    — Agent Skill manifest (optional).
```

## Notes for production
- The reference UI kit uses an **in-browser Babel transform** for
  convenience — fine for review, **precompile JSX** in production.
- **Self-host the fonts** (already included); don't rely on a CDN.
- **Voice/copy** and the **Lucide icon set** are proposals — replace
  with real copy and the codebase's icon system.
