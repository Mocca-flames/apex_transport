/**
 * Shared nav/footer loader
 * Fetches partial HTML files and injects them into placeholder elements.
 * Called before other scripts so nav.js / content.js / footer injection work immediately.
 */
(function () {
  'use strict';

  // ── helpers ──────────────────────────────────────────────────
  function inject(id, url, eventName) {
    var el = document.getElementById(id);
    if (!el) return;
    fetch(url, { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (html) {
        if (html) {
          el.innerHTML = html;
          if (eventName) {
            document.dispatchEvent(new CustomEvent(eventName));
          }
        }
      })
      .catch(function () { /* leave empty — CSS fallback keeps layout */ });
  }

  inject('site-nav', '/partials/nav.html', 'nav:injected');
  inject('site-footer', '/partials/footer.html');
})();
