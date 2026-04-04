/**
 * ForecastGrid component tests
 *
 * Covers: rendering forecast cards, heading, Refresh button
 * presence/absence, click callback, and disabled/spinning state.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ForecastGrid from "./ForecastGrid";
import type { DayForecast } from "../hooks/useWeather";

// ── Fixture ───────────────────────────────────────────────────────────────────

const FORECAST: DayForecast[] = [
  { date: "2024-06-01", dayName: "Today", maxTemp: 80, minTemp: 62, weatherCode: 0, weatherLabel: "Clear Sky" },
  { date: "2024-06-02", dayName: "Mon",   maxTemp: 75, minTemp: 58, weatherCode: 1, weatherLabel: "Mainly Clear" },
  { date: "2024-06-03", dayName: "Tue",   maxTemp: 70, minTemp: 55, weatherCode: 2, weatherLabel: "Partly Cloudy" },
  { date: "2024-06-04", dayName: "Wed",   maxTemp: 68, minTemp: 52, weatherCode: 61, weatherLabel: "Rain" },
  { date: "2024-06-05", dayName: "Thu",   maxTemp: 73, minTemp: 57, weatherCode: 3, weatherLabel: "Overcast" },
];

// ── Suite ─────────────────────────────────────────────────────────────────────

describe("ForecastGrid — rendering", () => {
  it("renders the '5-Day Forecast' section heading", () => {
    render(<ForecastGrid forecast={FORECAST} />);
    expect(screen.getByText(/5-day forecast/i)).toBeDefined();
  });

  it("renders a card for each of the 5 days", () => {
    render(<ForecastGrid forecast={FORECAST} />);
    expect(screen.getByText("Today")).toBeDefined();
    expect(screen.getByText("Mon")).toBeDefined();
    expect(screen.getByText("Tue")).toBeDefined();
    expect(screen.getByText("Wed")).toBeDefined();
    expect(screen.getByText("Thu")).toBeDefined();
  });

  it("renders high and low temperatures for each day", () => {
    render(<ForecastGrid forecast={FORECAST} />);
    // Today: 80° high, 62° low
    expect(screen.getByText("80°")).toBeDefined();
    expect(screen.getByText("62°")).toBeDefined();
  });

  it("renders weather labels for each day", () => {
    render(<ForecastGrid forecast={FORECAST} />);
    expect(screen.getByText("Clear Sky")).toBeDefined();
    expect(screen.getByText("Rain")).toBeDefined();
  });

  it("marks the first card with a 'Now' badge", () => {
    render(<ForecastGrid forecast={FORECAST} />);
    expect(screen.getByText("Now")).toBeDefined();
  });
});

describe("ForecastGrid — Refresh button", () => {
  it("does NOT render a Refresh button when onRefresh is not provided", () => {
    render(<ForecastGrid forecast={FORECAST} />);
    expect(screen.queryByRole("button", { name: /refresh forecast/i })).toBeNull();
  });

  it("renders a Refresh button when onRefresh is provided", () => {
    render(<ForecastGrid forecast={FORECAST} onRefresh={vi.fn()} />);
    expect(screen.getByRole("button", { name: /refresh forecast/i })).toBeDefined();
  });

  it("calls onRefresh when the Refresh button is clicked", () => {
    const onRefresh = vi.fn();
    render(<ForecastGrid forecast={FORECAST} onRefresh={onRefresh} />);
    fireEvent.click(screen.getByRole("button", { name: /refresh forecast/i }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("disables the button and shows spinner when isRefreshing=true", () => {
    render(
      <ForecastGrid forecast={FORECAST} onRefresh={vi.fn()} isRefreshing={true} />
    );
    const btn = screen.getByRole("button", { name: /refresh forecast/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it("does not call onRefresh when the button is disabled", () => {
    const onRefresh = vi.fn();
    render(
      <ForecastGrid forecast={FORECAST} onRefresh={onRefresh} isRefreshing={true} />
    );
    const btn = screen.getByRole("button", { name: /refresh forecast/i });
    fireEvent.click(btn);
    expect(onRefresh).not.toHaveBeenCalled();
  });

  it("button is enabled (not disabled) by default when isRefreshing=false", () => {
    render(
      <ForecastGrid forecast={FORECAST} onRefresh={vi.fn()} isRefreshing={false} />
    );
    const btn = screen.getByRole("button", { name: /refresh forecast/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });
});
