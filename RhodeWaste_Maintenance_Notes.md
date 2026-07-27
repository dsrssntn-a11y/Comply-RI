# RhodeWaste — Organics Navigator: Maintenance Notes
**Version 1.2 | For internal use and institutional handoff**

---

## Purpose

This document outlines how to keep the RhodeWaste tool accurate and current after launch. It is written for both the original maintainer and any institutional partner (RIDEM, RIFPC) who may take over the tool in a future version.

---

## Where This Lives

- **Code repository:** https://github.com/dsrssntn-a11y/RhodeWaste-Organics-Navigator
- **Stack:** React + TypeScript + Vite, Tailwind CSS. No backend, no database — a static site that can be hosted anywhere that serves static files (GitHub Pages, Netlify, a state web server, etc.). See `README.md` for the full build spec and file structure.
- **Not yet set:** this has not been deployed to a public production URL. `og:url` in `index.html` and the "og-image" social preview are ready to go but need that URL once one exists — see the comment left in `index.html`.

---

## Legal Foundation

The tool is built on the following statutory and regulatory sources. These must be verified for any changes before each major update or annually at minimum.

| Source | What It Governs | Check Frequency |
|---|---|---|
| R.I. Gen. Laws § 23-18.9-17 | Core food waste ban — tonnage thresholds, 15-mile condition, entity definitions | Annually — start of each calendar year |
| R.I. Gen. Laws Chapter 23-18.9 | Broader refuse-disposal chapter including related municipal responsibilities | Annually alongside § 23-18.9-17 |
| RIDEM solid waste and composting regulations | Governs "authorized composting facility" and "anaerobic digestion facility" status | Annually or when RIDEM issues regulatory updates |

**How to check for statutory changes:** Visit webserver.rilegislature.gov and search § 23-18.9-17 directly. Look for any amendments to tonnage thresholds, entity definitions, or the 15-mile condition. If the statute changes, the calculator logic must be updated before the next user session.

**Last verified against the primary source:** July 2026. Pulled the full verbatim text directly from webserver.rilegislature.gov (not a summary or a secondary source) and confirmed subsections (a)–(d) match the tool's thresholds exactly: 104 tons (a, covered entities), 52 tons (b, higher-ed/covered educational institutions), 30 tons (d, K–12/educational entities, effective 2023). No amendments since P.L. 2021, ch. 344 & 345 (effective September 1, 2021).

**Subsection (c) — a waiver provision the tool discloses but does not calculate.** The statute includes a mandatory waiver: *"The director shall grant a waiver of the requirements of subsections (a) and (b) upon a showing that the tipping fee charged by [RIRRC] for non-contract commercial sector waste is less than the fee charged for organic-waste material by each composting facility or anaerobic digestion facility located within fifteen (15) miles of the covered entity's location."* This applies only to the 104-ton and 52-ton categories, not the 30-ton K–12 category (added later, in a separate subsection). The tool cannot calculate eligibility for this — RIRRC/facility tipping-fee data isn't publicly compiled anywhere (confirmed during the Project Seed Checklist's own "confirm data exists" research). It's disclosed to users via a popup + a How It Works section (§ 23-18.9-17(c), cited with a direct link) whenever a result would otherwise be "Facility Available" in an eligible category, directing them to RIDEM to inquire.

---

## Entity Category Accuracy — Findings From the July 2026 Compliance Audit

A deeper pass against the primary statutory text (§ 23-18.9-7 definitions and § 23-18.9-18) surfaced three things the tool previously got imprecise or omitted entirely. All three are now addressed in-app; documented here so the reasoning isn't lost.

**1. The 104-ton category is a specific enumerated list, not a general catch-all.** § 23-18.9-7(19) defines "covered entity" as: *"each commercial food wholesaler or distributor, industrial food manufacturer or processor, supermarket, resort or conference center, banquet hall, restaurant, religious institution, military installation, prison, corporation, hospital or other medical care institution, and casino."* The tool's label for this category previously read "All other generators (municipal, institutional)" — implying any municipal or institutional entity above 104 tons is covered, which overstates the statute. Relabeled to "Commercial or institutional entity" (`src/lib/constants.ts`), and the app now surfaces the full verbatim list via a "See exact legal definitions" toggle on the calculator (`src/data/entityDefinitions.ts`, rendered in `CalculatorForm.tsx`). Whether "corporation" includes a municipal corporation isn't settled by the statute's text — flagged in-app as something to confirm with RIDEM rather than silently assumed either way. The README's Scenario 3 test case was also swapped from "Municipal building" to "Hospital" for the same reason (an unambiguous list member).

