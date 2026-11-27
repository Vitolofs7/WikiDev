---
name: verificar-proyecto
description: Ejecuta la batería completa de comprobaciones de calidad, compilación, tests y seguridad de WikiDev en frontend y backend (docs:generate, typecheck, lint, build, npm audit, pytest, bandit y pip-audit). Úsala antes de dar por cerrada una tarea grande, hacer commit o preparar un pull request.
---

# Verificación completa de WikiDev

Esta habilidad estandariza la verificación integral de **WikiDev** (frontend y backend) en alineación con `.github/workflows/ci.yml`.

## Cuándo usarla

- Al terminar cambios en frontend, backend, dependencias o configuración.
- Antes de confirmar una tarea, hacer commit o abrir un pull request.

## Cuándo no usarla

- En consultas de solo lectura o preguntas teóricas donde no se ha modificado ningún archivo.

## Procedimiento

Ejecuta únicamente las comprobaciones relevantes (o ambas suites si se tocaron frontend y backend):

### 1. Verificación del Frontend (`frontend/`)

1. Regenera los metadatos MDX y comprueba tipos y reglas de lint:
   ```bash
   npm run docs:generate
   npm run typecheck
   npm run lint
   ```
2. Comprueba la compilación de producción:
   ```bash
   npm run build
   ```
3. Audita dependencias npm:
   ```bash
   npm audit --audit-level=high
   ```

### 2. Verificación del Backend (`backend/`)

1. Ejecuta la suite de pruebas de seguridad y funcionales:
   ```bash
   .\.venv\Scripts\pytest.exe -v
   ```
   *(En Linux/macOS: `./.venv/bin/pytest -v`)*
2. Ejecuta análisis estático de seguridad (severidad Medium/High):
   ```bash
   .\.venv\Scripts\bandit.exe -r . -x ./tests,./.venv -ll
   ```
3. Audita dependencias Python:
   ```bash
   .\.venv\Scripts\pip-audit.exe -r requirements.txt
   ```

### 3. Comprobación de higiene Git

- Ejecuta `git status --short` y asegúrate de que no aparezcan archivos sensibles (`.env`, `.env.local`, `wikidev.db` modificado sin intención, ni `note_images/`).

## Árbol de decisión

- ¿Solo se modificó `frontend/`? → Ejecuta el bloque **1** y el **3**.
- ¿Solo se modificó `backend/`? → Ejecuta el bloque **2** y el **3**.
- ¿Se modificaron ambos o dependencias/CI? → Ejecuta los bloques **1**, **2** y **3**.
- ¿Falla `npm audit` o `pip-audit` por falta de red en el entorno? → Informa exactamente qué check no pudo ejecutarse por red y no lo reportes como aprobado.

## Lista de comprobación final

- [ ] Todos los checks aplicables ejecutados **después** de la última edición.
- [ ] Cero errores en `typecheck`, `lint`, `build` y `pytest`.
- [ ] Cero hallazgos Medium/High en `Bandit` y cero vulnerabilidades High/Critical en `npm audit` / `pip-audit`.
- [ ] Sin archivos sensibles o temporales en `git status`.

## Errores frecuentes

| Error | Solución |
|---|---|
| `npm run docs:generate` falla tras mover MDX | Revisa `order.json` y `topics.meta.ts` buscando claves huérfanas o capítulos sin registrar. |
| `pytest` falla por módulo no encontrado | Ejecuta `pytest` desde la carpeta `backend/` donde reside `pytest.ini`. |
| `pip-audit` falla sin conexión | Ejecútalo en un entorno con acceso a PyPI o fuera del sandbox si está permitido. |
