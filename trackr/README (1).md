/* === Personal site — kit-local styles. Imports tokens. === */
@import url("../../colors_and_type.css");

* { box-sizing: border-box; }
body { margin: 0; }

/* Layout */
.shell { max-width: 1120px; margin: 0 auto; padding: 0 32px; }
.section { padding: 96px 0; }
.section-tight { padding: 64px 0; }

/* Nav */
.nav-root {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in oklch, var(--color-bg) 80%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}
.nav-inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
.nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; border: 0; }
.nav-logo img { width: 28px; height: 28px; }
.nav-logo span {
  font-family: var(--font-display); font-size: 14px; color: var(--fg1);
  font-weight: 600; letter-spacing: -0.01em;
}
.nav-links { display: flex; gap: 32px; align-items: center; }
.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--fg2);
  text-decoration: none;
  border: 0;
  position: relative;
  transition: color 200ms var(--ease-out);
}
.nav-link:hover, .nav-link.active { color: var(--fg1); border: 0; }
.nav-link.active::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: -22px;
  height: 2px;
  background: var(--color-red);
  border-radius: 2px;
}

/* Hero */
.hero { display: grid; grid-template-columns: 1.4fr 1fr; gap: 64px; align-items: center; }
.hero h1 { font-size: 60px; line-height: 1.05; text-wrap: balance; }
.hero h1 .accent { white-space: nowrap; }
.hero .lead {
  font-size: 20px;
  color: var(--fg2);
  max-width: 520px;
  line-height: 1.5;
}
.hero .accent { font-family: "Patrick Hand", cursive; color: var(--color-red); font-size: 28px; }
.hero-portrait {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  aspect-ratio: 4/5;
  background: var(--color-surface);
}
.hero-portrait img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.05); display: block; }
.hero-meta { display: flex; gap: 24px; margin-top: 24px; font-family: var(--font-mono); font-size: 12px; color: var(--fg3); letter-spacing: 0.08em; }
.hero-meta span::before { content: "● "; color: var(--color-red); margin-right: 6px; font-size: 9px; }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-display); font-size: 14px; font-weight: 600;
  padding: 12px 20px; border-radius: 8px; border: 1px solid transparent;
  cursor: pointer; line-height: 1; text-decoration: none;
  transition: all 200ms var(--ease-out);
}
.btn:hover { transform: translateY(-1px); }
.btn:active { transform: translateY(0) scale(0.98); }
.btn-primary { background: var(--color-red); color: var(--color-text); }
.btn-primary:hover { background: var(--color-red-hover); }
.btn-secondary { background: var(--color-surface-2); color: var(--color-text); border-color: var(--color-border); }
.btn-secondary:hover { background: var(--color-surface-3); }
.btn-ghost { background: transparent; color: var(--color-text); border-color: var(--color-border); }
a.btn { border: 1px solid transparent; }
a.btn-secondary, a.btn-ghost { border: 1px solid var(--color-border); }

/* Section header */
.section-head { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 40px; }
.section-head h2 { font-size: 40px; margin: 0; }

/* Work grid */
.filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px; }
.pill {
  font-size: 13px; padding: 6px 14px; border-radius: 999px;
  background: transparent; color: var(--fg2);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 200ms var(--ease-out);
  font-family: inherit;
}
.pill:hover { color: var(--fg1); }
.pill.active { background: var(--color-red); border-color: var(--color-red); color: var(--color-text); }

.work-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.work-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  cursor: pointer;
  transition: all 200ms var(--ease-out);
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid var(--color-border);
}
.work-card:hover { background: var(--color-surface-2); transform: translateY(-2px); box-shadow: var(--shadow-lg); border-color: var(--color-border-strong); }
.work-card .meta { font-family: var(--font-mono); font-size: 11px; color: var(--fg3); letter-spacing: 0.08em; }
.work-card h3 { font-size: 22px; margin: 0; font-weight: 700; letter-spacing: -0.01em; }
.work-card p { font-size: 14px; color: var(--fg2); margin: 0; line-height: 1.5; }
.work-card .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
.work-card .footer .read { color: var(--color-blue); font-size: 13px; }
.work-card .thumb {
  aspect-ratio: 16/10;
  background: linear-gradient(135deg, var(--color-surface-2), var(--color-surface-3));
  border-radius: 8px;
  border: 1px solid var(--color-border);
  margin-bottom: 4px;
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  color: var(--fg3);
  font-family: var(--font-mono);
  font-size: 11px;
}
.work-card .thumb.red { background: linear-gradient(135deg, #2a1414, #1a0a0a); }
.work-card .thumb.blue { background: linear-gradient(135deg, #14202a, #0a121a); }

/* About */
.about { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
.about p { font-size: 17px; color: var(--fg2); line-height: 1.6; }
.about p strong { color: var(--fg1); font-weight: 600; }
.skills { display: flex; flex-direction: column; gap: 0; border-top: 1px solid var(--color-border); }
.skill {
  display: flex; justify-content: space-between; padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
}
.skill .k { color: var(--fg1); font-weight: 500; }
.skill .v { color: var(--fg3); font-family: var(--font-mono); font-size: 12px; }

/* Contact */
.contact { max-width: 560px; margin: 0 auto; text-align: center; }
.contact h2 { font-size: 48px; margin-bottom: 12px; }
.contact .lead { font-size: 17px; color: var(--fg2); margin-bottom: 32px; line-height: 1.5; }
.contact-form { display: flex; gap: 8px; }
.contact-form input {
  flex: 1;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 14px 16px;
  font-family: var(--font-body); font-size: 15px;
  outline: none;
  transition: border-color 200ms var(--ease-out);
}
.contact-form input:focus { border-color: var(--color-blue); box-shadow: 0 0 0 3px rgba(46,111,212,0.25); }
.contact-note { margin-top: 16px; font-family: "Patrick Hand", cursive; font-size: 18px; color: var(--color-red); }

/* Footer */
.footer-root {
  border-top: 1px solid var(--color-border);
  padding: 48px 0 64px;
  margin-top: 64px;
}
.footer-inner { display: flex; justify-content: space-between; align-items: flex-start; gap: 32px; }
.footer-logo img { width: 32px; height: 32px; }
.footer-meta { font-family: var(--font-mono); font-size: 11px; color: var(--fg3); letter-spacing: 0.06em; margin-top: 8px; }
.footer-cols { display: flex; gap: 48px; }
.footer-col { display: flex; flex-direction: column; gap: 8px; }
.footer-col h4 { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg3); margin: 0 0 4px; font-weight: 600; }
.footer-col a { color: var(--fg2); font-size: 14px; border: 0; }
.footer-col a:hover { color: var(--fg1); }

/* Hero brush bg */
.hero-brush {
  position: absolute;
  right: -120px;
  top: -80px;
  width: 520px;
  height: 520px;
  opacity: 0.04;
  pointer-events: none;
  transform: rotate(15deg);
}
.hero-brush img { width: 100%; height: 100%; object-fit: contain; }
.hero-wrap { position: relative; overflow: hidden; }
