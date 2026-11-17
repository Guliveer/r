import { isWebUrl } from "@/lib/redirects";
import type { PreviewMetadata } from "@/types/redirects";

const USER_AGENT = "Mozilla/5.0 (compatible; redirects-preview/1.0)";
const MAX_HTML_LENGTH = 512 * 1024;
const MAX_DESCRIPTION_LENGTH = 300;
const DEFAULT_TIMEOUT_MS = 4000;

const cache = new Map<string, Promise<PreviewMetadata | null>>();

function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function readAttributes(tag: string): Map<string, string> {
  const attributes = new Map<string, string>();
  const pattern = /([a-zA-Z_:][-\w:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;

  for (const match of tag.matchAll(pattern)) {
    const [, name, doubleQuoted, singleQuoted, bare] = match;
    attributes.set(name.toLowerCase(), doubleQuoted ?? singleQuoted ?? bare ?? "");
  }

  return attributes;
}

function readMetaTags(html: string): Map<string, string> {
  const tags = new Map<string, string>();

  for (const match of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attributes = readAttributes(match);
    const key = (attributes.get("property") ?? attributes.get("name") ?? "").toLowerCase();
    const content = attributes.get("content");

    if (key && content !== undefined && !tags.has(key)) {
      tags.set(key, decodeEntities(content).trim());
    }
  }

  return tags;
}

function readDocumentTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = match?.[1] ? decodeEntities(match[1]).replace(/\s+/g, " ").trim() : "";
  return title || null;
}

function pick(tags: Map<string, string>, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = tags.get(key);
    if (value) return value;
  }
  return null;
}

function resolveUrl(value: string | null, baseUrl: string): string | null {
  if (!value) return null;
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
}

function normalizeDescription(value: string | null): string | null {
  if (!value) return null;
  const description = value.replace(/\s+/g, " ").trim();
  if (!description) return null;
  return description.length > MAX_DESCRIPTION_LENGTH
    ? `${description.slice(0, MAX_DESCRIPTION_LENGTH - 1).trimEnd()}…`
    : description;
}

/**
 * Extracts the embed-relevant metadata from a page so a short link can carry
 * the same Open Graph / Twitter card as the page it redirects to.
 */
export function parsePreviewMetadata(html: string, baseUrl: string): PreviewMetadata {
  const tags = readMetaTags(html);

  return {
    title: pick(tags, "og:title", "twitter:title") ?? readDocumentTitle(html),
    description: normalizeDescription(
      pick(tags, "og:description", "twitter:description", "description"),
    ),
    image: resolveUrl(
      pick(tags, "og:image", "og:image:url", "og:image:secure_url", "twitter:image", "twitter:image:src"),
      baseUrl,
    ),
    siteName: pick(tags, "og:site_name"),
    type: pick(tags, "og:type"),
  };
}

/**
 * Build-time lookup of a redirect target's embed metadata. Failures (offline
 * builds, blocked crawlers, non-HTML targets) resolve to null so the short
 * link keeps working without a preview.
 */
export async function fetchPreviewMetadata(
  target: string,
  { timeoutMs = DEFAULT_TIMEOUT_MS }: { timeoutMs?: number } = {},
): Promise<PreviewMetadata | null> {
  if (!isWebUrl(target)) return null;

  const cached = cache.get(target);
  if (cached) return cached;

  const request = (async (): Promise<PreviewMetadata | null> => {
    try {
      const response = await fetch(target, {
        redirect: "follow",
        headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml" },
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) return null;

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType && !contentType.includes("html")) return null;

      const html = (await response.text()).slice(0, MAX_HTML_LENGTH);
      const preview = parsePreviewMetadata(html, response.url || target);

      return preview.title || preview.description || preview.image ? preview : null;
    } catch {
      return null;
    }
  })();

  cache.set(target, request);
  return request;
}
