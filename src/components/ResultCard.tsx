import { useEffect, useState } from "react";
import Disclaimer from "./Disclaimer";
import ThresholdBadge from "./ThresholdBadge";
import ImpactCallout from "./ImpactCallout";
import FacilityMap from "./FacilityMap";
import HaulerSuggestionModal from "./HaulerSuggestionModal";
import WaiverNoticeModal from "./WaiverNoticeModal";
import { formatCalculatedDate, formatTons } from "../lib/formatters";
import { FACILITY_SEARCH_RADIUS_MILES } from "../data/facilityRules";
import type { Facility, SubmittedCalculatorValues } from "../types";

const FACILITY_TYPE_LABELS: Record<Facility["facility_type"], string> = {
  composting: "Composting facility",
  anaerobic_digestion: "Anaerobic digestion facility",
  agricultural: "Agricultural composting facility",
};

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
    calculatedAt,
  } = submitted;
  const withinRadius = complianceStatus === "comply";
  const showFacility = complianceStatus !== "below" && nearestFacility;
  const thresholdDelta = Math.abs(tonnage - threshold);
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
          <p className="text-xs text-fog-gray mt-0.5">
            Calculated {formatCalculatedDate(calculatedAt)}
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
          {tonnage === threshold ? "meets" : tonnage > threshold ? "exceeds" : "is below"} the{" "}
          <span className="font-semibold">{formatTons(threshold)}</span> threshold for{" "}
          {entityLabel}
          {tonnage === threshold ? (
            " exactly."
          ) : (
            <>
              {" "}
              by <span className="font-semibold">{formatTons(thresholdDelta)}</span>.
            </>
          )}
        </p>

        {complianceStatus === "below" ? (
          <p className="text-sm text-sea-glass bg-sea-glass/10 rounded-lg px-3 py-2">
            Based on the tonnage you entered, this result is below the threshold that would
            require diversion under this law — but any amount you choose to divert from the
            landfill still helps toward a positive climate impact.
          </p>
        ) : null}

        {complianceStatus === "comply" ? (
          <p className="text-sm text-fog-gray">
            An authorized facility is available within {FACILITY_SEARCH_RADIUS_MILES} miles — see
            the details below to start diverting food waste there.
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
          <p className="text-sm text-fog-gray">
            Type: {FACILITY_TYPE_LABELS[nearestFacility.facility.facility_type]} · Accepted
            materials: {nearestFacility.facility.accepted_materials}
          </p>
          <p className="text-xs text-slate-amber bg-slate-amber/10 rounded-lg px-2.5 py-1.5 mt-1.5">
            A facility type or materials listing alone doesn't guarantee it currently accepts
            food waste or has available capacity — operating status can change, especially for
            smaller-scale operations. Confirm directly with the facility, and with RIDEM if
            needed, before relying on this result.
          </p>
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

      {complianceStatus === "comply" || complianceStatus === "exempt" || complianceStatus === "below" ? (
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
            ) : complianceStatus === "exempt" ? (
              <>
                <li>
                  No authorized facility falls within the statute's 15-mile distance condition
                  for the location entered — but you can still divert voluntarily. Browse the{" "}
                  <button
                    type="button"
                    onClick={onNavigateToHaulers}
                    className="underline underline-offset-2 hover:text-bay-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
                  >
                    Hauler Directory
                  </button>{" "}
                  for haulers who can transport material to a facility farther away.
                </li>
                <li>
                  Re-check this result periodically — your status may change if a new authorized
                  facility opens closer to you.
                </li>
              </>
            ) : (
              <>
                <li>
                  Based on the tonnage you entered, this result is below the{" "}
                  {formatTons(threshold)} threshold for {entityLabel} — but you can still divert
                  voluntarily. Browse the{" "}
                  <button
                    type="button"
                    onClick={onNavigateToHaulers}
                    className="underline underline-offset-2 hover:text-bay-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
                  >
                    Hauler Directory
                  </button>{" "}
                  for haulers who can help.
                </li>
                <li>
                  Re-check this result if your tonnage grows — you may cross the threshold in a
                  future year.
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
