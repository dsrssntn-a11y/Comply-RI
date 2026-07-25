# RhodeWaste — Organics Navigator
## Project README for Claude Code
**Version 1.1 | Build: MVP Prototype**

---

## What This Tool Is

A two-tab, single-page web application that helps Rhode Island municipal and institutional entities determine their compliance status under the RI Commercial Food Waste Ban (R.I. Gen. Laws § 23-18.9-17).

**Tab 1 — Compliance Calculator:** User inputs entity type, zip code, and annual food waste tonnage. Tool returns compliance status, nearest authorized facility within 15 miles, and estimated tons diverted if compliant.

**Tab 2 — Hauler Directory:** Static, curated list of organics-capable haulers operating in Rhode Island. Clearly labeled as a service directory, not a legal determination. Data to be populated when RIRRC and RIFPC verification is complete — build the tab structure and header now.

---

## Tech Stack

- **Frontend:** React with TypeScript
- **Styling:** Tailwind CSS + custom CSS tokens
- **Mapping:** Leaflet.js for facility map display
- **Distance calculation:** Haversine formula in TypeScript — no external API required
- **Data:** Static JSON files — no backend, no database
- **Session handling:** All user inputs are session-only. No data stored or transmitted.

---

## File Structure

```
RhodeWaste-Organics-Navigator/
├── public/
│   ├── favicon.svg
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── layout.tsx
│   │   └── routes.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── CalculatorForm.tsx
│   │   ├── InputField.tsx
│   │   ├── SelectField.tsx
│   │   ├── ResultCard.tsx
│   │   ├── ThresholdBadge.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── SourceNote.tsx
│   │   ├── Footer.tsx
│   │   ├── RhodeIslandMark.tsx
│   │   ├── FacilityMap.tsx
│   │   ├── HaulerDirectory.tsx
│   │   ├── Disclaimer.tsx
│   │   └── ImpactCallout.tsx
│   ├── hooks/
│   │   ├── useFoodWasteCalculator.ts
│   │   └── useAccessibleToggle.ts
│   ├── lib/
│   │   ├── calculations.ts
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   ├── validation.ts
│   │   └── haversine.ts
│   ├── data/
│   │   ├── thresholds.ts
│   │   ├── facilities.ts
│   │   ├── facilityRules.ts
│   │   └── copy.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── tokens.css
│   │   └── components.css
│   └── types/
│       └── index.ts
├── rhodewaste_facilities.json
├── rhodewaste_facilities.csv
├── index.html
├── package.json
└── README.md
```

---

## What Each File Does

- **App.tsx** — page composition, tab navigation between Calculator and Hauler Directory
- **layout.tsx** — shared page shell and spacing
- **CalculatorForm.tsx** — collects all user inputs
- **useFoodWasteCalculator.ts** — handles derived values and result status
- **calculations.ts** — unit conversion and annual tonnage math
- **thresholds.ts** — Rhode Island statutory rule values in one place
- **haversine.ts** — straight-line distance calculation in miles
- **facilities.ts** — facility dataset parsed from rhodewaste_facilities.json
- **HowItWorks.tsx** — collapsible explanation panel for transparency
- **RhodeIslandMark.tsx** — small civic brand element, anchor or RI outline
- **HaulerDirectory.tsx** — Tab 2, hauler directory with header disclaimer
- **ImpactCallout.tsx** — large callout number showing estimated tons diverted
- **Disclaimer.tsx** — reusable disclaimer component for data entry and output screens

---

## Design Specifications

### Color Palette

| Role | Name | Hex | Use |
|---|---|---|---|
| Background | Cloud White | #F8FAFC | Page background |
| Surface | White | #FFFFFF | Cards and panels |
| Border | Mist Gray | #D8E1EA | Dividers, input borders |
| Primary | Harbor Blue | #123B66 | Header, links, primary text |
| Primary Accent | Anchor Gold | #D4A62A | CTA button, status highlight |
| Secondary Blue | Bay Blue | #2F6FAB | Secondary accents, icons |
| Success | Sea Glass | #2E8B7D | Success state |
| Warning | Slate Amber | #C98A2B | Caution state |
| Error | Deep Coral | #B94A48 | Error state |
| Muted Text | Fog Gray | #5F6B7A | Helper text, metadata |

### Typography

- Page title: 28–32px, semibold
- Section labels: 14–16px, semibold
- Body text: 15–16px, regular
- Result number: 36–48px, bold
- Helper text: 13–14px, muted
- Use tabular numbers for tonnage results so figures align cleanly

