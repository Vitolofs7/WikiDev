# WikiDev — Architecture

This document describes the architecture of **WikiDev**, including its frontend, backend, communication flow, folder structure, data persistence, and execution process.

---

## 1. Overview

**WikiDev** is a personal programming documentation application designed to centralize technical learning resources and development tools.

Its main features include:

- **Technical documentation:** MDX articles organized by topics, chapters, and lessons.
- **Interactive code execution:** Run Python and JavaScript examples directly from the documentation.
- **Personal notes:** Create, edit, search, and delete notes, with support for image attachments.
- **Integrated search:** Fuzzy search powered by Fuse.js.
- **Browsing history:** Track visited documentation pages.
- **Responsive interface:** Modular frontend architecture with reusable components.

The application is divided into two main components:

1. **Frontend:** Web interface, navigation, documentation rendering, search, and interactive features.
2. **Backend:** REST API, code execution, note management, and persistent storage.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend framework | Next.js 16, React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Documentation | MDX |
| Search | Fuse.js |
| Icons and animations | Lucide React, Motion |
| PDF generation | html2pdf.js |
| Backend framework | FastAPI |
| Backend language | Python |
| Database | SQLite |
| ORM | SQLAlchemy |
| Data validation | Pydantic |
| Frontend tooling | Node.js, npm, ESLint |

---

## 3. Project Structure

The repository follows a modular organization, separating frontend features, backend responsibilities, and documentation content.

```text
wikidev/
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docs/
│   └── ARCHITECTURE.md
│
├── frontend/
│   ├── scripts/
│   │   └── generate-docs.mjs
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── docs/
│   │   │   │   └── [...slug]/
│   │   │   └── notes/
│   │   │
│   │   ├── code-execution/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   │
│   │   ├── content/
│   │   │   ├── algorithms/
│   │   │   ├── javascript/
│   │   │   └── python/
│   │   │       ├── control-de-flujo-y-operaciones-avanzadas/
│   │   │       ├── el-camino-del-programa/
│   │   │       ├── funciones-avanzadas/
│   │   │       ├── funciones-basicas/
│   │   │       └── funciones-intermedias/
│   │   │
│   │   ├── documentation/
│   │   │   ├── components/
│   │   │   ├── styles/
│   │   │   └── utils/
│   │   │
│   │   ├── generated/
│   │   │   └── docs.generated.ts
│   │   │
│   │   ├── history/
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   │
│   │   ├── home/
│   │   │   └── components/
│   │   │
│   │   ├── navigation/
│   │   │   ├── components/
│   │   │   └── config/
│   │   │
│   │   ├── notes/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   │
│   │   ├── search/
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   └── utils/
│   │   │
│   │   └── types/
│   │
│   └── .env.example
│
└── backend/
    ├── code_execution/
    │   ├── router.py
    │   ├── schemas.py
    │   └── service.py
    │
    ├── notes/
    │   ├── database.py
    │   ├── models.py
    │   ├── router.py
    │   └── schemas.py
    │
    ├── shared/
    │   └── config.py
    │
    ├── note_images/
    ├── main.py
    ├── requirements.txt
    └── wikidev.db
```

Generated files, virtual environments, caches, and user-uploaded images are not considered source-code modules.

---

## 4. Frontend Architecture

The frontend is built with Next.js and follows a feature-oriented modular structure. Each module groups the components, hooks, services, and utilities associated with a specific application responsibility.

### 4.1. Application Routes (`app/`)

Contains the Next.js application routes:

- `/`: Main application page.
- `/docs`: Documentation section.
- `/docs/[...slug]`: Dynamic documentation routes.
- `/notes`: Personal notes workspace.

### 4.2. Documentation (`documentation/`)

Responsible for rendering and presenting technical documentation.

Its responsibilities include:

- Rendering MDX content.
- Managing documentation presentation components.
- Providing shared documentation styles.
- Supporting navigation between documentation pages.

