import { useState } from "react";

interface ContextBannerProps {
  onOpenEntityDefinitions: () => void;
}

export default function ContextBanner({ onOpenEntityDefinitions }: ContextBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mt-3 mb-1 rounded-xl border border-mist-gray border-l-4 border-l-bay-blue bg-cloud-white overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          aria-controls="context-banner-body"
          className="flex-1 flex items-center gap-2 text-left bg-transparent border-0 p-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
        >
          <span className="text-sm font-semibold text-bay-blue">
            What's Rhode Island's Commercial Food Waste Ban? Does it apply to you?
          </span>
          <span
            aria-hidden="true"
            className={`shrink-0 text-bay-blue transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss this message"
          className="shrink-0 text-fog-gray hover:text-harbor-blue text-sm px-1.5 py-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50"
        >
          ✕
        </button>
      </div>

      {expanded ? (
        <div
          id="context-banner-body"
          className="border-t border-mist-gray px-4 pb-4 pt-3 space-y-3"
        >
          <p className="text-sm text-harbor-blue leading-relaxed">
            Rhode Island's Commercial Food Waste Ban requires certain organizations to divert
            food waste away from landfills and toward authorized composting or anaerobic
            digestion facilities. It went into effect in stages starting in 2016, with the most
            recent thresholds active since 2023.
          </p>
          <p className="text-sm text-harbor-blue leading-relaxed">
            If your organization generates enough food waste and is located within 15 miles of
            an authorized facility, state law requires you to act. This tool tells you exactly
            where you stand — in under two minutes.
          </p>
          <p className="text-sm text-sea-glass bg-sea-glass/10 rounded-lg px-3 py-2 leading-relaxed">
            Every ton your organization diverts helps rebuild healthier soil or clean energy,
            right here in Rhode Island — turning what would've been landfill waste into something
            genuinely useful. This is climate action you can actually see and measure. Let's find
            out if your organization is already part of it.
          </p>
          <p className="text-sm text-harbor-blue leading-relaxed">
            Not sure which category your organization falls under?{" "}
            <button
              type="button"
              onClick={onOpenEntityDefinitions}
              className="underline underline-offset-2 text-bay-blue hover:text-harbor-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
            >
              See exact legal definitions for each category
            </button>
            .
          </p>
          <a
            href="https://webserver.rilegislature.gov/Statutes/TITLE23/23-18.9/23-18.9-17.htm"
            target="_blank"
            rel="noreferrer"
            className="inline-block text-sm text-bay-blue underline underline-offset-2 hover:text-harbor-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
          >
            Read the full statute — R.I. Gen. Laws § 23-18.9-17 ↗
          </a>
        </div>
      ) : null}
    </div>
  );
}
