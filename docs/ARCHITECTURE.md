# WikiDev — Architecture

Este documento describe la arquitectura de **WikiDev**, detallando **frontend, backend, comunicación entre componentes**, estructura de carpetas y flujo de ejecución del sistema.

---

## 1. Overview

**WikiDev** es una aplicación de documentación personal de programación que combina:

- Artículos en **MDX** con ejemplos ejecutables de código (Python y JavaScript)
- Gestión de **notas personales** con editor avanzado y almacenamiento
- Búsqueda integrada **fuzzy** para encontrar artículos rápidamente
- Registro de **historial** y ejecución de código de forma controlada

El sistema se divide en dos aplicaciones principales:

1. **Frontend:** interfaz web, rutas y componentes interactivos
2. **Backend:** API REST, ejecución de código y almacenamiento de datos

---

## 2. Stack Tecnológico

| Capa | Tecnologías |
|------|------------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, MDX |
| Backend | FastAPI, Python 3.10+, SQLite, SQLAlchemy |
| Build / Deployment | Node.js 18+, Python venv, Uvicorn |

---

## 3. Folder Structure

```text
wikidev/
├── frontend/
│   └── src/
│       ├── app/             # Rutas principales de Next.js: /, /docs, /notes
│       ├── code-execution/  # Componentes y hooks para ejecución de código en frontend
│       ├── documentation/   # Páginas de documentación y renderizado MDX
│       ├── navigation/      # Barra lateral, breadcrumbs, menú de navegación
│       ├── notes/           # Editor de notas, autoguardado e imágenes
│       ├── search/          # Lógica de búsqueda fuzzy (Fuse.js)
│       ├── history/         # Registro de artículos visitados
│       ├── theming/         # Configuración de tema, dark/light
│       ├── shared/          # Componentes reutilizables (buttons, modals, etc.)
│       └── content/         # Archivos MDX con artículos de Python, JS y algoritmos
└── backend/
    ├── code_execution/      # Lógica de ejecución de código Python/JS con subprocess
    └── notes/               # CRUD de notas, persistencia en SQLite
````

---

## 4. Component Responsibilities

### Frontend

* **Rutas (`app/`)**: Maneja la navegación de la aplicación (`/`, `/docs`, `/notes`)
* **Code Execution**: Envía el código del usuario al backend para ejecución controlada
* **Documentation**: Renderiza MDX con ejemplos ejecutables
* **Search**: Implementa búsqueda fuzzy de artículos
* **Notes**: Editor de notas, soporte para imágenes, autoguardado
* **History**: Guarda historial de artículos visitados
* **Theming**: Gestiona la apariencia (dark/light mode)
* **Shared Components**: Botones, modals y otros componentes reutilizables
* **Content**: Almacena los archivos MDX con artículos y ejemplos

### Backend

* **API Endpoints**: FastAPI maneja rutas `/notes`, `/code-execution`
* **Code Execution**: Ejecuta código en subprocess con seguridad:

  * Timeout: 5s
  * Máx. 20 ejecuciones/minuto por IP
* **Database Layer**: SQLite + SQLAlchemy para persistencia de notas y artículos
* **Security**: Rate limiting y control de acceso, ejecución local solo en entorno seguro

---

## 5. Communication Flow

1. **Frontend → Backend**

   * Requests HTTP a endpoints FastAPI para notas, historial y ejecución de código
   * Ejemplo: `POST /code-execution` envía código a ejecutar

2. **Backend → Frontend**

   * Respuestas JSON con resultados de ejecución, notas o artículos
   * Manejo de errores y límites de ejecución

3. **Frontend Interno**

   * Componentes intercomunicantes vía props, hooks y contexto global
   * Ejemplo: búsqueda fuzzy interactúa con historial y contenido MDX

---

## 6. Data Flow

* **Articles (MDX)** → renderizado en frontend con soporte de ejemplos ejecutables
* **Notes** → CRUD mediante API, persistencia SQLite
* **Execution Requests** → envío al backend, control de rate limit y timeout
* **History** → almacenamiento temporal en frontend, sincronización opcional

---

## 7. Deployment Overview

* **Backend**: `uvicorn main:app --reload` durante desarrollo; producción vía container o servidor WSGI
* **Frontend**: `npm run dev` para desarrollo; build con `npm run build` y deploy estático
* **Environment Variables**:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## 8. Security Considerations

* La ejecución de código corre **localmente**, nunca exponer en internet sin protección
* Rate limiting: 20 ejecuciones/minuto por IP
* Timeout: 5 segundos por ejecución
* Tamaño máximo de imágenes: 5 MB
* Validación de inputs antes de ejecución