import { useNavigate } from "react-router-dom";
import {
  Grid,
  Column,
  Tag,
  ClickableTile,
} from "@carbon/react";
import {
  Cloud,
  ArrowRight,
  Windy,
  Sun,
  RainDrop,
  Time,
} from "@carbon/icons-react";
import ZipSearch from "../components/ZipSearch";
import { useRecentSearches } from "../hooks/useRecentSearches";

// ── Featured locations ────────────────────────────────────────────────────────

const FEATURED_LOCATIONS = [
  { zip: "10001", label: "New York City",  state: "NY", Icon: Windy },
  { zip: "90210", label: "Beverly Hills",  state: "CA", Icon: Sun },
  { zip: "60601", label: "Chicago",        state: "IL", Icon: Windy },
  { zip: "77001", label: "Houston",        state: "TX", Icon: Sun },
  { zip: "85001", label: "Phoenix",        state: "AZ", Icon: Sun },
  { zip: "19101", label: "Philadelphia",   state: "PA", Icon: RainDrop },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Index() {
  const { recentZips, addRecentZip, removeRecentZip } = useRecentSearches();
  const navigate = useNavigate();

  const handleTagClick = (zip: string) => {
    addRecentZip(zip);
    navigate(`/weather/${zip}`);
  };

  return (
    <div
      style={{
        background: "#0d1117",
        minHeight: "calc(100vh - 48px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Hero ── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "5rem 0",
          overflow: "hidden",
        }}
      >
        {/* Atmospheric glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 70% 55% at 50% 35%, rgba(15,98,254,0.18) 0%, transparent 70%)",
          }}
        />
        {/* Subtle grid overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.03,
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Carbon Grid for hero content */}
        <Grid style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "48rem" }}>
          <Column lg={16} md={8} sm={4}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Logo icon */}
              <div style={{ position: "relative", marginBottom: "2rem" }}>
                <div
                  style={{
                    width: "6rem",
                    height: "6rem",
                    borderRadius: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, #0f62fe 0%, #0043ce 100%)",
                    boxShadow:
                      "0 0 60px rgba(15,98,254,0.4), 0 0 120px rgba(15,98,254,0.15)",
                  }}
                  aria-hidden="true"
                >
                  <Cloud size={44} color="white" />
                </div>
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: "-4px",
                    right: "-4px",
                    width: "1rem",
                    height: "1rem",
                    background: "#78a9ff",
                    borderRadius: "2px",
                  }}
                />
              </div>

              {/* Brand heading — Carbon's productive-heading-06 equivalent */}
              <h1
                style={{
                  fontFamily: "var(--cds-font-family-sans, 'IBM Plex Sans', sans-serif)",
                  fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                  fontWeight: 200,
                  letterSpacing: "-0.02em",
                  color: "white",
                  margin: 0,
                  lineHeight: 1.1,
                  marginBottom: "var(--cds-spacing-03, 0.5rem)",
                }}
              >
                Forecast
                <span style={{ color: "#78a9ff", fontWeight: 700 }}>4U</span>
              </h1>

              <p
                style={{
                  fontFamily: "var(--cds-font-family-sans, 'IBM Plex Sans', sans-serif)",
                  fontSize: "var(--cds-body-01-font-size, 0.875rem)",
                  lineHeight: "var(--cds-body-01-line-height, 1.42857)",
                  color: "rgba(255,255,255,0.35)",
                  maxWidth: "22rem",
                  marginBottom: "var(--cds-spacing-09, 3rem)",
                }}
              >
                Instant, accurate U.S. weather by ZIP code.
              </p>

              {/* ZIP Search */}
              <div style={{ width: "100%", maxWidth: "32rem" }}>
                <ZipSearch
                  size="large"
                  variant="dark"
                  placeholder="Enter a 5-digit ZIP code..."
                  onSearch={addRecentZip}
                />
              </div>

              {/* ── Recent Searches ── */}
              {recentZips.length > 0 && (
                <div
                  style={{
                    width: "100%",
                    maxWidth: "32rem",
                    marginTop: "var(--cds-spacing-05, 1rem)",
                    textAlign: "left",
                  }}
                  data-testid="recent-searches"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--cds-spacing-02, 0.25rem)",
                      marginBottom: "var(--cds-spacing-03, 0.5rem)",
                    }}
                  >
                    <Time size={12} color="rgba(255,255,255,0.25)" aria-hidden="true" />
                    <span
                      style={{
                        fontFamily:
                          "var(--cds-font-family-sans, 'IBM Plex Sans', sans-serif)",
                        fontSize: "var(--cds-label-01-font-size, 0.75rem)",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.25)",
                      }}
                    >
                      Recent Searches
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--cds-spacing-02, 0.25rem)" }}>
                    {recentZips.map((zip) => (
                      <Tag
                        key={zip}
                        type="blue"
                        filter
                        onClick={() => handleTagClick(zip)}
                        onClose={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          removeRecentZip(zip);
                        }}
                        title={`Remove ${zip}`}
                        style={{ cursor: "pointer", fontFamily: "var(--cds-font-family-mono, 'IBM Plex Mono', monospace)" }}
                      >
                        {zip}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              <p
                style={{
                  fontFamily: "var(--cds-font-family-sans, 'IBM Plex Sans', sans-serif)",
                  fontSize: "var(--cds-label-01-font-size, 0.75rem)",
                  color: "rgba(255,255,255,0.2)",
                  marginTop: "var(--cds-spacing-06, 1.5rem)",
                  letterSpacing: "0.04em",
                }}
              >
                United States only · No account required
              </p>
            </div>
          </Column>
        </Grid>
      </div>

      {/* ── Popular locations ── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "#0d1117",
          padding: "var(--cds-spacing-07, 2rem) 0",
        }}
      >
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <p
              style={{
                fontFamily: "var(--cds-font-family-sans, 'IBM Plex Sans', sans-serif)",
                fontSize: "var(--cds-label-01-font-size, 0.75rem)",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
                marginBottom: "var(--cds-spacing-05, 1rem)",
              }}
            >
              Popular locations
            </p>
          </Column>

          {FEATURED_LOCATIONS.map(({ zip, label, state, Icon }) => (
            <Column key={zip} lg={8} md={4} sm={4}>
              <PopularTile
                zip={zip}
                label={label}
                state={state}
                Icon={Icon}
              />
            </Column>
          ))}
        </Grid>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "var(--cds-spacing-05, 1rem) var(--cds-spacing-07, 2rem)",
        }}
      >
        <Grid>
          <Column lg={8} md={4} sm={2}>
            <p
              style={{
                fontFamily: "var(--cds-font-family-sans, 'IBM Plex Sans', sans-serif)",
                fontSize: "var(--cds-label-01-font-size, 0.75rem)",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              © {new Date().getFullYear()} Forecast4U
            </p>
          </Column>
          <Column lg={8} md={4} sm={2}>
            <p style={{ textAlign: "right" }}>
              <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--cds-font-family-sans, 'IBM Plex Sans', sans-serif)",
                  fontSize: "var(--cds-label-01-font-size, 0.75rem)",
                  color: "rgba(255,255,255,0.2)",
                  textDecoration: "none",
                }}
              >
                Weather data by Open-Meteo
              </a>
            </p>
          </Column>
        </Grid>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PopularTile({
  zip,
  label,
  state,
  Icon,
}: {
  zip: string;
  label: string;
  state: string;
  Icon: React.ComponentType<{ size?: number; color?: string; "aria-hidden"?: boolean }>;
}) {
  const navigate = useNavigate();

  return (
    <ClickableTile
      id={`location-${zip}`}
      onClick={() => navigate(`/weather/${zip}`)}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "0",
        marginBottom: "var(--cds-spacing-03, 0.5rem)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-spacing-04, 0.75rem)" }}>
          <span style={{ color: "rgba(255,255,255,0.25)" }} aria-hidden="true">
            <Icon size={16} />
          </span>
          <div>
            <p
              style={{
                fontFamily: "var(--cds-font-family-sans, 'IBM Plex Sans', sans-serif)",
                fontSize: "var(--cds-body-short-01-font-size, 0.875rem)",
                fontWeight: 400,
                color: "rgba(255,255,255,0.8)",
                margin: 0,
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontFamily: "var(--cds-font-family-mono, 'IBM Plex Mono', monospace)",
                fontSize: "var(--cds-label-01-font-size, 0.75rem)",
                color: "rgba(255,255,255,0.3)",
                margin: 0,
              }}
            >
              {zip} · {state}
            </p>
          </div>
        </div>
        <ArrowRight size={16} color="rgba(255,255,255,0.2)" aria-hidden="true" />
      </div>
    </ClickableTile>
  );
}
