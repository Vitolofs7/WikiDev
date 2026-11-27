import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DocBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function DocBreadcrumbs({ items }: DocBreadcrumbsProps) {
  return (
    <nav
      aria-label="Ruta de navegación"
      className="flex items-center flex-wrap gap-1.5 text-sm"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {!isLast && item.href ? (
              <Link
                href={item.href}
                className="rounded px-1 py-0.5 text-(--text-muted) transition-colors hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className="px-1 py-0.5 font-medium text-(--text)"
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0 text-(--text-muted)/70"
                aria-hidden="true"
              />
            )}
          </span>
        );
      })}
    </nav>
  );
}
