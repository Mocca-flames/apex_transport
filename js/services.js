// services.js
// Scroll-driven service panels — tied to Lenis smooth scroll (desktop)
// Falls back to native scroll on mobile — same logic, no Lenis dependency.
// Requires: scroll.js (window.getLenis)

(function() {
  var SERVICE_COUNT = 6;
  var _bootGuard = true;   /* discard the very first onScroll call (page-load race) */

  function initServices() {
    var track    = document.getElementById('services');
    var sticky   = document.querySelector('.services-sticky');
    var panels   = document.querySelectorAll('.services-panel');
    var images   = document.querySelectorAll('.services-image');
    var fill     = document.getElementById('js-progress-fill');
    var dotsWrap = document.getElementById('js-progress-dots');
    var lenis    = window.getLenis ? window.getLenis() : null;

    console.log('[services] init', {
      track: !!track, panels: panels.length, images: images.length,
      fill: !!fill, dotsWrap: !!dotsWrap, lenis: !!lenis,
       viewportW: window.innerWidth, viewportH: window.visualViewport ? window.visualViewport.height : window.innerHeight,
     });
      if (!track) { console.error('[services] ABORT: #services track element not found'); return; }

    /* ── Late-DOM guard: if panels/images aren't ready at init time
     *  we don't abort — we schedule flushCheck retries via setTimeout
     *  and a MutationObserver so the section recovers as soon as
     *  content.js calls buildAll() and renders the panels. ────────── */
    if (!panels.length) {
      console.warn('[services] .services-panel not found at init — scheduling flushCheck retries');
    }

    /* ── Visibility helper ────────────────────────────────────────────
     * setStickyVisible() is the single source of truth for show/hide.
     * - is-visible drives CSS opacity/transform (paired with
     *   pointer-events via the CSS rules described in the file header).
     * - inert removes the panel from tab order and the a11y tree when
     *   hidden so keyboard/screen-reader users can't land inside it.
     * ─────────────────────────────────────────────────────────────── */
    function setStickyVisible(visible) {
      if (!sticky) return;
      sticky.classList.toggle('is-visible', visible);
      if (visible) {
        sticky.removeAttribute('inert');
      } else {
        sticky.setAttribute('inert', '');
      }
    }

    /* Start hidden immediately */
    setStickyVisible(false);

    // ── Reset dots container before building ──────────────────
    if (dotsWrap) dotsWrap.innerHTML = '';

    // ── Build progress dots ────────────────────────────────────
    panels.forEach(function(_, i) {
      var dot = document.createElement('button');
      dot.className = 'services-progress__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Jump to service ' + (i + 1));
      dot.dataset.index = i;

      dot.addEventListener('click', function() {
        var vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        var trackTop    = track.offsetTop;
        var trackHeight = track.offsetHeight - vh;
        var targetY     = trackTop + (i / (SERVICE_COUNT - 1)) * trackHeight;
        if (lenis) {
          lenis.scrollTo(targetY, { duration: 1.2 });
        } else {
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      });

      if (dotsWrap) dotsWrap.appendChild(dot);
    });

    // ── Inject mobile images into each panel ──────────────────
    var isMobile = window.matchMedia('(max-width: 1024px)').matches;

    if (isMobile) {
      panels.forEach(function(panel) {
        var serviceIndex = parseInt(panel.dataset.service, 10);
        var img = images[serviceIndex] && images[serviceIndex].querySelector('img');
        if (!img) return;

        var mobileImg = document.createElement('img');
        mobileImg.className = 'services-panel__mobile-img';
        mobileImg.src     = img.src;
        mobileImg.alt     = img.alt;
        mobileImg.width   = img.width;
        mobileImg.height  = img.height;
        mobileImg.loading = 'lazy';

        panel.insertBefore(mobileImg, panel.firstChild);
      });
    }

    // ── Scroll-driven state ────────────────────────────────────
    var currentIndex = 0;

    /* panel 0 and image 0: set is-active explicitly at init.
       activateService skips index === currentIndex, so without this
       the first panel would never get the class on init */
    if (panels[0]) panels[0].classList.add('is-active');
    if (images[0]) images[0].classList.add('is-active');

    function activateService(index) {
      console.log('[services] activateService', { prev: currentIndex, next: index, changed: index !== currentIndex });
      if (index === currentIndex) return;
      var prev = currentIndex;
      currentIndex = index;

      /* CRITICAL: re-query DOM every call — buildAll/nav:injected can
         rebuild the section (innerHTML rewrite) between scroll events,
         leaving the initial NodeList stale. */
      var livePanels = document.querySelectorAll('.services-panel');
      var liveImages = document.querySelectorAll('.services-image');
      if (livePanels.length === 0) {
        console.warn('[services] activateService: no .services-panel found — skipping');
        return;
      }
      var prevP = livePanels[prev];
      var nextP = livePanels[index];
      if (prevP) { prevP.classList.remove('is-active'); prevP.classList.add('is-exiting'); }
      if (nextP) { nextP.classList.add('is-active'); }
      if (prevP) {
        setTimeout(function() {
          prevP.classList.remove('is-exiting');
        }, 550);
      }

      if (liveImages[prev]) liveImages[prev].classList.remove('is-active');
      if (liveImages[index]) liveImages[index].classList.add('is-active');

      var dots = dotsWrap ? dotsWrap.querySelectorAll('.services-progress__dot') : [];
      dots.forEach(function(dot, i) {
        dot.classList.toggle('is-active', i === index);
        dot.classList.toggle('is-past',   i < index);
      });
    }

    function onScroll() {
      /* The very first call fires during page-load (coverage.js performs
         an init scroll to its section), before layout is stable.
         Guard: drop the first call unconditionally so the sticky never
         shows while the page is still assembling. */
      if (_bootGuard) { _bootGuard = false; return; }

      setStickyVisible(false);

      var vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      /* On mobile, getBoundingClientRect().height can lag behind the CSS-computed
         track height (100svh) when the browser address bar expands/collapses.
         Use track.offsetHeight which is always in sync with the CSS layout. */
      var trackHeight = track.offsetHeight;
      var rect = track.getBoundingClientRect();
      var trackSpan = trackHeight - vh;

      if (trackSpan <= 0) return;

      var progress = -rect.top / trackSpan;
      if (progress < 0 || progress > 1) return;

      setStickyVisible(true);

      var seg = 1 / SERVICE_COUNT;
      var idx = Math.min(Math.floor(progress / seg), SERVICE_COUNT - 1);
      if (fill) fill.style.height = ((idx / (SERVICE_COUNT - 1)) * 100) + '%';
      activateService(idx);
    }

    // Run once on init, then subscribe
    onScroll();

    if (lenis) {
      lenis.on('scroll', onScroll);
    } else {
      /* Mobile and reduced-motion fallback: native scroll event */
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ── Mobile address bar handling ─────────────────────────────────
     * Chrome on Android expands/collapses its address bar on scroll,
     * causing window.visualViewport.height to change dynamically.
     * This breaks scroll-jacking because the track height (CSS 100svh)
     * stays fixed but vh changes. We listen to visualViewport resize
     * to recalculate correctly when the bar state changes. */
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', function() {
        onScroll();
      });
    }

    // ── Re-hide sticky and re-check after services DOM is mutated ────────
    //  buildServicesPanels() (content.js) rebuilds .services-panel elements
    //  via innerHTML after initServices() may have already exited with stale
    //  or absent panels. The observer re-queries the DOM after every mutation
    //  so the section recovers regardless of build order. ──────────────────
    var mo = new MutationObserver(function () {
      var livePanels = document.querySelectorAll('.services-panel');
      var liveImages = document.querySelectorAll('.services-image');
      if (!livePanels.length) return;
      panels = livePanels;
      images = liveImages;
      setStickyVisible(false);
      onScroll();
    });
    mo.observe(track, { childList: true, subtree: true });

    /* ── IntersectionObserver ─────────────────────────────────────── */
    if ('IntersectionObserver' in window) {
      (function observeTrack() {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              setStickyVisible(false);
              return;
            }
            var vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
            var trackHeight = track.offsetHeight;
            var topIO = entry.boundingClientRect.top;
            var spanIO = trackHeight - vh;
            if (spanIO <= 0) { setStickyVisible(false); return; }
            var p = -topIO / spanIO;
            if (p < 0 || p > 1) { setStickyVisible(false); return; }
            setStickyVisible(true);
            var seg = 1 / SERVICE_COUNT;
            var idx = Math.min(Math.floor(p / seg), SERVICE_COUNT - 1);
            if (fill) fill.style.height = ((idx / (SERVICE_COUNT - 1)) * 100) + '%';
            activateService(idx);
          });
        }, { rootMargin: '0px 0px -1px 0px' });

        io.observe(track);
      })();
    }

    /* tabindex stays — inert overrides it when the panel is hidden */
    sticky.setAttribute('tabindex', '0');

    // ── Keyboard: arrow keys ──────────────────────────────────
    sticky.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown' && currentIndex < SERVICE_COUNT - 1) {
        e.preventDefault();
        var dots = dotsWrap ? dotsWrap.querySelectorAll('.services-progress__dot') : [];
        if (dots[currentIndex + 1]) dots[currentIndex + 1].click();
      }
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        var dots = dotsWrap ? dotsWrap.querySelectorAll('.services-progress__dot') : [];
        if (dots[currentIndex - 1]) dots[currentIndex - 1].click();
      }
    });
  }

  window.initServices = initServices;

  /* ── Debug overlay: ?debug=1 URL param ─────────────────────────────────
   * Forces .services-sticky visible, outlines all key elements, and dumps
   * computed style for every panel. */
  if (('' + window.location.search).indexOf('debug=1') !== -1) {
    setTimeout(function() {
      var sticky = document.querySelector('.services-sticky');
      if (!sticky) { console.error('[services] DEBUG: .services-sticky not in DOM'); return; }

      /* Kill all transitions and force opacity */
      var allSvc = document.querySelectorAll('.services-sticky, .services-sticky *');
      allSvc.forEach(function(el) {
        el.style.opacity = '1';
        el.style.display = '';
        el.style.visibility = 'visible';
        el.style.pointerEvents = '';
        el.style.transition = 'none';
      });
      sticky.classList.add('is-visible');
      sticky.style.cssText = 'opacity:1 !important; display:flex !important; pointer-events:auto !important; z-index:999999 !important;';

      console.group('[services] DEBUG FORCE');
      setTimeout(function() {
        var ss = getComputedStyle(sticky);
        console.groupCollapsed('  STICKY (t=300ms)');
        'display,position,top,left,width,height,opacity,zIndex,isolation,overflow'.split(',').forEach(function(k) {
          console.log('  ' + k + ':', ss[k]);
        });
        console.log('  .is-visible:', sticky.classList.contains('is-visible'));
        console.groupEnd();

        console.groupCollapsed('  PANELS (t=300ms)');
        document.querySelectorAll('.services-panel').forEach(function(el, i) {
          var s = getComputedStyle(el);
          console.log('  [' + i + '] active=' + el.classList.contains('is-active') +
            ' op=' + s.opacity + ' disp=' + s.display + ' vis=' + s.visibility +
            ' h=' + s.height + ' kids=' + el.children.length +
            ' text="' + el.textContent.trim().substring(0, 40) + '"');
        });
        console.groupEnd();
      }, 200);

      console.groupEnd();
    }, 1500);
  }
})();
