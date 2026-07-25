import type { HaulerListing } from "../types";

// Sourced from Hauler-Verifiedfoodorganicsservice-RhodeIslandserv.csv (RIRRC/RIFPC
// verification). Re-verify quarterly per RhodeWaste_Maintenance_Notes.md.
export const HAULERS: HaulerListing[] = [
  {
    hauler_name: "Black Earth Compost",
    verified_service: "Food scrap pickup and compost delivery service.",
    service_area: "Eastern Rhode Island only.",
    phone: "978-290-4610",
    email: "grobe@blackearthcompost.com",
    address: "No single RI address listed (RI/MA/NH service area).",
    website: "blackearthcompost.com",
  },
  {
    hauler_name: "Bootstrap Compost",
    verified_service: "Compost collection for food scraps and organics.",
    service_area: "Rhode Island (coverage area not clearly specified).",
    phone: "(617) 642-1979",
    email: "info@bootstrapcompost.com",
    address: "P.O. Box 40184, Providence, RI 02904",
    website: "bootstrapcompost.com",
  },
  {
    hauler_name: "City Compost",
    verified_service: "Accepts all foods, yard material, and compostables.",
    service_area: "Not clearly specified.",
    phone: "978-407-0234",
    email: "Not listed",
    address: "Not listed",
    website: "citycompost.com",
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
    service_area: "All of Rhode Island.",
    phone: "401-943-3553",
    email: "awhite3@republicservices.com",
    address: "1080 Airport Rd, Fall River, MA 02720",
    website: "republicservices.com",
  },
];
