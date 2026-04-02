import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ZipSearch from "./ZipSearch";

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("ZipSearch component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the search input and button", () => {
    renderWithRouter(<ZipSearch />);
    expect(screen.getByRole("textbox", { name: /zip code search/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /search/i })).toBeDefined();
  });

  it("renders with an initial ZIP value", () => {
    renderWithRouter(<ZipSearch initialZip="10001" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("10001");
  });

  it("accepts only numeric input and limits to 5 digits", () => {
    renderWithRouter(<ZipSearch />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "abc12345xyz" } });
    expect(input.value).toBe("12345");
  });

  it("shows error when submitted with empty input", async () => {
    renderWithRouter(<ZipSearch />);
    const form = screen.getByRole("button", { name: /search/i });
    fireEvent.click(form);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeDefined();
      expect(screen.getByText(/please enter a zip code/i)).toBeDefined();
    });
  });

  it("shows error when submitted with a non-5-digit ZIP", async () => {
    renderWithRouter(<ZipSearch />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "123" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeDefined();
      expect(screen.getByText(/exactly 5 digits/i)).toBeDefined();
    });
  });

  it("navigates to /weather/:zip when a valid ZIP is submitted", async () => {
    renderWithRouter(<ZipSearch />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "90210" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/weather/90210");
    });
  });

  it("clears the error when the user starts typing after an error", async () => {
    renderWithRouter(<ZipSearch />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    const button = screen.getByRole("button", { name: /search/i });

    // Trigger error
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeDefined();
    });

    // Start typing — error should clear
    fireEvent.change(input, { target: { value: "1" } });
    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeNull();
    });
  });

  it("renders in large size variant", () => {
    renderWithRouter(<ZipSearch size="large" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    // Large variant has a different class — check it exists
    expect(input.className).toContain("text-2xl");
  });

  it("accepts a custom placeholder", () => {
    renderWithRouter(<ZipSearch placeholder="Type your ZIP here" />);
    const input = screen.getByPlaceholderText("Type your ZIP here");
    expect(input).toBeDefined();
  });
});
