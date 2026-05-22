/**
 * About Page content builder
 * Reads "about" section from content.json and injects into
 * elements placed by about.html:
 *   #about-overview, #about-services, #about-countries,
 *   #about-why-apex, #about-process, #about-stats, #about-cta, #about-footer
 */
(function() {
  var buildDone = false;

  function buildAbout() {
    if (buildDone || !window.apexContent) return;
    var about = window.apexContent.get('about');
    if (!about) return;

    // ── company overview ─────────────────────────────────────────
    var overviewEl = document.getElementById('about-overview');
    if (overviewEl) {
      var img = overviewEl.querySelector('img');
      var bodyHtml = '';
      if (about.companyOverview && about.companyOverview.body) {
        bodyHtml = '<p style="font-size:1.05rem; line-height:1.75; color:var(--text-secondary); max-width:700px;" class="reveal">' +
          about.companyOverview.body.replace(/\n\n/g, '</p><p style="font-size:1.05rem; line-height:1.75; color:var(--text-secondary); max-width:700px; margin-top:1rem;" class="reveal">') +
          '</p>';
      }
      if (img && about.hero && about.hero.image) {
        img.src = '/' + about.hero.image;
        img.alt = about.hero.alt || '';
      }
      var sectionHdr = '';
      if (about.companyOverview && about.companyOverview.title) {
        sectionHdr = '<div class="section-header" style="margin-bottom:1rem;">' +
          '<span class="section-header__eyebrow" data-content="about.companyOverview.title"></span>' +
          '<h2 class="section-header__title reveal" style="--stagger-index:0" data-content="about.companyOverview.title"></h2>' +
          '</div>';
      }
      overviewEl.innerHTML = sectionHdr + bodyHtml;
    }

    // ── core services ───────────────────────────────────────────
    var servicesEl = document.getElementById('about-services');
    if (servicesEl && about.coreServices && about.coreServices.list) {
      var sHtml = '<h2 class="section-header__title reveal" style="--stagger-index:0" data-content="about.coreServices.title"></h2>' +
        '<div class="services-grid">';
      about.coreServices.list.forEach(function(svc, i) {
        sHtml +=
          '<article class="glass-card reveal" style="--stagger-index:' + (i + 1) + '">' +
            '<span class="glass-card__icon">&#9679;</span>' +
            '<h4 class="glass-card__title" data-content="about.coreServices.list[' + i + '].name"></h4>' +
            '<p class="glass-card__body" data-content="about.coreServices.list[' + i + '].description"></p>' +
          '</article>';
      });
      sHtml += '</div>';
      servicesEl.innerHTML = sHtml;
    }

    // ── geographic footprint ────────────────────────────────────
    var countriesEl = document.getElementById('about-countries');
    if (countriesEl && about.geographicFootprint && about.geographicFootprint.countries) {
      var hdr = about.geographicFootprint.title || 'Where We Operate';
      countriesEl.innerHTML =
        '<div class="section-header" style="margin-bottom:1.5rem;">' +
          '<h2 class="section-header__title reveal" style="--stagger-index:0">' + hdr + '</h2>' +
        '</div>' +
        '<div class="geo-grid">' +
          about.geographicFootprint.countries.map(function(c, i) {
            return (
              '<div class="geo-card reveal" style="--stagger-index:' + (i + 1) + '">' +
                '<h3 class="geo-card__name" data-content="about.geographicFootprint.countries[' + i + '].name"></h3>' +
                '<p class="geo-card__hubs" data-content="about.geographicFootprint.countries[' + i + '].hubs"></p>' +
              '</div>'
            );
          }).join('') +
        '</div>';
    }

    // ── why Apex (guarantees) ───────────────────────────────────
    var whyEl = document.getElementById('about-why-apex');
    if (whyEl && about.whyApex && about.whyApex.guarantees) {
      var hdr2 = about.whyApex.title || 'Why Choose Apex';
      whyEl.innerHTML =
        '<div class="section-header" style="margin-bottom:1.5rem;">' +
          '<h2 class="section-header__title reveal" style="--stagger-index:0" data-content="about.whyApex.title"></h2>' +
        '</div>' +
        '<div class="guarantees-grid">' +
          about.whyApex.guarantees.map(function(g, i) {
            return (
              '<div class="glass-card guarantee-card reveal" style="--stagger-index:' + (i + 1) + '">' +
                '<span class="guarantee-card__check" aria-hidden="true">&#10003;</span>' +
                '<p class="glass-card__body" style="margin:0;" data-content="about.whyApex.guarantees[' + i + ']"></p>' +
              '</div>'
            );
          }).join('') +
        '</div>';
    }

    // ── process timeline ────────────────────────────────────────
    var processEl = document.getElementById('about-process');
    if (processEl && about.process && about.process.steps) {
      var steps = about.process.steps;
      var timelineHtml = '';
      steps.forEach(function(step, i) {
        var label = step.replace(/\s*—\s*.*/, '').trim() || step;
        var body  = step.replace(/^.*?—\s*/, '').trim() || '';
        timelineHtml +=
          '<div class="timeline__step reveal" style="--stagger-index:' + (i + 1) + '">' +
            '<div class="timeline__node" aria-hidden="true">' + (i + 1) + '</div>' +
            '<span class="timeline__label">' + label + '</span>' +
            '<span class="timeline__sub">' + body + '</span>' +
          '</div>';
      });
      processEl.innerHTML =
        '<div class="section-header" style="margin-bottom:1.5rem;">' +
          '<h2 class="section-header__title reveal" data-content="about.process.title" style="--stagger-index:0"></h2>' +
        '</div>' +
        '<div class="timeline reveal">' +
          '<div class="timeline__track"><div class="timeline__track-fill"></div></div>' +
          timelineHtml +
        '</div>';
    }

    // ── stats ───────────────────────────────────────────────────
    var statsEl = document.getElementById('about-stats');
    if (statsEl && about.stats && about.stats.length) {
      statsEl.innerHTML =
        '<div class="trust-bar reveal">' +
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

    // ── CTA ─────────────────────────────────────────────────────
    var ctaEl = document.getElementById('about-cta');
    if (ctaEl && about.cta) {
      var btnLbl  = (about.cta.button && about.cta.button.label) || 'Request Truck';
      var btnHref = (about.cta.button && about.cta.button.href) || '/contact.html';
      var phone   = (about.cta.contact && about.cta.contact.whatsapp) || '072 937 7143';
      ctaEl.innerHTML =
        '<div class="cta-banner reveal">' +
          '<div class="cta-banner__content">' +
            '<h2 class="cta-banner__title" data-content="about.cta.heading"></h2>' +
            '<p class="cta-banner__sub" data-content="about.cta.sub"></p>' +
            '<div class="cta-banner__actions">' +
              '<a href="' + btnHref + '" class="btn btn-navy" data-content="about.cta.button.label">' +
                btnLbl +
              '</a>' +
              '<a href="https://wa.me/27729377143" class="btn btn-primary">WhatsApp ' + phone + '</a>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    // ── footer text ─────────────────────────────────────────────
    var footerEl = document.getElementById('about-footer');
    if (footerEl && about.footer) {
      footerEl.innerHTML =
        '<div class="container"><p class="about-footer__text" style="text-align:center; color:var(--apex-muted); padding: var(--space-8) 0;" data-content="about.footer"></p></div>';
    }

    buildDone = true;
    window.apexContent.injectSimpleContent && window.apexContent.injectSimpleContent();
  }

  // Build on content ready; fall back to DOMContentLoaded
  window.addEventListener('DOMContentLoaded', buildAbout, { once: true });
  document.addEventListener('apexContentReady', function _retry() {
    document.removeEventListener('apexContentReady', _retry);
    buildAbout();
  });

  // Re-run if content is already cached and ready
  if (window.apexContentReady) {
    window.apexContentReady.then(buildAbout);
  }
})();
