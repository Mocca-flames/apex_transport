/**
 * Shared nav/footer loader
 * Fetches partial HTML files and injects them into placeholder elements.
 * Called before other scripts so nav.js / content.js / footer injection work immediately.
 */
(function () {
  'use strict';

  // ── helpers ──────────────────────────────────────────────────
  function inject(id, url) {
    var el = document.getElementById(id);
    if (!el) return;
    fetch(url, { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (html) {
        if (html) {
          el.innerHTML = html;
          document.dispatchEvent(new CustomEvent('nav:injected'));
        }
      })
      .catch(function () { /* leave empty — CSS fallback keeps layout */ });
  }

  // ── load nav + footer ─────────────────────────────────────────
  inject('site-nav', '/partials/nav.html');
  inject('site-footer', '/partials/footer.html');
})();
