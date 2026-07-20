/* Consolidation calculator wiring — drives the shared LoadGauge component on
   both consolidation-loads.html (full) and the index.html teaser (mini).

   The LoadGauge class reports raw numbers via onChange; this script translates
   them into price ranges, badges, and the WhatsApp prefill link using the
   shared weight-bands.js lookup so the teaser and full page never diverge. */

(function () {
  'use strict';

  var WHATSAPP_NUMBER = '27729377143';

  var bandsReady = false;
  var LoadGauge = null;
  var pricing = null;

  /* Load the ES module dependencies; fall back gracefully if import fails. */
  function loadModules(cb) {
    if (bandsReady) { cb(); return; }
    import('/js/weight-bands.js').then(function (mod) {
      pricing = mod;
      return import('/js/load-gauge.js');
    }).then(function (mod) {
      LoadGauge = mod.LoadGauge;
      bandsReady = true;
      cb();
    }).catch(function (err) {
      console.error('[consolidation] failed to load gauge modules', err);
    });
  }

  function formatCurrency(num) {
    return 'R ' + Math.round(num).toLocaleString('en-ZA');
  }

  function setRouteState(root, route) {
    var buttons = root.querySelectorAll('[data-route]');
    buttons.forEach(function (btn) {
      var active = btn.getAttribute('data-route') === route;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function setBorderTierState(root, tier) {
    var buttons = root.querySelectorAll('[data-border-tier]');
    buttons.forEach(function (btn) {
      var active = btn.getAttribute('data-border-tier') === tier;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function setBorderTierVisibility(root) {
    var container = root.querySelector('[data-border-tier-container]');
    if (!container) return;
    var route = root.getAttribute('data-route') || 'local';
    container.style.display = route === 'cross' ? 'flex' : 'none';
  }

  function setLoadingMetresVisibility(root) {
    var container = root.querySelector('[data-loading-metres-container]');
    if (!container) return;
    var toggle = root.querySelector('[data-loading-metres-toggle]');
    container.classList.toggle('is-visible', toggle && toggle.checked);
  }

  function getBorderTier(root) {
    var btn = root.querySelector('[data-border-tier].is-active');
    return btn ? btn.getAttribute('data-border-tier') : 'neighbouring';
  }

  function safeNum(n, fallback) {
    return (typeof n === 'number' && isFinite(n)) ? n : fallback;
  }

  function updateOutputs(root, gauge) {
    if (!pricing) return;

    var weight = safeNum(gauge.weight, 0.5);
    var weightStr = weight.toFixed(1) + ' t';
    var weightOutput = root.querySelector('[data-weight-output]');
    if (weightOutput) weightOutput.textContent = weightStr;

    var loadingMetresInput = root.querySelector('[data-loading-metres-input]');
    var loadingMetres = loadingMetresInput ? safeNum(Number(loadingMetresInput.value), 0.5) : 0.5;
    var loadingOutput = root.querySelector('[data-loading-metres-output]');
    if (loadingOutput) loadingOutput.textContent = loadingMetres.toFixed(1) + ' m';

    var route = root.getAttribute('data-route') || 'local';
    var borderTier = route === 'cross' ? getBorderTier(root) : 'local';

    var estimate = pricing.estimateRange(weight, route, loadingMetres, borderTier);

    var chargeableEl = root.querySelector('[data-chargeable-output]');
    if (chargeableEl) chargeableEl.textContent = safeNum(estimate.chargeable, 0.5).toFixed(1) + ' t';

    var badgeEl = root.querySelector('[data-pricing-badge]');
    if (badgeEl) {
      badgeEl.textContent = estimate.isVolumetric ? 'Priced on space' : 'Priced on weight';
      badgeEl.className = 'load-gauge__badge ' +
        (estimate.isVolumetric ? 'load-gauge__badge--space' : 'load-gauge__badge--weight');
    }

    var multEl = root.querySelector('[data-multiplier-badge]');
    if (multEl) multEl.textContent = safeNum(estimate.band[0], 0).toFixed(2) + '×';

    var estimateEl = root.querySelector('[data-estimate-range]');
    if (estimateEl) {
      estimateEl.textContent = formatCurrency(safeNum(estimate.low, 0)) + ' – ' + formatCurrency(safeNum(estimate.high, 0));
    }

  

    var wa = root.querySelector('[data-whatsapp-cta]');
    if (wa) {
      var result = {
        weight: weight,
        space: safeNum(gauge.space, 0),
        chargeable: safeNum(estimate.chargeable, 0.5),
        low: safeNum(estimate.low, 0),
        high: safeNum(estimate.high, 0)
      };
      wa.href = pricing.buildWhatsAppLink(WHATSAPP_NUMBER, result, route, {
        loadingMetres: loadingMetres,
        borderTier: borderTier
      });
    }

    root.setAttribute('data-estimate-chargeable', String(Math.round(safeNum(estimate.chargeable, 0.5))));
  }

  /* Loading metres (0–30 LDM) drive the gauge's "space used %".
     Create a hidden synthetic space input the LoadGauge reads, kept in sync
     with the loading-metres slider (max 30 LDM ≈ 100% deck). */
  var LOADING_METRES_MAX = 30;

  function syncSpaceFromLoadingMetres(root) {
    var loadingMetresInput = root.querySelector('[data-loading-metres-input]');
    var spaceInput = root.querySelector('[data-role="space-input"]');
    if (!loadingMetresInput || !spaceInput) return;
    var metres = Number(loadingMetresInput.value) || 0;
    var pct = Math.min((metres / LOADING_METRES_MAX) * 100, 100);
    spaceInput.value = String(pct);
  }

  function bindCalculator(root) {
    if (!root || root.dataset.consolidationBound === 'true') return;
    root.dataset.consolidationBound = 'true';

    setRouteState(root, root.getAttribute('data-route') || 'local');
    setBorderTierState(root, getBorderTier(root));
    setBorderTierVisibility(root);
    setLoadingMetresVisibility(root);

    loadModules(function () {
      if (!LoadGauge) return;

      var loadingMetresInput = root.querySelector('[data-loading-metres-input]');
      if (loadingMetresInput) {
        var spaceInput = document.createElement('input');
        spaceInput.type = 'hidden';
        spaceInput.setAttribute('data-role', 'space-input');
        spaceInput.min = '0';
        spaceInput.max = '100';
        spaceInput.value = '0';
        root.appendChild(spaceInput);
        syncSpaceFromLoadingMetres(root);
      }

      var gauge = new LoadGauge(root, {
        onChange: function (result) {
          updateOutputs(root, result);
        }
      });

      var toggle = root.querySelector('[data-loading-metres-toggle]');
      if (toggle) {
        toggle.addEventListener('change', function () {
          setLoadingMetresVisibility(root);
          gauge.update();
        });
      }

      if (loadingMetresInput) {
        loadingMetresInput.addEventListener('input', function () {
          syncSpaceFromLoadingMetres(root);
          gauge.update();
        });
      }

      root.querySelectorAll('[data-route]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          root.setAttribute('data-route', btn.getAttribute('data-route'));
          setRouteState(root, btn.getAttribute('data-route'));
          setBorderTierVisibility(root);
          gauge.update();
        });
      });

      root.querySelectorAll('[data-border-tier]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          setBorderTierState(root, btn.getAttribute('data-border-tier'));
          gauge.update();
        });
      });

      updateOutputs(root, gauge);
    });
  }

  function initConsolidation() {
    var calculators = document.querySelectorAll('[data-consolidation-calculator]');
    calculators.forEach(bindCalculator);
  }

  window.initConsolidation = initConsolidation;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsolidation);
  } else {
    initConsolidation();
  }
})();
