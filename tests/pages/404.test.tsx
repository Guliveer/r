import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "@/pages/404";

vi.mock("next/head", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("404 page", () => {
  it("renders the 404 code", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders a non-empty headline", () => {
    render(<NotFound />);
    const paragraphs = screen.getAllByRole("paragraph");
    expect(paragraphs.some((p) => p.textContent && p.textContent.trim().length > 0)).toBe(true);
  });

  it("renders the go-back link pointing to /", () => {
    render(<NotFound />);
    const links = screen.getAllByRole("link");
    expect(links.some((l) => l.getAttribute("href") === "/")).toBe(true);
  });

  it("renders the GitHub link", () => {
    render(<NotFound />);
    const links = screen.getAllByRole("link");
    expect(
      links.some((l) => l.getAttribute("href") === "https://github.com/Guliveer")
    ).toBe(true);
  });

  it("GitHub link opens in a new tab", () => {
    render(<NotFound />);
    const links = screen.getAllByRole("link");
    const ghLink = links.find((l) => l.getAttribute("href") === "https://github.com/Guliveer");
    expect(ghLink?.getAttribute("target")).toBe("_blank");
  });
});
