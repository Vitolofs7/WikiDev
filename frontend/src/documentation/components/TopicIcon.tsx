import { langIcons, langColors } from "@/shared/components/LangIcons";

export const DEFAULT_TOPIC_ACCENT = "#69d2de";

export function getTopicAccent(slug: string): string {
  return langColors[slug] ?? DEFAULT_TOPIC_ACCENT;
}

interface TopicIconProps {
  slug: string;
  emoji: string;
  size?: "sm" | "md" | "lg";
  framed?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { box: "h-9 w-9 rounded-lg", icon: "h-5 w-5", emoji: "text-lg" },
  md: { box: "h-11 w-11 rounded-xl", icon: "h-6 w-6", emoji: "text-xl" },
  lg: { box: "h-13 w-13 rounded-2xl", icon: "h-7 w-7", emoji: "text-2xl" },
} as const;

export function TopicIcon({
  slug,
  emoji,
  size = "md",
  framed = true,
  className,
}: TopicIconProps) {
  const Icon = langIcons[slug];
  const accent = getTopicAccent(slug);
  const dims = SIZE_MAP[size];

  const graphic = Icon ? (
    <Icon className={className ?? dims.icon} color={accent} />
  ) : (
    <span className={`${dims.emoji} leading-none`} aria-hidden="true">
      {emoji}
    </span>
  );

  if (!framed) return graphic;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${dims.box}`}
      style={{
        background: `radial-gradient(circle at 30% 20%, ${accent}24, ${accent}0a 78%)`,
        border: `1px solid ${accent}33`,
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      }}
    >
      {graphic}
    </span>
  );
}
