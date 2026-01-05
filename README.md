# Task Management Application

A full-stack task management application with drag-and-drop kanban board functionality, built with Angular 19 and Spring Boot.

## Project Structure

```
tasks-demo/
├── task-client/          # Angular 19 frontend application
├── task-api/             # Spring Boot backend API
├── task-e2e/             # Playwright E2E tests (planned)
├── TECHNICAL_SPEC.md     # Detailed technical specification
└── PROGRESS.md           # Implementation progress tracking
```

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: H2 (in-memory)
- **Build Tool**: Maven
- **Port**: 8090

### Frontend
- **Framework**: Angular 19.2.0
- **Language**: TypeScript
- **UI Library**: Angular Material & CDK
- **Drag & Drop**: Angular CDK
- **Port**: 4300

## Features

- ✅ **Kanban Board**: Three columns (New Tasks, In Progress, Done)
- ✅ **Drag & Drop**: Move tasks between columns with automatic status updates
- ✅ **CRUD Operations**: Create, read, update, and delete tasks
- ✅ **Persistent Storage**: H2 database with auto-initialization of sample data
- ✅ **Modern Angular 19**: Standalone components, signals, new control flow syntax (@if/@for)
- ✅ **RESTful API**: Clean REST API with proper HTTP status codes
- ✅ **CORS Enabled**: Frontend-backend communication configured

## Getting Started

### Prerequisites

- **Java 17+**: Required for Spring Boot backend
- **Node.js 18+** & **npm**: Required for Angular frontend
- **Maven**: Required for building the backend

### Backend Setup

1. **Build the backend**:
   ```bash
   cd task-api
   mvn clean package
   ```

2. **Run the backend**:
   ```bash
   java -jar target/task-api-1.0.0.jar
   ```

   The API will start on **http://localhost:8090**

3. **Verify backend is running**:
   ```bash
   curl http://localhost:8090/api/tasks
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd task-client
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

   The application will open at **http://localhost:4300**

3. **Build for production**:
   ```bash
   npm run build
   ```

## API Documentation

### Base URL
```
http://localhost:8090/api
```

### Endpoints

#### Get All Tasks
```
GET /tasks
Response: 200 OK with array of tasks
```

#### Get Tasks by Status
```
GET /tasks?status={status}
Query Parameters:
  - status: 'new' | 'in-progress' | 'done'
Response: 200 OK with filtered array of tasks
```

#### Get Task by ID
```
GET /tasks/{id}
Response: 200 OK | 404 Not Found
```

#### Create Task
```
POST /tasks
Body: { title, description, status }
Response: 201 Created with created task
```

#### Update Task
```
PUT /tasks/{id}
Body: { title, description, status }
Response: 200 OK | 404 Not Found
```

#### Delete Task
```
DELETE /tasks/{id}
Response: 204 No Content | 404 Not Found
```

### Task Model
```json
{
  "id": 1,
  "title": "Task title (max 100 chars, required)",
  "description": "Task description (max 500 chars, optional)",
  "status": "new | in-progress | done (required)"
}
```

## Development

### Running Tests

**Backend Tests**:
```bash
cd task-api
mvn test
```

**Frontend Tests** (Karma/Jasmine):
```bash
cd task-client
npm test
```

### H2 Database Console

When the backend is running, access the H2 console at:
```
http://localhost:8090/h2-console

JDBC URL: jdbc:h2:mem:taskdb
Username: sa
Password: (leave blank)
```

## Project Timeline

See [PROGRESS.md](PROGRESS.md) for detailed implementation timeline and task tracking.

## Technical Specifications

See [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md) for comprehensive technical requirements and implementation details.

## Migration Notes

This application was migrated from:
- **From**: Angular 17 with json-server mock API
- **To**: Angular 19 with Spring Boot + H2 database

### Key Changes:
- ✅ Upgraded Angular 17 → 19 with modern features (signals, new control flow)
- ✅ Replaced json-server with Spring Boot REST API
- ✅ Migrated mock JSON data to H2 database
- ✅ Implemented comprehensive backend tests
- ✅ Updated all frontend components to use new API endpoints
- ✅ Removed legacy dependencies (json-server, concurrently)

## Future Enhancements

- [ ] Setup Jest + Angular Testing Library for frontend tests
- [ ] Add Playwright E2E tests in task-e2e/
- [ ] Implement authentication and authorization
- [ ] Add task assignment and collaboration features
- [ ] Implement real-time updates with WebSockets
- [ ] Add task filtering and search functionality

## License

This is a demo project for showcasing Claude Code features.
