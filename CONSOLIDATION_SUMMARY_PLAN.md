# Index.html — Consolidation Loads Summary Section

**Goal:** a short, useful, image-first teaser that sits inside the existing single-page site and pushes traffic to `consolidation-loads.html`. Not a shrunk copy of the full page — just the hero moment and the one genuinely useful tool (the calculator), condensed.

---

## Placement / priority

This section should be promoted ahead of the current services content, but without removing or degrading any existing sections from the home page.

Concretely:

- Place the new section directly after the hero / coverage journey block in the scroll order.
- Keep the existing Services section in place, but move it down one slot in the page narrative so it no longer sits immediately after the hero.
- Keep the current coverage and service content intact; this is a repositioning, not a removal.
- If a top-nav or sticky nav exists, add a new navigation entry for “Consolidation” ahead of “Services.”

This should feel like a stronger conversion path, not a rewrite of the existing homepage.

---

## Design alignment with the existing codebase

The summary section must reuse the established Apex visual system already defined in the site CSS rather than inventing a separate campaign style.

### Use the existing token system

Use the tokens already present in [css/tokens.css](css/tokens.css):

- `--apex-navy` / `--apex-navy-mid` for dark visual blocks
- `--apex-orange` / `--apex-orange-hot` / `--apex-orange-glow` for the CTA and attention cue
- `--apex-off-white` for light background surfaces
- `--apex-charcoal` for body text and `--apex-muted` for calm supporting copy
- `--apex-stone` for subtle borders and dividers
- `--glass-*` tokens only if the teaser needs a layered dark-panel treatment

Do not introduce a new color palette or a separate microsite visual language.

### Use the existing typing system

The section should inherit the present design system from [css/base.css](css/base.css):

- Headlines: `Barlow Condensed`
- Body copy: `Barlow`
- Numbers / calculator outputs: `JetBrains Mono`

This keeps the section consistent with the already-built site and avoids pulling in a different typographic voice.

### Reuse the existing layout utility patterns

Use existing classes and structure already present in [css/layout.css](css/layout.css) and [css/components.css](css/components.css):

- `section`, `section--dark`, `section--light`
- `container`, `container--narrow`
- `btn`, `btn-primary`, `btn-secondary`
- `reveal` / `reveal-up` behavior for motion
- `--space-*` spacing tokens rather than arbitrary pixel values

The aim is to make this feel like a native part of the current site, not a separate “marketing unit.”

---

## Structure (mobile-first, single scroll section, no scroll-hijacking)

### 1. Compact hero band

Use a visual and copy treatment that mirrors the full consolidation page, but in a tighter teaser format.

Recommended structure:

- Compact freight/depot-loading visual, same subject matter as the full page hero, cropped tighter for a shorter band
- Approximate height: around `60vh`, not full-screen `100vh`
- Headline: “One Truck. Everyone’s Cargo.”
- Supporting line: “Share space, share the cost. See what your shipment would cost to consolidate.”

This band should feel like a snackable introduction rather than a full marketing block.

### 2. Mini Load Gauge calculator

This is the one genuinely useful tool and the main reason the teaser exists.

It should use the same reusable calculator component as the full page, just in a reduced-version state.

#### Inputs

Three controls here (same shared pricing logic as the full page, just fewer surface inputs):

- **Weight** — slider/stepper in 0.5 t increments
- **Loading metres** — slider in 0.5 LDM increments (hidden by default, reveal via a “Bulky cargo?” toggle)
- **Route** — “Local (SA)” / “Cross-border (SADC)” toggle

Do not include the full border-complexity chip selector in the teaser. That extra decision belongs on the full consolidation page.

#### Output

- The same load gauge animation used on the full page
- Estimated price range badge
- A small “estimate only” caption beneath the result

#### Data logic

The teaser must use the same calculation function/data source as the full-page consolidation calculator. The component should remain shared and reusable.

Chargeable-weight pricing applies here too: `chargeable_weight = max(actual_weight_tons, loading_metres_LDM × 1.75)`. The load gauge and price range both reflect whichever is higher.

Default behavior for the teaser:

- If cross-border is selected, treat the hidden border tier as the “neighbouring” tier by default.
- Keep the logic centralized in one lookup table / shared JS module so the teaser and full page always stay consistent.

### 3. Three-up benefit strip

After the calculator, present a short benefit strip designed for quick scanning on mobile.

Use a horizontally scrollable row on small screens so the section stays compact and is not a vertical stack of cards.

Suggested three items:

- Lower cost per ton
- Faster dispatch than waiting for a full load
- Every shipment tracked individually

Each item can use:

- a simple icon
- a short label
- 3–4 words maximum

Do not use expand-for-more content here. Save the explanation for the full page.

### 4. CTA button

The CTA should be the section’s primary exit path.

- Label: “See Full Consolidation Details →”
- Link target: `consolidation-loads.html`

This is the entire purpose of the teaser: push the right audience into the full page where they can complete the decision path.

---

## What not to include in the teaser

The summary section should stay short and sharp. Do not include:

- a corridor map repeat
- FAQ content
- trust/proof placeholders
- expandable paragraphs
- long copy blocks or long-form explanation

If the detail needs a paragraph, it belongs on the full page, not the teaser.

The user should be able to understand the offer and get a rough estimate in under 15 seconds on a phone.

---

## Implementation guidance

### Reuse and preserve

Do not remove or degrade the existing homepage sections. The section should be added in place of a de-prioritized narrative position, not as a destructive change.

Keep the following intact:

- current hero
- current coverage journey
- current services section in its existing role, just pushed down in relative prominence

### Structure recommendation in index.html

Recommended placement order:

1. Hero
2. Coverage Journey
3. Consolidation summary teaser
4. Existing Services section
5. Remaining homepage content below

This preserves the home page story while surfacing consolidation earlier.

### Navigation recommendation

If the site uses a sticky or top-level navigation that lists the primary secondary pages, add:

- `Consolidation` before `Services`

This makes the new conversion path visible without changing the broader information architecture.

---

## Codebase-specific build notes

The implementation should work with the site’s existing front-end structure:

- Use the shared CSS cascade already present in the site (`tokens.css → base.css → layout.css → animations.css → components.css`).
- Reuse the same Load Gauge calculator component and calculation logic as the full page.
- Keep motion subtle and responsive; respect `prefers-reduced-motion`.
- Use existing utilities such as `container`, `section--dark`, `section--light`, and `btn` rather than custom ad hoc styles.
- Keep the teaser lightweight and mobile friendly; avoid large, expensive, or decorative layout overhead.

---

## Final implementation rule

This section should behave like a smart, compact Apex conversion block — not a side campaign. It should feel native to the current homepage and make the existing design system more explicit, not less. The source of truth remains [css/tokens.css](css/tokens.css), and the homepage should continue to rely on the established base, layout, and component patterns already present in the project.
