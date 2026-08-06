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
  onOpenImportantToKnow: () => void;
}

export default function ResultCard({
  submitted,
  onNavigateToHaulers,
  onOpenHowItWorks,
  onOpenImportantToKnow,
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

  function handleCalculateAnother() {
    const tonnageInput = document.getElementById("tonnage");
    tonnageInput?.scrollIntoView({ behavior: "smooth", block: "center" });
    (tonnageInput as HTMLInputElement | null)?.focus();
  }

  return (
    <div className="max-w-[640px] mx-auto mt-4 bg-surface-white border border-mist-gray rounded-xl shadow-sm p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-fog-gray uppercase tracking-wide mb-1">
            You entered
          </p>
          <p className="text-[15px] text-harbor-blue">
            {entityLabel} · Zip {submitted.zip} ·{" "}
            <span className="tabular-nums font-semibold">{formatTons(tonnage)}</span> per year
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="print:hidden shrink-0 text-xs text-bay-blue hover:text-harbor-blue underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
        >
          Print this result
        </button>
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
          voluntary={complianceStatus === "exempt"}
        />
      ) : null}

      <div className="space-y-2">
        <p className="text-xs font-semibold text-fog-gray uppercase tracking-wide">Your result</p>
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

        {complianceStatus === "below" ? (
          <p className="text-sm text-sea-glass bg-sea-glass/10 rounded-lg px-3 py-2">
            You are not currently required to divert food waste under this law — but any amount
            you choose to divert from the landfill still helps toward a positive climate impact.
          </p>
        ) : null}

        {complianceStatus === "comply" ? (
          <p className="text-sm text-fog-gray">
            An authorized facility is available within {FACILITY_SEARCH_RADIUS_MILES} miles — see
            the details below to start diverting food waste there. Facility capacity and
            operating status can change — confirm directly with the facility before relying on
            this result, especially for smaller-scale operations.
          </p>
        ) : null}

        {complianceStatus === "exempt" ? (
          <p className="text-xs text-slate-amber bg-slate-amber/10 rounded-lg px-3 py-2">
            This status may change if new authorized facilities open in your area. Re-check
            annually.
          </p>
        ) : null}

        {submitted.entityType === "higher_ed" && complianceStatus !== "below" ? (
          <p className="text-xs text-slate-amber bg-slate-amber/10 rounded-lg px-3 py-2">
            This 52-ton threshold is measured per building, not campus-wide.{" "}
            <button
              type="button"
              onClick={onOpenImportantToKnow}
              className="underline underline-offset-2 hover:text-harbor-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
            >
              See Important things to know
            </button>
            , as actual obligations may differ.
          </p>
        ) : null}

        {submitted.entityType === "higher_ed" || submitted.entityType === "other" ? (
          <p className="text-xs text-fog-gray">
            This entity category may also have a separate recordkeeping duty under state law,
            regardless of the result above.{" "}
            <button
              type="button"
              onClick={onOpenImportantToKnow}
              className="underline underline-offset-2 hover:text-harbor-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
            >
              See Important things to know
            </button>
            .
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
          <p className="text-sm text-fog-gray">
            {nearestFacility.facility.address}{" "}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                nearestFacility.facility.address
              )}`}
              target="_blank"
              rel="noreferrer"
              className="print:hidden text-bay-blue underline underline-offset-2 hover:text-harbor-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
            >
              Get directions ↗
            </a>
          </p>
          {nearestFacility.facility.contact_phone ? (
            <p className="text-sm text-fog-gray">
              Contact: {nearestFacility.facility.contact_phone}
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
            Straight-line distance, not driving distance —{" "}
            <button
              type="button"
              onClick={onOpenHowItWorks}
              className="underline underline-offset-2 hover:text-harbor-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
            >
              see How it works
            </button>
            .{" "}
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

      {complianceStatus === "comply" || complianceStatus === "exempt" ? (
        <div className="border-t border-mist-gray pt-4">
          <p className="text-sm font-bold text-harbor-blue mb-2">What to do next</p>
          <ol className="space-y-2 text-sm text-harbor-blue list-decimal list-inside">
            {complianceStatus === "comply" ? (
              <>
                <li>
                  Contact the nearest authorized facility directly to confirm they accept your
                  material and discuss delivery arrangements — whether you transport it yourself
                  or arrange collection through a hauler.
                </li>
                <li>
                  Don't have a way to transport it yourself? Browse the{" "}
                  <button
                    type="button"
                    onClick={onNavigateToHaulers}
                    className="underline underline-offset-2 hover:text-bay-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
                  >
                    Hauler Directory
                  </button>{" "}
                  for verified haulers who can handle pickup for you.
                </li>
              </>
            ) : (
              <>
                <li>
                  This isn't required, since no authorized facility is within 15 miles — but you
                  can still divert voluntarily. Browse the{" "}
                  <button
                    type="button"
                    onClick={onNavigateToHaulers}
                    className="underline underline-offset-2 hover:text-bay-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
                  >
                    Hauler Directory
                  </button>{" "}
                  for haulers who can bridge that distance gap for you.
                </li>
                <li>
                  Re-check this result periodically — your status may change if a new authorized
                  facility opens closer to you.
                </li>
              </>
            )}
          </ol>
        </div>
      ) : null}

      <div className="print:hidden border-t border-mist-gray pt-4">
        <button
          type="button"
          onClick={handleCalculateAnother}
          className="text-sm text-bay-blue hover:text-harbor-blue underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
        >
          Calculate another result
        </button>
        <p className="text-xs text-fog-gray mt-0.5">
          Update any field above and calculate again — your other entries will remain unchanged.
        </p>
      </div>

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
