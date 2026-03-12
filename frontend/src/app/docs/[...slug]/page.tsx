import { langIcons, langColors } from "@/shared/components/LangIcons";
import { notFound } from "next/navigation";
import { navConfig } from "@/navigation/config/nav.config";
import { DocPageClient } from "./DocPageClient";

const validDocs = [
  "javascript/arrays",
  "javascript/promises",

  "python/introduccion",
  "python/operaciones-basicas-numeros",
  "python/operadores-expresiones",
  "python/variables",
  "python/strings",
  "python/lists",
  "python/decorators",

  "algorithms/sorting",
];

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const [category, page] = slug ?? [];

  if (!page) {
    const cat = navConfig.categories.find((c) => c.slug === category);
    if (!cat) notFound();

    return (
      <div className="max-w-2xl">
        {/* Hero */}
        <div className="mb-12 pb-8 border-b border-white/5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: `${langColors[cat!.slug]}15`,
              border: `1px solid ${langColors[cat!.slug]}30`,
            }}
          >
            {(() => {
              const Icon = langIcons[cat!.slug];
              return Icon ? (
                <Icon className="w-8 h-8" color={langColors[cat.slug]} />
              ) : (
                <span className="text-4xl">{cat!.emoji}</span>
              );
            })()}
          </div>
          <h1
            className="text-6xl font-extrabold text-white mb-3 tracking-tight"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {cat!.title}
          </h1>
          <p
            className="text-zinc-500 text-xl leading-relaxed"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {cat!.description}
          </p>
          <div className="flex items-center gap-2 mt-4">
            <span
              className="px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                background: "rgba(124,109,250,0.1)",
                color: "#a89cf7",
                border: "1px solid rgba(124,109,250,0.2)",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {cat!.items.length} artículos
            </span>
          </div>
        </div>

        {/* Articles */}
        <div className="space-y-3">
          {cat!.items.map((item, i) => {
            const href = `/docs/${cat!.slug}/${item.slug}`;
            return (
              <a
                key={item.slug}
                href={href}
                className="flex items-center gap-5 p-6 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all group"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-base"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,109,250,0.15), rgba(6,214,160,0.1))",
                    border: "1px solid rgba(124,109,250,0.2)",
                    color: "#a89cf7",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <p
                    className="text-white font-semibold text-xl group-hover:text-violet-300 transition-colors"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {item.title}
                  </p>
                </div>
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0"
                  style={{
                    background: "rgba(124,109,250,0.15)",
                    color: "#a89cf7",
                  }}
                >
                  →
                </div>
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  const docKey = `${category}/${page}`;
  if (!validDocs.includes(docKey)) notFound();

  return <DocPageClient docKey={docKey} />;
}

export async function generateStaticParams() {
  const paths: { slug: string[] }[] = [];
  for (const category of navConfig.categories) {
    paths.push({ slug: [category.slug] });
    for (const item of category.items) {
      paths.push({ slug: [category.slug, item.slug] });
    }
  }
  return paths;
}
