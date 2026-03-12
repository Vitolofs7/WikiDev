# WikiDev

Documentación personal de programación con ejemplos de código ejecutables, notas y búsqueda integrada.

## Stack

**Frontend** — Next.js 16 · TypeScript · Tailwind CSS · MDX  
**Backend** — FastAPI · SQLite · SQLAlchemy

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [Python](https://www.python.org/) 3.10 o superior
- [node](https://nodejs.org/) disponible en el PATH (para ejecutar JavaScript)

## Estructura
```
wikidev/
├── frontend/          # Next.js app
│   └── src/
│       ├── app/       # Rutas (/, /docs, /notes)
│       ├── code-execution/
│       ├── documentation/
│       ├── navigation/
│       ├── notes/
│       ├── search/
│       ├── history/
│       ├── theming/
│       ├── shared/
│       └── content/   # Artículos MDX
└── backend/           # FastAPI app
    ├── code_execution/
    └── notes/
```

## Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/wikidev.git
cd wikidev
```

### 2. Backend
```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Frontend
```bash
cd frontend
npm install
```

Crea el archivo `frontend\.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## Uso

Arranca **ambos servicios** en terminales separadas:

**Backend:**
```bash
cd backend
.venv\Scripts\activate   # Windows
python -m uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## URLs

| Servicio | URL |
|---|---|
| App | http://localhost:3000 |
| API | http://127.0.0.1:8000 |
| Swagger | http://127.0.0.1:8000/docs |

## Funcionalidades

- **Documentación MDX** con ejemplos de código ejecutables (Python y JavaScript)
- **Notas** con editor, autoguardado e imágenes (máx. 5 MB por imagen)
- **Búsqueda** fuzzy con Fuse.js — `Ctrl+K`
- **Historial** de artículos visitados
- **Ejecución de código** local vía subprocess (timeout 5s, máx. 20 ejecuciones/min)

## Contenido actual

**Python** — Introducción, números, expresiones y operadores, variables, strings, listas, decoradores  
**JavaScript** — Arrays, promesas  
**Algoritmos** — Sorting

## Notas de seguridad

- La ejecución de código corre en local vía subprocess, **no usar en producción expuesto a internet**
- Rate limiting: 20 ejecuciones por minuto por IP
- Tamaño máximo de imágenes: 5 MB
- Timeout de ejecución: 5 segundos