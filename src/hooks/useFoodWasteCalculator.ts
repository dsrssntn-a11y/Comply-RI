import { useState } from "react";
import { ENTITY_TYPE_OPTIONS } from "../lib/constants";
import { validateEntityType, validateTonnage, validateZip } from "../lib/validation";
import { computeComplianceStatus, findNearestFacility, getZipCentroid } from "../lib/calculations";
import { FACILITIES } from "../data/facilities";
import { isWithinServiceRadius } from "../data/facilityRules";
import { ENTITY_THRESHOLDS } from "../data/thresholds";
import type {
  CalculatorFormErrors,
  CalculatorFormValues,
  EntityType,
  SubmittedCalculatorValues,
} from "../types";

const INITIAL_VALUES: CalculatorFormValues = {
  entityType: "",
  zip: "",
  tonnage: "",
};

export function useFoodWasteCalculator() {
  const [values, setValues] = useState<CalculatorFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<CalculatorFormErrors>({});
  const [submitted, setSubmitted] = useState<SubmittedCalculatorValues | null>(null);

  function setField<K extends keyof CalculatorFormValues>(field: K, value: CalculatorFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    const entityTypeResult = validateEntityType(values.entityType);
    const zipResult = validateZip(values.zip);
    const tonnageResult = validateTonnage(values.tonnage);

    const nextErrors: CalculatorFormErrors = {
      entityType: entityTypeResult.error,
      zip: zipResult.error,
      tonnage: tonnageResult.error,
    };

    const zip = values.zip.trim();
    const centroid = zipResult.valid ? getZipCentroid(zip) : null;
    if (zipResult.valid && !centroid) {
      nextErrors.zip = "This zip code isn't in our RI lookup table. Verify and try again.";
    }

    setErrors(nextErrors);

    if (!entityTypeResult.valid || !tonnageResult.valid || !zipResult.valid || !centroid) {
      setSubmitted(null);
      return;
    }

    const entityType = values.entityType as EntityType;
    const entityLabel =
      ENTITY_TYPE_OPTIONS.find((option) => option.value === entityType)?.label ?? "";
    const tonnage = Number(values.tonnage);
    const threshold = ENTITY_THRESHOLDS[entityType];
    const nearestFacility = findNearestFacility(centroid, FACILITIES);
    const facilityWithinRadius = nearestFacility
      ? isWithinServiceRadius(nearestFacility.distanceMiles)
      : false;

    setSubmitted({
      entityType,
      entityLabel,
      zip,
      zipCentroid: centroid,
      tonnage,
      threshold,
      complianceStatus: computeComplianceStatus(tonnage, threshold, facilityWithinRadius),
      nearestFacility,
    });
  }

  return { values, errors, submitted, setField, handleSubmit };
}
