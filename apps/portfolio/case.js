/* =========================================================
   Portfolio case study — shared behaviour
   1. Hide the embedded app's own navigation inside the demo.
   2. Expand / collapse a live demo to fill the screen.
   Supports any number of .cs-preview blocks on a page (e.g. a
   desktop + a mobile preview side by side), each with its own
   expand button.
   ========================================================= */
(function () {
  /* ── 1. Strip the app's own nav from same-origin demos ──
     The rule persists in <head>, so it also covers SPA navs
     that mount after the load event. (No-op cross-origin.) */
  var HIDE_CSS =
    '.sidebar,.tl-sidebar,.kl-top-nav,.sa-top-nav,.t3-top-nav{display:none !important;}';

  function injectInto(frame) {
    try {
      var doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
      if (!doc || !doc.head) return;
      if (doc.getElementById('cs-embed-style')) return;
      var s = doc.createElement('style');
      s.id = 'cs-embed-style';
      s.textContent = HIDE_CSS;
      doc.head.appendChild(s);
    } catch (e) { /* not ready / cross-origin — ignore */ }
  }

  Array.prototype.forEach.call(document.querySelectorAll('.cs-frame-holder iframe'), function (frame) {
    frame.addEventListener('load', function () {
      injectInto(frame);
      /* belt-and-suspenders for SPA navs that mount slightly later */
      setTimeout(function () { injectInto(frame); }, 300);
      setTimeout(function () { injectInto(frame); }, 1200);
    });
    injectInto(frame);
  });

  /* ── 2. Expand / collapse each demo ── */
  var previews = Array.prototype.slice.call(document.querySelectorAll('.cs-preview'));

  function wire(preview) {
    var btn = preview.querySelector('.cs-expand-btn');
    if (!btn) return;
    function setExpanded(on) {
      preview.classList.toggle('cs-expanded', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.title = on ? 'Förminska demon' : 'Expandera demon';
      btn.setAttribute('aria-label', btn.title);
      document.documentElement.style.overflow = on ? 'hidden' : '';
    }
    preview._csCollapse = function () { setExpanded(false); };
    btn.addEventListener('click', function () {
      setExpanded(!preview.classList.contains('cs-expanded'));
    });
  }

  previews.forEach(wire);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    previews.forEach(function (p) {
      if (p.classList.contains('cs-expanded') && p._csCollapse) p._csCollapse();
    });
  });
})();
