import type { Meta, StoryObj } from "@storybook/react";
import { WeatherAlert } from "../components/WeatherAlert";

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof WeatherAlert> = {
  title: "Forecast4U / WeatherAlert",
  component: WeatherAlert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Displays a weather alert using IBM Carbon's `InlineNotification`. " +
          "The `kind` prop controls severity: `error` for severe/emergency alerts, " +
          "`warning` for watches and advisories, and `info` for general forecast updates.",
      },
    },
    layout: "padded",
  },
  argTypes: {
    kind: {
      control: "select",
      options: ["error", "warning", "info"],
      description: "Alert severity — maps to Carbon InlineNotification kind",
      table: {
        type: { summary: '"error" | "warning" | "info"' },
        defaultValue: { summary: '"info"' },
      },
    },
    title: {
      control: "text",
      description: "Short alert headline",
    },
    subtitle: {
      control: "text",
      description: "Supporting detail text",
    },
  },
  args: {
    kind: "info",
    title: "Weather Alert",
    subtitle: "Check local conditions before heading out.",
  },
};

export default meta;
type Story = StoryObj<typeof WeatherAlert>;

// ── Story variants ────────────────────────────────────────────────────────────

/**
 * **Severe Thunderstorm Warning** — `kind="error"`
 *
 * Used for life-threatening, active weather events (NWS Warning level).
 * Renders with a red strip and error icon.
 */
export const SevereThunderstormWarning: Story = {
  name: "Severe Thunderstorm Warning",
  args: {
    kind: "error",
    title: "Severe Thunderstorm Warning",
    subtitle:
      "A severe thunderstorm warning is in effect until 7:00 PM EDT. " +
      "Expect large hail, damaging winds up to 70 mph, and frequent lightning. " +
      "Take shelter immediately.",
  },
};

/**
 * **Winter Storm Watch** — `kind="warning"`
 *
 * Used for potential hazardous conditions (NWS Watch / Advisory level).
 * Renders with a yellow strip and warning icon.
 */
export const WinterStormWatch: Story = {
  name: "Winter Storm Watch",
  args: {
    kind: "warning",
    title: "Winter Storm Watch",
    subtitle:
      "A winter storm watch is in effect from Saturday evening through Sunday morning. " +
      "Heavy snow accumulations of 6–12 inches are possible. " +
      "Monitor forecasts and prepare for significant travel impacts.",
  },
};

/**
 * **High Wind Advisory** — `kind="warning"`
 *
 * A second `warning` variant — shows how the same severity can cover
 * different alert types (wind vs. snow).
 */
export const HighWindAdvisory: Story = {
  name: "High Wind Advisory",
  args: {
    kind: "warning",
    title: "High Wind Advisory",
    subtitle:
      "Southwest winds 25–35 mph with gusts up to 55 mph expected 3PM – 9PM. " +
      "Unsecured objects may be blown around. Use caution when driving high-profile vehicles.",
  },
};

/**
 * **General Forecast Update** — `kind="info"`
 *
 * Used for non-hazardous informational notices.
 * Renders with a blue strip and info icon.
 */
export const GeneralForecastUpdate: Story = {
  name: "General Forecast Update",
  args: {
    kind: "info",
    title: "General Forecast Update",
    subtitle:
      "A cold front will move through the area tonight bringing cooler temperatures " +
      "and clearing skies by tomorrow morning. Expect highs in the mid-60s through the weekend.",
  },
};

// ── Bonus: all variants stacked ───────────────────────────────────────────────

/** All four alert variants displayed together for quick comparison. */
export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "640px" }}>
      <WeatherAlert
        kind="error"
        title="Severe Thunderstorm Warning"
        subtitle="Expected between 3PM – 7PM. Take shelter immediately."
      />
      <WeatherAlert
        kind="warning"
        title="Winter Storm Watch"
        subtitle="Heavy snow 6–12 inches possible Saturday evening through Sunday."
      />
      <WeatherAlert
        kind="warning"
        title="High Wind Advisory"
        subtitle="Gusts up to 55 mph expected 3PM – 9PM today."
      />
      <WeatherAlert
        kind="info"
        title="General Forecast Update"
        subtitle="Cold front moves through tonight. Clearing skies by tomorrow morning."
      />
    </div>
  ),
};
