# Consolidation Loads — Extension Page Spec

**File target:** `consolidation-loads.html` (new standalone page, linked from the site navigation and/or the home page teaser)
**Priority:** Keep the page visually aligned with the existing Apex site system and reuse the same token-driven CSS foundation already used across the current pages.

---

## 0. Design direction

Ground rule for everything below: the page must communicate one idea clearly and quickly — "share the truck, split the cost." The audience is an SME shipper or subcontractor in SA/SADC, typically browsing on a phone outdoors, with glare, thumb-size tap targets, and limited patience.

### Use the existing Apex token system, not a new palette

Do not introduce a separate brand palette. This page should map to the same CSS variables already defined in [css/tokens.css](css/tokens.css):

- Use `--apex-navy` and `--apex-navy-mid` for dark section backgrounds.
- Use `--apex-orange`, `--apex-orange-hot`, and `--apex-orange-glow` for the primary CTA emphasis.
- Use `--apex-off-white` as the body/light section canvas.
- Use `--apex-charcoal` for body text and `--apex-muted` for secondary text.
- Use `--apex-stone` for light dividers and subtle borders.
- Use `--glass-surface`, `--glass-surface-md`, `--glass-border`, and `--glass-blur` only where the page needs translucent UI layering on dark sections.

This page should feel like a chapter of the same site, not a microsite with a competing visual identity.

### Typography

Align to the site's typography stack already imported in [css/base.css](css/base.css):

- Headings: `Barlow Condensed` with the site's uppercase/condensed treatment.
- Body copy: `Barlow`.
- Inline numbers, weight labels, and calculator readouts: `JetBrains Mono` only for data-driven UI.

Do not invent a new headline font system or create a separate type ramp.

### Layout system

Reuse the site's current route and utility classes instead of inventing new ones:

- `hero` + `section--dark` for the hero shell.
- `section` + `section--light` for editorial content blocks.
- `container` and `container--narrow` for width control.
- `btn`, `btn-primary`, `btn-secondary`, and `btn-navy` for CTAs.
- `reveal` and `reveal-up` for scroll behavior.
- Native `<details>/<summary>` for expandable copy.
- Spacing from `--space-*` tokens rather than hard-coded pixel values.

### Signature element: the Load Gauge

The Load Gauge is the one bold, memorable element that should own the "share the truck, split the cost" message in a single glance.

It should be implemented as a single reusable component that can render:

- full-size on this page, and
- mini-size in a teaser or reuse block on the home page.

The visual treatment should stay in the existing Apex design language: navy background, orange emphasis, muted light panel, mono readout for weight/rate values, and motion only when it is useful.

---

## 1. Hero section

Use the existing site hero structure so the page behaves consistently with the rest of the site.

Required structure:

- `section.hero.section--dark`
- `.hero__media` for the full-bleed lead image
- `.hero__overlay` for the dark gradient treatment
- `.hero__content.container` for headline, subhead, and CTA stack

Recommended content:

- Eyebrow: "Consolidation Loads"
- Headline: "One Truck. Everyone's Cargo."
- Subhead: "Share space on a truck that is already running your route — pay only for the tons you send."
- Primary CTA: "Get an Instant Estimate" linking to Section 3
- Secondary CTA: "See How It Works" linking to Section 2

The hero should be mobile-first and should not require hover states to work.

---

## 2. How consolidation works

This section should use the site's existing editorial card / step approach rather than a custom "freight card" pattern.

Use the following sequence:

1. **Drop-off** — small consignments arrive at the same depot and join a shared corridor run.
2. **Consolidation** — one manifest, one truck, one controlled load plan.
3. **Departure & corridor run** — the truck leaves on the same network and routes already covered by Apex.

Implementation note:

- Keep this as a real sequence, not a generic grid.
- Use numbered steps only here, because this is a genuine process.
- Use `details` for the "expand for more" copy so the content stays accessible and resilient without JS.

---

## 3. Instant estimate calculator

This should be the most useful part of the page and should be built as a reusable, data-driven calculator.

### Inputs

- **Weight**: slider or stepper in 0.5 t increments across 0–34 t.
- **Loading metres** (lightweight option): slider in 0.5 LDM increments across 0–30 LDM, with a tooltip explaining "1 loading metre ≈ 1 m of truck deck length at full width." Only shown after weight is set.
- **Route**: two distinct choices — "Local (SA)" and "Cross-border (SADC)".
- **Border complexity**: only shown when cross-border is selected.

### Pricing logic — chargeable weight

A 34 t truck has two ceilings: weight (34 t) and deck volume (~30 LDM / ~90 m³). Dense cargo (steel, machinery parts, bagged cement) hits the weight limit first; bulky cargo (furniture, empty pallets, foam, plastics, some FMCG packaging) fills the deck at a fraction of the weight limit. Pricing purely by weight lets bulky shippers use deck space for free while you absorb the cost of the blocked deck.

