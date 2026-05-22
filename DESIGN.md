# Apex Transport Group — Design System
**Version:** 2.0 | **Date:** 2026-05-09
**Inspired by:** Deriv.com (dark cinematic data-forward) × Honor.com/za (full-bleed section storytelling)

---

## Design Philosophy

**"Industrial Cinematic."**

Apex moves the continent's heaviest cargo across its hardest borders. The site must feel like it. Not a shy corporate brochure — a serious operator's showcase.

The guiding tension: a **white-first reading canvas** punctuated by **cinematic navy explosions**. Most sections breathe on off-white — copy is legible, trust is built. Then the navy hits and the imagery swallows the viewport. That contrast is the rhythm. That rhythm is the brand.

**The one thing visitors remember:** A truck emerging from dust against a dark navy sky — and a single orange CTA button that was impossible to miss.

**What Deriv taught us about layout:**
- Never use a symmetric equal-column grid for storytelling. Deriv's homepage is a series of *asymmetric reveals* — image dominates 60–70% of the horizontal field, type floats in the remaining space.
- Depth is created by *layering*, not by adding more content. Glass cards float above images. Text hovers over gradients. Stats ticker cuts across the vertical flow.
- Every scroll increment should feel like turning a page, not moving a list.

**What this means in practice:**
- Section layouts are `60/40`, `70/30`, or full-bleed — never `50/50`
- Cards are often staggered or masonry for visual rhythm; services use a balanced 6-card responsive grid (3×2 desktop, 2×2 tablet, 1×1 mobile)
- Typography is either very large (display, hero) or very small (caption, mono stat) — the midrange is sparse
- Images are cropped for focal drama, not scaled to fit — a wheel, a gate, a border stamp, a copper coil

---

## 1.1 Alignment Notes (2026-05-09)

**Source of truth:** `CONTENT.md` drives all copy and structure. DESIGN.md adapts to content, not vice versa.

**Resolved discrepancies:**
- Services grid: **6 cards** (not 4-card staggered lead). See §7.5.
- Navigation: **6 items** (Home, Services, Border Clearance, Fleet, Contact, Track Your Load). See §4.
- Ticker: **countries loop + service keywords** (storytelling first). See §7.2.
- Trust bar stats: **8 Countries · 24/7 Monitoring · 48h Clearance**. See §7.3.
- Coverage section: **interactive 8-country grid** with hover popups (not static map). See §7.7.
- Service order: preserved as written in CONTENT.md (Border Documentation → Direct Communication).

**Tech stack adjustment:** GSAP removed per PLAN.md §4. Animation handled via CSS transitions + IntersectionObserver. Lenis used for smooth scroll on desktop Tier 2 only.

---

## 1. Color Tokens

```css
/* tokens.css — import this file first, always */
:root {

  /* ── Primary Palette ─────────────────────────────── */
  --apex-navy:        #0d1f3c;   /* Hero backgrounds, nav, footer */
  --apex-navy-mid:    #1e3a5f;   /* Section dark alternates, card backs */
  --apex-navy-light:  #2a4a73;   /* Hover states on dark surfaces */

  /* ── Action ──────────────────────────────────────── */
  --apex-orange:      #c2410c;   /* CTAs on dark, icons on light */
  --apex-orange-hot:  #ea580c;   /* Hover on orange elements */
  --apex-orange-glow: rgba(194, 65, 12, 0.25); /* Glow halos on dark */
  --apex-orange-subtle: rgba(194, 65, 12, 0.08); /* Tint on light sections */

  /* ── Neutrals ────────────────────────────────────── */
  --apex-white:       #ffffff;
  --apex-off-white:   #f5f4f0;   /* Warm light canvas — body bg */
  --apex-stone:       #e8e5df;   /* Dividers on light sections */
  --apex-charcoal:    #111827;   /* Body text on light */
  --apex-muted:       #6b7280;   /* Captions, supporting copy */

  /* ── Glass / Surface (Deriv-inspired) ───────────── */
  --glass-surface:    rgba(255, 255, 255, 0.06);
  --glass-surface-md: rgba(255, 255, 255, 0.10);
  --glass-border:     rgba(255, 255, 255, 0.12);
  --glass-border-hot: rgba(255, 255, 255, 0.24);
  --glass-blur:       14px;

  /* ── Functional ──────────────────────────────────── */
  --apex-success:     #16a34a;
  --apex-warning:     #d97706;
  --apex-error:       #dc2626;

  /* ── Grain / Texture ─────────────────────────────── */
  /* Applied as a pseudo-element on dark sections — prevents flat "digital dark" */
  --grain-opacity:    0.035;

  /* ── Gradients ───────────────────────────────────── */
  --grad-hero:        linear-gradient(
                        165deg,
                        rgba(13, 31, 60, 0.72) 0%,
                        rgba(26, 50, 88, 0.55) 55%,
                        rgba(15, 37, 64, 0.78) 100%
                      );
  --grad-orange-edge: linear-gradient(
                        90deg,
                        var(--apex-orange) 0%,
                        rgba(194, 65, 12, 0.0) 60%
                      );
  --grad-card-dark:   linear-gradient(
                        145deg,
                        rgba(30, 58, 95, 0.9) 0%,
                        rgba(13, 31, 60, 0.95) 100%
                      );
  --grad-image-up:    linear-gradient(
                        to top,
                        rgba(13, 31, 60, 0.95) 0%,
                        rgba(13, 31, 60, 0.4)  45%,
                        transparent            100%
                      );
  --grad-section-transition: linear-gradient(
                        180deg,
                        var(--apex-navy)      0%,
                        var(--apex-off-white) 100%
                      );
}
```

**Contrast rules — non-negotiable:**
| Context | CTA color | Text color | Meets |
|---------|-----------|------------|-------|
| White / off-white bg | `.btn-navy` (`#0d1f3c`) | `#ffffff` | AA ✓ |
| Navy / dark bg | `.btn-primary` (`#c2410c`) | `#ffffff` | AA ✓ |
| Orange bg (ticker) | — | `#ffffff` | AA ✓ |
| Orange text on white | ✗ NEVER as body text | — | Fails |

Orange (`--apex-orange`) appears on white *only* as: icon fills, underline accents, border highlights, glow halos — never as full-fill buttons or running text.

---

## 2. Typography

**Two-tier system:** Display for drama, Barlow for everything else. JetBrains Mono for data only.

```css
@import url('https://fonts.googleapis.com/css2?
  family=Barlow+Condensed:wght@600;700;800&
  family=Barlow:wght@400;500;600&
  family=JetBrains+Mono:wght@500&
  display=swap');
```

| Role | Family | Weight | Size | Treatment |
|------|--------|--------|------|-----------|
| Hero H1 (display) | Barlow Condensed | 800 | clamp(3rem, 10vw, 7rem) | ALL-CAPS, -0.03em tracking |
| Section H2 | Barlow Condensed | 700 | clamp(2rem, 5vw, 3.5rem) | Mixed case, lh 1.05 |
| Feature subhead | Barlow Condensed | 600 | clamp(1.25rem, 3vw, 2rem) | Sentence case |
| Card title | Barlow | 600 | 1.125rem | lh 1.2 |
| Body | Barlow | 400 | 1rem | 1.625 lh |
| Caption / meta | Barlow | 400 | 0.8125rem | `--apex-muted` |
| Numbers / metrics | JetBrains Mono | 500 | varies | Tabular nums, lh 1 |
| Ticker / labels | Barlow Condensed | 700 | 0.75rem | ALL-CAPS, 0.1em tracking |

