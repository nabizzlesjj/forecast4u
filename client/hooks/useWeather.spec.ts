/**
 * useWeather hook tests
 *
 * All external HTTP calls (Open-Meteo geocoding + forecast APIs) are
 * intercepted with vi.fn() — no real network traffic is made.
 *
 * Covers: loading state, successful data shape, geocoding failure,
 * weather API failure, and invalid ZIP short-circuit.
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

const WEATHER_SUCCESS = {
  current: {
    temperature_2m: 72.5,
    apparent_temperature: 70.1,
    relative_humidity_2m: 55,
    windspeed_10m: 8.3,
    weathercode: 0,
    is_day: 1,
  },
  daily: {
    time: [
      "2024-06-01",
      "2024-06-02",
      "2024-06-03",
      "2024-06-04",
      "2024-06-05",
    ],
    temperature_2m_max: [80, 78, 75, 82, 77],
    temperature_2m_min: [62, 60, 58, 65, 61],
    weathercode: [0, 1, 2, 61, 3],
  },
};

// ── Mock setup ────────────────────────────────────────────────────────────────

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
  beforeEach(() => {
    global.fetch = makeFetchMock(GEOCODE_SUCCESS, WEATHER_SUCCESS);
  });
  afterEach(() => vi.restoreAllMocks());

  it("starts in 'loading' status for a valid ZIP", () => {
    const { result } = renderHook(() => useWeather("30606"));
    expect(result.current.status).toBe("loading");
  });
});

describe("useWeather — success path", () => {
  beforeEach(() => {
    global.fetch = makeFetchMock(GEOCODE_SUCCESS, WEATHER_SUCCESS);
  });
  afterEach(() => vi.restoreAllMocks());

  it("resolves to 'success' status after fetch completes", async () => {
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
    // 72.5 rounds to 73
    expect(result.current.data.current.temperature).toBe(73);
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

  it("returns exactly 5 forecast days", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status !== "success") return;
    expect(result.current.data.forecast).toHaveLength(5);
  });

  it("labels the first forecast day as 'Today'", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status !== "success") return;
    expect(result.current.data.forecast[0].dayName).toBe("Today");
  });

  it("includes rounded max/min temps in each forecast day", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    if (result.current.status !== "success") return;
    const day = result.current.data.forecast[0];
    expect(day.maxTemp).toBe(80);
    expect(day.minTemp).toBe(62);
  });

  it("calls the geocoding API exactly once", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    const geocodeCalls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
      ([url]: [string]) => url.includes("geocoding-api.open-meteo.com")
    );
    expect(geocodeCalls).toHaveLength(1);
  });

  it("calls the weather API exactly once", async () => {
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("success"));
    const weatherCalls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
      ([url]: [string]) => url.includes("api.open-meteo.com/v1/forecast")
    );
    expect(weatherCalls).toHaveLength(1);
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

  it("returns 'error' when geocoding API throws a network error", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));
    const { result } = renderHook(() => useWeather("30606"));
    await waitFor(() => expect(result.current.status).toBe("error"));
    if (result.current.status !== "error") return;
    expect(result.current.message).toBe("Network error");
  });
});

describe("useWeather — weather API failure", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns 'error' when the weather API returns non-ok response", async () => {
    global.fetch = vi.fn((url: string) => {
      if ((url as string).includes("geocoding-api.open-meteo.com")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(GEOCODE_SUCCESS),
        } as Response);
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

  it("immediately returns 'error' for a 3-digit string without calling fetch", async () => {
    global.fetch = vi.fn();
    const { result } = renderHook(() => useWeather("123"));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("immediately returns 'error' for an empty string", async () => {
    global.fetch = vi.fn();
    const { result } = renderHook(() => useWeather(""));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("immediately returns 'error' for a 6-digit string", async () => {
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

    // Wait for first fetch to complete
    await waitFor(() => expect(result.current.status).toBe("success"));
    const firstCallCount = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.length;

    // Increment key → should trigger a new fetch
    key = 1;
    rerender();

    await waitFor(() => {
      const totalCalls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.length;
      expect(totalCalls).toBeGreaterThan(firstCallCount);
    });
  });

  it("returns to 'loading' status immediately after refreshKey changes", async () => {
    global.fetch = makeFetchMock(GEOCODE_SUCCESS, WEATHER_SUCCESS);
    let key = 0;
    const { result, rerender } = renderHook(() => useWeather("30606", key));

    await waitFor(() => expect(result.current.status).toBe("success"));

    key = 1;
    rerender();

    // Should immediately flip back to loading
    expect(result.current.status).toBe("loading");
  });
});
