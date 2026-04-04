import { useState, useEffect } from "react";

export interface CurrentWeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherLabel: string;
  isDay: boolean;
}

export interface DayForecast {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  weatherLabel: string;
}

export interface WeatherResult {
  locationName: string;
  zip: string;
  current: CurrentWeatherData;
  forecast: DayForecast[];
}

type WeatherState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: WeatherResult }
  | { status: "error"; message: string };

// WMO weather interpretation codes -> label and icon key
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

async function geocodeZip(zip: string): Promise<{ lat: number; lon: number; name: string }> {
  // Use Open-Meteo geocoding with ZIP as search term
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${zip}&count=5&language=en&format=json&countryCode=US`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding service unavailable.");
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`No location found for ZIP code "${zip}". Please verify and try again.`);
  }

  // Filter for US results and prefer postal codes matching the zip
  const usResults = data.results.filter(
    (r: { country_code?: string }) => r.country_code === "US"
  );
  const match = usResults.find(
    (r: { name?: string; admin3?: string }) =>
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
  forecast: DayForecast[];
}> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,windspeed_10m,weathercode,is_day",
    daily: "temperature_2m_max,temperature_2m_min,weathercode",
    temperature_unit: "fahrenheit",
    windspeed_unit: "mph",
    timezone: "auto",
    forecast_days: "5",
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error("Weather service unavailable.");
  const data = await res.json();

  const c = data.current;
  const d = data.daily;

  const current: CurrentWeatherData = {
    temperature: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    windSpeed: Math.round(c.windspeed_10m),
    weatherCode: c.weathercode,
    weatherLabel: getWeatherLabel(c.weathercode),
    isDay: c.is_day === 1,
  };

  const forecast: DayForecast[] = (d.time as string[]).map((dateStr: string, i: number) => {
    const date = new Date(dateStr + "T12:00:00");
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const isToday = i === 0;
    return {
      date: dateStr,
      dayName: isToday ? "Today" : dayNames[date.getDay()],
      maxTemp: Math.round(d.temperature_2m_max[i]),
      minTemp: Math.round(d.temperature_2m_min[i]),
      weatherCode: d.weathercode[i],
      weatherLabel: getWeatherLabel(d.weathercode[i]),
    };
  });

  return { current, forecast };
}

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
        const weather = await fetchWeather(location.lat, location.lon);

        if (!cancelled) {
          setState({
            status: "success",
            data: {
              locationName: location.name,
              zip,
              ...weather,
            },
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

    return () => {
      cancelled = true;
    };
  }, [zip, refreshKey]);

  return state;
}
