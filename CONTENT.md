# Apex Transport Group — Content System

**Version:** 2.0 | **Date:** 2026-05-09  
Multi-Page Site | SEO & Mobile First

> **Rule:** No copy is written inside HTML. Every string lives here first.

---

## Global Strings

### Brand

| Label | Value |
|-------|-------|
| Company name | Apex Transport Group |
| Short name | Apex Transport |
| Tagline | Move Cargo. Cross Borders. No Excuses. |
| Sub-tagline | Cross-Border Freight Specialists — Southern & Central Africa |
| Legal name | Apex Transport Group (Pty) Ltd |

### Contact (Real – from old site)

| Label | Value |
|-------|-------|
| Phone | 072 937 7143 |
| WhatsApp | 072 937 7143 |
| WhatsApp link | https://wa.me/27729377143 |
| Email | dispatch@apextransport.co.za |
| Based in | South Africa |
| Hours | 24/7 Dispatch & Monitoring |

### Social

| Label | Value |
|-------|-------|
| WhatsApp CTA label | WhatsApp Us |

> No LinkedIn (legacy) – WhatsApp first

### Navigation (Multi-page)

#### Main Menu Links

- Home
- Services
- Border Clearance
- Fleet
- Contact
- Track Your Load

#### Nav CTA

| Label | Value |
|-------|-------|
| Button label | WhatsApp Us → |

#### Mobile Overlay Footer

| Label | Value |
|-------|-------|
| WhatsApp | 072 937 7143 |
| Call | 072 937 7143 |
| Based | South Africa |

---

### Ticker Strip (reusable component, visible on homepage)

**Loop (infinite scroll):**

```
South Africa ▪ Zimbabwe ▪ Zambia ▪ DRC ▪ Botswana ▪ Malawi ▪ Tanzania ▪ Mozambique ▪
Border Docs ▪ Customs Clearance ▪ Route Planning ▪ Real-Time Tracking ▪
(repeat from start)
```

---

## Homepage (`index.html`)

### Hero

| Label | Value |
|-------|-------|
| Eyebrow | Cross-Border Freight Specialists |
| Eyebrow line | decorative line / left accent |
| Headline | Move Cargo.<br><span class="highlight">Cross Borders.</span><br>No Excuses. |
| Subheadline | Apex Transport Group manages end‑to‑end freight logistics across Southern and Central Africa — from finding the right truck to clearing customs at the border. |
| CTA primary | WhatsApp Us → https://wa.me/27729377143 |
| CTA secondary | Our Services → #services |
| Hero image | webp/img_5.webp |
| Alt | Freight truck crossing border, golden hour, dust trail. |

**Hero stats (absolute on desktop / grid on mobile):**

- 8 Countries
- 24/7 Monitoring
- 48h Clearance

### Ticker (full width)

*(see Ticker Strip above)*

### Services Grid (six cards)

| Label | Value |
|-------|-------|
| Section label | What We Do |
| Heading | Full-Chain<br>Freight Services |
| Intro text | We don't just find you a truck — we own the entire process. From the moment your cargo is ready to the moment it arrives, Apex is on the ground, in the system, and on the phone. |

**Card 01 – Border Documentation**
- Icon: document check (SVG)
- Desc: Fast, accurate preparation of all cross-border paperwork. We know the requirements for all 8 Southern & Central African countries — no delays at the gate.

**Card 02 – Customs Clearance**
- Icon: grid / customs
- Desc: We navigate customs processes with precision. Our team handles declarations, duties, and compliance so your load never sits at a border unnecessarily.

**Card 03 – Route Planning**
- Icon: clock / route
- Desc: Strategic routing that balances speed, cost, and compliance. We factor in road conditions, border wait times, and cargo requirements before a wheel turns.

**Card 04 – Transporter Network**
- Icon: users / network
- Desc: Your cargo, matched to the right truck. We maintain a strong network of verified transporters across the region, so we always have capacity when you need it.

**Card 05 – Real-Time Monitoring**
- Icon: map / tracking
- Desc: Hands‑on oversight from pickup to delivery. We track every shipment in real‑time and proactively handle exceptions before they become problems.

