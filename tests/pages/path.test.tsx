import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Redirect, { getStaticPaths, getStaticProps } from "@/pages/[...path]";

vi.mock("next/head", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("getStaticPaths", () => {
  it("generates paths for all top-level redirects", async () => {
    const result = await getStaticPaths({});
    expect(result.fallback).toBe(false);
    expect(result.paths.length).toBeGreaterThan(0);
    const slugs = result.paths.map((p) => (p as { params: { path: string[] } }).params.path);
    expect(slugs).toContainEqual(["github"]);
  });
});

describe("getStaticProps", () => {
  it("returns notFound for an unknown path", async () => {
    const result = await getStaticProps({ params: { path: ["this-does-not-exist"] }, locales: undefined, locale: undefined, defaultLocale: undefined });
    expect(result).toEqual({ notFound: true });
  });

  it("returns props with target for a known flat path", async () => {
    const result = await getStaticProps({ params: { path: ["github"] }, locales: undefined, locale: undefined, defaultLocale: undefined });
    expect(result).toMatchObject({ props: { target: expect.stringContaining("github.com") } });
  });

  it("returns notFound when no segments provided", async () => {
    const result = await getStaticProps({ params: { path: [] }, locales: undefined, locale: undefined, defaultLocale: undefined });
    expect(result).toEqual({ notFound: true });
  });
});

describe("Redirect component", () => {
  it("renders a link to a web URL target", () => {
    render(<Redirect target="https://example.com" slug={["example"]} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com");
  });

  it("displays the redirect target", () => {
    render(<Redirect target="https://example.com" slug={["example"]} />);
    expect(screen.getByText(/https:\/\/example\.com/)).toBeInTheDocument();
  });

  it("renders 'Redirecting' text", () => {
    render(<Redirect target="https://example.com" slug={["example"]} />);
    expect(screen.getByText(/redirecting/i)).toBeInTheDocument();
  });

  it("renders a link for a mailto URI", () => {
    render(<Redirect target="mailto:hello@example.com" slug={["email"]} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "mailto:hello@example.com");
  });
});
