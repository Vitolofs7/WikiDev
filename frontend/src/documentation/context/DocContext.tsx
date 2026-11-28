"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface DocContextValue {
  docKey: string;
  lessonTitle: string;
  notesRevision: number;
  notifyNotesChanged: () => void;
  openNotesDrawer: () => void;
}

const DocContext = createContext<DocContextValue | null>(null);

export function DocProvider({
  value,
  children,
}: {
  value: DocContextValue;
  children: ReactNode;
}) {
  return <DocContext.Provider value={value}>{children}</DocContext.Provider>;
}

export function useDocContext(): DocContextValue | null {
  return useContext(DocContext);
}
