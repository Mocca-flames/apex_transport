<tool_call>
<function=write>
<parameter=content>
# Scroll-Driven Sections — Implementation Guide

> How to build scroll-hijacked, animated sections that play nicely with Lenis smooth-scroll — no CSS Grids required.

---

## The Problem This Solves

When you build "scroll through a series of full-screen panels" effects, a naive implementation breaks under Lenis:

1. **`position: sticky` doesn't work** — Lenis replaces the browser's native scroll pipeline with `requestAnimationFrame` + `transform: translate3d()` on `<html>`. The native scroll engine never fires, so sticky elements never engage.
2. **`IntersectionObserver` may be unreliable** — when `<html>` is transformed rather than scrolled, the observer may not report correct intersection ratios.
3. **`overflow-x: hidden` on `<body>`** — adding this to compensate for a scrolling child clears the body's ScrollTimeline and can clamp hidden content.

The solution uses **`position: fixed` controlled by JavaScript**, driven by `getBoundingClientRect()` coordinates — which are correct even under Lenis transforms.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  <body> (no overflow-x, no overflow-y)         │
│  <div class="site-wrapper">                     │
│    <section class="services-track">             │
│      └─ <div class="services-sticky">          │
│          [fixed overlay — shows/hides via JS]   │
│        </div>                                   │
│    </section>                                   │
│    <section id="services"></section>            │
│      ← THE SCROLL HEIGHT is on this element     │
│    </section>                                   │
│  </div>                                         │
│  </body>                                        │
└─────────────────────────────────────────────────┘
```

- **Track element** (`services-track`, `coverage-track`): tall element with `height: calc(N × 100vh)`. This provides the natural page scroll height so Lenis keeps scrolling across it.
- **Fixed sticky element** (`.services-sticky`, `.coverage-sticky`): `position: fixed; top: 0; height: 100vh` — always pinned to the viewport. Its opacity/pointer-events are toggled by JS based on where the track sits relative to the viewport.
- **Panel/slide content**: absolutely-positioned children of the fixed element, toggled with `.is-active`.

---

## CSS Pattern

```css
/* ── Track — provides scroll height ─────────────────── */
.section-track {
  height: calc(var(--count) * 100vh);
  position: relative;
}

/* ── Fixed overlay — pinned via JS visibility ───────── */
.section-sticky {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  z-index: 10;
}

.section-sticky.is-visible {
  opacity: 1;
  pointer-events: auto;
}

/* ── Individual panel/slide ─────────────────────────── */
.section-panel {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease-out;
  z-index: 1;
}

.section-panel.is-active {
  opacity: 1;
  pointer-events: auto;
  z-index: 2;
}
```

---

## Body & Wrapper CSS (critical)

```css
/* html — keep smooth scroll innate behavior */
html {
  scroll-behavior: smooth;
}

/* body — NEVER put overflow on body */
body {
  margin: 0;
  padding: 0;
}