```css
/* Type Scale */
:root {
  --text-xs:    0.75rem;     /* 12px */
  --text-sm:    0.875rem;    /* 14px */
  --text-base:  1rem;        /* 16px */
  --text-lg:    1.125rem;    /* 18px */
  --text-xl:    1.25rem;     /* 20px */
  --text-2xl:   1.5rem;      /* 24px */
  --text-3xl:   1.875rem;    /* 30px */
  --text-4xl:   2.25rem;     /* 36px */
  --text-5xl:   3rem;        /* 48px */
  --text-6xl:   3.75rem;     /* 60px */
  --text-7xl:   4.5rem;      /* 72px */
  --text-8xl:   6rem;        /* 96px — hero stat desktop */
  --text-9xl:   8rem;        /* 128px — oversized ghost text */
}

/* Hero headline — Honor-style cinematic */
.hero__title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: clamp(var(--text-4xl), 10vw, var(--text-8xl));
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: 0.95;           /* Tighter than 1 — makes columns of text stack densely */
  color: var(--apex-white);
}

.hero__title .accent {
  color: var(--apex-orange);
  /* Optional: text-shadow: 0 0 40px var(--apex-orange-glow) on very dark heroes */
}

/* Ghost text — decorative, very large, low opacity, bleeds off-canvas */
.ghost-text {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: clamp(var(--text-7xl), 18vw, var(--text-9xl));
  text-transform: uppercase;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(13, 31, 60, 0.08); /* On white canvas */
  /* On dark canvas: -webkit-text-stroke: 1px rgba(255,255,255,0.06) */
  user-select: none;
  pointer-events: none;
  position: absolute;
  white-space: nowrap;
}
```

**Typography rules:**
- One word per hero headline gets the `.accent` treatment — never more
- Ghost text appears behind section headers as a decorative anchor, never above content
- Captions (`--text-xs`) always use `--apex-muted` or `rgba(255,255,255,0.55)` — never full white or full black
- Letter-spacing on all-caps text: minimum `0.06em`, typically `0.10em`
- Never use medium weight (500) in display sizes — go 400 or 700/800

---

## 3. Spacing & Layout

```css
:root {
  /* 8px base grid */
  --space-1:   0.25rem;    /* 4px  */
  --space-2:   0.5rem;     /* 8px  */
  --space-3:   0.75rem;    /* 12px */
  --space-4:   1rem;       /* 16px */
  --space-5:   1.25rem;    /* 20px */
  --space-6:   1.5rem;     /* 24px */
  --space-8:   2rem;       /* 32px */
  --space-10:  2.5rem;     /* 40px */
  --space-12:  3rem;       /* 48px */
  --space-16:  4rem;       /* 64px */
  --space-20:  5rem;       /* 80px */
  --space-24:  6rem;       /* 96px */
  --space-32:  8rem;       /* 128px */
  --space-40:  10rem;      /* 160px — hero padding */
  --space-48:  12rem;      /* 192px — cinematic breathing room */

  /* Section vertical rhythm */
  --section-pad-sm:  var(--space-16);
  --section-pad-md:  var(--space-24);
  --section-pad-lg:  var(--space-32);

  /* Container */
  --container-max:    1360px;
  --container-wide:   1600px;   /* Full-bleed image containers */
  --container-narrow:  900px;   /* Editorial copy columns */
  --container-pad:    clamp(var(--space-6), 4vw, var(--space-16));

  /* Breakpoints */
  --bp-sm:   640px;
  --bp-md:   768px;
  --bp-lg:  1024px;
  --bp-xl:  1280px;
  --bp-2xl: 1536px;
}

.container       { width: 100%; max-width: var(--container-max);    margin-inline: auto; padding-inline: var(--container-pad); }
.container--wide { width: 100%; max-width: var(--container-wide);   margin-inline: auto; }
.container--narrow { width: 100%; max-width: var(--container-narrow); margin-inline: auto; padding-inline: var(--container-pad); }
```

### Layout Grammar — The Anti-Grid Rules

**Never** use a symmetric `50/50` or `33/33/33` grid for primary storytelling. Every layout should have a dominant side and a subordinate side.

```
/* Approved layout splits */

/* Standard feature — image leads */
.layout-feature {
  display: grid;
  grid-template-columns: 62fr 38fr;   /* Image : Copy */
  gap: 0;                              /* Features bleed — no gap */
  align-items: stretch;
}
@media (max-width: 1024px) {
  .layout-feature { grid-template-columns: 1fr; }
}

/* Reversed — copy leads */
.layout-feature--reverse {
  grid-template-columns: 38fr 62fr;
}

/* Editorial — wide image with floating card overlay */
.layout-editorial {
  position: relative;
  /* Image is full-width. Card is absolutely positioned, offset into the image */
}
.layout-editorial__card {
  position: absolute;
  bottom: var(--space-12);
  right: var(--space-12);
  max-width: 400px;
  /* Glass card styles */
}

/* Staggered card row — 3 cards at different vertical positions */
.layout-stagger {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
  align-items: start;             /* Cards top-align, not stretch */
}
.layout-stagger > *:nth-child(2) {
  margin-top: var(--space-10);    /* Middle card drops */
}
.layout-stagger > *:nth-child(3) {
  margin-top: var(--space-5);     /* Third card half-drops */
}
```

**Section alternation pattern (homepage — actual build):**
```
DARK CINEMATIC  → Hero (100vh, full-bleed)
ORANGE STRIP    → Ticker (marquee)
LIGHT           → Trust Bar (3 metrics)
LIGHT           → Services Grid (6 cards, white cards on off-white)
DARK CINEMATIC  → Process (62/38 split, glass card overlay)
LIGHT           → Coverage (interactive country grid, 8 cards)
DARK CINEMATIC  → Values (4 principle glass cards, staggered)
LIGHT           → Fleet Gallery (preview 5-item grid)
DARK CINEMATIC  → Tech Banner (orange edge gradient, black silhouette)
LIGHT           → Contact CTA (split image + form teaser)
CHARCOAL        → Footer
```

---

## 4. Navigation (Updated 2026-05-09 — 6 items, aligned to CONTENT.md)

**Behavior:** Transparent on hero → frosted white on scroll. Sticky. Hamburger at `<1024px`. Mobile overlay includes contact footer (CONTENT.md lines 58–65).

```
Desktop (6 main items + CTA):
┌──────────────────────────────────────────────────────────────────┐
│  [◆ APEX]  Home  Services  Border Clearance  Fleet  Contact  Track  │  [WhatsApp Us →]
└──────────────────────────────────────────────────────────────────┘

Mobile overlay (full-screen):
┌─────────────────┐
│  [✕]            │
│                 │
│  HOME           │  ← Barlow Condensed 700, --text-4xl
│  SERVICES       │
│  BORDER         │
│  FLEET          │
│  CONTACT        │
│  TRACK          │
│                 │
│  [WhatsApp] +27 │  ← pinned bottom (mobile footer)
└─────────────────┘
```

