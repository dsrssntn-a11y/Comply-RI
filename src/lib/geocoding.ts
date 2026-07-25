export interface GeocodeResult {
  lat: number;
  lon: number;
  matchedAddress: string;
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

// Nominatim (OpenStreetMap) — free, no API key, and supports CORS for direct
// browser requests, unlike the Census Geocoder. Public-instance usage policy
// caps this at ~1 request/second, which a manual "one geocode per Calculate
// click" flow satisfies by construction. See RhodeWaste_Maintenance_Notes.md
// for the full writeup on this dependency.
export async function geocodeAddress(
  street: string,
  city: string,
  zip: string
): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({
    street,
    city,
    state: "RI",
    postalcode: zip,
    country: "USA",
    format: "json",
    limit: "1",
  });

  const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Geocoding service unavailable");
  }

  const data = await response.json();
  const match = Array.isArray(data) ? data[0] : undefined;
  if (!match) return null;

  const lat = Number(match.lat);
  const lon = Number(match.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  return { lat, lon, matchedAddress: match.display_name };
}
