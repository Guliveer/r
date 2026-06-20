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
    render(<Redirect target="https://example.com" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com");
  });

  it("link has rel=noopener noreferrer", () => {
    render(<Redirect target="https://example.com" />);
    expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("displays the display URL (hostname only)", () => {
    render(<Redirect target="https://example.com" />);
    expect(screen.getByText("example.com")).toBeInTheDocument();
  });

  it("destination chip has aria-label", () => {
    render(<Redirect target="https://example.com" />);
    expect(screen.getByLabelText("Redirecting to example.com")).toBeInTheDocument();
  });

  it("renders a non-empty headline", () => {
    render(<Redirect target="https://example.com" />);
    const headlines = screen.getAllByRole("paragraph");
    expect(headlines[0].textContent).toBeTruthy();
  });

  it("renders a link for a mailto URI", () => {
    render(<Redirect target="mailto:hello@example.com" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "mailto:hello@example.com");
  });
});
