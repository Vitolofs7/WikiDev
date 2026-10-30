
/**
 * Proporciona un contexto global para controlar el modal de búsqueda.
 * Centraliza el estado de apertura, el atajo Ctrl+K / Cmd+K y el
 * renderizado de SearchModal.
 *
 * Expone useSearchModal() para que cualquier componente descendiente
 * pueda abrir o cerrar el buscador sin gestionar estados independientes.
 */

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
      "useSearchModal debe utilizarse dentro de SearchProvider."
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
        open();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [open]);

  const value = useMemo(
    () => ({ open, close }),
    [open, close]
  );

  return (
    <SearchModalContext.Provider value={value}>
      {children}
      <SearchModal open={isOpen} onClose={close} />
    </SearchModalContext.Provider>
  );
}
