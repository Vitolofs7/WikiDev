export const topicsMeta = [
  {
    slug: "javascript",
    title: "JavaScript",
    emoji: "⚡",
    description: "Arrays, promesas, patrones y más",
    chapters: [],
  },
  {
    slug: "python",
    title: "Python",
    emoji: "🐍",
    description: "Introducción, listas, decoradores y más",
    chapters: [
      { slug: "el-camino-del-programa", title: "El camino del programa" },
      {
        slug: "control-de-flujo-y-operaciones-avanzadas",
        title: "Control de flujo y operaciones avanzadas",
      },
      { slug: "funciones-basicas", title: "Funciones básicas" },
      { slug: "funciones-intermedias", title: "Funciones intermedias" },
      { slug: "funciones-avanzadas", title: "Funciones avanzadas" },
    ],
  },
  {
    slug: "algorithms",
    title: "Algoritmos",
    emoji: "🧠",
    description: "Sorting, búsqueda y estructuras",
    chapters: [],
  },
] as const;