**Card 06 – Direct Communication**
- Icon: phone / WhatsApp
- Desc: Call or WhatsApp us any time. We are South Africa‑based and fully reachable — not an automated system, real people who know your load.

### How It Works (The Process)

| Label | Value |
|-------|-------|
| Section label | The Process |
| Heading | How Apex<br>Works |
| Body | Simple for you. Handled by us. Every step of the cross‑border journey is managed end‑to‑end. |
| Image | webp/img_2.webp |
| Alt | Logistics operations – Apex team coordinating freight at a border crossing. |
| Badge | 100% Load Coverage |

**Steps:**

1. **You Have Cargo** — Tell us what needs to move, where it's coming from, and where it's going. We handle the rest.
2. **We Find the Truck** — We match your load to a verified transporter from our network — the right vehicle, right capacity, right route.
3. **Docs & Border Prep** — All border documentation and customs processes are prepared and submitted before the truck even arrives at the gate.
4. **We Monitor Every KM** — Real‑time involvement from our team throughout the journey. You get updates. We manage exceptions instantly.
5. **Safe Delivery** — Your cargo arrives at destination, on time, with full documentation. No excuses — every load must move.

### Coverage (Where We Operate)

| Label | Value |
|-------|-------|
| Section label | Where We Operate |
| Heading | Africa<br>Coverage |

**Countries grid (interactive cards):**

- South Africa 🇿🇦 (Hub)
- Zimbabwe 🇿🇼 (Active)
- Zambia 🇿🇲 (Active)
- DRC 🇨🇩 (Specialist)
- Botswana 🇧🇼 (Active)
- Malawi 🇲🇼 (Active)
- Tanzania 🇹🇿 (Active)
- Mozambique 🇲🇿 (Active)

**Popup (on hover/focus):**
- Flag emoji, country name, status (Hub / Active / Specialist)

**Legend:**
- 🏠 Hub | 🛣️ Active | ⚠️ Specialist

**Quick stats:**

- 8 Countries
- 15+ Routes
- 48h Clearance

### Values (Our Principles)

| Label | Value |
|-------|-------|
| Section label | Our Principles |
| Heading | Built on<br>Reliability |

**Cards:**

1. **Reliability First** 🎯 — Every load must move — no excuses. We do not cancel, we do not delay without communication. Your cargo commitment is our commitment.
2. **Hands-On Operations** 🤝 — We are actively involved in every shipment. Real people, real‑time involvement — not a platform that passes you to a stranger.
3. **Strong Network** 🌍 — Years of building relationships with trusted transporters across the region means we always have the right connection for your load.
4. **Speed & Tech** ⚡ — Digital documentation, rapid processing, and tech‑enabled tracking mean your freight moves faster with less friction at every stage.

### Fleet Gallery (preview on homepage)

| Label | Value |
|-------|-------|
| Section label | Our Fleet |
| Heading | Built for<br>African Roads |

**Gallery items (grid):**

- Box Truck → webp/img_4.webp
- Cross-Border Ready → webp/img_5.webp
- Long-Haul Specialists → webp/cross.webp
- Bulk Cargo → webp/bulk.webp
- Verified Partners → webp/varified_partners.webp

*(Each item has alt describing the truck type)*

### Tech Banner

| Label | Value |
|-------|-------|
| Heading | Documentation.<br><span>Done Fast.</span> |
| Body | Cross‑border freight lives and dies on paperwork. Apex uses digital workflows to prepare, submit, and verify all documentation before your truck reaches the border — cutting clearance time dramatically and eliminating common delay points. |

**Tech pills:**

- Digital Doc Prep
- Customs Pre-Clearance
- Real-Time Tracking
- WhatsApp Updates
- Compliance Verified
- 24/7 Monitoring
- Live Route Adjustments
- Fast Turnaround

### Contact Section (homepage – full version as in old site)

| Label | Value |
|-------|-------|
| Section label | Get In Touch |
| Heading | Ready to<br>Move? |
| Body | Call or WhatsApp us directly — we're based in South Africa and respond fast. No forms needed if you'd rather talk. |

**Contact details:**

