import { Cloud, ArrowRight, Wind, Droplets, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import ZipSearch from "../components/ZipSearch";

const FEATURED_LOCATIONS = [
  { zip: "10001", label: "New York City", state: "NY", icon: <Wind size={14} /> },
  { zip: "90210", label: "Beverly Hills", state: "CA", icon: <Sun size={14} /> },
  { zip: "60601", label: "Chicago", state: "IL", icon: <Wind size={14} /> },
  { zip: "77001", label: "Houston", state: "TX", icon: <Sun size={14} /> },
  { zip: "85001", label: "Phoenix", state: "AZ", icon: <Sun size={14} /> },
  { zip: "19101", label: "Philadelphia", state: "PA", icon: <Droplets size={14} /> },
];

export default function Index() {
  return (
    <div
      className="min-h-[calc(100vh-48px)] flex flex-col"
      style={{ background: "#0d1117" }}
    >
      {/* Hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        {/* Atmospheric glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 35%, rgba(15,98,254,0.18) 0%, transparent 70%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-2xl">
          {/* Icon */}
          <div className="relative mb-8">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #0f62fe 0%, #0043ce 100%)",
                boxShadow: "0 0 60px rgba(15,98,254,0.4), 0 0 120px rgba(15,98,254,0.15)",
              }}
            >
              <Cloud size={44} className="text-white" />
            </div>
            {/* Decorative dot */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-carbon-blue-40 rounded-sm" />
          </div>

          {/* Brand */}
          <h1 className="text-5xl sm:text-7xl font-extralight text-white tracking-tight mb-3">
            Forecast<span className="text-carbon-blue-40 font-semibold">4U</span>
          </h1>
          <p className="text-white/35 text-base sm:text-lg max-w-sm leading-relaxed mb-10">
            Instant, accurate U.S. weather by ZIP code.
          </p>

          {/* Search */}
          <div className="w-full max-w-lg">
            <ZipSearch
              size="large"
              variant="dark"
              placeholder="Enter a 5-digit ZIP code..."
            />
          </div>

          <p className="text-white/20 text-xs mt-4 tracking-wide">
            United States only · No account required
          </p>
        </div>
      </div>

      {/* Featured locations */}
      <div className="border-t border-white/8 bg-[#0d1117]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-5">
            Popular locations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FEATURED_LOCATIONS.map((loc) => (
              <Link
                key={loc.zip}
                to={`/weather/${loc.zip}`}
                className="group relative flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 rounded-xl px-4 py-4 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="text-white/25 group-hover:text-carbon-blue-40 transition-colors">
                    {loc.icon}
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                      {loc.label}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">
                      <span className="font-mono">{loc.zip}</span>
                      <span className="mx-1">·</span>
                      {loc.state}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className="text-white/20 group-hover:text-carbon-blue-40 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/8 px-4 sm:px-8 py-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} Forecast4U
          </p>
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/20 hover:text-white/50 text-xs transition-colors"
          >
            Weather data by Open-Meteo
          </a>
        </div>
      </div>
    </div>
  );
}