**Note:** Earlier mocks listed "Corridors" as a nav item. Final structure uses 6 items per CONTENT.md (Home, Services, Border Clearance, Fleet, Contact, Track Your Load). Coverage is a homepage section and `/coverage` anchor, not a top-level nav entry.

**Desktop (compact representation):**
```
┌──────────────────────────────────────────────────────────────────┐
│  [◆ APEX]  Home | Services | Border | Fleet | Contact | Track  │  [WhatsApp Us →]
└──────────────────────────────────────────────────────────────────┘
```

**Mobile overlay (full-screen):**
```
┌─────────────────┐
│  [✕]            │
│                 │
│  HOME           │  ← Barlow Condensed 700, --text-4xl
│  SERVICES       │
│  BORDER         │  (abbr for Border Clearance)
│  FLEET          │
│  CONTACT        │
│  TRACK          │  (abbr for Track Your Load)
│                 │
│  [WhatsApp] +27 │  ← pinned bottom (mobile footer)
└─────────────────┘
```

```css
.nav {
  position: fixed;
  top: 0;
  inset-inline: 0;
  z-index: 1000;
  background: transparent;
  transition:
    background-color 0.4s var(--ease-out),
    backdrop-filter  0.4s var(--ease-out),
    border-color     0.4s var(--ease-out);
}

.nav--scrolled {
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(8px) saturate(1.4);
  border-bottom: 1px solid rgba(13, 31, 60, 0.06);
}

/* Nav link */
.nav__link {
  font-family: 'Barlow', sans-serif;
  font-weight: 500;
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.80);
  letter-spacing: 0.02em;
  position: relative;
  transition: color var(--dur-base) var(--ease-out);
}
.nav--scrolled .nav__link {
  color: var(--apex-charcoal);
}
.nav__link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--apex-orange);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s var(--ease-out);
}
.nav__link:hover,
.nav__link.is-active { color: var(--apex-white); }
.nav--scrolled .nav__link:hover,
.nav--scrolled .nav__link.is-active { color: var(--apex-navy); }
.nav__link:hover::after,
.nav__link.is-active::after { transform: scaleX(1); }

/* CTA in nav */
.nav__cta {
  /* Transparent outlined on dark hero */
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  color: var(--apex-white);
  background: transparent;
  transition:
    background 0.3s,
    border-color 0.3s,
    color 0.3s,
    box-shadow 0.3s;
}
.nav--scrolled .nav__cta {
  background: var(--apex-orange);
  border-color: var(--apex-orange);
  color: var(--apex-white);
}
.nav--scrolled .nav__cta:hover {
  background: var(--apex-orange-hot);
  box-shadow: 0 4px 20px var(--apex-orange-glow);
}

/* Services mega dropdown — glass panel */
.nav__dropdown {
  position: absolute;
  top: calc(100% + var(--space-3));
  left: 0;
  min-width: 520px;
  background: rgba(13, 31, 60, 0.96);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: var(--space-6);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  opacity: 0;
  transform: translateY(-8px);
  pointer-events: none;
  transition:
    opacity 0.2s var(--ease-out),
    transform 0.2s var(--ease-out);
}
.nav__item:hover .nav__dropdown {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
```

---

## 5. Lenis Scroll System

Lenis is the scroll foundation. Every scroll-driven effect goes through it. CSS handles the cosmetics; Lenis provides the velocity data and the smooth scroll easing.

### 5.1 Initialisation

```js
// scroll.js — initialise once, export instance
import Lenis from 'lenis';

const lenis = new Lenis({
  duration:    1.2,
  easing:      t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // Expo easing
  orientation: 'vertical',
  smoothWheel: true,
  touchMultiplier: 1.5,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Respect prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  lenis.destroy();
}

export default lenis;
```

### 5.2 Scroll-Progress Values

Lenis exposes `scroll`, `velocity`, and `progress` on its instance. Bind these to CSS custom properties on `<html>` so any element can read them.

```js
// In the raf loop
lenis.on('scroll', ({ scroll, limit, velocity, progress }) => {
  document.documentElement.style.setProperty('--scroll-y',    scroll);
  document.documentElement.style.setProperty('--scroll-prog', progress.toFixed(4));
  document.documentElement.style.setProperty('--scroll-vel',  Math.abs(velocity).toFixed(3));

  // Nav state
  document.querySelector('.nav').classList.toggle('nav--scrolled', scroll > 80);
});
```

### 5.3 Parallax — Lenis-Driven

Don't use CSS `background-attachment: fixed` (compositing nightmare). Use transform on the image element, driven by Lenis scroll.

```js
// parallax.js
import lenis from './scroll.js';

export function initParallax() {
  const layers = document.querySelectorAll('[data-parallax]');

  lenis.on('scroll', ({ scroll }) => {
    layers.forEach(el => {
      const speed  = parseFloat(el.dataset.parallax) || 0.3;
      const rect   = el.closest('section').getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const delta  = (window.innerHeight / 2 - center) * speed;
      el.style.transform = `translate3d(0, ${delta.toFixed(2)}px, 0)`;
    });
  });
}
```

```html
<!-- Usage: image moves slower than scroll (pulls back into frame) -->
<section class="hero">
  <img src="truck-kasumbalesa.webp" data-parallax="0.25" alt="..." />
</section>

<!-- Decorative vector motif moves faster (floats above scroll) -->
<div class="motif" data-parallax="-0.15" aria-hidden="true"></div>
```

**Speed reference:**
| `data-parallax` | Effect |
|-----------------|--------|
| `0.0` | Locked (no parallax) |
| `0.15–0.3` | Subtle — hero bg images |
| `0.4–0.6` | Medium — floating decoration |
| `-0.1` to `-0.2` | Floats upward against scroll — motifs, ghost text |

### 5.4 Velocity-Driven Effects

Lenis velocity (rate of scroll change) can drive visual feedback:

```js
// velocity-warp.js — subtle image warp on fast scroll
lenis.on('scroll', ({ velocity }) => {
  const clamped = Math.min(Math.abs(velocity), 12);
  const warp    = 1 + clamped * 0.003; // max ~1.036
  document.querySelectorAll('.hero__img, .feature__img').forEach(img => {
    img.style.transform = `scale(${warp.toFixed(4)})`;
    img.style.filter    = `blur(${(clamped * 0.12).toFixed(2)}px)`;
  });
});
```

Keep the effect subtle — at normal scroll speeds nothing visible happens. On rapid scroll (mobile flick), images breathe slightly. It reads as responsiveness, not gimmick.

### 5.5 Scroll-Reveal with IntersectionObserver

Lenis and IntersectionObserver co-exist cleanly. IO detects when elements enter the viewport; Lenis handles the scroll smoothness underneath.

```js
// reveal.js
export function initReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);  // Fire once only
      }
    });
  }, {
    threshold:  0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  elements.forEach(el => io.observe(el));
}
```

