# WikiDev

Personal programming documentation with executable code examples, multi-user private notes, authentication, and integrated search.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, MDX
- **Backend:** FastAPI, Python, SQLite / SQLAlchemy, Pydantic, Argon2id (`argon2-cffi`), Pillow
- **Search:** Fuse.js
- **Code execution:** Configurable (`disabled` by default in production, isolated `docker` containers, or hardened `local_unsafe` subprocesses for local development)
- **Security & Testing:** `pytest`, `Bandit`, `pip-audit`, `npm audit`, GitHub Actions CI

## Prerequisites

- [Node.js](https://nodejs.org/) 20.9 or later
- [Python](https://www.python.org/) 3.10 or later
- npm
- Node.js available in the system `PATH` (required for local JavaScript execution)
- *(Optional)* [Docker](https://www.docker.com/) — recommended when enabling `CODE_EXECUTION_MODE=docker` for isolated code execution in network/production deployments

## Project Structure

```text
wikidev/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Frontend & backend checks + security audits
├── .env.example                   # Root environment template
├── docs/
│   ├── ARCHITECTURE.md
│   └── EXECUTION.md
├── frontend/
│   ├── scripts/
│   │   └── generate-docs.mjs
│   └── src/
│       ├── app/                   # Next.js routes
│       ├── auth/                  # Authentication UI, context, and API client
│       ├── code-execution/        # Code execution interface
│       ├── content/               # MDX documentation
│       ├── documentation/         # Documentation components and utilities
│       ├── generated/             # Generated documentation metadata
│       ├── history/               # Browsing history
│       ├── home/                  # Homepage components
│       ├── navigation/            # Navigation components and configuration
│       ├── notes/                 # Notes interface
│       ├── search/                # Search functionality
│       ├── shared/                # Shared components and utilities
│       └── types/                 # TypeScript definitions
└── backend/
    ├── auth/                      # Users, Argon2id hashing, sessions, and CSRF
    ├── code_execution/            # Code execution API and isolation modes
    ├── notes/                     # Notes & image API and database models
    ├── shared/                    # Centralized config, rate limiting, and logging
    ├── tests/                     # Automated security & functional tests (pytest)
    ├── note_images/               # Uploaded note images (ignored by Git)
    ├── main.py                    # FastAPI application
    ├── pytest.ini
    ├── requirements.txt           # Production dependencies
    └── requirements-dev.txt       # Development, testing, and security tools
```

The `frontend/src/generated/docs.generated.ts` file is generated automatically from the MDX content and is not committed to the repository.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Vitolofs7/wikidev.git
cd wikidev
```

### 2. Set up the backend

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

**Windows (Git Bash):**

```bash
source .venv/Scripts/activate
```

**Windows (PowerShell):**

```powershell
.venv\Scripts\Activate.ps1
```

**macOS / Linux:**

```bash
source .venv/bin/activate
```

Install the dependencies:

```bash
# Runtime dependencies
pip install -r requirements.txt

# Or include testing and security tools (pytest, bandit, pip-audit)
pip install -r requirements-dev.txt
```

Create your local environment file from `.env.example` (at the repository root or inside `backend/.env`):

```bash
cp ../.env.example .env
```

Key backend environment variables:

| Variable | Default (dev) | Description |
|---|---|---|
| `ENVIRONMENT` | `development` | `development`, `test`, or `production` |
| `DATABASE_URL` | `sqlite:///.../backend/wikidev.db` | SQLAlchemy database URL (PostgreSQL recommended in production) |
| `CORS_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated allowed origins (`*` is rejected with credentials) |
| `TRUSTED_HOSTS` | `localhost,127.0.0.1,testserver` | Comma-separated allowed `Host` headers |
| `TRUSTED_PROXY_IPS` | *(empty)* | Reverse proxy IPs trusted for `X-Forwarded-For` |
| `COOKIE_SECURE` | `false` (`true` in prod) | Require HTTPS for session and CSRF cookies |
| `COOKIE_SAMESITE` | `lax` | `lax`, `strict`, or `none` (requires `COOKIE_SECURE=true`) |
| `SESSION_TTL_HOURS` | `24` | Session lifetime in hours |
| `CODE_EXECUTION_MODE` | `local_unsafe` (`disabled` in prod) | `disabled`, `docker`, or `local_unsafe` |
| `MAX_CONCURRENT_EXECUTIONS` | `4` | Maximum concurrent code executions |

### 3. Set up the frontend

Open a separate terminal from the repository root:

```bash
cd frontend
npm ci
```

Create the local environment file using the example:

```bash
cp .env.example .env.local
```

Set the backend URL in `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Do not commit `.env`, `.env.local`, or other files containing local environment settings.

## Running the Application

Start both services in separate terminals.

### Backend

From the `backend/` directory, with the virtual environment activated:

```bash
python -m uvicorn main:app --reload
```

### Frontend

From the `frontend/` directory:

```bash
npm run dev
```

The frontend automatically generates the documentation metadata before starting the development server.

## URLs

| Service | URL |
|---|---|
| Application | http://localhost:3000 |
| Backend API | http://127.0.0.1:8000 |
| API documentation (Swagger, dev only) | http://127.0.0.1:8000/docs |
| API documentation (ReDoc, dev only) | http://127.0.0.1:8000/redoc |
| Health check | http://127.0.0.1:8000/health |

> Interactive API docs (`/docs`, `/redoc`, `/openapi.json`) are automatically disabled when `ENVIRONMENT=production`.

## Main Features

- **MDX documentation:** Programming tutorials with executable Python and JavaScript examples (publicly readable).
- **Authentication & multi-user isolation:** User registration, login, and logout with Argon2id password hashing, `HttpOnly` session cookies, server-bound CSRF protection, and per-user resource isolation.
- **Code execution:** Authenticated Python and JavaScript execution with configurable isolation (`disabled`, `docker`, or `local_unsafe`).
- **Private notes:** Create, edit, search, and delete personal notes with validated image attachments.
- **Integrated search:** Fuzzy search powered by Fuse.js, accessible with `Ctrl+K`.
- **Browsing history:** Keep track of previously visited documentation pages.
- **Documentation metadata generation:** Automatically build the documentation registry from the MDX content.

## Current Documentation

- **Python:** Introduction, numbers, expressions and operators, variables, strings, lists, decorators, and additional topics.
- **JavaScript:** Arrays and promises.
- **Algorithms:** Sorting.

## Development & Security Commands

### Frontend (`frontend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Generate documentation metadata and build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript type checker |
| `npm run docs:generate` | Regenerate documentation metadata |
| `npm audit` | Audit frontend dependencies for known vulnerabilities |

### Backend (`backend/`)

| Command | Description |
|---|---|
| `python -m uvicorn main:app --reload` | Start the backend development server |
| `pytest -v` | Run automated security and functional tests |
| `bandit -r . -x ./tests,./.venv -ll` | Run static security analysis (Medium/High) |
| `pip-audit -r requirements.txt` | Audit backend dependencies for known vulnerabilities |

## Security Considerations

- **Authentication & authorization:** `/api/notes/*` (including image downloads) and `/api/execute` require an authenticated session and enforce per-user ownership. State-changing requests require a valid `X-CSRF-Token` header and allowed `Origin`.
- **Code execution isolation:** `CODE_EXECUTION_MODE` defaults to `disabled` in `ENVIRONMENT=production`. Never use `local_unsafe` in a network or multi-user deployment; use `docker` (ephemeral unprivileged containers with `--network=none`, `--read-only`, and CPU/RAM/PID limits) or keep it disabled.
- **Rate limiting & limits:** Sliding-window rate limits protect auth, code execution (20 req/min), note writes, and image uploads. Code and `stdin` are capped at 10 KB with a 5-second timeout.
- **Image uploads:** Streamed in chunks with a 5 MB limit (HTTP 413), verified as real images with Pillow (`JPEG`, `PNG`, `GIF`, `WEBP`), served with `X-Content-Type-Options: nosniff` and `Content-Security-Policy: default-src 'none'; sandbox`, and deleted from disk when their note is removed.
- **HTTP security headers:** Next.js and FastAPI apply `CSP`, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, and `HSTS` in production.
- **Production checklist:** Deploy behind HTTPS/TLS with `ENVIRONMENT=production`, `COOKIE_SECURE=true`, explicit `CORS_ORIGINS` and `TRUSTED_HOSTS`, PostgreSQL + Alembic migrations, and Redis if scaling rate limiting across multiple workers.

For more technical details, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/EXECUTION.md](docs/EXECUTION.md).
