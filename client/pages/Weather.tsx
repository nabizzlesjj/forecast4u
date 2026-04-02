import { useParams, Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useWeather } from "../hooks/useWeather";
import CurrentWeatherDisplay from "../components/CurrentWeatherDisplay";
import ForecastGrid from "../components/ForecastGrid";
import WeatherSkeleton from "../components/WeatherSkeleton";
import ZipSearch from "../components/ZipSearch";

export default function Weather() {
  const { zip = "" } = useParams<{ zip: string }>();
  const state = useWeather(zip);

  return (
    <div className="min-h-[calc(100vh-48px)] flex flex-col bg-carbon-gray-10">
      {/* Top nav bar */}
      <div className="bg-white border-b border-carbon-gray-20 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-carbon-gray-60 hover:text-carbon-blue-60 text-sm transition-colors flex-shrink-0"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </Link>

        <div className="flex-1 w-full sm:w-auto sm:max-w-sm">
          <ZipSearch initialZip={zip} placeholder="Change ZIP code..." />
        </div>

        {state.status === "success" && (
          <span className="text-xs text-carbon-gray-50 ml-auto hidden sm:block">
            Live weather data
          </span>
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
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white border border-red-200 p-8 flex flex-col items-center text-center gap-4">
              <AlertCircle size={40} className="text-red-500" />
              <div>
                <h2 className="text-lg font-semibold text-carbon-gray-100 mb-2">
                  Unable to Load Weather
                </h2>
                <p className="text-carbon-gray-60 text-sm max-w-sm">
                  {state.message}
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <Link
                  to="/"
                  className="flex items-center gap-2 border border-carbon-gray-30 px-4 py-2 text-sm text-carbon-gray-70 hover:bg-carbon-gray-10 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Try Another ZIP
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 bg-carbon-blue-60 text-white px-4 py-2 text-sm hover:bg-carbon-blue-70 transition-colors"
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
            {/* Current weather */}
            <CurrentWeatherDisplay
              current={state.data.current}
              locationName={state.data.locationName}
              zip={state.data.zip}
            />

            {/* 5-day forecast */}
            <ForecastGrid forecast={state.data.forecast} />

            {/* Data attribution */}
            <div className="px-4 py-4 flex items-center justify-between">
              <p className="text-carbon-gray-50 text-xs">
                Data provided by{" "}
                <a
                  href="https://open-meteo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-carbon-blue-60 hover:underline"
                >
                  Open-Meteo
                </a>{" "}
                · Updates automatically
              </p>
              <span className="font-mono text-carbon-gray-40 text-xs">{zip}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
