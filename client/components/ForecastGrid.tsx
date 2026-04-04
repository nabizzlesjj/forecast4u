import { RefreshCw, Droplets } from "lucide-react";
import WeatherIcon, { getWeatherColor, getWeatherGlow } from "./WeatherIcon";
import type { DayGroup, HourlySlot } from "../hooks/useWeather";

interface ForecastGridProps {
  hourlyByDay: DayGroup[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function ForecastGrid({
  hourlyByDay,
  onRefresh,
  isRefreshing = false,
}: ForecastGridProps) {
  return (
    <div
      className="animate-slide-up"
      style={{ background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)" }}
    >
      {/* Section header */}
      <div className="px-6 sm:px-8 pt-6 pb-2 flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/30">
          5-Day Hourly Forecast
        </span>
        <div className="flex-1 h-px bg-white/10" />

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
              className={
                isRefreshing
                  ? "animate-spin"
                  : "group-hover:rotate-180 transition-transform duration-500"
              }
            />
            <span className="text-[11px] uppercase tracking-widest hidden sm:inline">
              Refresh
            </span>
          </button>
        )}
      </div>

      {/* Day rows */}
      <div className="pb-6 space-y-1">
        {hourlyByDay.map((day) => (
          <DayRow key={day.date} day={day} />
        ))}
      </div>
    </div>
  );
}

// ── Day row ───────────────────────────────────────────────────────────────────

function DayRow({ day }: { day: DayGroup }) {
  const high = Math.max(...day.slots.map((s) => s.temperature));
  const low  = Math.min(...day.slots.map((s) => s.temperature));

  return (
    <div className="px-4 sm:px-8">
      {/* Day header */}
      <div className="flex items-baseline justify-between py-2 border-b border-white/8 mb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
          {day.dayName}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/25">{day.dateLabel}</span>
          <span className="text-xs text-white/25">
            <span className="text-white/50 font-medium">{high}°</span>
            {" / "}
            {low}°
          </span>
        </div>
      </div>

      {/* Horizontal scroll strip */}
      <div
        className="flex gap-2 overflow-x-auto pb-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {day.slots.map((slot) => (
          <HourCard key={slot.time} slot={slot} />
        ))}
      </div>
    </div>
  );
}

// ── Individual 3-hour card ────────────────────────────────────────────────────

function HourCard({ slot }: { slot: HourlySlot }) {
  const iconColor = getWeatherColor(slot.weatherCode);
  const glowColor = getWeatherGlow(slot.weatherCode);

  return (
    <div
      className={`
        flex-shrink-0 flex flex-col items-center gap-1.5 rounded-xl px-3 py-3 w-[72px]
        border transition-all duration-150
        ${slot.isNow
          ? "bg-carbon-blue-60/20 border-carbon-blue-40/40 shadow-lg"
          : "bg-white/5 border-white/8 hover:bg-white/10 hover:border-white/15"
        }
      `}
    >
      {/* Time label */}
      <span
        className={`text-[10px] font-semibold uppercase tracking-wide ${
          slot.isNow ? "text-carbon-blue-30" : "text-white/40"
        }`}
      >
        {slot.isNow ? "Now" : slot.hour}
      </span>

      {/* Weather icon */}
      <div
        className={iconColor}
        style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
      >
        <WeatherIcon code={slot.weatherCode} size={22} />
      </div>

      {/* Temperature */}
      <span className="text-sm font-semibold text-white tabular-nums">
        {slot.temperature}°
      </span>

      {/* Precip probability */}
      <div className="flex items-center gap-0.5">
        <Droplets size={9} className="text-sky-400/70" />
        <span className="text-[10px] text-white/35 tabular-nums">
          {slot.precipProb}%
        </span>
      </div>
    </div>
  );
}