```css
/* Reveal base — before visible */
.reveal       { opacity: 0; transform: translateY(28px); }
.reveal-up    { opacity: 0; transform: translateY(40px); }
.reveal-left  { opacity: 0; transform: translateX(-40px); }
.reveal-right { opacity: 0; transform: translateX(40px); }

/* Transition applied to all */
.reveal,
.reveal-up,
.reveal-left,
.reveal-right {
  transition:
    opacity   var(--dur-reveal) var(--ease-out),
    transform var(--dur-reveal) var(--ease-out);
}

/* On visible */
.reveal.is-visible,
.reveal-up.is-visible,
.reveal-left.is-visible,
.reveal-right.is-visible {
  opacity: 1;
  transform: none;
}

/* Stagger children — set --stagger-index on each child inline */
/* e.g. <div class="reveal" style="--stagger-index:0"> */
.reveal[style*='--stagger-index'] {
  transition-delay: calc(var(--stagger-index, 0) * 90ms);
}

/* Reduced motion override */
@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal-up, .reveal-left, .reveal-right {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

---

## 6. Vector Art Motif System

Oversized, abstract SVG shapes anchor sections visually on the white canvas. They link the white reading field to the cinematic navy moments without using navy as a full background.

### 6.1 Motif Rules

- **Scale:** motifs should extend *beyond* the container — allow `overflow: hidden` on the section to clip edges. The point is that they bleed off.
- **Opacity:** 6–14% on white sections. Never above 18% or they fight photography.
- **Color:** primarily `--apex-navy` (at low opacity) with occasional `--apex-orange` at 4–8% as a focal accent.
- **Placement:** bottom-left, top-right, or diagonally opposite to the section's primary image — they frame, not compete.
- **Animation:** motifs move at `-0.12` to `-0.15` parallax speed (floating upward against scroll).

### 6.2 Motif Library

```html
<!-- motifs.svg — inline in <head> or as <defs> in section -->

<!-- M1: Broken Circle Arc — used behind trust bar and feature sections -->
<symbol id="motif-arc" viewBox="0 0 600 600">
  <circle cx="300" cy="300" r="260"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-dasharray="420 80 180 100"
    stroke-linecap="round" />
  <circle cx="300" cy="300" r="200"
    fill="none"
    stroke="currentColor"
    stroke-width="0.75"
    stroke-dasharray="200 60 100 320"
    opacity="0.5" />
</symbol>

<!-- M2: Angled Ribbon — used at section transitions -->
<symbol id="motif-ribbon" viewBox="0 0 800 200">
  <polygon points="0,200 800,80 800,120 0,240"
    fill="currentColor"
    opacity="0.5" />
  <polygon points="0,160 800,40 800,55 0,175"
    fill="currentColor"
    opacity="0.25" />
</symbol>

<!-- M3: Halftone Dot Grid — subtle texture on light sections -->
<symbol id="motif-dots" viewBox="0 0 240 240">
  <pattern id="dot-pattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </pattern>
  <rect width="240" height="240" fill="url(#dot-pattern)" />
</symbol>

<!-- M4: Diagonal Line Field — industrial texture -->
<symbol id="motif-lines" viewBox="0 0 400 400">
  <pattern id="line-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"
    patternTransform="rotate(30)">
    <line x1="0" y1="0" x2="0" y2="20" stroke="currentColor" stroke-width="0.75" />
  </pattern>
  <rect width="400" height="400" fill="url(#line-pattern)" />
</symbol>

<!-- M5: Large Angular Shield — echoes logo mark, used as hero BG motif -->
<symbol id="motif-shield" viewBox="0 0 500 560">
  <path d="M250 20 L460 120 L460 310 C460 430 350 520 250 540 C150 520 40 430 40 310 L40 120 Z"
    fill="none"
    stroke="currentColor"
    stroke-width="1.25" />
  <path d="M250 60 L420 145 L420 305 C420 410 330 490 250 510 C170 490 80 410 80 305 L80 145 Z"
    fill="none"
    stroke="currentColor"
    stroke-width="0.6"
    opacity="0.5" />
</symbol>
```

**Usage pattern in a light section:**

```html
<section class="section--light" style="position: relative; overflow: hidden;">

  <!-- Motif: top-right, bleeds off canvas -->
  <div class="section__motif" aria-hidden="true" data-parallax="-0.12"
    style="position: absolute; top: -80px; right: -120px; width: 520px; height: 520px;
           color: var(--apex-navy); opacity: 0.09; pointer-events: none;">
    <svg width="100%" height="100%" aria-hidden="true"><use href="#motif-arc" /></svg>
  </div>

  <!-- Content -->
  <div class="container">...</div>
</section>
```

---

## 7. Component Library

### 7.1 Hero (Homepage)

100vh. Full-bleed photograph. Dark overlay via gradient (not solid navy). Type anchored bottom-left or center-left.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   [Truck at Kasumbalesa, dusk, dust in air, golden hour]        │
│   [data-parallax="0.2" — image moves slower than scroll]        │
│                                                                  │
│                                                                  │
│   RELIABLE LOADS.                                               │
│   RELIABLE ██████.          ← "REACH" in --apex-orange          │
│                                                                  │
│   Southern & Central Africa's heavy cargo partner.             │
│   Copper · Coal · Cobalt · Chrome.                              │
│                                                                  │
│   [GET A QUOTE →]     [TRACK YOUR LOAD]                         │
│                                                                  │
│  ──────────────────────────────────────────────────────────    │
│  🚛  TRUCK     📄  DOCS     🛂  BORDER     📍  TRACK            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

```css
.hero {
  position: relative;
  height: 100svh;
  min-height: 620px;
  display: flex;
  align-items: flex-end;        /* Anchor text to bottom-left */
  overflow: hidden;
}

.hero__media {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__img {
  width: 100%;
  height: 115%;             /* Overshoot for parallax headroom */
  object-fit: cover;
  object-position: center 30%;
  transform-origin: center;
  will-change: transform;   /* Parallax via JS */
}

/* Layered overlays — gradient, not flat navy */
.hero__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top,  rgba(13, 31, 60, 0.90) 0%,  rgba(13, 31, 60, 0.05) 50%),
    linear-gradient(to right, rgba(13, 31, 60, 0.60) 0%, transparent 65%);
}

.hero__content {
  position: relative;
  z-index: 2;
  padding: var(--space-16) var(--container-pad);
  padding-bottom: var(--space-20);
  max-width: 820px;
}

/* Stagger reveal — set via JS adding is-visible after load */
.hero__eyebrow  { --stagger-index: 0; }
.hero__title    { --stagger-index: 1; }
.hero__subtitle { --stagger-index: 2; }
.hero__actions  { --stagger-index: 3; }
.hero__iconrow  { --stagger-index: 4; }

/* Icon row — horizontal scroll on mobile */
.hero__iconrow {
  display: flex;
  gap: var(--space-8);
  overflow-x: auto;
  scrollbar-width: none;
  padding-top: var(--space-10);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin-top: var(--space-8);
}
.hero__iconrow::-webkit-scrollbar { display: none; }

