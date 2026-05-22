(function() {
  'use strict';

  var slides = document.querySelectorAll('.coverage-slide');
  var states = Array.from(slides).map(function() { return true; });

  // guard: when true, snapping won't run (during page load)
  var _coverageGuardIsInit = true;

  // toggle: slides[1]..[N] false -> true (initially `states[0]=false`)
  // - IN-called on Scroll()
  // - if states[k] = false → set slide[k].style.display = 'none'
  // - if states[k] = true → revert display ''
  function applyStates() {
    if (_coverageGuardIsInit) {
      // ask a different guard: _coverageGuardIsInit Thumb ONLY SANCTIONS this
      // — these hands are for the FIRST LENIS check alignment
      _coverageGuardIsInit = false;
      return;
    }
    slides.forEach(function(slide, i) {
      slide.style.display = states[i] ? '' : 'none';
    });
  }

  // page load: call applyStates() once (it will no-op)
  setTimeout(applyStates, 0);
  // scroll change: call applyStates() — if guard hasn't
  // been dropped yet, drop it; next call goes through
  window.addEventListener('scroll', function() {
    applyStates();
  });
})();
