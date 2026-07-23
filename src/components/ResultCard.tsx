import Disclaimer from "./Disclaimer";
import ThresholdBadge from "./ThresholdBadge";
import { formatTons } from "../lib/formatters";
import { FACILITY_SEARCH_RADIUS_MILES } from "../data/facilityRules";
import type { SubmittedCalculatorValues } from "../types";

interface ResultCardProps {
  submitted: SubmittedCalculatorValues;
}

export default function ResultCard({ submitted }: ResultCardProps) {
  const { nearestFacility, complianceStatus, tonnage, threshold, entityLabel } = submitted;
  const withinRadius = complianceStatus === "comply";
  const showFacility = complianceStatus !== "below" && nearestFacility;

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

        {complianceStatus === "below" ? (
          <p className="text-sm text-fog-gray">
            Below Threshold. Not currently required to comply.
          </p>
        ) : null}

        {complianceStatus === "comply" ? (
          <p className="text-sm text-fog-gray">
            Above Threshold. Required to comply — see the nearest authorized facility below.
          </p>
        ) : null}

        {complianceStatus === "exempt" ? (
          <p className="text-sm text-fog-gray">
            Above Threshold — Exempt. No authorized facility is within{" "}
            {FACILITY_SEARCH_RADIUS_MILES} miles, so the statutory 15-mile exemption applies.
            This is an intentional provision of the law, not a loophole.
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
        </div>
      ) : null}

      <Disclaimer variant="output" />
    </div>
  );
}
