/**
 * Content Loader — Dynamic text injection from JSON
 * Loads desktop (content.json) or mobile (content_mobile.json) based on viewport width
 * Provides global `window.apexContent` object with all content data
 */
(function() {
  'use strict';

  const CONTENT_DESKTOP = '/data/content.json';
  const CONTENT_MOBILE = '/data/content_mobile.json';
  const MOBILE_BREAKPOINT = 1024; // px — matches CSS/services.js breakpoint

  let apexContent = null;
  var contentPromise;

  /**
   * Detect if mobile layout is active
   */
  function isMobile() {
    return window.matchMedia('(max-width: ' + MOBILE_BREAKPOINT + 'px)').matches;
  }

  /**
   * Fetch appropriate content file based on viewport
   */
  function fetchContent() {
    const url = isMobile() ? CONTENT_MOBILE : CONTENT_DESKTOP;
    console.log('[content] fetchContent starting', { url: url, isMobile: isMobile() });

    return fetch(url, { credentials: 'same-origin' })
      .then(function(response) {
        console.log('[content] fetch response', { ok: response.ok, status: response.status, url: response.url });
        if (!response.ok) {
          throw new Error('Content fetch failed: ' + response.status);
        }
        return response.json();
      })
      .then(function(data) {
        console.log('[content] fetchContent loaded', { hasData: !!data, keys: data ? Object.keys(data).join(', ') : 'none' });
        apexContent = data;
        return data;
      })
      .catch(function(err) {
        console.error('[Apex Content]', err);
        // If we attempted mobile and failed, try desktop fallback
        if (isMobile()) {
          return fetch(CONTENT_DESKTOP, { credentials: 'same-origin' })
            .then(function(resp) {
              if (!resp.ok) throw new Error('Desktop fallback failed');
              return resp.json();
            })
            .then(function(data) {
              apexContent = data;
              return data;
            })
            .catch(function(e) {
              console.error('[Apex Content] Fallback also failed', e);
              return null;
            });
        }
        // Already desktop and failed
        return null;
      });
  }

  /**
   * Get nested value using dot notation
   * Supports array indexes using bracket notation, e.g. "home.hero.stats[0].value"
   */
  function get(path) {
    if (!apexContent) return null;
    var parts = path.split('.');
    var current = apexContent;
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      // Handle bracket notation: "arrayName[0]"
      var bracketMatch = part.match(/^(\w+)\[(\d+)\]$/);
      if (bracketMatch) {
        var arrName = bracketMatch[1];
        var idx = parseInt(bracketMatch[2], 10);
        if (current[arrName] && Array.isArray(current[arrName]) && idx < current[arrName].length) {
          current = current[arrName][idx];
        } else {
          return null;
        }
      } else {
        if (current[part] === undefined) return null;
        current = current[part];
      }
    }
    return current;
  }

  /**
   * Inject content into elements marked with data-content attribute
   */
  function inject(el, path, options) {
    var value = get(path);
    if (!value) return;
    options = options || {};

    if (options.attr) {
      el.setAttribute(options.attr, value);
    } else if (options.html) {
      el.innerHTML = value;
    } else if (options.raw) {
      el.textContent = value;
    } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      if (options.value) el.value = value;
      else el.placeholder = value;
    } else {
      el.textContent = value;
    }
  }

  /**
   * Batch inject multiple elements
   */
  function batch(items) {
    items.forEach(function(item) {
      inject(item.el, item.path, item.options);
    });
  }

  // ── Build Functions ─────────────────────────────────────────────

  function buildNav() {
    var container = document.querySelector('[data-nav-links]');
    if (!container) return;
    var links = get('global.nav.links');
    if (!links || !links.length) return;

    container.innerHTML = links.map(function(link) {
      return '<a href="' + link.href + '" class="nav__link">' + link.label + '</a>';
    }).join('');
  }

  function buildTicker() {
    var track = document.querySelector('[data-ticker-track]');
    if (!track) return;
    var items = get('global.ticker');
    if (!items || !items.length) return;

    var html = '';
    // Double for seamless loop
    for (var loop = 0; loop < 2; loop++) {
      items.forEach(function(item) {
        html += '<span class="ticker__item">' + item + '</span>';
      });
    }
    track.innerHTML = html;
  }

  function buildServicesPanels() {
    var panelsContainer = document.getElementById('js-service-panels');
    var dotsContainer = document.getElementById('js-progress-dots');
    console.log('[content] buildServicesPanels', { panelsContainer: !!panelsContainer, dotsContainer: !!dotsContainer });
    if (!panelsContainer) return;

    var services = get('home.servicesSection.services');
    console.log('[content] buildServicesPanels services keys', services ? Object.keys(services) : 'NULL');
    if (!services || !Object.keys(services).length) return;

    var panelsHtml = '';
    var dotsHtml = '';

    Object.keys(services).forEach(function(key, index) {
      var service = services[key];
      var num = String(index + 1).padStart(2, '0');
      var titleHtml = (service.title || '').replace(/\n/g, '<br>');
      panelsHtml +=
        '<div class="services-panel" data-service="' + index + '">' +
          '<span class="services-panel__num">' + num + '</span>' +
          '<h2 class="services-panel__title">' + titleHtml + '</h2>' +
          '<p class="services-panel__body">' + (service.description || '') + '</p>' +
          '<a href="/services.html#' + service.id + '" class="btn btn-navy">' +
            '<svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
            'Learn more' +
          '</a>' +
        '</div>';

      dotsHtml += '<div class="services-progress__dot" data-index="' + index + '"></div>';
    });

    panelsContainer.innerHTML = panelsHtml;
    if (dotsContainer) dotsContainer.innerHTML = dotsHtml;
  }

  function buildServicesImages() {
    var container = document.querySelector('.services-images');
    if (!container) return;

    // Image mapping aligned to service index (0=border-docs, 1=customs-clearance, 2=route-planning, 3=transporter-network, 4=real-time-monitoring, 5=direct-communication)
    var images = [
      { src: '/webp/services/border_documentation.webp', alt: 'Border Documentation — Coordinator handling customs paperwork with stamps and permits, truck waiting at border post' },
      // TODO: add /webp/services/customs_clearance.webp; pending graphics generation — currently falls back to apex_coordination
      { src: '/webp/services/apex_coordination.webp',   alt: 'Customs Clearance — Apex coordination team managing freight at border, logistics operations overview' },
      { src: '/webp/services/route_planning.webp',     alt: 'Route Planning — Large African route map with analytics, optimized path highlighted across Southern and Central Africa' },
      { src: '/webp/services/transporter_network.webp',alt: 'Transporter Network — Fleet yard with multiple trucks, dispatcher assigning loads to verified transporters' },
      { src: '/webp/services/realtime.webp',           alt: 'Real-Time Monitoring — GPS tracking screen showing truck actively moving, live monitoring centre with dispatch team' },
      { src: '/webp/services/direct_communication.webp',alt: 'Direct Communication — Coordinator on WhatsApp/headset talking to driver at border post, real-time support' }
    ];

    var html = images.map(function(img, index) {
      return '' +
        '<div class="services-image" data-service="' + index + '">' +
          '<img src="' + img.src + '" alt="' + img.alt + '" width="620" height="1200" loading="lazy">' +
        '</div>';
    }).join('');

    container.innerHTML = html;
  }

  function buildProcessTimeline() {
    var container = document.getElementById('process-timeline');
    if (!container) return;
    var steps = get('home.process.steps');
    if (!steps || !steps.length) return;

    var html = '<div class="process-timeline-track">';
    steps.forEach(function(step, index) {
      var numMatch = step.match(/^(\d+)\.\s*/);
      var number = numMatch ? numMatch[1] : (index + 1);
      var rest = step.replace(/^\d+\.\s*/, '');

      var parts = rest.split(' — ');
      var label = parts[0];
      var body = parts.slice(1).join(' — ');

      html +=
        '<div class="timeline__step" data-step="' + index + '">' +
          '<div class="timeline__node" aria-hidden="true">' + number + '</div>' +
          '<span class="timeline__label">' + label + '</span>' +
          '<span class="timeline__sub">' + body + '</span>' +
        '</div>';
    });
    html += '</div>';

    container.innerHTML = html;

    var revealed = [];
    var ticking = false;

    var revealSteps = function() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function() {
        var steps = container.querySelectorAll('.timeline__step');
        var viewHeight = window.innerHeight || document.documentElement.clientHeight;
        steps.forEach(function(step, idx) {
          if (revealed[idx]) return;
          var rect = step.getBoundingClientRect();
          if (rect.top < viewHeight * 0.85 && rect.bottom > 0) {
            revealed[idx] = true;
            setTimeout(function() {
              step.classList.add('is-visible');
            }, idx * 200);
          }
        });
        ticking = false;
      });
    };

    window.addEventListener('scroll', revealSteps, { passive: true });
    revealSteps();
  }

  function buildCoverageSlides() {
    var slidesContainer = document.querySelector('.coverage-journey__slides');
    var labelsContainer = document.querySelector('.coverage-progress__labels');
    if (!slidesContainer) return;

    var countries = get('home.coverage.countries');
    if (!countries || !countries.length) return;

    var slidesHtml = '';
    var labelsHtml = '';

    countries.forEach(function(country, index) {
      // Build description based on country
      var descMap = {
        'South Africa': 'Johannesburg dispatch HQ, 24/7 monitoring, border agents at Beit Bridge & Tlokweng',
        'Zimbabwe': 'Beit Bridge crossing, ZIMRA clearance handled, 4–10h average',
        'Zambia': 'Chirundu, Kazungula & Kasumbalesa crossings, ZRA + COMESA, 2–12h',
        'DRC': 'Kasumbalesa border, OGEFREM clearance, French-speaking agents, 6–24h',
        'Botswana': 'Tlokweng & Kazungula, BURS clearance, 2–4h fastest corridor',
        'Malawi': 'Mchinji border, MRA clearance with COMESA pre-approval, 4–8h',
        'Tanzania': 'Dar es Salaam corridor, long-haul JHB–port route, 3–7 days',
        'Mozambique': 'Maputo corridor via Lebombo, 4–8h clearance'
      };

      var codeMap = {
        'South Africa': 'sa', 'Zimbabwe': 'zm', 'Zambia': 'zb', 'DRC': 'dc',
        'Botswana': 'bt', 'Malawi': 'ml', 'Tanzania': 'tz', 'Mozambique': 'mz'
      };

      slidesHtml +=
        '<div class="coverage-slide" data-index="' + index + '">' +
          '<div class="coverage-slide__frame">' +
            '<picture>' +
              '<source media="(max-width: 1024px)" srcset="/country_mobile/' + codeMap[country.name] + '.webp" type="image/webp">' +
              '<img class="coverage-slide__map" src="/experiment/' + codeMap[country.name] + '.webp" alt="' + country.name + ' — ' + country.status + '" loading="lazy" decoding="async">' +
            '</picture>' +
            '<p class="coverage-slide__text"><strong>' + country.status + '</strong> — ' + descMap[country.name] + '</p>' +
          '</div>' +
        '</div>';

      labelsHtml += '<li class="coverage-progress__label" data-index="' + index + '">' + country.name + '</li>';
    });

    slidesContainer.innerHTML = slidesHtml;
    if (labelsContainer) labelsContainer.innerHTML = labelsHtml;
  }

  function buildPrinciples() {
    var container = document.getElementById('principles-container');
    var home = get('home');
    var values = get('home.values');
    var principles = get('home.values.principles');
    console.log('[content] buildPrinciples', {
      containerFound: !!container,
      apexContentLoaded: !!apexContent,
      homeKeys: apexContent && apexContent.home ? Object.keys(apexContent.home).join(', ') : 'none',
      homeObj: home,
      valuesObj: values,
      principles: principles
    });
    if (!container) return;
    if (!principles || !principles.length) {
      console.warn('[content] buildPrinciples: no principles data');
      return;
    }

    var icons = [
      '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>',
      '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
      '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
      '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>'
    ];

    var html = '';
    principles.forEach(function(principle, i) {
      // Split by " — " with emoji before dash
      var parts = principle.split(' — ');
      var title = parts[0]; // includes emoji
      var body = parts.slice(1).join(' — ');

      html +=
        '<article class="glass-card reveal" style="--stagger-index:' + i + '">' +
          '<svg class="glass-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
            '<' + icons[i] + '>' +
          '</svg>' +
          '<h3 class="glass-card__title">' + title + '</h3>' +
          '<p class="glass-card__body">' + body + '</p>' +
        '</article>';
    });

    container.innerHTML = html;
  }

  function buildTechBannerPills() {
    var container = document.querySelector('[data-content-pills]');
    if (!container) return;
    var pills = get('home.techBanner.pills');
    if (!pills || !pills.length) return;

    container.innerHTML = pills.map(function(pill) {
      return '<li><span class="btn btn-secondary" style="border-color:var(--apex-orange); color:var(--apex-orange);">' + pill + '</span></li>';
    }).join('');
  }

  function buildFooter() {
    // Services column links
    var servicesContainer = document.querySelector('[data-footer-services]');
    if (servicesContainer) {
      var serviceLinks = [
        { label: 'Border Documentation', href: '/border-clearance.html#documentation' },
        { label: 'Customs Clearance', href: '/border-clearance.html' },
        { label: 'Route Planning', href: '/services.html#route-planning' },
        { label: 'Transporter Network', href: '/fleet.html' }
      ];
      servicesContainer.innerHTML = serviceLinks.map(function(link) {
        return '<a href="' + link.href + '" class="footer__link">' + link.label + '</a>';
      }).join('');
      servicesContainer.innerHTML += '<a href="/about.html" class="footer__link">About Us</a>';
    }

    // Contact column
    var contactContainer = document.querySelector('[data-footer-contact]');
    if (contactContainer) {
      var phone = get('global.contact.whatsapp') || '072 937 7143';
      var email = get('global.contact.email') || 'dispatch@apextransport.co.za';
      contactContainer.innerHTML =
        '<a href="https://wa.me/27729377143" class="footer__link">WhatsApp: ' + phone + '</a>' +
        '<a href="tel:0729377143" class="footer__link">Call: ' + phone + '</a>' +
        '<span class="footer__link">Based in ' + get('global.contact.based') + '</span>';
    }
  }

  function injectSimpleContent() {
    var elements = document.querySelectorAll('[data-content]');
    elements.forEach(function(el) {
      var path = el.getAttribute('data-content');
      var attr = el.getAttribute('data-content-attr');
      var html = el.hasAttribute('data-content-html');
      var value = get(path);
      if (!value) return;

      if (attr) {
        el.setAttribute(attr, value);
      } else if (html) {
        el.innerHTML = value;
      } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    });
  }

  function buildAbout() {
    var about = get('about');
    if (!about) return;
    var container = document.getElementById('about-overview');
    // camera call: ensure hero image element exists and set src safely
    if (about.hero && about.hero.image && container) {
      var img = container.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        img.alt = (about.hero && about.hero.alt) ? about.hero.alt : '';
        img.loading = 'lazy';
        container.appendChild(img);
      }
      img.src = about.hero.image;
    }

    // ── company overview ──────────────────────────────────────────
    var overviewEl = document.getElementById('about-overview');
    if (overviewEl && about.companyOverview && about.companyOverview.body) {
      overviewEl.innerHTML =
        '<div class="section-header" style="margin-bottom:1rem;">' +
          '<span class="section-header__eyebrow" data-content="about.companyOverview.title"></span>' +
          '<h2 class="section-header__title" data-content="about.companyOverview.title" style="--stagger-index:0"></h2>' +
        '</div>' +
        '<p style="font-size:1.05rem; line-height:1.75; color:var(--text-secondary); max-width:700px;" data-content="about.companyOverview.body"></p>';
    }


    // ── core services ─────────────────────────────────────────────
    var servicesEl = document.getElementById('about-services');
    if (servicesEl && about.coreServices && about.coreServices.list) {
      var sHtml = '<h3 class="section-header__title" style="--stagger-index:0" data-content="about.coreServices.title"></h3>' +
        '<div class="services-grid">';
      about.coreServices.list.forEach(function(svc, i) {
        sHtml +=
          '<article class="glass-card" style="--stagger-index:' + (i + 1) + '">' +
            '<span class="glass-card__icon">?</span>' +
            '<h4 class="glass-card__title" data-content="about.coreServices.list[' + i + '].name"></h4>' +
            '<p class="glass-card__body" data-content="about.coreServices.list[' + i + '].description"></p>' +
          '</article>';
      });
      sHtml += '</div>';
      servicesEl.innerHTML = sHtml;
    }


    // ── geographic footprint ──────────────────────────────────────
    var countriesEl = document.getElementById('about-countries');
    if (countriesEl && about.geographicFootprint && about.geographicFootprint.countries) {
      var hdr = about.geographicFootprint.title || 'Where We Operate';
      countriesEl.innerHTML =
        '<div class="section-header" style="margin-bottom:1.5rem;">' +
          '<h2 class="section-header__title" style="--stagger-index:0">' + hdr + '</h2>' +
        '</div>' +
        '<div class="geo-grid">' +
          about.geographicFootprint.countries.map(function(c, i) {
            return (
              '<div class="geo-card" style="--stagger-index:' + (i + 1) + '">' +
                '<span class="geo-card__name" data-content="about.geographicFootprint.countries[' + i + '].name"></span>' +
                '<span class="geo-card__hubs" data-content="about.geographicFootprint.countries[' + i + '].hubs"></span>' +
              '</div>'
            );
          }).join('') +
        '</div>';
    }


    // ── why Apex (guarantees) ─────────────────────────────────────
    var whyEl = document.getElementById('about-why-apex');
    if (whyEl && about.whyApex && about.whyApex.guarantees) {
      var hdr2 = about.whyApex.title || 'Why Choose Apex';
      whyEl.innerHTML =
        '<div class="section-header" style="margin-bottom:1.5rem;">' +
          '<h2 class="section-header__title" style="--stagger-index:0">' + hdr2 + '</h2>' +
        '</div>' +
        '<div class="guarantees-grid">' +
          about.whyApex.guarantees.map(function(g, i) {
            return (
              '<div class="glass-card guarantee-card" style="--stagger-index:' + (i + 1) + '">' +
                '<span class="guarantee-card__check" aria-hidden="true">&#10003;</span>' +
                '<p class="glass-card__body" style="margin:0;" data-content="about.whyApex.guarantees[' + i + ']"></p>' +
              '</div>'
            );
          }).join('') +
        '</div>';
    }


    // ── process timeline ──────────────────────────────────────────
    var processEl = document.getElementById('about-process');
    if (processEl && about.process && about.process.steps) {
      var steps = about.process.steps;
      processEl.innerHTML =
        '<div class="section-header" style="margin-bottom:1.5rem;">' +
          '<h2 class="section-header__title" data-content="about.process.title" style="--stagger-index:0"></h2>' +
        '</div>' +
        '<div class="timeline">' +
          '<div class="timeline__track"><div class="timeline__track-fill"></div></div>' +
          steps.map(function(step, i) {
            var label = step.replace(/\s*—\s*.*/, '').trim() || step;
            var body  = step.replace(/^.*?—\s*/, '').trim() || '';
            return (
              '<div class="timeline__step" style="--stagger-index:' + (i + 1) + '">' +
                '<div class="timeline__node">' + (i + 1) + '</div>' +
                '<span class="timeline__label">' + label + '</span>' +
                '<span class="timeline__sub">' + body + '</span>' +
              '</div>'
            );
          }).join('') +
        '</div>';
    }


    // ── stats ─────────────────────────────────────────────────────
    var statsEl = document.getElementById('about-stats');
    if (statsEl && about.stats && about.stats.length) {
      statsEl.innerHTML =
        '<div class="trust-bar">' +
          '<div class="trust-bar__grid">' +
            about.stats.map(function(s, i) {
              return (
                '<div class="trust-bar__item" style="--stagger-index:' + (i + 1) + '">' +
                  '<span class="trust-bar__number" data-content="about.stats[' + i + '].value"></span>' +
                  '<span class="trust-bar__label" data-content="about.stats[' + i + '].label"></span>' +
                '</div>'
              );
            }).join('') +
          '</div>' +
        '</div>';
    }


    // ── CTA ───────────────────────────────────────────────────────
    var ctaEl = document.getElementById('about-cta');
    if (ctaEl && about.cta) {
      var btnLbl = about.cta.button && about.cta.button.label ? about.cta.button.label : 'Contact Us';
      var btnHref = about.cta.button && about.cta.button.href ? about.cta.button.href : '/contact.html';
      var ctaHeading = about.cta.heading || '';
      var ctaSub     = about.cta.sub     || '';
      ctaEl.innerHTML =
        '<div class="cta-banner">' +
          '<div class="cta-banner__content">' +
            '<h2 class="cta-banner__title" data-content="about.cta.heading"></h2>' +
            '<p class="cta-banner__sub" data-content="about.cta.sub"></p>' +
            '<div class="cta-banner__actions">' +
              '<a href="' + btnHref + '" class="btn btn-navy" data-content="about.cta.button.label">' +
                btnLbl +
              '</a>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    // ── footer text ───────────────────────────────────────────────
    var footerEl = document.getElementById('about-footer');
    if (footerEl && about.footer) {
      footerEl.innerHTML = '<p class="about-footer__text" data-content="about.footer"></p>';
    }

    injectSimpleContent(); // resolve any data-content markers injected above
  }


  function buildAll() {
    buildNav();
    buildTicker();
    buildServicesPanels();
    buildServicesImages();
    buildProcessTimeline();
    buildCoverageSlides();
    buildPrinciples();
    buildTechBannerPills();
    buildFooter();
    buildAbout();
    injectSimpleContent();

    console.log('[content] buildAll complete', {
      panels: document.querySelectorAll('.services-panel').length,
      images: document.querySelectorAll('.services-image').length,
      slides: document.querySelectorAll('.coverage-slide').length
    });

    /* ── Debug overlay: ?debug=1 URL param ─────────────────────────────────
     * Always-on diagnostics. Step 1 (t=300ms) — after DOM/build.
     * Step 2 (t=1200ms) — after CSS transitions have settled.
     * Remove before production. */
    if (('' + window.location.search).indexOf('debug=1') !== -1) {
      setTimeout(function () {
        var svcSticky = document.querySelector('.services-sticky');
        if (!svcSticky) return;
        console.group('[services] DEBUG SNAPSHOT t=300ms');

        /* dump sticky container */
        var ss = getComputedStyle(svcSticky);
        console.info('STICKY container:');
        'display,position,top,left,width,height,opacity,pointerEvents,zIndex,isolation,overflow,visibility,backgroundColor'.split(',').forEach(function(k){
          console.log('  '+k+':', ss[k]);
        });
        console.log('  is-visible:', svcSticky.classList.contains('is-visible'));
        console.log('  inert:', svcSticky.hasAttribute('inert'));
        console.log('  classList:', Array.from(svcSticky.classList).join(', '));

        /* dump parent chain */
        console.info('PARENT chain:');
        var p = svcSticky.parentElement;
        while (p && p !== document.body) {
          var ps = getComputedStyle(p);
          console.log('  '+p.tagName+'.'+(p.className||'').substring(0,50),
            'op='+ps.opacity,'zi='+ps.zIndex,'pos='+ps.position,'disp='+ps.display);
          p = p.parentElement;
        }

        console.info('PANELS:');
        document.querySelectorAll('.services-panel').forEach(function(el,i){
          var s=getComputedStyle(el);
          console.log('  ['+i+'] active='+el.classList.contains('is-active')+
            ' op='+s.opacity+' disp='+s.display+' vis='+s.visibility+
            ' h='+s.height+' kids='+el.children.length+
            ' text(40)="'+el.textContent.trim().substring(0,40)+'"');
        });

        console.groupEnd();

        /* step 2: after CSS transitions are done */
        setTimeout(function () {
          var s2 = getComputedStyle(svcSticky);
          console.info('[services] DEBUG FINAL t=1200ms: sticky op='+s2.opacity+' disp='+s2.display+
            ' is_visible='+svcSticky.classList.contains('is-visible'));
        }, 900);
      }, 300);
    }

    // Dispatch event for any modules waiting
    var event = new CustomEvent('apexContentReady');
    window.dispatchEvent(event);
  }

  // Expose API
  window.apexContent = {
    get: get,
    inject: inject,
    batch: batch,
    refresh: buildAll
  };

  // After shared-nav.js injects the nav HTML fragment, re-run
  // buildAll() so links are rendered even when content.js starts
  // before the nav fetch resolves. Guard with a flag to avoid
  // calling buildAll() redundantly on subsequent nav:injected fires
  // (the event is also dispatched after footer injection).
  var _contentLoaded = false;
  var _navInjectedDone = false;
  document.addEventListener('nav:injected', function _retryBuild() {
    _navInjectedDone = true;
    if (_contentLoaded) buildAll();
  });

  // Start loading content immediately
  var contentPromise = fetchContent().then(function(data) {
    console.log('[content] fetchContent promise resolved', {
      dataLoaded: !!data,
      dataKeys: data ? Object.keys(data).join(', ') : 'none',
      apexContentNow: !!apexContent
    });
    _contentLoaded = true;
    if (data) {
      buildAll();
    } else {
      console.warn('[Apex Content] No content data loaded; dynamic content will be missing');
    }
    if (_navInjectedDone) buildAll();
  });
  window.apexContentReady = contentPromise;

  // Deferred to next tick so deferred scripts (e.g. reveal.js) register listeners before the event fires
  setTimeout(function() {
    document.dispatchEvent(new Event('apexContentReady'));
  }, 0);

})();
