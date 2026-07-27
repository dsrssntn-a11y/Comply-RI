import { describe, expect, it } from "vitest";
import { computeComplianceStatus, findNearestFacility, getZipCentroid } from "./lib/calculations";
import { isWithinServiceRadius } from "./data/facilityRules";
import { ENTITY_THRESHOLDS } from "./data/thresholds";
import { FACILITIES } from "./data/facilities";
import type { EntityType } from "./types";

// Reproduces the three prototype scenarios from README.md end-to-end, using
// the same production data/logic the app itself runs — a regression check
// against the actual compliance determination, not just its individual parts.
function runScenario(entityType: EntityType, zip: string, tonnage: number) {
  const origin = getZipCentroid(zip);
  if (!origin) throw new Error(`No centroid for zip ${zip}`);
  const threshold = ENTITY_THRESHOLDS[entityType];
  const nearest = findNearestFacility(origin, FACILITIES);
  const withinRadius = nearest ? isWithinServiceRadius(nearest.distanceMiles) : false;
  return {
    status: computeComplianceStatus(tonnage, threshold, withinRadius),
    nearest,
  };
}

describe("README prototype scenarios", () => {
  it("Scenario 1 — CCRI (higher-ed, 02886, 65 tons) resolves to comply", () => {
    const result = runScenario("higher_ed", "02886", 65);
    expect(result.status).toBe("comply");
    expect(result.nearest?.facility.facility_name).toBe(
      "Rhode Island Bioenergy Facility (ORBIT)"
    );
  });

  it("Scenario 2 — K-12 school (02903, 18 tons) resolves to below threshold", () => {
    const result = runScenario("k12", "02903", 18);
    expect(result.status).toBe("below");
  });

  it("Scenario 3 — commercial/institutional entity (02837, 120 tons) resolves to exempt", () => {
    const result = runScenario("other", "02837", 120);
    expect(result.status).toBe("exempt");
  });
});
