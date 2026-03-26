# Changelog

All relevant project changes, organized by version/release.
---

## [0.1.0] - 2026-03-26

### Added (New Features)

- Added `docs/` folder with core documentation files:
    - `README.md` — Overview of the `docs/` folder and summaries of each documentation file.
    - `ARCHITECTURE.md` — Detailed project architecture, stack, folder structure, component responsibilities, and security considerations.
    - `DESCRIPTION_AND_SCOPE.md` — Project description, scope, objectives, users, limitations, and assumptions.
    - `EXECUTION.md` — Instructions for running backend and frontend, executing code, environment variables, and security precautions.
    - `GIT-WORKFLOW.md` — Git branching strategy, commit conventions, pull request workflow, CI requirements, and best practices.
    - `CHANGELOG.md` — Historical record of changes, releases, and version tracking.
    - `TESTS.md` — Guidelines for frontend and backend testing, conventions, and best practices.
- Integrated initial content for all documentation files reflecting current project status.
- Ensured consistency between documentation, project architecture, and workflow.
- Added references to prerequisites, stack, and setup instructions in documentation files.

### Changed (Changes)

- Updated project README.md to reference `docs/` folder and highlight available documentation.
- Adjusted frontend and backend folder structure references in documentation to reflect actual paths.

### Fixed (Bug Fixes)

- None.

### Deprecated (Deprecated)

- None.

### Removed (Removed)

- None.

### Security (Security)

- Documentation clarifies that code execution is local only and not safe for production exposure.
- Notes added for execution limits: timeout 5 seconds, 20 executions per minute, max image size 5 MB.

### Compatibility / Breaking Changes (Compatibility)

- Documentation is backward-compatible; no code changes introduced.
- Developers should refer to `docs/` for setup, architecture, and workflow instructions.