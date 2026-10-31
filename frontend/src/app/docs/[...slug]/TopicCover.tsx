import { langIcons, langColors } from "@/shared/components/LangIcons";
import type { NavCategory } from "@/navigation/config/nav.config";import { docPath } from "@/shared/utils/routes";
import { IndexCard } from "@/documentation/components/IndexCard";

interface TopicCoverProps {
  category: NavCategory;
}

export function TopicCover({ category }: TopicCoverProps) {
  const Icon = langIcons[category.slug];
  const color = langColors[category.slug];

  return (
    <div className="w-full">
      <div className="mb-12 border-b border-white/5 pb-8">
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}30`,
          }}
        >
          {Icon ? (
            <Icon className="h-8 w-8" color={color} />
          ) : (
            <span className="text-4xl">{category.emoji}</span>
          )}
        </div>

        <h1 className="mb-3 text-6xl font-extrabold tracking-tight text-white">
          {category.title}
        </h1>

        <p className="text-xl leading-relaxed text-zinc-500">
          {category.description}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <span
            className="rounded-full px-3 py-1.5 text-sm font-medium"
            style={{
              background: "rgba(124,109,250,0.1)",
              color: "#a89cf7",
              border: "1px solid rgba(124,109,250,0.2)",
            }}
          >
            {category.items.length} capítulos
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {category.items.map((item, index) => (
          <IndexCard
            key={item.slug}
            href={docPath(category.slug, item.slug)}
            index={index}
            title={item.title}
            meta={
              item.subItems?.length
                ? `${item.subItems.length} apartados`
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}