.hero__icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  min-width: 72px;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color var(--dur-base);
}
.hero__icon-item svg { color: var(--apex-orange); }
.hero__icon-item:hover { color: var(--apex-white); }
```

**CTA glow (Deriv-style):**
```css
.btn-primary--glow {
  box-shadow:
    0 0 0   1px var(--apex-orange),
    0 0 24px   var(--apex-orange-glow),
    0 0 60px   rgba(194, 65, 12, 0.12);
}
.btn-primary--glow:hover {
  box-shadow:
    0 0 0   1px var(--apex-orange-hot),
    0 0 32px   rgba(234, 88, 12, 0.4),
    0 0 80px   rgba(234, 88, 12, 0.18);
  transform: translateY(-3px);
}
```

### 7.2 Ticker Strip (Storytelling — Countries + Services)

Full-width orange band. Continuous marquee. Duplicated content for seamless loop.

**Content strategy (CONTENT-aligned, 2026-05-09):** Alternating two loops reinforces geographic reach and service capabilities simultaneously — not just stats.

Loop A — Countries:
`South Africa ▪ Zimbabwe ▪ Zambia ▪ DRC ▪ Botswana ▪ Malawi ▪ Tanzania ▪ Mozambique`

Loop B — Service capabilities:
`Border Docs ▪ Customs Clearance ▪ Route Planning ▪ Real-Time Tracking`

Repeat from start. Total track length: 16 items (8 countries + 4 services) duplicated = 32 spans.

```css
.ticker {
  background: var(--apex-orange);
  color: var(--apex-white);
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: var(--text-sm);
  letter-spacing: 0.10em;
  text-transform: uppercase;
  padding-block: var(--space-2);
  overflow: hidden;
  position: relative;
  z-index: 10;
}

.ticker__track {
  display: flex;
  align-items: center;
  width: max-content;
  animation: ticker-scroll 28s linear infinite;
  /* Pause on hover — optional for accessibility */
}
.ticker:hover .ticker__track { animation-play-state: paused; }

.ticker__item {
  padding-inline: var(--space-8);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  white-space: nowrap;
}

/* Divider diamond between items */
.ticker__item::after {
  content: '◆';
  font-size: 0.5em;
  opacity: 0.6;
  margin-left: var(--space-8);
}

@keyframes ticker-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

```html
<!-- Duplicate content for loop — first copy + second copy -->
<div class="ticker" role="marquee" aria-label="Countries and services">
  <div class="ticker__track">
    <!-- Loop A: Countries (8 items) -->
    <span class="ticker__item">South Africa</span>
    <span class="ticker__item">Zimbabwe</span>
    <span class="ticker__item">Zambia</span>
    <span class="ticker__item">DRC</span>
    <span class="ticker__item">Botswana</span>
    <span class="ticker__item">Malawi</span>
    <span class="ticker__item">Tanzania</span>
    <span class="ticker__item">Mozambique</span>
    <!-- Loop B: Service capabilities (4 items) -->
    <span class="ticker__item">Border Docs</span>
    <span class="ticker__item">Customs Clearance</span>
    <span class="ticker__item">Route Planning</span>
    <span class="ticker__item">Real-Time Tracking</span>
    <!-- Duplicate exactly for seamless loop -->
    <span class="ticker__item">South Africa</span>
    <span class="ticker__item">Zimbabwe</span>
    <span class="ticker__item">Zambia</span>
    <span class="ticker__item">DRC</span>
    <span class="ticker__item">Botswana</span>
    <span class="ticker__item">Malawi</span>
    <span class="ticker__item">Tanzania</span>
    <span class="ticker__item">Mozambique</span>
    <span class="ticker__item">Border Docs</span>
    <span class="ticker__item">Customs Clearance</span>
    <span class="ticker__item">Route Planning</span>
    <span class="ticker__item">Real-Time Tracking</span>
  </div>
</div>
```

### 7.3 Trust Bar

Light section. Three operational metrics. Static — no count-up. Values from CONTENT.md (aligned 2026-05-09).

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│        8              24/7              48h           │
│    COUNTRIES      MONITORING        CLEARANCE         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

```css
.trust-bar {
  background: var(--apex-off-white);
  padding-block: var(--space-16);
}

.trust-bar__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* Dividers via box-shadow — no extra elements */
  gap: 0;
}

.trust-bar__item {
  padding: var(--space-8) var(--space-10);
  text-align: center;
  border-right: 1px solid var(--apex-stone);
}
.trust-bar__item:last-child { border-right: none; }

.trust-bar__number {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(var(--text-4xl), 5vw, var(--text-6xl));
  font-weight: 500;
  color: var(--apex-navy);
  line-height: 1;
  display: block;
}

.trust-bar__label {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--apex-orange);
  margin-top: var(--space-2);
  display: block;
}

.trust-bar__sub {
  font-size: var(--text-sm);
  color: var(--apex-muted);
  margin-top: var(--space-1);
  display: block;
}
```

### 7.4 Glass Card (Deriv-inspired)

Use only on dark sections (`--apex-navy` or `--apex-navy-mid`). On white, `backdrop-filter` has no effect.

```css
.glass-card {
  background: var(--glass-surface);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(var(--glass-blur)) saturate(1.2);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.2);
  border-radius: 14px;
  padding: var(--space-8);
  position: relative;
  overflow: hidden;
  transition:
    transform    var(--dur-base) var(--ease-out),
    box-shadow   var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-out);
}

/* Inner glow line at top — Deriv detail */
.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
}

.glass-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 24px 56px rgba(0, 0, 0, 0.45),
    0 0 0 1px var(--apex-orange);
  border-color: var(--apex-orange);
}

.glass-card__icon {
  width: 44px;
  height: 44px;
  color: var(--apex-orange);
  margin-bottom: var(--space-5);
  /* Optional: subtle glow behind icon */
  filter: drop-shadow(0 0 8px var(--apex-orange-glow));
}

.glass-card__title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: var(--text-xl);
  color: var(--apex-white);
  margin-bottom: var(--space-3);
  line-height: 1.15;
}

.glass-card__body {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.65;
}

/* Accent bar — orange bottom edge on hover (Deriv-pattern) */
.glass-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--apex-orange);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s var(--ease-out);
}
.glass-card:hover::after { transform: scaleX(1); }
```

### 7.5 Service Cards — 6-Card Grid (aligned to CONTENT.md)

**Update 2026-05-09:** CONTENT.md defines 6 distinct services. The grid is a clean, equal-height responsive layout — not a staggered lead-card pattern.

```css
/* 6-card grid: 3 columns desktop, 2 tablet, 1 mobile */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}
@media (max-width: 1024px) {
  .services-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .services-grid { grid-template-columns: 1fr; }
}

/* Service card variant (white background on light sections) */
.service-card {
  background: var(--apex-white);
  border: 1px solid var(--apex-stone);
  border-radius: 12px;
  padding: var(--space-8);
  transition: transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out);
  height: 100%;
}
.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(13,31,60,0.12);
  border-color: var(--apex-orange);
}
.service-card__icon {
  width: 48px;
  height: 48px;
  color: var(--apex-orange);
  margin-bottom: var(--space-4);
}
.service-card__title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: var(--text-xl);
  color: var(--apex-navy);
  margin-bottom: var(--space-3);
  line-height: 1.2;
}
.service-card__body {
  font-size: var(--text-sm);
  color: var(--apex-charcoal);
  line-height: 1.6;
  opacity: 0.85;
}
```

