# WikiDev

Personal programming documentation with executable code examples, notes, and integrated search.

## Tech Stack

- **Frontend:** Next.js 16, React 18, TypeScript, Tailwind CSS 4, MDX
- **Backend:** FastAPI, Python, SQLite, SQLAlchemy
- **Search:** Fuse.js
- **Code execution:** Local Python and JavaScript subprocesses

## Prerequisites

- [Node.js](https://nodejs.org/) 20.9 or later
- [Python](https://www.python.org/) 3.10 or later
- npm
- Node.js available in the system PATH (required for JavaScript execution)

## Project Structure

```text
wikidev/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   └── ARCHITECTURE.md
├── frontend/
│   ├── scripts/
│   │   └── generate-docs.mjs
│   └── src/
│       ├── app/                 # Next.js routes
│       ├── code-execution/      # Code execution interface
│       ├── content/             # MDX documentation
│       ├── documentation/       # Documentation components and utilities
│       ├── generated/           # Generated documentation metadata
│       ├── history/             # Browsing history
│       ├── home/                # Homepage components
│       ├── navigation/          # Navigation components and configuration
│       ├── notes/               # Notes interface
│       ├── search/              # Search functionality
│       ├── shared/              # Shared components and utilities
│       └── types/               # TypeScript definitions
└── backend/
    ├── code_execution/          # Code execution API
    ├── notes/                   # Notes API and database
    ├── shared/                  # Shared backend configuration
    ├── note_images/              # Uploaded note images
    ├── main.py                  # FastAPI application
    └── requirements.txt
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
pip install -r requirements.txt
```

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

Do not commit `.env.local` or other files containing local environment settings.

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
| API documentation (Swagger) | http://127.0.0.1:8000/docs |
| API documentation (ReDoc) | http://127.0.0.1:8000/redoc |
| Health check | http://127.0.0.1:8000/health |

## Main Features

- **MDX documentation:** Programming tutorials with executable Python and JavaScript examples.
- **Code execution:** Run code locally through the backend API.
- **Notes:** Create, edit, search, and delete notes, with image attachments.
- **Integrated search:** Fuzzy search powered by Fuse.js, accessible with `Ctrl+K`.
- **Browsing history:** Keep track of previously visited documentation pages.
- **Documentation metadata generation:** Automatically build the documentation registry from the MDX content.

## Current Documentation

- **Python:** Introduction, numbers, expressions and operators, variables, strings, lists, decorators, and additional topics.
- **JavaScript:** Arrays and promises.
- **Algorithms:** Sorting.

## Development Commands

Run these commands from the `frontend/` directory:

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Generate documentation metadata and build the application |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript type checker |
| `npm run docs:generate` | Regenerate documentation metadata |

## Security Considerations

- Code execution uses local subprocesses and **is not sandboxed**. Do not expose this functionality to untrusted users or deploy it publicly without proper isolation.
- The API applies an in-memory rate limit of 20 code execution requests per IP address per minute. This limit is process-local and is not shared across multiple workers.
- Code execution has a maximum input size of 10,000 characters and a timeout of 5 seconds.
- Uploaded note images have a maximum file size of 5 MB.
- Local environment files must not be committed to the repository.

For more technical details, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).