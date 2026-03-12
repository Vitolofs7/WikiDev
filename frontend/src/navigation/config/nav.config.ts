export interface NavItem {
  title: string;
  slug: string;
}

export interface NavCategory {
  title: string;
  slug: string;
  emoji: string;
  description: string;
  count: number;
  items: NavItem[];
}

export const navConfig = {
  categories: [
    {
      title: "JavaScript",
      slug: "javascript",
      emoji: "⚡",
      description: "Arrays, promesas, patrones y más",
      count: 2,
      items: [
        { title: "Arrays y métodos", slug: "arrays" },
        { title: "Promesas y async/await", slug: "promises" },
      ],
    },
    {
      title: "Python",
      slug: "python",
      emoji: "🐍",
      description: "Introducción, listas, decoradores y más",
      count: 3,
      items: [
        { title: "Introducción a Python", slug: "introduccion" },
        { title: "Operaciones básicas con números", slug: "operaciones-basicas-numeros" },
        { title: "Operadores y expresiones", slug: "operadores-expresiones" },
        { title: "Variables", slug: "variables" },
        { title: "Strings", slug: "strings" },
        { title: "Listas y comprensiones", slug: "lists" },
        { title: "Decoradores", slug: "decorators" },
      ],
    },
    {
      title: "Algoritmos",
      slug: "algorithms",
      emoji: "🧠",
      description: "Sorting, búsqueda y estructuras",
      count: 1,
      items: [{ title: "Algoritmos de ordenamiento", slug: "sorting" }],
    },
  ] as NavCategory[],
};
