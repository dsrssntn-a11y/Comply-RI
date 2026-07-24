import RhodeIslandMark from "./RhodeIslandMark";
import type { TabId } from "../types";
import { TABS } from "../app/routes";

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onHowItWorksClick: () => void;
  howItWorksOpen: boolean;
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 focus-visible:ring-offset-1 rounded";

export default function Header({
  activeTab,
  onTabChange,
  onHowItWorksClick,
  howItWorksOpen,
}: HeaderProps) {
  return (
    <header className="bg-surface-white border-b border-mist-gray">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <RhodeIslandMark />
            <span className="text-harbor-blue font-semibold text-lg tracking-tight">
              Comply RI
            </span>
          </div>
          <button
            type="button"
            onClick={onHowItWorksClick}
            aria-expanded={howItWorksOpen}
            aria-controls="how-it-works-panel"
            className={`text-sm text-bay-blue hover:text-harbor-blue underline underline-offset-2 transition-colors ${FOCUS_RING}`}
          >
            How it works
          </button>
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
