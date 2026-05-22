/**
 * Parallax effects driven by Lenis scroll
 * Elements with `data-parallax` attribute receive a translate3d transform.
 *
 * Speed reference (DESIGN.md §5.3):
 *   0.15–0.3  — subtle hero background images
 *   0.4–0.6   — medium floating decoration
 *   -0.1 to -0.2 — floats upward against scroll (motifs, ghost text)
 */
(function() {
  var retry = 0;
  function init() {
    if (!window.lenisInstance) {
      if (++retry < 5) { setTimeout(init, retry * 50); return; }
      requestIdleCallback(init);
      return;
    }
    var lenis = window.lenisInstance;
    var layers = document.querySelectorAll('[data-parallax]');
    var ticking = false;

    lenis.on('scroll', function({ scroll }) {
      if (!ticking) {
        requestAnimationFrame(function() {
          layers.forEach(function(el) {
            var speed = parseFloat(el.dataset.parallax) || 0.3;
            var section = el.closest('section');
            if (!section) return;
            var rect = section.getBoundingClientRect();
            var center = rect.top + rect.height / 2;
            var delta = (window.innerHeight / 2 - center) * speed;
            el.style.transform = 'translate3d(0,' + delta.toFixed(2) + 'px,0)';
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  init();
})();
