import { Cloud, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ZipSearch from "../components/ZipSearch";

const FEATURED_LOCATIONS = [
  { zip: "10001", label: "New York City, NY" },
  { zip: "90210", label: "Beverly Hills, CA" },
  { zip: "60601", label: "Chicago, IL" },
  { zip: "77001", label: "Houston, TX" },
  { zip: "85001", label: "Phoenix, AZ" },
  { zip: "19101", label: "Philadelphia, PA" },
];

export default function Index() {
  return (
    <div className="min-h-[calc(100vh-48px)] flex flex-col">
      {/* Hero section */}
      <div className="bg-carbon-gray-100 flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        {/* Icon */}
        <div className="mb-8 relative">
          <div className="w-20 h-20 bg-carbon-blue-60 flex items-center justify-center">
            <Cloud size={40} className="text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-carbon-blue-40" />
        </div>

        {/* Headline */}
        <div className="text-center mb-3">
          <h1 className="text-4xl sm:text-6xl font-light text-white tracking-tight">
            Forecast<span className="text-carbon-blue-40 font-semibold">4U</span>
          </h1>
          <p className="text-carbon-gray-40 text-sm sm:text-base mt-3 max-w-sm mx-auto leading-relaxed">
            Instant, accurate weather for any U.S. ZIP code.
            <br />
            Powered by Open-Meteo.
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-xl mt-10">
          <ZipSearch size="large" placeholder="Enter 5-digit ZIP code (e.g. 10001)" />
        </div>

        {/* Tag */}
        <p className="text-carbon-gray-60 text-xs mt-4">
          United States ZIP codes only · No account required
        </p>
      </div>

      {/* Featured locations */}
      <div className="bg-carbon-gray-90">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-carbon-gray-50 mb-4 flex items-center gap-2">
            <MapPin size={12} />
            Featured Locations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-carbon-gray-80">
            {FEATURED_LOCATIONS.map((loc) => (
              <Link
                key={loc.zip}
                to={`/weather/${loc.zip}`}
                className="group flex items-center justify-between bg-carbon-gray-90 px-4 py-4 hover:bg-carbon-gray-80 transition-colors"
              >
                <div>
                  <span className="text-white text-sm group-hover:text-carbon-blue-30 transition-colors">
                    {loc.label}
                  </span>
                  <p className="font-mono text-carbon-gray-50 text-xs mt-0.5">{loc.zip}</p>
                </div>
                <ArrowRight
                  size={14}
                  className="text-carbon-gray-60 group-hover:text-carbon-blue-40 group-hover:translate-x-1 transition-all"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="bg-carbon-gray-100 border-t border-carbon-gray-80">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-carbon-gray-60 text-xs">
            © {new Date().getFullYear()} Forecast4U — Built with IBM Carbon Design System
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-carbon-gray-60 hover:text-carbon-blue-30 text-xs transition-colors"
            >
              Weather: Open-Meteo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
