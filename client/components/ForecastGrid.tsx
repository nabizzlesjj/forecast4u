import { RefreshCw } from "lucide-react";
import WeatherIcon, { getWeatherColor, getWeatherGlow } from "./WeatherIcon";
import type { DayForecast } from "../hooks/useWeather";

interface ForecastGridProps {
  forecast: DayForecast[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function ForecastGrid({
  forecast,
  onRefresh,
  isRefreshing = false,
}: ForecastGridProps) {
  const allTemps = forecast.flatMap((d) => [d.minTemp, d.maxTemp]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);

  return (
    <div
      className="animate-slide-up"
      style={{ background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)" }}
    >
      {/* Section header */}
      <div className="px-6 sm:px-12 pt-6 pb-4 flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/30">
          5-Day Forecast
        </span>
        <div className="flex-1 h-px bg-white/10" />

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh forecast"
            title="Refresh forecast"
            className="flex items-center gap-1.5 text-white/30 hover:text-white/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors group"
          >
            <RefreshCw
              size={13}
              className={isRefreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}
            />
            <span className="text-[11px] uppercase tracking-widest hidden sm:inline">
              Refresh
            </span>
          </button>
        )}
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-5 gap-2 px-4 sm:px-8 pb-8">
        {forecast.map((day, i) => (
          <ForecastCard
            key={day.date}
            day={day}
            globalMin={globalMin}
            globalMax={globalMax}
            isToday={i === 0}
          />
        ))}
      </div>
    </div>
  );
}

function ForecastCard({
  day,
  globalMin,
  globalMax,
  isToday,
}: {
  day: DayForecast;
  globalMin: number;
  globalMax: number;
  isToday: boolean;
}) {
  const iconColor = getWeatherColor(day.weatherCode);
  const glowColor = getWeatherGlow(day.weatherCode);
  const range = globalMax - globalMin || 1;
  const lowPct = ((day.minTemp - globalMin) / range) * 100;
  const highPct = ((day.maxTemp - globalMin) / range) * 100;

  return (
    <div
      className={`
        group relative flex flex-col items-center gap-3 rounded-2xl px-2 py-5
        border transition-all duration-200 cursor-default
        ${isToday
          ? "bg-white/10 border-white/20 shadow-lg"
          : "bg-white/5 border-white/8 hover:bg-white/10 hover:border-white/15"
        }
      `}
    >
      {isToday && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-carbon-blue-60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Now
        </span>
      )}

      <span className={`text-xs font-semibold uppercase tracking-widest ${isToday ? "text-white" : "text-white/40"}`}>
        {day.dayName}
      </span>

      <div
        className={`${iconColor} transition-transform duration-200 group-hover:scale-110`}
        style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
      >
        <WeatherIcon code={day.weatherCode} size={36} />
      </div>

      <span className="text-[10px] text-white/35 text-center leading-tight hidden sm:block min-h-[2.5em]">
        {day.weatherLabel}
      </span>

      <div className="w-full flex flex-col items-center gap-1.5 mt-1">
        <span className="text-sm font-semibold text-white tabular-nums">
          {day.maxTemp}°
        </span>

        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              marginLeft: `${lowPct}%`,
              width: `${Math.max(highPct - lowPct, 8)}%`,
              background: "linear-gradient(90deg, #60a5fa, #fbbf24)",
            }}
          />
        </div>

        <span className="text-sm text-white/40 tabular-nums">{day.minTemp}°</span>
      </div>
    </div>
  );
}
