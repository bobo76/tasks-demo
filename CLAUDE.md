# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Task management application with a Kanban-style board (columns: New, In Progress, Done). Uses Angular frontend with json-server as a mock REST API backend.

## Commands

All commands run from `task-client/` directory:

```bash
# Start both API and web server
npm start

# Start only web frontend (port 4300)
npm run serve:web

# Start only mock API (json-server)
npm run serve:api

# Build
npm run build

# Run unit tests (Karma)
npm test
```

## Architecture

```
task-client/
├── src/app/
│   ├── common/
│   │   ├── models/task-manager.model.ts    # Task interface
│   │   └── services/tasks.service.ts       # HTTP client for task CRUD
│   └── components/
│       ├── navbar/                         # Top navigation bar
│       ├── tasks-board/                    # Main Kanban board with drag-drop
│       └── add-new-task/                   # Task creation dialog
└── server/
    └── all-tasks.json                      # Mock data for json-server
```

- **TasksService** (`tasks.service.ts`): Central service for all task operations - fetches, creates, updates, and deletes tasks via HTTP
- **TasksBoardComponent**: Implements drag-and-drop between columns using Angular CDK
- Mock API endpoints: `/new-tasks`, `/in-progress`, `/done`

## Tech Stack

- Angular 19 with Angular Material and CDK
- json-server for mock REST API
- Karma/Jasmine for unit tests