**Service order (per CONTENT.md priority):**
1. Border Documentation
2. Customs Clearance
3. Route Planning
4. Transporter Network
5. Real-Time Monitoring
6. Direct Communication

### 7.6 Commodity Cards — Masonry / Staggered

Not a neat grid. Cards have different aspect ratios. They are the *image* — type is just the label. This same pattern is reused for the Coverage (Where We Operate) country grid with uniform images.

```
Desktop:
┌──────────────────────┬────────────────┬────────────────┐
│                      │  COPPER        │  COAL          │
│   COBALT             │  [tall img]    │  [short img]   │
│   [very tall img]    │                │                │
│                      ├────────────────┤                │
│                      │  CHROME        │  FERTILISER    │
│                      │  [tall img]    │  [short img]   │
└──────────────────────┴────────────────┴────────────────┘
```

```css
.commodity-grid {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  grid-template-rows: auto;
  gap: var(--space-3);
}

/* First card — tall, dominant */
.commodity-grid > *:first-child {
  grid-row: span 2;
  aspect-ratio: unset;
  min-height: 480px;
}

/* Other cards */
.commodity-grid > *:not(:first-child) {
  aspect-ratio: 4/3;
}

@media (max-width: 1024px) {
  .commodity-grid {
    grid-template-columns: 1fr 1fr;
  }
  .commodity-grid > *:first-child {
    grid-column: 1 / -1;
    grid-row: span 1;
    min-height: 280px;
    aspect-ratio: 16/7;
  }
}

@media (max-width: 640px) {
  .commodity-grid {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}
```

```css
/* Card base */
.commodity-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 100%;
}

.commodity-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.0);
  transition: transform 0.6s var(--ease-out);
  will-change: transform;
}
.commodity-card:hover .commodity-card__img { transform: scale(1.05); }

.commodity-card__overlay {
  position: absolute;
  inset: 0;
  background: var(--grad-image-up);
  transition: opacity 0.3s;
}
.commodity-card:hover .commodity-card__overlay { opacity: 0.85; }

.commodity-card__content {
  position: absolute;
  bottom: var(--space-6);
  left: var(--space-6);
  right: var(--space-6);
}

.commodity-card__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--apex-orange);
  display: inline-block;
  margin-right: var(--space-2);
  margin-bottom: var(--space-2);
}

.commodity-card__title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: var(--text-2xl);
  color: var(--apex-white);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: 1;
  display: block;
}

.commodity-card__route {
  font-size: var(--text-xs);
  color: var(--apex-orange);
  letter-spacing: 0.10em;
  text-transform: uppercase;
  margin-top: var(--space-2);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.3s, transform 0.3s;
}
.commodity-card:hover .commodity-card__route {
  opacity: 1;
  transform: none;
}
```

### 7.7 Coverage (Where We Operate) — Interactive Country Grid

**Aligned to CONTENT.md 2026-05-09:** 8 countries in a responsive grid. Each card reveals status on hover/focus. Uniform image placeholder (currently `cross.webp` in implementation) — not staggered masonry.

**States (per country):**
- South Africa — Hub (🇿🇦)
- Zimbabwe — Active (🇿🇼)
- Zambia — Active (🇿🇲)
- DRC — Specialist (🇨🇩)
- Botswana — Active (🇧🇼)
- Malawi — Active (🇲🇼)
- Tanzania — Active (🇹🇿)
- Mozambique — Active (🇲🇿)

**Legend:** 🏠 Hub | 🛣️ Active | ⚠️ Specialist

**Layout:** 4 columns desktop, 2 tablet, 1 mobile (same `.commodity-grid` base). Quick stats bar below (8 Countries · 15+ Routes · 48h Clearance) uses `.trust-bar__grid`.

**Popup (hover/focus):** Simple tooltip with flag emoji, country name, status. In current implementation, a `country-popup` element reveals on `:hover`/`:focus-within`.

---

### 7.8 Feature Section Layout (Cinematic split)

Image-dominant 62/38 split. Glass card overlays the image — it does not sit beside it.

```
DARK SECTION:
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  ┌─────────────────────────────────┐  ←62% wide image   │
│  │                                 │                      │
│  │  [Border gate at Beit Bridge]   │  ┌──────────────┐   │
│  │  [data-parallax="0.2"]          │  │ GLASS CARD   │  ←│─ floats on image edge
│  │                                 │  │ 4-step count │   │
│  │                                 │  │ process text │   │
│  └─────────────────────────────────┘  └──────────────┘   │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

```css
.feature-split {
  display: grid;
  grid-template-columns: 62fr 38fr;
  min-height: 600px;
  overflow: hidden;
}

.feature-split__media {
  position: relative;
  overflow: hidden;
}
.feature-split__img {
  width: 100%;
  height: 115%;
  object-fit: cover;
  object-position: center;
  will-change: transform;     /* Parallax applied via JS */
}

.feature-split__content {
  background: var(--apex-navy-mid);
  padding: var(--space-16) var(--space-12);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Alternative: card overlaps the image */
.feature-editorial {
  position: relative;
}
.feature-editorial__media {
  width: 100%;
  height: 680px;
  overflow: hidden;
}
.feature-editorial__img {
  width: 100%;
  height: 115%;
  object-fit: cover;
  will-change: transform;
}
.feature-editorial__card {
  position: absolute;
  bottom: var(--space-12);
  right: var(--space-12);
  max-width: 380px;
  /* Apply .glass-card styles */
}
```

### 7.9 Border Process Timeline

Four steps. Horizontal desktop, vertical mobile. Lines draw in on scroll via CSS transition triggered by IntersectionObserver.

```css
.timeline {
  display: flex;
  align-items: flex-start;
  gap: 0;
  position: relative;
}

/* Connecting line — sits behind nodes */
.timeline__track {
  position: absolute;
  top: 22px;          /* Vertically centered on nodes */
  left: 22px;
  right: 22px;
  height: 2px;
  background: var(--apex-stone);
  z-index: 0;
}
.timeline__track-fill {
  height: 100%;
  width: 0%;
  background: var(--apex-orange);
  transition: width 1.2s var(--ease-out);
}
.timeline.is-visible .timeline__track-fill { width: 100%; }

/* Step */
.timeline__step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  z-index: 1;
  padding-inline: var(--space-4);
}

/* Node */
.timeline__node {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--apex-off-white);
  border: 2px solid var(--apex-stone);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--apex-muted);
  transition:
    border-color 0.4s var(--ease-out),
    background   0.4s var(--ease-out),
    color        0.4s var(--ease-out);
  flex-shrink: 0;
}
.timeline__step.is-active .timeline__node {
  background: var(--apex-navy);
  border-color: var(--apex-orange);
  color: var(--apex-white);
}
.timeline__step.is-complete .timeline__node {
  background: var(--apex-orange);
  border-color: var(--apex-orange);
  color: var(--apex-white);
}

