# WikiDev — Frontend

## Overview

The WikiDev frontend is the user interface of a personal programming documentation platform. It provides a centralized environment for exploring technical documentation, managing personal notes, and practicing programming through interactive code execution.

## Technology Stack

- **Framework:** Next.js 16
- **Library:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Documentation:** MDX
- **Typography:** Outfit and JetBrains Mono

## Project Structure

```text
frontend/
├── public/              # Static assets and branding
├── scripts/             # Build-time utility scripts
├── src/
│   ├── app/             # Application routes and layouts
│   ├── code-execution/  # Interactive code execution interface
│   ├── content/         # MDX documentation content
│   ├── documentation/   # Documentation components and utilities
│   ├── generated/       # Automatically generated documentation registry
│   ├── history/         # Navigation history functionality
│   ├── navigation/      # Navigation components and configuration
│   ├── notes/           # Personal notes functionality
│   ├── search/          # Global search functionality
│   ├── shared/          # Reusable components and utilities
│   ├── theming/         # Theme configuration and provider
│   └── types/           # Shared TypeScript declarations
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Install the project dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Main Features

- Structured technical documentation organized by categories and topics.
- MDX-based content management.
- Interactive programming exercises and code execution.
- Personal notes management.
- Global documentation search.
- Reading history and navigation.
- PDF documentation export.

## Backend Integration

The frontend communicates with the WikiDev backend, built with FastAPI, to handle features such as personal notes and code execution.

The backend API URL can be configured through the `NEXT_PUBLIC_API_URL` environment variable.

## Development Guidelines

- Use TypeScript for application code.
- Keep components and utilities organized by functional responsibility.
- Reuse shared components whenever possible.
- Keep documentation content separate from application logic.
- Use Tailwind CSS v4 for styling.
- Maintain consistent naming conventions and project structure.