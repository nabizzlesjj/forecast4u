import WeatherIcon, { getWeatherColor } from "./WeatherIcon";
import type { DayForecast } from "../hooks/useWeather";

interface ForecastGridProps {
  forecast: DayForecast[];
}

export default function ForecastGrid({ forecast }: ForecastGridProps) {
  return (
    <div className="bg-white border-t border-carbon-gray-20 animate-slide-up">
      <div className="px-6 py-4 border-b border-carbon-gray-20">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-carbon-gray-60">
          5-Day Forecast
        </h2>
      </div>
      <div className="grid grid-cols-5 divide-x divide-carbon-gray-20">
        {forecast.map((day) => (
          <ForecastCard key={day.date} day={day} />
        ))}
      </div>
    </div>
  );
}

function ForecastCard({ day }: { day: DayForecast }) {
  const iconColor = getWeatherColor(day.weatherCode);
  const range = day.maxTemp - day.minTemp;

  return (
    <div className="flex flex-col items-center py-6 px-2 gap-3 hover:bg-carbon-gray-10 transition-colors group">
      {/* Day name */}
      <span className="text-xs font-semibold uppercase tracking-widest text-carbon-gray-60">
        {day.dayName}
      </span>

      {/* Weather icon */}
      <div className={`${iconColor} transition-transform group-hover:scale-110`}>
        <WeatherIcon code={day.weatherCode} size={32} />
      </div>

      {/* Weather label */}
      <span className="text-xs text-carbon-gray-60 text-center leading-tight hidden sm:block">
        {day.weatherLabel}
      </span>

      {/* Temperature range */}
      <div className="flex flex-col items-center gap-1 w-full">
        <div className="flex items-center justify-between w-full px-1">
          <span className="text-xs text-carbon-gray-50 hidden sm:inline">Lo</span>
          <span className="text-sm font-medium text-carbon-gray-60 tabular-nums">
            {day.minTemp}°
          </span>
        </div>

        {/* Temperature bar */}
        <div className="w-full h-1 bg-carbon-gray-20 overflow-hidden">
          <div
            className="h-full bg-carbon-blue-60"
            style={{ width: `${Math.max(20, Math.min(100, (range / 40) * 100))}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full px-1">
          <span className="text-xs text-carbon-gray-50 hidden sm:inline">Hi</span>
          <span className="text-sm font-semibold text-carbon-gray-100 tabular-nums">
            {day.maxTemp}°
          </span>
        </div>
      </div>
    </div>
  );
}
