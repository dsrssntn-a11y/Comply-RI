import { useEffect, useState } from "react";
import PageLayout from "./layout";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import HowItWorks from "../components/HowItWorks";
import ImportantToKnow from "../components/ImportantToKnow";
import CalculatorForm from "../components/CalculatorForm";
import HaulerDirectory from "../components/HaulerDirectory";
import type { TabId } from "../types";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("calculator");
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [importantToKnowOpen, setImportantToKnowOpen] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  useEffect(() => {
    if (!howItWorksOpen) return;
    requestAnimationFrame(() => {
      document.getElementById("how-it-works-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [howItWorksOpen]);

  useEffect(() => {
    if (!importantToKnowOpen) return;
    requestAnimationFrame(() => {
      document.getElementById("important-to-know-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [importantToKnowOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-cloud-white">
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          // HowItWorks/ImportantToKnow only render inside the calculator tab —
          // close them when navigating away so aria-controls/aria-expanded on
          // these buttons never reference an unmounted element.
          if (tab !== "calculator") {
            setHowItWorksOpen(false);
            setImportantToKnowOpen(false);
          }
        }}
        howItWorksOpen={howItWorksOpen}
        onHowItWorksClick={() => {
          setActiveTab("calculator");
          setHowItWorksOpen((open) => !open);
        }}
        importantToKnowOpen={importantToKnowOpen}
        onImportantToKnowClick={() => {
          setActiveTab("calculator");
          setImportantToKnowOpen((open) => !open);
        }}
      />
      {activeTab === "calculator" && hasResult ? null : <Hero />}
      <PageLayout>
        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === "calculator" ? (
            <>
              <HowItWorks open={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} />
              <ImportantToKnow
                open={importantToKnowOpen}
                onClose={() => setImportantToKnowOpen(false)}
              />
              <CalculatorForm
                onNavigateToHaulers={() => setActiveTab("haulers")}
                onOpenHowItWorks={() => setHowItWorksOpen(true)}
                onOpenImportantToKnow={() => setImportantToKnowOpen(true)}
                onResultChange={setHasResult}
              />
            </>
          ) : (
            <HaulerDirectory />
          )}
        </div>
      </PageLayout>
      <Footer />
    </div>
  );
}
