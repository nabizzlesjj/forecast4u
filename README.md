# Forecast4U

Instant, accurate U.S. weather for any ZIP code — no API key required.  
Built with React 18, Vite, TypeScript, Tailwind CSS, and IBM Carbon Design System aesthetics.  
Weather data is sourced from the free [Open-Meteo](https://open-meteo.com) API.

---

## Features

- Search current conditions and a 5-day forecast by any U.S. 5-digit ZIP code
- Dynamic weather-themed gradient backgrounds (clear, rain, snow, thunderstorm, etc.)
- Recent Searches — last 5 ZIPs persisted in `localStorage`, dismissible tags
- Fully responsive — mobile through desktop
- 57 Vitest unit tests (ZipSearch, useRecentSearches, useWeather)

---

## Requirements

| Tool | Minimum version |
|---|---|
| Node.js | 18.x |
| pnpm | 9.x or 10.x |

> **npm or yarn also work** — just replace `pnpm` with `npm` or `yarn` in any command below.

---

## Quick Start (local development)

```bash
# 1. Clone the repository
git clone https://github.com/nabizzlesjj/forecast4u.git
cd forecast4u

# 2. Install dependencies
pnpm install

# 3. Start the dev server (client + Express API on the same port)
pnpm dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.  
The dev server supports full hot-module replacement — changes appear instantly.

---

## Running Tests

```bash
pnpm test
# or
npm test
```

All 57 tests run in Vitest with jsdom — no browser and no network required.

---

## Production Build

```bash
pnpm build
```

This runs two steps back-to-back:

| Step | Command | Output |
|---|---|---|
| Client (SPA) | `vite build` | `dist/spa/` |
| Server | `vite build --config vite.config.server.ts` | `dist/server/` |

Start the production server locally to verify the build:

```bash
pnpm start
# → http://localhost:8080
```

---

## Deploying to a Web Host

### Option A — Netlify (recommended, one command)

The repository includes a `netlify.toml` that is pre-configured.

1. Install the [Netlify CLI](https://docs.netlify.com/cli/get-started/):
   ```bash
   npm install -g netlify-cli
   ```
2. Log in and deploy:
   ```bash
   netlify login
   netlify deploy --prod
   ```
   Netlify will detect `netlify.toml` automatically.  
   Build command: `npm run build:client` · Publish directory: `dist/spa`

Alternatively, connect the GitHub repository in the Netlify dashboard — every push to `main` will deploy automatically.

---

### Option B — Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

When prompted:
- **Build command:** `pnpm build:client`
- **Output directory:** `dist/spa`
- **Install command:** `pnpm install`

Add a `vercel.json` at the project root to enable client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

### Option C — Any static host (GitHub Pages, Surge, S3, etc.)

Forecast4U's UI is a pure SPA — only the `dist/spa/` folder needs to be served.

```bash
pnpm build:client
# Upload / deploy the contents of dist/spa/
```

**Important:** configure your host to redirect all requests to `index.html` so that React Router handles client-side navigation (e.g. `/weather/30301`).  
Most hosts call this a **"SPA redirect"** or **"fallback to index.html"** setting.

| Host | How to enable |
|---|---|
| GitHub Pages | Add a `404.html` that is a copy of `index.html` |
| Surge | The default behaviour already handles this |
| AWS S3 + CloudFront | Set the error page to `/index.html` with HTTP 200 |
| Apache | Add `FallbackResource /index.html` to `.htaccess` |
| Nginx | Add `try_files $uri /index.html;` to the `location` block |

---

### Option D — Node.js / VPS (full-stack)

Run the bundled Express server directly on any Node-capable host (Railway, Render, Fly.io, a plain VPS, etc.):

```bash
# Install dependencies
pnpm install --prod

# Build both client and server
pnpm build

# Start
pnpm start   # listens on PORT env var, defaults to 8080
```

Set the `PORT` environment variable if your host assigns a different port:

```bash
PORT=3000 pnpm start
```

---

## Project Structure

```
forecast4u/
├── client/                  # React SPA
│   ├── components/          # Shared UI components
│   │   ├── AppHeader.tsx    # Sticky nav bar
│   │   ├── ZipSearch.tsx    # ZIP input + validation
│   │   ├── CurrentWeatherDisplay.tsx
│   │   ├── ForecastGrid.tsx # 5-day forecast cards
│   │   └── WeatherIcon.tsx  # WMO code → Lucide icon
│   ├── hooks/
│   │   ├── useWeather.ts    # Geocoding + forecast fetching
│   │   └── useRecentSearches.ts  # localStorage history
│   ├── pages/
│   │   ├── Index.tsx        # Homepage / search
│   │   └── Weather.tsx      # /weather/:zip dashboard
│   └── App.tsx              # Routes
├── server/                  # Express API (minimal)
├── netlify/functions/       # Netlify serverless adapter
├── netlify.toml
└── vite.config.ts
```

---

## No API Key Needed

Forecast4U uses two completely free, no-auth APIs:

| API | Purpose |
|---|---|
| [Open-Meteo Geocoding](https://geocoding-api.open-meteo.com) | ZIP code → latitude/longitude |
| [Open-Meteo Forecast](https://api.open-meteo.com) | Current conditions + 5-day forecast |

Both APIs are called directly from the browser — there is nothing to configure.

---

## License

MIT