- Call / WhatsApp → 072 937 7143 (links to https://wa.me/27729377143)
- Based In → South Africa

**Quote request form:**

| Field | Type |
|-------|------|
| Your Name | text |
| Company | text |
| Phone / WhatsApp | tel |
| Origin Country | dropdown: SA, ZW, ZM, DRC, BW, MW, TZ, MZ, Other |
| Destination Country | dropdown: SA, ZW, ZM, DRC, BW, MW, TZ, MZ, Other |
| Cargo Details | textarea |

- Button: Send Quote Request

---

## Services Page (`services.html`)

### Hero

| Label | Value |
|-------|-------|
| Eyebrow | What We Do |
| Heading | Full-Chain Freight Services |
| Sub | From border docs to final delivery – we own the entire cross‑border process. |
| Image | webp/img_5.webp |
| Alt | Apex truck fleet lined up, ready for cross‑border dispatch. |

### Service List (six detailed cards – same as homepage but expanded)

*(Use the same six service titles and descriptions as homepage, but each card can include an extra "Learn more" link and a small image.)*

> For SEO, each service title is an H3.

**Additional microcopy for each:**

1. Border Documentation
   - Key benefit: 8 countries, one standard.
   - Link: /border-clearance#documentation

2. Customs Clearance
   - Key benefit: On‑ground agents at every major border.
   - Link: /border-clearance

3. Route Planning
   - Key benefit: Real‑time adjustments for weather, strikes, or wait times.
   - Link: /coverage

4. Transporter Network
   - Key benefit: Verified partners, no rogue trucks.
   - Link: /fleet

5. Real-Time Monitoring
   - Key benefit: Proactive exception handling.
   - Link: /tracking

6. Direct Communication
   - Key benefit: 24/7 WhatsApp & phone – real people.
   - Link: /contact

### CTA Section

| Label | Value |
|-------|-------|
| Heading | Not sure which service fits? |
| Sub | Tell us your load, route, and timeline. We'll build a solution. |
| CTA | Contact Us → /contact |

---

## Border Clearance Page (`border-clearance.html`)

### Hero

| Label | Value |
|-------|-------|
| Eyebrow | Border Clearance Excellence |
| Heading | We clear borders.<br>Every time. |
| Sub | Bonded carrier status. Ground agents. 8 countries. |
| Image | webp/img_2.webp |
| Alt | Apex customs agent reviewing documents at a border gate. |

### Border Process (summary)

We hold bonded carrier status across Beit Bridge, Kazungula, Chirundu, Kasumbalesa, Mchinji, Tlokweng, and more.

**Key steps:**

1. Document Check – Verified before truck leaves yard.
2. Customs Lodge – ASYCUDA declarations submitted electronically.
3. Transit Permit – Country‑specific permits obtained.
4. Crossing Complete – Load confirmed through.

### Country Quick Reference (accordion or cards)

**South Africa**
- Posts: Beit Bridge (ZIM), Tlokweng (BOT)
- Time: 4–8 hours
- Note: SARS e‑filing, CRW clearance handled by Apex.

**Zimbabwe**
- Posts: Beit Bridge (SA), Chirundu (ZAM)
- Time: 4–10 hours
- Note: ZIMRA import permit, transit bond.

**Zambia**
- Posts: Chirundu (ZIM), Kazungula (BOT/ZAM), Kasumbalesa (DRC)
- Time: 2–12 hours
- Note: ZRA clearance, COMESA certificate.

**DRC**
- Posts: Kasumbalesa (ZAM)
- Time: 6–24 hours
- Note: OGEFREM certificate, French‑speaking agents.

**Malawi**
- Posts: Mchinji (ZAM)
- Time: 4–8 hours
- Note: MRA clearance, COMESA certificate.

**Botswana**
- Posts: Tlokweng (SA), Kazungula (ZAM)
- Time: 2–4 hours
- Note: BURS clearance, fastest corridor.

**Mozambique**
- Posts: Lebombo, Ressano Garcia
- Time: 4–8 hours
- Note: Maputo corridor specialist.

### CTA Block

| Label | Value |
|-------|-------|
| Heading | Ready to clear your next border? |
| Sub | Tell us your route and cargo. We handle every document. |
| CTA | Get a Quote → /contact |

---

## Fleet & Commodities Page (`fleet.html`)

### Hero

| Label | Value |
|-------|-------|
| Eyebrow | Our Fleet |
| Heading | Iron built for African roads |
| Sub | Every truck GPS‑tracked, roadworthy‑certified, and dispatched by our own team. |
| Image | webp/cross.webp |
| Alt | Long‑haul truck on an African highway at sunset. |

### Fleet Gallery (expanded from homepage)

*(All images from homepage gallery + optional truck type descriptions)*

1. Box Truck
   - Image: webp/img_4.webp
   - Best for: Palletised goods, smaller loads, regional runs.

2. Cross-Border Ready
   - Image: webp/img_5.webp
   - Features: Dual fuel tanks, border documentation kit, sat comms.

3. Long-Haul Specialists
   - Image: webp/cross.webp
   - Routes: JHB – Lusaka, JHB – Lubumbashi, JHB – Dar es Salaam.

4. Bulk Cargo
   - Image: webp/bulk.webp
   - Commodities: Coal, chrome, copper, aggregates.

5. Verified Partners
   - Image: webp/varified_partners.webp
   - Note: Extended network for overflow and specialised routes.

### Fleet Stats Bar

| Stat | Value |
|------|-------|
| Trucks in fleet | 120+ |
| Vehicle classes | 4 |
| GPS tracked | 100% |
| Avg dispatch time | 48h |

### CTA

| Label | Value |
|-------|-------|
| Heading | Need a specific truck? |
| Sub | Tell us your load, route, and timeline. We match the right vehicle. |
| CTA | Request a Truck → /contact |

---

## Contact & Quote Page (`contact.html`)

### Hero

| Label | Value |
|-------|-------|
| Eyebrow | Get In Touch |
| Heading | Let's move your load. |
| Sub | Same‑day response. 24/7 dispatch team. |
| Image | webp/img_2.webp (operations team at work) |
| Alt | Apex Transport team member at dispatch desk. |

### WhatsApp Primary CTA

| Label | Value |
|-------|-------|
| Label | FASTEST RESPONSE |
| Heading | WhatsApp us directly. |
| Body | Our dispatch team responds on WhatsApp within the hour — day or night, weekday or weekend. |
| Button | Chat on WhatsApp → https://wa.me/27729377143 |
| Number display | 072 937 7143 |

### Quote Request Form (same as homepage contact section)

**Divider:** Or complete the enquiry form

| Field | Type | Required |
|-------|------|----------|
| Your Name | text | Yes |
| Company | text | No |
| Phone / WhatsApp | tel | Yes |
| Origin Country | dropdown | Yes |
| Destination Country | dropdown | Yes |
| Cargo Details | textarea | Yes |

- Button: Send Quote Request

**Form states:**

- Submitting: Sending...
- Success: Enquiry received. We'll respond within 4 hours.
- Error: Something went wrong. Please WhatsApp us directly.

### Office / Contact Info

| Label | Value |
|-------|-------|
| Based in | South Africa |
| WhatsApp/Phone | 072 937 7143 |
| Email | dispatch@apextransport.co.za |
| Hours | Dispatch: 24/7 |

### FAQ (lightweight)

**Q:** How quickly can you quote?  
**A:** Same day for standard corridor loads. WhatsApp is fastest.

**Q:** Do you work with first‑time shippers?  
**A:** Yes. We walk you through the full process from first load to delivery.

**Q:** Can you handle emergency dispatch?  
**A:** For JHB–Lusaka or JHB–Lubumbashi we can dispatch within 12 hours subject to availability.

---

## Tracking Page (`tracking.html`)

### Hero / Input

| Label | Value |
|-------|-------|
| Eyebrow | Track Your Load |
| Heading | Where is your load right now? |
| Sub | Enter your load reference number below. |
| Input label | Load Reference |
| Placeholder | e.g. APX-2026-004821 |
| Button label | Track → |

### Result States

**In Transit**

| Label | Value |
|-------|-------|
| Status | IN TRANSIT |
| Last update | Beit Bridge Border Post — 14:23 SAST |
| ETA | Lusaka, Zambia — Est. 09 May 2026 |
| Progress stops | JHB → Beit Bridge → Harare → Chirundu → Lusaka |

**At Border**

| Label | Value |
|-------|-------|
| Status | AT BORDER — CLEARANCE IN PROGRESS |
| Last update | Kasumbalesa — Agent on site |
| Note | Estimated clearance: 4–6 hours. You will be notified on completion. |

**Delivered**

| Label | Value |
|-------|-------|
| Status | DELIVERED ✓ |
| Delivered to | [Consignee name] |
| Delivered at | [Date & time] |
| POD available | Download Proof of Delivery → |

**Not Found**

| Label | Value |
|-------|-------|
| Status | LOAD NOT FOUND |
| Message | Double‑check the reference on your booking confirmation, or contact our dispatch team directly. |
| CTA | Contact Dispatch → WhatsApp 072 937 7143 |

---

## 404 Page (`404.html`)

| Label | Value |
|-------|-------|
| Heading | Wrong turn. |
| Sub | This load went off‑route. Let's get you back on the corridor. |
| CTA | Back to Homepage → |
| Link 2 | Contact Dispatch |
| Image alt | A lone road sign on an empty African highway, pointing two directions. |

---

## Footer (global)

| Label | Value |
|-------|-------|
| Brand + tagline | Apex Transport Group – Cross-border freight specialists across Southern and Central Africa. Every load must move — no excuses. |

**Column 1 – Services**

- Border Documentation
- Customs Clearance
- Route Planning
- Transporter Network
- Real-Time Monitoring

**Column 2 – Coverage**

South Africa · Zimbabwe · Zambia · DRC · Botswana · Malawi · Tanzania · Mozambique

**Column 3 – Contact**

- WhatsApp: 072 937 7143
- Call: 072 937 7143
- Based in South Africa

**Legal bar:**

© 2026 Apex Transport Group — All Rights Reserved  
South Africa · Zimbabwe · Zambia · DRC · Botswana · Malawi · Tanzania · Mozambique

---

## SEO Meta – All Pages

| Page | Title Tag | Meta Description |
|------|-----------|------------------|
| Home | Apex Transport Group – Move Cargo. Cross Borders. No Excuses. | Cross‑border freight specialists across 8 African countries. 24/7 monitoring, customs clearance, and direct WhatsApp support. Get a quote today. |
| Services | Full‑Chain Freight Services – Apex Transport Group | Border docs, customs clearance, route planning, transporter network, real‑time monitoring, direct communication. We own the entire process. |
| Border Clearance | Border Clearance Excellence – 8 Countries – Apex Transport | Bonded carrier status. Ground agents at Beit Bridge, Kasumbalesa, Chirundu, Kazungula. We clear borders – every time. |
| Fleet | Heavy Haulage Fleet – Box Trucks to Long‑Haul Specialists | GPS‑tracked fleet built for African roads. Cross‑border ready, bulk cargo, verified partners. 48h average dispatch. |
| Contact | Get a Quote – WhatsApp Same‑Day Response – Apex Transport | Call or WhatsApp 072 937 7143. Request a quote for your corridor load. South Africa‑based, 24/7 dispatch. |
| Tracking | Track Your Load – Real‑Time Border Updates | Enter your load reference to see current location, border status, and ETA. Updating every hour. |

---

## Microcopy & UI Labels

| Label | Value |
|-------|-------|
| Loading spinner (screen reader) | Loading, please wait. |
| Form required indicator | * |
| WhatsApp badge (nav) | 24/7 |
| Border step "completed" | Done ✓ |
| Fleet filter active | Filter active: [filter name] |
| Accordion expand | Expand [question text] |
| Tracking progress (screen reader) | Load is currently at [stop name]. |
| Image loading placeholder | Loading image... |

---

> All copy reflects the latest single‑page design migrated to a multi‑page, SEO‑optimised, mobile‑first structure. Images referenced as webp/ files – ensure they exist in the final build. WhatsApp number and phone number are real – do not replace.