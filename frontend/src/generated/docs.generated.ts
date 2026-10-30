import dynamic from "next/dynamic";
import type { ComponentType } from "react";

type DocComponent = ComponentType<any>;

export interface DocMetadata {
  slug: string;
  unit: string;
  order: number;
  title: string;
}

const docs: Record<string, DocComponent> = {
  "algorithms/sorting": dynamic(() => import("@/content/algorithms/sorting.mdx")),
  "javascript/arrays": dynamic(() => import("@/content/javascript/arrays.mdx")),
  "javascript/promises": dynamic(() => import("@/content/javascript/promises.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/sentencias-de-asignacion": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/sentencias-de-asignacion.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/como-python-evalua-el-codigo": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/como-python-evalua-el-codigo.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/condicionales": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/condicionales.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/operaciones-con-cadenas-de-texto": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/operaciones-con-cadenas-de-texto.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/entrada-de-datos-y-validacion": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/entrada-de-datos-y-validacion.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/estructuras-de-datos-basicas": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/estructuras-de-datos-basicas.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/bucles": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/bucles.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/compresion-en-python": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/compresion-en-python.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/depuracion-aplicada": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/depuracion-aplicada.mdx")),
  "python/el-camino-del-programa/que-es-un-programa": dynamic(() => import("@/content/python/el-camino-del-programa/que-es-un-programa.mdx")),
  "python/el-camino-del-programa/ejecutar-python": dynamic(() => import("@/content/python/el-camino-del-programa/ejecutar-python.mdx")),
  "python/el-camino-del-programa/el-primer-programa": dynamic(() => import("@/content/python/el-camino-del-programa/el-primer-programa.mdx")),
  "python/el-camino-del-programa/valores-y-tipos": dynamic(() => import("@/content/python/el-camino-del-programa/valores-y-tipos.mdx")),
  "python/el-camino-del-programa/operadores-aritmeticos": dynamic(() => import("@/content/python/el-camino-del-programa/operadores-aritmeticos.mdx")),
  "python/el-camino-del-programa/lenguajes-formales-y-naturales": dynamic(() => import("@/content/python/el-camino-del-programa/lenguajes-formales-y-naturales.mdx")),
  "python/el-camino-del-programa/depuracion": dynamic(() => import("@/content/python/el-camino-del-programa/depuracion.mdx")),
  "python/funciones-avanzadas/funciones-como-objetos": dynamic(() => import("@/content/python/funciones-avanzadas/funciones-como-objetos.mdx")),
  "python/funciones-avanzadas/funciones-anidadas-y-closures": dynamic(() => import("@/content/python/funciones-avanzadas/funciones-anidadas-y-closures.mdx")),
  "python/funciones-avanzadas/funciones-integradas-avanzadas": dynamic(() => import("@/content/python/funciones-avanzadas/funciones-integradas-avanzadas.mdx")),
  "python/funciones-avanzadas/evaluacion-dinamica": dynamic(() => import("@/content/python/funciones-avanzadas/evaluacion-dinamica.mdx")),
  "python/funciones-avanzadas/depuracion": dynamic(() => import("@/content/python/funciones-avanzadas/depuracion.mdx")),
  "python/funciones-avanzadas/lambda-introduccion": dynamic(() => import("@/content/python/funciones-avanzadas/lambda-introduccion.mdx")),
  "python/funciones-avanzadas/lambda-uso-basico": dynamic(() => import("@/content/python/funciones-avanzadas/lambda-uso-basico.mdx")),
  "python/funciones-avanzadas/lambda-funciones-integradas": dynamic(() => import("@/content/python/funciones-avanzadas/lambda-funciones-integradas.mdx")),
  "python/funciones-avanzadas/lambda-con-estructuras": dynamic(() => import("@/content/python/funciones-avanzadas/lambda-con-estructuras.mdx")),
  "python/funciones-avanzadas/lambda-avanzada": dynamic(() => import("@/content/python/funciones-avanzadas/lambda-avanzada.mdx")),
  "python/funciones-avanzadas/lambda-programacion-funcional": dynamic(() => import("@/content/python/funciones-avanzadas/lambda-programacion-funcional.mdx")),
  "python/funciones-avanzadas/lambda-casos-reales": dynamic(() => import("@/content/python/funciones-avanzadas/lambda-casos-reales.mdx")),
  "python/funciones-avanzadas/lambda-buenas-practicas": dynamic(() => import("@/content/python/funciones-avanzadas/lambda-buenas-practicas.mdx")),
  "python/funciones-avanzadas/lambda-trucos-avanzados": dynamic(() => import("@/content/python/funciones-avanzadas/lambda-trucos-avanzados.mdx")),
  "python/funciones-basicas/que-es-una-funcion": dynamic(() => import("@/content/python/funciones-basicas/que-es-una-funcion.mdx")),
  "python/funciones-basicas/sintaxis-y-estructura": dynamic(() => import("@/content/python/funciones-basicas/sintaxis-y-estructura.mdx")),
  "python/funciones-basicas/llamadas-a-funciones": dynamic(() => import("@/content/python/funciones-basicas/llamadas-a-funciones.mdx")),
  "python/funciones-basicas/parametros-y-argumentos": dynamic(() => import("@/content/python/funciones-basicas/parametros-y-argumentos.mdx")),
  "python/funciones-basicas/valores-de-retorno": dynamic(() => import("@/content/python/funciones-basicas/valores-de-retorno.mdx")),
  "python/funciones-basicas/funciones-integradas-basicas": dynamic(() => import("@/content/python/funciones-basicas/funciones-integradas-basicas.mdx")),
  "python/funciones-basicas/variables-y-ambito": dynamic(() => import("@/content/python/funciones-basicas/variables-y-ambito.mdx")),
  "python/funciones-basicas/funciones-matematicas": dynamic(() => import("@/content/python/funciones-basicas/funciones-matematicas.mdx")),
  "python/funciones-basicas/documentacion": dynamic(() => import("@/content/python/funciones-basicas/documentacion.mdx")),
  "python/funciones-basicas/flujo-de-ejecucion": dynamic(() => import("@/content/python/funciones-basicas/flujo-de-ejecucion.mdx")),
  "python/funciones-intermedias/composicion-de-funciones": dynamic(() => import("@/content/python/funciones-intermedias/composicion-de-funciones.mdx")),
  "python/funciones-intermedias/argumentos-avanzados": dynamic(() => import("@/content/python/funciones-intermedias/argumentos-avanzados.mdx")),
  "python/funciones-intermedias/funciones-integradas-intermedias": dynamic(() => import("@/content/python/funciones-intermedias/funciones-integradas-intermedias.mdx")),
  "python/funciones-intermedias/logica-booleana-any-all": dynamic(() => import("@/content/python/funciones-intermedias/logica-booleana-any-all.mdx")),
  "python/funciones-intermedias/iteracion-y-control": dynamic(() => import("@/content/python/funciones-intermedias/iteracion-y-control.mdx")),
  "python/funciones-intermedias/iteracion-inversa-reversed": dynamic(() => import("@/content/python/funciones-intermedias/iteracion-inversa-reversed.mdx")),
  "python/funciones-intermedias/funciones-texto-y-numeros": dynamic(() => import("@/content/python/funciones-intermedias/funciones-texto-y-numeros.mdx")),
  "python/funciones-intermedias/funciones-adicionales": dynamic(() => import("@/content/python/funciones-intermedias/funciones-adicionales.mdx")),
  "python/funciones-intermedias/diagramas-de-pila": dynamic(() => import("@/content/python/funciones-intermedias/diagramas-de-pila.mdx")),
};

export const docsMetadata: DocMetadata[] = [
  {
    slug: "algorithms/sorting",
    unit: "algorithms/sorting",
    order: 1,
    title: "Sorting",
  },
  {
    slug: "javascript/arrays",
    unit: "javascript/arrays",
    order: 1,
    title: "Arrays",
  },
  {
    slug: "javascript/promises",
    unit: "javascript/promises",
    order: 2,
    title: "Promises",
  },
  {
    slug: "python/control-de-flujo-y-operaciones-avanzadas/sentencias-de-asignacion",
    unit: "python/control-de-flujo-y-operaciones-avanzadas",
    order: 1,
    title: "Sentencias de asignación",
  },
  {
    slug: "python/control-de-flujo-y-operaciones-avanzadas/como-python-evalua-el-codigo",
    unit: "python/control-de-flujo-y-operaciones-avanzadas",
    order: 2,
    title: "Cómo Python evalúa el código",
  },
  {
    slug: "python/control-de-flujo-y-operaciones-avanzadas/condicionales",
    unit: "python/control-de-flujo-y-operaciones-avanzadas",
    order: 3,
    title: "Condicionales",
  },
  {
    slug: "python/control-de-flujo-y-operaciones-avanzadas/operaciones-con-cadenas-de-texto",
    unit: "python/control-de-flujo-y-operaciones-avanzadas",
    order: 4,
    title: "Operaciones con cadenas de texto",
  },
  {
    slug: "python/control-de-flujo-y-operaciones-avanzadas/entrada-de-datos-y-validacion",
    unit: "python/control-de-flujo-y-operaciones-avanzadas",
    order: 5,
    title: "Entrada de datos y validación",
  },
  {
    slug: "python/control-de-flujo-y-operaciones-avanzadas/estructuras-de-datos-basicas",
    unit: "python/control-de-flujo-y-operaciones-avanzadas",
    order: 6,
    title: "Estructuras de datos básicas",
  },
  {
    slug: "python/control-de-flujo-y-operaciones-avanzadas/bucles",
    unit: "python/control-de-flujo-y-operaciones-avanzadas",
    order: 7,
    title: "Bucles",
  },
  {
    slug: "python/control-de-flujo-y-operaciones-avanzadas/compresion-en-python",
    unit: "python/control-de-flujo-y-operaciones-avanzadas",
    order: 8,
    title: "Compresión en Python",
  },
  {
    slug: "python/control-de-flujo-y-operaciones-avanzadas/depuracion-aplicada",
    unit: "python/control-de-flujo-y-operaciones-avanzadas",
    order: 9,
    title: "Depuración aplicada",
  },
  {
    slug: "python/el-camino-del-programa/que-es-un-programa",
    unit: "python/el-camino-del-programa",
    order: 1,
    title: "¿Qué es un programa?",
  },
  {
    slug: "python/el-camino-del-programa/ejecutar-python",
    unit: "python/el-camino-del-programa",
    order: 2,
    title: "Ejecutar Python",
  },
  {
    slug: "python/el-camino-del-programa/el-primer-programa",
    unit: "python/el-camino-del-programa",
    order: 3,
    title: "El primer programa",
  },
  {
    slug: "python/el-camino-del-programa/valores-y-tipos",
    unit: "python/el-camino-del-programa",
    order: 4,
    title: "Valores y tipos",
  },
  {
    slug: "python/el-camino-del-programa/operadores-aritmeticos",
    unit: "python/el-camino-del-programa",
    order: 5,
    title: "Operadores aritméticos",
  },
  {
    slug: "python/el-camino-del-programa/lenguajes-formales-y-naturales",
    unit: "python/el-camino-del-programa",
    order: 6,
    title: "Lenguajes formales y naturales",
  },
  {
    slug: "python/el-camino-del-programa/depuracion",
    unit: "python/el-camino-del-programa",
    order: 7,
    title: "Depuración",
  },
  {
    slug: "python/funciones-avanzadas/funciones-como-objetos",
    unit: "python/funciones-avanzadas",
    order: 1,
    title: "Funciones como objetos",
  },
  {
    slug: "python/funciones-avanzadas/funciones-anidadas-y-closures",
    unit: "python/funciones-avanzadas",
    order: 2,
    title: "Funciones anidadas y closures",
  },
  {
    slug: "python/funciones-avanzadas/funciones-integradas-avanzadas",
    unit: "python/funciones-avanzadas",
    order: 3,
    title: "Funciones integradas avanzadas",
  },
  {
    slug: "python/funciones-avanzadas/evaluacion-dinamica",
    unit: "python/funciones-avanzadas",
    order: 4,
    title: "Evaluación dinámica",
  },
  {
    slug: "python/funciones-avanzadas/depuracion",
    unit: "python/funciones-avanzadas",
    order: 5,
    title: "Depuración",
  },
  {
    slug: "python/funciones-avanzadas/lambda-introduccion",
    unit: "python/funciones-avanzadas",
    order: 6,
    title: "Funciones Lambda: Introducción",
  },
  {
    slug: "python/funciones-avanzadas/lambda-uso-basico",
    unit: "python/funciones-avanzadas",
    order: 7,
    title: "Funciones Lambda: Uso básico",
  },
  {
    slug: "python/funciones-avanzadas/lambda-funciones-integradas",
    unit: "python/funciones-avanzadas",
    order: 8,
    title: "Funciones Lambda: Funciones integradas",
  },
  {
    slug: "python/funciones-avanzadas/lambda-con-estructuras",
    unit: "python/funciones-avanzadas",
    order: 9,
    title: "Funciones Lambda: Con estructuras",
  },
  {
    slug: "python/funciones-avanzadas/lambda-avanzada",
    unit: "python/funciones-avanzadas",
    order: 10,
    title: "Funciones Lambda: Avanzada",
  },
  {
    slug: "python/funciones-avanzadas/lambda-programacion-funcional",
    unit: "python/funciones-avanzadas",
    order: 11,
    title: "Funciones Lambda: Programación funcional",
  },
  {
    slug: "python/funciones-avanzadas/lambda-casos-reales",
    unit: "python/funciones-avanzadas",
    order: 12,
    title: "Funciones Lambda: Casos reales",
  },
  {
    slug: "python/funciones-avanzadas/lambda-buenas-practicas",
    unit: "python/funciones-avanzadas",
    order: 13,
    title: "Funciones Lambda: Buenas prácticas",
  },
  {
    slug: "python/funciones-avanzadas/lambda-trucos-avanzados",
    unit: "python/funciones-avanzadas",
    order: 14,
    title: "Funciones Lambda: Trucos avanzados",
  },
  {
    slug: "python/funciones-basicas/que-es-una-funcion",
    unit: "python/funciones-basicas",
    order: 1,
    title: "¿Qué es una función?",
  },
  {
    slug: "python/funciones-basicas/sintaxis-y-estructura",
    unit: "python/funciones-basicas",
    order: 2,
    title: "Sintaxis y estructura",
  },
  {
    slug: "python/funciones-basicas/llamadas-a-funciones",
    unit: "python/funciones-basicas",
    order: 3,
    title: "Llamadas a funciones",
  },
  {
    slug: "python/funciones-basicas/parametros-y-argumentos",
    unit: "python/funciones-basicas",
    order: 4,
    title: "Parámetros y argumentos",
  },
  {
    slug: "python/funciones-basicas/valores-de-retorno",
    unit: "python/funciones-basicas",
    order: 5,
    title: "Valores de retorno",
  },
  {
    slug: "python/funciones-basicas/funciones-integradas-basicas",
    unit: "python/funciones-basicas",
    order: 6,
    title: "Funciones integradas básicas",
  },
  {
    slug: "python/funciones-basicas/variables-y-ambito",
    unit: "python/funciones-basicas",
    order: 7,
    title: "Variables y ámbito",
  },
  {
    slug: "python/funciones-basicas/funciones-matematicas",
    unit: "python/funciones-basicas",
    order: 8,
    title: "Funciones matemáticas",
  },
  {
    slug: "python/funciones-basicas/documentacion",
    unit: "python/funciones-basicas",
    order: 9,
    title: "Documentación",
  },
  {
    slug: "python/funciones-basicas/flujo-de-ejecucion",
    unit: "python/funciones-basicas",
    order: 10,
    title: "Flujo de ejecución",
  },
  {
    slug: "python/funciones-intermedias/composicion-de-funciones",
    unit: "python/funciones-intermedias",
    order: 1,
    title: "Composición de funciones",
  },
  {
    slug: "python/funciones-intermedias/argumentos-avanzados",
    unit: "python/funciones-intermedias",
    order: 2,
    title: "Argumentos avanzados",
  },
  {
    slug: "python/funciones-intermedias/funciones-integradas-intermedias",
    unit: "python/funciones-intermedias",
    order: 3,
    title: "Funciones integradas intermedias",
  },
  {
    slug: "python/funciones-intermedias/logica-booleana-any-all",
    unit: "python/funciones-intermedias",
    order: 4,
    title: "Lógica booleana: any y all",
  },
  {
    slug: "python/funciones-intermedias/iteracion-y-control",
    unit: "python/funciones-intermedias",
    order: 5,
    title: "Iteración y control",
  },
  {
    slug: "python/funciones-intermedias/iteracion-inversa-reversed",
    unit: "python/funciones-intermedias",
    order: 6,
    title: "Iteración inversa: reversed",
  },
  {
    slug: "python/funciones-intermedias/funciones-texto-y-numeros",
    unit: "python/funciones-intermedias",
    order: 7,
    title: "Funciones de texto y números",
  },
  {
    slug: "python/funciones-intermedias/funciones-adicionales",
    unit: "python/funciones-intermedias",
    order: 8,
    title: "Funciones adicionales",
  },
  {
    slug: "python/funciones-intermedias/diagramas-de-pila",
    unit: "python/funciones-intermedias",
    order: 9,
    title: "Diagramas de pila",
  },
];

export const docsBySlug: Record<string, DocMetadata> =
  Object.fromEntries(
    docsMetadata.map((doc) => [doc.slug, doc])
  );

export const docsByUnit: Record<string, DocMetadata[]> =
  docsMetadata.reduce<Record<string, DocMetadata[]>>((groups, doc) => {
    (groups[doc.unit] ??= []).push(doc);
    return groups;
  }, {});

export default docs;
