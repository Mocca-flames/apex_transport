/**
 * Scroll Reveal — IntersectionObserver
 * Adds .is-visible to elements with .reveal/.reveal-up/.reveal-left/.reveal-right
 * when they enter the viewport.
 */
(function() {
  // Only run if user allows motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Force all visible immediately
    document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right')
            .forEach(function(el) { el.classList.add('is-visible'); });
    return;
  }

  var elements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(function(el) { io.observe(el); });

  // Re-scan when dynamically injected content (e.g. principles via content.js)
  // is added after the initial page load.
  document.addEventListener('apexContentReady', function _rebindReveal() {
    var newEls = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right:not([data-reveal-bound])');
    newEls.forEach(function(el) {
      el.classList.add('is-visible');
    });
  });
})(window);
