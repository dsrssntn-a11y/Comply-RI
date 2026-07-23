// Statutory 15-mile straight-line condition, R.I. Gen. Laws § 23-18.9-17.
export const FACILITY_SEARCH_RADIUS_MILES = 15;

export function isWithinServiceRadius(distanceMiles: number): boolean {
  return distanceMiles <= FACILITY_SEARCH_RADIUS_MILES;
}
