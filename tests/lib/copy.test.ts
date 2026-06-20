import { describe, it, expect } from "vitest";
import { pickRandom, REDIRECT_HEADLINES, NOT_FOUND_HEADLINES, NOT_FOUND_GITHUB_BUTTONS } from "@/lib/copy";

describe("pickRandom", () => {
  it("returns an element from the array", () => {
    const items = ["a", "b", "c"];
    expect(items).toContain(pickRandom(items));
  });

  it("returns the only element of a single-item array", () => {
    expect(pickRandom(["only"])).toBe("only");
  });

  it("returns different values across calls (probabilistic)", () => {
    const items = Array.from({ length: 20 }, (_, i) => i);
    const results = new Set(Array.from({ length: 100 }, () => pickRandom(items)));
    expect(results.size).toBeGreaterThan(1);
  });
});

describe("copy pools", () => {
  it("REDIRECT_HEADLINES has at least 10 entries", () => {
    expect(REDIRECT_HEADLINES.length).toBeGreaterThanOrEqual(10);
  });

  it("NOT_FOUND_HEADLINES has at least 6 entries", () => {
    expect(NOT_FOUND_HEADLINES.length).toBeGreaterThanOrEqual(6);
  });

  it("NOT_FOUND_GITHUB_BUTTONS has at least 6 entries", () => {
    expect(NOT_FOUND_GITHUB_BUTTONS.length).toBeGreaterThanOrEqual(6);
  });

  it("all REDIRECT_HEADLINES are non-empty strings", () => {
    REDIRECT_HEADLINES.forEach((h) => expect(h.trim().length).toBeGreaterThan(0));
  });

  it("all NOT_FOUND_HEADLINES are non-empty strings", () => {
    NOT_FOUND_HEADLINES.forEach((h) => expect(h.trim().length).toBeGreaterThan(0));
  });
});
