"use client";
import { CodeRunner } from "@/code-execution/components/CodeRunner";
import dynamic from "next/dynamic";
import { TableOfContents } from "@/documentation/components/TableOfContents";
import { Download } from "lucide-react";

const components = { CodeRunner };

const docs: Record<string, React.ComponentType<any>> = {
  "javascript/arrays": dynamic(() => import("@/content/javascript/arrays.mdx")),
  "javascript/promises": dynamic(() => import("@/content/javascript/promises.mdx")),
  "algorithms/sorting": dynamic(() => import("@/content/algorithms/sorting.mdx")),
  // python/el-camino-del-programa
  "python/el-camino-del-programa/que-es-un-programa": dynamic(() => import("@/content/python/el-camino-del-programa/que-es-un-programa.mdx")),
  "python/el-camino-del-programa/ejecutar-python": dynamic(() => import("@/content/python/el-camino-del-programa/ejecutar-python.mdx")),
  "python/el-camino-del-programa/el-primer-programa": dynamic(() => import("@/content/python/el-camino-del-programa/el-primer-programa.mdx")),
  "python/el-camino-del-programa/valores-y-tipos": dynamic(() => import("@/content/python/el-camino-del-programa/valores-y-tipos.mdx")),
  "python/el-camino-del-programa/operadores-aritmeticos": dynamic(() => import("@/content/python/el-camino-del-programa/operadores-aritmeticos.mdx")),
  "python/el-camino-del-programa/lenguajes-formales-y-naturales": dynamic(() => import("@/content/python/el-camino-del-programa/lenguajes-formales-y-naturales.mdx")),
  "python/el-camino-del-programa/depuracion": dynamic(() => import("@/content/python/el-camino-del-programa/depuracion.mdx")),
  // python/control-de-flujo-y-operaciones-avanzadas
  "python/control-de-flujo-y-operaciones-avanzadas/sentencias-de-asignacion": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/sentencias-de-asignacion.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/como-python-evalua-el-codigo": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/como-python-evalua-el-codigo.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/condicionales": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/condicionales.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/operaciones-con-cadenas-de-texto": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/operaciones-con-cadenas-de-texto.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/entrada-de-datos-y-validacion": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/entrada-de-datos-y-validacion.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/bucles": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/bucles.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/compresion-en-python": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/compresion-en-python.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/estructuras-de-datos-basicas": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/estructuras-de-datos-basicas.mdx")),
  "python/control-de-flujo-y-operaciones-avanzadas/depuracion-aplicada": dynamic(() => import("@/content/python/control-de-flujo-y-operaciones-avanzadas/depuracion-aplicada.mdx")),
  // python/funciones-basicas
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
  // python/funciones-intermedias
  "python/funciones-intermedias/composicion-de-funciones": dynamic(() => import("@/content/python/funciones-intermedias/composicion-de-funciones.mdx")),
  "python/funciones-intermedias/argumentos-avanzados": dynamic(() => import("@/content/python/funciones-intermedias/argumentos-avanzados.mdx")),
  "python/funciones-intermedias/funciones-integradas-intermedias": dynamic(() => import("@/content/python/funciones-intermedias/funciones-integradas-intermedias.mdx")),
  "python/funciones-intermedias/logica-booleana-any-all": dynamic(() => import("@/content/python/funciones-intermedias/logica-booleana-any-all.mdx")),
  "python/funciones-intermedias/iteracion-y-control": dynamic(() => import("@/content/python/funciones-intermedias/iteracion-y-control.mdx")),
  "python/funciones-intermedias/iteracion-inversa-reversed": dynamic(() => import("@/content/python/funciones-intermedias/iteracion-inversa-reversed.mdx")),
  "python/funciones-intermedias/funciones-texto-y-numeros": dynamic(() => import("@/content/python/funciones-intermedias/funciones-texto-y-numeros.mdx")),
  "python/funciones-intermedias/funciones-adicionales": dynamic(() => import("@/content/python/funciones-intermedias/funciones-adicionales.mdx")),
  "python/funciones-intermedias/diagramas-de-pila": dynamic(() => import("@/content/python/funciones-intermedias/diagramas-de-pila.mdx")),
  // python/funciones-avanzadas
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
};

interface Props {
  docKey: string;
}

