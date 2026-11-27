"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useHistory } from "../hooks/useHistory";
import { navConfig } from "@/navigation/config/nav.config";
import { docsBySlug } from "@/generated/docs.generated";

export function HistoryTracker() {
  const pathname = usePathname();
  const { addToHistory } = useHistory();

  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] !== "docs" || parts.length < 3) return;

    const [, category, slug, subSlug] = parts;
    const cat = navConfig.categories.find((c) => c.slug === category);
    const item = cat?.items.find((i) => i.slug === slug);
    if (!cat || !item) return;

    const docKey = subSlug
      ? `${category}/${slug}/${subSlug}`
      : `${category}/${slug}`;
    const docMeta = docsBySlug[docKey];

    if (subSlug && !docMeta) return;

    addToHistory({
      href: pathname,
      title: docMeta?.title ?? item.title,
      category: cat.title,
    });
  }, [pathname, addToHistory]);

  return null;
}
