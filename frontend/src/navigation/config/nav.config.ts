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
      count: 1,
      items: [
        {
          title: "El camino del programa",
          slug: "el-camino-del-programa",
          subItems: [
            { title: "¿Qué es un programa?", slug: "que-es-un-programa" },
            { title: "Ejecutar Python", slug: "ejecutar-python" },
            { title: "El primer programa", slug: "el-primer-programa" },
            { title: "Valores y tipos", slug: "valores-y-tipos" },
            { title: "Operadores aritméticos", slug: "operadores-aritmeticos" },
            {
              title: "Lenguajes formales y naturales",
              slug: "lenguajes-formales-y-naturales",
            },
            { title: "Depuración", slug: "depuracion" },
          ],
        },
        {
          title: "Control de flujo y operaciones avanzadas",
          slug: "control-de-flujo-y-operaciones-avanzadas",
          subItems: [
            {
              title: "Sentencias de asignación",
              slug: "sentencias-de-asignacion",
            },
            {
              title: "Cómo Python evalúa el código",
              slug: "como-python-evalua-el-codigo",
            },
            { title: "Condicionales", slug: "condicionales" },
            {
              title: "Operaciones con cadenas de texto",
              slug: "operaciones-con-cadenas-de-texto",
            },
            {
              title: "Entrada de datos y validación",
              slug: "entrada-de-datos-y-validacion",
            },
            {
              title: "Estructuras de datos básicas",
              slug: "estructuras-de-datos-basicas",
            },
            { title: "Bucles", slug: "bucles" },
            {
              title: "Compresión en Python",
              slug: "compresion-en-python",
            },
            { title: "Depuración aplicada", slug: "depuracion-aplicada" },
          ],
        },
        {
          title: "Funciones básicas",
          slug: "funciones-basicas",
          subItems: [
            { title: "¿Qué es una función?", slug: "que-es-una-funcion" },
            { title: "Sintaxis y estructura", slug: "sintaxis-y-estructura" },
            { title: "Llamadas a funciones", slug: "llamadas-a-funciones" },
            {
              title: "Parámetros y argumentos",
              slug: "parametros-y-argumentos",
            },
            { title: "Valores de retorno", slug: "valores-de-retorno" },
            { title: "Funciones integradas básicas", slug: "funciones-integradas-basicas" },
            { title: "Variables y ámbito", slug: "variables-y-ambito" },
            { title: "Funciones matemáticas", slug: "funciones-matematicas" },
            { title: "Documentación", slug: "documentacion" },
            { title: "Flujo de ejecución", slug: "flujo-de-ejecucion" },
          ],
        },
        {
          title: "Funciones intermedias",
          slug: "funciones-intermedias",
          subItems: [
            {
              title: "Composición de funciones",
              slug: "composicion-de-funciones",
            },
            { title: "Argumentos avanzados", slug: "argumentos-avanzados" },
            {
              title: "Funciones integradas intermedias",
              slug: "funciones-integradas-intermedias",
            },
            {
              title: "Lógica booleana global con any() y all()",
              slug: "logica-booleana-any-all",
            },
            { title: "Iteración y control", slug: "iteracion-y-control" },
            {
              title: "Iteracion inversa con reversed()",
              slug: "iteracion-inversa-reversed",
            },
            {
              title: "Funciones de texto y números",
              slug: "funciones-texto-y-numeros",
            },
            { title: "Funciones adicionales", slug: "funciones-adicionales" },
            { title: "Diagramas de pila", slug: "diagramas-de-pila" },
          ],
        },
        {
          title: "Funciones avanzadas",
          slug: "funciones-avanzadas",
          subItems: [
            { title: "Funciones como objetos", slug: "funciones-como-objetos" },
            {
              title: "Funciones anidadas y closures",
              slug: "funciones-anidadas-y-closures",
            },
            {
              title: "Funciones integradas avanzadas",
              slug: "funciones-integradas-avanzadas",
            },
            { title: "Evaluacion dinámica", slug: "evaluacion-dinamica" },
            { title: "Depuracion", slug: "depuracion" },
            {
              title: "Funciones lambda introduccion",
              slug: "lambda-introduccion",
            },
            { title: "Funciones lambda uso básico", slug: "lambda-uso-basico" },
            {
              title: "Funciones lambda con funciones integradas",
              slug: "lambda-funciones-integradas",
            },
            {
              title: "Funciones lambda con estructuras",
              slug: "lambda-con-estructuras",
            },
            { title: "Funciones lambda avanzadas", slug: "lambda-avanzada" },
            {
              title: "Programación funcional",
              slug: "lambda-programacion-funcional",
            },
            { title: "Casos reales", slug: "lambda-casos-reales" },
            { title: "Buenas prácticas", slug: "lambda-buenas-practicas" },
            { title: "Trucos avanzados", slug: "lambda-trucos-avanzados" },
          ],
        },
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
