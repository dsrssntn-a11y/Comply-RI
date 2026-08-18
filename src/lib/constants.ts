import type { EntityType } from "../types";

export interface EntityTypeOption {
  value: EntityType;
  label: string;
}

export const ENTITY_TYPE_OPTIONS: EntityTypeOption[] = [
  { value: "higher_ed", label: "Higher education / research institution" },
  { value: "k12", label: "Other educational entity (K–12)" },
  { value: "other", label: "Commercial or institutional entity" },
];

export const RI_ZIP_MIN = 2800;
export const RI_ZIP_MAX = 2940;

// Update these at each quarterly/monthly data recheck (see
// RhodeWaste_Maintenance_Notes.md "Scheduled Maintenance Checks") — used by
// both Footer.tsx and the printable result summary in Disclaimer.tsx.
export const FACILITY_DATA_VERIFIED = "August 2026";
export const HAULER_DIRECTORY_VERIFIED = "July 2026";
