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

  if (code === 0) return <Sun {...props} />;
  if (code === 1 || code === 2) return <CloudSun {...props} />;
  if (code === 3) return <Cloud {...props} />;
  if (code === 45 || code === 48) return <CloudFog {...props} />;
  if (code >= 51 && code <= 57) return <CloudDrizzle {...props} />;
  if (code >= 61 && code <= 67) return <CloudRain {...props} />;
  if (code >= 71 && code <= 77) return <CloudSnow {...props} />;
  if (code >= 80 && code <= 82) return <CloudRain {...props} />;
  if (code >= 85 && code <= 86) return <CloudSnow {...props} />;
  if (code >= 95) return <CloudLightning {...props} />;
  return <Wind {...props} />;
}

/** Tailwind text color class for the icon */
export function getWeatherColor(code: number): string {
  if (code === 0 || code === 1) return "text-amber-400";
  if (code === 2 || code === 3) return "text-slate-300";
  if (code === 45 || code === 48) return "text-slate-400";
  if (code >= 51 && code <= 57) return "text-sky-300";
  if (code >= 61 && code <= 67) return "text-sky-400";
  if (code >= 71 && code <= 77) return "text-blue-200";
  if (code >= 80 && code <= 86) return "text-sky-300";
  if (code >= 95) return "text-violet-400";
  return "text-slate-300";
}

/** CSS box-shadow glow color for the icon backdrop */
export function getWeatherGlow(code: number): string {
  if (code === 0 || code === 1) return "rgba(251,191,36,0.35)";
  if (code === 2 || code === 3) return "rgba(148,163,184,0.2)";
  if (code === 45 || code === 48) return "rgba(148,163,184,0.15)";
  if (code >= 51 && code <= 57) return "rgba(125,211,252,0.25)";
  if (code >= 61 && code <= 67) return "rgba(56,189,248,0.3)";
  if (code >= 71 && code <= 77) return "rgba(147,197,253,0.3)";
  if (code >= 80 && code <= 86) return "rgba(56,189,248,0.25)";
  if (code >= 95) return "rgba(167,139,250,0.35)";
  return "rgba(148,163,184,0.2)";
}

/** Returns gradient stop colors for the hero background based on weather */
export function getWeatherGradient(code: number, isDay: boolean): [string, string] {
  if (!isDay) return ["#0d1b2a", "#0a1628"];
  if (code === 0) return ["#0f2044", "#1a3a6b"];           // clear → deep blue
  if (code === 1 || code === 2) return ["#0f1f3d", "#1b3358"]; // partly cloudy
  if (code === 3) return ["#1a1a2e", "#16213e"];            // overcast
  if (code === 45 || code === 48) return ["#1c1c2e", "#2d2d44"]; // fog
  if (code >= 51 && code <= 67) return ["#0b1f3a", "#0e2f4a"]; // rain
  if (code >= 71 && code <= 77) return ["#0d1f35", "#152a4a"]; // snow
  if (code >= 80 && code <= 86) return ["#0b1f3a", "#0d2540"]; // showers
  if (code >= 95) return ["#1a0b2e", "#2a0f44"];            // thunder
  return ["#0f1f3d", "#1a3052"];
}
