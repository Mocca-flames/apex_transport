# Border Clearance Page Restructure

## Goal

Transform `border-clearance.html` from a static info page into a connected narrative flow:
1. **What is border clearance** — educate the reader
2. **Why Apex is the best** — build credibility
3. **Convince them to choose us** — drive action

Remove per-country clearance **time** values from the accordion display.

---

## Current State

- `border-clearance.html` — mostly static HTML, accordion hardcoded inline
- `data/content.json` and `data/content_mobile.json` — `borderClearance` section has `hero`, `processSummary`, `keySteps`, `countries` (with `time` field), `cta`
- `js/content.js` — no build function for border-clearance specific sections; accordion not driven by JSON
- Inline `<style>` in border-clearance.html — only accordion CSS

---

## Target Page Flow (border-clearance.html)

```
1. Hero (existing — keep, make text dynamic via data-content)
2. "What Is Border Clearance?" (NEW)
   - Eyebrow: "What Is Border Clearance?"
   - Heading: "Paperwork. Permits. Compliance."
   - Body: Explains the process and what goes wrong
   - Highlight stat: "7+ customs authorities. 1 standard."
3. "Why Apex?" (NEW — guarantee cards)
   - Bonded carrier status across all major posts
   - On-ground agents who speak local languages
   - Digital documentation (ASYCUDA, pre-filing)
   - 6-hour dispatch guarantee
4. Process Timeline (existing — keep, make text dynamic)
5. "Where We Operate" accordion (RESTRUCTURED — built from JSON, no time shown)
   - Country name, flag, posts, note only
6. CTA Banner (existing — strengthen copy via JSON)
```

---

## JSON Changes

### `data/content.json` — `borderClearance` section

Replace/expand the existing object:

```json
"borderClearance": {
  "hero": {
    "eyebrow": "Border Clearance",
    "heading": "We clear borders.<br>Every time.",
    "sub": "Bonded carrier. Ground agents. 8 countries.",
    "image": "webp/img_2.webp",
    "alt": "Customs agent at border."
  },
  "whatIs": {
    "eyebrow": "What Is Border Clearance?",
    "heading": "Paperwork.<br>Permits. Compliance.",
    "body": "Every cross-border load crosses at least two customs jurisdictions. One missing document, one wrong HS code, one unpaid duty — and your truck sits at the gate. Border clearance is the full chain: export docs, import permits, transit bonds, duty payments, and physical release. Most shippers get it wrong once. We get it right every time.",
    "highlight": "7+ customs authorities. 1 standard."
  },
  "whyApex": [
    {
      "title": "Bonded Carrier",
      "body": "We hold bonded carrier status at every major Southern & Central African border. Your cargo moves under our bond — no delays, no extra bonds per trip."
    },
    {
      "title": "Agents on the Ground",
      "body": "Our agents are at the gate, not in an office. They speak the local language, know the officers, and clear your paperwork before the truck arrives."
    },
    {
      "title": "Digital First",
      "body": "ASYCUDA declarations, pre-filed docs, COMESA certs — all handled digitally. No lost forms, no last-minute surprises."
    },
    {
      "title": "6-Hour Dispatch",
      "body": "You WhatsApp us. We assign a truck and agent within 6 hours. No call-centre queues. No 'we'll get back to you'."
    }
  ],
  "processSummary": "We hold bonded carrier status across Beit Bridge, Kazungula, Chirundu, Kasumbalesa, Mchinji, Tlokweng, and more.",
  "keySteps": [
    "Document Check – Verified before truck leaves yard.",
    "Customs Lodge – ASYCUDA declarations submitted electronically.",
    "Transit Permit – Country-specific permits obtained.",
    "Crossing Complete — Load confirmed through."
  ],
  "countries": [
    {
      "name": "South Africa",
      "flag": "🇿🇦",
      "code": "ZA",
      "posts": "Beit Bridge (ZIM), Tlokweng (BOT)",
      "note": "SARS e-filing, CRW clearance handled by Apex."
    },
    {
      "name": "Zimbabwe",
      "flag": "🇿🇼",
      "code": "ZW",
      "posts": "Beit Bridge (SA), Chirundu (ZAM)",
      "note": "ZIMRA import permit, transit bond."
    },
    {
      "name": "Zambia",
      "flag": "🇿🇲",
      "code": "ZM",
      "posts": "Chirundu (ZIM), Kazungula (BOT/ZAM), Kasumbalesa (DRC)",
      "note": "ZRA clearance, COMESA certificate."
    },
    {
      "name": "DRC",
      "flag": "🇨🇩",
      "code": "DC",
      "posts": "Kasumbalesa (ZAM)",
      "note": "OGEFREM certificate, French-speaking agents."
    },
    {
      "name": "Malawi",
      "flag": "🇲🇼",
      "code": "MW",
      "posts": "Mchinji (ZAM)",
      "note": "MRA clearance, COMESA certificate."
    },
    {
      "name": "Botswana",
      "flag": "🇧🇼",
      "code": "BW",
      "posts": "Tlokweng (SA), Kazungula (ZAM)",
      "note": "BURS clearance, fastest corridor."
    },
    {
      "name": "Mozambique",
      "flag": "🇲🇿",
      "code": "MZ",
      "posts": "Lebombo, Ressano Garcia",
      "note": "Maputo corridor specialist."
    }
  ],
  "cta": {
    "heading": "Ready to clear your next border?",
    "sub": "Tell us your route and cargo. We handle every document — no gate delays.",
    "cta": { "label": "Get a Quote →", "href": "/contact.html" }
  }
}
```

