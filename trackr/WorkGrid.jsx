/* Nav.jsx — sticky top nav */
const { useState } = React;

function Nav({ active = "Work", onNav = () => {} }) {
  const items = ["Work", "About", "Notes", "Contact"];
  return (
    <header className="nav-root">
      <div className="shell nav-inner">
        <a className="nav-logo" href="#" onClick={(e) => { e.preventDefault(); onNav("Home"); }}>
          <img src="../../assets/logo-white.png" alt="" />
          <span>Gustav Mattsson</span>
        </a>
        <nav className="nav-links">
          {items.map((it) => (
            <a
              key={it}
              href={`#${it.toLowerCase()}`}
              className={`nav-link ${active === it ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); onNav(it); }}
            >
              {it}
            </a>
          ))}
          <a className="btn btn-primary" href="#contact" onClick={(e) => { e.preventDefault(); onNav("Contact"); }}>
            Get in touch <span>→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

window.Nav = Nav;
