/* Greetfront site: nav, theme toggle, hero call timer, copy button. No network, no tracking. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;

  /* nav panel */
  var tog = d.querySelector('.nav__toggle'), panel = d.getElementById('nav-panel');
  function setNav(open) {
    if (!tog || !panel) return;
    tog.setAttribute('aria-expanded', open ? 'true' : 'false');
    tog.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.classList.toggle('is-open', open);
  }
  if (tog && panel) {
    tog.addEventListener('click', function () { setNav(tog.getAttribute('aria-expanded') !== 'true'); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) { setNav(false); tog.focus(); }
    });
    d.addEventListener('click', function (e) {
      if (panel.classList.contains('is-open') && !panel.contains(e.target) && !tog.contains(e.target)) setNav(false);
    });
  }

  /* theme toggle */
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function labelToggles() {
    var dark = isDark();
    d.querySelectorAll('.theme-toggle').forEach(function (b) {
      b.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      var s = b.querySelector('.theme-toggle__text');
      if (s) s.textContent = dark ? 'Light theme' : 'Dark theme';
    });
  }
  d.querySelectorAll('.theme-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('gf-theme', next); } catch (e) {}
      labelToggles();
    });
  });
  labelToggles();

  /* hero call timer: counts up from the data-tick start; static when reduced motion is requested */
  var clk = d.querySelector('.phone__time');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (clk && !reduce) {
    var secs = parseInt(clk.getAttribute('data-tick'), 10) || 0;
    setInterval(function () {
      secs = (secs + 1) % 240; /* calls are capped at 4 minutes */
      clk.textContent = '0' + Math.floor(secs / 60) + ':' + ('0' + (secs % 60)).slice(-2);
    }, 1000);
  }

  /* copy button (demo page) */
  var cb = d.querySelector('.copy-btn'), out = d.getElementById('copy-status');
  if (cb) {
    cb.addEventListener('click', function () {
      var src = d.getElementById(cb.getAttribute('data-copy')), text = src ? src.textContent.trim() : '';
      var done = function () { if (out) out.textContent = 'Copied'; };
      var fallback = function () {
        if (!src) return;
        var r = d.createRange(); r.selectNodeContents(src);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        if (out) out.textContent = 'Number selected. Copy it with your keyboard.';
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    });
  }
}());
