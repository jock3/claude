/* Hero.jsx */
function Hero({ onCta }) {
  return (
    <section className="section hero-wrap">
      <div className="hero-brush" aria-hidden="true">
        <img src="../../assets/logo-white.png" alt="" />
      </div>
      <div className="shell hero">
        <div>
          <span className="eyebrow" style={{ color: "var(--fg2)", letterSpacing: "0.14em" }}>
            Designer &amp; developer · Stockholm
          </span>
          <h1 style={{ marginTop: 16 }}>
            <span style={{ display: "block", fontSize: "0.55em", fontWeight: 500, color: "var(--fg2)", letterSpacing: "-0.01em", marginBottom: 4 }}>Hej, jag heter</span>
            <span className="accent" style={{ display: "inline-block", transform: "rotate(-2deg)", fontSize: "1.4em", lineHeight: 1 }}>Gustav.</span>
          </h1>
          <p className="lead">
            I design and build interfaces — mostly for the web, sometimes
            elsewhere. Currently freelance, currently picky about what I
            take on, currently happy.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <a className="btn btn-primary" href="#work" onClick={(e) => { e.preventDefault(); onCta && onCta("work"); }}>
              See selected work <span>→</span>
            </a>
            <a className="btn btn-secondary" href="#contact" onClick={(e) => { e.preventDefault(); onCta && onCta("contact"); }}>
              Send a note
            </a>
          </div>
          <div className="hero-meta">
            <span>Available, May 2026</span>
            <span>Stockholm · CET</span>
          </div>
        </div>
        <div className="hero-portrait">
          <img src="../../assets/gustav-portrait.jpg" alt="Gustav Mattsson, portrait" />
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
