interface ImportantToKnowProps {
  open: boolean;
  onClose: () => void;
}

export default function ImportantToKnow({ open, onClose }: ImportantToKnowProps) {
  if (!open) return null;

  return (
    <div
      id="important-to-know-panel"
      className="max-w-[640px] mx-auto mb-6 bg-surface-white border border-mist-gray rounded-xl p-5 text-sm text-fog-gray space-y-4"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-harbor-blue text-sm">Important things to know</span>
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
          Higher-ed: the 52-ton threshold is measured per building, not campus-wide
        </p>
        <p className="mb-2">
          For higher-education/research institutions, state law measures the 52-ton threshold
          against each "covered educational facility" — a single building or group of
          interconnected buildings — not your institution's total organic waste across all
          buildings (R.I. Gen. Laws § 23-18.9-17(b); § 23-18.9-7(21)).
        </p>
        <p>
          This calculator asks for one tonnage figure and compares it directly to 52 tons. If your
          entered number is an aggregate across multiple separate (non-interconnected) buildings,
          your actual obligation may differ building by building — a campus-wide total above 52
          tons doesn't necessarily mean every building is individually obligated, and a total under
          52 tons doesn't rule out one large building being obligated on its own. For an exact
          result, run the calculator once per qualifying building or interconnected group instead
          of entering a campus-wide total.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold text-harbor-blue uppercase tracking-wide mb-1">
          Separate recordkeeping requirement
        </p>
        <p>
          Independent of the diversion requirement this tool checks, covered entities and covered
          educational institutions — the commercial/institutional and higher-ed categories, not
          K–12 — must also keep a written record of the solid waste they generate and the organic
          waste they recycle, and make those records available to RIDEM upon request (
          <a
            href="https://webserver.rilegislature.gov/Statutes/TITLE23/23-18.9/23-18.9-18.htm"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-bay-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
          >
            R.I. Gen. Laws § 23-18.9-18
          </a>
          ). This applies regardless of whether the diversion requirement above turns out to apply
          to you. This tool doesn't track or generate those records — it only estimates whether the
          diversion requirement applies.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold text-harbor-blue uppercase tracking-wide mb-1">
          Who exactly is covered
        </p>
        <p>
          Each entity category is defined by specific statutory language, not general description —
          see "See exact legal definitions for each category" on the calculator's entity-type field
          for the full text of each definition, including the enumerated list of business and
          institution types that qualify as a "covered entity."
        </p>
      </div>
    </div>
  );
}
