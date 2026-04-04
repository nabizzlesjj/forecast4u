import { useState, useEffect } from "react";

// ── Shared types ──────────────────────────────────────────────────────────────

export interface CurrentWeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherLabel: string;
  isDay: boolean;
}

export interface HourlySlot {
  time: string;       // "2024-06-01T15:00"
  hour: string;       // "3 PM"
  temperature: number;
  feelsLike: number;
  weatherCode: number;
  weatherLabel: string;
  windSpeed: number;
  precipProb: number;
  humidity: number;
  isNow: boolean;
}

export interface DayGroup {
  date: string;       // "2024-06-01"
  dayName: string;    // "Today", "Mon", etc.
  dateLabel: string;  // "Jun 1"
  slots: HourlySlot[];
}

export interface WeatherResult {
  locationName: string;
  zip: string;
  current: CurrentWeatherData;
  hourlyByDay: DayGroup[];
}

type WeatherState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: WeatherResult }
  | { status: "error"; message: string };

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getWeatherLabel(code: number): string {
  if (code === 0) return "Clear Sky";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 56 && code <= 57) return "Freezing Drizzle";
  if (code >= 61 && code <= 65) return "Rain";
  if (code >= 66 && code <= 67) return "Freezing Rain";
  if (code >= 71 && code <= 75) return "Snowfall";
  if (code === 77) return "Snow Grains";
  if (code >= 80 && code <= 82) return "Rain Showers";
  if (code >= 85 && code <= 86) return "Snow Showers";
  if (code === 95) return "Thunderstorm";
  if (code >= 96 && code <= 99) return "Thunderstorm with Hail";
  return "Unknown";
}

/** "2024-06-01T15:00" → "3 PM" */
function formatHour(timeStr: string): string {
  const h = parseInt(timeStr.slice(11, 13), 10);
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

/** "2024-06-01" → "Jun 1" */
function formatDateLabel(dateStr: string): string {
  const month = parseInt(dateStr.slice(5, 7), 10) - 1;
  const day   = parseInt(dateStr.slice(8, 10), 10);
  return `${MONTHS[month]} ${day}`;
}

/** True when the current wall-clock time falls inside this 3-hour window. */
function isCurrentSlot(timeStr: string): boolean {
  const slotMs = new Date(timeStr).getTime();
  const nowMs  = Date.now();
  return nowMs >= slotMs && nowMs < slotMs + 3 * 60 * 60 * 1000;
}

// ── API calls ─────────────────────────────────────────────────────────────────

async function geocodeZip(zip: string): Promise<{ lat: number; lon: number; name: string }> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${zip}&count=5&language=en&format=json&countryCode=US`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding service unavailable.");
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`No location found for ZIP code "${zip}". Please verify and try again.`);
  }

  const usResults = data.results.filter(
    (r: { country_code?: string }) => r.country_code === "US"
  );
  const match =
    usResults.find((r: { name?: string; admin3?: string }) =>
      r.name === zip || r.admin3 === zip
    ) || usResults[0];

  if (!match) {
    throw new Error(`Could not locate ZIP code "${zip}" in the United States.`);
  }

  return {
    lat: match.latitude,
    lon: match.longitude,
    name: [match.name, match.admin1].filter(Boolean).join(", "),
  };
}

async function fetchWeather(lat: number, lon: number): Promise<{
  current: CurrentWeatherData;
  hourlyByDay: DayGroup[];
}> {
  const params = new URLSearchParams({
    latitude:  String(lat),
    longitude: String(lon),
    current:   "temperature_2m,apparent_temperature,relative_humidity_2m,windspeed_10m,weathercode,is_day",
    hourly:    "temperature_2m,apparent_temperature,weathercode,windspeed_10m,precipitation_probability,relativehumidity_2m",
    temperature_unit: "fahrenheit",
    windspeed_unit:   "mph",
    timezone:         "auto",
    forecast_days:    "5",
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error("Weather service unavailable.");
  const data = await res.json();

  // ── Current conditions ──────────────────────────────────────────────────
  const c = data.current;
  const current: CurrentWeatherData = {
    temperature: Math.round(c.temperature_2m),
    feelsLike:   Math.round(c.apparent_temperature),
    humidity:    c.relative_humidity_2m,
    windSpeed:   Math.round(c.windspeed_10m),
    weatherCode: c.weathercode,
    weatherLabel: getWeatherLabel(c.weathercode),
    isDay: c.is_day === 1,
  };

  // ── Hourly → 3-hour slots, grouped by day ────────────────────────────────
  const h = data.hourly as {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    weathercode: number[];
    windspeed_10m: number[];
    precipitation_probability: number[];
    relativehumidity_2m: number[];
  };

  const dayMap = new Map<string, DayGroup>();
  let dayIndex = 0;

  h.time.forEach((timeStr, i) => {
    // Keep only every 3rd hour (0, 3, 6, 9, 12, 15, 18, 21)
    const hourOfDay = parseInt(timeStr.slice(11, 13), 10);
    if (hourOfDay % 3 !== 0) return;

    const date = timeStr.slice(0, 10); // "2024-06-01"

    if (!dayMap.has(date)) {
      const dt = new Date(date + "T12:00:00");
      const dayName = dayIndex === 0 ? "Today" : DAY_NAMES[dt.getDay()];
      dayMap.set(date, {
        date,
        dayName,
        dateLabel: formatDateLabel(date),
        slots: [],
      });
      dayIndex++;
    }

    dayMap.get(date)!.slots.push({
      time:        timeStr,
      hour:        formatHour(timeStr),
      temperature: Math.round(h.temperature_2m[i]),
      feelsLike:   Math.round(h.apparent_temperature[i]),
      weatherCode: h.weathercode[i],
      weatherLabel: getWeatherLabel(h.weathercode[i]),
      windSpeed:   Math.round(h.windspeed_10m[i]),
      precipProb:  h.precipitation_probability[i] ?? 0,
      humidity:    h.relativehumidity_2m[i],
      isNow:       isCurrentSlot(timeStr),
    });
  });

  return { current, hourlyByDay: Array.from(dayMap.values()) };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useWeather(zip: string, refreshKey = 0): WeatherState {
  const [state, setState] = useState<WeatherState>({ status: "idle" });

  useEffect(() => {
    if (!zip || !/^\d{5}$/.test(zip)) {
      setState({ status: "error", message: "Invalid ZIP code." });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    (async () => {
      try {
        const location = await geocodeZip(zip);
        const weather  = await fetchWeather(location.lat, location.lon);

        if (!cancelled) {
          setState({
            status: "success",
            data: { locationName: location.name, zip, ...weather },
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "Failed to load weather data.",
          });
        }
      }
    })();

    return () => { cancelled = true; };
  }, [zip, refreshKey]);

  return state;
}
