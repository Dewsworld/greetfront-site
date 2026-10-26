/* Greetfront site: nav, theme toggle, call-strip stepper, copy button. No network, no tracking. */
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

  /* call-strip stepper */
  var strip = d.querySelector('.strip');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (strip && !reduce) {
    var panels = strip.querySelectorAll('.strip__panel'), i = 0, timer = null;
    var show = function () {
      panels.forEach(function (p, n) { p.classList.toggle('is-active', n === i); });
    };
    var start = function () { if (!timer) timer = setInterval(function () { i = (i + 1) % panels.length; show(); }, 2800); };
    var stop = function () { clearInterval(timer); timer = null; };
    strip.classList.remove('strip--static');
    show(); start();
    strip.addEventListener('mouseenter', stop);
    strip.addEventListener('mouseleave', start);
    strip.addEventListener('focusin', stop);
    strip.addEventListener('focusout', start);
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
