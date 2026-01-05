# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a task management application demo with separate frontend and backend:

- `task-client/` - Angular 17 frontend application
- `task-api/` - Spring Boot backend (planned/future)
- `task-e2e/` - Playwright end-to-end tests (planned/future)

## Development Commands

### Frontend (Angular)

All commands should be run from the `task-client/` directory:

```bash
# Install dependencies
npm install

# Start frontend only (port 4300)
npm run serve:web

# Start both API (json-server) and frontend
npm start  # or npm run serve:all

# Build the application
npm run build

# Run unit tests (Karma + Jasmine)
npm test

# Run Angular CLI commands
npx ng <command>
```

Note: The default `npm start` runs both json-server (port 3000) and Angular dev server (port 4300) concurrently.

### Backend (Future Spring Boot)

When `task-api/` directory exists:

```bash
# Build and run tests
mvn clean package

# Run tests only
mvn test

# Run the application (should run on port 8090)
java -jar target/*.jar
```

## Architecture

### Frontend Structure

The Angular application follows a component-based architecture:

- **Components** (`src/app/components/`)
  - `navbar/` - Top navigation component
  - `tasks-board/` - Main kanban board with three columns (New Tasks, In Progress, Done)
  - `add-new-task/` - Form component for creating new tasks

- **Services** (`src/app/common/services/`)
  - `tasks.service.ts` - Handles all HTTP communication with the backend
    - Currently configured for json-server at `http://localhost:3000`
    - Manages three task categories: `new-tasks`, `in-progress`, `done`
    - CRUD operations: create, read, update, delete tasks

- **Models** (`src/app/common/models/`)
  - `task-manager.model.ts` - TypeScript interfaces for tasks:
    - `IReadTask` - For displaying tasks
    - `ICreateTask` - For creating/updating tasks

### Drag and Drop

Uses Angular CDK's DragDropModule for kanban-style task management:
- Tasks can be dragged within a column or between columns
- Implemented in `tasks-board.component.ts` using `CdkDragDrop` events
- Arrays: `newTasks[]`, `inProgressTasks[]`, `doneTasks[]`

### Data Flow

Current state uses json-server with `task-client/server/all-tasks.json`:
- Three collections: `new-tasks`, `in-progress`, `done`
- Each task has: `id`, `title`, `description`, `status`

Future state will migrate to:
- Spring Boot REST API with H2 database (port 8090)
- Frontend updated to call new API endpoints

## Testing Strategy

- **Unit Tests**: Karma + Jasmine (current), Angular Testing Library + Jest (planned)
- **E2E Tests**: Playwright in `task-e2e/` (planned, Chromium only)
- Test files follow `*.spec.ts` naming convention

## Migration Plan

Per `plan.md`, the project is being migrated:
1. Angular upgrade to v19
2. Replace json-server with Spring Boot + H2
3. Data migration from `all-tasks.json` to H2
4. Add comprehensive testing (unit + e2e)
5. Update frontend to remove json-server dependencies

## Port Configuration

- Frontend: 4300 (Angular dev server)
- API (current): 3000 (json-server)
- API (future): 8090 (Spring Boot)
