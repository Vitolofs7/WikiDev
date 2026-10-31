import { docsByUnit } from "@/generated/docs.generated";
import { topicsMeta } from "./topics.meta";

export interface NavSubItem {
  title: string;
  slug: string;
}

export interface NavItem {
  title: string;
  slug: string;
  subItems?: NavSubItem[];
}

export interface NavCategory {
  title: string;
  slug: string;
  emoji: string;
  description: string;
  items: NavItem[];
}

const lessons = (unit: string): NavSubItem[] =>
  (docsByUnit[unit] ?? []).map((doc) => ({
    title: doc.title,
    slug: doc.slug.split("/").pop()!,
  }));

export const navConfig = {
  categories: topicsMeta.map((topic) => ({
    title: topic.title,
    slug: topic.slug,
    emoji: topic.emoji,
    description: topic.description,
    items: topic.chapters.map((chapter) => {
      const chapterKey = `${topic.slug}/${chapter.slug}`;
      const chapterDocs = docsByUnit[chapterKey] ?? [];

      return {
        title: chapterDocs[0]?.unitTitle ?? chapter.slug,
        slug: chapter.slug,
        subItems: lessons(chapterKey),
      };
    }),
  })),
} satisfies { categories: NavCategory[] };
