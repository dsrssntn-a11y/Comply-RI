import { useState } from "react";
import { ENTITY_TYPE_OPTIONS } from "../lib/constants";
import {
  validateCity,
  validateEntityType,
  validateStreetAddress,
  validateTonnage,
  validateZip,
} from "../lib/validation";
import { computeComplianceStatus, findNearestFacility, getZipCentroid } from "../lib/calculations";
import { geocodeAddress } from "../lib/geocoding";
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
  streetAddress: "",
  city: "",
};

export function useFoodWasteCalculator() {
  const [values, setValues] = useState<CalculatorFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<CalculatorFormErrors>({});
  const [submitted, setSubmitted] = useState<SubmittedCalculatorValues | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  function setField<K extends keyof CalculatorFormValues>(field: K, value: CalculatorFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(useExactAddress: boolean) {
    const entityTypeResult = validateEntityType(values.entityType);
    const zipResult = validateZip(values.zip);
    const tonnageResult = validateTonnage(values.tonnage);
    const streetAddress = values.streetAddress.trim();
    const city = values.city.trim();
    const streetResult = useExactAddress
      ? validateStreetAddress(streetAddress)
      : { valid: true as const };
    const cityResult = useExactAddress ? validateCity(city) : { valid: true as const };

    const nextErrors: CalculatorFormErrors = {
      entityType: entityTypeResult.error,
      zip: zipResult.error,
      tonnage: tonnageResult.error,
      streetAddress: streetResult.error,
      city: cityResult.error,
    };

    const zip = values.zip.trim();
    const zipCentroidPoint = zipResult.valid ? getZipCentroid(zip) : null;
    if (zipResult.valid && !zipCentroidPoint) {
      nextErrors.zip = "This zip code isn't in our RI lookup table. Verify and try again.";
    }

    setErrors(nextErrors);

    if (
      !entityTypeResult.valid ||
      !tonnageResult.valid ||
      !zipResult.valid ||
      !zipCentroidPoint ||
      !streetResult.valid ||
      !cityResult.valid
    ) {
      setSubmitted(null);
      return;
    }

    let originCoordinates = zipCentroidPoint;
    let locationSource: SubmittedCalculatorValues["locationSource"] = "zip-centroid";
    let geocodeNotice: string | undefined;

    if (useExactAddress) {
      setIsGeocoding(true);
      try {
        const geocoded = await geocodeAddress(streetAddress, city, zip);
        if (geocoded) {
          originCoordinates = { lat: geocoded.lat, lon: geocoded.lon };
          locationSource = "exact-address";
        } else {
          geocodeNotice =
            "We couldn't find that address, so this result uses your zip code's center point instead.";
        }
      } catch {
        geocodeNotice =
          "The address lookup service is unavailable right now, so this result uses your zip code's center point instead.";
      } finally {
        setIsGeocoding(false);
      }
    }

    const entityType = values.entityType as EntityType;
    const entityLabel =
      ENTITY_TYPE_OPTIONS.find((option) => option.value === entityType)?.label ?? "";
    const tonnage = Number(values.tonnage);
    const threshold = ENTITY_THRESHOLDS[entityType];
    const nearestFacility = findNearestFacility(originCoordinates, FACILITIES);
    const facilityWithinRadius = nearestFacility
      ? isWithinServiceRadius(nearestFacility.distanceMiles)
      : false;

    setSubmitted({
      entityType,
      entityLabel,
      zip,
      originCoordinates,
      locationSource,
      geocodeNotice,
      tonnage,
      threshold,
      complianceStatus: computeComplianceStatus(tonnage, threshold, facilityWithinRadius),
      nearestFacility,
      calculatedAt: new Date().toISOString(),
    });
  }

  return { values, errors, submitted, isGeocoding, setField, handleSubmit };
}
