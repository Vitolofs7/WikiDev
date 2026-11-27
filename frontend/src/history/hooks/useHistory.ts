"use client";
import { useCallback, useState } from "react";

export interface HistoryItem {
  href: string;
  title: string;
  category: string;
  visitedAt: number;
}

const MAX_ITEMS = 5;
const STORAGE_KEY = "wikidev_history";

function isSafeDocHref(href: unknown): href is string {
  return (
    typeof href === "string" &&
    href.startsWith("/docs/") &&
    !href.startsWith("//") &&
    !/[\x00-\x1f\x7f]/.test(href) &&
    href.length <= 300
  );
}

function isValidHistoryItem(item: unknown): item is HistoryItem {
  if (typeof item !== "object" || item === null) return false;
  const candidate = item as Record<string, unknown>;
  return (
    isSafeDocHref(candidate.href) &&
    typeof candidate.title === "string" &&
    candidate.title.length <= 200 &&
    typeof candidate.category === "string" &&
    candidate.category.length <= 100 &&
    typeof candidate.visitedAt === "number" &&
    Number.isFinite(candidate.visitedAt)
  );
}

function readStoredHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidHistoryItem).slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(readStoredHistory);

  const addToHistory = useCallback((item: Omit<HistoryItem, "visitedAt">) => {
    if (!isSafeDocHref(item.href)) return;
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.href !== item.href);
      const next = [{ ...item, visitedAt: Date.now() }, ...filtered].slice(
        0,
        MAX_ITEMS,
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { history, addToHistory, clearHistory };
}
