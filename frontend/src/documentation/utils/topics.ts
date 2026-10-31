/**
 * Resumen de temas de documentación.
 *
 * Deriva toda la información de `navConfig`, que ya es la fuente de verdad
 * de las categorías (la usan el menú lateral, el buscador, el historial y
 * las páginas de /docs/[...slug]). No mantiene ninguna lista propia: añadir
 * un tema nuevo a `navConfig` basta para que aparezca en /docs.
 *
 * Los contadores se calculan dinámicamente a partir de `items` y `subItems`,
 * evitando mantener información duplicada en la configuración de navegación.
 */

import { navConfig, type NavCategory } from "@/navigation/config/nav.config";
import { docPath } from "@/shared/utils/routes";

export interface TopicSummary {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  /** Ruta de la portada del tema (`/docs/<slug>`), ya existente. */
  href: string;
  /** Capítulos de primer nivel. */
  chapterCount: number;
  /** Documentos totales: apartados de cada capítulo, o el propio capítulo si no los tiene. */
  documentCount: number;
  /** true si algún capítulo se divide en apartados (p. ej. Python). */
  hasSections: boolean;
  /** Títulos de los capítulos, en orden. */
  chapters: string[];
}

function toSummary(category: NavCategory): TopicSummary {
  const { slug, title, description, emoji, items } = category;

  return {
    slug,
    title,
    description,
    emoji,
    href: docPath(slug),
    chapterCount: items.length,
    documentCount: items.reduce(
      (total, item) => total + (item.subItems?.length || 1),
      0,
    ),
    hasSections: items.some((item) => (item.subItems?.length ?? 0) > 0),
    chapters: items.map((item) => item.title),
  };
}

/** Temas en el mismo orden en que están declarados en `navConfig`. */
export function getTopicSummaries(): TopicSummary[] {
  return navConfig.categories.map(toSummary);
}
