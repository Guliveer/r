# Redirector — URL Shortener

A lightweight URL shortener built with [Next.js](https://nextjs.org) and deployed on [Vercel](https://vercel.com). Redirect mappings are stored in a single JSON file, making it trivial to maintain.

## How It Works

1. The app reads `public/redirects.json` at build time.
2. Visiting `your-domain.com/github` redirects to the mapped URL.
3. Unknown paths return a 404 page.
4. The root path `/` redirects to the `default` URL, if configured.

## Configuration

Edit `public/redirects.json` to manage your redirects. Nested keys are supported for organization:

```json
{
  "default": "https://example.com",
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
| `/` | `default` value |
| `/github` | `https://github.com/yourname` |
| `/social/linkedin` | `https://linkedin.com/in/yourname` |

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