Implement chargeable weight pricing:

```
chargeable_weight = max(actual_weight_tons, volumetric_weight_tons)
volumetric_weight_tons = loading_metres_LDM × 1.75   // convention: 1 LDM ≈ 1.75 t
```

Alternate convention (if using m³ instead of LDM): `volumetric_weight_tons = volume_m³ / 2.5` where the density factor is 1 t ≈ 2.5 m³.

Run both actual weight and volumetric-equivalent weight through the same weight-band table, take the higher tonnage-equivalent, and price off that.

### Plain-language note

Insert a short callout near the calculator: *"Bulky or light cargo is priced by the space it takes up, not just its weight."* — so dense-cargo shippers aren't confused why they're not charged the volumetric rate.

### Output

- Load gauge visual that progresses with the **chargeable weight** (whichever is higher).
- Live percentage readout.
- Rate multiplier badge.
- Estimated price range, not a single number.
- Short disclaimer in a native `details` element.

### CTA

- "Send This Estimate on WhatsApp" should open the same WhatsApp flow already used elsewhere on the site.
- Pre-fill the message with the selected weight, loading metres, route, and estimate range.

### Data source

The weight-band and surcharge table should live in a shared JS/JSON lookup file, not as duplicated inline markup. The same component should be reusable in future index-page teaser usage. The chargeable-weight calculation function should live alongside the lookup data so pricing stays consistent everywhere the calculator renders.

---

## 4. Why consolidate

This section should be implemented as a simple four-card benefit layout, using the existing light and dark section rhythm.

Recommended copy themes:

1. Lower cost per ton
2. Faster dispatch
3. Full traceability per shipment
4. Backhaul-powered pricing

Use the existing card styling, icon support, and spacing tokens rather than inventing a custom benefit-module aesthetic.

---

## 5. Corridors we consolidate

Do not rebuild this section from scratch.

Reuse the existing coverage journey or map treatment from the home page and substitute a short note pointing to the broader corridor coverage story. This keeps the page honest and avoids repeating coverage content that is already proven on the site.

---

## 6. Trust / proof

Keep this lightweight and honest.

Good placeholders:

- insurance / compliance badge
- tracker / visibility note
- "coming soon" proof block for POD images or shipment count validation

Avoid fake social proof or fabricated testimonials.

---

## 7. FAQ

Use native `<details>` elements and keep a small set of realistic questions.

Suggested seed questions:

- What is the minimum weight you will consolidate?
- How much longer does a consolidated load take versus a dedicated truck?
- What documents do I need to provide per shipment?
- Can I track my portion of the load separately?
- What happens if my goods need to arrive on an exact date?

---

## 8. Final CTA

A persistent mobile CTA is useful, but it should match the site's existing mobile footer/nav patterns, not become a totally separate UI system.

Recommended approach:

- Keep a slim, sticky mobile action strip for the page.
- Use the same site CTA language and styling as the current `.btn` classes.
- Ensure the action remains discoverable while scrolling on mobile.

---

## Implementation notes for the actual build

The implementation should follow the existing codebase patterns used across the site:

- Use the shared stylesheet stack: `tokens.css → base.css → layout.css → animations.css → components.css`.
- Reuse the site's existing page shell with the shared nav and footer.
- Keep the page script stack consistent with the rest of the site (`shared-nav.js`, `content.js`, `reveal.js`, `parallax.js`, etc.).
- Use semantic HTML and accessibility-friendly components; do not create a JS-only accordion or JS-only estimator flow.
- Use `loading="lazy"` for images below the hero and keep hero media priority high.
- Respect `prefers-reduced-motion` for fill and reveal animation.

---

## Additional improvements to include in the build

These are not fully captured in the old draft and should be added to the page implementation plan:

1. Add an SEO title and description that match the new page's purpose rather than duplicating general services copy.
2. Keep the page copy data-friendly so the site can reuse a single content source instead of hard-coding duplicate text blocks.
3. Reuse the home-page coverage section or map asset instead of creating a new corridor visual.
4. Ensure the "instant estimate" CTA stays anchored to the calculator section and remains accessible on small screens.
5. Make the Load Gauge a single shared component so it can be reused in a teaser or home-page promo without diverging logic.
6. Prefer `--space-*` spacing and existing component classes over inline-only styles where possible.
7. Keep the page's support copy concise and phone-friendly; avoid long paragraphs that are difficult to scan on mobile.

---

## Final implementation rule

The page should look and behave like Apex, not like a separate product campaign. The design token source of truth is [css/tokens.css](css/tokens.css), and the layout + typography system already exists in [css/base.css](css/base.css), [css/layout.css](css/layout.css), and [css/components.css](css/components.css). Every section should be built by reusing that system where possible and only adding one-off styling when it is genuinely needed.
