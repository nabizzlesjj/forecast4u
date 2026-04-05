import { InlineNotification } from "@carbon/react";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Maps directly to Carbon InlineNotification's `kind` prop values. */
export type WeatherAlertKind = "error" | "warning" | "info";

export interface WeatherAlertProps {
  /** Severity level — controls the icon and colour strip.
   *  - `error`   → red  (Severe / Emergency alerts)
   *  - `warning` → yellow (Watch / Advisory alerts)
   *  - `info`    → blue  (General forecast updates)
   */
  kind: WeatherAlertKind;
  /** Short headline, e.g. "Severe Thunderstorm Warning" */
  title: string;
  /** Supporting detail, e.g. "Expected between 3PM – 7PM" */
  subtitle?: string;
  /** Optional handler called when the close button is clicked */
  onClose?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * WeatherAlert
 *
 * A thin wrapper around IBM Carbon's `InlineNotification` that surfaces
 * weather alert severity through Carbon's built-in `kind` system.
 * Drop it anywhere inside a Carbon `Theme` provider.
 */
export function WeatherAlert({
  kind,
  title,
  subtitle,
  onClose,
}: WeatherAlertProps) {
  return (
    <InlineNotification
      kind={kind}
      title={title}
      subtitle={subtitle}
      role="alert"
      statusIconDescription={kindLabel(kind)}
      lowContrast
      onClose={onClose}
      hideCloseButton={!onClose}
      style={{ maxWidth: "100%" }}
    />
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Accessible icon description derived from the alert kind. */
function kindLabel(kind: WeatherAlertKind): string {
  switch (kind) {
    case "error":   return "Severe alert";
    case "warning": return "Warning";
    case "info":    return "Information";
  }
}
