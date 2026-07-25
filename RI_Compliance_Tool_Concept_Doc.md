# RhodeWaste — Organics Navigator: Concept Document
**Version 1.0 | Project Seed Phase**

---

## Problem

Rhode Island's Commercial Food Waste Ban requires specific entities to divert organic waste to authorized facilities — but there is no self-service tool for entities to determine their own compliance status. The calculation is currently done manually, the authorized facility and hauler data is scattered across multiple sources, and there is no centralized point of reference for entities trying to understand their obligations under state law.

---

## What the Tool Does

A two-part tool: a compliance calculator and a static, curated service directory.

A user inputs three things: their zip code, their entity type, and their estimated annual food waste volume in tons. The tool returns:

1. Their applicable tonnage threshold under RI law
2. Whether they are above or below that threshold
3. If above threshold — the nearest authorized facility within 15 miles (straight-line), with name and contact information
4. Relevant service provider contact information for haulers operating in their area
5. Estimated tons diverted from landfill annually if compliant

If no authorized facility exists within 15 miles, the tool states clearly that the 15-mile exemption applies and the entity is not currently required to comply.

---

## Who It's For

Rhode Island entities subject to the food waste ban, as defined by R.I. Gen. Laws § 23-18.9-7 — the commercial/institutional category is a specific enumerated list, not a general municipal/institutional catch-all (see the table below).

| Entity Type | Tonnage Threshold |
|---|---|
| Higher education and research institutions | 52 tons/year |
| Other educational entities (K–12) | 30 tons/year |
| Commercial/institutional entity (specific enumerated list — see § 23-18.9-7(19)) | 104 tons/year |

**Primary scenario for prototype:** Community College of Rhode Island (higher education, 52-ton threshold)

---

## The 15-Mile Rule

Distance is measured as straight-line radius ("as the crow flies") per statute — not driving distance. The tool calculates this using the haversine formula against a fixed dataset of authorized facility coordinates.

Authorized facilities include:
- Licensed commercial composting facilities
- Anaerobic digestion (AD) facilities
- Permitted agricultural operations

---

## Data Sources

| Data | Source |
|---|---|
| Tonnage thresholds and legal language | RI General Assembly § 23-18.9-17 |
| Authorized facility list | RIDEM, RIRRC, Earth Care Farm |
| Service provider directory | CET RI Service Providers dataset, RIFPC |
| Hauler contact info | CET dataset (pricing/capacity requires direct contact) |

**Data model:** Static, manually maintained. Requires periodic review — recommended quarterly — against RIDEM's current authorized facility list.

---

## What the Tool Is Not

- Not a real-time database
- Not a pricing or capacity estimator for haulers
- Not an enforcement mechanism
- Not legal advice — informational only, legal disclaimer required on all outputs

---

## MVP Feature Scope

**In:**
- Entity type selector
- Tonnage input and threshold calculation
- Compliance status output (above / below / exempt)
- Nearest authorized facility with contact info
- Service provider directory filtered by zip code
- Estimated tons diverted output
- Plain-English explanation of the law
- Legal disclaimer

**Out (v2 or later):**
- CO2e impact calculation
- Real-time hauler capacity or pricing
- Multi-state expansion
- Enforcement reporting or data submission *(v2 only — requires formal partnership with RIDEM or RIFPC as the designated recipient; a submission feature with no institutional recipient is just a form. Do not build until that relationship is confirmed.)*

---

## Impact Output

Display format: callout number showing **X tons** prominently, with supporting text beneath it.

> **X tons**
> If [Entity Name] complies with the RI food waste ban, an estimated X tons of organic waste will be diverted from landfill annually.

Derived directly from user input. No external modeling required for MVP.

---

## Legal and Privacy

- All outputs carry a disclaimer: informational only, not legal advice
- User inputs are session-only — no data stored or transmitted
- Privacy statement displayed at point of data entry

### Disclaimer Language

**At point of data entry (short):**
Your inputs are used only to calculate your compliance status and are not stored, saved, or transmitted. This tool is for informational purposes only and does not constitute legal advice. For official guidance, contact RIDEM directly.

**On every output screen (full):**
This tool provides general information based on Rhode Island General Law § 23-18.9-17 and publicly available facility and service provider data. Results are intended to help entities understand their potential obligations under the RI Commercial Food Waste Ban — they do not constitute legal advice and should not be relied upon as a determination of compliance.

Facility and hauler data is maintained on a static basis and may not reflect the most current authorized facility list. Users are encouraged to verify current requirements and facility status directly with the Rhode Island Department of Environmental Management (RIDEM) at dem.ri.gov.

No user data is collected, stored, or transmitted. All inputs are session-only and are cleared when the session ends.

---

## What Success Looks Like at Prototype Stage

A working prototype that runs three scenarios end-to-end:
1. A Community College of RI campus — above threshold, facility within 15 miles
2. A K–12 school — below threshold (educational, honest result)
3. A hospital — above threshold, no facility within 15 miles (exempt result)

Each scenario produces a complete, accurate output with real facility and hauler data.

---

## Open Items Before Build

- [ ] Confirm complete authorized facility list and coordinates from RIDEM
- [ ] Confirm CET dataset currency — date last updated
- [x] Tool name confirmed: RhodeWaste — Organics Navigator
- [x] Decide impact metric display format — callout number (X tons) with supporting text
- [ ] Draft legal disclaimer language

---

*Scope: Rhode Island only | Status: Concept phase | Build: Pending prototype*
