export const DOCS_BASE = "/docs";

export const docPath = (...s: string[]) =>
  [DOCS_BASE, ...s].join("/");