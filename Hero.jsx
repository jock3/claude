<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Voice — do & don't</title>
<link rel="stylesheet" href="_card.css" />
<style>
  .card { padding: 24px 28px; gap: 12px; }
  .row-v { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .col-v {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .col-v .label { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; }
  .do .label { color: #5BAE6E; }
  .dont .label { color: var(--color-red); }
  .quote { font-size: 15px; line-height: 1.45; color: var(--fg1); }
  .quote.muted { color: var(--fg2); }
</style>
</head>
<body>
<div class="card">
  <span class="eyebrow">Voice · do &amp; don't</span>
  <div class="row-v">
    <div class="col-v do">
      <span class="label">DO — calm, first-person</span>
      <span class="quote">"Hej, jag heter Gustav. Jag designar och bygger gränssnitt."</span>
      <span class="quote">"Three projects I'm proud of."</span>
      <span class="quote">"Send a note →"</span>
    </div>
    <div class="col-v dont">
      <span class="label">DON'T — generic, shouty, buzzy</span>
      <span class="quote muted">"Welcome to my portfolio! 🚀"</span>
      <span class="quote muted">"Innovative design solutions for the modern web."</span>
      <span class="quote muted">"CLICK HERE TO LEARN MORE"</span>
    </div>
  </div>
</div>
</body>
</html>
