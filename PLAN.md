# Apex Transport Group — Implementation Plan

**Version:** 3.0  
**Date:** 2026-05-09  
**Scope:** Informational / service showcase site

---

## What This Site Is

A credibility and information site. Visitors need to quickly understand what Apex does, trust that they're serious, and know how to make contact. Animation is not the point — clear content is.

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Project Structure](#2-project-structure)
3. [Network Tiers](#3-network-tiers)
4. [Animation Strategy](#4-animation-strategy)
5. [Page Architecture](#5-page-architecture)
6. [Component Build Order](#6-component-build-order)
7. [Asset Pipeline](#7-asset-pipeline)
8. [Performance Targets](#8-performance-targets)
9. [Testing Checklist](#9-testing-checklist)
10. [Launch Sequence](#10-launch-sequence)

---

## 1. Technology Stack

| Layer | Choice | Why |
|-------|--------|-----|
| HTML | Semantic HTML5 | Fast, crawlable, no overhead |
| CSS | Vanilla CSS + custom properties | Zero build step for critical path |
| JavaScript | Vanilla ES6 modules | Minimal, no framework needed |
| Smooth scroll | lenis (MIT, ~5KB gzip) | One focused library; loaded only on capable devices |
| Hosting | Cloudflare Pages or Netlify | Edge CDN with SA PoPs |

### Why not GSAP?

For an informational site, GSAP is significant weight (~55KB gzip for core + ScrollTrigger) in exchange for animations that don't serve the content. CSS handles fade-ins, hovers, and transitions well enough. lenis handles the one thing CSS can't — smooth scroll momentum on desktop.

### lenis CDN

```
https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js
```

Load with `defer`. Only initialise after confirming the device is capable (see Section 3).

---

## 2. Project Structure

```
/apex-transport/
  /css
    critical.css        ← Inlined into <head>; nav + hero only
    main.css            ← Async loaded
    tokens.css          ← All CSS custom properties
    animations.css      ← All CSS transitions and keyframes
  /js
    main.js             ← Entry point; runs tier check, loads lenis if Tier 3
    tier.js             ← Network + device tier detection
    nav.js              ← Mobile menu toggle
    form.js             ← Contact form validation + submission state
  /assets
    /icons              ← SVG files
    /images             ← Processed WebP/AVIF outputs
  /pages
    index.html
    services.html
    border-clearance.html
    fleet.html
    contact.html
    tracking.html
  404.html
```

---

## 3. Network Tiers

Two tiers only — the site is simple enough that a third tier adds complexity without benefit.

| Tier | Connection | What changes |
|------|-----------|--------------|
| 1 | 2G / save-data | Static page, CSS transitions only, lenis not loaded |
| 2 | 3G+ / desktop capable | lenis smooth scroll enabled |

### Detection (`tier.js`, inline in `<head>`)

```
Check 1 — navigator.connection.saveData === true  →  Tier 1
Check 2 — navigator.connection.effectiveType:
  "slow-2g" | "2g"  →  Tier 1
  anything else      →  Tier 2

Fallback (Safari/Firefox — no Network API):
  Fetch favicon, time response:
  > 800ms  →  Tier 1
  < 800ms  →  Tier 2

localStorage override: "apex-lite" = "true"  →  always Tier 1
```

Apply `class="tier-1"` or `class="tier-2"` to `<html>`. Expose a "Lite Mode" toggle in the footer.

### lenis init condition (in `main.js`)

Only initialise lenis when ALL of the following are true:
- Tier 2 detected
- `window.innerWidth >= 1024`
- `window.matchMedia('(hover: hover)').matches` (not a touch-primary device)
- `window.matchMedia('(prefers-reduced-motion: no-preference)').matches`

Smooth scroll on touch devices feels wrong. Desktop only.

---

## 4. Animation Strategy

CSS handles all animation on this site. No JavaScript animation library.

### Philosophy

Every element is visible and readable with no animation at all. Animations are a subtle polish layer — they should not be noticed, only felt.

### What CSS Handles

**On load (hero only):**
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Applied to hero headline, subtext, CTA — staggered via animation-delay */
.hero__title    { animation: fadeUp 0.6s ease-out both; }
.hero__subtitle { animation: fadeUp 0.6s ease-out 0.15s both; }
.hero__cta      { animation: fadeUp 0.6s ease-out 0.25s both; }
```

**Scroll reveals (Intersection Observer, no library):**
```css
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.reveal.is-visible {
  opacity: 1;
  transform: none;
}
```

A small vanilla JS Intersection Observer adds `is-visible` when elements enter the viewport. This is ~10 lines of code, no library required.

**Hover states (CSS only):**
- Cards: `translateY(-4px)` + box-shadow increase, `transition: 0.25s ease`
- Buttons: background darkens, `scale(1.02)`, `transition: 0.2s ease`
- Nav links: orange underline slides in from left (`scaleX 0→1`)
- Commodity images: `scale(1.03)` + overlay darkens

**Nav scroll behavior:**
- Starts transparent over hero
- CSS class `nav--scrolled` added via Intersection Observer when hero leaves viewport
- `nav--scrolled` applies `background-color: var(--apex-deep-blue)` with `transition: background-color 0.3s ease`

**Border timeline connector lines:**
- CSS `clip-path` or `scaleY` transition on connector element
- Triggered by Intersection Observer, same `is-visible` pattern

### What NOT to animate

- Page transitions — unnecessary for an informational site
- Count-up numbers — distracting; static numbers are cleaner
- Parallax — forbidden per design spec; performance cost, no content benefit

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Also skip the Intersection Observer `reveal` class logic entirely when reduced motion is detected — set all `.reveal` elements to `opacity: 1` immediately.

---

## 5. Page Architecture

### Homepage Sections

```
1. Navigation (fixed)
2. Hero — truck image, headline, CTA, service icon row
3. Trust Bar — 3 metrics (8 Countries, 24/7 Monitoring, 48h Clearance) (static numbers, no count-up)
4. Services Grid — 6 cards
5. Border Process — 4-step timeline
6. Commodities Grid — copper, cobalt, coal, chrome
7. Corridor Map — static image with route overlay
8. CTA Banner — full-width, orange
9. Footer — with Lite Mode toggle
```

### Other Pages

| Page | Key Notes |
|------|-----------|
| Services | Slim header (40vh), accordion for detail (no modals) |
| Border Clearance | Country selector tabs (CSS `:checked` Tier 1), document checklist |
| Fleet / Commodities | Filter by class (vanilla JS), tonnage in JetBrains Mono |
| Contact / Quote | 3 fields max, WhatsApp CTA above the form |
| Tracking | Single input, fetch to tracking API, result display |

---

## 6. Component Build Order

**Phase 1 — Foundation**

**Phase 1 — Foundation**
1. `tokens.css` — all `--variables` (colors, type scale, spacing, breakpoints)
2. Reset + base styles
3. Typography scale
4. Grid + layout utilities (container, section padding)
5. Navigation — static HTML structure
6. Footer — static HTML structure
7. Verify assets — confirm referenced `webp/*` files exist and run image pipeline (`sharp`) to generate responsive outputs and LQIPs
8. Content strings — enforce "No copy in HTML": import all text from `CONTENT.md` into a single JSON/YAML content file used by templates

**Phase 2 — Content Components (CSS only)**
7. Hero (image, overlay, text layout)
8. CTA Button (primary + secondary)
9. Service Card
10. Commodity Card
11. Border Timeline (vertical, static)
12. Trust Bar (static numbers)
13. Corridor Map (static image + SVG route layer)

**Phase 3 — Interactive Layer (Vanilla JS)**
14. Mobile nav toggle
15. Nav scroll class (Intersection Observer)
16. Scroll reveal (Intersection Observer + `is-visible` class)
17. Accordion for Services / Border Clearance pages
18. Commodity filter toggle
19. Contact form validation + submission state
20. Tracking lookup (fetch + result display)
21. Define tracking API contract (input: `loadRef` → output: `status`, `lastUpdate`, `ETA`, `progressStops`, `deliveredAt`, `podUrl`) and provide a mock endpoint for development

**Phase 4 — Smooth Scroll**
22. `tier.js` — detection, write class to `<html>`
23. lenis init in `main.js` (conditional, desktop Tier 2 only)
24. Verify lenis + Intersection Observer don't conflict (they don't by default — just confirm scroll events fire correctly)

---

## 7. Asset Pipeline

### Image Output Per Source

```
source.jpg
  → source-320w.avif   + source-320w.webp
  → source-768w.avif   + source-768w.webp
  → source-1280w.avif  + source-1280w.webp
  → source-lqip.jpg    (20px wide, base64, inline as CSS background)
```

Tools: `sharp` (Node) or squoosh.app for manual processing.

### Size Targets

| Context | Format | Max size |
|---------|--------|----------|
| Hero | AVIF / WebP | 200KB mobile, 400KB desktop |
| Commodity cards | WebP | 80KB each |
| Process / service icons | Inline SVG | <5KB each |

### LQIP

1. Resize to 20px wide, JPEG quality 20
2. Base64 encode → CSS `background-image` on the image wrapper
3. `filter: blur(10px); transform: scale(1.1)` on wrapper to hide blur edges
4. Real image fades in on load: `transition: opacity 0.3s`

### Icons

SVG `<symbol>` sprite in `<head>`. Reference with `<use href="#icon-name">`. Zero requests.

### Font Subsetting

Subset Inter to Latin Basic. Reduces ~280KB → ~30KB. Use `glyphhanger` or `pyftsubset`.  
JetBrains Mono: load only on Fleet/Commodities page — not globally.

---

## 8. Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint (3G) | <1.5s |
| Largest Contentful Paint (3G) | <2.5s |
| Cumulative Layout Shift | <0.05 |
| Page weight — mobile first paint | <500KB |
| JavaScript total | <20KB gzip |
| Lighthouse Performance | >90 |
| Lighthouse Accessibility | >95 |

Note: JS budget drops from 50KB to 20KB now that GSAP is gone. lenis is ~5KB gzip. The rest is your vanilla JS.

### Checkpoints

**After Phase 2:** JS disabled → page fully usable. Images have `width`/`height` set. Lighthouse >80.

**After Phase 3:** All interactions work. Form submits. Lighthouse >85.

**After Phase 4:** lenis absent on Slow 3G throttle. `prefers-reduced-motion` → no animation. Lighthouse >90. Real device test passes.

---

## 9. Testing Checklist

### Devices

| Priority | Device | Network |
|----------|--------|---------|
| P0 | Chrome DevTools | Slow 3G throttle |
| P0 | Samsung Galaxy A13 | MTN 3G (real SIM) |
| P1 | iPhone SE 3rd gen | Vodacom LTE |
| P1 | Tecno Spark | Airtel 2G |
| P2 | Desktop Chrome | Fibre |

### Scenarios

**Slow network:** Slow 3G throttle → page readable before any JS → lenis absent from Network tab → images lazy-load correctly.

**Contact flow:** Form submits → loading state → success state. WhatsApp button opens correct number. Phone numbers open dialer.

**Accessibility:** Full keyboard navigation. Focus indicators visible. Screen reader test. All images have descriptive alt text (not "truck image" — describe what's in it).

**Reduced motion:** Enable in OS settings → zero animation, all content immediately visible, no opacity:0 elements stuck hidden.

**Lite Mode toggle:** Click in footer → page reloads without lenis → class switches to `tier-1` on `<html>`.

---

## 10. Launch Sequence

### Pre-Launch

- [ ] Lighthouse: Performance >90, Accessibility >95
- [ ] Real device: Samsung A13 on MTN 3G
- [ ] Contact form: confirmed end-to-end delivery
- [ ] WhatsApp link: correct number, opens correctly
- [ ] All 6 pages linked and functional
- [ ] 404 page styled
- [ ] Analytics installed (GA4 or Plausible)
- [ ] Google Search Console verified
- [ ] SSL active
- [ ] Cloudflare CDN configured, SA PoP confirmed

### Launch Day

- [ ] Deploy to production
- [ ] Lighthouse from production URL
- [ ] Real device on real mobile data
- [ ] Submit sitemap to Search Console
- [ ] Contact form tested on production (not staging)

### Post-Launch (1 week)

- [ ] GA4: bounce rate, mobile sessions, contact conversions
- [ ] WebPageTest from Johannesburg node
- [ ] Optimise any images over budget

---

*Start at Phase 1, Component 1: `tokens.css`. Nothing renders until design tokens are defined.*