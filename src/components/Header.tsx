import { useEffect, useRef, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="print:hidden bg-surface-white border-b border-mist-gray">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <RhodeIslandMark />
            <div className="min-w-0">
              <h1 className="text-harbor-blue font-semibold text-lg sm:text-2xl tracking-tight sm:truncate">
                {COPY.toolName}
              </h1>
              <p className="text-fog-gray text-xs sm:text-sm sm:truncate">{COPY.taglineFull}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 sm:shrink-0">
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
        <div className="flex items-center justify-between">
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

          <div ref={menuRef} className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="header-info-menu"
              aria-label="How it works and important things to know"
              className={`w-9 h-9 flex items-center justify-center text-lg leading-none text-bay-blue hover:text-harbor-blue transition-colors ${FOCUS_RING}`}
            >
              <span aria-hidden="true">ⓘ</span>
            </button>

            {menuOpen ? (
              <div
                id="header-info-menu"
                className="absolute right-0 top-full mt-1 w-56 bg-surface-white border border-mist-gray rounded-xl shadow-lg py-1 z-20"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onHowItWorksClick();
                  }}
                  aria-expanded={howItWorksOpen}
                  aria-controls="how-it-works-panel"
                  className={`w-full text-left px-3 py-2 text-sm text-harbor-blue hover:bg-cloud-white transition-colors ${FOCUS_RING}`}
                >
                  How it works
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onImportantToKnowClick();
                  }}
                  aria-expanded={importantToKnowOpen}
                  aria-controls="important-to-know-panel"
                  className={`w-full text-left px-3 py-2 text-sm text-harbor-blue hover:bg-cloud-white transition-colors ${FOCUS_RING}`}
                >
                  Important things to know
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
