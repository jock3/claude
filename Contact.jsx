<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Display scale</title>
<link rel="stylesheet" href="_card.css" />
<style>
  .card { gap: 4px; padding: 24px 28px; }
  .row-t { display: flex; align-items: baseline; gap: 16px; padding: 6px 0; border-bottom: 1px solid var(--color-border); }
  .row-t:last-child { border-bottom: 0; }
  .label { font-family: var(--font-mono); font-size: 11px; color: var(--fg3); width: 80px; flex-shrink: 0; letter-spacing: 0.06em; }
  .sample { font-family: var(--font-display); font-weight: 700; letter-spacing: -0.02em; line-height: 1; color: var(--fg1); }
</style>
</head>
<body>
<div class="card">
  <span class="eyebrow">Display · Montserrat 700</span>
  <div class="row-t"><span class="label">88 / h0</span><span class="sample" style="font-size:64px;">Aa Bb Gg</span></div>
  <div class="row-t"><span class="label">64 / h1</span><span class="sample" style="font-size:48px;">Hej, jag heter Gustav.</span></div>
  <div class="row-t"><span class="label">36 / h2</span><span class="sample" style="font-size:32px;">Selected work</span></div>
  <div class="row-t"><span class="label">28 / h3</span><span class="sample" style="font-size:24px; font-weight:600;">A few projects I'm proud of</span></div>
</div>
</body>
</html>
