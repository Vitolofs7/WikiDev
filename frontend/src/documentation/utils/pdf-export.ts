/**
 * Ruta: frontend/src/documentation/utils/pdf-export.tsx
 *
 * Gestiona la exportación del contenido de una página de documentación a un archivo PDF,
 * utilizando `html2pdf.js` para generar un documento descargable en formato A4. Clona el
 * contenido del artículo para adaptar sus estilos a la impresión sin modificar la
 * presentación original de la página y transforma los editores interactivos de código
 * en bloques estáticos que incluyen el código fuente y, cuando está disponible, su salida.
 * Aplica una hoja de estilos específica para mejorar la legibilidad de títulos, párrafos,
 * tablas, bloques de código y cajas informativas sobre fondo claro. Finalmente, configura
 * los márgenes, la calidad de renderizado y la orientación del documento, y genera el PDF
 * utilizando el nombre de la página como nombre del archivo.
 */

export async function downloadPdf(docKey: string) {
  const html2pdf = (await import("html2pdf.js")).default;

  const article = document.querySelector("[data-doc-article]");

  if (!article) return;

  const clone = article.cloneNode(true) as HTMLElement;

  const style = document.createElement("style");

  style.textContent = `
  * {
    color: #000000 !important;
    background-color: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    text-shadow: none !important;
    border-color: #999999 !important;
    font-family: Arial, Helvetica, sans-serif !important;
  }

  html,
  body {
    background: #ffffff !important;
    color: #000000 !important;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #000000 !important;
    font-weight: bold !important;
    page-break-after: avoid;
  }

  h1 {
    font-size: 28px !important;
    border-bottom: 2px solid #000000 !important;
    padding-bottom: 10px !important;
  }

  h2 {
    font-size: 22px !important;
    border-bottom: 1px solid #999999 !important;
    padding-bottom: 6px !important;
  }

  h3 {
    font-size: 18px !important;
  }

  p, li, span, strong, em {
    color: #000000 !important;
    line-height: 1.6 !important;
  }

  a {
    color: #000000 !important;
    text-decoration: underline !important;
  }

  code {
    color: #000000 !important;
    background: #eeeeee !important;
    font-family: Consolas, monospace !important;
  }

  pre {
    color: #000000 !important;
    background: #eeeeee !important;
    border: 1px solid #cccccc !important;
    padding: 12px !important;
    white-space: pre-wrap !important;
    overflow-wrap: anywhere !important;
  }

  table {
    width: 100% !important;
    border-collapse: collapse !important;
  }

  th, td {
    color: #000000 !important;
    background: #ffffff !important;
    border: 1px solid #999999 !important;
    padding: 8px !important;
  }

  th {
    background: #eeeeee !important;
    font-weight: bold !important;
  }

  blockquote,
  aside[role="note"] {
    color: #000000 !important;
    background: #f2f2f2 !important;
    border-left: 4px solid #666666 !important;
    padding: 12px !important;
  }

  img {
    max-width: 100% !important;
  }

  hr {
    border: none !important;
    border-top: 1px solid #999999 !important;
  }
`;

  clone.prepend(style);

  const filename = docKey.split("/").pop()?.replace(/-/g, " ") ?? "documento";

  // Localizar los editores originales y sus correspondientes clones.
  const runners = Array.from(article.querySelectorAll("[data-code-runner]"));

  const cloneRunners = Array.from(clone.querySelectorAll("[data-code-runner]"));

  // Sustituir los editores interactivos por bloques estáticos.
  runners.forEach((runner, index) => {
    const textarea =
      runner.querySelector<HTMLTextAreaElement>("[data-code-editor]");

    const output = runner.querySelector("[data-code-output='stdout']");

    const cloneRunner = cloneRunners[index];

    if (!textarea || !cloneRunner) return;

    const wrapper = document.createElement("div");

    wrapper.style.cssText = "margin-bottom: 1.5rem;";

    // Etiqueta del código.
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

    // Bloque de código.
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

    // Incluir la salida si existe.
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

  // Configuración y generación del PDF.
  await html2pdf()
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
