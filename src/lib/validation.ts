import { RI_ZIP_MAX, RI_ZIP_MIN } from "./constants";
import type { EntityType } from "../types";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateZip(zip: string): ValidationResult {
  if (!/^\d{5}$/.test(zip.trim())) {
    return { valid: false, error: "Enter a 5-digit zip code." };
  }
  const numeric = Number(zip);
  if (numeric < RI_ZIP_MIN || numeric > RI_ZIP_MAX) {
    return { valid: false, error: "Enter a Rhode Island zip code (02800–02940)." };
  }
  return { valid: true };
}

export function validateTonnage(tonnage: string): ValidationResult {
  if (tonnage.trim() === "") {
    return { valid: false, error: "Enter your estimated annual tonnage." };
  }
  const numeric = Number(tonnage);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return { valid: false, error: "Tonnage must be a positive number." };
  }
  return { valid: true };
}

export function validateEntityType(entityType: string): ValidationResult {
  const valid: EntityType[] = ["higher_ed", "k12", "other"];
  if (!valid.includes(entityType as EntityType)) {
    return { valid: false, error: "Select an entity type." };
  }
  return { valid: true };
}

export function validateStreetAddress(streetAddress: string): ValidationResult {
  if (streetAddress.trim() === "") {
    return { valid: false, error: "Enter a street address." };
  }
  return { valid: true };
}

export function validateCity(city: string): ValidationResult {
  if (city.trim() === "") {
    return { valid: false, error: "Enter a city or town." };
  }
  return { valid: true };
}