**Key changes:**
- Added `whatIs` object (eyebrow, heading, body, highlight)
- Added `whyApex` array (4 guarantee items with title + body)
- Removed `time` field from each country entry; added `flag` and `code` for accordion display
- Enhanced `cta.sub` copy

Apply **identical changes** to `data/content_mobile.json`.

---

## border-clearance.html Changes

### 1. Keep hero section (lines 56–66), add `data-content` attributes to text elements

```html
<section class="hero section--dark" id="border-hero">
  ...
  <span class="hero__eyebrow" data-content="borderClearance.hero.eyebrow">Border Clearance</span>
  <h1 class="hero__title" data-content="borderClearance.hero.heading">We clear borders.<br>Every time.</h1>
  <p class="hero__subtitle" data-content="hero.hero.sub">Bonded carrier. Ground agents. 8 countries.</p>
  ...
</section>
```

### 2. Replace "Border Process Summary" section (lines 69–103) with two new sections

**Section A — What Is Border Clearance:**

```html
<section class="section section--light" id="border-what-is">
  <div class="container">
    <span class="section-header__eyebrow" data-content="borderClearance.whatIs.eyebrow">What Is Border Clearance?</span>
    <h2 class="section-header__title" data-content="borderClearance.whatIs.heading">Paperwork.<br>Permits. Compliance.</h2>
    <div style="max-width:760px; margin-top:var(--space-6);">
      <p style="font-size:var(--text-lg); color:var(--apex-charcoal); line-height:1.75;" data-content="borderClearance.whatIs.body"></p>
    </div>
    <div class="trust-bar" style="margin-top:var(--space-10);">
      <div class="trust-bar__grid">
        <div class="trust-bar__item">
          <span class="trust-bar__number" data-content="borderClearance.whatIs.highlight"></span>
          <span class="trust-bar__label">One Standard</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Section B — Why Apex (guarantee cards):**

```html
<section class="section section--dark" id="border-why-apex">
  <div class="container">
    <span class="section-header__eyebrow" style="color:var(--apex-orange);">Why Apex</span>
    <h2 class="section-header__title" style="color:var(--apex-white);">Built for borders.</h2>
    <div class="guarantees-grid" id="js-border-why-apex">
      <!-- Injected by content.js buildBorderWhyApex() -->
    </div>
  </div>
</section>
```

### 3. Keep process timeline section (lines 79–101), make text dynamic

```html
<div class="timeline__sub"
     data-content="borderClearance.keySteps[0]">Verified before truck leaves yard.</div>
```

Apply to all 4 timeline steps (replace static text with `data-content` pointing to `borderClearance.keySteps[0]` through `[3]`).

### 4. Replace Country Quick Reference accordion (lines 106–228)

**Remove all hardcoded `.country-item` divs.** Replace with:

```html
<div class="country-accordion" id="js-border-countries">
  <!-- Injected by content.js buildBorderCountries() -->
</div>
```

The JS build function reads `borderClearance.countries` from JSON and renders accordion items using `name`, `flag`, `code`, `posts`, `note` — **no time field**.

### 5. Keep CTA Block (lines 230–241), make text dynamic

```html
<h2 class="cta-banner__title" data-content="borderClearance.cta.heading">Ready to clear your next border?</h2>
<p class="cta-banner__sub"   data-content="borderClearance.cta.sub">Tell us your route and cargo.</p>
```

---

## js/content.js Changes

### 1. Add `buildBorderWhyApex()`

Reads `borderClearance.whyApex` array, renders `.guarantee-card` items into `#js-border-why-apex`.

