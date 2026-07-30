import type { HaulerListing } from "../types";

// Sourced from Hauler-Verifiedfoodorganicsservice-RhodeIslandserv.csv (RIRRC/RIFPC
// verification). Re-verify quarterly per RhodeWaste_Maintenance_Notes.md.
export const HAULERS: HaulerListing[] = [
  {
    hauler_name: "Black Earth Compost",
    verified_service: "Food scrap pickup and compost delivery service.",
    service_area: "Eastern Rhode Island only.",
    phone: "978-290-4610",
    email: "service@blackearthcompost.com",
    address: "No single RI address listed (RI/MA/NH service area).",
    website: "blackearthcompost.com",
  },
  {
    hauler_name: "Bootstrap Compost",
    verified_service: "Compost collection for food scraps and organics.",
    service_area: "Northern and central Rhode Island — Providence metro area and select communities.",
    phone: "(617) 642-1979",
    email: "info@bootstrapcompost.com",
    address: "P.O. Box 40184, Providence, RI 02904",
    website: "bootstrapcompost.com",
  },
  {
    hauler_name: "Epic Renewal",
    verified_service:
      "Zero waste consulting and organics collection. Best suited to organizations looking for a long-term waste reduction strategy, not transactional pickup only. Volume clients may be referred to partner haulers. Contact by email only to discuss fit before committing.",
    service_area:
      "Rhode Island — availability depends on location, volume, and fit. Contact to confirm.",
    phone: "Not listed",
    email: "support@epicrenewal.org",
    address: "Not listed",
    website: "epicrenewal.org",
  },
  {
    hauler_name: "Harvest Cycle",
    verified_service: "Food scrap collection for residents, restaurants, and small businesses.",
    service_area: "Providence and surrounding areas.",
    phone: "(401) 305-7174",
    email: "compost@groundworkri.org",
    address: "34 Fuller Street, Providence, RI 02909",
    website: "groundworkri.org/harvest-cycle-compost",
  },
  {
    hauler_name: "PF Trading",
    verified_service: "Composting and food waste hauling.",
    service_area: "All of Rhode Island.",
    phone: "800-509-9374",
    email: "paul@pftrading.com",
    address: "104 Braley Rd, East Freetown, MA",
    website: "pftrading.com",
    websiteCaveat:
      "This site's SSL certificate doesn't match its domain, which can trigger browser security warnings (confirmed independently — not just one browser's false positive). The address is likely still correct, but call to confirm before entering any information there.",
  },
  {
    hauler_name: "ReMix Organics",
    verified_service: "Organic waste collection.",
    service_area: "Providence, Quonset, Newport.",
    phone: "(844) 741-4653",
    email: "info@remixorganics.com",
    address: "190 Swan Street, Providence, RI 02905",
    website: "remixorganics.com",
  },
  {
    hauler_name: "Republic Services / Allied Waste Services",
    verified_service: "Organic and food waste disposal.",
    service_area: "Depends on location of service — may not service all of Rhode Island.",
    phone: "800-825-3260",
    email: "awhite3@republicservices.com",
    address: "1080 Airport Rd, Fall River, MA 02720",
    website: "republicservices.com",
  },
  {
    hauler_name: "Zero Waste Solutions",
    verified_service:
      "Scheduled organic and yard waste collection, including food scrap pickup and bulk yard waste removal, with composting services that divert collected material to composting facilities.",
    service_area: "Throughout Rhode Island.",
    phone: "925-270-3339",
    email: "info@zerowastesolutions.com",
    address: "1630 W Main Rd, Portsmouth, RI 02871",
    website: "zerowastesolutions.com/services/organic-and-yard-waste/",
  },
];