**2. The 52-ton higher-ed threshold is measured per building, not campus-wide.** § 23-18.9-17(b) and § 23-18.9-7(21) attach the 52-ton threshold to each "covered educational facility" — a building or group of interconnected buildings — not an institution's total organic waste across a whole campus. The calculator asks for one aggregate tonnage figure and compares it directly to 52 tons, which only matches the statute exactly when that figure represents one qualifying building/cluster rather than a campus-wide sum. This is now disclosed in the new "Important things to know" panel (`src/components/ImportantToKnow.tsx`) and as an inline caveat on higher-ed results above threshold (`ResultCard.tsx`). Not fixed at the calculation level — doing so would require asking users to enter waste per building, a larger UX change intentionally left for a future iteration rather than done silently.

**3. The § 23-18.9-18 recordkeeping/reporting requirement was previously undisclosed.** Separate from the diversion requirement, covered entities and covered educational institutions (not K–12) must keep written records of solid waste generated and organics recycled, and make them available to RIDEM on request. This existed in the statute the whole time but had zero mention anywhere in the tool. Now disclosed in "Important things to know" and as an inline note on relevant results.

---

## Known Limitation — Exempt Result Staleness

The exempt output state creates an asymmetry that RIDEM would need to address. An entity confirmed exempt today because no facility exists within 15 miles has no mechanism to be notified when that changes. The tool's static nature means a user could rely on an exempt result that is no longer accurate.

**Mitigation shipped (Jul 2026):** a single line on the exempt result — *"This status may change if new authorized facilities open in your area. Re-check annually."* — closes the gap without requiring any architectural change (`ResultCard.tsx`). This is a disclosure, not a fix: it doesn't notify anyone of anything, it just tells the user their result has a shelf life. A real fix (e.g. an email/subscription alert when a new facility opens near a previously-exempt zip) would require a backend, user contact info, and a trigger tied to the facility-update process in "Data Sources and Update Schedule" below — out of scope for a static client-only tool, and a genuine architectural decision for whoever owns this next.

---

## Data Sources and Update Schedule

| Data | Source | How Often It Changes | Recommended Check |
|---|---|---|---|
| Authorized composting facilities | RIDEM facility inventory | Monthly (inventory updated ~monthly) | Monthly |
| Authorized AD facilities | RIDEM facility inventory | Infrequent | Monthly alongside composting list |
| Agricultural composting permits | RIDEM agricultural program | Irregular — only updated on renewal or new application | Every 3 months minimum |
| Service provider / hauler directory | RIRRC Waste & Recycling Hauler List | Irregular (last updated Oct 2024) | Quarterly |
| Statutory thresholds and legal language | RI General Laws § 23-18.9-17 | Legislative session changes only | Annually |

**Note on hauler directory source:** CET no longer maintains a publicly available RI service providers list. RIRRC is now the primary hauler source. The RIRRC list does not indicate which haulers handle food waste specifically — the curated organics-capable hauler list in this tool is verified separately via RIFPC outreach and should be re-verified quarterly.

---

## External Dependencies (Third-Party Services)

For a security/IT review: this is the complete list of external services the tool calls at runtime. Both are free and require no API key or account — no secrets to manage, and neither is billed. If either changes terms or goes down, the tool degrades gracefully rather than breaking (details below).

| Service | Used For | Called When | If Unavailable |
|---|---|---|---|
| OpenStreetMap tile server (`tile.openstreetmap.org`) | Map tiles behind the facility-location pin on the result screen | Every result that shows a facility (above-threshold results) | The two location pins and distance number still display correctly — only the background map tiles fail to load. No impact on the compliance calculation itself. |
| Nominatim (`nominatim.openstreetmap.org`), OpenStreetMap's geocoder | Converts a user-entered street address to coordinates, for the optional "enter your exact address" precision mode | Only when a user explicitly opts into address mode and clicks Calculate — never on the default zip-code path | Tool automatically falls back to the zip-code-centroid calculation and shows the user a clear notice explaining the fallback. Nothing breaks; the user still gets a result. |