### Component Styling

- **Inputs:** rounded 10–12px, white fill, thin gray border, soft focus ring in Bay Blue
- **Button:** Anchor Gold fill, Harbor Blue text, medium-bold, full width on mobile
- **Result card:** white or pale blue surface, subtle shadow, large number
- **Status chips:** pill shape, solid color with white or dark text
- **Icons:** outline style only, never decorative-heavy

### Layout Rules

- Two-column desktop layout, one-column mobile
- Mobile-first responsive behavior throughout
- Large tap targets on all interactive elements
- Total visible content fits one screen before scrolling
- Generous spacing — the interface should feel calm and trustworthy
- Tab navigation at top: Tab 1 = Calculator, Tab 2 = Hauler Directory

---

## Page Structure

### Header (slim, white background)
- Left: small anchor mark or RI outline (RhodeIslandMark.tsx)
- Center-left: tool name — RhodeWaste — Organics Navigator
- Right: one subtle link — "How it works"

### Hero strip
- One-line purpose statement
- Civic trust line: "Estimate annual food waste tonnage with transparent math."
- Small Rhode Island badge or compliance context label

### Tab 1 — Calculator

**Input card (max width 520–640px, fields stacked vertically):**
- Entity type selector
- Zip code
- Annual food waste tonnage (numeric input)
- Each field has one short helper line
- Primary CTA button at bottom: "Calculate" — Anchor Gold, full width on mobile

**Results card (directly beneath input card):**
- Large number: estimated tons diverted (ImpactCallout.tsx)
- Status chip: "Below Threshold" / "Above Threshold — Comply" / "Above Threshold — Exempt"
- Small line showing formula used
- Threshold comparison line
- Nearest authorized facility name, type, address, and contact if above threshold
- Facility map (Leaflet.js) showing user zip and nearest facility
- Full disclaimer on every output (Disclaimer.tsx)

**Collapsible "How this was calculated" section (HowItWorks.tsx):**
- Unit conversion used
- Annualization logic
- Threshold rule applied
- Statutory source note
- Plain language, short

### Tab 2 — Hauler Directory

**Header disclaimer (always visible at top of tab):**
> This directory lists haulers verified to handle food waste organics in Rhode Island. It is provided as a reference only. Contact haulers directly to confirm service area, capacity, and pricing. This list does not constitute an endorsement.

Hauler data to be populated when RIRRC and RIFPC verification is complete. Build tab structure and header now.

### Footer
- Legal disclaimer (short version)
- Source references: RI Gen. Laws § 23-18.9-17, RIDEM, RIRRC
- Contact or help link
- Muted text only, no social icons

---

## Calculator Logic — Exact Statutory Rules

### Step 1 — Determine entity type and threshold

| Entity Type | Annual Tonnage Threshold |
|---|---|
| Higher education and research institutions | 52 tons/year |
| Other educational entities (K–12) | 30 tons/year |
| Commercial/institutional entity (specific enumerated list — see § 23-18.9-7(19)) | 104 tons/year |

### Step 2 — Compare user tonnage to threshold

- Below threshold → **Below Threshold. Not currently required to comply.**
- At or above threshold → proceed to Step 3

### Step 3 — Check 15-mile facility condition

Using haversine formula, calculate straight-line distance from user zip code centroid to each facility in rhodewaste_facilities.json.

- One or more facilities within 15 miles → **Above Threshold. Required to comply.** Show nearest facility.
- No facility within 15 miles → **Above Threshold — Exempt.** Show 15-mile statutory exemption. Do not call this a loophole — it is an intentional statutory provision.

### Step 4 — Display impact callout

Show on every above-threshold result:
```
[X tons]
If [entity] complies with the RI food waste ban, an estimated X tons
of organic waste will be diverted from landfill annually.
```
X = tonnage entered by user. No external modeling required.

---

## Haversine Formula (haversine.ts)

```typescript
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
```

---

## Zip Code to Coordinates

Use a static zip code centroid lookup for all RI zip codes (02800–02940). Do not use a live geocoding API for user zip code resolution — keeps the tool session-only and avoids external dependencies. Use the simplemaps US zip codes free tier dataset or equivalent.

---

## Three Prototype Scenarios

Build and verify these three before the prototype is considered complete.

