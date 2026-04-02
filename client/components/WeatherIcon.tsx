import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Wind,
  CloudFog,
  CloudSun,
} from "lucide-react";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  size?: number;
  className?: string;
}

export default function WeatherIcon({
  code,
  isDay = true,
  size = 24,
  className = "",
}: WeatherIconProps) {
  const props = { size, className };

  // Clear
  if (code === 0) return isDay ? <Sun {...props} /> : <Sun {...props} />;
  // Mainly clear / partly cloudy
  if (code === 1 || code === 2) return <CloudSun {...props} />;
  // Overcast
  if (code === 3) return <Cloud {...props} />;
  // Fog
  if (code === 45 || code === 48) return <CloudFog {...props} />;
  // Drizzle
  if (code >= 51 && code <= 57) return <CloudDrizzle {...props} />;
  // Rain
  if (code >= 61 && code <= 67) return <CloudRain {...props} />;
  // Snow
  if (code >= 71 && code <= 77) return <CloudSnow {...props} />;
  // Showers
  if (code >= 80 && code <= 82) return <CloudRain {...props} />;
  // Snow showers
  if (code >= 85 && code <= 86) return <CloudSnow {...props} />;
  // Thunderstorm
  if (code >= 95) return <CloudLightning {...props} />;
  // Default
  return <Wind {...props} />;
}

// Get color class for weather code
export function getWeatherColor(code: number): string {
  if (code === 0 || code === 1) return "text-amber-400";
  if (code === 2 || code === 3) return "text-carbon-gray-40";
  if (code === 45 || code === 48) return "text-carbon-gray-50";
  if (code >= 51 && code <= 57) return "text-carbon-cyan-40";
  if (code >= 61 && code <= 67) return "text-carbon-cyan-40";
  if (code >= 71 && code <= 77) return "text-carbon-blue-30";
  if (code >= 80 && code <= 86) return "text-carbon-cyan-40";
  if (code >= 95) return "text-carbon-purple-40";
  return "text-carbon-gray-40";
}
