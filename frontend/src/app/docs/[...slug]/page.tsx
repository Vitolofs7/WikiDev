import { langIcons, langColors } from "@/shared/components/LangIcons";
import { notFound } from "next/navigation";
import { navConfig, NavItem } from "@/navigation/config/nav.config";
import { DocPageClient } from "./DocPageClient";
import { SubItemsIndex } from "./SubItemsIndex";

const validDocs = [
  "javascript/arrays",
  "javascript/promises",
  "algorithms/sorting",
  // python/el-camino-del-programa
  "python/el-camino-del-programa/que-es-un-programa",
  "python/el-camino-del-programa/ejecutar-python",
  "python/el-camino-del-programa/el-primer-programa",
  "python/el-camino-del-programa/valores-y-tipos",
  "python/el-camino-del-programa/operadores-aritmeticos",
  "python/el-camino-del-programa/lenguajes-formales-y-naturales",
  "python/el-camino-del-programa/depuracion",
  // python/control-de-flujo-y-operaciones-avanzadas
  "python/control-de-flujo-y-operaciones-avanzadas/sentencias-de-asignacion",
  "python/control-de-flujo-y-operaciones-avanzadas/como-python-evalua-el-codigo",
  "python/control-de-flujo-y-operaciones-avanzadas/condicionales",
  "python/control-de-flujo-y-operaciones-avanzadas/operaciones-con-cadenas-de-texto",
  "python/control-de-flujo-y-operaciones-avanzadas/entrada-de-datos-y-validacion",
  "python/control-de-flujo-y-operaciones-avanzadas/bucles",
  "python/control-de-flujo-y-operaciones-avanzadas/compresion-en-python",
  "python/control-de-flujo-y-operaciones-avanzadas/estructuras-de-datos-basicas",
  "python/control-de-flujo-y-operaciones-avanzadas/depuracion-aplicada",
  // python/funciones-basicas
  "python/funciones-basicas/que-es-una-funcion",
  "python/funciones-basicas/sintaxis-y-estructura",
  "python/funciones-basicas/llamadas-a-funciones",
  "python/funciones-basicas/parametros-y-argumentos",
  "python/funciones-basicas/valores-de-retorno",
  "python/funciones-basicas/funciones-integradas-basicas",
  "python/funciones-basicas/variables-y-ambito",
  "python/funciones-basicas/funciones-matematicas",
  "python/funciones-basicas/documentacion",
  "python/funciones-basicas/flujo-de-ejecucion",
  // python/funciones-intermedias
  "python/funciones-intermedias/composicion-de-funciones",
  "python/funciones-intermedias/argumentos-avanzados",
  "python/funciones-intermedias/funciones-integradas-intermedias",
  "python/funciones-intermedias/logica-booleana-any-all",
  "python/funciones-intermedias/iteracion-y-control",
  "python/funciones-intermedias/iteracion-inversa-reversed",
  "python/funciones-intermedias/funciones-texto-y-numeros",
  "python/funciones-intermedias/funciones-adicionales",
  "python/funciones-intermedias/diagramas-de-pila",
  // python/funciones-avanzadas
  "python/funciones-avanzadas/funciones-como-objetos",
  "python/funciones-avanzadas/funciones-anidadas-y-closures",
  "python/funciones-avanzadas/funciones-integradas-avanzadas",
  "python/funciones-avanzadas/evaluacion-dinamica",
  "python/funciones-avanzadas/depuracion",
  "python/funciones-avanzadas/lambda-introduccion",
  "python/funciones-avanzadas/lambda-uso-basico",
  "python/funciones-avanzadas/lambda-funciones-integradas",
  "python/funciones-avanzadas/lambda-con-estructuras",
  "python/funciones-avanzadas/lambda-avanzada",
  "python/funciones-avanzadas/lambda-programacion-funcional",
  "python/funciones-avanzadas/lambda-casos-reales",
  "python/funciones-avanzadas/lambda-buenas-practicas",
  "python/funciones-avanzadas/lambda-trucos-avanzados",
];

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const [category, page, subpage] = slug ?? [];

  // Nivel 3: /docs/python/el-camino-del-programa/que-es-un-programa
  if (subpage) {
    const docKey = `${category}/${page}/${subpage}`;
    if (!validDocs.includes(docKey)) notFound();
    return <DocPageClient docKey={docKey} />;
  }

  // Nivel 2: /docs/python/el-camino-del-programa
  if (page) {
    const cat = navConfig.categories.find((c) => c.slug === category);
    const item = cat?.items.find((i) => i.slug === page) as NavItem | undefined;

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
    if (!validDocs.includes(docKey)) notFound();
    return <DocPageClient docKey={docKey} />;
  }

  // Nivel 1: /docs/python
  const cat = navConfig.categories.find((c) => c.slug === category);
  if (!cat) notFound();

  return (
    <div className="w-full">
      <div className="mb-12 pb-8 border-b border-white/5">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: `${langColors[cat!.slug]}15`,
            border: `1px solid ${langColors[cat!.slug]}30`,
          }}
        >
          {(() => {
            const Icon = langIcons[cat!.slug];
            return Icon ? (
              <Icon className="w-8 h-8" color={langColors[cat!.slug]} />
            ) : (
              <span className="text-4xl">{cat!.emoji}</span>
            );
          })()}
        </div>
        <h1
          className="text-6xl font-extrabold text-white mb-3 tracking-tight"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {cat!.title}
        </h1>
        <p
          className="text-zinc-500 text-xl leading-relaxed"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {cat!.description}
        </p>
        <div className="flex items-center gap-2 mt-4">
          <span
            className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{
              background: "rgba(124,109,250,0.1)",
              color: "#a89cf7",
              border: "1px solid rgba(124,109,250,0.2)",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {cat!.items.length} capítulos
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {cat!.items.map((item: NavItem, i: number) => (
          <a
            key={item.slug}
            href={`/docs/${cat!.slug}/${item.slug}`}
            className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all group"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,109,250,0.15), rgba(6,214,160,0.1))",
                border: "1px solid rgba(124,109,250,0.2)",
                color: "#a89cf7",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="flex-1">
              <p
                className="text-base text-zinc-300 group-hover:text-white transition-colors leading-snug"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {item.title}
              </p>
              {item.subItems && (
                <p
                  className="text-xs text-zinc-600 mt-1"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  {item.subItems.length} apartados
                </p>
              )}
            </div>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 text-sm"
              style={{ background: "rgba(124,109,250,0.15)", color: "#a89cf7" }}
            >
              →
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const paths: { slug: string[] }[] = [];
  for (const category of navConfig.categories) {
    paths.push({ slug: [category.slug] });
    for (const item of category.items) {
      paths.push({ slug: [category.slug, item.slug] });
      if (item.subItems) {
        for (const sub of item.subItems) {
          paths.push({ slug: [category.slug, item.slug, sub.slug] });
        }
      }
    }
  }
  return paths;
}
