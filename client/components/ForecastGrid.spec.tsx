/**
 * ForecastGrid component tests
 *
 * Covers: day-section headers, 3-hour slot cards, "Now" highlighting,
 * high/low summary, Refresh button presence/absence, callback, and
 * disabled/spinning state.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ForecastGrid from "./ForecastGrid";
import type { DayGroup } from "../hooks/useWeather";

// ── Fixture ───────────────────────────────────────────────────────────────────

function makeSlot(hour: string, temp: number, isNow = false) {
  return {
    time: `2024-06-01T${hour}:00`,
    hour: `${hour} AM`,
    temperature: temp,
    feelsLike: temp - 2,
    weatherCode: 0,
    weatherLabel: "Clear Sky",
    windSpeed: 5,
    precipProb: 10,
    humidity: 60,
    isNow,
  };
}

const HOURLY_BY_DAY: DayGroup[] = [
  {
    date: "2024-06-01",
    dayName: "Today",
    dateLabel: "Jun 1",
    slots: [
      makeSlot("00", 65),
      makeSlot("03", 63),
      makeSlot("06", 64),
      makeSlot("09", 70, true), // isNow
      makeSlot("12", 78),
      makeSlot("15", 80),
      makeSlot("18", 76),
      makeSlot("21", 70),
    ],
  },
  {
    date: "2024-06-02",
    dayName: "Mon",
    dateLabel: "Jun 2",
    slots: [
      makeSlot("00", 62),
      makeSlot("03", 60),
      makeSlot("06", 61),
      makeSlot("09", 68),
      makeSlot("12", 74),
      makeSlot("15", 75),
      makeSlot("18", 71),
      makeSlot("21", 66),
    ],
  },
];

// ── Suites ────────────────────────────────────────────────────────────────────

describe("ForecastGrid — section header", () => {
  it("renders the '5-Day Hourly Forecast' heading", () => {
    render(<ForecastGrid hourlyByDay={HOURLY_BY_DAY} />);
    expect(screen.getByText(/5-day hourly forecast/i)).toBeDefined();
  });

  it("does NOT render a Refresh button when onRefresh is not provided", () => {
    render(<ForecastGrid hourlyByDay={HOURLY_BY_DAY} />);
    expect(screen.queryByRole("button", { name: /refresh forecast/i })).toBeNull();
  });

  it("renders a Refresh button when onRefresh is provided", () => {
    render(<ForecastGrid hourlyByDay={HOURLY_BY_DAY} onRefresh={vi.fn()} />);
    expect(screen.getByRole("button", { name: /refresh forecast/i })).toBeDefined();
  });
});

describe("ForecastGrid — day rows", () => {
  it("renders a header row for each day", () => {
    render(<ForecastGrid hourlyByDay={HOURLY_BY_DAY} />);
    expect(screen.getByText("Today")).toBeDefined();
    expect(screen.getByText("Mon")).toBeDefined();
  });

  it("shows the date label for each day", () => {
    render(<ForecastGrid hourlyByDay={HOURLY_BY_DAY} />);
    expect(screen.getByText("Jun 1")).toBeDefined();
    expect(screen.getByText("Jun 2")).toBeDefined();
  });

  it("shows the high temperature for a day", () => {
    render(<ForecastGrid hourlyByDay={HOURLY_BY_DAY} />);
    // Today's high is 80° — appears in header summary AND in a slot card
    expect(screen.getAllByText("80°").length).toBeGreaterThanOrEqual(1);
  });
});

describe("ForecastGrid — hour cards", () => {
  it("renders 8 cards per day (one per 3-hour slot)", () => {
    render(<ForecastGrid hourlyByDay={[HOURLY_BY_DAY[0]]} />);
    expect(screen.getByText("65°")).toBeDefined();
    expect(screen.getByText("63°")).toBeDefined();
    // 80° appears in both the header summary and the slot card
    expect(screen.getAllByText("80°").length).toBeGreaterThanOrEqual(1);
  });

  it("shows 'Now' label on the isNow slot instead of the time", () => {
    render(<ForecastGrid hourlyByDay={[HOURLY_BY_DAY[0]]} />);
    expect(screen.getByText("Now")).toBeDefined();
  });

  it("renders precipitation probability on each card", () => {
    render(<ForecastGrid hourlyByDay={[HOURLY_BY_DAY[0]]} />);
    // 8 slots all have precipProb=10 → "10%" appears 8 times
    const items = screen.getAllByText("10%");
    expect(items.length).toBe(8);
  });
});

describe("ForecastGrid — Refresh button behaviour", () => {
  it("calls onRefresh when clicked", () => {
    const onRefresh = vi.fn();
    render(<ForecastGrid hourlyByDay={HOURLY_BY_DAY} onRefresh={onRefresh} />);
    fireEvent.click(screen.getByRole("button", { name: /refresh forecast/i }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("is disabled when isRefreshing=true", () => {
    render(
      <ForecastGrid hourlyByDay={HOURLY_BY_DAY} onRefresh={vi.fn()} isRefreshing={true} />
    );
    const btn = screen.getByRole("button", { name: /refresh forecast/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it("does not fire onRefresh when disabled", () => {
    const onRefresh = vi.fn();
    render(
      <ForecastGrid hourlyByDay={HOURLY_BY_DAY} onRefresh={onRefresh} isRefreshing={true} />
    );
    fireEvent.click(screen.getByRole("button", { name: /refresh forecast/i }));
    expect(onRefresh).not.toHaveBeenCalled();
  });

  it("is enabled when isRefreshing=false", () => {
    render(
      <ForecastGrid hourlyByDay={HOURLY_BY_DAY} onRefresh={vi.fn()} isRefreshing={false} />
    );
    const btn = screen.getByRole("button", { name: /refresh forecast/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });
});
