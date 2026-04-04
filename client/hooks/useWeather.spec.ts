/**
 * useWeather hook tests
 *
 * All external HTTP calls (Open-Meteo geocoding + forecast APIs) are
 * intercepted with vi.fn() — no real network traffic is made.
 *
 * Covers: loading state, successful data shape (current + hourlyByDay),
 * geocoding failure, weather API failure, invalid ZIP short-circuit,
 * and refreshKey re-fetch behaviour.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useWeather } from "./useWeather";

// ── Fixture data ──────────────────────────────────────────────────────────────

const GEOCODE_SUCCESS = {
  results: [
    {
      latitude: 33.96,
      longitude: -83.37,
      name: "Athens",
      admin1: "Georgia",
      country_code: "US",
    },
  ],
};

/** Generates 5 days × 24 hours of hourly data (120 entries each). */
function makeHourlyArrays() {
  const time: string[] = [];
  const temperature_2m: number[] = [];
  const apparent_temperature: number[] = [];
  const weathercode: number[] = [];
  const windspeed_10m: number[] = [];
  const precipitation_probability: number[] = [];
  const relativehumidity_2m: number[] = [];

  for (let day = 1; day <= 5; day++) {
    for (let h = 0; h < 24; h++) {
      const mm = String(day).padStart(2, "0");
      const hh = String(h).padStart(2, "0");
      time.push(`2024-06-${mm}T${hh}:00`);
      temperature_2m.push(70 + day + h * 0.1);
      apparent_temperature.push(68 + day);
      weathercode.push(0);
      windspeed_10m.push(8);
      precipitation_probability.push(10);
      relativehumidity_2m.push(55);
    }
  }
  return {
    time,
    temperature_2m,
    apparent_temperature,
    weathercode,
    windspeed_10m,
    precipitation_probability,
    relativehumidity_2m,
  };
}

const WEATHER_SUCCESS = {
  current: {
    temperature_2m: 72.5,
    apparent_temperature: 70.1,
    relative_humidity_2m: 55,
    windspeed_10m: 8.3,
    weathercode: 0,
    is_day: 1,
  },
  hourly: makeHourlyArrays(),
};

// ── Mock helpers ──────────────────────────────────────────────────────────────

function makeFetchMock(geocodeBody: unknown, weatherBody: unknown) {
  return vi.fn((url: string) => {
    const isGeocode = (url as string).includes("geocoding-api.open-meteo.com");
    const body = isGeocode ? geocodeBody : weatherBody;
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body),
    } as Response);
  });
}

// ── Suites ────────────────────────────────────────────────────────────────────

describe("useWeather — loading state", () => {
  beforeEach(() => { global.fetch = makeFetchMock(GEOCODE_SUCCESS, WEATHER_SUCCESS); });
  afterEach(() => vi.restoreAllMocks());

  it("starts in 'loading' status for a valid ZIP", () => {
    const { result } = renderHook(() => useWeather("30606"));
    expect(result.current.status).toBe("loading");
  });
});

