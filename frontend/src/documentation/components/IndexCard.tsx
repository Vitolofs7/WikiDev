import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface IndexCardProps {
  href: string;
  index: number;
  title: string;
  meta?: string;
}

export function IndexCard({ href, index, title, meta }: IndexCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-(--border) bg-(--bg-2) px-5 py-4 transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--bg) text-xs font-semibold tabular-nums text-(--text-muted) transition-colors group-hover:bg-(--accent-soft) group-hover:text-(--accent-light)">
        {index + 1}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium leading-snug text-(--text) transition-colors">
          {title}
        </p>

        {meta && (
          <p className="mt-0.5 text-xs tabular-nums text-(--text-muted)">
            {meta}
          </p>
        )}
      </div>

      <ArrowRight
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-(--text-muted) transition-transform group-hover:translate-x-0.5 group-hover:text-(--accent-light)"
      />
    </Link>
  );
}
