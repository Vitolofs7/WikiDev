import Link from "next/link";

interface IndexCardProps {
  href: string;
  index: number;
  title: string;
  meta?: string;
}

export function IndexCard({
  href,
  index,
  title,
  meta,
}: IndexCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-white/5 p-5 transition-all hover:border-violet-500/30"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="flex-1">
        <p className="text-base leading-snug text-zinc-300 transition-colors group-hover:text-white">
          {title}
        </p>

        {meta && (
          <p className="mt-1 text-xs text-zinc-600">
            {meta}
          </p>
        )}
      </div>

      <div
        className="flex h-7 w-7 shrink-0 -translate-x-1 items-center justify-center rounded-lg text-sm opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
        style={{
          background: "rgba(124,109,250,0.15)",
          color: "#a89cf7",
        }}
      >
        →
      </div>
    </Link>
  );
}