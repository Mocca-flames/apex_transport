# Load Gauge — Full Implementation Guide

Hand this file to whichever model/tool is doing the actual coding. It assumes the
existing site stack noted elsewhere in the project: **vanilla ES6 modules, no
framework, no GSAP** (Lenis + Intersection Observer are already in use for the
index.html scroll effects — this component doesn't need either).

Two places consume this component:
- `consolidation-loads.html` — full variant, two sliders (Weight + Space)
- `index.html` teaser — mini variant, one slider (Weight only, Space inferred)

Build it once as a configurable class. Do not fork the logic between pages.

---

## 1. Concept recap

A top-down truck and trailer, **rotated 90°** so the cab is at the top and the
trailer bed runs vertically down the screen (the mobile fix — a horizontal
top-down vehicle gets squeezed into a thin strip on a phone; vertical, it fills
the screen naturally).

Two variables drive it:
- **Weight** (tons, 0–34)
- **Space used** (%, 0–100) — how much of the deck length the cargo occupies

The trailer's fill **length** = Space used. The fill **color** encodes density:
neutral `--weigh` (yellow) at balanced density, shifting toward `--tarp`
(orange) when the load is heavy for its footprint, or toward `--route` (teal)
when it's bulky/light for its footprint. This is the only place `--weigh` is
used, by design — see the site's palette rules.

---

## 2. File structure

```
/js/load-gauge.js       — the LoadGauge class (this file's Section 4)
/js/weight-bands.js     — shared multiplier lookup table (this file's Section 6)
/css/load-gauge.css     — component styles (this file's Section 7)
```

Both `consolidation-loads.html` and `index.html` import the same
`load-gauge.js` and `weight-bands.js` — no duplication.

---

## 3. SVG markup

This is the static markup the class mounts into a container. Coordinate system
is a `220 x 420` viewBox scaled to fit the container via CSS (`width: 100%;
max-width: 260px` for full size, `max-width: 180px` for mini — see Section 7).

```html
<div class="load-gauge" data-variant="full">
  <svg class="load-gauge__svg" viewBox="0 0 220 420" role="img"
       aria-label="Top-down view of a truck and trailer showing cargo fill">
    <title>Truck and trailer top-down loading view</title>
    <desc>The trailer bed fills from front to back based on space used,
    colored by how dense the cargo is for that footprint</desc>

    <rect x="60" y="8" width="100" height="64" rx="8"
          fill="var(--chalk)" stroke="var(--steel)" stroke-width="2"/>
    <rect x="48" y="20" width="10" height="20" rx="2" fill="var(--steel)"/>
    <rect x="162" y="20" width="10" height="20" rx="2" fill="var(--steel)"/>
    <rect x="48" y="48" width="10" height="20" rx="2" fill="var(--steel)"/>
    <rect x="162" y="48" width="10" height="20" rx="2" fill="var(--steel)"/>

    <rect x="40" y="80" width="140" height="300" rx="10"
          fill="var(--chalk)" stroke="var(--steel)" stroke-width="2"/>

    <g class="load-gauge__dividers" stroke="var(--concrete)" stroke-width="1">
      <line x1="40" y1="110" x2="180" y2="110"/>
      <line x1="40" y1="140" x2="180" y2="140"/>
      <line x1="40" y1="170" x2="180" y2="170"/>
      <line x1="40" y1="200" x2="180" y2="200"/>
      <line x1="40" y1="230" x2="180" y2="230"/>
      <line x1="40" y1="260" x2="180" y2="260"/>
      <line x1="40" y1="290" x2="180" y2="290"/>
      <line x1="40" y1="320" x2="180" y2="320"/>
      <line x1="40" y1="350" x2="180" y2="350"/>
    </g>

    <rect class="load-gauge__fill" x="44" y="84" width="132" height="0"
          fill="var(--weigh)"/>

    <rect x="30" y="150" width="10" height="26" rx="2" fill="var(--steel)"/>
    <rect x="180" y="150" width="10" height="26" rx="2" fill="var(--steel)"/>
    <rect x="30" y="300" width="10" height="26" rx="2" fill="var(--steel)"/>
    <rect x="180" y="300" width="10" height="26" rx="2" fill="var(--steel)"/>
  </svg>
</div>
```

`--chalk`, `--steel`, `--concrete`, `--weigh`, `--tarp`, `--route` are the
tokens defined in `consolidation-loads-page.md` Section 0 — map them to the
site's real CSS custom properties (or add them alongside existing ones).

**Mini variant:** identical markup, no need to strip anything out — sizing is
handled entirely in CSS (Section 7). Simpler to keep one template.

---

## 4. JS class

```js
export class LoadGauge {
  constructor(container, options = {}) {
    this.container = container;
    this.mini = options.mini || false;
    this.maxWeight = 34;
    this.maxFillHeight = 292;
    this.onChange = options.onChange || (() => {});

    this.fillEl = container.querySelector('.load-gauge__fill');
    this.weightInput = container.querySelector('[data-role="weight-input"]');
    this.spaceInput = container.querySelector('[data-role="space-input"]');
    this.liveRegion = container.querySelector('[data-role="live-region"]');

    this._bind();
    this.update();
  }

  _bind() {
    this.weightInput.addEventListener('input', () => this.update());
    if (this.spaceInput) {
      this.spaceInput.addEventListener('input', () => this.update());
    }
  }

  _spaceValue() {
    if (this.spaceInput) return parseFloat(this.spaceInput.value);
    const weight = parseFloat(this.weightInput.value);
    return Math.min((weight / this.maxWeight) * 100, 100);
  }

  update() {
    const weight = parseFloat(this.weightInput.value);
    const space = this._spaceValue();

    const fillHeight = (space / 100) * this.maxFillHeight;
    this.fillEl.setAttribute('height', fillHeight.toFixed(1));

    const spaceEquivalentTons = (space / 100) * this.maxWeight;
    const chargeable = Math.max(weight, spaceEquivalentTons);

    let ratio;
    if (space < 5) {
      ratio = weight > 1 ? 2.2 : 1;
    } else {
      ratio = weight / spaceEquivalentTons;
    }
    ratio = Math.max(0.3, Math.min(ratio, 2.2));

    this.fillEl.style.fill = this._interpolateColor(ratio);

    const pricedOn = weight >= spaceEquivalentTons ? 'weight' : 'space';

    const result = { weight, space, chargeable, pricedOn, ratio };
    this._announce(result);
    this.onChange(result);
    return result;
  }

  _interpolateColor(ratio) {
    const weigh = [242, 183, 5];
    const tarp = [225, 103, 43];
    const route = [30, 127, 114];
    let t, from, to;
    if (ratio >= 1) {
      t = Math.min((ratio - 1) / 1.2, 1);
      from = weigh; to = tarp;
    } else {
      t = Math.min((1 - ratio) / 0.7, 1);
      from = weigh; to = route;
    }
    const r = Math.round(from[0] + (to[0] - from[0]) * t);
    const g = Math.round(from[1] + (to[1] - from[1]) * t);
    const b = Math.round(from[2] + (to[2] - from[2]) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }

  _announce(result) {
    if (!this.liveRegion) return;
    if (!this._announceTimer) {
      this._announceTimer = setTimeout(() => {
        this.liveRegion.textContent =
          `${result.chargeable.toFixed(1)} tons chargeable, priced on ${result.pricedOn}`;
        this._announceTimer = null;
      }, 400);
    }
  }
}
```

Notes:
- `_spaceValue()` is what makes the mini variant work with one slider — no
  `spaceInput` in the DOM means it falls back to the average-density
  assumption automatically.
- `_announce()` is debounced (400ms) so screen readers aren't spammed on every
  slider tick — only the settled value gets announced.
- `onChange` is the hook the page uses to update the price-range badge and the
  WhatsApp CTA link (Section 5/6) — keep the gauge itself dumb about pricing
  copy, just hand back numbers.

---

## 5. Weight-band lookup (shared file)

```js
export const WEIGHT_BANDS = [
  { max: 1,  multiplier: [3.0, 3.5] },
  { max: 3,  multiplier: [2.0, 2.5] },
  { max: 5,  multiplier: [1.5, 1.8] },
  { max: 10, multiplier: [1.2, 1.4] },
  { max: 20, multiplier: [1.05, 1.15] },
  { max: 34, multiplier: [1.0, 1.0] },
];

export function getMultiplier(chargeableTons) {
  const band = WEIGHT_BANDS.find(b => chargeableTons <= b.max);
  return band ? band.multiplier : WEIGHT_BANDS[WEIGHT_BANDS.length - 1].multiplier;
}

export const BORDER_SURCHARGE = {
  local: [1, 1],
  neighbouring: [1.2, 1.3],
  further: [1.3, 1.4],
};
```

Keep this as its own module — it's the file you'll actually tweak as fuel/toll
costs shift, independent of the gauge's visual code.

---

## 6. WhatsApp CTA link builder

```js
export function buildWhatsAppLink(phoneNumber, result, route) {
  const text =
    `Consolidation load enquiry: ${result.weight.toFixed(1)}t, ` +
    `${result.space.toFixed(0)}% space, route: ${route}. ` +
    `Estimated chargeable: ${result.chargeable.toFixed(1)}t.`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
}
```

---

## 7. CSS

```css
.load-gauge__svg {
  width: 100%;
  display: block;
}
.load-gauge[data-variant="full"] .load-gauge__svg {
  max-width: 260px;
  margin: 0 auto;
}
.load-gauge[data-variant="mini"] .load-gauge__svg {
  max-width: 180px;
  margin: 0 auto;
}
.load-gauge__fill {
  transition: height 0.3s ease, fill 0.3s ease;
}
@media (prefers-reduced-motion: reduce) {
  .load-gauge__fill {
    transition: none;
  }
}
```

Modern browsers animate SVG geometry attributes (`height`, `fill`) as CSS
properties when set via `.style` (which the JS class does) rather than
`setAttribute` for the color — this is why `_interpolateColor`'s result is
assigned to `this.fillEl.style.fill`, not `setAttribute('fill', ...)`, while
`height` uses `setAttribute` and still picks up the CSS transition. Test this
combination on the actual target devices (older Android WebViews sometimes lag
here) — if it stutters, fall back to a `requestAnimationFrame` tween instead of
relying on the CSS transition.

---

## 8. Markup for the controls (goes alongside the SVG, inside `.load-gauge`)

```html
<div class="load-gauge__controls">
  <label for="lg-weight">Weight (tons)</label>
  <input type="range" id="lg-weight" data-role="weight-input"
         min="0" max="34" step="0.5" value="10">

  <!-- Full variant only — omit entirely for mini -->
  <label for="lg-space">Space used (%)</label>
  <input type="range" id="lg-space" data-role="space-input"
         min="0" max="100" step="1" value="30">

  <div data-role="live-region" aria-live="polite" class="sr-only"></div>
</div>
```

---

## 9. Full vs mini — config differences

| | Full (`consolidation-loads.html`) | Mini (`index.html`) |
|---|---|---|
| Sliders | Weight + Space | Weight only |
| Space source | user input | inferred: `(weight/34)*100` |
| Color range shown | full hot/cool range | mostly neutral `--weigh` (space always tracks weight 1:1) |
| Route/border detail | full chip selector | Local/Cross-border toggle only |
| CTA | WhatsApp deep link, prefilled | "See full details" link to full page |
| Disclaimer | visible `<details>` | small caption only |

---

## 10. Accessibility checklist

- Every `<input type="range">` has a real `<label for>`, not just a floating
  span — screen reader users need the association, not just sighted users.
- `aria-live="polite"` region announces the settled chargeable-tons value and
  pricing basis, debounced so it doesn't fire on every tick.
- The SVG has `role="img"` with `<title>`/`<desc>` — screen readers get a
  static description even though the visual is decorative/animated.
- Respect `prefers-reduced-motion` (Section 7).
- Don't rely on color alone to convey "priced on weight vs space" — the
  text badge next to the gauge carries that meaning too, not just the fill
  hue.

---

## 11. Testing checklist

- Weight = 0, Space = 0 — gauge should render empty, not throw on division by
  zero (`_spaceValue` and `update` both guard against this).
- Weight = 34, Space = 100 — full trailer, should sit at the hot end of the
  color range but not overflow past the trailer outline.
- Mini variant with only a weight slider — confirm `_spaceValue()` fallback
  produces a sensible fill without a space input in the DOM.
- Test the color interpolation at ratio exactly 1 — should render pure
  `--weigh` yellow, not a rounding-off blend toward either extreme.
- Test on an actual low-end Android device on 3G, not just desktop dev tools —
  this audience's real conditions.