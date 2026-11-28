"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SearchModal } from "./SearchModal";

interface SearchModalContextValue {
  open: () => void;
  close: () => void;
}

const SearchModalContext = createContext<SearchModalContextValue | null>(null);

export function useSearchModal() {
  const context = useContext(SearchModalContext);

  if (!context) {
    throw new Error(
      "useSearchModal debe utilizarse dentro de SearchProvider.",
    );
  }

  return context;
}

export function SearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <SearchModalContext.Provider value={value}>
      {children}
      <SearchModal open={isOpen} onClose={close} />
    </SearchModalContext.Provider>
  );
}
