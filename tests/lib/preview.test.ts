import { describe, it, expect } from "vitest";
import { parsePreviewMetadata } from "@/lib/preview";

describe("parsePreviewMetadata", () => {
  it("extracts Open Graph tags", () => {
    const html = `
      <html><head>
        <meta property="og:title" content="twitch-miner-go — Go to bed. It's mining." />
        <meta property="og:description" content="Mines channel points." />
        <meta property="og:image" content="https://example.com/brag.jpg" />
        <meta property="og:site_name" content="GitHub Pages" />
        <meta property="og:type" content="website" />
      </head></html>`;

    expect(parsePreviewMetadata(html, "https://guliveer.github.io/twitch-miner-go/")).toEqual({
      title: "twitch-miner-go — Go to bed. It's mining.",
      description: "Mines channel points.",
      image: "https://example.com/brag.jpg",
      siteName: "GitHub Pages",
      type: "website",
    });
  });

  it("falls back to twitter tags, document title and description meta", () => {
    const html = `
      <html><head>
        <title>Guliveer (Oliwer Pawelski) · GitHub</title>
        <meta name="description" content="Computer Science Student" />
        <meta name="twitter:title" content="Guliveer - Overview" />
        <meta name="twitter:image" content="https://avatars.githubusercontent.com/u/1" />
        <meta name="twitter:card" content="summary" />
      </head></html>`;

    const preview = parsePreviewMetadata(html, "https://github.com/Guliveer");

    expect(preview.title).toBe("Guliveer - Overview");
    expect(preview.description).toBe("Computer Science Student");
    expect(preview.image).toBe("https://avatars.githubusercontent.com/u/1");
    expect(preview.siteName).toBeNull();
    expect(preview.type).toBeNull();
  });

  it("uses the document title when no social title exists", () => {
    const preview = parsePreviewMetadata(
      "<html><head><title>  CV | Oliwer Pawelski </title></head></html>",
      "https://cv.example.com/",
    );

    expect(preview.title).toBe("CV | Oliwer Pawelski");
    expect(preview.image).toBeNull();
  });

  it("resolves relative image URLs against the page URL", () => {
    const preview = parsePreviewMetadata(
      '<meta property="og:image" content="/static/card.png" />',
      "https://example.com/blog/post",
    );

    expect(preview.image).toBe("https://example.com/static/card.png");
  });

  it("decodes HTML entities", () => {
    const preview = parsePreviewMetadata(
      '<meta property="og:title" content="Tom &amp; Jerry &#8212; &quot;fun&quot;" />',
      "https://example.com/",
    );

    expect(preview.title).toBe('Tom & Jerry — "fun"');
  });

  it("collapses whitespace and truncates long descriptions", () => {
    const preview = parsePreviewMetadata(
      `<meta property="og:description" content="${"word ".repeat(120)}" />`,
      "https://example.com/",
    );

    expect(preview.description?.endsWith("…")).toBe(true);
    expect(preview.description?.length).toBe(300);
    expect(preview.description).not.toContain("  ");
  });

  it("returns nulls when the page has no metadata", () => {
    expect(parsePreviewMetadata("<html><body>hi</body></html>", "https://example.com/")).toEqual({
      title: null,
      description: null,
      image: null,
      siteName: null,
      type: null,
    });
  });
});
