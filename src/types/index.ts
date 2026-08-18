export type TabId = "calculator" | "haulers";

export type EntityType = "higher_ed" | "k12" | "other";

export type FacilityType = "composting" | "anaerobic_digestion" | "agricultural";

export interface Facility {
  facility_name: string;
  facility_type: FacilityType;
  address: string;
  latitude: number;
  longitude: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  accepted_materials: string;
  notes: string;
}

export interface CalculatorFormValues {
  entityType: EntityType | "";
  zip: string;
  tonnage: string;
  streetAddress: string;
  city: string;
}

export interface CalculatorFormErrors {
  entityType?: string;
  zip?: string;
  tonnage?: string;
  streetAddress?: string;
  city?: string;
}

export type ComplianceStatus = "below" | "comply" | "exempt";

export type LocationSource = "zip-centroid" | "exact-address";

export interface SubmittedCalculatorValues {
  entityType: EntityType;
  entityLabel: string;
  zip: string;
  originCoordinates: ZipCentroid;
  locationSource: LocationSource;
  geocodeNotice?: string;
  tonnage: number;
  threshold: number;
  complianceStatus: ComplianceStatus;
  nearestFacility: NearestFacilityResult | null;
  calculatedAt: string;
}

export interface ZipCentroid {
  lat: number;
  lon: number;
}

export interface NearestFacilityResult {
  facility: Facility;
  distanceMiles: number;
}

export interface HaulerListing {
  hauler_name: string;
  verified_service: string;
  service_area: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  /** When present, the website is shown as plain (non-clickable) text and
   *  this text is displayed as a caveat, instead of rendering a link. */
  websiteCaveat?: string;
}

export type WeightUnit = "lbs" | "tons";

export interface WasteRecord {
  id: string;
  weight: string;
  unit: WeightUnit;
}
