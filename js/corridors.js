/* Corridors — commodity filter + route list
   Mobile-first. Renders cards on mobile, table on desktop.
   Frequency shown as a 7-bar weekly chart (Mon–Sun) per route.
   Dependencies: none (vanilla ES6, no imports) */

(function () {
  'use strict';

  var commodities = [
    { id: 'mining', label: 'Mining & minerals', icon: 'diamond' },
    { id: 'industry', label: 'Industry & construction', icon: 'settings' },
    { id: 'consumer', label: 'Consumer goods', icon: 'cart' },
    { id: 'agriculture', label: 'Agriculture', icon: 'leaf' },
  ];

  var routes = [
    /* ── 1. North-South Corridor (60%+ of SADC cross-border freight) ─── */
    { origin: 'Durban', destination: 'Harare', country: 'Zimbabwe', borderPost: 'Beitbridge', eta: '3–4 days', frequency: 'Daily', fits: ['industry', 'consumer', 'mining'], priority: 1, price: 'R 14,500' },
    { origin: 'Durban', destination: 'Lusaka', country: 'Zambia', borderPost: 'Chirundu', eta: '5–6 days', frequency: 'Mon, Thu', fits: ['mining', 'industry'], priority: 1, price: 'R 18,200' },
    { origin: 'Durban', destination: 'Lubumbashi', country: 'DRC', borderPost: 'Beitbridge / Chirundu', eta: '7–8 days', frequency: 'Mon', fits: ['mining', 'industry'], priority: 1, price: 'R 22,800' },
    { origin: 'Johannesburg', destination: 'Harare', country: 'Zimbabwe', borderPost: 'Beitbridge', eta: '2–3 days', frequency: 'Daily', fits: ['industry', 'consumer', 'mining'], priority: 1, price: 'R 12,900' },
    { origin: 'Johannesburg', destination: 'Lusaka', country: 'Zambia', borderPost: 'Chirundu', eta: '4–5 days', frequency: 'Mon, Thu', fits: ['mining', 'industry'], priority: 1, price: 'R 16,700' },
    { origin: 'Johannesburg', destination: 'Lubumbashi', country: 'DRC', borderPost: 'Beitbridge / Chirundu', eta: '6–7 days', frequency: 'Thu', fits: ['mining', 'industry'], priority: 1, price: 'R 21,400' },

    /* ── 2. Maputo Development Corridor (N4) ────────────────────────── */
    { origin: 'Johannesburg', destination: 'Maputo', country: 'Mozambique', borderPost: 'Lebombo', eta: '1 day', frequency: 'Daily', fits: ['industry', 'consumer'], priority: 2, price: 'R 8,600' },

    /* ── 3. Trans-Kalahari Corridor ─────────────────────────────────── */
    { origin: 'Windhoek', destination: 'Johannesburg', country: 'South Africa', borderPost: 'Ariamsvlei', eta: '3–4 days', frequency: 'Wed, Sat', fits: ['consumer', 'industry'], priority: 3, price: 'R 11,200' },
    { origin: 'Johannesburg', destination: 'Gaborone', country: 'Botswana', borderPost: 'Skilpadshek', eta: '1–2 days', frequency: 'Daily', fits: ['consumer'], priority: 3, price: 'R 7,800' },

    /* ── 4. Secondary cross-border routes ───────────────────────────── */
    { origin: 'Johannesburg', destination: 'Lilongwe', country: 'Malawi', borderPost: 'Mwanza', eta: '5–6 days', frequency: 'Fri', fits: ['agriculture', 'consumer'], priority: 4, price: 'R 19,500' },
    { origin: 'Johannesburg', destination: 'Mbabane', country: 'Eswatini', borderPost: 'Oshoek', eta: '1 day', frequency: 'Daily', fits: ['industry', 'consumer'], priority: 4, price: 'R 6,400' },
    { origin: 'Johannesburg', destination: 'Maseru', country: 'Lesotho', borderPost: 'Maseru Bridge', eta: '1 day', frequency: 'Daily', fits: ['consumer'], priority: 4, price: 'R 5,900' },
  ];

  var TOTAL_ROUTES = routes.length;
  var activeCommodity = 'mining';
  var cardsExpanded = false;

  var corridorNames = {
    1: 'North-South Corridor',
    2: 'Maputo Corridor (N4)',
    3: 'Trans-Kalahari Corridor',
    4: 'Cross-Border'
  };

  var WHATSAPP_NUMBER = '27729377143';
  var FLAG_CDN = 'https://flagcdn.com/w80/';
  var countryCodes = {
    'South Africa': 'za',
    'Zimbabwe': 'zw',
    'Zambia': 'zm',
    'DRC': 'cd',
    'Mozambique': 'mz',
    'Botswana': 'bw',
    'Malawi': 'mw',
    'Eswatini': 'sz',
    'Lesotho': 'ls'
  };

  function flagImg(code, label) {
    return '<img src="' + FLAG_CDN + code + '.png" alt="' + label + '" class="corridor-flag" width="28" height="20" loading="lazy">';
  }

  function renderFlags(country) {
    var destCode = countryCodes[country] || 'zz';
    return '<span class="corridor-flags">'
      + flagImg(destCode, country)
      + flagImg('za', 'South Africa')
      + '</span>';
  }

  /* Day index map for frequency parsing */
  var DAY_INDEX = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };
  var DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  /* ── SVG icon snippets (inline, feather-style) ─────────────── */
  var icons = {
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>',
    diamond: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4.5" y="4.5" width="15" height="15" rx="1" transform="rotate(45 12 12)"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/><path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    shirt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>',
    flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 3h6M10 3v6.5L4.5 19.5a1 1 0 0 0 .9 1.5h13.2a1 1 0 0 0 .9-1.5L14 9.5V3"/></svg>',
    mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  };

  /* ── DOM refs (set in init) ────────────────────────────────── */
  var section;
  var chipsEl;
  var countEl;
  var listEl;
  var isDesktop = false;

  /* ── Helpers ────────────────────────────────────────────────── */
  function getVisibleRoutes() {
    if (activeCommodity === 'all') return routes;
    return routes.filter(function (r) { return r.fits.indexOf(activeCommodity) !== -1; });
  }

  function debounce(fn, ms) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  function checkViewport() {
    var next = window.matchMedia('(min-width: 768px)').matches;
    if (next !== isDesktop) {
      isDesktop = next;
      render();
    }
  }

  /* ── Parse frequency string → 7-bool array (Mon=0 … Sun=6) ── */
  function parseFrequency(freq) {
    var days = [false, false, false, false, false, false, false];
    if (!freq) return days;
    var lower = freq.toLowerCase();
    if (lower.indexOf('daily') !== -1) {
      for (var i = 0; i < 7; i++) days[i] = true;
      return days;
    }
    var parts = lower.split(/[\s,]+/);
    for (var p = 0; p < parts.length; p++) {
      var key = parts[p].substring(0, 3);
      if (DAY_INDEX[key] !== undefined) days[DAY_INDEX[key]] = true;
    }
    return days;
  }

  /* ── Build frequency bar chart HTML (active days only) ─────── */
  function renderFreqBars(freq) {
    var active = parseFrequency(freq);
    var bars = '';
    var count = 0;
    for (var i = 0; i < 7; i++) {
      if (active[i]) {
        bars += '<span class="freq-bar freq-bar--on"></span>';
        count++;
      }
    }
    var label = '<span class="freq-label">' + freq + '</span>';
    var srText = '<span class="sr-only">Runs ' + freq + '</span>';
    return '<span class="freq-chart" role="img" aria-label="Runs ' + freq + '">'
      + '<span class="freq-bars">' + bars + '</span>'
      + '<span class="freq-meta">' + count + ' day' + (count !== 1 ? 's' : '') + '/wk · ' + label + srText + '</span>'
      + '</span>';
  }

  /* ── Render chips ──────────────────────────────────────────── */
  function renderChips() {
    var html = '';
    commodities.forEach(function (c) {
      var isActive = c.id === activeCommodity;
      html += '<button class="corridor-chip' + (isActive ? ' is-active' : '') + '"'
        + ' data-commodity="' + c.id + '"'
        + ' aria-pressed="' + (isActive ? 'true' : 'false') + '"'
        + ' type="button">'
        + '<span class="corridor-chip__icon">' + icons[c.icon] + '</span>'
        + '<span class="corridor-chip__label">' + c.label + '</span>'
        + '</button>';
    });
    chipsEl.innerHTML = html;
  }

  /* ── Render count ──────────────────────────────────────────── */
  function renderCount(visible) {
    countEl.textContent = 'Showing ' + visible + ' of ' + TOTAL_ROUTES + ' routes';
  }

  /* ── Render cards (mobile) ─────────────────────────────────── */
  function renderCards(visible) {
    if (visible.length === 0) {
      listEl.innerHTML = '<p class="corridor-empty">No direct consolidation route for this commodity yet — <a href="https://wa.me/' + WHATSAPP_NUMBER + '">ask us about a custom quote</a>.</p>';
      return;
    }
    var truncate = !isDesktop && !cardsExpanded && visible.length > 3;
    var slice = truncate ? visible.slice(0, 3) : visible;
    var html = '';
    slice.forEach(function (r, i) {
      var whatsappMsg = encodeURIComponent('Hi, I need a consolidation quote for ' + r.origin + ' → ' + r.destination + ' (' + r.country + ')');
      html += '<article class="corridor-card" tabindex="-1"'
        + (i === 3 ? ' id="corridor-card-first-hidden"' : '')
        + '>'
        + '<div class="corridor-card__corridor">' + corridorNames[r.priority] + '</div>'
        + '<div class="corridor-card__header">'
        + '<div class="corridor-card__route">'
        + '<span class="corridor-card__origin">' + r.origin + '</span>'
        + '<span class="corridor-card__arrow">' + icons.arrow + '</span>'
        + '<span class="corridor-card__dest">' + r.destination + '</span>'
        + '<span class="corridor-card__country">' + r.country + '</span>'
        + '</div>'
        + '<a href="https://wa.me/' + WHATSAPP_NUMBER + '?text=' + whatsappMsg + '" class="price-link corridor-card__price" target="_blank" rel="noopener">'
        + '<span class="price-link__value">' + r.price + '</span>'
        + '<span class="price-link__cta">Get Quote →</span>'
        + '</a>'
        + '</div>'
        + '<div class="corridor-card__border">'
        + '<span class="corridor-card__pin">' + icons.mapPin + '</span>'
        + r.borderPost
        + '</div>'
        + '<div class="corridor-card__meta">'
        + '<div class="corridor-card__meta-item">'
        + '<span class="corridor-card__meta-label">Est. transit</span>'
        + '<span class="corridor-card__meta-value">' + r.eta + '</span>'
        + '</div>'
        + '<div class="corridor-card__meta-item corridor-card__meta-item--freq">'
        + '<span class="corridor-card__meta-label">Frequency</span>'
        + renderFreqBars(r.frequency)
        + '</div>'
        + '</div>'
        + '</article>';
    });
    if (truncate) {
      html += '<button class="corridor-show-more" type="button" aria-expanded="false">'
        + 'Show ' + (visible.length - 3) + ' more routes</button>';
    }
    listEl.innerHTML = html;
  }

  /* ── Render table (desktop) ────────────────────────────────── */
  function renderTable(visible) {
    if (visible.length === 0) {
      listEl.innerHTML = '<p class="corridor-empty">No direct consolidation route for this commodity yet — <a href="https://wa.me/' + WHATSAPP_NUMBER + '">ask us about a custom quote</a>.</p>';
      return;
    }
    var html = '<table class="corridor-table">'
      + '<thead><tr>'
      + '<th scope="col">Route</th>'
      + '<th scope="col">Border Post</th>'
      + '<th scope="col">Transit</th>'
      + '<th scope="col">Frequency</th>'
      + '<th scope="col" class="corridor-table__th-action">From</th>'
      + '</tr></thead>'
      + '<tbody>';
    visible.forEach(function (r) {
      var whatsappMsg = encodeURIComponent('Hi, I need a consolidation quote for ' + r.origin + ' → ' + r.destination + ' (' + r.country + ')');
      html += '<tr>'
        + '<td class="corridor-table__route">'
        + '<span class="corridor-table__route-text">'
        + '<span class="corridor-table__origin">' + r.origin + '</span>'
        + '<span class="corridor-table__arrow">' + icons.arrow + '</span>'
        + '<span class="corridor-table__dest">' + r.destination + '</span>'
        + '</span>'
        + renderFlags(r.country)
        + '</td>'
        + '<td class="corridor-table__border">' + r.borderPost + '</td>'
        + '<td class="corridor-table__eta">' + r.eta + '</td>'
        + '<td class="corridor-table__freq">' + r.frequency + '</td>'
        + '<td class="corridor-table__price">'
        + '<a href="https://wa.me/' + WHATSAPP_NUMBER + '?text=' + whatsappMsg + '" class="price-link" target="_blank" rel="noopener">'
        + '<span class="price-link__value">' + r.price + '</span>'
        + '<span class="price-link__cta">Get Quote →</span>'
        + '</a>'
        + '</td>'
        + '</tr>';
    });
    html += '</tbody></table>';
    listEl.innerHTML = html;
  }

  /* ── Main render ───────────────────────────────────────────── */
  function render() {
    var visible = getVisibleRoutes();
    renderChips();
    renderCount(visible.length);
    if (isDesktop) {
      renderTable(visible);
    } else {
      renderCards(visible);
    }
  }

  /* ── Event handlers ────────────────────────────────────────── */
  function onChipClick(e) {
    var chip = e.target.closest('.corridor-chip');
    if (!chip) return;
    activeCommodity = chip.getAttribute('data-commodity');
    cardsExpanded = false;
    render();
  }

  function onShowMoreClick(e) {
    var btn = e.target.closest('.corridor-show-more');
    if (!btn) return;
    cardsExpanded = true;
    render();
    var target = document.getElementById('corridor-card-first-hidden');
    if (target) target.focus();
  }

  /* ── Init ──────────────────────────────────────────────────── */
  function init() {
    section = document.getElementById('corridors');
    if (!section) return;

    chipsEl = section.querySelector('.corridor-chips');
    countEl = section.querySelector('.corridor-count');
    listEl = section.querySelector('.corridor-list');

    if (!chipsEl || !countEl || !listEl) return;

    chipsEl.addEventListener('click', onChipClick);
    listEl.addEventListener('click', onShowMoreClick);
    window.addEventListener('resize', debounce(checkViewport, 150));

    checkViewport();
    render();
  }

  window.initCorridors = init;
})();
