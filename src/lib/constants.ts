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