```js
function buildBorderWhyApex() {
  var container = document.getElementById('js-border-why-apex');
  if (!container) return;
  var items = get('borderClearance.whyApex');
  if (!items || !items.length) return;

  var html = items.map(function(item, i) {
    return (
      '<div class="glass-card guarantee-card" style="--stagger-index:' + (i + 1) + '">' +
        '<h3 class="guarantee-card__title">' + item.title + '</h3>' +
        '<p class="guarantee-card__body">' + item.body + '</p>' +
      '</div>'
    );
  }).join('');

  container.innerHTML = html;
}
```

### 2. Add `buildBorderCountries()`

Reads `borderClearance.countries`, renders accordion items into `#js-border-countries`. **Does not render `time`.**

```js
function buildBorderCountries() {
  var container = document.getElementById('js-border-countries');
  if (!container) return;
  var countries = get('borderClearance.countries');
  if (!countries || !countries.length) return;

  var html = '';
  countries.forEach(function(country, index) {
    var id = 'country-' + (country.code || index);
    html +=
      '<div class="country-item">' +
        '<input type="checkbox" id="' + id + '" name="country">' +
        '<label class="country-label" for="' + id + '">' +
          '<span>' + (country.flag || '') + ' ' + country.name + '</span>' +
          '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
        '</label>' +
        '<div class="country-content">' +
          '<div class="country-detail">' +
            '<p><strong>Posts:</strong> ' + country.posts + '</p>' +
            '<p><strong>Note:</strong> ' + country.note + '</p>' +
          '</div>' +
        '</div>' +
      '</div>';
  });

  container.innerHTML = html;
}
```

### 3. Wire into `buildAll()`

```js
function buildAll() {
  buildNav();
  buildTicker();
  buildServicesPanels();
  buildServicesImages();
  buildProcessTimeline();
  buildCoverageSlides();
  buildPrinciples();
  buildTechBannerPills();
  buildFooter();
  buildAbout();
  buildBorderWhatIs();       // NEW
  buildBorderWhyApex();      // NEW
  buildBorderCountries();    // NEW
  injectSimpleContent();

  // existing debug logging...
}
```

### 4. Add `buildBorderWhatIs()` (optional — handles highlight stat)

```js
function buildBorderWhatIs() {
  var container = document.getElementById('border-what-is');
  if (!container) return;
  injectSimpleContent(); // resolves data-content attributes in that section
}
```

(Or simply rely on `injectSimpleContent()` in `buildAll()` to pick up all `data-content` attributes globally.)

---

## CSS Changes (in border-clearance.html `<style>` block, after existing accordion CSS)

```css
/* ── What Is Section ─────────────────────────────────────────── */
.border-what-is { padding-block: var(--space-16); }

/* ── Guarantee Cards (light text on dark bg, using glass-card base) ── */
.guarantees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-10);
}

.guarantee-card {
  background: var(--glass-surface);
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  padding: var(--space-8);
  backdrop-filter: blur(var(--glass-blur)) saturate(1.2);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.2);
}

.guarantee-card__title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: var(--text-xl);
  color: var(--apex-orange);
  margin-bottom: var(--space-3);
  line-height: 1.2;
}

.guarantee-card__body {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.65;
}

@media (max-width: 640px) {
  .guarantees-grid { grid-template-columns: 1fr; }
}
```

No changes to `components.css` required — all new styles are scoped to `border-clearance.html`.

---

## Summary of All Edits

| File | Action |
|------|--------|
| `data/content.json` | Add `whatIs`, `whyApex` to `borderClearance`; remove `time` from countries; add `flag` + `code` |
| `data/content_mobile.json` | Same as above |
| `border-clearance.html` | Restructure sections; add `data-content` attrs; replace accordion with `#js-border-countries`; add `#js-border-why-apex`; add inline CSS |
| `js/content.js` | Add `buildBorderWhyApex()`, `buildBorderCountries()`, call from `buildAll()` |

---

## Validation

1. Load `border-clearance.html` — verify 5 sections render in order: hero → what-is → why-apex → process → countries → CTA
2. Open DevTools console — verify no `[Apex Content]` errors
3. Expand each country accordion — confirm **no time** is shown, only posts and note
4. Verify guarantee cards render with orange title + white body on dark background
5. Verify `injectSimpleContent()` populates all `data-content` text on the page
6. Test at mobile viewport (≤1024px) — confirm `content_mobile.json` loads correctly and same sections render
7. Check existing pages (index, services, about) — confirm no regressions from content.js changes
