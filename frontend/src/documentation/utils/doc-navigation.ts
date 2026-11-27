import { docsBySlug, docsByUnit } from "@/generated/docs.generated";
import { navConfig } from "@/navigation/config/nav.config";
import { docPath } from "@/shared/utils/routes";
import type { BreadcrumbItem } from "@/documentation/components/DocBreadcrumbs";

function formatBreadcrumb(segment: string): string {
  const words = segment.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function getAdjacentDocs(docKey: string) {
  const unitDocs = docsByUnit[docsBySlug[docKey]?.unit ?? ""] ?? [];
  const index = unitDocs.findIndex((doc) => doc.slug === docKey);

  return {
    prev: index > 0 ? unitDocs[index - 1] : null,
    next:
      index >= 0 && index < unitDocs.length - 1
        ? unitDocs[index + 1]
        : null,
    position: index >= 0 ? index + 1 : null,
    total: unitDocs.length,
  };
}

export function getBreadcrumbs(docKey: string): string[] {
  const segments = docKey.split("/");
  const [categorySlug, pageSlug] = segments;

  const category = navConfig.categories.find(
    (item) => item.slug === categorySlug,
  );
  const page = category?.items.find((item) => item.slug === pageSlug);

  return segments.map((segment, index) => {
    if (index === 0 && category) return category.title;
    if (index === 1 && page) return page.title;

    const currentSlug = segments.slice(0, index + 1).join("/");
    return docsBySlug[currentSlug]?.title ?? formatBreadcrumb(segment);
  });
}

export function getBreadcrumbLinks(docKey: string): BreadcrumbItem[] {
  const segments = docKey.split("/");
  const labels = getBreadcrumbs(docKey);

  const items: BreadcrumbItem[] = [
    { label: "Documentación", href: docPath() },
  ];

  segments.forEach((_, index) => {
    const isLast = index === segments.length - 1;
    items.push({
      label: labels[index],
      href: isLast ? undefined : docPath(...segments.slice(0, index + 1)),
    });
  });

  return items;
}