export function DocPageClient({ docKey }: Props) {
  const Content = docs[docKey];
  if (!Content) return null;

  async function handleDownloadPdf() {
    const html2pdf = (await import("html2pdf.js")).default;
    const article = document.querySelector("article.prose-docs");
    if (!article) return;

    const clone = article.cloneNode(true) as HTMLElement;

    const style = document.createElement("style");
    style.textContent = `
      * { font-family: 'Outfit', sans-serif; }
      h1 {
        color: #0a0a0a !important;
        font-size: 2.2rem !important;
        margin-bottom: 1.5rem !important;
        padding-bottom: 0.75rem !important;
        border-bottom: 2px solid #e0e0e0 !important;
      }
      h1::after { display: none !important; }
      h2 {
        color: #1a1a1a !important;
        font-size: 1.3rem !important;
        margin-top: 2rem !important;
        margin-bottom: 1rem !important;
        padding-left: 0 !important;
        border-left: none !important;
        border-bottom: 1px solid #e8e8e8 !important;
        padding-bottom: 0.4rem !important;
      }
      h3 {
        color: #1a1a1a !important;
        font-size: 1.1rem !important;
        margin-top: 1.5rem !important;
        margin-bottom: 0.75rem !important;
      }
      p, li {
        color: #2a2a2a !important;
        line-height: 1.8 !important;
        margin-bottom: 0.75rem !important;
      }
      strong { color: #0a0a0a !important; font-weight: 700; }
      code:not(pre code) {
        background: #f0f0f0 !important;
        color: #333 !important;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace !important;
        font-size: 0.85em !important;
        border: 1px solid #ddd !important;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0 !important;
        font-size: 0.9rem !important;
      }
      th {
        color: #0a0a0a !important;
        border-bottom: 2px solid #333 !important;
        padding: 10px 12px !important;
        text-align: left !important;
        font-weight: 700 !important;
        background: #f5f5f5 !important;
      }
      td {
        color: #2a2a2a !important;
        border-bottom: 1px solid #e0e0e0 !important;
        padding: 10px 12px !important;
        vertical-align: top !important;
      }
      tr:last-child td { border-bottom: none !important; }
      blockquote {
        border-left: 3px solid #333 !important;
        padding-left: 16px !important;
        color: #555 !important;
        margin: 1rem 0 !important;
        font-style: italic !important;
      }
    `;
    clone.prepend(style);

    const filename = docKey.split("/").pop()?.replace(/-/g, " ") ?? "documento";

    const runners = Array.from(article.querySelectorAll(".rounded-2xl"));
    const cloneRunners = Array.from(clone.querySelectorAll(".rounded-2xl"));

    runners.forEach((runner, index) => {
      const textarea = runner.querySelector("textarea");
      const output = runner.querySelector("pre.text-emerald-300");
      const cloneRunner = cloneRunners[index];
      if (!textarea || !cloneRunner) return;

      const wrapper = document.createElement("div");
      wrapper.style.cssText = "margin-bottom: 1.5rem;";

      const codeLabel = document.createElement("div");
      codeLabel.textContent = "Código";
      codeLabel.style.cssText = `
        font-family: 'Outfit', sans-serif;
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #666;
        margin-bottom: 4px;
      `;

      const codeBlock = document.createElement("pre");
      codeBlock.style.cssText = `
        background: #1a1a1a;
        color: #f0f0f0;
        padding: 20px 24px;
        border-radius: 8px 8px 0 0;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.82rem;
        white-space: pre;
        line-height: 1.7;
        margin-bottom: 0;
        border: 1px solid #333;
      `;
      codeBlock.textContent = textarea.value;

      wrapper.appendChild(codeLabel);
      wrapper.appendChild(codeBlock);

      if (output?.textContent?.trim() && !output.textContent.includes("output aparecerá")) {
        const outputLabel = document.createElement("div");
        outputLabel.textContent = "Salida";
        outputLabel.style.cssText = `
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #666;
          margin-top: 12px;
          margin-bottom: 4px;
        `;

        const outputBlock = document.createElement("pre");
        outputBlock.style.cssText = `
          background: #f8f8f8;
          color: #1a1a1a;
          padding: 14px 24px;
          border-radius: 0 0 8px 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem;
          white-space: pre;
          line-height: 1.7;
          margin-top: 0;
          border: 1px solid #e0e0e0;
          border-top: none;
        `;
        outputBlock.textContent = output.textContent;

        wrapper.appendChild(outputLabel);
        wrapper.appendChild(outputBlock);
      }

      cloneRunner.replaceWith(wrapper);
    });

    html2pdf()
      .set({
        margin: [15, 15, 15, 15],
        filename: `${filename}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(clone)
      .save();
  }

  return (
    <div className="flex gap-12 items-start">
      <div className="flex-1 min-w-0">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-zinc-400 transition-all"
            style={{
              fontFamily: "Outfit, sans-serif",
              background: "#14141f",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            title="Ejecuta el código antes de descargar para incluir las salidas"
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
        </div>
        <article className="prose-docs">
          <Content components={components} />
        </article>
      </div>
      <TableOfContents />
    </div>
  );
}