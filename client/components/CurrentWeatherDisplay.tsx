import { Droplets, Wind, Thermometer, MapPin } from "lucide-react";
import WeatherIcon, { getWeatherColor } from "./WeatherIcon";
import type { CurrentWeatherData } from "../hooks/useWeather";

interface CurrentWeatherDisplayProps {
  current: CurrentWeatherData;
  locationName: string;
  zip: string;
}

export default function CurrentWeatherDisplay({
  current,
  locationName,
  zip,
}: CurrentWeatherDisplayProps) {
  const iconColor = getWeatherColor(current.weatherCode);

  return (
    <div className="bg-carbon-gray-100 text-white p-8 sm:p-12 animate-fade-in">
      {/* Location */}
      <div className="flex items-center gap-2 mb-6">
        <MapPin size={16} className="text-carbon-blue-40" />
        <span className="text-carbon-gray-30 text-sm">
          {locationName}
        </span>
        <span className="text-carbon-gray-60 text-sm">·</span>
        <span className="font-mono text-carbon-gray-40 text-sm">{zip}</span>
      </div>

      {/* Main temperature display */}
      <div className="flex items-start gap-6 sm:gap-10">
        <div>
          <div className="flex items-end gap-2">
            <span className="text-7xl sm:text-9xl font-light leading-none tabular-nums">
              {current.temperature}
            </span>
            <span className="text-3xl sm:text-4xl text-carbon-gray-40 pb-2">°F</span>
          </div>
          <p className="text-carbon-gray-30 text-lg mt-2">{current.weatherLabel}</p>
          <p className="text-carbon-gray-50 text-sm mt-1">
            Feels like {current.feelsLike}°F
          </p>
        </div>

        {/* Icon */}
        <div className={`hidden sm:flex items-center justify-center mt-2 ${iconColor}`}>
          <WeatherIcon
            code={current.weatherCode}
            isDay={current.isDay}
            size={96}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 mt-10 border-t border-carbon-gray-80">
        <StatItem
          icon={<Droplets size={16} />}
          label="Humidity"
          value={`${current.humidity}%`}
        />
        <StatItem
          icon={<Wind size={16} />}
          label="Wind Speed"
          value={`${current.windSpeed} mph`}
        />
        <StatItem
          icon={<Thermometer size={16} />}
          label="Feels Like"
          value={`${current.feelsLike}°F`}
        />
      </div>
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 py-4 pr-6 border-r border-carbon-gray-80 last:border-r-0">
      <div className="flex items-center gap-2 text-carbon-gray-40">
        {icon}
        <span className="text-xs uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-xl font-light text-white tabular-nums">{value}</span>
    </div>
  );
}
