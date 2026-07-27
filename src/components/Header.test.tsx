import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Header from "./Header";

// Note: the desktop "How it works" / "Important things to know" text links
// are always present in the DOM (they're hidden on mobile via a Tailwind
// `hidden sm:flex` class, which jsdom doesn't evaluate — it has no real
// layout engine). Every query below is scoped to the mobile popover
// container (#header-info-menu) specifically, to avoid colliding with them.

function renderHeader() {
  const onTabChange = vi.fn();
  const onHowItWorksClick = vi.fn();
  const onImportantToKnowClick = vi.fn();
  render(
    <Header
      activeTab="calculator"
      onTabChange={onTabChange}
      howItWorksOpen={false}
      onHowItWorksClick={onHowItWorksClick}
      importantToKnowOpen={false}
      onImportantToKnowClick={onImportantToKnowClick}
    />
  );
  return { onTabChange, onHowItWorksClick, onImportantToKnowClick };
}

const TRIGGER_NAME = "How it works and important things to know";

function getMenu() {
  return document.getElementById("header-info-menu");
}

describe("Header mobile info menu", () => {
  it("is closed by default", () => {
    renderHeader();
    expect(getMenu()).not.toBeInTheDocument();
  });

  it("opens on click and shows both options", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole("button", { name: TRIGGER_NAME }));

    const menu = getMenu();
    expect(menu).toBeInTheDocument();
    expect(within(menu!).getByText("How it works")).toBeInTheDocument();
    expect(within(menu!).getByText("Important things to know")).toBeInTheDocument();
  });

  it("calls the right callback and closes when a menu item is clicked", async () => {
    const user = userEvent.setup();
    const { onImportantToKnowClick } = renderHeader();

    await user.click(screen.getByRole("button", { name: TRIGGER_NAME }));
    await user.click(within(getMenu()!).getByText("Important things to know"));

    expect(onImportantToKnowClick).toHaveBeenCalledOnce();
    expect(getMenu()).not.toBeInTheDocument();
  });

  it("closes when clicking outside the menu", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole("button", { name: TRIGGER_NAME }));
    expect(getMenu()).toBeInTheDocument();

    await user.click(document.body);
    expect(getMenu()).not.toBeInTheDocument();
  });
});
