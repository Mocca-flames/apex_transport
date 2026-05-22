/**
 * Navigation interactions
 *  - Mobile menu toggle
 *  - Close button within overlay
 *  - Body scroll lock (position:fixed on open; unlock + isolated scroll correction on close)
 *  - Auto-close menu on any scroll gesture
 *  - Sticky scrolled state (adds .nav--scrolled when page scrolled past 80px)
 */
(function() {
  var nav;
  var menu;
  var toggle;
  var closeBtn;
  var mobileFooter;
  var lenis = window.getLenis ? window.getLenis() : null;

  function initNav() {
    nav = document.querySelector('.nav');
    menu = nav ? nav.querySelector('.nav__menu') : null;
    toggle = nav ? nav.querySelector('.nav__toggle') : null;
    closeBtn = nav ? nav.querySelector('.nav__menu-close') : null;
    mobileFooter = document.getElementById('mobileFooter');
    if (!nav || !menu || !toggle) return;

    // ── Open / close ──────────────────────────────────────────
    function openMenu() {
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('is-open');
      if (mobileFooter) mobileFooter.classList.add('is-visible');
      toggle.setAttribute('aria-label', 'Close menu');
      if (closeBtn) {
        closeBtn.classList.add('is-visible');
      }

      // Lock body scroll: position:fixed + overflow:hidden on both root nodes.
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + (window.scrollY || window.pageYOffset) + 'px';
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      if (mobileFooter) mobileFooter.classList.remove('is-visible');
      if (closeBtn) {
        closeBtn.classList.remove('is-visible');
      }
      toggle.setAttribute('aria-label', 'Open menu');

      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';

      if (lenis) {
        lenis.stop();
        setTimeout(function () {
          window.scrollTo(0, lenis.scroll || 0);
          lenis.start();
        }, 0);
      } else {
        requestAnimationFrame(function () {
          window.scrollTo(0, window.scrollY || 0);
        });
      }
    }

    toggle.addEventListener('click', function() {
      toggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });

    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });

    var backdrop = document.getElementById('nav-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    document.addEventListener('scroll', function onMenuScroll() {
      if (menu.classList.contains('is-open')) {
        closeMenu();
      }
    }, { passive: true });

    // Sticky nav state: add .nav--scrolled at scroll > 80 px
    // (throttled via rAF to match call frequency with paint)
    var ticking = false;
    function updateNav() {
      if (nav) {
        if (window.scrollY > 80) { nav.classList.add('nav--scrolled'); }
        else { nav.classList.remove('nav--scrolled'); }
      }
      ticking = false;
    }
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', function() {
      if (window.innerWidth > 1024) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    updateNav();
  }

  initNav();

  // Re-run after shared-nav.js injects the nav HTML (handles race condition
  // when nav.js loads and runs before shared-nav.js fetch resolves).
  document.addEventListener('nav:injected', initNav);
})();
