/* =========================================================
   Gustav Mattsson — Personal Design System
   colors_and_type.css
   ---------------------------------------------------------
   Single source of truth for color tokens, typography
   tokens, and semantic element styles. Import this file
   before anything else.
   ========================================================= */

/* ---------- Fonts ---------- */
@font-face {
  font-family: "Montserrat";
  src: url("./fonts/Montserrat-VariableFont_wght.ttf") format("truetype-variations");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Montserrat";
  src: url("./fonts/Montserrat-Italic-VariableFont_wght.ttf") format("truetype-variations");
  font-weight: 100 900;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: "Patrick Hand";
  src: url("./fonts/PatrickHand-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* ---------- Color tokens — themed --------------------------------
   One axis: data-theme = dark (default) | light
   Set on <html> or any wrapper:  <html data-theme="light">
   Token NAMES never change — only their values. --color-red /
   --color-blue are kept as aliases so existing components work.

   Palette: Ember — coral #FF582D (Pantone 17-1363 TSX) accent +
   teal #3AA59C link, on a light neutral-grey scale. Neutrals
   anchored on #5F615F / Cool Gray 9 C.
------------------------------------------------------------------ */
:root {
  /* default = Ember · Dark */
  --color-bg: #242425;
  --color-surface: #2E2E30;
  --color-surface-2: #38383A;
  --color-surface-3: #424244;
  --color-border: #4E4E50;
  --color-border-strong: #636365;

  --color-text: #F2F1EF;          /* primary ink */
  --color-text-muted: #B3B1AD;    /* secondary */
  --color-text-faint: #828079;    /* tertiary / metadata */
  --color-text-inverse: #242425;  /* on accent / light surfaces */

  --color-accent: #FF582D;        /* coral — Pantone 17-1363 TSX */
  --color-accent-hover: #FF6F47;
  --color-link: #3AA59C;          /* teal */
  --color-link-hover: #4FBDB3;

  /* aliases (legacy names) */
  --color-red: var(--color-accent);
  --color-red-hover: var(--color-accent-hover);
  --color-blue: var(--color-link);
  --color-blue-hover: var(--color-link-hover);

  /* semantic */
  --color-success: #5BAE6E;
  --color-warn: #E0A93B;
  --color-danger: var(--color-accent);

  /* Foreground aliases (fg1, fg2, fg3) */
  --fg1: var(--color-text);
  --fg2: var(--color-text-muted);
  --fg3: var(--color-text-faint);
  --bg1: var(--color-bg);
  --bg2: var(--color-surface);
  --bg3: var(--color-surface-2);

  /* ---------- Type families ---------- */
  --font-display: "Montserrat", "Helvetica Neue", Arial, sans-serif;
  --font-body: "Montserrat", "Helvetica Neue", Arial, sans-serif;
  --font-hand: "Patrick Hand", "Comic Sans MS", cursive;
  --font-mono: ui-monospace, "JetBrains Mono", "Fira Code", "SF Mono",
    Menlo, Consolas, monospace;

  /* ---------- Type scale (modular, 1.25 ratio) ---------- */
  --fs-xs: 12px;
  --fs-sm: 14px;
  --fs-md: 16px;
  --fs-lg: 18px;
  --fs-xl: 22px;
  --fs-2xl: 28px;
  --fs-3xl: 36px;
  --fs-4xl: 48px;
  --fs-5xl: 64px;
  --fs-6xl: 88px;

  /* ---------- Weights ---------- */
  --fw-light: 300;
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-semibold: 600;
  --fw-bold: 700;
  --fw-black: 900;

  /* ---------- Line height ---------- */
  --lh-tight: 1.05;
  --lh-snug: 1.2;
  --lh-normal: 1.5;
  --lh-loose: 1.7;

  /* ---------- Tracking ---------- */
  --tr-tight: -0.02em;
  --tr-normal: 0;
  --tr-wide: 0.04em;
  --tr-wider: 0.12em;

  /* ---------- Spacing (4px base) ---------- */
  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 12px;
  --sp-4: 16px;
  --sp-5: 24px;
  --sp-6: 32px;
  --sp-7: 48px;
  --sp-8: 64px;
  --sp-9: 96px;
  --sp-10: 128px;

  /* ---------- Radii ---------- */
  --r-xs: 4px;
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 16px;
  --r-xl: 24px;
  --r-pill: 999px;

  /* ---------- Shadows / elevation ---------- */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.45);
  --shadow-lg: 0 16px 40px rgba(0,0,0,0.55);
  --shadow-glow-red: 0 0 0 1px color-mix(in srgb, var(--color-accent) 45%, transparent), 0 8px 32px color-mix(in srgb, var(--color-accent) 20%, transparent);
  --shadow-glow-blue: 0 0 0 1px color-mix(in srgb, var(--color-link) 45%, transparent), 0 8px 32px color-mix(in srgb, var(--color-link) 20%, transparent);
  --shadow-glow-accent: var(--shadow-glow-red);

  /* ---------- Motion ---------- */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-fast: 120ms;
  --dur-base: 200ms;
  --dur-slow: 400ms;
}

/* =========================================================
   Theme — light & dark
   The default (:root) is Ember · Dark. Add data-theme="light"
   on <html> for light mode. Token NAMES never change — only
   values — so every component reflows automatically.
   (data-theme="dark" is also accepted as an explicit no-op.)
   ========================================================= */

:root[data-theme="dark"] {
  --color-bg: #242425; --color-surface: #2E2E30; --color-surface-2: #38383A;
  --color-surface-3: #424244; --color-border: #4E4E50; --color-border-strong: #636365;
  --color-text: #F2F1EF; --color-text-muted: #B3B1AD; --color-text-faint: #828079;
  --color-text-inverse: #242425;
  --color-accent: #FF582D; --color-accent-hover: #FF6F47;
  --color-link: #3AA59C; --color-link-hover: #4FBDB3;
}

:root[data-theme="light"] {
  --color-bg: #F4F4F3; --color-surface: #FFFFFF; --color-surface-2: #ECECEB;
  --color-surface-3: #E2E2E0; --color-border: #DEDEDC; --color-border-strong: #C4C4C1;
  --color-text: #1C1B1A; --color-text-muted: #66645F; --color-text-faint: #94928D;
  --color-text-inverse: #FFFFFF;
  --color-accent: #E8431B; --color-accent-hover: #FF582D;
  --color-link: #1E8077; --color-link-hover: #2E8B83;

  /* softer elevation — dark drop-shadows look heavy on white */
  --shadow-sm: 0 1px 2px rgba(30,28,26,0.08);
  --shadow-md: 0 4px 16px rgba(30,28,26,0.10);
  --shadow-lg: 0 16px 40px rgba(30,28,26,0.14);
}

/* =========================================================
   Semantic element styles
   ========================================================= */

html {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--fs-md);
  line-height: var(--lh-normal);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
}