/* site-wrapper — put overflow+x here instead */
.site-wrapper {
  overflow-x: hidden;
}
```

---

## JavaScript Pattern

```js
(function () {
  var TRACK = document.querySelector('.section-track');
  var STICKY = document.querySelector('.section-sticky');
  var PANELS = document.querySelectorAll('.section-panel');
  var COUNT = 6;

  function init() {

    /* Panel toggling */
    function activate(index) {
      PANELS.forEach(function (panel, i) {
        panel.classList.toggle('is-active', i === index);
      });
    }

    /* The scroll handler — called on every Lenis 'scroll' event */
    function onScroll() {
      var rect = TRACK.getBoundingClientRect();
      var trackSpan = rect.height - window.innerHeight;

      if (trackSpan <= 0) return;

      var progress = -rect.top / trackSpan;

      // Show/hide the fixed overlay based on whether
      // the track is inside the viewport
      if (progress < 0 || progress > 1) {
        STICKY.classList.remove('is-visible');
        return;
      }
      STICKY.classList.add('is-visible');

      // Which panel/slide is currently visible
      var segment = 1 / COUNT;
      var index = Math.min(
        Math.floor(progress / segment),
        COUNT - 1
      );
      activate(index);
    }

    /* Subscribe to Lenis scroll when available,
       fall back to native scroll event */
    var lenis = window.getLenis ? window.getLenis() : null;
    if (lenis) {
      lenis.on('scroll', onScroll);
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Set initial state in case page loads mid-section
    onScroll();
  }

  window.initSection = init;
})();
```

**Key input formula:**

```js
var progress = -rect.top / (rect.height - window.innerHeight);
// 0.0 → track top is at viewport top (first slide)
// 0.5 → halfway through the tall track
// 1.0 → track bottom is at viewport bottom (last slide)
```

**Index extraction:**

```js
var segment = 1 / COUNT;
var index   = Math.floor(progress / segment);
// indices 0, 1, 2, … COUNT-1
```

---

## HTML Structure

```html
<section class="section-track">
  <div class="section-sticky">
    <div class="section-panel is-active" data-index="0">…</div>
    <div class="section-panel" data-index="1">…</div>
    <div class="section-panel" data-index="2">…</div>
    <div class="section-panel" data-index="3">…</div>
    <div class="section-panel" data-index="4">…</div>
    <div class="section-panel" data-index="5">…</div>
  </div>
</section>
<section id="section-anchor"></section> <!-- optional anchor -->
```

---

## Real Examples in This Project

### Services Scroll — `js/services.js:391` / `js/services.js:404`

- Track: `.services-track` — `height: calc(6 * 100vh)`
- Fixed: `.services-sticky` — `position: fixed; opacity 0/1`
- 6 panels with progress dots, left/right split layout
- Arrow-key navigation via `track.addEventListener('keydown', ...)`

### Coverage Journey — `js/coverage.js:10` / `js/coverage.js:60`

- Track: `.coverage-track` — `height: calc(8 * 100vh)`
- Fixed: `.coverage-sticky` — `position: fixed; opacity 0/1`
- 8 slides with a side progress rail
- Lenis scroll listener at `coverage.js:86`

---

## Checklist When Adding a New Scroll Section

- [ ] Track element has `height: calc(N × 100vh)` (N + 1 viewports of scroll)
- [ ] Overlay element is `position: fixed; top: 0; height: 100vh`
- [ ] Overlay starts `opacity: 0` and uses `.is-visible` class to show
- [ ] JS grabs `track.getBoundingClientRect()` — never use `scrollY` / `window.pageYOffset`
- [ ] JS subscribers to Lenis `'scroll'` events, not native `window.addEventListener('scroll')` (use both only as a fallback)
- [ ] Progress formula bounds `0 <= progress <= 1` — early-return outside that range
- [ ] `site-wrapper` carries `overflow-x: hidden`, not `<body>` or `<html>`
- [ ] Reduced-motion media query sets `position: relative; opacity: 1` on sticky + panels
- [ ] `SERVICE_COUNT` / `SLIDE_COUNT` var is declared at module top and used everywhere in the formula

---

## Why No CSS Grid

The constraint from INSTRUCTIONS.md — *"showing elements beautifully without grids"* — is deliberate. CSS Grid fixes children into rigid cells; it's difficult or impossible to animate panels in/out of the grid while keeping adjacent panels in place. The absolute-positioned + top/inset approach lets each panel fill the viewport independently, with `z-index` and `opacity` controlling which one is visible — no grid reflow, instant composable animations.

---

## Related Files

| File | What it handles |
|------|----------------|
| `css/tokens.css:112` | `--nav-height: 72px` — used by all sticky elements |
| `js/scroll.js:51` | `tryInitLenis()` — conditionally loads Lenis (Tier 2 only) |
| `js/scroll.js:18` | Lenis instance config — `lerp: 0.1`, no `smoothWheel` |