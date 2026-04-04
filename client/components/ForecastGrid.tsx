import WeatherIcon, { getWeatherColor, getWeatherGlow } from "./WeatherIcon";
import type { DayForecast } from "../hooks/useWeather";

interface ForecastGridProps {
  forecast: DayForecast[];
}

export default function ForecastGrid({ forecast }: ForecastGridProps) {
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
      {/* Today badge */}
      {isToday && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-carbon-blue-60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Now
        </span>
      )}

      {/* Day label */}
      <span className={`text-xs font-semibold uppercase tracking-widest ${isToday ? "text-white" : "text-white/40"}`}>
        {day.dayName}
      </span>

      {/* Icon with subtle glow */}
      <div
        className={`${iconColor} transition-transform duration-200 group-hover:scale-110`}
        style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
      >
        <WeatherIcon code={day.weatherCode} size={36} />
      </div>

      {/* Weather label */}
      <span className="text-[10px] text-white/35 text-center leading-tight hidden sm:block min-h-[2.5em]">
        {day.weatherLabel}
      </span>

      {/* Temp range */}
      <div className="w-full flex flex-col items-center gap-1.5 mt-1">
        {/* High temp */}
        <span className="text-sm font-semibold text-white tabular-nums">
          {day.maxTemp}°
        </span>

        {/* Gradient bar showing relative position in overall range */}
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

        {/* Low temp */}
        <span className="text-sm text-white/40 tabular-nums">{day.minTemp}°</span>
      </div>
    </div>
  );
}
