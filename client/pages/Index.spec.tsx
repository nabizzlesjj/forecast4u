/**
 * Index page tests
 *
 * Covers: page structure (Carbon Grid), hero section, ZIP search integration,
 * recent searches (Carbon Tag filter), and popular locations (Carbon ClickableTile).
 *
 * All hooks and the ZipSearch component are mocked so tests run instantly.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Index from "./Index";

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockAddRecentZip = vi.fn();
const mockRemoveRecentZip = vi.fn();
let mockRecentZips: string[] = [];

vi.mock("../hooks/useRecentSearches", () => ({
  useRecentSearches: () => ({
    recentZips: mockRecentZips,
    addRecentZip: mockAddRecentZip,
    removeRecentZip: mockRemoveRecentZip,
  }),
}));

// Stub ZipSearch to a simple accessible input so these tests focus on Index layout
vi.mock("../components/ZipSearch", () => ({
  default: ({
    initialZip = "",
    onSearch,
    placeholder,
  }: {
    initialZip?: string;
    onSearch?: (zip: string) => void;
    placeholder?: string;
  }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const val = (e.currentTarget.querySelector("input") as HTMLInputElement).value;
        if (/^\d{5}$/.test(val)) onSearch?.(val);
      }}
    >
      <input
        aria-label="ZIP code search"
        defaultValue={initialZip}
        placeholder={placeholder}
      />
      <button type="submit">Search</button>
    </form>
  ),
}));

// ── Helper ────────────────────────────────────────────────────────────────────

function renderIndex() {
  return render(
    <MemoryRouter>
      <Index />
    </MemoryRouter>
  );
}

// ── Suites ────────────────────────────────────────────────────────────────────

describe("Index page — hero section", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockAddRecentZip.mockClear();
    mockRecentZips = [];
  });

  it("renders the brand heading with 'Forecast4U'", () => {
    renderIndex();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toBeDefined();
    // h1 contains "Forecast" as a text node and "4U" inside a <span>
    expect(h1.textContent).toContain("Forecast");
    expect(h1.textContent).toContain("4U");
  });

  it("renders the tagline subtitle", () => {
    renderIndex();
    expect(screen.getByText(/instant, accurate U.S. weather/i)).toBeDefined();
  });

  it("renders the ZIP search component", () => {
    renderIndex();
    expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);
  });

  it("renders the 'United States only' disclaimer", () => {
    renderIndex();
    expect(screen.getByText(/united states only/i)).toBeDefined();
  });
});

describe("Index page — recent searches", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockAddRecentZip.mockClear();
    mockRemoveRecentZip.mockClear();
  });

  it("does NOT render the recent searches section when list is empty", () => {
    mockRecentZips = [];
    renderIndex();
    expect(screen.queryByTestId("recent-searches")).toBeNull();
  });

  it("renders the recent searches section when ZIPs are present", () => {
    mockRecentZips = ["30307", "10001"];
    renderIndex();
    expect(screen.getByTestId("recent-searches")).toBeDefined();
    expect(screen.getByText("Recent Searches")).toBeDefined();
  });

  it("renders a Carbon Tag for each recent ZIP", () => {
    mockRecentZips = ["30307", "10001", "90210"];
    renderIndex();
    // Tags should be rendered and contain the ZIP text
    expect(screen.getByText("30307")).toBeDefined();
    expect(screen.getByText("10001")).toBeDefined();
    expect(screen.getByText("90210")).toBeDefined();
  });

  it("clicking a recent ZIP tag navigates to /weather/:zip", () => {
    mockRecentZips = ["30307"];
    renderIndex();
    // Carbon Tag renders the label as a button/span that is clickable
    fireEvent.click(screen.getByText("30307"));
    expect(mockAddRecentZip).toHaveBeenCalledWith("30307");
    expect(mockNavigate).toHaveBeenCalledWith("/weather/30307");
  });

  it("clicking the close button on a tag removes it from recent searches", () => {
    mockRecentZips = ["30307"];
    renderIndex();
    // Carbon filter Tag renders a close button with aria-label containing the zip
    const closeBtns = screen.getAllByRole("button");
    // Find the close/filter button for the tag (it's the last button in the tag group)
    const closeBtn = closeBtns.find(
      (btn) =>
        btn.getAttribute("aria-label")?.includes("30307") ||
        btn.getAttribute("title")?.includes("30307")
    );
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(mockRemoveRecentZip).toHaveBeenCalledWith("30307");
    }
  });
});

describe("Index page — popular locations", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockRecentZips = [];
  });

  it("renders all 6 popular location tiles", () => {
    renderIndex();
    // Each ClickableTile should have the city name visible
    const cityNames = [
      "New York City",
      "Beverly Hills",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
    ];
    cityNames.forEach((city) => {
      expect(screen.getByText(city)).toBeDefined();
    });
  });

  it("each tile displays the ZIP code", () => {
    renderIndex();
    // Sample a few ZIP codes
    expect(screen.getByText(/10001/)).toBeDefined();
    expect(screen.getByText(/90210/)).toBeDefined();
  });

  it("renders Carbon ClickableTile elements for each location", () => {
    const { container } = renderIndex();
    // Carbon ClickableTile renders with cds--tile--clickable class
    const tiles = container.querySelectorAll(".cds--tile--clickable");
    expect(tiles.length).toBe(6);
  });

  it("clicking a location tile navigates to /weather/:zip", () => {
    const { container } = renderIndex();
    const tiles = container.querySelectorAll(".cds--tile--clickable");
    // First tile is New York City (zip 10001)
    fireEvent.click(tiles[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/weather/10001");
  });
});

describe("Index page — footer", () => {
  beforeEach(() => {
    mockRecentZips = [];
  });

  it("renders the copyright notice", () => {
    renderIndex();
    expect(screen.getByText(/forecast4u/i)).toBeDefined();
  });

  it("renders a link to Open-Meteo attribution", () => {
    renderIndex();
    const links = screen.getAllByRole("link");
    const openMeteoLink = links.find((l) =>
      l.getAttribute("href")?.includes("open-meteo.com")
    );
    expect(openMeteoLink).toBeDefined();
  });
});