/* Label */
.timeline__label {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: var(--text-sm);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--apex-charcoal);
  text-align: center;
}
.timeline__sub {
  font-size: var(--text-xs);
  color: var(--apex-muted);
  text-align: center;
  line-height: 1.5;
}

/* Mobile — vertical */
@media (max-width: 768px) {
  .timeline {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }
  .timeline__track {
    top: 22px;
    bottom: 22px;
    left: 22px;
    right: unset;
    width: 2px;
    height: auto;
  }
  .timeline__track-fill {
    width: 2px;
    height: 0%;
    transition: height 1.2s var(--ease-out);
  }
  .timeline.is-visible .timeline__track-fill {
    width: 2px;
    height: 100%;
  }
  .timeline__step {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
    padding-block: var(--space-6);
    padding-inline: 0;
    gap: var(--space-4);
  }
  .timeline__node { flex-shrink: 0; }
}
```

### 7.10 Buttons

```css
/* ── Primary — Orange (dark sections only) ────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--apex-orange);
  color: var(--apex-white);
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: var(--text-base);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: var(--space-3) var(--space-7);
  border-radius: 6px;
  border: 2px solid transparent;
  cursor: pointer;
  transition:
    background  var(--dur-base) var(--ease-out),
    transform   var(--dur-base) var(--ease-spring),
    box-shadow  var(--dur-base) var(--ease-out);
}
.btn-primary:hover {
  background: var(--apex-orange-hot);
  transform: translateY(-2px);
  box-shadow: 0 8px 28px var(--apex-orange-glow);
}
.btn-primary:active { transform: translateY(0); }

/* ── Secondary — Outlined ghost ─────────────────── */
.btn-secondary {
  background: transparent;
  color: var(--apex-white);
  border: 2px solid var(--glass-border);
  /* Inherits font/size from .btn-primary — apply both classes */
}
.btn-secondary:hover {
  border-color: var(--apex-orange);
  color: var(--apex-orange);
  background: var(--apex-orange-subtle);
}

/* ── Navy — for white/light section CTAs ────────── */
.btn-navy {
  background: var(--apex-navy);
  color: var(--apex-white);
  border: 2px solid transparent;
}
.btn-navy:hover {
  background: var(--apex-navy-mid);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 31, 60, 0.25);
}

/* ── Arrow icon within button ───────────────────── */
.btn svg {
  width: 16px;
  height: 16px;
  transition: transform var(--dur-base) var(--ease-out);
}
.btn:hover svg { transform: translateX(3px); }

/* ── Spinner state ──────────────────────────────── */
.btn[aria-busy="true"] {
  pointer-events: none;
  opacity: 0.75;
}
.btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: var(--apex-white);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

### 7.11 Full-Width CTA Banner

```css
.cta-banner {
  position: relative;
  background: var(--apex-navy);
  padding-block: var(--space-24);
  overflow: hidden;
}

/* Orange gradient from left edge */
.cta-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--grad-orange-edge);
  opacity: 0.6;
  pointer-events: none;
}

/* Ghost silhouette image — right-aligned, low opacity */
.cta-banner__silhouette {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 55%;
  object-fit: cover;
  object-position: left center;
  opacity: 0.07;
  pointer-events: none;
  mix-blend-mode: luminosity;
}

.cta-banner__content {
  position: relative;
  z-index: 2;
  max-width: 720px;
}

.cta-banner__title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: clamp(var(--text-3xl), 5vw, var(--text-6xl));
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--apex-white);
  line-height: 0.95;
  margin-bottom: var(--space-4);
}

.cta-banner__sub {
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--space-8);
}

.cta-banner__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}
```

---

## 8. Grain Texture Overlay

Every dark section gets a subtle noise texture. It prevents the sterile "flat dark" look and gives depth that reads subconsciously. Applied via CSS pseudo-element — no extra images.

```css
/* Grain — applied to .section--dark and .section--mid */
.section--dark,
.section--mid {
  position: relative;
  isolation: isolate;
}

.section--dark::after,
.section--mid::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: var(--grain-opacity);  /* 0.035 */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 180px;
  background-repeat: repeat;
}

/* Content must be above grain */
.section--dark > *,
.section--mid > * {
  position: relative;
  z-index: 1;
}
```

---

## 9. Animation Tokens

```css
:root {
  /* ── Durations ───────────────────────── */
  --dur-fast:   0.15s;
  --dur-base:   0.25s;
  --dur-slow:   0.45s;
  --dur-reveal: 0.60s;
  --dur-stagger-unit: 90ms;  /* Multiply by index */

  /* ── Easings ─────────────────────────── */
  --ease-out:    cubic-bezier(0.0,  0,    0.2, 1);
  --ease-in:     cubic-bezier(0.4,  0,    1,   1);
  --ease-inout:  cubic-bezier(0.4,  0,    0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Overshoot — CTAs, card lifts */
  --ease-expo:   cubic-bezier(0.19, 1,    0.22, 1);   /* Large reveals */
}
```

**The animation stack — three layers, each with a role:**

| Layer | Technique | Controls |
|-------|-----------|---------|
| Scroll easing | Lenis | Duration `1.2s`, expo easing — silky scroll |
| Entrance reveals | IntersectionObserver + CSS | `.reveal` classes, 60ms IO delay |
| Hover micro-interactions | CSS `transition` | Max `0.3s`, `var(--ease-out)` |

**What is never animated:**
- Page transitions — informational site; users jump sections
- Number count-ups — static JetBrains Mono numbers are credible, count-ups are fluff
- Parallax background-attachment — use JS-driven transform instead
- `prefers-reduced-motion` override — if set, `lenis.destroy()` and remove all `.reveal` classes

---

## 10. Navigation — Sticky Subnav (Services page)

Appears after the hero on scroll. Anchors the 4-section Services page. Honor-pattern.

```css
.subnav {
  background: var(--apex-navy);
  position: sticky;
  top: var(--nav-height, 72px);  /* Set as CSS var in JS: document.documentElement.style.setProperty('--nav-height', nav.offsetHeight + 'px') */
  z-index: 500;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.subnav__list {
  display: flex;
  gap: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.subnav__list::-webkit-scrollbar { display: none; }

.subnav__link {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 600;
  font-size: var(--text-sm);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  padding: var(--space-4) var(--space-6);
  white-space: nowrap;
  position: relative;
  transition: color var(--dur-base);
}
.subnav__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: var(--space-6);
  right: var(--space-6);
  height: 3px;
  background: var(--apex-orange);
  border-radius: 2px 2px 0 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s var(--ease-out);
}
.subnav__link:hover            { color: var(--apex-white); }
.subnav__link.is-active        { color: var(--apex-white); }
.subnav__link.is-active::after { transform: scaleX(1); }
```

---

## 11. Form System