**Why not the Census Bureau's geocoder instead?** It was the first choice (also free, also keyless, and a government-to-government data source felt like a better philosophical fit) — but testing showed it does not send CORS headers, so it cannot be called directly from a browser at all. Using it would require standing up a small server-side proxy, which this project does not otherwise need. Nominatim was verified working directly from the browser before building around it.

**Nominatim usage policy** (operations.osmfoundation.org/policies/nominatim): the public instance caps usage at roughly 1 request/second and asks for attribution wherever results are shown. This tool's usage is a single, user-initiated lookup per Calculate click (not autocomplete/typeahead), which comfortably satisfies the rate limit by construction — no additional client-side throttling was needed. If this tool's traffic ever grows enough to strain the public instance, the options are self-hosting Nominatim or switching to a paid geocoder (which would then need the server-side proxy noted above, for the API key). Revisit this if usage grows significantly — same "evaluate at scale" logic as the facility-geocoding note below.

**Nominatim also requires a valid User-Agent or Referer identifying the application.** Browsers block scripts from setting a custom `User-Agent` header on `fetch()` calls (a platform-level restriction, not something fixable in this codebase), so that half of the requirement isn't something we can satisfy directly. It's satisfied by the fallback instead: Nominatim's policy explicitly accepts a valid Referer as an alternative, and `index.html` has no `referrer-policy` meta tag suppressing it — so once this is deployed to a real production domain, the browser's default, automatic Referer header (containing the page's own URL) already identifies the request correctly, with no code change possible or needed. If a future maintainer adds a strict no-referrer policy for other reasons, revisit this — it would silently break Nominatim policy compliance (not the feature itself, which would keep working).

---

## Facility Data: How to Update

### Step 1 — Check RIDEM's inventory
Visit: https://dem.ri.gov/environmental-protection-bureau/land-revitalization-and-sustainable-materials-management/inventories

Download the current "Active/Inactive Waste Facility Management Sites" list. The relevant categories are:
- **Putrescible Waste Composting Facility Registration** — filter for Active status only
- **Anaerobic Digester** — filter for Active status only

### Step 2 — Compare against current dataset
Check for any facilities added, removed, or changed in status since the last update. Pay particular attention to:
- New Active facilities not yet in the dataset
- Facilities that have moved from Active to Closed or Expired

### Step 3 — Update facility coordinates
For any new or changed facility address, geocode the address to obtain lat/lng coordinates. Use Google Maps or any free geocoding tool:
1. Enter the facility address in Google Maps
2. Right-click the pin → coordinates will display
3. Update the facility record in the dataset with the new lat/lng

**Do not skip this step.** The 15-mile straight-line calculation depends on accurate coordinates. A wrong address will produce a wrong distance result.

### Step 4 — Verify facility authorization status
The tool must only present facilities that are currently authorized under RIDEM rules. Before adding any new facility, confirm it holds an active license or registration. Do not include proposed or expired facilities.

### Step 5 — Log the update
Record the date of the update and what changed in the changelog below.

---

## Agricultural Composting Permits: Special Note

The agricultural composting permit list is the **least stable** part of the dataset. RIDEM has noted that this list is not updated frequently — changes are only recorded when a farm renews its permit or a new farm applies.

This means the list may underrepresent currently active farm composting operations, and any farm on the list should be verified as still active before being presented to a user as an available facility.

**Recommended action:** Contact Tyler Hertzwig at RIDEM (tyler.hertzwig@dem.ri.gov) every quarter to confirm whether any changes have occurred to the agricultural permit list, rather than relying solely on the public inventory.

Current permitted farms accepting food waste from outside sources:

| Farm | Contact | Address | Accepted Materials | Permit Status |
|---|---|---|---|---|
| EarthCare Farm | Mike Merner | 89 County Drive, Charlestown, RI 02813 | Putrescibles (Food Waste) | Active (Renewed 11/21/2022) |
| Schartner Corner Nursery | Richard Schartner | 90 Ten Rod Road, Exeter, RI 02822 | Leaf/Yard Waste, Putrescibles | Active (Renewed 5/16/2023) |
| Little Rhody Farms | Eli Berkowitz | 67 Cucumber Hill Road, Foster, RI 02825 | Putrescibles, Leaf/Yard Waste, Manure | Active (Issued Sept 2023) |
| Greene Farm, LLC | Mark P. DePasquale | 5641 Flat River Road, Greene, RI 02827 | Leaf/Yard Waste, Manure, Putrescibles | Active |
| Scobco | Gregory Allan | 380 Tripps Corner Road, Exeter, RI 02822 | Plant Waste, Manure, Putrescibles | Active (Issued May 2025) |

---

## RIDEM Contacts

| Name | Role | Email |
|---|---|---|
| Nathan Arruda | Permitted solid waste facilities | nathan.arruda@dem.ri.gov |
| Tyler Hertzwig | Agricultural composting operations | tyler.hertzwig@dem.ri.gov |

---

## Build Requirements: Calculator Logic

These requirements must be met before the tool goes live and verified after any update to the statutory source.

- The calculator must reproduce statutory threshold logic exactly: entity type → annual tonnage → 15-mile condition, in that order
- Entity type definitions must match the statute: higher education and research institutions (52 tons), other educational entities/K–12 (30 tons), commercial/institutional covered entities per the § 23-18.9-7(19) enumerated list (104 tons)
- The 15-mile distance must be calculated as straight-line radius using the haversine formula — not driving distance
- The facility lookup must use only currently authorized facilities with active RIDEM status — proposed, expired, or closed facilities must be excluded
- The hauler/service provider directory must be clearly separated from the compliance determination output — users must not be able to confuse contact listings with a legal compliance result
- The "informational only, not legal advice" disclaimer must appear both at data entry and on every output screen

---

## Security Requirements: Build Checklist

These apply at build time. Flag any unresolved items before launch. Status as of July 2026:

- [x] All API keys, database credentials, and geocoding secrets kept server-side only — never in browser code or public repositories. *Both external services (OpenStreetMap tiles, Nominatim) are keyless — there is nothing to secure. No secrets exist anywhere in this codebase.*
- [x] User inputs are session-only — no personal data stored or transmitted beyond the active session. *Still true, including the new optional address field — an entered address is sent only to Nominatim for that one lookup and is never stored.*
- [x] Input validation applied to zip code, entity type, and tonnage fields (now also street address / city) — client-side only; there is no server to also validate on, see the next item
- [ ] Server-side re-checks run for all threshold calculations and facility lookups — **N/A by design.** There is no server; this is a static client-only app, per the original build spec. If this tool is ever extended to submit data anywhere (e.g. a future enforcement-reporting feature), server-side validation becomes mandatory at that point — see Compliance and Privacy Requirements below.
- [ ] If any admin or maintenance views exist, they require authentication and authorization checks — **N/A**, no admin views exist. Facility/hauler data updates are made by editing the static JSON/CSV/TS data files directly in the repository.
- [x] Rate limiting applied to any external API calls (maps, geocoding) to prevent cost exposure. *Both services are free with no cost-exposure risk. Nominatim calls are inherently rate-limited by the UI (one lookup per manual Calculate click, not automatic/typeahead) — comfortably within its ~1 req/sec public usage policy. See External Dependencies above.*
- [x] Logging captures only what is needed for debugging — no unnecessary logging of user-entered data. *No logging of any kind exists in this app — no analytics, no error-tracking service, nothing.*
- [x] Any external datasets or APIs treated as untrusted inputs — records verified before results are published to users. *Geocoding failures (no match, service error) fall back to the zip-centroid method rather than trusting an unverifiable response; facility/hauler data is manually reviewed before being added per the update steps above.*

---

## Compliance and Privacy Requirements

- If any personal information is collected from Rhode Island users, a privacy notice must be published stating what is collected, why, how long it is kept, and whether it is shared
- Session-only data handling (as currently designed) minimizes privacy exposure — do not expand data collection without a legal review
- If the tool is ever presented to RIDEM or another government office, prepare a data provenance document covering: source of each dataset, update cadence, version history, and error-handling rules
- If scope expands to include worker or consumer records, a full legal review under Rhode Island and federal privacy law is required before launch

---

## Accessibility Compliance (WCAG 2.1 AA)

**Why this matters for RIDEM specifically:** under the DOJ's April 2024 rule implementing ADA Title II, state and local government web content now has a binding legal deadline to meet WCAG 2.1 AA — April 2026 for larger jurisdictions, April 2027 for smaller ones. If this tool becomes RIDEM-owned, it becomes subject to that rule as state government content.

**Audited:** July 2026, via a two-part process:
1. **Automated** — axe-core (the industry-standard automated accessibility test engine) run against every distinct page/interaction state: empty form, validation errors, the waste-tracking-records mode, all three compliance outcomes (each with their respective popup open and dismissed), the exact-address mode, the geocoding-fallback notice, the How It Works drawer, and the Hauler Directory. **Result: 0 violations across all 11 states**, after fixing 3 real issues the scan caught (details in changelog below).
2. **Manual** — keyboard-only navigation testing and direct focus-order verification (things automated scanners can't fully check), which caught a real focus-trap gap the automated pass didn't flag.

**What this audit does *not* cover:** screen-reader testing with an actual AT (e.g. NVDA/JAWS/VoiceOver) end-to-end, user testing with people who use assistive technology, and criteria that require human judgment calls (e.g., whether alt text is *meaningfully* descriptive vs. just present). Axe-core catches roughly 30-50% of WCAG issues by nature — real-world testing with actual AT users is what closes that remaining gap, and is worth doing before this is presented as fully compliant to RIDEM, not just "audited."

**Re-audit trigger:** any future UI change should re-run this same process before shipping — a passing audit today doesn't guarantee a passing audit after a new feature. There is no CI/automated gate for this yet; it has been run manually each time.

**Re-audited:** July 2026, after the entity-definitions droplet, the "Important things to know" panel, and the mobile info-icon menu were added. Automated pass covered both mobile (390px) and desktop (1280px) viewports across the new interactive states (info-menu closed/open, Important Things to Know open, entity-definitions droplet open) plus the existing baseline states. **Found 1 pre-existing violation** (not caused by this round of changes): `Hero.tsx`'s `<section>` had no accessible name, so axe didn't recognize it as a landmark, leaving its content technically outside any landmark region — present on every state including the plain homepage, so it predates this specific audit and was missed by the original one. Fixed with `aria-label="Introduction"` on that section. **Result after the fix: 0 violations across all 7 states checked.** Manual keyboard check on the new mobile info-menu confirmed Enter opens it, Tab moves through both items in the expected order, and Escape closes it.

---

## Note on Geocoding — Two Different Contexts, Don't Conflate Them

**Facility-list geocoding (maintainer-side) — still manual, unchanged.** For MVP, facility coordinates are maintained manually. When a facility address changes, the maintainer geocodes the new address and updates the dataset directly. This is a two-minute task given the small number of facilities (currently 10). See "Facility Data: How to Update" above.

If this tool is handed off to RIDEM or RIFPC for ongoing maintenance, a non-technical maintainer may benefit from a built-in geocoding step here too, rather than a manual lookup process. This should still be evaluated at the point of institutional handoff, once the maintainer's technical comfort level is known — **this specific piece has not been built**, and shouldn't be until that conversation happens.

**User-address geocoding (end-user-side) — now built, as of July 2026.** This is a different feature entirely: an *optional* precision mode on the calculator itself, where a user can enter their exact street address instead of relying on their zip code's center point, for a more accurate 15-mile determination (the statute measures from the entity's actual location, not a zip code — zip-centroid is this tool's approximation for the default, faster path). This uses the Nominatim service described in "External Dependencies" above, is entirely session-only (nothing stored), and falls back cleanly to the zip-centroid method if the lookup fails. The original caution above ("do not build geocoding before evaluating maintainer needs") was about the *facility-list* maintenance workflow — this is a separate, already-completed, user-facing accuracy feature and does not conflict with that guidance.

---

## Scheduled Maintenance Checks

| Check | Frequency | Action Required |
|---|---|---|
| RIDEM composting and AD facility inventory | Monthly | Compare against dataset, update any status changes, geocode new addresses |
| Agricultural composting permit list | Quarterly | Email Tyler Hertzwig at RIDEM to confirm changes |
| Organics-capable hauler list | Quarterly | Re-verify with RIFPC, update contact info as needed |
| RIRRC hauler list | Quarterly | Check rirrc.org for updated version |
| Statutory thresholds (§ 23-18.9-17) | Annually | Check RI General Assembly for amendments each January |
| RIDEM composting regulations | Annually | Check dem.ri.gov for regulatory updates |
| Security checklist review | At each build update | Re-run security checklist before any new deployment |
| Dependency vulnerabilities | At each build update, minimum quarterly | Run `npm audit`; address any new findings before deploying |
| Accessibility (WCAG 2.1 AA) re-audit | At each UI change, minimum annually | Re-run the axe-core + manual keyboard audit described in Accessibility Compliance above — a prior clean audit does not carry forward automatically |
| Statutory tipping-fee waiver disclosure (§ 23-18.9-17(c)) | Annually, alongside the statutory threshold check | Confirm the waiver provision text/conditions haven't changed; update the How It Works wording if they have |

---

## Changelog

| Date | What Changed | Updated By |
|---|---|---|
| May 2026 | Initial dataset compiled from RIDEM facility inventory (May 4, 2026) and agricultural permit list | [Your Name] |
| May 2026 | Hauler directory source updated from CET to RIRRC. Legal, build, security, and compliance requirements added. Scheduled maintenance checks added. | [Your Name] |
| Jul 2026 | Full prototype build completed (calculator, facility map, How It Works, Hauler Directory with real RIRRC/RIFPC-verified contact data) and legality-checked against the Project Seed Checklist. | [Your Name] |
| Jul 2026 | Tool renamed Comply RI → RhodeWaste — Organics Navigator throughout (code, data files, docs). GitHub repo renamed to match. | [Your Name] |
| Jul 2026 | Vite upgraded 5→8 (with a matching @vitejs/plugin-react bump) to resolve 2 npm audit vulnerabilities. 0 vulnerabilities as of this date. | [Your Name] |
| Jul 2026 | Statute re-verified directly against the primary source (webserver.rilegislature.gov, full verbatim text, not a summary). Confirmed thresholds unchanged; discovered the § 23-18.9-17(c) tipping-fee waiver was previously undisclosed in the tool. Added a popup + How It Works section disclosing it for the 52-ton and 104-ton categories (not applicable to K–12). | [Your Name] |
| Jul 2026 | Added an optional "exact address" precision mode (Nominatim geocoding) alongside the default zip-centroid method, since the statute measures from the entity's actual location, not a zip code. Falls back to zip-centroid on any lookup failure. See External Dependencies and the Geocoding note above. | [Your Name] |
| Jul 2026 | Added a share feature (native Web Share API + clipboard fallback) for above-threshold results, and Open Graph / Twitter Card social-preview tags. | [Your Name] |
| Jul 2026 | First formal WCAG 2.1 AA accessibility audit — automated (axe-core) + manual keyboard/focus testing across every page state. Fixed: insufficient text contrast on status-chip colors, a focus-trap gap in both popup dialogs, a dangling ARIA reference on tab switch, missing status announcements for screen readers on calculation results, and insufficient border contrast on form controls. 0 violations as of this audit. See Accessibility Compliance above. | [Your Name] |
| Jul 2026 | Fixed a wording bug where the 15-mile distance disclosure implied the law requires zip-centroid measurement (it only requires straight-line vs. driving distance — zip-centroid is the tool's own default approximation). | [Your Name] |
| Jul 2026 | Second compliance audit against primary statutory text (§ 23-18.9-7, § 23-18.9-18) found three gaps: the 104-ton category's label overstated the statute's specific enumerated "covered entity" list; the 52-ton higher-ed threshold is legally measured per building, not campus-wide; and the § 23-18.9-18 recordkeeping requirement was undisclosed. Added a "See exact legal definitions" toggle on the calculator (verbatim statutory text per category) and a new "Important things to know" panel covering all three. Relabeled the 104-ton category from "All other generators (municipal, institutional)" to "Commercial or institutional entity." See "Entity Category Accuracy" above for full detail. | [Your Name] |
| Jul 2026 | Mobile layout pass: fixed the header title truncating on narrow screens, the hero text's misaligned indent, and collapsed the "How it works" / "Important things to know" links into a single info-icon menu on mobile (desktop unchanged). Re-ran `npm audit` (0 vulnerabilities) and the axe-core accessibility audit afterward — caught and fixed one pre-existing landmark issue in `Hero.tsx` unrelated to these changes; 0 violations after the fix. Confirmed the entity-type values, thresholds, and calculation logic were untouched by any of this session's UI/label work. See Accessibility Compliance above. | [Your Name] |

---

*Document owner: [Your Name] | Next review: [Date + 3 months]*
