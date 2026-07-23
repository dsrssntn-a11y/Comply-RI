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
  notes: string;
}

export interface CalculatorFormValues {
  entityType: EntityType | "";
  zip: string;
  tonnage: string;
}

export interface CalculatorFormErrors {
  entityType?: string;
  zip?: string;
  tonnage?: string;
}

export type ComplianceStatus = "below" | "comply" | "exempt";

export interface SubmittedCalculatorValues {
  entityType: EntityType;
  entityLabel: string;
  zip: string;
  tonnage: number;
  threshold: number;
  complianceStatus: ComplianceStatus;
  nearestFacility: NearestFacilityResult | null;
}

export interface NearestFacilityResult {
  facility: Facility;
  distanceMiles: number;
}
