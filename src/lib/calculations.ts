import { haversineDistance } from "./haversine";
import { RI_ZIP_CENTROIDS } from "../data/zipCentroids";
import type {
  ComplianceStatus,
  Facility,
  NearestFacilityResult,
  WasteRecord,
  WeightUnit,
  ZipCentroid,
} from "../types";

const POUNDS_PER_TON = 2000;

export function convertToTons(weight: number, unit: WeightUnit): number {
  return unit === "lbs" ? weight / POUNDS_PER_TON : weight;
}

export function sumWasteRecordsToTons(records: WasteRecord[]): number {
  return records.reduce((total, record) => {
    const weight = Number(record.weight);
    if (!Number.isFinite(weight) || weight <= 0) return total;
    return total + convertToTons(weight, record.unit);
  }, 0);
}

export function getZipCentroid(zip: string): ZipCentroid | null {
  return RI_ZIP_CENTROIDS[zip] ?? null;
}

export function findNearestFacility(
  origin: ZipCentroid,
  facilities: Facility[]
): NearestFacilityResult | null {
  if (facilities.length === 0) return null;

  let nearest: NearestFacilityResult | null = null;
  for (const facility of facilities) {
    const distanceMiles = haversineDistance(
      origin.lat,
      origin.lon,
      facility.latitude,
      facility.longitude
    );
    if (!nearest || distanceMiles < nearest.distanceMiles) {
      nearest = { facility, distanceMiles };
    }
  }
  return nearest;
}

export function computeComplianceStatus(
  tonnage: number,
  threshold: number,
  facilityWithinRadius: boolean
): ComplianceStatus {
  if (tonnage < threshold) return "below";
  return facilityWithinRadius ? "comply" : "exempt";
}
