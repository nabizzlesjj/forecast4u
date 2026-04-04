/**
 * ZipSearch component tests
 *
 * Covers: rendering, input sanitisation, validation errors,
 * navigation, onSearch callback, and localStorage side-effects.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ZipSearch from "./ZipSearch";

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

// ── Suite ────────────────────────────────────────────────────────────────────

describe("ZipSearch — rendering", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it("renders the search input and submit button", () => {
    renderWithRouter(<ZipSearch />);
    expect(screen.getByRole("textbox", { name: /zip code search/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /search/i })).toBeDefined();
  });

  it("pre-fills the input with initialZip prop", () => {
    renderWithRouter(<ZipSearch initialZip="10001" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("10001");
  });

  it("renders a custom placeholder", () => {
    renderWithRouter(<ZipSearch placeholder="Type your ZIP here" />);
    expect(screen.getByPlaceholderText("Type your ZIP here")).toBeDefined();
  });

  it("large variant applies text-base class", () => {
    renderWithRouter(<ZipSearch size="large" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.className).toContain("text-base");
  });

  it("default variant applies text-sm class", () => {
    renderWithRouter(<ZipSearch size="default" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.className).toContain("text-sm");
  });
});

describe("ZipSearch — input sanitisation", () => {
  beforeEach(() => mockNavigate.mockClear());

  it("strips non-numeric characters from input", () => {
    renderWithRouter(<ZipSearch />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "abc12xyz" } });
    expect(input.value).toBe("12");
  });

  it("limits input to 5 digits", () => {
    renderWithRouter(<ZipSearch />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "123456789" } });
    expect(input.value).toBe("12345");
  });

  it("strips letters AND limits to 5 in one change event", () => {
    renderWithRouter(<ZipSearch />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "abc12345xyz" } });
    expect(input.value).toBe("12345");
  });
});

describe("ZipSearch — validation", () => {
  beforeEach(() => mockNavigate.mockClear());

  it("shows an error alert when submitted empty", async () => {
    renderWithRouter(<ZipSearch />);
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeDefined();
      expect(screen.getByText(/please enter a zip code/i)).toBeDefined();
    });
  });

  it("shows an error alert for '123' — too short", async () => {
    renderWithRouter(<ZipSearch />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeDefined();
      expect(screen.getByText(/exactly 5 digits/i)).toBeDefined();
    });
  });

  it("shows an error alert for '9999' — still too short", async () => {
    renderWithRouter(<ZipSearch />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "9999" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeDefined();
    });
  });

  it("clears the error when the user resumes typing", async () => {
    renderWithRouter(<ZipSearch />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    // Trigger error
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeDefined());

    // Type again → error must disappear
    fireEvent.change(input, { target: { value: "3" } });
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });

  it("does not navigate when validation fails", async () => {
    renderWithRouter(<ZipSearch />);
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeDefined());
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe("ZipSearch — submission & navigation", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it("navigates to /weather/30606 when '30606' is submitted", async () => {
    renderWithRouter(<ZipSearch />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "30606" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/weather/30606")
    );
  });

  it("navigates to /weather/90210 for a different valid ZIP", async () => {
    renderWithRouter(<ZipSearch />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "90210" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/weather/90210")
    );
  });

  it("fires the onSearch callback with the ZIP before navigating", async () => {
    const onSearch = vi.fn();
    renderWithRouter(<ZipSearch onSearch={onSearch} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "30606" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith("30606");
      expect(onSearch).toHaveBeenCalledTimes(1);
    });
  });

  it("onSearch is called before navigate", async () => {
    const callOrder: string[] = [];
    const onSearch = vi.fn(() => callOrder.push("onSearch"));
    mockNavigate.mockImplementation(() => callOrder.push("navigate"));

    renderWithRouter(<ZipSearch onSearch={onSearch} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "10001" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => expect(callOrder).toEqual(["onSearch", "navigate"]));
  });

  it("writes the searched ZIP to localStorage via onSearch", async () => {
    const STORAGE_KEY = "forecast4u_recent_zips";
    const onSearch = (zip: string) => {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      const updated = [zip, ...existing.filter((z: string) => z !== zip)].slice(0, 5);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    renderWithRouter(<ZipSearch onSearch={onSearch} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "30606" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      expect(stored).toContain("30606");
    });
  });
});