### 4.3. Documentation Content (`content/`)

Stores the MDX files organized by topic and chapter.

The content is divided into three main topics:

- Python.
- JavaScript.
- Algorithms.

Documentation metadata is generated automatically through `scripts/generate-docs.mjs`.

The resulting `generated/docs.generated.ts` file contains the documentation registry used by the application.

### 4.4. Navigation (`navigation/`)

Manages documentation navigation and its configuration.

It centralizes navigation components and metadata used to organize topics, chapters, and lessons.

### 4.5. Code Execution (`code-execution/`)

Contains the frontend functionality required to execute code examples.

It is organized into:

- `components/`: Interactive code execution interface.
- `hooks/`: Hooks managing execution-related state and behavior.
- `services/`: Communication with the backend execution API.

### 4.6. Notes (`notes/`)

Implements the personal notes workspace.

Its responsibilities include:

- Managing note-related components.
- Handling note state through hooks.
- Communicating with the backend through services.
- Supporting note editing and image attachments.

### 4.7. Search (`search/`)

Implements fuzzy search using Fuse.js to help users locate documentation content.

### 4.8. History (`history/`)

Manages the documentation browsing history through dedicated components and hooks.

### 4.9. Home (`home/`)

Contains the components used by the main application page and its knowledge-related sections.

### 4.10. Shared (`shared/`)

Contains reusable components and utilities consumed by different frontend modules.

### 4.11. Generated Documentation Metadata

The documentation registry is generated using:

```bash
npm run docs:generate
```

The generator scans the MDX content and produces:

```text
src/generated/docs.generated.ts
```

This file is generated automatically and should not be edited manually or committed to Git.

The generation process also runs automatically before the development server and production build through the `predev` and `prebuild` scripts.

---

## 5. Backend Architecture

The backend is implemented with FastAPI and follows a modular structure that separates API routing, business logic, data models, and configuration.

### 5.1. Application Entry Point (`main.py`)

Creates the main FastAPI application and configures:

- API metadata.
- CORS middleware.
- Rate limiting for code execution.
- Registration of application routers.
- Database initialization during startup.
- Health-check endpoint.

The backend exposes the following main route groups:

- `/api/execute`
- `/api/notes/`

It also provides `/health` to check API availability.

### 5.2. Code Execution (`code_execution/`)

Responsible for processing and executing Python and JavaScript code.

Its components are:

- `router.py`: Defines the code execution endpoint.
- `schemas.py`: Defines request and response models.
- `service.py`: Handles execution using Python's `subprocess` module.

Execution restrictions include:

| Restriction | Value |
|---|---|
| Supported languages | Python and JavaScript |
| Maximum code length | 10 KB |
| Execution timeout | 5 seconds |
| Maximum stdout | 50 KB |
| Maximum stderr | 10 KB |
| Rate limit | 20 requests per minute per IP |

The execution service creates temporary files, launches the corresponding interpreter or runtime, captures standard output and errors, and removes temporary files after execution.

**Security note:** These restrictions provide basic execution limits, but subprocess execution is not equivalent to an isolated security sandbox. The current implementation should not be exposed to untrusted users without additional isolation and security controls.

### 5.3. Notes (`notes/`)

Responsible for managing personal notes and their associated images.

Its components are:

- `router.py`: Defines the note and image API endpoints.
- `schemas.py`: Defines request and response validation models.
- `models.py`: Defines the SQLAlchemy database models.
- `database.py`: Configures the database engine, sessions, and initialization.

The notes API supports:

- Listing and searching notes.
- Creating notes.
- Updating notes.
- Deleting notes.
- Uploading images.
- Deleting images.
- Retrieving stored images.

### 5.4. Shared Configuration (`shared/`)

Contains configuration shared by backend modules.

`config.py` loads environment variables and defines settings such as the Piston service URL and allowed CORS origins.

---

## 6. Database and File Storage

WikiDev uses SQLite with SQLAlchemy as its ORM.

