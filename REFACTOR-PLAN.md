# Refactor Plan: Static Content + Mobile Override

## Current Architecture

```
content.json → JS fetches at runtime → injects into HTML
content_mobile.json → JS fetches for mobile → overrides text
```

**Problem:** Crawlers see empty `<div>` elements until JS executes. Googlebot may not fully render JS, missing critical content.

---

## Current State (from `js/content.js`)

```
content.js fetches JSON at runtime → builds HTML dynamically
Crawlers see empty <div> until JS executes
```

**The problem:** Googlebot may not execute JS, missing critical content.

---

## Proposed Architecture

```
┌─────────────────────────────────────────────┐
│  HTML FILES (static)                        │
│  └─ content.json baked into markup          │
│     (desktop SEO version)                   │
├─────────────────────────────────────────────┤
│  JS (DOMContentLoaded)                      │
│  └─ if mobile → fetch content_mobile.json   │
│     └─ replace text via data-swap-id attrs  │
└─────────────────────────────────────────────┘
```

**Result:**
- Crawlers see full desktop content (SEO)
- Mobile users get optimized shorter text
- No FOUC if we swap early
- Zero JS dependency for content

---

## Files Affected

| File | Action | Purpose |
|------|--------|---------|
| `build.js` | **Create** | Reads JSON, bakes into HTML |
| `index.html` | Modify | Desktop content baked in |
| `services.html` | Modify | Desktop content baked in |
| `border-clearance.html` | Modify | Desktop content baked in |
| `fleet.html` | Modify | Desktop content baked in |
| `contact.html` | Modify | Desktop content baked in |
| `about.html` | Modify | Desktop content baked in |
| `consolidation-loads.html` | Modify | Desktop content baked in |
| `js/content.js` | Modify | Remove runtime fetch, keep swap |
| `data/content.json` | Keep | Source of truth (desktop) |
| `data/content_mobile.json` | Keep | Mobile override source |

---

## Implementation Steps

### Step 1: Create `build.js`

Reads both JSON files, bakes desktop content as text + mobile content as `data-swap-mobile` attributes:

```js
const fs = require('fs');
const desktop = JSON.parse(fs.readFileSync('data/content.json', 'utf8'));
const mobile = JSON.parse(fs.readFileSync('data/content_mobile.json', 'utf8'));

function get(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

// Process each HTML file
['index.html', 'services.html', ...].forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  
  // Replace {{path}} with desktop content
  // Add data-swap-mobile="..." attribute with mobile content
  html = html.replace(
    /\{\{([^}]+)\}\}/g,
    (match, path) => {
      const key = path.trim();
      const desktopVal = get(desktop, key);
      const mobileVal = get(mobile, key);
      
      if (desktopVal === undefined) return match;
      
      // Return desktop text with mobile data attribute
      if (mobileVal !== undefined && mobileVal !== desktopVal) {
        return `<span data-swap-mobile="${mobileVal}">${desktopVal}</span>`;
      }
      return desktopVal;
    }
  );
  
  fs.writeFileSync(file, html);
});
```

### Step 2: Add Placeholders in HTML

Replace dynamic content with `{{path}}` syntax:

```html
<h1>{{home.hero.headline}}</h1>
<p>{{home.hero.subheadline}}</p>
```

### Step 3: Add Inline Swap Script in `<head>`

Zero network requests — swaps from baked-in `data-swap-mobile` attributes:

```html
<script>
(function() {
  if (!window.matchMedia('(max-width: 768px)').matches) return;
  document.querySelectorAll('[data-swap-mobile]').forEach(function(el) {
    el.textContent = el.dataset.swapMobile;
  });
})();
</script>
```

### Step 4: Simplify `js/content.js`

Remove the runtime fetch entirely. Keep only:
- Mobile detection (`isMobile()`)
- Swap logic (reads `data-swap-mobile` attributes)
- Any remaining dynamic builders (process timeline, coverage slides, etc.)

### Step 5: Run `node build.js` Before Deploy

