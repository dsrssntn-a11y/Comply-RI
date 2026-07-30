# RhodeWaste — Organics Navigator: Maintenance Notes
**Version 1.2 | For internal use and institutional handoff**

---

## Purpose

This document outlines how to keep the RhodeWaste tool accurate and current after launch. It is written for both the original maintainer and any institutional partner (RIDEM, RIFPC) who may take over the tool in a future version.

---

## Where This Lives

- **Code repository:** https://github.com/dsrssntn-a11y/RhodeWaste-Organics-Navigator
- **Stack:** React + TypeScript + Vite, Tailwind CSS. No backend, no database — a static site that can be hosted anywhere that serves static files (GitHub Pages, Netlify, a state web server, etc.). See `README.md` for the full build spec and file structure.
- **License:** MIT (`LICENSE`, added Jul 2026). Copyright held under the repo owner's GitHub handle (`dsrssntn-a11y`) — there's no formal legal entity behind this project yet. **Revisit at RIDEM handoff**, same as the liability-clause wording noted in the Legal/Liability Review section above: update the copyright line, and decide whether MIT is still the right choice once there's a real institutional owner (it may be — government agencies commonly release code as MIT/permissive open source — but that's a decision for whoever takes over, not something to assume carries forward automatically).
- **Deployed:** https://rhode-waste-organics-navigator.vercel.app/ — this is a Vercel-assigned domain, not a permanent/custom one. `og:url` and the social-preview image URLs in `index.html` now point here; if a custom or state-owned domain (e.g. under ri.gov) is ever set up, those need to be updated too — see the comment left in `index.html`.

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

## Known Limitation — Facility "Available Capacity" Isn't Modeled

The statute's actual trigger condition (§ 23-18.9-17(a)(2)) is distance to an authorized facility "with available capacity to accept such material" — not just distance. The calculator only checks distance; the `Facility` type (`types/index.ts`) has no capacity field, and every facility in the dataset is treated as though it always has open capacity.

**Why this can't be computed, only disclosed:** `rhodewaste_facilities.json` already has a `notes` field on every one of the 10 facilities, and it was never rendered anywhere in the UI before this fix — checked via a full-file grep, zero matches in `src/`. Several of those notes are genuine capacity/status caveats the original maintainer already knew mattered (e.g. Michael Bradlee Composting Operation: *"Small-scale operation per RIDEM. Verify capacity before presenting as available facility."*), but they exist only as free-text notes, not a structured, queryable capacity field — meaning RIDEM's public inventory doesn't appear to expose reliable, real-time capacity data to build an automated check against in the first place.

**Mitigation shipped (Jul 2026):** added a sentence to the existing "comply" result text in `ResultCard.tsx` — *"Facility capacity and operating status can change — confirm directly with the facility before relying on this result, especially for smaller-scale operations."* Same pattern as the exempt-staleness disclosure above: this discloses the limitation, it doesn't resolve it.

**Data-hygiene note for future facility updates:** the `notes` field currently mixes two different audiences — some entries are written as instructions to whoever maintains the dataset ("verify still active before presenting to users," "verify status with RIDEM before next quarterly check"), which read strangely if ever shown to an end user, while others (e.g. "Block Island only — accessible by ferry") are genuinely useful facts a user would want to know if that facility turns out to be their nearest one. Keep `notes` strictly maintainer-internal going forward. If a specific facility caveat is ever important enough to show end users directly, give it its own dedicated field (e.g. `publicCaveat`) rather than blending it into `notes` — don't render `notes` verbatim under any circumstances.

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

**Additional resource (Jul 2026):** RIRRC forwarded https://www.zerowasteprovidence.com/resources while confirming the hauler list. Not shown in the app itself — recorded here as a useful cross-reference for the next hauler-directory verification cycle.

**Epic Renewal (added Jul 2026)** — verified against https://www.providenceri.gov/sustainability/compost/, which lists Epic Renewal alongside several other haulers already in this directory (Harvest Cycle, ReMix Organics, Black Earth Compost, City Compost). This source URL is not shown in the app itself — it's recorded here for the next verification cycle. Contact is email-only (no phone or address currently listed); framed in the directory as a zero-waste consulting service best suited to organizations wanting a long-term strategy rather than transactional pickup, per the business's own positioning — not a typical pickup-only hauler like the rest of the list.