The database file is:

```text
backend/wikidev.db
```

The main database models are:

### Note

Stores personal notes.

| Field | Description |
|---|---|
| `id` | Unique note identifier |
| `title` | Note title |
| `content` | Note content |
| `created_at` | Creation timestamp |
| `updated_at` | Last modification timestamp |

### NoteImage

Stores metadata about images associated with notes.

| Field | Description |
|---|---|
| `id` | Unique image identifier |
| `note_id` | Associated note identifier |
| `filename` | Internal stored filename |
| `original_name` | Original uploaded filename |
| `created_at` | Upload timestamp |

Image files are stored separately in:

```text
backend/note_images/
```

The database stores their metadata and association with the corresponding note.

---

## 7. Communication Flow

### 7.1. Frontend to Backend

The frontend communicates with FastAPI through HTTP requests.

The base API URL is configured using the frontend environment variable:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Examples of API operations include:

- Code execution: `POST /api/execute`.
- Notes retrieval: `GET /api/notes/`.
- Note creation: `POST /api/notes/`.
- Note updates: `PUT /api/notes/{note_id}`.
- Note deletion: `DELETE /api/notes/{note_id}`.

### 7.2. Backend to Frontend

The backend returns JSON responses containing:

- Code execution results.
- Note data.
- Image metadata.
- Operation status and error information.

Images are returned through dedicated file-response endpoints.

### 7.3. Internal Frontend Communication

Frontend modules communicate through:

- React props.
- Custom hooks.
- Shared utilities.
- Context providers where applicable.

This modular organization reduces coupling and encourages component reuse.

---

## 8. Environment Configuration

The frontend and backend maintain separate configuration responsibilities.

### Frontend

The frontend uses:

```text
frontend/.env.local
frontend/.env.example
```

The example file documents the required variable:

```env
NEXT_PUBLIC_API_URL=
```

The local environment file contains the actual development API URL and should not be committed to the repository.

### Backend

The backend configuration is handled through environment variables loaded by `shared/config.py`.

Currently documented settings include:

- `PISTON_URL`
- `CORS_ORIGINS`

---

## 9. Development and Build Process

### Frontend

Run the following commands from the `frontend/` directory:

```bash
npm install
npm run dev
```

Generate documentation metadata manually:

```bash
npm run docs:generate
```

Run quality checks:

```bash
npm run typecheck
npm run lint
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

### Backend

Run the following commands from the `backend/` directory, after activating the Python virtual environment and installing the dependencies:

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

The API documentation is available through FastAPI's interactive documentation endpoints:

```text
/docs
/redoc
```

### Continuous Integration

The GitHub Actions workflow is located at:

```text
.github/workflows/ci.yml
```

It installs frontend dependencies, generates documentation metadata, and runs TypeScript and ESLint checks for pushes and pull requests targeting `main` and `develop`.

---

## 10. Security Considerations

The current implementation includes several basic security measures:

- Rate limiting on the code execution endpoint.
- Maximum code length and execution timeout.
- Output size limits.
- Validation of API requests through Pydantic.
- Maximum image upload size of 5 MB.
- Allowed image extension checks.
- Unique filenames for uploaded images.
- Path basename validation when retrieving images.
- CORS configuration.

These measures provide basic safeguards for a local development application. They do not replace production-grade security controls.

In particular, code execution requires stronger process isolation before being exposed to untrusted users. Rate limiting is currently stored in application memory and is not shared across multiple backend instances.

---

## 11. Architectural Principles

WikiDev follows these architectural principles:

- **Separation of concerns:** Each module has a clearly defined responsibility.
- **Modularity:** Features are organized into independent functional areas.
- **Reusability:** Shared components and utilities avoid unnecessary duplication.
- **Maintainability:** Centralized metadata and configuration reduce inconsistencies.
- **Scalability:** The modular structure facilitates future feature development.
- **Automation:** Documentation metadata generation and CI checks reduce manual work.
