<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Hand & Mono</title>
<link rel="stylesheet" href="_card.css" />
<style>
  .card { padding: 24px 28px; gap: 16px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; flex: 1; }
  .pane {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: space-between;
  }
  .role { font-family: var(--font-mono); font-size: 11px; color: var(--fg3); letter-spacing: 0.06em; }
  .hand-sample { font-family: "Patrick Hand", cursive; font-size: 36px; color: var(--color-red); line-height: 1.1; }
  .hand-note { font-family: "Patrick Hand", cursive; font-size: 18px; color: var(--fg1); }
  .mono-sample { font-family: var(--font-mono); font-size: 18px; color: var(--fg1); }
  .mono-meta { font-family: var(--font-mono); font-size: 12px; color: var(--fg2); letter-spacing: 0.04em; }
  .meta { font-size: 12px; color: var(--fg2); line-height: 1.4; }
</style>
</head>
<body>
<div class="card">
  <span class="eyebrow">Accent · Hand & Mono</span>
  <div class="grid">
    <div class="pane">
      <div>
        <div class="role">Patrick Hand · accent only</div>
        <div class="hand-sample">made&nbsp;by&nbsp;hand</div>
        <div class="hand-note">a small note in the margin →</div>
      </div>
      <div class="meta">Annotations, signatures, never body copy.</div>
    </div>
    <div class="pane">
      <div>
        <div class="role">Mono · technical</div>
        <div class="mono-sample">0100&nbsp;0111</div>
        <div class="mono-meta">v2.4.0 · build 8a3f1c · 2026</div>
      </div>
      <div class="meta">Code, timestamps, the binary G.</div>
    </div>
  </div>
</div>
</body>
</html>
