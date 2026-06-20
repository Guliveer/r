import { describe, it, expect } from "vitest";
import { flattenPaths, resolveRedirect, getDefaultRedirect, isSafeUrl, isWebUrl } from "@/lib/redirects";
import type { RedirectMap } from "@/types/redirects";

describe("flattenPaths", () => {
  it("flattens a single top-level entry", () => {
    const result = flattenPaths({ github: "https://github.com" });
    expect(result).toEqual([{ slug: ["github"], target: "https://github.com" }]);
  });

  it("skips the 'default' key at top level", () => {
    const result = flattenPaths({ default: "https://example.com", cv: "https://cv.example.com" });
    expect(result).toEqual([{ slug: ["cv"], target: "https://cv.example.com" }]);
  });

  it("skips 'default' inside nested nodes", () => {
    const result = flattenPaths({ social: { default: "https://example.com", github: "https://github.com" } });
    expect(result).toEqual([{ slug: ["social", "github"], target: "https://github.com" }]);
  });

  it("flattens one level of nesting", () => {
    const result = flattenPaths({ social: { github: "https://github.com", linkedin: "https://linkedin.com" } });
    expect(result).toHaveLength(2);
    expect(result).toContainEqual({ slug: ["social", "github"], target: "https://github.com" });
    expect(result).toContainEqual({ slug: ["social", "linkedin"], target: "https://linkedin.com" });
  });

  it("flattens two levels of nesting", () => {
    const result = flattenPaths({ a: { b: { c: "https://example.com" } } });
    expect(result).toEqual([{ slug: ["a", "b", "c"], target: "https://example.com" }]);
  });

  it("returns empty array for empty object", () => {
    expect(flattenPaths({})).toEqual([]);
  });

  it("handles mixed flat and nested entries", () => {
    const result = flattenPaths({ cv: "https://cv.example.com", social: { github: "https://github.com" } });
    expect(result).toHaveLength(2);
    expect(result).toContainEqual({ slug: ["cv"], target: "https://cv.example.com" });
    expect(result).toContainEqual({ slug: ["social", "github"], target: "https://github.com" });
  });
});

describe("resolveRedirect", () => {
  const map: RedirectMap = {
    default: "https://default.example.com",
    github: "https://github.com",
    social: {
      linkedin: "https://linkedin.com",
      deep: { nested: "https://deep.example.com" },
    },
  };

  it("resolves an existing flat key", () => {
    expect(resolveRedirect(["github"], map)).toBe("https://github.com");
  });

  it("resolves an existing nested key", () => {
    expect(resolveRedirect(["social", "linkedin"], map)).toBe("https://linkedin.com");
  });

  it("resolves a deeply nested key", () => {
    expect(resolveRedirect(["social", "deep", "nested"], map)).toBe("https://deep.example.com");
  });

  it("returns null for a non-existent key", () => {
    expect(resolveRedirect(["nonexistent"], map)).toBeNull();
  });

  it("returns null when key points to an object, not a string", () => {
    expect(resolveRedirect(["social"], map)).toBeNull();
  });

  it("returns null for an empty segments array", () => {
    expect(resolveRedirect([], map)).toBeNull();
  });

  it("returns null for a partial path that doesn't resolve to a string", () => {
    expect(resolveRedirect(["social", "nonexistent"], map)).toBeNull();
  });
});

describe("getDefaultRedirect", () => {
  it("returns the default URL when present", () => {
    const map: RedirectMap = { default: "https://example.com" };
    expect(getDefaultRedirect(map)).toBe("https://example.com");
  });

  it("returns null when default is absent", () => {
    expect(getDefaultRedirect({})).toBeNull();
  });
});

describe("isSafeUrl", () => {
  it("allows https", () => expect(isSafeUrl("https://github.com")).toBe(true));
  it("allows http", () => expect(isSafeUrl("http://example.com")).toBe(true));
  it("allows mailto", () => expect(isSafeUrl("mailto:hi@example.com")).toBe(true));
  it("allows tel", () => expect(isSafeUrl("tel:+48123456789")).toBe(true));
  it("blocks javascript", () => expect(isSafeUrl("javascript:alert(1)")).toBe(false));
  it("blocks data URIs", () => expect(isSafeUrl("data:text/html,<h1>x</h1>")).toBe(false));
  it("blocks invalid strings", () => expect(isSafeUrl("not a url")).toBe(false));
});

describe("isWebUrl", () => {
  it("returns true for https", () => expect(isWebUrl("https://github.com")).toBe(true));
  it("returns true for http", () => expect(isWebUrl("http://example.com")).toBe(true));
  it("returns false for mailto", () => expect(isWebUrl("mailto:hi@example.com")).toBe(false));
  it("returns false for tel", () => expect(isWebUrl("tel:+48123456789")).toBe(false));
});