describe("useWeather — success path", () => {
  beforeEach(() => { global.fetch = makeFetchMock(GEOCODE_SUCCESS, WEATHER_SUCCESS); });
  afterEach(() => vi.restoreAllMocks());

  it("resolves to 'success' after fetch completes", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
  });

  it("returns the correct location name", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status !== "success") return;
    expect(result.current.data.locationName).toBe("Athens, Georgia");
  });

  it("returns the searched ZIP on the data object", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status !== "success") return;
    expect(result.current.data.zip).toBe("30606");
  });

  it("rounds and exposes the current temperature", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status !== "success") return;
    expect(result.current.data.current.temperature).toBe(73); // Math.round(72.5)
  });

  it("exposes humidity and wind speed", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status !== "success") return;
    expect(result.current.data.current.humidity).toBe(55);
    expect(result.current.data.current.windSpeed).toBe(8); // Math.round(8.3)
  });

  it("maps weathercode 0 to 'Clear Sky'", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status !== "success") return;
    expect(result.current.data.current.weatherLabel).toBe("Clear Sky");
  });

  it("returns exactly 5 day groups in hourlyByDay", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status !== "success") return;
    expect(result.current.data.hourlyByDay).toHaveLength(5);
  });

  it("each day group contains exactly 8 slots (3-hour intervals)", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status !== "success") return;
    for (const day of result.current.data.hourlyByDay) {
      expect(day.slots).toHaveLength(8);
    }
  });

  it("labels the first day group as 'Today'", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status !== "success") return;
    expect(result.current.data.hourlyByDay[0].dayName).toBe("Today");
  });

  it("slot hours are multiples of 3 (0, 3, 6 … 21)", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status !== "success") return;
    const slots = result.current.data.hourlyByDay[0].slots;
    slots.forEach((slot, i) => {
      const h = parseInt(slot.time.slice(11, 13), 10);
      expect(h).toBe(i * 3);
    });
  });

  it("each slot has a rounded temperature", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status !== "success") return;
    const slot = result.current.data.hourlyByDay[0].slots[0];
    expect(Number.isInteger(slot.temperature)).toBe(true);
  });

  it("includes precipProb on each slot", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status !== "success") return;
    expect(result.current.data.hourlyByDay[0].slots[0].precipProb).toBe(10);
  });

  it("calls the geocoding API exactly once", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
      ([url]: [string]) => url.includes("geocoding-api.open-meteo.com")
    );
    expect(calls).toHaveLength(1);
  });
});

describe("useWeather — geocoding failure", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns 'error' when geocoding finds no results", async () => {
    global.fetch = makeFetchMock({ results: [] }, WEATHER_SUCCESS);
    const { result } = renderHook(() => useWeather("00000"));
    await waitFor(() => expect(result.current.status).toBe("error"));
    if (result.current.status !== "error") return;
    expect(result.current.message).toMatch(/no location found/i);
  });

  it("returns 'error' when geocoding API returns non-ok response", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({}) } as Response)
    );
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("error"));
    if (result.current.status !== "error") return;
    expect(result.current.message).toMatch(/geocoding service unavailable/i);
  });

  it("returns 'error' on network failure", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("error"));
    if (result.current.status !== "error") return;
    expect(result.current.message).toBe("Network error");
  });
});

describe("useWeather — weather API failure", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns 'error' when weather API returns non-ok response", async () => {
    global.fetch = vi.fn((url: string) => {
      if ((url as string).includes("geocoding-api.open-meteo.com")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(GEOCODE_SUCCESS) } as Response);
      }
      return Promise.resolve({ ok: false, json: () => Promise.resolve({}) } as Response);
    });
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("error"));
    if (result.current.status !== "error") return;
    expect(result.current.message).toMatch(/weather service unavailable/i);
  });
});

describe("useWeather — invalid ZIP short-circuit", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns 'error' for a 3-digit string without fetching", async () => {
    global.fetch = vi.fn();
    const { result } = renderHook(() => useWeather("123"));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns 'error' for an empty string", async () => {
    global.fetch = vi.fn();
    const { result } = renderHook(() => useWeather(""));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns 'error' for a 6-digit string", async () => {
    global.fetch = vi.fn();
    const { result } = renderHook(() => useWeather("123456"));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe("useWeather — refreshKey", () => {
  afterEach(() => vi.restoreAllMocks());

  it("re-fetches when refreshKey increments", async () => {
    global.fetch = makeFetchMock(GEOCODE_SUCCESS, WEATHER_SUCCESS);
    let key = 0;
    const { result, rerender } = renderHook(() => useWeather("30606", key));
    await waitFor(() => expect(result.current.status).toBe("success"));
    const firstCount = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.length;

    key = 1;
    rerender();
    await waitFor(() => {
      const total = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.length;
      expect(total).toBeGreaterThan(firstCount);
    });
  });

  it("returns to 'loading' immediately after refreshKey changes", async () => {
    global.fetch = makeFetchMock(GEOCODE_SUCCESS, WEATHER_SUCCESS);
    let key = 0;
    const { result, rerender } = renderHook(() => useWeather("30606", key));
    await waitFor(() => expect(result.current.status).toBe("success"));

    key = 1;
    rerender();
    expect(result.current.status).toBe("loading");
  });
});