/* Headings — Montserrat, bold, tight tracking */
h1, .h1 {
  font-family: var(--font-display);
  font-size: var(--fs-5xl);
  font-weight: var(--fw-bold);
  line-height: var(--lh-tight);
  letter-spacing: var(--tr-tight);
  margin: 0 0 var(--sp-4);
  color: var(--fg1);
  text-wrap: balance;
}
h2, .h2 {
  font-family: var(--font-display);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-bold);
  line-height: var(--lh-snug);
  letter-spacing: var(--tr-tight);
  margin: 0 0 var(--sp-4);
  color: var(--fg1);
  text-wrap: balance;
}
h3, .h3 {
  font-family: var(--font-display);
  font-size: var(--fs-2xl);
  font-weight: var(--fw-semibold);
  line-height: var(--lh-snug);
  margin: 0 0 var(--sp-3);
  color: var(--fg1);
}
h4, .h4 {
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  font-weight: var(--fw-semibold);
  line-height: var(--lh-snug);
  margin: 0 0 var(--sp-2);
  color: var(--fg1);
}

/* Eyebrow / kicker — uppercase, tracked */
.eyebrow {
  font-family: var(--font-display);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tr-wider);
  text-transform: uppercase;
  color: var(--fg2);
}

/* Hand-drawn accent — sparingly, for highlights */
.hand {
  font-family: var(--font-hand);
  font-weight: var(--fw-regular);
  letter-spacing: 0.01em;
  color: var(--color-accent);
}

/* Body */
p, .body {
  font-family: var(--font-body);
  font-size: var(--fs-md);
  line-height: var(--lh-normal);
  color: var(--fg1);
  margin: 0 0 var(--sp-4);
  text-wrap: pretty;
}
.body-sm { font-size: var(--fs-sm); }
.body-lg { font-size: var(--fs-lg); line-height: var(--lh-loose); }

small, .small {
  font-size: var(--fs-sm);
  color: var(--fg2);
}

/* Links */
a {
  color: var(--color-link);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in oklch, var(--color-link) 40%, transparent);
  transition: color var(--dur-fast) var(--ease-out),
              border-color var(--dur-fast) var(--ease-out);
}
a:hover {
  color: var(--color-link-hover);
  border-color: var(--color-link-hover);
}

/* Code */
code, kbd, pre, samp {
  font-family: var(--font-mono);
  font-size: 0.92em;
}
code {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--r-xs);
  padding: 0.1em 0.4em;
  color: var(--fg1);
}
pre {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--r-md);
  padding: var(--sp-4);
  overflow-x: auto;
  line-height: var(--lh-normal);
}
pre code {
  background: transparent;
  border: 0;
  padding: 0;
}

/* Selection */
::selection {
  background: var(--color-accent);
  color: var(--color-text-inverse);
}

/* Focus */
:focus-visible {
  outline: 2px solid var(--color-blue);
  outline-offset: 2px;
  border-radius: var(--r-xs);
}