### Scenario 1 — CCRI (Primary)
- Entity type: Higher education and research institution
- Zip code: 02886 (Warwick, RI)
- Annual tonnage: 65 tons
- Expected: Above threshold (52 tons). ORBIT in Johnston nearest facility (~8–10 miles). Required to comply. Impact callout: 65 tons.

### Scenario 2 — K–12 School (Below threshold)
- Entity type: Other educational entity (K–12)
- Zip code: 02903 (Providence)
- Annual tonnage: 18 tons
- Expected: Below threshold (30 tons). Not required to comply.

### Scenario 3 — Hospital (Exempt)
- Entity type: Commercial/institutional entity
- Zip code: 02837 (Little Compton, RI)
- Annual tonnage: 120 tons
- Expected: Above threshold (104 tons). No facility of any kind (mainland or Block Island) within 15 miles — nearest is ~18.9 miles. Exempt under statutory 15-mile provision.
- Note: 02807 (Block Island) was the originally proposed zip for this scenario, but verification against the full facility dataset (including Block Island Compost and New Shoreham Food Recycling Facility, both ~1-2 miles from that zip's centroid) showed it actually resolves to **Comply**, not Exempt — island-based entities do have a qualifying facility within 15 miles. 02837 was substituted as a zip with a genuine 15-mile gap from every facility in the dataset.
- Note on entity choice (Jul 2026): this scenario originally used "Municipal building" as the example. Swapped to "Hospital" after verifying R.I. Gen. Laws § 23-18.9-7(19) — "covered entity" is a specific enumerated list (commercial food wholesaler/distributor, industrial food manufacturer/processor, supermarket, resort/conference center, banquet hall, restaurant, religious institution, military installation, prison, corporation, hospital or other medical care institution, casino), not a general municipal/institutional catch-all. A hospital is unambiguously on that list; whether a generic municipal office building is covered at all is not settled by the statute's text (it may qualify only if "corporation" is read to include municipal corporations). See the app's "See exact legal definitions" and "Important things to know" for the full disclosure of this ambiguity.

---

## Disclaimer Language

### At data entry (short):
> Your inputs are used only to calculate your compliance status and are not stored, saved, or transmitted. This tool is for informational purposes only and does not constitute legal advice. For official guidance, contact RIDEM directly.

### On every output screen (full):
> This tool provides general information based on Rhode Island General Law § 23-18.9-17 and publicly available facility and service provider data. Results are intended to help entities understand their potential obligations under the RI Commercial Food Waste Ban — they do not constitute legal advice and should not be relied upon as a determination of compliance.
>
> Facility and hauler data is maintained on a static basis and may not reflect the most current authorized facility list. Users are encouraged to verify current requirements and facility status directly with the Rhode Island Department of Environmental Management (RIDEM) at dem.ri.gov.
>
> No user data is collected, stored, or transmitted. All inputs are session-only and are cleared when the session ends.

---

## Build Order

1. Layout shell — header, tab navigation, footer
2. Calculator form and result card
3. Haversine logic and facility lookup
4. Threshold messaging and status chips
5. Explanation drawer (HowItWorks)
6. Impact callout and facility map
7. Hauler Directory tab structure and header
8. Design tokens, accessibility polish, mobile responsiveness

---

## Security Requirements

- No API keys in browser code or public repositories
- Session-only inputs — nothing persisted
- Input validation: zip code (RI only, 02800–02940), entity type (enum), tonnage (numeric, positive)
- No external API calls without rate limiting

---

## What NOT to Build in MVP

- No CO2e calculation
- No real-time hauler capacity or pricing
- No enforcement reporting or data submission
- No multi-state logic
- No user accounts or data storage
- No live geocoding API for facility coordinates

---

## Data Files in Project Folder

| File | Contents |
|---|---|
| rhodewaste_facilities.json | 10 authorized facilities with coordinates, type, contact, notes |
| rhodewaste_facilities.csv | Same data in CSV format for manual maintenance |
| RI_Compliance_Tool_Concept_Doc.md | Full project concept and scope |
| RhodeWaste_Maintenance_Notes.md | Data sources, update schedule, legal and security requirements |

---

## Statutory Reference

R.I. Gen. Laws § 23-18.9-17
https://webserver.rilegislature.gov/Statutes/TITLE23/23-18.9/23-18.9-17.htm

---

*Scope: Rhode Island only | Status: MVP build | Primary prototype scenario: CCRI (02886)*
*README version 1.2 — tool renamed to RhodeWaste — Organics Navigator, tagline added*
