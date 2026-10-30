/**
 * Icono y color de acento de un tema.
 *
 * Reutiliza `langIcons` y `langColors` (los mismos que usa la portada de
 * cada tema). Si un tema nuevo aún no tiene icono propio, se muestra su
 * emoji; si no tiene color, el acento morado de la marca.
 */

import { langIcons, langColors } from "@/shared/components/LangIcons";

export const DEFAULT_TOPIC_ACCENT = "#a89cf7";

export function getTopicAccent(slug: string): string {
  return langColors[slug] ?? DEFAULT_TOPIC_ACCENT;
}

interface TopicIconProps {
  slug: string;
  emoji: string;
  className?: string;
}

export function TopicIcon({ slug, emoji, className = "h-7 w-7" }: TopicIconProps) {
  const Icon = langIcons[slug];

  if (!Icon) {
    return (
      <span className="text-3xl leading-none" aria-hidden="true">
        {emoji}
      </span>
    );
  }

  return <Icon className={className} color={getTopicAccent(slug)} />;
}
