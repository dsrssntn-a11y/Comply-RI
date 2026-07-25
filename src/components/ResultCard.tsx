import { useEffect, useState } from "react";
import Disclaimer from "./Disclaimer";
import ThresholdBadge from "./ThresholdBadge";
import ImpactCallout from "./ImpactCallout";
import FacilityMap from "./FacilityMap";
import HaulerSuggestionModal from "./HaulerSuggestionModal";
import WaiverNoticeModal from "./WaiverNoticeModal";
import { formatTons } from "../lib/formatters";
import { FACILITY_SEARCH_RADIUS_MILES } from "../data/facilityRules";
import type { SubmittedCalculatorValues } from "../types";

interface ResultCardProps {
  submitted: SubmittedCalculatorValues;
  onNavigateToHaulers: () => void;
  onOpenHowItWorks: () => void;
}

export default function ResultCard({
  submitted,
  onNavigateToHaulers,
  onOpenHowItWorks,
}: ResultCardProps) {
  const {
    nearestFacility,
    complianceStatus,
    tonnage,
    threshold,
    entityLabel,
    originCoordinates,
    locationSource,
    geocodeNotice,
  } = submitted;
  const withinRadius = complianceStatus === "comply";
  const showFacility = complianceStatus !== "below" && nearestFacility;
  const waiverEligible =
    complianceStatus === "comply" &&
    (submitted.entityType === "higher_ed" || submitted.entityType === "other");

  const [showHaulerPopup, setShowHaulerPopup] = useState(complianceStatus === "exempt");
  useEffect(() => {
    setShowHaulerPopup(complianceStatus === "exempt");
  }, [submitted, complianceStatus]);

  const [showWaiverPopup, setShowWaiverPopup] = useState(waiverEligible);
  useEffect(() => {
    setShowWaiverPopup(waiverEligible);
  }, [submitted, waiverEligible]);

  return (
    <div className="max-w-[640px] mx-auto mt-4 bg-surface-white border border-mist-gray rounded-xl shadow-sm p-6 space-y-4">
      <div>
        <p className="text-xs font-semibold text-fog-gray uppercase tracking-wide mb-1">
          You entered
        </p>
        <p className="text-[15px] text-harbor-blue">
          {entityLabel} · Zip {submitted.zip} ·{" "}
          <span className="tabular-nums font-semibold">{formatTons(tonnage)}</span> per year
        </p>
      </div>

      {geocodeNotice ? (
        <p className="text-xs text-slate-amber bg-slate-amber/10 rounded-lg px-3 py-2">
          {geocodeNotice}
        </p>
      ) : null}

      {complianceStatus !== "below" ? (
        <ImpactCallout
          key={`${submitted.zip}-${submitted.tonnage}-${submitted.entityType}`}
          tonnage={tonnage}
          shareable={complianceStatus === "comply"}
        />
      ) : null}

      <div className="space-y-2">
        <ThresholdBadge status={complianceStatus} />

        <p className="text-xs text-fog-gray">
          Formula: entered annual tonnage compared against the statutory threshold for your
          entity type.
        </p>

        <p className="text-sm text-harbor-blue tabular-nums">
          <span className="font-semibold">{formatTons(tonnage)}</span> entered{" "}
          {tonnage >= threshold ? "meets or exceeds" : "is below"} the{" "}
          <span className="font-semibold">{formatTons(threshold)}</span> threshold for{" "}
          {entityLabel}.
        </p>

        {complianceStatus === "comply" ? (
          <p className="text-sm text-fog-gray">
            An authorized facility is available within {FACILITY_SEARCH_RADIUS_MILES} miles — see
            the details below to start diverting food waste there.
          </p>
        ) : null}
      </div>

      {showFacility && nearestFacility ? (
        <div>
          <p className="text-xs font-semibold text-fog-gray uppercase tracking-wide mb-1">
            Nearest authorized facility ({FACILITY_SEARCH_RADIUS_MILES}-mile straight-line check)
          </p>
          <p className="text-[15px] text-harbor-blue font-semibold">
            {nearestFacility.facility.facility_name}
          </p>
          <p className="text-sm text-fog-gray">{nearestFacility.facility.address}</p>
          {nearestFacility.facility.contact_name ? (
            <p className="text-sm text-fog-gray">
              Contact: {nearestFacility.facility.contact_name}
              {nearestFacility.facility.contact_phone
                ? ` · ${nearestFacility.facility.contact_phone}`
                : ""}
            </p>
          ) : null}
          <p className="text-sm mt-1 tabular-nums">
            <span className="font-semibold text-harbor-blue">
              {nearestFacility.distanceMiles.toFixed(1)} miles
            </span>{" "}
            <span className={withinRadius ? "text-sea-glass" : "text-slate-amber"}>
              ({withinRadius ? "within" : "outside"} the {FACILITY_SEARCH_RADIUS_MILES}-mile
              radius)
            </span>
          </p>
          <p className="text-xs text-fog-gray mt-0.5">
            Measured as straight-line distance ("as the crow flies"), as the law requires — not
            driving distance, so a map app will likely show a different number.{" "}
            {locationSource === "exact-address"
              ? "This result uses your exact address."
              : "This result uses your zip code's center point as an estimate of your location — for a more precise result, enter your exact address above."}
          </p>

          <div className="mt-3">
            <FacilityMap
              userLat={originCoordinates.lat}
              userLon={originCoordinates.lon}
              userZip={submitted.zip}
              facilityLat={nearestFacility.facility.latitude}
              facilityLon={nearestFacility.facility.longitude}
              facilityName={nearestFacility.facility.facility_name}
            />
          </div>
        </div>
      ) : null}

      <Disclaimer variant="output" />

      <HaulerSuggestionModal
        open={showHaulerPopup}
        onDismiss={() => setShowHaulerPopup(false)}
        onViewHaulers={() => {
          setShowHaulerPopup(false);
          onNavigateToHaulers();
        }}
      />

      <WaiverNoticeModal
        open={showWaiverPopup}
        onDismiss={() => setShowWaiverPopup(false)}
        onCheckWaiverPath={() => {
          setShowWaiverPopup(false);
          onOpenHowItWorks();
        }}
      />
    </div>
  );
}