```css
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.field__label {
  font-family: 'Barlow', sans-serif;
  font-weight: 500;
  font-size: var(--text-sm);
  color: var(--apex-charcoal);
  letter-spacing: 0.01em;
}

.field__input,
.field__textarea {
  width: 100%;
  background: var(--apex-white);
  border: 1.5px solid var(--apex-stone);
  border-radius: 8px;
  padding: var(--space-3) var(--space-4);
  font-family: 'Barlow', sans-serif;
  font-size: var(--text-base);
  color: var(--apex-charcoal);
  outline: none;
  transition:
    border-color var(--dur-base) var(--ease-out),
    box-shadow   var(--dur-base) var(--ease-out);
  appearance: none;
}

.field__input:focus,
.field__textarea:focus {
  border-color: var(--apex-orange);
  box-shadow: 0 0 0 3px var(--apex-orange-subtle);
}

.field__input::placeholder,
.field__textarea::placeholder {
  color: var(--apex-muted);
}

/* Error state */
.field--error .field__input,
.field--error .field__textarea {
  border-color: var(--apex-error);
}
.field--error .field__input:focus,
.field--error .field__textarea:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
}
.field__error-msg {
  font-size: var(--text-xs);
  color: var(--apex-error);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
```

---

## 12. Accessibility Baseline

| Requirement | Implementation |
|-------------|----------------|
| Color contrast | Min 4.5:1 body; 3:1 large text. Orange text on white: never. |
| Focus indicators | `outline: 2.5px solid var(--apex-orange); outline-offset: 4px` — all interactive |
| Skip link | `<a class="skip-link" href="#main">Skip to main content</a>` — visible on focus |
| Alt text | Descriptive: "Side-tipper crossing Kasumbalesa border gate with copper load, dusk" |
| Keyboard nav | Tab order = visual order; mobile menu traps focus; Esc closes overlays |
| ARIA | `aria-expanded` on accordion; `aria-live="polite"` on tracking; `role="status"` on form |
| Reduced motion | `lenis.destroy()` + `.reveal` opacity set to 1 immediately |
| Touch targets | Min 44×44px — verify on ticker items and subnav links |
| Ticker | `aria-label="Key statistics"` on `.ticker`; `aria-hidden="true"` on decorative separators |
| Parallax | All `data-parallax` elements are decorative — `aria-hidden="true"` |

```css
/* Skip link */
.skip-link {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  z-index: 9999;
  background: var(--apex-orange);
  color: var(--apex-white);
  padding: var(--space-2) var(--space-4);
  border-radius: 6px;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: var(--text-sm);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transform: translateY(-200%);
  transition: transform var(--dur-base);
}
.skip-link:focus { transform: none; }
```

---

## 13. Icon System

SVG `<symbol>` sprite. All 24×24 viewBox, `stroke-width: 1.75`, stroke-only, `currentColor`. Inline in `<head>`.

| ID | Used in |
|----|---------|
| `#icon-truck` | Nav, hero row, service card |
| `#icon-document` | Docs service, border checklist |
| `#icon-border-gate` | Border section, corridor map |
| `#icon-tracking` | Tracking page, hero icon row |
| `#icon-shield` | Compliance, trust bar |
| `#icon-arrow-right` | All CTA buttons |
| `#icon-phone` | Contact, footer |
| `#icon-whatsapp` | WhatsApp CTAs (filled, `#25d366`) |
| `#icon-chevron-down` | Accordion trigger |
| `#icon-check` | Checklist, success states |
| `#icon-map-pin` | Corridor map, office |
| `#icon-menu` | Hamburger open |
| `#icon-close` | Mobile menu close |
| `#icon-external` | External links |

```html
<!-- Usage -->
<svg aria-hidden="true" focusable="false" width="24" height="24">
  <use href="#icon-truck" />
</svg>
```

---

## 14. Footer

```css
.footer {
  background: var(--apex-charcoal);
  color: rgba(255, 255, 255, 0.6);
  padding-block: var(--space-16) var(--space-8);
}

.footer__grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--space-12);
  padding-bottom: var(--space-12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.footer__brand-tagline {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  max-width: 260px;
  margin-top: var(--space-3);
}

.footer__heading {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--apex-orange);
  margin-bottom: var(--space-4);
}

.footer__link {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.55);
  display: block;
  margin-bottom: var(--space-2);
  transition: color var(--dur-base);
}
.footer__link:hover { color: var(--apex-white); }

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-6);
  font-size: var(--text-xs);
  color: rgba(255, 255, 255, 0.35);
}

@media (max-width: 1024px) {
  .footer__grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .footer__grid { grid-template-columns: 1fr; gap: var(--space-8); }
  .footer__bottom { flex-direction: column; gap: var(--space-4); text-align: center; }
}
```

---

## 15. Design Decisions Log

| Decision | Rationale |
|----------|-----------|
| White-first canvas with navy moments | SA market reads informational sites on white. Navy "explosions" (hero, cinematic sections) feel dramatic *because* they contrast the white baseline. |
| 62/38 feature splits, not 50/50 | Asymmetry creates visual hierarchy. The image leads. The copy annotates. |
| Service cards: 6-card balanced grid | CONTENT.md defines six distinct services. Equal grid is clearer for scanning than staggered lead-card pattern. |
| Commodity masonry for gallery, uniform grid for coverage | Commodity/Fleet gallery uses staggered masonry for visual rhythm; Coverage (Where We Operate) uses uniform 8-card grid with hover popups for consistent country comparison. |
| Lenis over GSAP ScrollTrigger | GSAP is 55KB+ gzip. Lenis is 3KB and gives us the smooth scroll + velocity data we need. Complex animations live in CSS. |
| Ghost text as decorative anchor | Large, low-opacity section labels give white sections visual weight without adding color or breaking the clean canvas. |
| Grain overlay on dark sections | Prevents the sterile "flat navy" look. The grain is subconscious depth — 0.035 opacity, invisible at a glance. |
| `--apex-orange` never as body text on white | `#c2410c` on `#ffffff` = 3.87:1 contrast — fails WCAG AA for text. Orange is accent only on white. `.btn-navy` is the primary CTA on light sections. |
| Parallax via JS transform, not background-attachment | `background-attachment: fixed` creates a new stacking context on many browsers and breaks compositing on mobile. JS-driven `transform: translate3d` stays on GPU. |
| Barlow Condensed 800 at -0.03em tracking | At 72–96px, condensed display type at default tracking looks loose. Negative tracking tightens columns of text into a single read unit — the "RELIABLE REACH" headline reads as a block, not two words. |
| `lenis.destroy()` on prefers-reduced-motion | We don't reduce motion — we remove it. A partial motion reduction risks triggering vertigo in users with vestibular disorders. All-or-nothing is safer. |
| WhatsApp above the form (contact page) | In ZA/ZAM/DRC, WhatsApp has 90%+ smartphone penetration for business contact. The form is a fallback for users without WhatsApp or who prefer paper trails. |
| Interactive country cards over static map | Users explore each market's status (Hub/Active/Specialist). Reinforces operational depth; static map is less engaging and heavier to implement responsively. |
| JetBrains Mono for numbers only | Distinguishes data from prose. Every time you see monospace, you know it's a number that matters. Using it everywhere removes the signal. |

---

*Start with `tokens.css`. Every file imports from it.*
*Lenis initialises once in `scroll.js` — export the instance, don't create multiple.*
*Section-level motifs, grain, and parallax are opt-in via data attributes — the page works without JS.*