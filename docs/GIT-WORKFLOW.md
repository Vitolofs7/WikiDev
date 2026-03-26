# Estrategia de Git y Flujo de Trabajo

## 1. Visión General

Este documento define el modelo de ramas, el flujo de desarrollo y las normas de contribución para el repositorio **WikiDev**.

Objetivos:

* Garantizar la estabilidad del código
* Mantener alta calidad en cada cambio
* Facilitar una entrega continua y segura
* Alinear la forma de trabajo del equipo

---

## 2. Modelo de Ramas

### 2.1 Rama Principal

* `main`

  * Contiene el código listo para producción
  * Debe estar siempre estable y desplegable
  * Es una rama protegida (no se permiten commits directos)

---

### 2.2 Ramas de Trabajo

Se sigue un enfoque **trunk-based con ramas de corta duración**:

* `feat/*` → nuevas funcionalidades
* `fix/*` → corrección de errores
* `hotfix/*` → correcciones críticas en producción
* `release/*` → preparación de versiones
* `docs/*` → documentación interna del proyecto
* `test/*` → creación o mejora de tests
* `chore/*` → tareas de mantenimiento (configuración, dependencias, tooling)

---

## 3. Convención de Nombres

Las ramas deben ser:

* En minúsculas
* Separadas por guiones (`-`)
* Claras y descriptivas
* Escritas en inglés

### Ejemplos

* `feat/user-authentication`
* `feat/search-system`
* `fix/navbar-error`
* `hotfix/api-timeout`
* `release/v1.3.0`
* `docs/git-workflow`
* `test/integration-auth`
* `chore/update-dependencies`

---

## 4. Flujo de Desarrollo

### 4.1 Creación de Rama

Siempre partir desde `main`:

```bash
git checkout main
git pull origin main
git checkout -b <type>/<short-description>
```

---

### 4.2 Desarrollo

* Mantener cambios pequeños y enfocados
* Hacer commits frecuentes
* Sincronizar con `main` regularmente

---

### 4.3 Convención de Commits

Se sigue el estándar **Conventional Commits** (en inglés):

| Tipo     | Descripción      |
| -------- | ---------------- |
| feat     | New feature      |
| fix      | Bug fix          |
| docs     | Documentation    |
| test     | Tests            |
| chore    | Maintenance      |
| refactor | Code improvement |

### Ejemplos

```bash
feat: add authentication system
fix: resolve navbar error
docs: update git workflow documentation
test: add integration tests for auth
```

---

### 4.4 Pull Requests (PR)

Todo cambio debe realizarse mediante un Pull Request.

#### Requisitos:

* Título claro y descriptivo (en inglés)
* Descripción del cambio (en inglés)
* Issue asociado (si aplica)
* Cambios acotados y revisables

---

### 4.5 Integración Continua (CI)

Antes de hacer merge, deben cumplirse:

* ✅ Build exitoso
* ✅ Tests pasando
* ✅ Linting sin errores

---

### 4.6 Code Review

* Mínimo **1 aprobación obligatoria**
* Se evalúa:

  * Calidad del código
  * Consistencia con la arquitectura
  * Posibles impactos en rendimiento

---

### 4.7 Estrategia de Merge

* Usar **Squash Merge** para mantener historial limpio
* Las ramas **no se eliminan automáticamente tras el merge**, para mantener trazabilidad

---

## 5. Flujo de Hotfix

Para errores críticos en producción:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/<short-description>
```

Pasos:

1. Aplicar corrección
2. Crear PR
3. Revisión prioritaria
4. Merge a `main`
5. Despliegue inmediato

---

## 6. Flujo de Release

Para preparar una nueva versión:

```bash
git checkout -b release/vX.X.X
```

### Pasos:

1. Testing final
2. Actualizar versión
3. Actualizar changelog
4. Merge a `main`
5. Crear tag:

```bash
git tag vX.X.X
git push origin vX.X.X
```

---

## 7. Reglas de Protección de Ramas

La rama `main` debe tener:

* ❌ Prohibidos commits directos
* ✅ Pull Request obligatorio
* ✅ Checks de CI obligatorios
* ✅ Al menos 1 aprobación
* ✅ Rama actualizada antes de merge

---

## 8. Convención de Idioma

Todo el contenido relacionado con el repositorio debe estar en inglés:

* Nombres de ramas
* Mensajes de commit
* Títulos y descripciones de Pull Requests

Esto garantiza consistencia y alineación con estándares profesionales.

---

## 9. Buenas Prácticas

* Mantener ramas de corta duración (< 2–3 días)
* Evitar Pull Requests grandes
* Hacer rebase frecuente para evitar conflictos
* Escribir commits claros y consistentes
* Preferir cambios pequeños e incrementales

---

## 10. Resumen

* `main` siempre estable y lista para producción
* Uso de ramas especializadas (`feat/*`, `fix/*`, `docs/*`, `test/*`, etc.)
* PR + CI + Code Review obligatorios
* Uso obligatorio de inglés en todo el flujo
* Versionado mediante `release/*` y tags

---

## 11. Referencias

* https://www.conventionalcommits.org/
* https://trunkbaseddevelopment.com/

---
