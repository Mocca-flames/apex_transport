/**
 * Coverage Journey — scroll-hijacked sticky section
 *
 * Guarantees:
 *  - .coverage-sticky is hidden on every init and any time the arena
 *    content is mutated (coverage.js rebuilds its DOM at init; content.js
 *    rebuilds it later — race condition without this guard).
 *  - onScroll always strips is-visible first; only re-adds when progress is
 *    legitimately in the 0-to-1 range (track is inside the viewport).
 *  - Keyboard access only when the user is genuinely inside the track.
 *
 * Fix — pointer-events / inert:
 *  setStickyVisible() is the single source of truth for show/hide.
 *  CSS must pair: .coverage-sticky { pointer-events: none }
 *                 .coverage-sticky.is-visible { pointer-events: auto }
 *
 * Fix — MutationObserver wrong selector:
 *  Was: section.querySelectorAll('.coverage-progress__labels')  ← the <ol>
 *  Now: section.querySelectorAll('.coverage-progress__label')   ← the <li>s
 *  After buildCoverageSlides() fires, label toggling was silently broken
 *  because the labels NodeList held the container, not the individual items.
 */
(function () {
  'use strict';

  var SLIDE_COUNT = 8;

  var _bootGuard = !('ontouchstart' in window);   /* discard the very first onScroll call (page-load race) */

  function initCoverage() {
    var section = document.getElementById('coverage');
    if (!section) return;

    /* ── Mobile (≤1024px): disable scroll-jacking, use interactive selector ── */
    var isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) {
      section.classList.add('coverage--static');
      buildCoverageSelector(section);

      /* Rebuild selector whenever content.js rebuilds the coverage DOM */
      var mobileMo = new MutationObserver(function (mutations) {
        var slidesContainer = section.querySelector('.coverage-journey__slides');
        var labelsContainer = section.querySelector('.coverage-progress__labels');

        var relevant = mutations.some(function (m) {
          return (slidesContainer && (slidesContainer.contains(m.target) || m.target === slidesContainer)) ||
                 (labelsContainer && (labelsContainer.contains(m.target) || m.target === labelsContainer));
        });
        if (!relevant) return;

        var slides = section.querySelectorAll('.coverage-slide');
        if (!slides.length) return;
        buildCoverageSelector(section);
      });
      mobileMo.observe(section, { childList: true, subtree: true });
      return;
    }

    var track  = section.querySelector('.coverage-track');
    var sticky = section.querySelector('.coverage-sticky');
    var slides = section.querySelectorAll('.coverage-slide');
    var labels = section.querySelectorAll('.coverage-progress__label');   /* fix: was .coverage-progress__labels */
    var fillEl = document.getElementById('js-coverage-fill');
    var dotEl  = document.getElementById('js-coverage-dot');

    if (!track || !slides.length) {
      if (window.__ApexDebug) console.warn('[coverage] init: missing elements', { track: !!track, slides: slides.length });
      return;
    }

    /* ── Visibility helper ────────────────────────────────────────────
     *  Single source of truth for showing/hiding the sticky panel.
     *  - is-visible drives CSS opacity/transform (paired with
     *    pointer-events via the CSS rules described in the file header).
     *  - inert removes the panel from tab order and the a11y tree when
     *    hidden so keyboard/screen-reader users can't land inside it.
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

    /* ── Metrics & State ─────────────────────────────────────────── */
    var currentIndex = 0;
    setActive(0, true);  /* initialise without animation */

    function setActive(index, instant) {
      if (index === currentIndex && !instant) return;
      currentIndex = index;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });

      labels.forEach(function (label, i) {
        label.classList.toggle('is-active', i === index);
      });

      if (fillEl && dotEl) {
        var pct = ((index + 0.5) / SLIDE_COUNT) * 100;
        fillEl.style.height = pct + '%';
        dotEl.style.top    = pct + '%';
      }
    }

    /* ── Core scroll handler ──────────────────────────────────────── */
    function onScroll() {
      /* The very first call fires during page-load (services.js performs
         an init scroll to the services section), before layout is stable.
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

      var segmentSize = 1 / SLIDE_COUNT;
      var targetIndex = Math.min(Math.floor(progress / segmentSize), SLIDE_COUNT - 1);
      setActive(targetIndex, false);
    }

    /* ── Re-hide sticky whenever the coverage DOM is mutated ─────────
     *
     *  buildCoverageSlides() (content.js) rebuilds both:
     *    - .coverage-journey__slides  → new .coverage-slide elements
     *    - .coverage-progress__labels → new .coverage-progress__label <li>s
     *
     *  The MutationObserver refreshes both NodeLists so setActive()
     *  targets the new elements, then resets to slide 0.
     *
     *  Bug fixed: was querying '.coverage-progress__labels' (the <ol>
     *  container) — now correctly queries '.coverage-progress__label'
     *  (the individual <li> items).
     * ─────────────────────────────────────────────────────────────── */
    var mo = new MutationObserver(function () {
      var newSlides = section.querySelectorAll('.coverage-slide');
      var newLabels = section.querySelectorAll('.coverage-progress__label');  /* fix: was .coverage-progress__labels */

      if (!newSlides.length) return;

      slides = newSlides;
      labels = newLabels;

      setStickyVisible(false);
      setActive(0, true);
    });

    mo.observe(section, { childList: true, subtree: true });

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
            setActive(Math.min(Math.floor(p * SLIDE_COUNT), SLIDE_COUNT - 1), false);
          });
        }, { rootMargin: '0px 0px -1px 0px' });

        io.observe(track);
      })();
    }

    /* ── Subscribe to scroll events ──────────────────────────────── */
    var lenis = window.getLenis ? window.getLenis() : null;

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

    /* ── Keyboard: arrow keys jump between slides when sticky is shown ── */
    sticky.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' && currentIndex < SLIDE_COUNT - 1) {
        e.preventDefault();
        scrollToSlide(currentIndex + 1);
      }
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        scrollToSlide(currentIndex - 1);
      }
    });

    /* tabindex stays — inert overrides it when the panel is hidden */
    sticky.setAttribute('tabindex', '0');

    /* Start hidden — inert set immediately so nothing leaks through
       before the first legitimate scroll event. */
    setStickyVisible(false);

    function scrollToSlide(idx) {
      var trackHeight = track.offsetHeight - (window.visualViewport ? window.visualViewport.height : window.innerHeight);
      if (trackHeight <= 0) return;
      var targetY = track.offsetTop + (idx / (SLIDE_COUNT - 1)) * trackHeight;
      if (lenis) {
        lenis.scrollTo(targetY, { duration: 0.8 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }

    onScroll(); /* run once on init in case page loads mid-section */
  }

  /**
   * Build the interactive country selector for mobile (≤1024px).
   * Reads existing .coverage-slide elements (built by content.js) and
   * constructs a horizontal pill bar + map image + detail card.
   */
  function buildCoverageSelector(section) {
    var selector = section.querySelector('.coverage-selector');
    if (!selector) return;

    var slides = section.querySelectorAll('.coverage-slide');
    if (!slides.length) return;

    var countries = [];
    slides.forEach(function (slide) {
      var img = slide.querySelector('img');
      var textEl = slide.querySelector('.coverage-slide__text');
      if (!textEl) return;

      var strong = textEl.querySelector('strong');
      var status = strong ? strong.textContent : '';
      var rawText = textEl.textContent || '';
      var descPrefix = status ? (status + ' \u2014 ') : '';
      var description = rawText.replace(descPrefix, '').trim();
      var imgSrc = img ? img.src : '';

      var idx = parseInt(slide.dataset.index, 10);
      var label = section.querySelector('.coverage-progress__label[data-index="' + idx + '"]');
      var name = label ? label.textContent : ('Country ' + (idx + 1));

      countries.push({ name: name, status: status, description: description, imgSrc: imgSrc, index: idx });
    });

    countries.sort(function (a, b) { return a.index - b.index; });
    if (!countries.length) return;

    var pillsHtml = '';
    countries.forEach(function (country, i) {
      var dotClass = country.status === 'Hub' ? 'hub' : country.status === 'Specialist' ? 'specialist' : 'active';
      var activeClass = i === 0 ? ' is-active' : '';
      pillsHtml +=
        '<button class="coverage-selector__pill' + activeClass + '" data-index="' + i + '" type="button" aria-pressed="' + (i === 0 ? 'true' : 'false') + '">' +
          '<span class="coverage-selector__pill-dot coverage-selector__pill-dot--' + dotClass + '" aria-hidden="true"></span>' +
          '<span class="coverage-selector__pill-name">' + country.name + '</span>' +
        '</button>';
    });

    var first = countries[0];
    var firstDotClass = first.status === 'Hub' ? 'hub' : first.status === 'Specialist' ? 'specialist' : 'active';

    selector.innerHTML =
      '<div class="coverage-selector__map">' +
        '<img class="coverage-selector__map-img" src="' + first.imgSrc + '" alt="' + first.name + ' coverage map" loading="lazy" decoding="async">' +
      '</div>' +
      '<div class="coverage-selector__pills" role="tablist" aria-label="Select country">' +
        pillsHtml +
      '</div>' +
      '<div class="coverage-selector__detail" aria-live="polite">' +
        '<span class="coverage-selector__status coverage-selector__status--' + firstDotClass + '">' + first.status + '</span>' +
        '<p class="coverage-selector__desc">' + first.description + '</p>' +
      '</div>';

    selector.querySelectorAll('.coverage-selector__pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        var idx = parseInt(this.dataset.index, 10);
        var country = countries[idx];
        if (!country) return;

        selector.querySelectorAll('.coverage-selector__pill').forEach(function (p) {
          p.classList.remove('is-active');
          p.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('is-active');
        this.setAttribute('aria-pressed', 'true');

        var mapImg = selector.querySelector('.coverage-selector__map-img');
        if (mapImg && mapImg.src !== country.imgSrc) {
          mapImg.style.opacity = '0.3';
          mapImg.src = country.imgSrc;
          mapImg.alt = country.name + ' coverage map';
          mapImg.onload = function () { mapImg.style.opacity = '1'; };
        }

        var detail = selector.querySelector('.coverage-selector__detail');
        if (detail) {
          var dotClass = country.status === 'Hub' ? 'hub' : country.status === 'Specialist' ? 'specialist' : 'active';
          detail.innerHTML =
            '<span class="coverage-selector__status coverage-selector__status--' + dotClass + '">' + country.status + '</span>' +
            '<p class="coverage-selector__desc">' + country.description + '</p>';
        }

        this.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    });
  }

  window.initCoverage = initCoverage;
})();