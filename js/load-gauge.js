/* Load Gauge — visual truck-fill component.
   Shared by consolidation-loads.html (full) and index.html teaser (mini).
   Mounted into a container holding the .load-gauge SVG markup + controls.
   This class stays dumb about pricing copy — it only reports numbers via
   onChange, which the page wires to the price badge / WhatsApp link. */

import { computeChargeableWeight } from './weight-bands.js';

const WEIGH = [242, 183, 5];   /* --lg-weigh  yellow — balanced density */
const TARP = [225, 103, 43];   /* --lg-tarp   orange  — heavy for footprint */
const ROUTE = [30, 127, 114];  /* --lg-route  teal    — bulky/light for footprint */

export class LoadGauge {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options || {};
    this.maxWeight = 34;
    this.maxFillHeight = 292;
    this.onChange = this.options.onChange || (() => {});

    this.fillEl = container.querySelector('.load-gauge__fill');
    this.weightInput = container.querySelector('[data-role="weight-input"]');
    this.spaceInput = container.querySelector('[data-role="space-input"]');
    this.liveRegion = container.querySelector('[data-role="live-region"]');

    this._bind();
    this.update();
  }

  _bind() {
    if (this.weightInput) this.weightInput.addEventListener('input', () => this.update());
    if (this.spaceInput) this.spaceInput.addEventListener('input', () => this.update());
  }

  _spaceValue() {
    if (this.spaceInput) return parseFloat(this.spaceInput.value) || 0;
    const weight = parseFloat(this.weightInput.value) || 0;
    return Math.min((weight / this.maxWeight) * 100, 100);
  }

  _loadingMetresFromSpace(spacePct) {
    return (spacePct / 100) * 30;
  }

  update() {
    const weight = parseFloat(this.weightInput.value) || 0;
    const space = this._spaceValue();
    const loadingMetres = this._loadingMetresFromSpace(space);

    const fillHeight = (space / 100) * this.maxFillHeight;
    if (this.fillEl) this.fillEl.setAttribute('height', fillHeight.toFixed(1));

    const chargeable = computeChargeableWeight(weight, loadingMetres);
    const spaceEquivalentTons = loadingMetres * 1.75;

    let ratio;
    if (space < 5) {
      ratio = weight > 1 ? 2.2 : 1;
    } else {
      ratio = weight / Math.max(spaceEquivalentTons, 1);
    }
    ratio = Math.max(0.3, Math.min(ratio, 2.2));

    if (this.fillEl) this.fillEl.style.fill = this._interpolateColor(ratio);

    const pricedOn = weight >= spaceEquivalentTons ? 'weight' : 'space';

    const result = {
      weight,
      space,
      chargeable,
      pricedOn,
      ratio,
      low: null,
      high: null
    };

    this._announce(result);
    this.onChange(result);
    return result;
  }

  _interpolateColor(ratio) {
    let t, from, to;
    if (ratio >= 1) {
      t = Math.min((ratio - 1) / 1.2, 1);
      from = WEIGH; to = TARP;
    } else {
      t = Math.min((1 - ratio) / 0.7, 1);
      from = WEIGH; to = ROUTE;
    }
    const r = Math.round(from[0] + (to[0] - from[0]) * t);
    const g = Math.round(from[1] + (to[1] - from[1]) * t);
    const b = Math.round(from[2] + (to[2] - from[2]) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }

  _announce(result) {
    if (!this.liveRegion) return;
    if (this._announceTimer) return;
    this._announceTimer = setTimeout(() => {
      this.liveRegion.textContent =
        `${result.chargeable.toFixed(1)} tons chargeable, priced on ${result.pricedOn}`;
      this._announceTimer = null;
    }, 400);
  }
}
