import { describe, expect, it } from "vitest";
import {
  validateCity,
  validateEntityType,
  validateStreetAddress,
  validateTonnage,
  validateZip,
} from "./validation";

describe("validateZip", () => {
  it("accepts a zip inside the RI range", () => {
    expect(validateZip("02886").valid).toBe(true);
  });

  it("rejects a non-5-digit input", () => {
    expect(validateZip("2886").valid).toBe(false);
    expect(validateZip("").valid).toBe(false);
  });

  it("rejects a 5-digit zip outside the RI range", () => {
    expect(validateZip("10001").valid).toBe(false);
  });
});

describe("validateTonnage", () => {
  it("accepts a positive number", () => {
    expect(validateTonnage("65").valid).toBe(true);
  });

  it("rejects empty, zero, negative, or non-numeric input", () => {
    expect(validateTonnage("").valid).toBe(false);
    expect(validateTonnage("0").valid).toBe(false);
    expect(validateTonnage("-5").valid).toBe(false);
    expect(validateTonnage("abc").valid).toBe(false);
  });
});

describe("validateEntityType", () => {
  it("accepts the three known entity types", () => {
    expect(validateEntityType("higher_ed").valid).toBe(true);
    expect(validateEntityType("k12").valid).toBe(true);
    expect(validateEntityType("other").valid).toBe(true);
  });

  it("rejects an empty or unknown value", () => {
    expect(validateEntityType("").valid).toBe(false);
    expect(validateEntityType("municipal").valid).toBe(false);
  });
});

describe("validateStreetAddress / validateCity", () => {
  it("reject blank input", () => {
    expect(validateStreetAddress("").valid).toBe(false);
    expect(validateStreetAddress("   ").valid).toBe(false);
    expect(validateCity("").valid).toBe(false);
  });

  it("accept non-blank input", () => {
    expect(validateStreetAddress("289 Scituate Ave").valid).toBe(true);
    expect(validateCity("Johnston").valid).toBe(true);
  });
});
