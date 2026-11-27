---
name: crear-articulo-mdx
description: Crea, organiza y valida artículos de documentación MDX en WikiDev (archivos .mdx, order.json, topics.meta.ts y ejemplos interactivos con CodeRunner y Callout). Úsala cuando el usuario pida añadir una nueva lección, capítulo, tema o tutorial a la documentación de WikiDev.
---

# Crear artículos de documentación MDX en WikiDev

Esta habilidad guía la creación de artículos, capítulos o temas nuevos en la documentación de **WikiDev**, manteniendo sincronizados los archivos `.mdx`, `order.json`, `topics.meta.ts` y la generación automática de rutas estáticas.

## Cuándo usarla

- Añadir una nueva lección o tutorial en `frontend/src/content/`.
- Crear un nuevo capítulo o tema de programación en la documentación.
- Incorporar ejemplos ejecutables con `<CodeRunner>` o avisos con `<Callout>`.

## Cuándo no usarla

- Crear notas personales del usuario (eso se gestiona desde `/notes` y la API `/api/notes`).
- Modificar componentes de UI fuera de los archivos MDX de contenido.

## Estructura de la documentación

- Artículos MDX: `frontend/src/content/<tema>/[<capitulo>/]<articulo>.mdx`
- Orden y títulos por carpeta: `order.json` dentro de cada carpeta con archivos `.mdx`
- Registro de temas y capítulos: `frontend/src/navigation/config/topics.meta.ts`
- Generador de índice: `frontend/scripts/generate-docs.mjs` → genera `frontend/src/generated/docs.generated.ts` (no editar a mano ni versionar).

## Procedimiento

1. **Ubica el tema y capítulo:**
   - Revisa `frontend/src/navigation/config/topics.meta.ts` y las carpetas existentes en `frontend/src/content/`.
   - Si creas un **tema nuevo** o un **capítulo nuevo**, añádelo a `topicsMeta` en `frontend/src/navigation/config/topics.meta.ts` (de lo contrario `generateStaticParams` fallará en el build).
   - Usa nombres de archivo y carpeta en minúsculas con guiones (`kebab-case`), sin tildes ni espacios.

2. **Redacta el archivo `.mdx`:**
   - Empieza con un encabezado `# Título` (H1) seguido de una breve introducción y secciones `##` (H2) y `###` (H3) para que `TableOfContents` genere el índice automáticamente.
   - Los únicos componentes personalizados disponibles por defecto en `DocPageClient.tsx` son `CodeRunner` y `Callout`.
   - Para ejemplos ejecutables, usa `<CodeRunner>`:
     ```mdx
     <CodeRunner
       language="python"
       title="Ejemplo básico"
       initialCode={`
     print("Hola WikiDev")
       `}
     />
     ```
   - Valores válidos de `language`: `"python"` o `"javascript"`. Si el ejemplo lee entrada estándar (`input()`), añade `stdin={true}`.
   - No incluyas secretos, rutas locales personales ni HTML crudo innecesario.

3. **Actualiza `order.json`:**
   - En la misma carpeta del `.mdx`, añade la entrada correspondiente usando como clave el nombre del archivo **sin** `.mdx`:
     ```json
     {
       "mi-articulo": {
         "order": 1,
         "title": "Mi artículo"
       }
     }
     ```
   - Regla crítica de `generate-docs.mjs`: toda clave de `order.json` debe tener un archivo `.mdx` con el mismo nombre, `order` debe ser un número finito `>= 0` y `title` una cadena no vacía.

4. **Regenera y valida:**
   Desde `frontend/`:
   ```bash
   npm run docs:generate
   npm run typecheck
   npm run lint
   ```

## Árbol de decisión

- ¿El artículo pertenece a un capítulo existente? → Crea `<articulo>.mdx` y actualiza el `order.json` de esa carpeta.
- ¿Es un capítulo nuevo dentro de un tema existente? → Crea la carpeta del capítulo, añade el `.mdx` y su `order.json`, y registra el capítulo en `topics.meta.ts`.
- ¿Es un tema completamente nuevo? → Crea la carpeta en `frontend/src/content/<tema>/`, añade sus `.mdx` y `order.json`, y registra el tema en `topics.meta.ts`.

## Lista de comprobación final

- [ ] Nombre de archivo y carpeta en `kebab-case` sin espacios ni tildes.
- [ ] Entrada añadida y válida en `order.json` (clave exacta del `.mdx`, `order >= 0`, `title` no vacío).
- [ ] Tema/capítulo registrado en `frontend/src/navigation/config/topics.meta.ts` si es nuevo.
- [ ] Los `<CodeRunner>` usan `language="python"` o `"javascript"` y código funcional.
- [ ] `npm run docs:generate`, `npm run typecheck` y `npm run lint` pasan sin errores.

## Errores frecuentes

| Error | Causa y solución |
|---|---|
| `Entry "..." in order.json has no matching MDX file` | Hay una clave en `order.json` que no coincide con ningún `.mdx` de la carpeta; corrige el nombre o elimina la clave sobrante. |
| `Documentation unit "..." is missing from topics.meta.ts` | Falta registrar el tema o capítulo nuevo en `frontend/src/navigation/config/topics.meta.ts`. |
| El ejemplo no aparece en el índice lateral | Asegúrate de usar encabezados Markdown `#`, `##`, `###` en el `.mdx`. |
