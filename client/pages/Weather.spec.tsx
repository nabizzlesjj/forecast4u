/**
 * Weather page tests
 *
 * Covers: loading skeleton, error state (message + Retry), success state
 * (current weather + forecast rendered), refresh mechanic (refreshKey
 * increments re-fetch), recent-search persistence, and sub-nav ZIP search.
 *
 * All external hooks and child components are mocked so tests run
 * instantly with zero network traffic.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Weather from "./Weather";

// ── Shared fixture data ───────────────────────────────────────────────────────

function makeSlot(time: string, temp: number, isNow = false) {
  return {
    time,
    hour: "12 PM",
    temperature: temp,
    feelsLike: temp - 2,
    weatherCode: 3,
    weatherLabel: "Overcast",
    windSpeed: 7,
    precipProb: 20,
    humidity: 65,
    isNow,
  };
}

function makeDay(date: string, dayName: string, dateLabel: string) {
  return {
    date,
    dayName,
    dateLabel,
    slots: Array.from({ length: 8 }, (_, i) =>
      makeSlot(`${date}T${String(i * 3).padStart(2, "0")}:00`, 70 + i, i === 3)
    ),
  };
}

const MOCK_WEATHER_DATA = {
  locationName: "Atlanta, Georgia",
  zip: "30307",
  current: {
    temperature: 80,
    feelsLike: 79,
    humidity: 65,
    windSpeed: 7,
    weatherCode: 3,
    weatherLabel: "Overcast",
    isDay: true,
  },
  hourlyByDay: [
    makeDay("2024-06-01", "Today", "Jun 1"),
    makeDay("2024-06-02", "Mon",   "Jun 2"),
    makeDay("2024-06-03", "Tue",   "Jun 3"),
    makeDay("2024-06-04", "Wed",   "Jun 4"),
    makeDay("2024-06-05", "Thu",   "Jun 5"),
  ],
};

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockAddRecentZip = vi.fn();
vi.mock("../hooks/useRecentSearches", () => ({
  useRecentSearches: () => ({
    recentZips: [],
    addRecentZip: mockAddRecentZip,
    removeRecentZip: vi.fn(),
  }),
}));

// useWeather is controlled per-test via mockWeatherState
let mockWeatherState: ReturnType<typeof import("../hooks/useWeather").useWeather>;
vi.mock("../hooks/useWeather", () => ({
  useWeather: (_zip: string, _key?: number) => mockWeatherState,
}));

// Stub heavy child components to keep snapshots minimal
vi.mock("../components/CurrentWeatherDisplay", () => ({
  default: ({ locationName }: { locationName: string }) => (
    <div data-testid="current-weather">{locationName}</div>
  ),
}));
vi.mock("../components/ForecastGrid", () => ({
  default: ({ hourlyByDay, onRefresh }: { hourlyByDay?: unknown[]; onRefresh?: () => void }) => (
    <div data-testid="forecast-grid" data-days={hourlyByDay?.length}>
      <button onClick={onRefresh} aria-label="Refresh forecast">Refresh</button>
    </div>
  ),
}));
vi.mock("../components/WeatherSkeleton", () => ({
  default: () => <div data-testid="weather-skeleton" />,
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// ── Helper ────────────────────────────────────────────────────────────────────

function renderWeather(zip = "30307") {
  return render(
    <MemoryRouter initialEntries={[`/weather/${zip}`]}>
      <Routes>
        <Route path="/weather/:zip" element={<Weather />} />
      </Routes>
    </MemoryRouter>
  );
}

// ── Suites ────────────────────────────────────────────────────────────────────

describe("Weather page — loading state", () => {
  beforeEach(() => {
    mockWeatherState = { status: "loading" };
    mockAddRecentZip.mockClear();
  });

  it("renders the skeleton while data is loading", () => {
    renderWeather();
    expect(screen.getByTestId("weather-skeleton")).toBeDefined();
  });

  it("does not render the forecast grid while loading", () => {
    renderWeather();
    expect(screen.queryByTestId("forecast-grid")).toBeNull();
  });

  it("does not render the error state while loading", () => {
    renderWeather();
    expect(screen.queryByText(/unable to load weather/i)).toBeNull();
  });

  it("does not save to recent searches while loading", () => {
    renderWeather();
    expect(mockAddRecentZip).not.toHaveBeenCalled();
  });
});

describe("Weather page — error state", () => {
  beforeEach(() => {
    mockWeatherState = { status: "error", message: "No location found for ZIP code \"00000\"." };
    mockAddRecentZip.mockClear();
    mockNavigate.mockClear();
  });

  it("renders the error heading", () => {
    renderWeather("00000");
    expect(screen.getByText(/unable to load weather/i)).toBeDefined();
  });

  it("renders the error message from the hook", () => {
    renderWeather("00000");
    expect(screen.getByText(/no location found/i)).toBeDefined();
  });

  it("renders the Retry button", () => {
    renderWeather("00000");
    expect(screen.getByRole("button", { name: /retry/i })).toBeDefined();
  });

  it("renders the 'Try Another ZIP' back link", () => {
    renderWeather("00000");
    expect(screen.getByText(/try another zip/i)).toBeDefined();
  });

  it("does not render the skeleton in error state", () => {
    renderWeather("00000");
    expect(screen.queryByTestId("weather-skeleton")).toBeNull();
  });

  it("does not save to recent searches on error", () => {
    renderWeather("00000");
    expect(mockAddRecentZip).not.toHaveBeenCalled();
  });
});

describe("Weather page — success state", () => {
  beforeEach(() => {
    mockWeatherState = { status: "success", data: MOCK_WEATHER_DATA };
    mockAddRecentZip.mockClear();
  });

  it("renders the CurrentWeatherDisplay with location name", () => {
    renderWeather();
    expect(screen.getByTestId("current-weather")).toBeDefined();
    expect(screen.getByText("Atlanta, Georgia")).toBeDefined();
  });

  it("renders the ForecastGrid", () => {
    renderWeather();
    expect(screen.getByTestId("forecast-grid")).toBeDefined();
  });

  it("does not render the skeleton on success", () => {
    renderWeather();
    expect(screen.queryByTestId("weather-skeleton")).toBeNull();
  });

  it("does not render the error panel on success", () => {
    renderWeather();
    expect(screen.queryByText(/unable to load weather/i)).toBeNull();
  });

  it("saves the ZIP to recent searches when status becomes success", async () => {
    renderWeather("30307");
    await waitFor(() => expect(mockAddRecentZip).toHaveBeenCalledWith("30307"));
  });

  it("shows the ZIP in the attribution footer", () => {
    renderWeather("30307");
    // The ZIP appears as a mono text node in the footer
    const zips = screen.getAllByText("30307");
    expect(zips.length).toBeGreaterThan(0);
  });
});

describe("Weather page — Refresh mechanic", () => {
  beforeEach(() => {
    mockWeatherState = { status: "success", data: MOCK_WEATHER_DATA };
    mockAddRecentZip.mockClear();
  });

  it("renders a Refresh button inside the ForecastGrid area", () => {
    renderWeather();
    expect(screen.getByRole("button", { name: /refresh forecast/i })).toBeDefined();
  });

  it("clicking Refresh triggers a state update (re-render without crash)", async () => {
    renderWeather();
    const refreshBtn = screen.getByRole("button", { name: /refresh forecast/i });
    // Flip state to loading immediately after click to simulate re-fetch
    mockWeatherState = { status: "loading" };
    fireEvent.click(refreshBtn);
    // Component should still be in the DOM (no error boundary triggered)
    await waitFor(() => expect(screen.getByTestId("weather-skeleton")).toBeDefined());
  });
});

describe("Weather page — sub-nav", () => {
  beforeEach(() => {
    mockWeatherState = { status: "loading" };
  });

  it("renders the Home back link", () => {
    renderWeather();
    expect(screen.getByText("Home")).toBeDefined();
  });

  it("renders the ZIP search input pre-filled with the current ZIP", () => {
    renderWeather("30307");
    const input = screen.getByRole("searchbox") as HTMLInputElement;
    expect(input.value).toBe("30307");
  });

  it("renders 'Live data' indicator when weather loads successfully", () => {
    mockWeatherState = { status: "success", data: MOCK_WEATHER_DATA };
    renderWeather();
    expect(screen.getByText(/live data/i)).toBeDefined();
  });

  it("does not render 'Live data' indicator while loading", () => {
    mockWeatherState = { status: "loading" };
    renderWeather();
    expect(screen.queryByText(/live data/i)).toBeNull();
  });
});
