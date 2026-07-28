import { COPY } from "../data/copy";
import ContextBanner from "./ContextBanner";
import type { TabId } from "../types";

interface HeroProps {
  activeTab: TabId;
  onOpenEntityDefinitions: () => void;
}

export default function Hero({ activeTab, onOpenEntityDefinitions }: HeroProps) {
  return (
    <section className="hero-strip" aria-label="Introduction">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-2.5">
        {/* Matches the header's icon width (w-7) + gap so this text lines up
            with the header's h1, which is indented past the RhodeIslandMark icon.
            Hidden on mobile, where the header no longer reserves that same
            indent and every row should instead hug the shared left edge. */}
        <div className="hidden sm:block w-7 shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          {activeTab === "calculator" ? (
            <>
              <p className="hero-statement">{COPY.heroStatement}</p>
              <p className="civic-trust">{COPY.civicTrustLine}</p>
            </>
          ) : null}
          <p className="text-xs sm:text-sm font-semibold text-slate-amber mt-1">
            This is an independent project, not officially affiliated with or endorsed by RIDEM.
          </p>

          {activeTab === "calculator" ? (
            <ContextBanner onOpenEntityDefinitions={onOpenEntityDefinitions} />
          ) : null}
        </div>
      </div>
    </section>
  );
}
