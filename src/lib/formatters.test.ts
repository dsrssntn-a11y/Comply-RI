import { describe, expect, it } from "vitest";
import { formatTons, generateShareText } from "./formatters";

describe("formatTons", () => {
  it("rounds to at most one decimal place", () => {
    expect(formatTons(33.333)).toBe("33.3 tons");
  });
});

describe("generateShareText", () => {
  it("uses the same rounded figure as formatTons, not the raw value", () => {
    const text = generateShareText(33.333, "https://example.com");
    expect(text).toContain("33.3 tons");
    expect(text).not.toContain("33.333");
  });

  it("doesn't double up the word 'tons'", () => {
    const text = generateShareText(65, "https://example.com");
    expect(text).not.toMatch(/tons\s+tons/);
  });
});
