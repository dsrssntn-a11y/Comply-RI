import RhodeIslandMark from "./RhodeIslandMark";
import { COPY } from "../data/copy";
import type { TabId } from "../types";
import { TABS } from "../app/routes";

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onHowItWorksClick: () => void;
  howItWorksOpen: boolean;
  onImportantToKnowClick: () => void;
  importantToKnowOpen: boolean;
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 focus-visible:ring-offset-1 rounded";

export default function Header({
  activeTab,
  onTabChange,
  onHowItWorksClick,
  howItWorksOpen,
  onImportantToKnowClick,
  importantToKnowOpen,
}: HeaderProps) {
  return (
    <header className="bg-surface-white border-b border-mist-gray">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <RhodeIslandMark />
            <div className="min-w-0">
              <h1 className="text-harbor-blue font-semibold text-xl sm:text-2xl tracking-tight truncate">
                {COPY.toolName}
              </h1>
              <p className="text-fog-gray text-xs sm:text-sm truncate">{COPY.taglineFull}</p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={onHowItWorksClick}
              aria-expanded={howItWorksOpen}
              aria-controls="how-it-works-panel"
              className={`text-sm text-bay-blue hover:text-harbor-blue underline underline-offset-2 transition-colors ${FOCUS_RING}`}
            >
              How it works
            </button>
            <button
              type="button"
              onClick={onImportantToKnowClick}
              aria-expanded={importantToKnowOpen}
              aria-controls="important-to-know-panel"
              className={`text-sm text-bay-blue hover:text-harbor-blue underline underline-offset-2 transition-colors ${FOCUS_RING}`}
            >
              Important things to know
            </button>
          </div>
        </div>
        <nav aria-label="Main tabs" role="tablist" className="flex gap-1 -mb-px">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${FOCUS_RING} ${
                  isActive
                    ? "border-anchor-gold text-harbor-blue"
                    : "border-transparent text-fog-gray hover:text-harbor-blue"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
