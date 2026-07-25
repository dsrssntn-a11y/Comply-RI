# RhodeWaste — Organics Navigator: Maintenance Notes
**Version 1.0 | For internal use and institutional handoff**

---

## Purpose

This document outlines how to keep the RhodeWaste tool accurate and current after launch. It is written for both the original maintainer and any institutional partner (RIDEM, RIFPC) who may take over the tool in a future version.

---

## Legal Foundation

The tool is built on the following statutory and regulatory sources. These must be verified for any changes before each major update or annually at minimum.

| Source | What It Governs | Check Frequency |
|---|---|---|
| R.I. Gen. Laws § 23-18.9-17 | Core food waste ban — tonnage thresholds, 15-mile condition, entity definitions | Annually — start of each calendar year |
| R.I. Gen. Laws Chapter 23-18.9 | Broader refuse-disposal chapter including related municipal responsibilities | Annually alongside § 23-18.9-17 |
| RIDEM solid waste and composting regulations | Governs "authorized composting facility" and "anaerobic digestion facility" status | Annually or when RIDEM issues regulatory updates |

**How to check for statutory changes:** Visit webserver.rilegislature.gov and search § 23-18.9-17 directly. Look for any amendments to tonnage thresholds, entity definitions, or the 15-mile condition. If the statute changes, the calculator logic must be updated before the next user session.

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
- Entity type definitions must match the statute: higher education and research institutions (52 tons), other educational entities/K–12 (30 tons), all other generators (104 tons)
- The 15-mile distance must be calculated as straight-line radius using the haversine formula — not driving distance
- The facility lookup must use only currently authorized facilities with active RIDEM status — proposed, expired, or closed facilities must be excluded
- The hauler/service provider directory must be clearly separated from the compliance determination output — users must not be able to confuse contact listings with a legal compliance result
- The "informational only, not legal advice" disclaimer must appear both at data entry and on every output screen

---

## Security Requirements: Build Checklist

These apply at build time. Flag any unresolved items before launch.

- [ ] All API keys, database credentials, and geocoding secrets kept server-side only — never in browser code or public repositories
- [ ] User inputs are session-only — no personal data stored or transmitted beyond the active session
- [ ] Input validation applied to zip code, entity type, and tonnage fields on both client and server side
- [ ] Server-side re-checks run for all threshold calculations and facility lookups — client-side output alone is not sufficient
- [ ] If any admin or maintenance views exist, they require authentication and authorization checks
- [ ] Rate limiting applied to any external API calls (maps, geocoding) to prevent cost exposure
- [ ] Logging captures only what is needed for debugging — no unnecessary logging of user-entered data
- [ ] Any external datasets or APIs treated as untrusted inputs — records verified before results are published to users

---

## Compliance and Privacy Requirements

- If any personal information is collected from Rhode Island users, a privacy notice must be published stating what is collected, why, how long it is kept, and whether it is shared
- Session-only data handling (as currently designed) minimizes privacy exposure — do not expand data collection without a legal review
- If the tool is ever presented to RIDEM or another government office, prepare a data provenance document covering: source of each dataset, update cadence, version history, and error-handling rules
- If scope expands to include worker or consumer records, a full legal review under Rhode Island and federal privacy law is required before launch

---

## Note on Geocoding for Future Versions

For MVP, facility coordinates are maintained manually. When a facility address changes, the maintainer geocodes the new address and updates the dataset directly. This is a two-minute task given the small number of facilities (currently 10).

If this tool is handed off to RIDEM or RIFPC for ongoing maintenance, a non-technical maintainer may benefit from a built-in geocoding step rather than a manual lookup process — both for ease of use and to reduce the risk of human error in coordinate entry. This should be evaluated at the point of institutional handoff, once the maintainer's technical comfort level is known.

Do not build geocoding into the tool before that conversation happens. Premature automation adds API dependencies and maintenance overhead that may not be warranted at this stage.

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

---

## Changelog

| Date | What Changed | Updated By |
|---|---|---|
| May 2026 | Initial dataset compiled from RIDEM facility inventory (May 4, 2026) and agricultural permit list | [Your Name] |
| May 2026 | Hauler directory source updated from CET to RIRRC. Legal, build, security, and compliance requirements added. Scheduled maintenance checks added. | [Your Name] |

---

*Document owner: [Your Name] | Next review: [Date + 3 months]*