Bakes both desktop and mobile content into HTML. Swap is instant.

---

## What Gets Hardcoded Per Page

### index.html (Home)
- Hero: eyebrow, headline, subheadline, cta labels
- Services: label, heading, intro, 6 service cards (title, desc, benefit)
- Process: steps
- Coverage: countries, legend
- Values: principles
- Fleet preview: titles
- Tech banner: heading, pills
- Contact CTA: heading, body

### services.html
- Hero: eyebrow, heading, sub
- Service list: 6 items (title, desc, benefit)
- CTA: heading, sub

### border-clearance.html
- Hero: eyebrow, heading, sub
- What Is section: eyebrow, heading, body
- Why Apex: 4 cards
- Countries: 7 entries
- CTA

### fleet.html
- Hero: eyebrow, heading, sub
- Gallery: 5 items
- Stats: 4 values
- CTA

### contact.html
- Hero: eyebrow, heading, sub
- WhatsApp CTA: heading, body, button
- Form: fields, labels
- Office: details
- FAQ: 3 items

### about.html
- Hero: eyebrow, heading, sub
- Company overview: title, body
- Core services: 3 items
- Geographic footprint: 6 countries
- Why Apex: guarantees
- Process: 7 steps
- Network: partners
- Stats
- CTA

### consolidation-loads.html
- Hero: eyebrow, headline, subheadline
- How it works: 3 steps
- Calculator: labels, disclaimer
- Why consolidate: 4 reasons
- Corridors: heading
- Trust: 3 items
- FAQ: 5 items
- CTA

---

## Tradeoffs

| Aspect | Static + Swap (New) | Pure JS Injection (Current) |
|--------|---------------------|----------------------------|
| SEO | ✅ Always crawlable | ⚠️ JS-dependent |
| FOUC | ✅ Zero — instant swap | ⚠️ Flash of empty content |
| Network | ✅ Zero requests for swap | ⚠️ Fetch delays on slow 3G |
| Maintenance | ⚠️ Build step needed | ✅ Single source |
| Performance | ✅ Content in DOM immediately | ⚠️ Fetch delay |
| Complexity | ⚠️ Two files (build.js + swap) | ✅ One file (content.js) |

---

## Recommendation

**Raw HTML + build.js + baked dual content** is the right choice because:
1. No framework dependency — just Node.js
2. Content rarely changes — build step is minimal overhead
3. SEO is non-negotiable — crawlers see baked-in content
4. Mobile swap is instant — zero fetch, zero FOUC
5. Simple to maintain — one script, one swap, zero network requests

## What Changes

**Before (current `content.js`):**
```
HTML (empty) → JS fetches JSON → builds DOM
Crawlers see: empty divs
```

**After (refactored):**
```
build.js bakes BOTH desktop + mobile → HTML
JS swaps data-swap-mobile attributes (no fetch)
Crawlers see: complete desktop content
Mobile: instant swap, zero FOUC
```

## What Stays the Same

- `data/content.json` — source of truth (desktop)
- `data/content_mobile.json` — mobile overrides
- `js/content.js` — keeps swap logic, loses fetch logic
- All existing JS modules (services.js, coverage.js, etc.)

## HTML Output Example

```html
<!-- Desktop content baked in as text -->
<h1>
  <!-- Mobile content baked as data attribute -->
  <span data-swap-mobile="Cargo that moves fast">
    Cargo that moves.<br><span class="highlight">Borders that clear.</span><br>No excuses.
  </span>
</h1>
```

**Swap (instant, no fetch):**
```js
if (isMobile()) {
  el.textContent = el.dataset.swapMobile;
}
```

---

## Decisions (Confirmed)

1. **Raw HTML + build.js** — No framework, custom script
2. **Content rarely changes** — Build step is fine
3. **CSS media query** — `matchMedia("(max-width: 768px)")`
4. **Before first paint** — Inline script in `<head>`, no FOUC

## Build Command

```bash
node build.js && echo "Build complete"
```

Run before deploy. Bakes JSON into HTML.
