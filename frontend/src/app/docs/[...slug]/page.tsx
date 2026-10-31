/**
 *
 * Gestiona el enrutamiento dinámico de la documentación, resolviendo las páginas según
 * su categoría, capítulo y subapartado. Valida la existencia de los documentos mediante
 * los metadatos generados, muestra índices de navegación cuando corresponde y renderiza
 * las páginas de categoría con su información descriptiva y estructura de capítulos.
 * Además, genera los parámetros de las rutas para facilitar la generación estática
 * de las páginas de documentación.
 */

import { notFound } from "next/navigation";
import { navConfig } from "@/navigation/config/nav.config";
import { DocPageClient } from "./DocPageClient";
import { SubItemsIndex } from "./SubItemsIndex";
import { docsBySlug, docsByUnit } from "@/generated/docs.generated";
import { topicsMeta } from "@/navigation/config/topics.meta";
import { TopicCover } from "./TopicCover";
interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const [category, page, subpage] = slug ?? [];

  // Nivel 3: /docs/python/el-camino-del-programa/que-es-un-programa
  if (subpage) {
    const docKey = `${category}/${page}/${subpage}`;

    if (!docsBySlug[docKey]) {
      notFound();
    }

    return <DocPageClient docKey={docKey} />;
  }

  // Nivel 2: /docs/python/el-camino-del-programa
  if (page) {
    const cat = navConfig.categories.find((c) => c.slug === category);
    const item = cat?.items.find((item) => item.slug === page);

    if (item?.subItems && item.subItems.length > 0) {
      return (
        <SubItemsIndex
          title={item.title}
          category={category}
          page={page}
          subItems={item.subItems}
        />
      );
    }

    // Capítulo sin subapartados — doc directo
    const docKey = `${category}/${page}`;
    if (!docsBySlug[docKey]) {
      notFound();
    }
    return <DocPageClient docKey={docKey} />;
  }

  // Nivel 1: /docs/python
  const cat = navConfig.categories.find((c) => c.slug === category);

  if (!cat) notFound();

  return <TopicCover category={cat} />;
}

export async function generateStaticParams() {
  const paths: { slug: string[] }[] = [];

  const registeredUnits = new Set(
    topicsMeta.flatMap((topic) =>
      topic.chapters.length
        ? topic.chapters.map((chapter) => `${topic.slug}/${chapter.slug}`)
        : [topic.slug],
    ),
  );

  for (const unit of Object.keys(docsByUnit)) {
    if (!registeredUnits.has(unit)) {
      throw new Error(
        `Documentation unit "${unit}" is missing from topics.meta.ts.`,
      );
    }
  }

  for (const category of navConfig.categories) {
    paths.push({ slug: [category.slug] });

    for (const item of category.items) {
      const itemKey = `${category.slug}/${item.slug}`;

      if (!item.subItems?.length && !docsBySlug[itemKey]) {
        throw new Error(
          `Missing MDX document for navigation item: "${itemKey}".`,
        );
      }

      paths.push({ slug: [category.slug, item.slug] });

      if (item.subItems) {
        for (const sub of item.subItems) {
          const subKey = `${category.slug}/${item.slug}/${sub.slug}`;

          if (!docsBySlug[subKey]) {
            throw new Error(
              `Missing MDX document for navigation subitem: "${subKey}".`,
            );
          }
          paths.push({
            slug: [category.slug, item.slug, sub.slug],
          });
        }
      }
    }
  }

  return paths;
}
