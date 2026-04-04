/**
 * useRecentSearches hook tests
 *
 * Covers: hydrating from localStorage on mount, adding ZIPs
 * (prepend, dedup, max-5 cap), and removing individual ZIPs.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecentSearches } from "./useRecentSearches";

const STORAGE_KEY = "forecast4u_recent_zips";

// ── Helpers ──────────────────────────────────────────────────────────────────

function seedStorage(zips: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(zips));
}

function readStorage(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

// ── Suite ────────────────────────────────────────────────────────────────────

describe("useRecentSearches — initial load", () => {
  beforeEach(() => localStorage.clear());

  it("starts empty when localStorage is empty", () => {
    const { result } = renderHook(() => useRecentSearches());
    expect(result.current.recentZips).toEqual([]);
  });

  it("hydrates from localStorage on mount", () => {
    seedStorage(["10001", "90210"]);
    const { result } = renderHook(() => useRecentSearches());
    expect(result.current.recentZips).toEqual(["10001", "90210"]);
  });

  it("ignores non-5-digit entries stored in localStorage", () => {
    seedStorage(["10001", "bad", "999", "90210"]);
    const { result } = renderHook(() => useRecentSearches());
    expect(result.current.recentZips).toEqual(["10001", "90210"]);
  });

  it("handles corrupted localStorage gracefully (returns empty)", () => {
    localStorage.setItem(STORAGE_KEY, "not-valid-json{{{");
    const { result } = renderHook(() => useRecentSearches());
    expect(result.current.recentZips).toEqual([]);
  });
});

describe("useRecentSearches — addRecentZip", () => {
  beforeEach(() => localStorage.clear());

  it("adds a ZIP to the front of the list", () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecentZip("30606"));
    expect(result.current.recentZips[0]).toBe("30606");
  });

  it("persists the new ZIP to localStorage", () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecentZip("30606"));
    expect(readStorage()).toContain("30606");
  });

  it("prepends the new ZIP ahead of existing ones", () => {
    seedStorage(["10001", "90210"]);
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecentZip("60601"));
    expect(result.current.recentZips).toEqual(["60601", "10001", "90210"]);
  });

  it("deduplicates — moves existing ZIP to front instead of adding duplicate", () => {
    seedStorage(["10001", "90210", "60601"]);
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecentZip("90210"));
    expect(result.current.recentZips).toEqual(["90210", "10001", "60601"]);
    expect(result.current.recentZips.filter((z) => z === "90210")).toHaveLength(1);
  });

  it("caps the list at 5 entries", () => {
    seedStorage(["11111", "22222", "33333", "44444", "55555"]);
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecentZip("66666"));
    expect(result.current.recentZips).toHaveLength(5);
    expect(result.current.recentZips[0]).toBe("66666");
    expect(result.current.recentZips).not.toContain("55555");
  });

  it("does not add non-5-digit strings", () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecentZip("123"));
    act(() => result.current.addRecentZip("abcde"));
    expect(result.current.recentZips).toHaveLength(0);
  });

  it("does not add a string longer than 5 digits", () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecentZip("123456"));
    expect(result.current.recentZips).toHaveLength(0);
  });
});

describe("useRecentSearches — removeRecentZip", () => {
  beforeEach(() => localStorage.clear());

  it("removes the specified ZIP from the list", () => {
    seedStorage(["10001", "90210", "60601"]);
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.removeRecentZip("90210"));
    expect(result.current.recentZips).toEqual(["10001", "60601"]);
  });

  it("persists the removal to localStorage", () => {
    seedStorage(["10001", "90210"]);
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.removeRecentZip("90210"));
    expect(readStorage()).not.toContain("90210");
  });

  it("is a no-op when the ZIP is not in the list", () => {
    seedStorage(["10001", "90210"]);
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.removeRecentZip("99999"));
    expect(result.current.recentZips).toEqual(["10001", "90210"]);
  });

  it("results in an empty list when the last ZIP is removed", () => {
    seedStorage(["10001"]);
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.removeRecentZip("10001"));
    expect(result.current.recentZips).toHaveLength(0);
    expect(readStorage()).toHaveLength(0);
  });
});
