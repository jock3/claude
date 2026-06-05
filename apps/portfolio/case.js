/* =========================================================
   Portfolio case study — shared behaviour
   1. Hide the embedded app's own navigation inside the demo.
   2. Expand / collapse the live demo to fill the demo area.
   ========================================================= */
(function () {
  /* ── 1. Strip the app's own nav from the embedded demo ──
     Same-origin, so we can inject a style into the iframe.
     The rule persists in <head>, so it also covers SPA navs
     that mount after the load event. */
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

  var frame = document.querySelector('.cs-frame-holder iframe');
  if (frame) {
    frame.addEventListener('load', function () {
      injectInto(frame);
      /* belt-and-suspenders for SPA navs that mount slightly later */
      setTimeout(function () { injectInto(frame); }, 300);
      setTimeout(function () { injectInto(frame); }, 1200);
    });
    injectInto(frame);
  }

  /* ── 2. Expand / collapse the demo ── */
  var preview = document.querySelector('.cs-preview');
  var btn = document.querySelector('.cs-expand-btn');

  if (preview && btn) {
    function setExpanded(on) {
      preview.classList.toggle('cs-expanded', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.title = on ? 'Förminska demon' : 'Expandera demon';
      btn.setAttribute('aria-label', btn.title);
      document.documentElement.style.overflow = on ? 'hidden' : '';
    }
    btn.addEventListener('click', function () {
      setExpanded(!preview.classList.contains('cs-expanded'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && preview.classList.contains('cs-expanded')) setExpanded(false);
    });
  }
})();
