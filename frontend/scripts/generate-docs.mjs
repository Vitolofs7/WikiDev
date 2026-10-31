/**

ruta: frontend/scripts/generate-docs.mjs

* Genera automáticamente el registro de documentación a partir de los archivos MDX
* almacenados en el directorio de contenidos. Recopila los metadatos de cada documento,
* incluyendo su slug, unidad, orden de visualización y título, y genera un módulo TypeScript
* con las importaciones dinámicas y los índices necesarios para la resolución de documentos,
* la organización de los contenidos y la navegación entre páginas.

**/

import fs from "node:fs";
import path from "node:path";

const contentDir = path.resolve("src/content");
const outputFile = path.resolve("src/generated/docs.generated.ts");

function getMdxFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getMdxFiles(fullPath);
    }

    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      return [fullPath];
    }

    return [];
  });
}

const orderCache = new Map();

function validateOrderFile(orderFile) {
  if (orderCache.has(orderFile)) {
    return orderCache.get(orderFile);
  }

  const directory = path.dirname(orderFile);

  const mdxFiles = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => path.basename(entry.name, ".mdx"));

  let data;

  try {
    data = JSON.parse(fs.readFileSync(orderFile, "utf8"));
  } catch (error) {
    throw new Error(
      `Invalid JSON in "${orderFile}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error(`"${orderFile}" must contain a JSON object.`);
  }

  for (const filename of Object.keys(data)) {
    if (!mdxFiles.includes(filename)) {
      throw new Error(
        `Entry "${filename}" in "${orderFile}" has no matching MDX file.`,
      );
    }
  }

  orderCache.set(orderFile, data);

  return data;
}

function getMetadata(file) {
  const directory = path.dirname(file);
  const orderFile = path.join(directory, "order.json");
  const filename = path.basename(file, ".mdx");

  const fallback = {
    order: Number.MAX_SAFE_INTEGER,
    title: filename,
  };

  if (!fs.existsSync(orderFile)) {
    return fallback;
  }

  const data = validateOrderFile(orderFile);

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error(`"${orderFile}" must contain a JSON object.`);
  }

  const entry = data[filename];

  if (entry === undefined) {
    return fallback;
  }

  if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
    throw new Error(`Invalid metadata for "${filename}" in "${orderFile}".`);
  }

  const order = entry.order ?? fallback.order;
  const title = entry.title ?? fallback.title;

  if (typeof order !== "number" || !Number.isFinite(order) || order < 0) {
    throw new Error(
      `Invalid order for "${filename}" in "${orderFile}": expected a finite, non-negative number.`,
    );
  }

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error(
      `Invalid title for "${filename}" in "${orderFile}": expected a non-empty string.`,
    );
  }

  return { order, title };
}

function getUnitTitle(unit) {
  const unitDirectory = path.join(contentDir, unit);
  const orderFile = path.join(unitDirectory, "order.json");

  if (!fs.existsSync(orderFile)) {
    return path.basename(unit);
  }

  const data = validateOrderFile(orderFile);
  const firstEntry = Object.entries(data).sort(
    ([, a], [, b]) => a.order - b.order,
  )[0];

  return firstEntry?.[1].title ?? path.basename(unit);
}

if (!fs.existsSync(contentDir)) {
  throw new Error(`Documentation content directory not found: "${contentDir}"`);
}

const files = getMdxFiles(contentDir);

if (files.length === 0) {
  throw new Error(`No MDX documents found in "${contentDir}".`);
}

const entries = files.map((file) => {
  const relativePath = path
    .relative(contentDir, file)
    .split(path.sep)
    .join("/");

  const slug = relativePath.replace(/\.mdx$/, "");
  const importPath = `@/content/${relativePath}`;
  const unit = path.posix.dirname(slug);
  const metadata = getMetadata(file);

  return {
    slug,
    importPath,
    unit,
    order: metadata.order,
    title: metadata.title,
  };
});

const seenSlugs = new Set();

for (const entry of entries) {
  if (seenSlugs.has(entry.slug)) {
    throw new Error(`Duplicate documentation slug detected: "${entry.slug}"`);
  }

  seenSlugs.add(entry.slug);
}

entries.sort((a, b) => {
  if (a.unit !== b.unit) {
    return a.unit.localeCompare(b.unit);
  }

  return a.order - b.order;
});

const imports = entries
  .map(
    ({ slug, importPath }) =>
      `  ${JSON.stringify(slug)}: dynamic(() => import(${JSON.stringify(importPath)})),`,
  )
  .join("\n");

const metadata = entries
  .map(
    ({ slug, unit, order, title }) =>
      `  {
    slug: ${JSON.stringify(slug)},
    unit: ${JSON.stringify(unit)},
    unitTitle: ${JSON.stringify(getUnitTitle(unit))},
    order: ${order},
    title: ${JSON.stringify(title)},
  },`,
  )
  .join("\n");

const output = `import dynamic from "next/dynamic";
import type { ComponentType } from "react";

type DocComponent = ComponentType<any>;

export interface DocMetadata {
  slug: string;
  unit: string;
  unitTitle: string;
  order: number;
  title: string;
}

const docs: Record<string, DocComponent> = {
${imports}
};

export const docsMetadata: DocMetadata[] = [
${metadata}
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
`;

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, output);

console.log(`✓ Generados ${files.length} documentos`);
