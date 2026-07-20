# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# css
- Use the Apex token system (--apex-navy, --apex-orange, --apex-off-white, --apex-charcoal, --apex-muted, --apex-stone, --glass-*) defined in css/tokens.css as the single source of truth for all styling — do not introduce a separate palette or visual language. Confidence: 0.85
- Reuse existing CSS utility and component classes (section, section--dark, section--light, container, container--narrow, btn, btn-primary, btn-secondary, reveal, reveal-up) rather than inventing custom ad-hoc styles for new page sections. Confidence: 0.85
- Use Barlow Condensed for headings, Barlow for body copy, and JetBrains Mono for data-driven UI (numbers, calculator readouts, weight labels) — do not introduce a separate typography system. Confidence: 0.85

# design
- Design mobile-first with phone-friendly tap targets, short scannable copy, and layouts that work without hover states. Confidence: 0.80
- Use native HTML elements (details/summary for expandable content) rather than JS-only accordions or widgets — keep content accessible without JavaScript. Confidence: 0.80
- Respect prefers-reduced-motion for all animations, including fill gauge and reveal animations. Confidence: 0.80

# architecture
- Build shared components once and reuse them across pages (e.g., a single fill-gauge calculator component used on both the full consolidation page and the homepage teaser) rather than duplicating logic. Confidence: 0.85
- Use a shared JS/JSON lookup file for data-driven content (weight-band tables, surcharge data) rather than duplicating inline markup across pages. Confidence: 0.80

# domain
- Use chargeable weight pricing for freight calculators: chargeable_weight = max(actual_weight_tons, volumetric_weight_tons), where volumetric_weight_tons = volume_m³ / density_factor. Price off whichever is greater; weight-only pricing undervalues bulky cargo that consumes deck space. Confidence: 0.85
