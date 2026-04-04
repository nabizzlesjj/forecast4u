import { Droplets, Wind, Thermometer, MapPin } from "lucide-react";
import WeatherIcon, {
  getWeatherColor,
  getWeatherGlow,
  getWeatherGradient,
} from "./WeatherIcon";
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
  const glowColor = getWeatherGlow(current.weatherCode);
  const [gradFrom, gradTo] = getWeatherGradient(current.weatherCode, current.isDay);

  return (
    <div
      className="relative overflow-hidden text-white"
      style={{ background: `linear-gradient(160deg, ${gradFrom} 0%, ${gradTo} 100%)` }}
    >
      {/* Subtle radial glow behind icon */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 70% 40%, ${glowColor}, transparent)`,
        }}
      />

      <div className="relative px-6 sm:px-12 pt-10 pb-8">
        {/* Location pill */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full mb-8">
          <MapPin size={13} className="text-white/60 flex-shrink-0" />
          <span className="text-white/80 text-sm font-medium">{locationName}</span>
          <span className="text-white/30 text-xs">·</span>
          <span className="font-mono text-white/50 text-xs">{zip}</span>
        </div>

        {/* Main content row */}
        <div className="flex items-center justify-between gap-6">
          {/* Left: temperature + label */}
          <div className="flex flex-col">
            <div className="flex items-start">
              <span className="text-[7rem] sm:text-[9rem] font-extralight leading-none tabular-nums tracking-tighter">
                {current.temperature}
              </span>
              <span className="text-3xl text-white/40 mt-4 ml-1">°F</span>
            </div>
            <p className="text-white/70 text-xl font-light mt-1">{current.weatherLabel}</p>
            <p className="text-white/40 text-sm mt-1">Feels like {current.feelsLike}°F</p>
          </div>

          {/* Right: icon with glow disc */}
          <div className="flex-shrink-0 hidden sm:flex flex-col items-center gap-2">
            <div
              className={`flex items-center justify-center w-32 h-32 rounded-full ${iconColor}`}
              style={{
                background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                filter: "drop-shadow(0 0 24px currentColor)",
              }}
            >
              <WeatherIcon
                code={current.weatherCode}
                isDay={current.isDay}
                size={80}
              />
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 mt-8">
          <StatCard
            icon={<Droplets size={18} />}
            label="Humidity"
            value={`${current.humidity}%`}
          />
          <StatCard
            icon={<Wind size={18} />}
            label="Wind"
            value={`${current.windSpeed} mph`}
          />
          <StatCard
            icon={<Thermometer size={18} />}
            label="Feels Like"
            value={`${current.feelsLike}°`}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-white/50">
        {icon}
        <span className="text-xs uppercase tracking-wider font-medium">{label}</span>
      </div>
      <span className="text-2xl font-light tabular-nums text-white">{value}</span>
    </div>
  );
}
