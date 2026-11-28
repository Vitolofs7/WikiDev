import { useMemo, useState, useCallback } from "react";
import Fuse from "fuse.js";
import { docPath } from "@/shared/utils/routes";
import { navConfig } from "@/navigation/config/nav.config";
import { docsMetadata } from "@/generated/docs.generated";
import type { Note } from "@/notes/services/notes.service";

export type CommandItemKind = "action" | "doc" | "heading" | "note";
export type SearchScope = "all" | CommandItemKind;

export interface CommandItem {
  id: string;
  kind: CommandItemKind;
  title: string;
  subtitle: string;
  href?: string;
  actionId?:
    | "new-note"
    | "export-pdf"
    | "last-lesson"
    | "go-docs"
    | "go-notes";
  keywords?: string;
  level?: 2 | 3;
}

const categoryBySlug = new Map(
  navConfig.categories.map((cat) => [cat.slug, cat]),
);

const staticDocItems: CommandItem[] = navConfig.categories.flatMap((cat) =>
  cat.items.flatMap((item) => {
    const chapterEntry: CommandItem = {
      id: `doc:${cat.slug}/${item.slug}`,
      kind: "doc",
      title: item.title,
      subtitle: cat.title,
      href: docPath(cat.slug, item.slug),
    };

    const subEntries: CommandItem[] = (item.subItems ?? []).map((sub) => ({
      id: `doc:${cat.slug}/${item.slug}/${sub.slug}`,
      kind: "doc",
      title: sub.title,
      subtitle: `${cat.title} / ${item.title}`,
      href: docPath(cat.slug, item.slug, sub.slug),
    }));

    return [chapterEntry, ...subEntries];
  }),
);

const staticHeadingItems: CommandItem[] = docsMetadata.flatMap((doc) => {
  const topicSlug = doc.slug.split("/")[0] ?? "";
  const topicTitle = categoryBySlug.get(topicSlug)?.title ?? topicSlug;
  const baseHref = docPath(...doc.slug.split("/"));

  return (doc.headings ?? []).map((h) => ({
    id: `heading:${doc.slug}#${h.id}`,
    kind: "heading" as const,
    title: h.text,
    subtitle: `${topicTitle} / ${doc.title}`,
    href: `${baseHref}#${h.id}`,
    level: h.level,
  }));
});

const staticFuse = new Fuse([...staticDocItems, ...staticHeadingItems], {
  keys: [
    { name: "title", weight: 0.72 },
    { name: "subtitle", weight: 0.28 },
  ],
  threshold: 0.36,
  ignoreLocation: true,
});

interface UseUnifiedSearchParams {
  notes: Note[];
  actions: CommandItem[];
  scope: SearchScope;
}

export function useSearch({ notes, actions, scope }: UseUnifiedSearchParams) {
  const [query, setQuery] = useState("");

  const noteItems = useMemo<CommandItem[]>(
    () =>
      notes.map((note) => ({
        id: `note:${note.id}`,
        kind: "note",
        title: note.title || "Sin título",
        subtitle:
          note.content.trim().replace(/\s+/g, " ").slice(0, 90) ||
          "Nota privada",
        href: `/notes?note=${note.id}`,
        keywords: note.content.slice(0, 400),
      })),
    [notes],
  );

  const dynamicFuse = useMemo(
    () =>
      new Fuse([...actions, ...noteItems], {
        keys: [
          { name: "title", weight: 0.6 },
          { name: "subtitle", weight: 0.25 },
          { name: "keywords", weight: 0.15 },
        ],
        threshold: 0.38,
        ignoreLocation: true,
      }),
    [actions, noteItems],
  );

  const results = useMemo<CommandItem[]>(() => {
    const trimmed = query.trim();
    const forceActions = trimmed.startsWith(">");
    const effectiveQuery = forceActions ? trimmed.slice(1).trim() : trimmed;
    const effectiveScope: SearchScope = forceActions ? "action" : scope;

    if (!effectiveQuery) {
      if (effectiveScope === "action") return actions;
      if (effectiveScope === "note") return noteItems.slice(0, 8);
      if (effectiveScope === "doc") return staticDocItems.slice(0, 8);
      if (effectiveScope === "heading") return staticHeadingItems.slice(0, 8);
      return [];
    }

    const dynamicHits = dynamicFuse.search(effectiveQuery).map((r) => r.item);
    const staticHits =
      effectiveScope === "action" || effectiveScope === "note"
        ? []
        : staticFuse.search(effectiveQuery).map((r) => r.item);

    const combined = [...dynamicHits, ...staticHits].filter(
      (item) => effectiveScope === "all" || item.kind === effectiveScope,
    );

    // Agrupa por categoría con un máximo razonable para mantener la paleta ágil
    const order: CommandItemKind[] = ["action", "doc", "heading", "note"];
    const caps: Record<CommandItemKind, number> =
      effectiveScope === "all"
        ? { action: 4, doc: 6, heading: 6, note: 5 }
        : { action: 10, doc: 14, heading: 14, note: 14 };

    return order.flatMap((kind) =>
      combined.filter((i) => i.kind === kind).slice(0, caps[kind]),
    );
  }, [query, scope, actions, noteItems, dynamicFuse]);

  const clear = useCallback(() => {
    setQuery("");
  }, []);

  return { query, results, search: setQuery, clear };
}
