import { ENTITY_TYPE_OPTIONS } from "../lib/constants";
import { ENTITY_THRESHOLDS } from "../data/thresholds";
import { FACILITY_SEARCH_RADIUS_MILES } from "../data/facilityRules";

interface HowItWorksProps {
  open: boolean;
  onClose: () => void;
}

export default function HowItWorks({ open, onClose }: HowItWorksProps) {
  if (!open) return null;

  return (
    <div
      id="how-it-works-panel"
      className="max-w-[640px] mx-auto mb-6 bg-surface-white border border-mist-gray rounded-xl p-5 text-sm text-fog-gray space-y-4"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-harbor-blue text-sm">How this was calculated</span>
        <button
          type="button"
          onClick={onClose}
          className="text-fog-gray hover:text-harbor-blue text-xs underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
        >
          Close
        </button>
      </div>

      <div>
        <p className="text-xs font-semibold text-harbor-blue uppercase tracking-wide mb-1">
          Getting to an annual tons figure
        </p>
        <p className="mb-2">
          You can enter your annual tonnage directly if you already know it — no conversion is
          applied in that case.
        </p>
        <p>
          If you're working from raw waste tracking records instead (e.g. pickup weigh tickets
          logged over the year), use the "Calculate it from waste tracking records" option below
          the tonnage field. The tool takes every weight you enter, converts any pounds to tons at{" "}
          <span className="font-semibold text-harbor-blue">2,000 lbs = 1 ton</span>, and sums all
          of them into a single annual total. That sum is what gets compared against your
          threshold below — no manual unit conversion or addition required.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold text-harbor-blue uppercase tracking-wide mb-1">
          Annualization
        </p>
        <p>
          Whichever way you enter it, the resulting figure is treated as your total for a full
          year. The tool does not extrapolate from partial-year or monthly figures — enter (or
          record) your complete annual total.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold text-harbor-blue uppercase tracking-wide mb-1">
          Threshold rule applied
        </p>
        <p className="mb-2">
          Your entered tonnage is compared against the statutory annual threshold for your entity
          type:
        </p>
        <ul className="space-y-0.5">
          {ENTITY_TYPE_OPTIONS.map((option) => (
            <li key={option.value} className="tabular-nums">
              <span className="font-semibold text-harbor-blue">
                {ENTITY_THRESHOLDS[option.value]} tons/year
              </span>{" "}
              — {option.label}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-semibold text-harbor-blue uppercase tracking-wide mb-1">
          Tipping-fee waiver
        </p>
        <p>
          Entities in the higher-education (52-ton) or all-other-generators (104-ton) categories
          may also qualify for a separate waiver under{" "}
          <a
            href="https://webserver.rilegislature.gov/Statutes/TITLE23/23-18.9/23-18.9-17.htm"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-bay-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
          >
            § 23-18.9-17(c)
          </a>{" "}
          if the tipping fee RIRRC charges for regular commercial waste is lower than the fee
          charged by every composting or anaerobic digestion facility within 15 miles — the
          director must grant the waiver upon that showing. This tool can't calculate that,
          since tipping-fee data isn't publicly compiled; contact RIDEM directly to inquire. This
          waiver does not apply to the K–12 / educational-entity (30-ton) category.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold text-harbor-blue uppercase tracking-wide mb-1">
          15-mile facility condition
        </p>
        <p>
          If you're at or above your threshold, the tool measures the straight-line ("as the crow
          flies") distance from your zip code to every authorized facility using the haversine
          formula — not driving distance. If no facility is within{" "}
          {FACILITY_SEARCH_RADIUS_MILES} miles, the tool reports that no authorized facility is
          within that radius — reflecting the 15-mile condition set out in the statute.
        </p>
      </div>

      <div className="border-t border-mist-gray pt-3">
        <p className="text-xs font-semibold text-harbor-blue uppercase tracking-wide mb-1">
          Statutory source
        </p>
        <p>
          R.I. Gen. Laws{" "}
          <a
            href="https://webserver.rilegislature.gov/Statutes/TITLE23/23-18.9/23-18.9-17.htm"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-bay-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
          >
            § 23-18.9-17
          </a>
        </p>
      </div>
    </div>
  );
}
