/* Shared pricing lookup — single source of truth for the Load Gauge calculator.
   Used by both consolidation-loads.html (full) and the index.html teaser (mini).
   Tweak band multipliers / surcharges here as fuel & toll costs shift; the
   visual gauge code stays untouched. */

export const WEIGHT_BANDS = [
  { max: 1,  multiplier: [3.0, 3.5] },
  { max: 3,  multiplier: [2.0, 2.5] },
  { max: 5,  multiplier: [1.5, 1.8] },
  { max: 10, multiplier: [1.2, 1.4] },
  { max: 20, multiplier: [1.05, 1.15] },
  { max: 34, multiplier: [1.0, 1.0] }
];

/* Border complexity only applies to cross-border routes.
   The teaser defaults to the "neighbouring" tier. */
export const BORDER_SURCHARGE = {
  local:       [1, 1],
  neighbouring: [1.2, 1.3],
  further:      [1.3, 1.4]
};

/* Base per-ton rate (ZAR) before band multiplier + border surcharge. */
export const BASE_RATE = {
  local: 6900,
  cross: 8200
};

export function getMultiplier(chargeableTons) {
  const safe = Math.max(0, Math.min(chargeableTons, 34));
  const band = WEIGHT_BANDS.find(b => safe <= b.max) || WEIGHT_BANDS[WEIGHT_BANDS.length - 1];
  return band.multiplier;
}

/**
 * Chargeable weight = max(actual weight, volumetric-equivalent weight).
 * Volumetric convention: 1 loading metre (LDM) ≈ 1.75 t.
 */
export function computeChargeableWeight(weightTons, loadingMetres) {
  const volumetric = (loadingMetres || 0) * 1.75;
  return Math.max(weightTons, volumetric);
}

/**
 * Estimate a price range (ZAR) for a given chargeable weight + route + border tier.
 * Returns { low, high, band:[lo,hi], chargeable, pricedOn, isVolumetric }.
 */
export function estimateRange(weightTons, route, loadingMetres, borderTier) {
  const chargeable = computeChargeableWeight(weightTons, loadingMetres);
  const band = getMultiplier(chargeable);

  const rate = BASE_RATE[route === 'cross' ? 'cross' : 'local'];
  const tier = route === 'cross'
    ? (BORDER_SURCHARGE[borderTier] || BORDER_SURCHARGE.neighbouring)
    : BORDER_SURCHARGE.local;

  const low = rate * chargeable * band[0] * tier[0];
  const high = rate * chargeable * band[1] * tier[1];

  const volumetric = (loadingMetres || 0) * 1.75;
  const isVolumetric = volumetric > weightTons;
  const pricedOn = isVolumetric ? 'space' : 'weight';

  return {
    low: low,
    high: high,
    band: band,
    chargeable: chargeable,
    pricedOn: pricedOn,
    isVolumetric: isVolumetric
  };
}

export function formatCurrency(num) {
  return 'R ' + Math.round(num).toLocaleString('en-ZA');
}

export function buildWhatsAppLink(phoneNumber, result, route, opts) {
  opts = opts || {};
  const weight = (result.weight != null ? result.weight : 0).toFixed(1);
  const space = (result.space != null ? result.space : 0).toFixed(0);
  const chargeable = result.chargeable.toFixed(1);
  const range = (result.low != null && result.high != null)
    ? `${formatCurrency(result.low)} – ${formatCurrency(result.high)}`
    : '';

  let text = `Consolidation load enquiry:\n`;
  text += `• Weight: ${weight} t\n`;
  if (opts.loadingMetres) text += `• Loading metres: ${opts.loadingMetres.toFixed(1)} m\n`;
  text += `• Space used: ${space}%\n`;
  text += `• Route: ${route}\n`;
  if (opts.borderTier && route === 'cross') text += `• Border: ${opts.borderTier}\n`;
  text += `• Chargeable: ${chargeable} t\n`;
  if (range) text += `• Estimate: ${range}\n`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
}
