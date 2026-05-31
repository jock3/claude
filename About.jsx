<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Body type</title>
<link rel="stylesheet" href="_card.css" />
<style>
  .card { padding: 24px 28px; gap: 14px; }
  .row-t { display: flex; align-items: baseline; gap: 16px; }
  .label { font-family: var(--font-mono); font-size: 11px; color: var(--fg3); width: 90px; flex-shrink: 0; letter-spacing: 0.06em; }
  .sample { color: var(--fg1); }
  .muted { color: var(--fg2); }
  .eyebrow-sample {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--fg2);
  }
</style>
</head>
<body>
<div class="card">
  <span class="eyebrow">Body & UI · Montserrat 400 / 500 / 600</span>
  <div class="row-t"><span class="label">eyebrow / 12</span><span class="eyebrow-sample">Section · One</span></div>
  <div class="row-t"><span class="label">body-lg / 18</span><span class="sample" style="font-size:18px; line-height:1.6;">A calm, confident voice. Personal, but precise.</span></div>
  <div class="row-t"><span class="label">body / 16</span><span class="sample" style="font-size:16px; line-height:1.5;">I design and build interfaces. Mostly for the web, sometimes elsewhere.</span></div>
  <div class="row-t"><span class="label">body-sm / 14</span><span class="sample muted" style="font-size:14px;">Stockholm, Sweden — currently freelance</span></div>
  <div class="row-t"><span class="label">small / 12</span><span class="sample muted" style="font-size:12px;">Updated April 2026</span></div>
  <div class="row-t"><span class="label">label / 14</span><span class="sample" style="font-size:14px; font-weight:600;">Get in touch</span></div>
</div>
</body>
</html>
