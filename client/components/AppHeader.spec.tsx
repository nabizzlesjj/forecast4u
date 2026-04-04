/**
 * AppHeader component tests
 *
 * Covers: brand link, desktop nav links, Contact Support ghost button
 * (presence, label, href, icon), ZIP quick-search, and mobile menu behaviour.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppHeader from "./AppHeader";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// ── Helper ────────────────────────────────────────────────────────────────────

function renderHeader() {
  return render(
    <MemoryRouter>
      <AppHeader />
    </MemoryRouter>
  );
}

// ── Suites ────────────────────────────────────────────────────────────────────

describe("AppHeader — brand", () => {
  it("renders the Forecast4U brand link pointing to /", () => {
    renderHeader();
    const brand = screen.getByRole("link", { name: /forecast4u/i });
    expect(brand).toBeDefined();
    expect((brand as HTMLAnchorElement).getAttribute("href")).toBe("/");
  });
});

describe("AppHeader — desktop navigation", () => {
  it("renders the Home nav link", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: /^home$/i })).toBeDefined();
  });

  it("renders the Example: NYC nav link pointing to /weather/10001", () => {
    renderHeader();
    const link = screen.getByRole("link", { name: /example: nyc/i }) as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("/weather/10001");
  });

  it("renders the Example: Beverly Hills nav link pointing to /weather/90210", () => {
    renderHeader();
    const link = screen.getByRole("link", { name: /example: beverly hills/i }) as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("/weather/90210");
  });
});

describe("AppHeader — Contact Support ghost button", () => {
  it("renders a Contact Support link in the header", () => {
    renderHeader();
    // There are two (desktop + mobile hidden), getAllByRole finds both
    const links = screen.getAllByRole("link", { name: /contact support/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it("Contact Support link has the correct mailto href", () => {
    renderHeader();
    const links = screen.getAllByRole("link", { name: /contact support/i }) as HTMLAnchorElement[];
    expect(links.some((l) => l.getAttribute("href") === "mailto:support@forecast4u.com")).toBe(true);
  });

  it("Contact Support link contains the LifeBuoy icon (svg)", () => {
    renderHeader();
    const links = screen.getAllByRole("link", { name: /contact support/i });
    const hasSvg = links.some((l) => l.querySelector("svg") !== null);
    expect(hasSvg).toBe(true);
  });

  it("Contact Support link has accessible aria-label", () => {
    renderHeader();
    const links = screen.getAllByLabelText(/contact support/i);
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it("Contact Support link text is visible", () => {
    renderHeader();
    expect(screen.getAllByText(/contact support/i).length).toBeGreaterThanOrEqual(1);
  });
});

describe("AppHeader — ZIP quick search", () => {
  beforeEach(() => mockNavigate.mockClear());

  it("renders the ZIP input with correct placeholder", () => {
    renderHeader();
    expect(screen.getByPlaceholderText("Enter ZIP...")).toBeDefined();
  });

  it("navigates to /weather/:zip when a valid 5-digit ZIP is submitted", () => {
    renderHeader();
    const input = screen.getByPlaceholderText("Enter ZIP...");
    fireEvent.change(input, { target: { value: "30307" } });
    fireEvent.submit(input.closest("form")!);
    expect(mockNavigate).toHaveBeenCalledWith("/weather/30307");
  });

  it("does not navigate when fewer than 5 digits are entered", () => {
    renderHeader();
    const input = screen.getByPlaceholderText("Enter ZIP...");
    fireEvent.change(input, { target: { value: "303" } });
    fireEvent.submit(input.closest("form")!);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe("AppHeader — mobile menu", () => {
  it("mobile menu is hidden by default", () => {
    renderHeader();
    expect(screen.queryByText("Example: NYC (10001)")).toBeNull();
  });

  it("opens the mobile menu when the toggle button is clicked", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(screen.getByText("Example: NYC (10001)")).toBeDefined();
  });

  it("mobile menu includes a Contact Support link", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    const links = screen.getAllByRole("link", { name: /contact support/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it("closes the mobile menu after clicking a nav link", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(screen.getByText("Example: NYC (10001)")).toBeDefined();
    // "Home" exists in both desktop nav and mobile menu — click the mobile one
    const homeLinks = screen.getAllByRole("link", { name: /^home$/i });
    fireEvent.click(homeLinks[homeLinks.length - 1]);
    expect(screen.queryByText("Example: NYC (10001)")).toBeNull();
  });
});
