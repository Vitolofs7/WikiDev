/**

ruta: frontend/src/documentation/components/PdfExport.tsx

* Gestiona la exportación del contenido de una página de documentación a un archivo PDF,
* utilizando `html2pdf.js` para generar un documento descargable en formato A4. Clona el
* contenido del artículo para adaptar sus estilos a la impresión sin modificar la
* presentación original de la página y transforma los editores interactivos de código
* en bloques estáticos que incluyen el código fuente y, cuando está disponible, su salida.
* Aplica una hoja de estilos específica para mejorar la legibilidad de títulos, párrafos,
* tablas, bloques de código y cajas informativas sobre fondo claro. Finalmente, configura
* los márgenes, la calidad de renderizado y la orientación del documento, y genera el PDF
* utilizando el nombre de la página como nombre del archivo.

**/


export async function downloadPdf(docKey: string) {
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

    strong {
      color: #0a0a0a !important;
      font-weight: 700;
    }

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

    tr:last-child td {
      border-bottom: none !important;
    }

    blockquote {
      border-left: 3px solid #333 !important;
      padding-left: 16px !important;
      color: #555 !important;
      margin: 1rem 0 !important;
      font-style: italic !important;
    }

    /* Callout: mantiene el borde de color por tipo, pero pasa a fondo claro para imprimir */
    aside[role="note"] {
      background: #ffffff !important;
      border-top: 1px solid #e0e0e0 !important;
      border-right: 1px solid #e0e0e0 !important;
      border-bottom: 1px solid #e0e0e0 !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      margin: 1.25rem 0 !important;
      box-shadow: none !important;
      color: #2a2a2a !important;
    }

    aside[role="note"] > div {
      background: #ffffff !important;
    }

    aside[role="note"] p {
      color: #2a2a2a !important;
      margin-bottom: 0 !important;
    }

    aside[role="note"] [class*="text-blue-300"] {
      color: #1d4ed8 !important;
      background: rgba(29, 78, 216, 0.08) !important;
      border-color: rgba(29, 78, 216, 0.25) !important;
    }

    aside[role="note"] [class*="text-violet-300"] {
      color: #6d28d9 !important;
      background: rgba(109, 40, 217, 0.08) !important;
      border-color: rgba(109, 40, 217, 0.25) !important;
    }

    aside[role="note"] [class*="text-red-300"] {
      color: #b91c1c !important;
      background: rgba(185, 28, 28, 0.08) !important;
      border-color: rgba(185, 28, 28, 0.25) !important;
    }

    aside[role="note"] [class*="text-emerald-300"] {
      color: #047857 !important;
      background: rgba(4, 120, 87, 0.08) !important;
      border-color: rgba(4, 120, 87, 0.25) !important;
    }
  `;

  clone.prepend(style);

  const filename =
    docKey.split("/").pop()?.replace(/-/g, " ") ?? "documento";

  const runners = Array.from(
    article.querySelectorAll(".rounded-2xl")
  );

  const cloneRunners = Array.from(
    clone.querySelectorAll(".rounded-2xl")
  );

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

    if (
      output?.textContent?.trim() &&
      !output.textContent.includes("output aparecerá")
    ) {
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
      image: {
        type: "jpeg",
        quality: 0.98,
      },
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