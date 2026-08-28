(function () {
  if (document.querySelector('.g-sidebar')) return;

  var scriptSrc = document.currentScript ? document.currentScript.src : '';
  var base = scriptSrc ? new URL('..', scriptSrc).pathname : '/';
  if (!base.endsWith('/')) base += '/';

  var path = location.pathname;
  function isActive(rel) {
    if (rel === '') return path === base || path === base.replace(/\/$/, '');
    return path.startsWith(base + rel);
  }

  var MOON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var SUN  = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';

  function isDark() {
    return (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
  }

  var apps = [
    { rel: '',                  cls: 'ib-home',      label: 'Hem',       icon: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
    { rel: 'apps/portfolio/',   cls: 'ib-portfolio', label: 'Portfolio', icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' },
    { rel: 'apps/kampanj/',     cls: 'ib-kampanj',   label: 'Kampanj',   icon: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>' },
    { rel: 'apps/seo-audit/',   cls: 'ib-seo',       label: 'SEO',       icon: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>' },
    { rel: 'apps/brus-fx/',     cls: 'ib-brus',      label: 'Brus',      icon: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 8h.01"/><path d="M16 8h.01"/><path d="M12 12h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/>' },
    { rel: 'apps/musictheory/', cls: 'ib-musik',     label: 'Musik',     icon: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>' },
  ];

  var logoSvg = '<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 623.04 583.35" aria-hidden="true" style="height:26px;width:auto"><defs><style>.lc1{font-size:193.17px}.lc1,.lc2{font-family:Montserrat-Bold,Montserrat;font-weight:700;opacity:.91}.lc2{font-size:189.12px}</style></defs><path d="M232.17,3c7.02-7.42,19.19.1,15.62,9.67-9.95,26.68-27.78,61.43-58.57,88.15-55.09,47.8-70.9,80.05-80.29,122.79-.83,3.78-4.33,6.37-8.19,6.09l-13.61-.98c-5.61-.4-9.92-5.11-9.82-10.73.52-29.28,13.8-103.04,70.2-141.85C183.44,51.41,212.65,23.65,232.17,3Z"/><path d="M74.3,234.65s-22.36,17.42-24.83,29.76c-1.77,8.84,31.32,11.98,50.2,13.05,6.54.37,11.77-5.35,10.78-11.82-1.08-7.08-2.45-16.17-3.61-24.42-2.35-16.66-32.55-6.56-32.55-6.56Z"/><path d="M51.87,290.51s-38.3,9.33-38.3,64.83,12.33,99.9-13.57,145.54c0,0,96.6-69.22,110.75-161.62,3.8-24.79-9.47-49.48-32.56-59.27-8.67-3.68-14.96,9.96-26.32,10.52Z"/><text class="lc1" transform="translate(144.86 300.16)"><tspan x="0" y="0">0</tspan><tspan x="130" y="0">100</tspan></text><text class="lc2" transform="translate(259.2 447.19) scale(1.04 1)"><tspan x="0" y="0">0</tspan><tspan x="127.28" y="0">111</tspan></text></svg>';

  var items = apps.map(function (a) {
    var href = base + a.rel;
    var act  = isActive(a.rel);
    return '<a href="' + href + '" class="g-item' + (act ? ' g-active' : '') + '" title="' + a.label + '" aria-label="' + a.label + '"' + (act ? ' aria-current="page"' : '') + '>'
      + '<span class="g-bubble ' + a.cls + '" aria-hidden="true">'
      + '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' + a.icon + '</svg>'
      + '</span><span class="g-label">' + a.label + '</span></a>';
  }).join('');

  var style = document.createElement('style');
  style.textContent = [
    '.g-sidebar{position:fixed;left:20px;top:20px;width:72px;z-index:9999;border-radius:9999px;',
    'background:rgba(16,16,16,.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);',
    'border:1px solid rgba(255,255,255,.1);box-shadow:0 4px 24px rgba(0,0,0,.3),0 1px 4px rgba(0,0,0,.15);',
    'display:flex;flex-direction:column;align-items:center;padding:14px 0;overflow:hidden;',
    'animation:gDrop 500ms cubic-bezier(.34,1.56,.64,1) both}',
    '[data-theme=light] .g-sidebar{background:rgba(248,248,246,.94);border-color:rgba(0,0,0,.1);box-shadow:0 4px 24px rgba(0,0,0,.12)}',
    '@keyframes gDrop{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}',
    '.g-logo{display:flex;align-items:center;justify-content:center;width:42px;height:38px;flex-shrink:0;',
    'color:rgba(240,240,238,.9);text-decoration:none;transition:filter 200ms ease;margin-bottom:2px}',
    '[data-theme=light] .g-logo{color:rgba(20,20,18,.85)}',
    '.g-logo:hover{filter:drop-shadow(0 0 10px rgba(34,211,238,.5))}',
    '.g-sep{width:28px;height:1px;background:rgba(255,255,255,.1);margin:5px 0;flex-shrink:0}',
    '[data-theme=light] .g-sep{background:rgba(0,0,0,.1)}',
    '.g-spacer{flex:1}',
    '.g-apps{display:flex;flex-direction:column;align-items:center;gap:10px;width:100%;padding:0 4px;box-sizing:border-box}',
    '.g-item{display:flex;flex-direction:column;align-items:center;gap:5px;text-decoration:none;color:inherit;',
    'border:0;outline:none;cursor:pointer;width:60px;border-radius:10px;padding:7px 0 6px;flex-shrink:0;',
    'transition:background 180ms ease}',
    '.g-item:hover{background:rgba(255,255,255,.07)}',
    '[data-theme=light] .g-item:hover{background:rgba(0,0,0,.06)}',
    '.g-item:focus-visible{box-shadow:0 0 0 2px #22D3EE;outline:none}',
    '.g-bubble{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;',
    'flex-shrink:0;transition:transform 220ms cubic-bezier(.34,1.56,.64,1),box-shadow 200ms ease}',
    '.g-item:hover .g-bubble{transform:scale(1.1) translateY(-2px);box-shadow:0 5px 14px rgba(0,0,0,.22)}',
    '.g-active .g-bubble{box-shadow:0 0 0 1.5px rgba(34,211,238,.6),0 0 14px rgba(34,211,238,.25)}',
    '.g-active .g-label{color:#22D3EE!important;font-weight:600}',
    '.ib-home     {background:linear-gradient(135deg,rgba(255,88,45,.22),rgba(255,120,55,.32));border:1px solid rgba(255,88,45,.42);color:#FF7040}',
    '.ib-portfolio{background:linear-gradient(135deg,rgba(34,211,238,.14),rgba(6,182,212,.22));border:1px solid rgba(34,211,238,.28);color:#22D3EE}',
    '.ib-kampanj  {background:linear-gradient(135deg,rgba(245,158,11,.15),rgba(251,191,36,.22));border:1px solid rgba(245,158,11,.30);color:#FCD34D}',
    '.ib-seo      {background:linear-gradient(135deg,rgba(99,102,241,.15),rgba(129,140,248,.23));border:1px solid rgba(99,102,241,.28);color:#A5B4FC}',
    '.ib-brus     {background:linear-gradient(135deg,rgba(214,255,61,.12),rgba(184,232,50,.18));border:1px solid rgba(214,255,61,.28);color:#D6FF3D}',
    '.ib-musik    {background:linear-gradient(135deg,rgba(168,85,247,.16),rgba(99,102,241,.22));border:1px solid rgba(168,85,247,.30);color:#C084FC}',
    '.g-label{font-size:10px;font-family:Montserrat,system-ui,sans-serif;font-weight:500;',
    'color:rgba(255,255,255,.35);text-align:center;line-height:1;transition:color 150ms ease}',
    '[data-theme=light] .g-label{color:rgba(0,0,0,.35)}',
    '.g-item:hover .g-label{color:rgba(255,255,255,.65)}',
    '[data-theme=light] .g-item:hover .g-label{color:rgba(0,0,0,.6)}',
    '.g-theme{background:transparent;border:0;color:rgba(255,255,255,.4);padding:0;border-radius:50%;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;width:40px;height:40px;flex-shrink:0;',
    'transition:color 180ms ease,background 180ms ease,transform 300ms cubic-bezier(.34,1.56,.64,1)}',
    '[data-theme=light] .g-theme{color:rgba(0,0,0,.4)}',
    '.g-theme:hover{color:rgba(255,255,255,.9);background:rgba(255,255,255,.08);transform:rotate(18deg) scale(1.1)}',
    '[data-theme=light] .g-theme:hover{color:rgba(0,0,0,.85);background:rgba(0,0,0,.06)}',
    '.g-theme:active{transform:rotate(36deg) scale(.9)}',
    '@media(max-width:600px){',
    '.g-sidebar{left:50%;top:auto;bottom:16px;transform:translateX(-50%);width:auto;max-width:calc(100vw - 32px);',
    'flex-direction:row;padding:8px 10px;border-radius:9999px}',
    '.g-sep{width:1px;height:24px;margin:0 4px}.g-spacer{display:none}',
    '.g-apps{flex-direction:row;gap:4px;padding:0;width:auto}',
    '.g-item{flex-direction:row;width:auto;padding:7px 8px;border-radius:8px;gap:0}',
    '.g-label{display:none}.g-bubble{width:34px;height:34px}}',
    '@media(max-width:380px){.g-bubble{width:30px;height:30px;border-radius:8px}.g-bubble svg{width:14px;height:14px}}',
  ].join('');
  document.head.appendChild(style);

  var aside = document.createElement('aside');
  aside.className = 'g-sidebar';
  aside.setAttribute('aria-label', 'Navigering');
  aside.innerHTML = '<a href="' + base + '" class="g-logo" title="AI Labb" aria-label="AI Labb">' + logoSvg + '</a>'
    + '<div class="g-sep" aria-hidden="true"></div>'
    + '<div class="g-apps">' + items + '</div>'
    + '<div class="g-spacer" aria-hidden="true"></div>'
    + '<div class="g-sep" aria-hidden="true"></div>'
    + '<button class="g-theme" aria-label="Byt tema" title="Byt tema">' + (isDark() ? MOON : SUN) + '</button>';

  document.body.appendChild(aside);

  aside.querySelector('.g-theme').addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('ailabb_theme', next); } catch (e) {}
    this.innerHTML = next === 'dark' ? MOON : SUN;
  });
})();
