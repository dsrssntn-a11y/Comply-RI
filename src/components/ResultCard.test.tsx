import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ResultCard from "./ResultCard";
import type { Facility, SubmittedCalculatorValues } from "../types";

// FacilityMap renders a real Leaflet map, which needs real browser layout —
// not something jsdom provides. These tests only care about which notices
// render, so the map itself is stubbed out.
vi.mock("./FacilityMap", () => ({
  default: () => null,
}));

const FACILITY: Facility = {
  facility_name: "Rhode Island Bioenergy Facility (ORBIT)",
  facility_type: "anaerobic_digestion",
  address: "289 Scituate Ave, Johnston, RI 02919",
  latitude: 41.8,
  longitude: -71.5,
  contact_name: "",
  contact_phone: "",
  contact_email: "",
  accepted_materials: "",
  notes: "",
};

function buildSubmitted(
  overrides: Partial<SubmittedCalculatorValues>
): SubmittedCalculatorValues {
  return {
    entityType: "higher_ed",
    entityLabel: "Higher education / research institution",
    zip: "02886",
    originCoordinates: { lat: 41.7, lon: -71.4 },
    locationSource: "zip-centroid",
    tonnage: 65,
    threshold: 52,
    complianceStatus: "comply",
    nearestFacility: { facility: FACILITY, distanceMiles: 7.7 },
    ...overrides,
  };
}

const noop = () => {};

function renderResultCard(overrides: Partial<SubmittedCalculatorValues>) {
  render(
    <ResultCard
      submitted={buildSubmitted(overrides)}
      onNavigateToHaulers={noop}
      onOpenHowItWorks={noop}
      onOpenImportantToKnow={noop}
    />
  );
}

const PER_BUILDING_TEXT = /measured per building, not campus-wide/i;
const RECORDKEEPING_TEXT = /separate recordkeeping duty/i;
const EXEMPT_STALENESS_TEXT = /this status may change if new authorized facilities open/i;

describe("ResultCard notice visibility", () => {
  it("shows the per-building and recordkeeping notices for higher-ed comply", () => {
    renderResultCard({ entityType: "higher_ed", complianceStatus: "comply" });
    expect(screen.getByText(PER_BUILDING_TEXT)).toBeInTheDocument();
    expect(screen.getByText(RECORDKEEPING_TEXT)).toBeInTheDocument();
    expect(screen.queryByText(EXEMPT_STALENESS_TEXT)).not.toBeInTheDocument();
  });

  it("shows all three notices for higher-ed exempt", () => {
    renderResultCard({
      entityType: "higher_ed",
      complianceStatus: "exempt",
      nearestFacility: { facility: FACILITY, distanceMiles: 18.9 },
    });
    expect(screen.getByText(PER_BUILDING_TEXT)).toBeInTheDocument();
    expect(screen.getByText(RECORDKEEPING_TEXT)).toBeInTheDocument();
    expect(screen.getByText(EXEMPT_STALENESS_TEXT)).toBeInTheDocument();
  });

  it("hides the per-building notice for higher-ed below threshold, but still shows recordkeeping", () => {
    renderResultCard({
      entityType: "higher_ed",
      complianceStatus: "below",
      tonnage: 10,
      nearestFacility: null,
    });
    expect(screen.queryByText(PER_BUILDING_TEXT)).not.toBeInTheDocument();
    expect(screen.getByText(RECORDKEEPING_TEXT)).toBeInTheDocument();
  });

  it("shows recordkeeping but never the per-building notice for the commercial/institutional category", () => {
    renderResultCard({
      entityType: "other",
      entityLabel: "Commercial or institutional entity",
      complianceStatus: "comply",
      tonnage: 120,
      threshold: 104,
    });
    expect(screen.queryByText(PER_BUILDING_TEXT)).not.toBeInTheDocument();
    expect(screen.getByText(RECORDKEEPING_TEXT)).toBeInTheDocument();
  });

  it("shows neither per-building nor recordkeeping notices for K-12", () => {
    renderResultCard({
      entityType: "k12",
      entityLabel: "Other educational entity (K–12)",
      complianceStatus: "comply",
      tonnage: 35,
      threshold: 30,
    });
    expect(screen.queryByText(PER_BUILDING_TEXT)).not.toBeInTheDocument();
    expect(screen.queryByText(RECORDKEEPING_TEXT)).not.toBeInTheDocument();
  });

  it("still shows the exempt-staleness notice for K-12, since it isn't entity-type-gated", () => {
    renderResultCard({
      entityType: "k12",
      entityLabel: "Other educational entity (K–12)",
      complianceStatus: "exempt",
      tonnage: 35,
      threshold: 30,
      nearestFacility: { facility: FACILITY, distanceMiles: 18.9 },
    });
    expect(screen.getByText(EXEMPT_STALENESS_TEXT)).toBeInTheDocument();
    expect(screen.queryByText(PER_BUILDING_TEXT)).not.toBeInTheDocument();
    expect(screen.queryByText(RECORDKEEPING_TEXT)).not.toBeInTheDocument();
  });

  it("shows the geocode notice only when one is present on the result", () => {
    renderResultCard({ geocodeNotice: "We couldn't find that address." });
    expect(screen.getByText("We couldn't find that address.")).toBeInTheDocument();
  });

  it("omits the geocode notice when none is present", () => {
    renderResultCard({});
    expect(screen.queryByText(/we couldn't find that address/i)).not.toBeInTheDocument();
  });
});
