# Forecast4U

Instant, accurate U.S. weather for any ZIP code — no API key required.  
Built with React 18, Vite, TypeScript, Tailwind CSS, and IBM Carbon Design System aesthetics.  
Weather data is sourced from the free [Open-Meteo](https://open-meteo.com) API.

---

## Features

- Search current conditions and a **5-day hourly forecast** (3-hour intervals) by any U.S. 5-digit ZIP code
- Dynamic weather-themed gradient backgrounds that shift based on conditions (clear, rain, snow, thunderstorm, fog, etc.)
- **Hourly forecast** — each day displays 8 time slots (12 AM, 3 AM, 6 AM … 9 PM) in a horizontally scrollable strip, with temperature, weather icon, and precipitation probability per slot
- **"Now" highlighting** — the current 3-hour window is automatically highlighted in the forecast
- **Manual Refresh** — a Refresh button in the forecast header re-fetches live data without a page reload
- **Recent Searches** — last 5 searched ZIP codes persisted in `localStorage`, displayed as dismissible filter tags below the search bar
- **Contact Support** ghost button in the header (Carbon Design System style, with LifeBuoy icon)
- Fully responsive — mobile through desktop
- 112 Vitest unit tests across 7 test files

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

112 tests run in Vitest with jsdom — no browser and no network required.

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

| Host | How to enable |
|---|---|
| GitHub Pages | Add a `404.html` that is a copy of `index.html` |
| Surge | The default behaviour already handles this |
| AWS S3 + CloudFront | Set the error page to `/index.html` with HTTP 200 |
| Apache | Add `FallbackResource /index.html` to `.htaccess` |
| Nginx | Add `try_files $uri /index.html;` to the `location` block |

---

### Option D — Node.js / VPS (full-stack)

```bash
pnpm install --prod
pnpm build
pnpm start   # listens on PORT env var, defaults to 8080
```

---

## Project Structure

```
forecast4u/
├── client/
│   ├── components/
│   │   ├── AppHeader.tsx              # Sticky nav + Contact Support button
│   │   ├── AppHeader.spec.tsx         # Header unit tests
│   │   ├── ZipSearch.tsx              # ZIP input, validation, onSearch callback
│   │   ├── ZipSearch.spec.tsx         # ZipSearch unit tests
│   │   ├── CurrentWeatherDisplay.tsx  # Hero weather card with gradient + glow
│   │   ├── ForecastGrid.tsx           # 5-day hourly grid (3-hour slots)
│   │   ├── ForecastGrid.spec.tsx      # ForecastGrid unit tests
│   │   ├── WeatherIcon.tsx            # WMO code → Lucide icon + glow/gradient helpers
│   │   └── WeatherSkeleton.tsx        # Loading skeleton matching hourly layout
│   ├── hooks/
│   │   ├── useWeather.ts              # Geocoding + hourly forecast fetching
│   │   ├── useWeather.spec.ts         # useWeather unit tests (fetch mocked)
│   │   ├── useRecentSearches.ts       # localStorage ZIP history (max 5)
│   │   └── useRecentSearches.spec.ts  # useRecentSearches unit tests
│   ├── pages/
│   │   ├── Index.tsx                  # Homepage: search + recent + popular locations
│   │   ├── Weather.tsx                # /weather/:zip dashboard + refresh mechanic
│   │   └── Weather.spec.tsx           # Weather page unit tests
│   ├── main.tsx                       # App entry point (createRoot)
│   ├── App.tsx                        # Routes + providers
│   └── global.css                     # IBM Plex Sans font + Tailwind theme
├── server/                            # Express API (minimal)
├── netlify/functions/                 # Netlify serverless adapter
├── netlify.toml
├── AGENTS.md                          # Agent automation rules (mandatory testing rule)
└── vite.config.ts
```

---

## No API Key Needed

Forecast4U uses two completely free, no-auth APIs:

| API | Purpose |
|---|---|
| [Open-Meteo Geocoding](https://geocoding-api.open-meteo.com) | ZIP code → latitude/longitude |
| [Open-Meteo Forecast](https://api.open-meteo.com) | Hourly conditions for 5 days |

Both APIs are called directly from the browser — nothing to configure.

---

## Changelog (since initial README)

All changes made after the first README was published (`30c0853`):

### UI & Design

| Change | Details |
|---|---|
| Dark atmospheric homepage | Deep `#0d1117` background, IBM Blue radial glow, perspective grid overlay |
| Dynamic weather gradients | Hero background shifts based on WMO weather code (clear → warm blue, rain → deep blue, thunder → violet, etc.) |
| Glowing weather icon | Large icon with a radial color-matched glow in the current weather hero |
| Frosted glass stat cards | Humidity, wind, and feels-like displayed as `backdrop-blur` glass tiles |
| Hourly forecast layout | Replaced daily cards with horizontally scrollable 3-hour slot cards per day |
| "Now" slot highlighting | Current 3-hour window highlighted in IBM Blue in the forecast strip |
| High/low range per day | Each day header shows today's high and low temperature summary |
| Precipitation probability | Each hourly card shows rain chance with a droplet icon |
| Contact Support button | Carbon ghost-style button with `LifeBuoy` icon in the header (desktop + mobile menu) |
| Improved search input | Font size normalised across light and dark variants (`text-base` / `text-sm`) |

### Features

| Change | Details |
|---|---|
| Recent Searches | Last 5 ZIPs saved to `localStorage`; shown as dismissible filter tags (Carbon style) below the search bar |
| Manual Refresh | Refresh button in forecast header re-fetches geocoding + weather without a page reload; icon spins while in-flight |
| Retry on error | Error state Retry button uses the same refresh mechanic instead of `window.location.reload()` |
| Hourly API switch | Switched from Open-Meteo `daily` to `hourly` endpoint; filters to every 3rd hour (8 slots/day × 5 days = 40 data points) |
| `onSearch` callback | `ZipSearch` fires an `onSearch(zip)` prop before navigating, enabling side-effects like `addRecentZip` |
| `refreshKey` in `useWeather` | Hook accepts a numeric `refreshKey`; incrementing it re-runs the fetch effect |

### Bug Fixes

| Fix | Root cause |
|---|---|
| `createRoot` double-call warning | `App.tsx` was both the entry point and the component file; split into `main.tsx` (entry) + `App.tsx` (component export) for clean HMR |
| `useNavigate is not defined` | Stray `const navigate = useNavigate()` call left after its import was removed |
| `Cannot read properties of undefined ('flatMap' / 'map')` | `ForecastGrid` called array methods on `hourlyByDay` before data arrived; fixed with `= []` default prop and `?? []` guards |
| React Router v7 warnings | Added `future={{ v7_startTransition, v7_relativeSplatPath }}` flags to `BrowserRouter` |

### Testing

| File | Tests | What's covered |
|---|---|---|
| `ZipSearch.spec.tsx` | 18 | Rendering, input sanitisation, validation errors, navigation, `onSearch` callback, localStorage write |
| `useRecentSearches.spec.ts` | 14 | localStorage hydration, prepend, dedup, 5-item cap, removal |
| `useWeather.spec.ts` | 25 | Loading state, success data shape (hourly slots, 8 per day, "Today" label), geocoding/weather API failures, invalid ZIP short-circuit, `refreshKey` re-fetch |
| `ForecastGrid.spec.tsx` | 13 | Section heading, day rows, "Now" slot, precip probability, Refresh button presence/click/disabled |
| `Weather.spec.tsx` | 22 | Loading/error/success states, addRecentZip persistence, refresh mechanic, sub-nav ZIP input, "Live data" indicator |
| `AppHeader.spec.tsx` | 16 | Brand, nav links, Contact Support (href, icon, aria-label), ZIP quick search, mobile menu open/close |
| `utils.spec.ts` | 5 | `cn()` class merging utility |
| **Total** | **112** | |

### Developer Experience

| Change | Details |
|---|---|
| Mandatory Testing Rule | Added to `AGENTS.md`: every component/hook change must include a co-located `.spec.tsx` update verified with `pnpm test` |
| `test-setup.ts` | Imports `@testing-library/jest-dom` for DOM matchers |
| Vitest `jsdom` environment | Configured in `vite.config.ts` so all tests run without a browser |

---

## License

MIT
