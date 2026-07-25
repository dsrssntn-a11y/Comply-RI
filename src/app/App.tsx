import { useEffect, useState } from "react";
import PageLayout from "./layout";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import HowItWorks from "../components/HowItWorks";
import CalculatorForm from "../components/CalculatorForm";
import HaulerDirectory from "../components/HaulerDirectory";
import type { TabId } from "../types";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("calculator");
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  useEffect(() => {
    if (!howItWorksOpen) return;
    requestAnimationFrame(() => {
      document.getElementById("how-it-works-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [howItWorksOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-cloud-white">
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          // HowItWorks only renders inside the calculator tab — close it when
          // navigating away so aria-controls/aria-expanded on this button
          // never reference an unmounted element.
          if (tab !== "calculator") setHowItWorksOpen(false);
        }}
        howItWorksOpen={howItWorksOpen}
        onHowItWorksClick={() => {
          setActiveTab("calculator");
          setHowItWorksOpen((open) => !open);
        }}
      />
      <Hero />
      <PageLayout>
        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === "calculator" ? (
            <>
              <HowItWorks open={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} />
              <CalculatorForm
                onNavigateToHaulers={() => setActiveTab("haulers")}
                onOpenHowItWorks={() => setHowItWorksOpen(true)}
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
