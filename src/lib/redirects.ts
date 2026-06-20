import type { RedirectMap, RedirectNode, RedirectValue, FlatRedirectEntry } from "@/types/redirects";

export function flattenPaths(node: RedirectNode, prefix: string[] = []): FlatRedirectEntry[] {
  const entries: FlatRedirectEntry[] = [];

  for (const [key, value] of Object.entries(node)) {
    if (key === "default") continue;

    const currentSlug = [...prefix, key];

    if (typeof value === "string") {
      entries.push({ slug: currentSlug, target: value });
    } else if (typeof value === "object" && value !== null) {
      entries.push(...flattenPaths(value as RedirectNode, currentSlug));
    }
  }

  return entries;
}

export function resolveRedirect(segments: string[], map: RedirectMap): string | null {
  let current: RedirectValue = map as RedirectNode;

  for (const segment of segments) {
    if (typeof current !== "object" || current === null) return null;
    const next: RedirectValue | undefined = (current as RedirectNode)[segment];
    if (next === undefined) return null;
    current = next;
  }

  if (typeof current === "string") return current;
  return null;
}

export function getDefaultRedirect(map: RedirectMap): string | null {
  return map.default ?? null;
}

export function isSafeUrl(uri: string): boolean {
  try {
    const { protocol } = new URL(uri);
    return protocol === "http:" || protocol === "https:" || protocol === "mailto:" || protocol === "tel:";
  } catch {
    return false;
  }
}

export function isWebUrl(uri: string): boolean {
  return uri.startsWith("http://") || uri.startsWith("https://");
}

export function getDisplayUrl(uri: string): string {
  try {
    const u = new URL(uri);
    return u.hostname + (u.pathname !== "/" ? u.pathname : "");
  } catch {
    return uri;
  }
}
