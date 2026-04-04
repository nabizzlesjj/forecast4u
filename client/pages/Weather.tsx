import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { useRecentSearches } from "../hooks/useRecentSearches";
import { AlertCircle, ArrowLeft, RefreshCw, Wifi } from "lucide-react";
import { useWeather } from "../hooks/useWeather";
import CurrentWeatherDisplay from "../components/CurrentWeatherDisplay";
import ForecastGrid from "../components/ForecastGrid";
import WeatherSkeleton from "../components/WeatherSkeleton";
import ZipSearch from "../components/ZipSearch";

export default function Weather() {
  const { zip = "" } = useParams<{ zip: string }>();
  const state = useWeather(zip);
  const { addRecentZip } = useRecentSearches();
  const navigate = useNavigate();

  // Save to recent searches whenever a ZIP resolves successfully
  useEffect(() => {
    if (state.status === "success") addRecentZip(zip);
  }, [state.status, zip]);

  return (
    <div className="min-h-[calc(100vh-48px)] flex flex-col bg-[#0d1117]">
      {/* Sub-nav */}
      <div className="bg-[#161b22] border-b border-white/8 px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-white/40 hover:text-white/80 text-sm transition-colors flex-shrink-0"
        >
          <ArrowLeft size={14} />
          <span>Home</span>
        </Link>

        <div className="hidden sm:block w-px h-4 bg-white/10 mx-1" />

        <div className="flex-1 w-full sm:w-auto sm:max-w-xs">
          <ZipSearch
            initialZip={zip}
            placeholder="Search another ZIP..."
            variant="dark"
            onSearch={addRecentZip}
          />
        </div>

        {state.status === "success" && (
          <div className="hidden sm:flex items-center gap-1.5 ml-auto text-emerald-400/70 text-xs">
            <Wifi size={12} />
            <span>Live data</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        {state.status === "loading" && (
          <div className="max-w-4xl mx-auto">
            <WeatherSkeleton />
          </div>
        )}

        {state.status === "error" && (
          <div className="max-w-2xl mx-auto p-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  Unable to Load Weather
                </h2>
                <p className="text-white/40 text-sm max-w-sm leading-relaxed">
                  {state.message}
                </p>
              </div>
              <div className="flex gap-3 mt-1">
                <Link
                  to="/"
                  className="flex items-center gap-2 border border-white/15 px-4 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} />
                  Try Another ZIP
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 bg-carbon-blue-60 hover:bg-carbon-blue-70 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <RefreshCw size={14} />
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {state.status === "success" && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <CurrentWeatherDisplay
              current={state.data.current}
              locationName={state.data.locationName}
              zip={state.data.zip}
            />

            <ForecastGrid forecast={state.data.forecast} />

            {/* Attribution */}
            <div className="px-6 sm:px-12 py-4 flex items-center justify-between">
              <p className="text-white/20 text-xs">
                Weather by{" "}
                <a
                  href="https://open-meteo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white/70 transition-colors"
                >
                  Open-Meteo
                </a>
              </p>
              <span className="font-mono text-white/15 text-xs">{zip}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
