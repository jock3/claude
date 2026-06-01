/* Footer.jsx */
function Footer() {
  return (
    <footer className="footer-root">
      <div className="shell footer-inner">
        <div className="footer-logo">
          <img src="../../assets/logo-white.png" alt="" />
          <div className="footer-meta">© 2026 · Gustav Mattsson</div>
          <div className="footer-meta">0100&nbsp;0111</div>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <h4>Site</h4>
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#notes">Notes</a>
          </div>
          <div className="footer-col">
            <h4>Elsewhere</h4>
            <a href="#">GitHub</a>
            <a href="#">Read.cv</a>
            <a href="#">LinkedIn</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="mailto:hej@gustav.se">hej@gustav.se</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

window.Footer = Footer;
