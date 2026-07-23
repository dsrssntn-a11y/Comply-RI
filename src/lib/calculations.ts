import { haversineDistance } from "./haversine";
import { RI_ZIP_CENTROIDS, type ZipCentroid } from "../data/zipCentroids";
import type { ComplianceStatus, Facility, NearestFacilityResult } from "../types";

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
