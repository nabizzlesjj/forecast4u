import { useState, useEffect } from "react";

const STORAGE_KEY = "forecast4u_recent_zips";
const MAX_RECENT = 5;

function loadFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((z) => /^\d{5}$/.test(z));
    return [];
  } catch {
    return [];
  }
}

function saveToStorage(zips: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(zips));
  } catch {
    // Storage unavailable — silently ignore
  }
}

export function useRecentSearches() {
  const [recentZips, setRecentZips] = useState<string[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setRecentZips(loadFromStorage());
  }, []);

  /** Prepend zip, deduplicate, cap at MAX_RECENT, then persist. */
  function addRecentZip(zip: string) {
    if (!/^\d{5}$/.test(zip)) return;
    setRecentZips((prev) => {
      const deduped = [zip, ...prev.filter((z) => z !== zip)].slice(0, MAX_RECENT);
      saveToStorage(deduped);
      return deduped;
    });
  }

  /** Remove a single zip from the list. */
  function removeRecentZip(zip: string) {
    setRecentZips((prev) => {
      const updated = prev.filter((z) => z !== zip);
      saveToStorage(updated);
      return updated;
    });
  }

  return { recentZips, addRecentZip, removeRecentZip };
}