**Pending action items:**
1. ~~Emailed RIDEM — **Nathan Arruda (nathan.arruda@dem.ri.gov)**, POC for authorized/permitted solid waste facilities — to confirm current facility data.~~ **Confirmed with RIDEM, June 2026** — facility data reverified. Footer date updated accordingly (see below).
2. ~~Emailed **Tyler Hertzwig (tyler.hertzwig@dem.ri.gov)**, POC for agricultural composting operations — to confirm current agricultural composting permit status.~~ **Confirmed for Greene Farm LLC, Jul 2026** (see below). Other agricultural farms on the list (EarthCare, Schartner, Little Rhody, Scobco) weren't part of that reply and haven't been re-verified.
3. Compile any remaining updated contact information as further responses come back.

Update `src/data/facilities.ts` / `rhodewaste_facilities.json` and this document's "Last verified" dates once further replies come back — don't let a reply sit unactioned.

**Facility data reverified with RIDEM (Jun 2026):** Nathan Arruda confirmed the facility inventory. Footer (`Footer.tsx`) updated from "Facility data last verified: May 2026" to "June 2026" to reflect this.

**Greene Farm LLC — confirmed with Tyler Hertzwig (Jul 2026):** permit is active, issued 11/22/2024. RI agricultural composting permits have no renewal period — a new permit is only required if the farm increases compostable tonnage brought onto the farm, changes location, or changes ownership. Greene Farm brings in food waste as part of their compost recipe (also brings in plant material), confirming putrescibles are genuinely accepted there, not just nominally listed. `rhodewaste_facilities.json`/`.csv` updated accordingly — no front-facing UI change needed, since facility `notes` are maintainer-internal only (see data-hygiene note above).

