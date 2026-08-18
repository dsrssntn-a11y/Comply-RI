import { describe, expect, it } from "vitest";
import {
  computeComplianceStatus,
  convertToTons,
  findNearestFacility,
  getZipCentroid,
  sumWasteRecordsToTons,
} from "./calculations";
import type { Facility, WasteRecord } from "../types";

describe("convertToTons", () => {
  it("converts pounds to tons at 2,000 lbs = 1 ton", () => {
    expect(convertToTons(2000, "lbs")).toBe(1);
    expect(convertToTons(1000, "lbs")).toBe(0.5);
  });

  it("passes tons through unchanged", () => {
    expect(convertToTons(65, "tons")).toBe(65);
  });
});

describe("sumWasteRecordsToTons", () => {
  it("sums mixed lbs/tons records into a single tons total", () => {
    const records: WasteRecord[] = [
      { id: "1", weight: "2000", unit: "lbs" },
      { id: "2", weight: "10", unit: "tons" },
    ];
    expect(sumWasteRecordsToTons(records)).toBe(11);
  });

  it("ignores invalid or non-positive entries rather than throwing", () => {
    const records: WasteRecord[] = [
      { id: "1", weight: "10", unit: "tons" },
      { id: "2", weight: "not-a-number", unit: "tons" },
      { id: "3", weight: "-5", unit: "tons" },
      { id: "4", weight: "0", unit: "tons" },
    ];
    expect(sumWasteRecordsToTons(records)).toBe(10);
  });
});

describe("getZipCentroid", () => {
  it("returns coordinates for a known RI zip", () => {
    expect(getZipCentroid("02886")).not.toBeNull();
  });

  it("returns null for a zip not in the lookup table", () => {
    expect(getZipCentroid("00000")).toBeNull();
  });
});

describe("findNearestFacility", () => {
  const facilities: Facility[] = [
    {
      facility_name: "Near",
      facility_type: "composting",
      address: "",
      latitude: 41.7,
      longitude: -71.4,
      contact_name: "",
      contact_phone: "",
      contact_email: "",
      accepted_materials: "",
      notes: "",
    },
    {
      facility_name: "Far",
      facility_type: "composting",
      address: "",
      latitude: 42.5,
      longitude: -72.5,
      contact_name: "",
      contact_phone: "",
      contact_email: "",
      accepted_materials: "",
      notes: "",
    },
  ];

  it("returns the closest facility by straight-line distance", () => {
    const result = findNearestFacility({ lat: 41.7, lon: -71.4 }, facilities);
    expect(result?.facility.facility_name).toBe("Near");
    expect(result?.distanceMiles).toBeCloseTo(0, 5);
  });

  it("returns null when given an empty facility list", () => {
    expect(findNearestFacility({ lat: 41.7, lon: -71.4 }, [])).toBeNull();
  });
});

describe("computeComplianceStatus", () => {
  it("is below when tonnage is under threshold, regardless of facility proximity", () => {
    expect(computeComplianceStatus(10, 30, true)).toBe("below");
    expect(computeComplianceStatus(10, 30, false)).toBe("below");
  });

  it("is comply when at/above threshold and a facility is within radius", () => {
    expect(computeComplianceStatus(30, 30, true)).toBe("comply");
    expect(computeComplianceStatus(65, 52, true)).toBe("comply");
  });

  it("is exempt when at/above threshold but no facility is within radius", () => {
    expect(computeComplianceStatus(120, 104, false)).toBe("exempt");
  });
});
