/**
 * Tier detection – Network + Device capability
 * Writes 'tier-1' or 'tier-2' to <html> element.
 *
 * Logic:
 *   Tier 1: saveData OR effectiveType in ['slow-2g','2g']
 *   Tier 2: everything else
 *
 * Fallback (no Network API):
 *   Fetch a tiny resource (favicon) with cache-buster, measure duration.
 *   > 800ms → Tier 1
 *   ≤ 800ms → Tier 2
 *
 * LocalStorage override: "apex-lite" = "true" forces Tier 1.
 */
(function() {
  function setTier(tier) {
    document.documentElement.classList.add('tier-' + tier);
    window.apexTier = tier; // debug
  }

  // 1. localStorage override
  try {
    if (localStorage.getItem('apex-lite') === 'true') {
      setTier(1);
      return;
    }
  } catch (e) { /* ignore */ }

  // 2. Network Information API
  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    var saveData = connection.saveData;
    var effectiveType = connection.effectiveType; // 'slow-2g', '2g', '3g', '4g'
    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      setTier(1);
    } else {
      setTier(2);
    }
    return;
  }

  // 3. Fallback: measure round-trip for a tiny resource (favicon, cache-busted)
  var start = performance.now();
  var img = new Image();
  img.onload = img.onerror = function() {
    var duration = performance.now() - start;
    if (duration > 800) setTier(1);
    else setTier(2);
  };
  img.src = '/favicon.ico?tb=' + Date.now(); // cache-buster
})();