**Real findings from a real-device check (Jul 2026):** a friend tested the live site on an actual iPhone (Safari) as part of the cross-browser verification pass, and surfaced two genuine hauler-data problems that automated checks (Playwright/WebKit) hadn't caught, since those don't test third-party sites' own infrastructure:
- **City Compost — removed entirely.** Both their phone number and website (`citycompost.com`) are dead — the phone is disconnected and the domain fails to resolve in DNS at all (verified via `curl`: "Could not resolve host"). With no working contact method left, the entry was removed from `src/data/haulers.ts` rather than kept with placeholder text.
- **PF Trading — link disabled, not removed.** Safari flagged `pftrading.com` as a suspected impersonation attempt. Verified independently (not just trusting Safari's heuristic): `curl`'s TLS handshake fails with a certificate/hostname mismatch, and Chromium throws `net::ERR_CERT_COMMON_NAME_INVALID` on the same domain. Pulling the actual certificate shows it's issued for `*.turbifysites.com` (Turbify, a real hosting company, formerly Yahoo Small Business hosting) — not an unrelated/malicious domain. This looks like PF Trading's own hosting misconfiguration (no dedicated SSL cert set up for their custom domain), not a hijacked domain — but browsers can't tell the difference from the outside, so the warning will keep appearing until PF Trading's host fixes it. Added a `websiteCaveat` field (`types/index.ts`, rendered in `HaulerDirectory.tsx`) that shows the domain as plain non-clickable text with an amber note, instead of removing it outright, since the address itself is likely still correct. **Re-check at the next quarterly hauler verification** — remove the caveat once the certificate is fixed, or escalate to full removal if it's still broken after a reasonable grace period.

This is a good argument for real-device spot-checks being worth doing occasionally, not just automated cross-browser engine checks — WebKit/Chromium confirm *our own* rendering is correct, but can't tell you a third-party contact link has gone bad.

**Additional hauler data updates from this same review pass (Jul 2026):**
- **Black Earth Compost** — email corrected to `service@blackearthcompost.com` (was `grobe@blackearthcompost.com`).

**Republic Services / Allied Waste Services — verified by phone call (Jul 29, 2026).** Called and confirmed directly: organics/food-waste capability, RI service area, and service-area caveats. Service area is location-dependent and may not cover all of Rhode Island — data updated accordingly (`service_area`, phone `800-825-3260`). Their listed email (`awhite3@republicservices.com`) was not part of this call and remains unverified — still flagged for the next check.

**Zero Waste Solutions (added Jul 2026)** — organics/food-waste capability and RI service area are confirmed directly on their own site (https://www.zerowastesolutions.com/services/organic-and-yard-waste/, FAQ section). The Portsmouth, RI address (1630 W Main Rd, Portsmouth, RI 02871) is also sourced from that same page, where it's listed as one of their office locations under "Areas We Serve." Phone and email were provided directly and not independently re-verified beyond that source page.

**Footer date added (Jul 2026):** `Footer.tsx` now shows "Hauler directory last verified: July 2026" alongside the existing "Facility data last verified" line. Internally, this date is attributed to the hauler directory's RIRRC verification (per the sourcing note at the top of `src/data/haulers.ts`: "Sourced from Hauler-Verifiedfoodorganicsservice-RhodeIslandserv.csv (RIRRC/RIFPC verification)"). The Republic Services phone-call check and Zero Waste Solutions website verification (both noted above) are separate, additional confirmations done this cycle — not part of the RIRRC verification itself. Update this footer date at the next quarterly hauler check.

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

## Legal/Liability Review — July 2026

A liability-focused review (separate from the statutory-accuracy audit earlier in this document) found three items. All three have been addressed — one (#1) is flagged to revisit at ownership handoff, not because it's unresolved now.

**1. No limitation-of-liability language existed anywhere in the tool.** Added an "as is, at your own risk" sentence to the footer disclaimer (`Footer.tsx`), alongside the existing "not legal advice" language. Deliberately doesn't name a specific liable party — no formal legal entity is attached to this project yet, and naming one prematurely could create more confusion than it resolves. **Revisit this wording once RIDEM or another formal owner takes over.** A government-owned tool typically operates under sovereign immunity / state tort-claims-act protections that a privately-run project doesn't have, so the language may need to change — or could potentially be simplified or removed entirely — once that transfer happens. Don't assume the current wording is still the right call at that point; re-evaluate it as part of the handoff, not carry it forward by default.

**2. Nominatim's attribution requirement wasn't fully met.** Their usage policy (separate from the rate-limit and User-Agent/Referer requirements documented above) requires "Search by Nominatim" text, their logo, or a hyperlink to nominatim.openstreetmap.org, adjacent to the search box or search results. Added as a hyperlink inside the existing address-mode note in `CalculatorForm.tsx`.

**3. Branding may read as official before RIDEM has actually adopted this tool — researched and resolved (Jul 2026).** "RhodeWaste — Organics Navigator," combined with a Rhode-Island-shaped/state-colored mark, could lead a visitor to reasonably assume this is an official state product when it's currently an independent project. Two things were done:

- **Disclosure added:** an explicit *"This is an independent project, not officially affiliated with or endorsed by RIDEM"* disclosure in amber, in both the hero section (`Hero.tsx`) and the footer (`Footer.tsx`), so it's visible regardless of whether a result is showing (the hero hides after a calculation; the footer doesn't).
- **Checked against the primary source** — three statutes, verified verbatim via webserver.rilegislature.gov (not a summary):
  - *§ 42-4-2 (State seal)*: defines the actual protected seal as circular, bearing an anchor, the motto "Hope," ringed with "Seal of the State of Rhode Island, 1636." `RhodeIslandMark.tsx` is a rounded square containing a leaf — no anchor, no motto, no encircling text, not circular. Shares no design element with the actual seal.
  - *§ 11-15-4 (Unauthorized commercial use of state emblems)*: only reaches "the state seal, the state coat of arms, or a facsimile or imitation of them." Since the app's mark doesn't resemble either (per the comparison above), this statute doesn't apply to it.
  - *§ 6-13.1-2 (Deceptive trade practices — RI's general UDAP statute)*: not seal-specific — this is the one actually relevant to an "implies government affiliation" concern, and it's the one the disclosure above was added to directly address.

**Conclusion:** the seal-specific statutes don't apply (the mark bears no resemblance to the protected seal), and the general deceptive-practices statute is addressed by the disclosure already in place. This is no longer an open question — re-verify only if the mark's design or the app's name changes materially in the future.

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
| Greene Farm, LLC | Mark P. DePasquale | 5641 Flat River Road, Greene, RI 02827 | Leaf/Yard Waste, Manure, Putrescibles | Active (Issued 11/22/2024) |
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

## Automated Testing & CI

**Before July 2026, there was no automated test suite at all** — every verification in this project's history (statutory scenarios, accessibility states, mobile layout, etc.) was a one-off script written, run, and discarded in the moment. Nothing persisted to catch a future regression automatically, and CI (`.github/workflows/security-check.yml`, now renamed "CI Checks" in the Actions UI) only ran a custom secrets-scanning script — it never ran the build or a type-check, so a broken build could have reached `main` undetected.

**What was added — logic tests:**
- **Vitest** (a devDependency only — nothing shipped to production) with three test files: `src/lib/calculations.test.ts` and `src/lib/validation.test.ts` (unit tests for the pure calculation/validation logic), and `src/scenarios.test.ts` (the three prototype scenarios from `README.md` — CCRI/higher-ed-comply, K-12-below-threshold, commercial-entity-exempt — run end-to-end through the real production data and logic, not mocks).

**What was added — component tests (same day, expanded scope):**
- `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, and `jsdom` as devDependencies. Vitest's environment is now `"jsdom"` (was `"node"`) with a setup file at `src/vitest.setup.ts` that registers jest-dom's matchers and runs `cleanup()` after every test.
- `src/components/ResultCard.test.tsx` — asserts exactly which notices render for which entity-type/status combinations (the higher-ed per-building caveat, the recordkeeping note, the exempt-staleness disclosure, the geocode-fallback notice). `FacilityMap` is mocked out in this file (and in `App.test.tsx`) since it renders real Leaflet output that needs actual browser layout — jsdom doesn't provide one, and the map isn't what these tests are checking anyway.
- `src/app/App.test.tsx` — one full interaction test: fill the form, click Calculate, confirm the Hero intro strip disappears. This exercises exactly the class of "wiring" bug this session hit repeatedly (a state update not reaching the component that's supposed to react to it), which the pure logic tests structurally can't catch.
- `src/components/Header.test.tsx` — the mobile info-menu's open/close/click-through/outside-click logic. **Important gotcha documented in the test file itself:** the desktop "How it works"/"Important things to know" text links are always present in the jsdom DOM tree — they're hidden on mobile via a Tailwind `hidden sm:flex` class, and jsdom has no real layout engine to evaluate that media query. Every query in this file is scoped to the popover container (`#header-info-menu`) specifically to avoid colliding with the always-present desktop buttons. This is a general limitation of component testing responsive/CSS-driven visibility — the Playwright screenshot checks done throughout this project's history are what actually verify that kind of thing, not these tests.
- **Real bug caught while writing these tests, not a hypothetical:** the first version had no `afterEach(cleanup)` registered, so DOM from one test was still present when the next test's assertions ran — later tests were finding stale elements left over from earlier ones and failing with "multiple elements found" or false negatives. Fixed in `src/vitest.setup.ts`.
- **Deliberately still not included:** the Nominatim/exact-address geocoding path (would need `fetch` mocked — the default zip-only submission path never calls it, so it wasn't required for the tests above) and full Playwright end-to-end browser tests. Reasonable things to add later, not gaps being ignored.
- 36 tests total across 6 files, all passing.

**CI now runs, in order:** `npm run lint` (type-check) → `npm test` → `npm run build` → the existing `npm run security:check`. A broken build, a type error, or a failing test now blocks a bad `main` push the same way the security scan already did.

**Running tests locally:** `npm test` (runs once and exits — use `npx vitest` directly for watch mode during development).

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
| May 2026 | Initial dataset compiled from RIDEM facility inventory (May 4, 2026) and agricultural permit list | dsrssntn-a11y |
| May 2026 | Hauler directory source updated from CET to RIRRC. Legal, build, security, and compliance requirements added. Scheduled maintenance checks added. | dsrssntn-a11y |
| Jul 2026 | Full prototype build completed (calculator, facility map, How It Works, Hauler Directory with real RIRRC/RIFPC-verified contact data) and legality-checked against the Project Seed Checklist. | dsrssntn-a11y |
| Jul 2026 | Tool renamed Comply RI → RhodeWaste — Organics Navigator throughout (code, data files, docs). GitHub repo renamed to match. | dsrssntn-a11y |
| Jul 2026 | Vite upgraded 5→8 (with a matching @vitejs/plugin-react bump) to resolve 2 npm audit vulnerabilities. 0 vulnerabilities as of this date. | dsrssntn-a11y |
| Jul 2026 | Statute re-verified directly against the primary source (webserver.rilegislature.gov, full verbatim text, not a summary). Confirmed thresholds unchanged; discovered the § 23-18.9-17(c) tipping-fee waiver was previously undisclosed in the tool. Added a popup + How It Works section disclosing it for the 52-ton and 104-ton categories (not applicable to K–12). | dsrssntn-a11y |
| Jul 2026 | Added an optional "exact address" precision mode (Nominatim geocoding) alongside the default zip-centroid method, since the statute measures from the entity's actual location, not a zip code. Falls back to zip-centroid on any lookup failure. See External Dependencies and the Geocoding note above. | dsrssntn-a11y |
| Jul 2026 | Added a share feature (native Web Share API + clipboard fallback) for above-threshold results, and Open Graph / Twitter Card social-preview tags. | dsrssntn-a11y |
| Jul 2026 | First formal WCAG 2.1 AA accessibility audit — automated (axe-core) + manual keyboard/focus testing across every page state. Fixed: insufficient text contrast on status-chip colors, a focus-trap gap in both popup dialogs, a dangling ARIA reference on tab switch, missing status announcements for screen readers on calculation results, and insufficient border contrast on form controls. 0 violations as of this audit. See Accessibility Compliance above. | dsrssntn-a11y |
| Jul 2026 | Fixed a wording bug where the 15-mile distance disclosure implied the law requires zip-centroid measurement (it only requires straight-line vs. driving distance — zip-centroid is the tool's own default approximation). | dsrssntn-a11y |
| Jul 2026 | Second compliance audit against primary statutory text (§ 23-18.9-7, § 23-18.9-18) found three gaps: the 104-ton category's label overstated the statute's specific enumerated "covered entity" list; the 52-ton higher-ed threshold is legally measured per building, not campus-wide; and the § 23-18.9-18 recordkeeping requirement was undisclosed. Added a "See exact legal definitions" toggle on the calculator (verbatim statutory text per category) and a new "Important things to know" panel covering all three. Relabeled the 104-ton category from "All other generators (municipal, institutional)" to "Commercial or institutional entity." See "Entity Category Accuracy" above for full detail. | dsrssntn-a11y |
| Jul 2026 | Mobile layout pass: fixed the header title truncating on narrow screens, the hero text's misaligned indent, and collapsed the "How it works" / "Important things to know" links into a single info-icon menu on mobile (desktop unchanged). Re-ran `npm audit` (0 vulnerabilities) and the axe-core accessibility audit afterward — caught and fixed one pre-existing landmark issue in `Hero.tsx` unrelated to these changes; 0 violations after the fix. Confirmed the entity-type values, thresholds, and calculation logic were untouched by any of this session's UI/label work. See Accessibility Compliance above. | dsrssntn-a11y |
| Jul 2026 | Cross-browser check via Playwright's WebKit engine (0 rendering issues, 0 console errors) plus a real-device Safari/iPhone spot-check, which surfaced two genuine hauler-data problems automated engine checks couldn't have caught: City Compost's phone and website were both dead (removed entirely), and PF Trading's site has a certificate/domain mismatch that triggers real browser security warnings (verified independently via `curl` and Chromium, not just trusting Safari — link disabled, domain text kept with a caveat note, pending PF Trading fixing their hosting's SSL config). See "Real findings from a real-device check" above. | dsrssntn-a11y |
| Jun 2026 | Facility data reverified with RIDEM (Nathan Arruda). Footer "Facility data last verified" date updated from May 2026 to June 2026. | dsrssntn-a11y |
| Jul 2026 | Greene Farm LLC's agricultural composting permit confirmed with RIDEM (Tyler Hertzwig): active, issued 11/22/2024; food waste confirmed as part of their compost recipe. Republic Services / Allied Waste Services phone-verified (organics capability, RI service area, phone). Zero Waste Solutions added as a new hauler, verified against their own site. Footer "Hauler directory last verified" line added, attributed to the directory's RIRRC verification. | dsrssntn-a11y |

---

*Document owner: dsrssntn-a11y | Next review: October 2026 (3 months from last update)*
