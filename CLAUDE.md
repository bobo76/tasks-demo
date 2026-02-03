# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Task management application with a Kanban-style board (columns: New, In Progress, Done). Uses Angular frontend with Spring Boot REST API backend.

## Commands

### Backend (task-api)

```bash
cd task-api

# Run the Spring Boot API (port 8090)
./mvnw spring-boot:run

# Run tests
./mvnw test

# Build
./mvnw clean package
```

### Frontend (task-client)

```bash
cd task-client

# Start the Angular frontend (port 4300)
npm start

# Build
npm run build

# Run unit tests (Jest)
npm test
```

### E2E Tests (task-e2e)

```bash
cd task-e2e

# Run E2E tests (requires both backend and frontend running)
npm test

# Run with browser visible
npm run test:headed
```

## Architecture

```
task-api/                            # Spring Boot backend
├── src/main/java/com/taskapi/
│   ├── model/
│   │   ├── Task.java               # JPA Entity
│   │   └── TaskStatus.java         # Enum: NEW, IN_PROGRESS, DONE
│   ├── repository/
│   │   └── TaskRepository.java     # JpaRepository
│   ├── controller/
│   │   └── TaskController.java     # REST endpoints
│   └── config/
│       └── CorsConfig.java         # CORS for localhost:4300
├── src/main/resources/
│   ├── application.properties      # H2, port 8090
│   └── data.sql                    # Seed data

task-client/                         # Angular frontend
├── src/app/
│   ├── common/
│   │   ├── models/task-manager.model.ts    # Task interfaces
│   │   └── services/tasks.service.ts       # HTTP client for API
│   └── components/
│       ├── navbar/                         # Navigation bar
│       ├── tasks-board/                    # Kanban board with drag-drop
│       └── add-new-task/                   # Task creation form

task-e2e/                            # Playwright E2E tests
├── tests/
│   └── tasks.spec.ts               # E2E test scenarios
└── playwright.config.ts
```

## API Endpoints

Base URL: `http://localhost:8090/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks | Get all tasks (optional ?status= filter) |
| GET | /tasks/{id} | Get task by ID |
| POST | /tasks | Create task (defaults to NEW status) |
| PUT | /tasks/{id} | Update task (status changes for drag-drop) |
| DELETE | /tasks/{id} | Delete task |

## Tech Stack

- **Backend**: Java 17, Spring Boot 3.x, Spring Data JPA, H2 Database, Lombok
- **Frontend**: Angular 19 with Angular Material and CDK
- **Testing**: JUnit (backend), Jest + Testing Library (frontend), Playwright (E2E)
