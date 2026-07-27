import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

// Same reasoning as ResultCard.test.tsx — Leaflet needs real browser layout,
// which jsdom doesn't provide, and isn't what this test is checking anyway.
vi.mock("../components/FacilityMap", () => ({
  default: () => null,
}));

const HERO_TEXT = /find out if your organization is subject to rhode island's commercial food waste ban/i;

describe("App — Hero visibility", () => {
  it("shows the Hero on load, and hides it once a result is calculated", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(HERO_TEXT)).toBeInTheDocument();

    await user.selectOptions(
      screen.getByLabelText("Entity type"),
      "Higher education / research institution"
    );
    await user.type(screen.getByLabelText("Zip code"), "02886");
    await user.type(screen.getByLabelText("Annual food waste tonnage"), "65");
    await user.click(screen.getByRole("button", { name: "Calculate" }));

    expect(await screen.findByText("You entered")).toBeInTheDocument();
    expect(screen.queryByText(HERO_TEXT)).not.toBeInTheDocument();
  });
});
