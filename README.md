# Redirector — URL Shortener

A lightweight URL shortener built with [Next.js](https://nextjs.org) and deployed on [Vercel](https://vercel.com). Redirect mappings are stored in a single JSON file, making it trivial to maintain.

## How It Works

1. The app reads `public/redirects.json` at build time.
2. Visiting `your-domain.com/github` redirects to the mapped URL.
3. Unknown paths return a 404 page.
4. The root path `/` redirects to the `index` URL, if configured.

## Configuration

Edit `public/redirects.json` to manage your redirects. Nested keys are supported for organization:

```json
{
  "index": "https://example.com",
  "github": "https://github.com/yourname",
  "cv": "https://cv.example.com",
  "social": {
    "linkedin": "https://linkedin.com/in/yourname",
    "twitter": "https://twitter.com/yourname"
  }
}
```

| Path | Redirects to |
|---|---|
| `/` | `index` value |
| `/github` | `https://github.com/yourname` |
| `/social/linkedin` | `https://linkedin.com/in/yourname` |

## Link previews

Embeds (Discord, Slack, X, Telegram, …) are taken from the redirect target: at build time every short link fetches its target's Open Graph / Twitter metadata and renders it on the short-link page. Pasting `your-domain.com/twitch-miner-go` therefore shows the same card as the destination URL. Targets that are unreachable at build time (offline build, blocked crawler, non-HTML target) fall back to a title built from their hostname.

Builds therefore need network access; fetching is capped at 4 s per target and cached per build.

## Development

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run typecheck` | TypeScript typecheck |
| `npm run validate:redirects` | Validate `redirects.json` against schema |

## Deployment

Connect the repository to a Vercel project via the Vercel dashboard. Vercel automatically deploys on every push to `main`. The CI workflow runs typecheck and tests on every push and pull request independently.

## Analytics

[Vercel Analytics](https://vercel.com/analytics) is enabled by default. Visit the Vercel dashboard to view redirect traffic.

---

Made by **Oliwer Pawelski / Guliveer**
