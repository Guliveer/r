# UI Redesign: Redirect & 404 Pages

## Context

The existing redirect and 404 pages are plain unstyled HTML. The goal is a polished dark-minimalist UI with sequential fade-in animations and rotating easter-egg copy.

## Visual Style

- Background: `#0a0a0a`, text: `#f5f5f5`, muted: `#555`, accent: `#ffffff`
- Font: Geist via `next/font/google` — zero external requests, loaded natively by Next.js
- Thin white horizontal rule as section separator
- No decorative elements; typography carries the design

## Redirect Page (`[...path].tsx`)

### Layout (centered vertically and horizontally, full viewport)

```
  Taking you somewhere good.   ← random headline
  ─────────────────────────
  github.com/Guliveer           ← destination URL, muted color
  Open manually ↗               ← fallback link, subtle border button
```

### Random Headlines (client-side only, via useEffect)

Resolved on the client so SSG doesn't freeze one value for all visitors.

```
"Taking you somewhere good."
"Hold on, portal opening..."
"Buckle up."
"Engaging hyperdrive."
"One moment."
"Loading the internet..."
"Almost there."
"Don't touch anything."
"Teleporting..."
"Calculating shortest path."
```

### Animation

Sequential fade-in + translateY(6px → 0):
- Headline: delay 0ms
- Separator + URL: delay 150ms
- Button: delay 300ms

Redirect fires after 1000ms via `window.location.replace(target)`.

## 404 Page (`404.tsx`)

### Layout

```
  404
  ─────────────────────────
  Lost in redirect.            ← random headline
  This path leads nowhere.     ← muted
  (Or maybe everywhere.)       ← muted, italic
  ← Go back                    ← link
```

### Random Headlines

```
"Lost in redirect."
"Dead end."
"This shortcut doesn't exist."
"404: link not found."
"Where did you even get this URL?"
"This one got away."
```

Same client-side randomisation pattern as redirect page.

### Animation

Same sequential fade-in. No automatic redirect.

## Implementation Notes

- CSS Modules: `src/styles/redirect.module.css`, `src/styles/404.module.css`, `src/styles/shared.module.css` for shared tokens
- `src/style.css` kept for global reset only
- Random headline extracted to `src/lib/copy.ts`: `pickRandom(lines: string[]): string`
- `pickRandom` seeded from `Math.random()` — no determinism needed
- No new npm dependencies required

## Files to Create / Modify

| File | Action |
|------|--------|
| `src/lib/copy.ts` | Create — `pickRandom` utility |
| `src/styles/shared.module.css` | Create — tokens, layout, animation keyframes |
| `src/styles/redirect.module.css` | Create — redirect-specific overrides |
| `src/styles/404.module.css` | Create — 404-specific overrides |
| `src/pages/[...path].tsx` | Modify — new layout + copy |
| `src/pages/404.tsx` | Create — new 404 page |
| `src/pages/_app.tsx` | Modify — load Geist font |
| `src/style.css` | Modify — strip styles, keep only reset |

## Out of Scope

- No dark/light mode toggle
- No custom domain branding
- No back-end changes
