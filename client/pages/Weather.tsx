import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Grid,
  Column,
  Button,
  InlineNotification,
  SkeletonPlaceholder,
  SkeletonText,
  Link as CarbonLink,
} from "@carbon/react";
import {
  ArrowLeft,
  Renew,
  Wifi,
} from "@carbon/icons-react";
import { useRecentSearches } from "../hooks/useRecentSearches";
import { useWeather } from "../hooks/useWeather";
import CurrentWeatherDisplay from "../components/CurrentWeatherDisplay";
import ForecastGrid from "../components/ForecastGrid";
import ZipSearch from "../components/ZipSearch";

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Weather() {
  const { zip = "" } = useParams<{ zip: string }>();
  const [refreshKey, setRefreshKey] = useState(0);
  const state = useWeather(zip, refreshKey);
  const { addRecentZip } = useRecentSearches();

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  // Save to recent searches whenever a ZIP resolves successfully
  useEffect(() => {
    if (state.status === "success") addRecentZip(zip);
  }, [state.status, zip]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 48px)",
        display: "flex",
        flexDirection: "column",
        background: "#0d1117",
      }}
    >
      {/* ── Sub-nav ── */}
      <SubNav zip={zip} state={state} addRecentZip={addRecentZip} />

      {/* ── Content ── */}
      <div style={{ flex: 1 }}>

        {/* Loading state — Carbon Skeleton */}
        {state.status === "loading" && (
          <div data-testid="weather-loading">
            <Grid style={{ paddingTop: "var(--cds-spacing-07, 2rem)" }}>
              <Column lg={10} md={8} sm={4}>
                <SkeletonText
                  heading
                  width="60%"
                  style={{ marginBottom: "var(--cds-spacing-05, 1rem)" }}
                />
                <SkeletonText paragraph lineCount={2} width="40%" />
                <SkeletonPlaceholder
                  style={{
                    width: "100%",
                    height: "12rem",
                    marginTop: "var(--cds-spacing-06, 1.5rem)",
                  }}
                />
              </Column>
              <Column lg={6} md={8} sm={4}>
                <SkeletonText paragraph lineCount={4} />
                <SkeletonPlaceholder
                  style={{
                    width: "100%",
                    height: "8rem",
                    marginTop: "var(--cds-spacing-06, 1.5rem)",
                  }}
                />
              </Column>
              <Column lg={16} md={8} sm={4} style={{ marginTop: "var(--cds-spacing-07, 2rem)" }}>
                <SkeletonText heading width="30%" style={{ marginBottom: "var(--cds-spacing-05, 1rem)" }} />
                <div style={{ display: "flex", gap: "var(--cds-spacing-03, 0.5rem)", overflowX: "hidden" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonPlaceholder
                      key={i}
                      style={{ width: "100%", height: "10rem", flexShrink: 0 }}
                    />
                  ))}
                </div>
              </Column>
            </Grid>
          </div>
        )}

        {/* Error state — Carbon InlineNotification */}
        {state.status === "error" && (
          <Grid style={{ paddingTop: "var(--cds-spacing-09, 3rem)" }}>
            <Column lg={10} md={8} sm={4} lgOffset={3} mdOffset={0}>
              <InlineNotification
                kind="error"
                title="Unable to Load Weather"
                subtitle={state.message}
                role="alert"
                statusIconDescription="Error"
                hideCloseButton
                style={{ marginBottom: "var(--cds-spacing-06, 1.5rem)", maxWidth: "100%" }}
              />
              <div style={{ display: "flex", gap: "var(--cds-spacing-04, 0.75rem)" }}>
                <Button
                  kind="ghost"
                  href="/"
                  renderIcon={ArrowLeft}
                  iconDescription="Go home"
                  as="a"
                >
                  Try Another ZIP
                </Button>
                <Button
                  kind="primary"
                  onClick={handleRefresh}
                  renderIcon={Renew}
                  iconDescription="Retry"
                >
                  Retry
                </Button>
              </div>
            </Column>
          </Grid>
        )}

        {/* Success state */}
        {state.status === "success" && (
          <Grid style={{ paddingTop: 0 }}>
            <Column lg={16} md={8} sm={4}>
              <CurrentWeatherDisplay
                current={state.data.current}
                locationName={state.data.locationName}
                zip={state.data.zip}
              />
            </Column>

            <Column lg={16} md={8} sm={4}>
              <ForecastGrid
                hourlyByDay={state.data.hourlyByDay}
                onRefresh={handleRefresh}
                isRefreshing={false}
              />
            </Column>

            {/* Attribution */}
            <Column lg={16} md={8} sm={4}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--cds-spacing-05, 1rem) var(--cds-spacing-07, 2rem)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--cds-font-family-sans, 'IBM Plex Sans', sans-serif)",
                    fontSize: "var(--cds-label-01-font-size, 0.75rem)",
                    color: "rgba(255,255,255,0.2)",
                  }}
                >
                  Weather by{" "}
                  <a
                    href="https://open-meteo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
                  >
                    Open-Meteo
                  </a>
                </p>
                <span
                  style={{
                    fontFamily: "var(--cds-font-family-mono, 'IBM Plex Mono', monospace)",
                    fontSize: "var(--cds-label-01-font-size, 0.75rem)",
                    color: "rgba(255,255,255,0.15)",
                  }}
                >
                  {zip}
                </span>
              </div>
            </Column>
          </Grid>
        )}
      </div>
    </div>
  );
}

// ── Sub-nav ───────────────────────────────────────────────────────────────────

type WeatherState = ReturnType<typeof useWeather>;

function SubNav({
  zip,
  state,
  addRecentZip,
}: {
  zip: string;
  state: WeatherState;
  addRecentZip: (zip: string) => void;
}) {
  return (
    <div
      style={{
        background: "#161b22",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "var(--cds-spacing-04, 0.75rem) 0",
      }}
    >
      <Grid>
        <Column lg={2} md={2} sm={1} style={{ display: "flex", alignItems: "center" }}>
          <CarbonLink
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--cds-spacing-02, 0.25rem)",
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              fontSize: "var(--cds-body-short-01-font-size, 0.875rem)",
            }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Home</span>
          </CarbonLink>
        </Column>

        <Column lg={10} md={5} sm={3} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: "24rem" }}>
            <ZipSearch
              initialZip={zip}
              placeholder="Search another ZIP..."
              variant="dark"
              onSearch={addRecentZip}
            />
          </div>
        </Column>

        {state.status === "success" && (
          <Column
            lg={4}
            md={1}
            sm={0}
            style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--cds-spacing-02, 0.25rem)",
                fontSize: "var(--cds-label-01-font-size, 0.75rem)",
                color: "rgba(52,211,153,0.7)",
              }}
            >
              <Wifi size={12} aria-hidden="true" />
              Live data
            </span>
          </Column>
        )}
      </Grid>
    </div>
  );
}
