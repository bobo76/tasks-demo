# Technical Specification: Task Management Application Migration

## Project Overview

This specification outlines the complete migration and modernization of a task management application from a json-server-based prototype to a production-ready full-stack application with Spring Boot backend and Angular 19 frontend.

## Objectives

1. Upgrade Angular frontend from version 17 to version 19 with adoption of modern features
2. Replace json-server with Spring Boot REST API using H2 in-memory database
3. Migrate existing task data from all-tasks.json to H2 database
4. Implement comprehensive testing strategy (unit, integration, e2e)
5. Remove all json-server dependencies and clean up legacy code

## Success Criteria

### Backend
- `mvn clean package` succeeds without errors
- JAR file runs successfully on port 8090
- Sample task data loads automatically on startup
- All API endpoints respond correctly

### Frontend
- `npm run build` succeeds without errors or warnings
- `npm start` runs development server on port 4300
- UI renders correctly with all components functional
- Application connects to Spring Boot API on port 8090

### Integration
- Tasks display correctly in browser from backend API
- User can create a new task through the UI
- User can drag tasks between columns (New Tasks → In Progress → Done)
- Changes persist after page refresh

### Cleanup
- All running processes stopped (no background servers left running)
- json-server and related files removed
- all-tasks.json deleted after successful migration

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: H2 (in-memory mode)
- **Libraries**: Lombok for boilerplate reduction
- **Build Tool**: Maven
- **Port**: 8090

### Frontend
- **Framework**: Angular 19
- **Language**: TypeScript
- **Testing**: Angular Testing Library + Jest (replaces Karma/Jasmine)
- **Drag & Drop**: Angular CDK
- **Port**: 4300

### E2E Testing
- **Framework**: Playwright
- **Browser**: Chromium only
- **Location**: task-e2e/ directory

## Database Schema

### Task Table
```
Table: task
Columns:
- id: BIGINT (auto-increment, primary key)
- title: VARCHAR(100) (not null)
- description: TEXT
- status: VARCHAR(20) (not null, check constraint for valid values)

Valid status values: 'new', 'in-progress', 'done'
```

### Constraints
- Title is required (not null)
- Status must be one of the three valid values
- ID is auto-generated

## Backend API Specification

### Base URL
`http://localhost:8090/api`

### Endpoints

#### Get All Tasks
- **Method**: GET
- **Path**: `/tasks`
- **Query Parameters** (optional):
  - `status`: Filter by status (new, in-progress, done)
- **Response**: 200 OK
  - Body: Array of Task objects
  - Task object: `{ id, title, description, status }`

#### Get Task by ID
- **Method**: GET
- **Path**: `/tasks/{id}`
- **Response**: 200 OK | 404 Not Found
  - Body: Single Task object

#### Create Task
- **Method**: POST
- **Path**: `/tasks`
- **Request Body**: `{ title, description, status }`
  - title: required, max 100 characters
  - description: optional, max 500 characters
  - status: required, must be valid status value
- **Response**: 201 Created
  - Body: Created Task object with generated ID
- **Error Response**: 400 Bad Request (validation failures)

#### Update Task
- **Method**: PUT
- **Path**: `/tasks/{id}`
- **Request Body**: `{ title, description, status }`
  - Same validation as Create
- **Response**: 200 OK | 404 Not Found
  - Body: Updated Task object
- **Error Response**: 400 Bad Request (validation failures)

#### Delete Task
- **Method**: DELETE
- **Path**: `/tasks/{id}`
- **Response**: 204 No Content | 404 Not Found

### Error Handling

#### Global Exception Handler
- Implement Spring @ControllerAdvice for consistent error responses
- Return structured error response: `{ timestamp, status, error, message, path }`

#### HTTP Status Codes
- 200: Successful GET/PUT
- 201: Successful POST (resource created)
- 204: Successful DELETE (no content)
- 400: Bad Request (validation errors)
- 404: Resource Not Found
- 500: Internal Server Error

#### Validation Rules
1. **Title**: Required, non-empty, max 100 characters
2. **Description**: Optional, max 500 characters
3. **Status**: Required, must be one of: 'new', 'in-progress', 'done'

### CORS Configuration
- Allow all origins (`*`) for development
- Allow methods: GET, POST, PUT, DELETE, OPTIONS
- Allow headers: Content-Type, Authorization

## Frontend Migration Details

### Angular 19 Features to Adopt

#### 1. New Control Flow Syntax
Migrate from:
```
*ngIf / *ngFor / *ngSwitch
```
To:
```
@if / @for / @switch
```

#### 2. Standalone Components
- All components should be standalone (no NgModule dependencies)
- Use `imports` array directly in @Component decorator
- Remove or minimize app.module.ts usage

#### 3. Signals
- Introduce Angular signals for reactive state management
- Use signals for task arrays: `newTasks = signal<Task[]>([])`, etc.
- Replace manual change detection with signal-based reactivity

#### 4. inject() Function
- Replace constructor-based dependency injection with `inject()` function
- Example: `private tasksService = inject(TasksService)`

### Component Updates

#### TasksService
- Update base URL from `http://localhost:3000` to `http://localhost:8090/api`
- Change endpoints from `/new-tasks`, `/in-progress`, `/done` to `/tasks` with status filtering
- Update method signatures to use single endpoint with query parameters
- Implement global error handling with user-friendly messages (toast/snackbar)

#### tasks-board Component
- Migrate to signals for task state management
- Update drag-drop logic to call unified `/tasks` API with status updates
- Implement Angular 19 control flow syntax (@if/@for)

#### add-new-task Component
- Update form submission to call new `/tasks` endpoint
- Add client-side validation for title (required, max 100) and description (max 500)
- Show validation errors in the UI

### Configuration Changes

#### package.json Scripts
Remove:
```
"serve:api": "json-server --watch server/all-tasks.json --port 3000"
"serve:all": "concurrently \"npm run serve:api\" \"npm run serve:web\""
```

Update:
```
"start": "ng serve --port 4300"
```

Remove dependencies:
- json-server
- concurrently

#### Angular Configuration
- Update proxy configuration if needed, or rely on CORS from backend
- Ensure environment files point to correct API URL

### Error Handling
- Implement Angular global ErrorHandler for uncaught errors
- Add HttpInterceptor for HTTP error responses
- Display user-friendly error messages via toast notifications or snackbars
- Log errors to console in development mode

## Testing Requirements

### Backend Testing (Spring Boot)

#### Controller Tests
- Test all REST endpoints with @WebMvcTest or @SpringBootTest
- Verify request/response mapping
- Test validation error responses (400 status)
- Test 404 responses for non-existent resources

#### Integration Tests
- Use @SpringBootTest with real H2 database
- Test complete request-response cycle including database operations
- Verify data persistence and retrieval
- Test transaction behavior

#### Test Scenarios
1. Create task with valid data → returns 201 with task object
2. Create task with missing title → returns 400 with validation error
3. Create task with invalid status → returns 400 with validation error
4. Get all tasks → returns 200 with array
5. Get all tasks filtered by status → returns filtered results
6. Get task by valid ID → returns 200 with task
7. Get task by non-existent ID → returns 404
8. Update task with valid data → returns 200 with updated task
9. Update non-existent task → returns 404
10. Delete task → returns 204, subsequent GET returns 404
11. Title exceeding 100 characters → returns 400
12. Description exceeding 500 characters → returns 400

### Frontend Testing (Angular + Jest + Testing Library)

#### Component Tests
Test each component in isolation with mocked dependencies:

**navbar Component**:
- Renders correctly with title
- Navigation elements are visible

**add-new-task Component**:
- Form renders with title and description inputs
- Submit button is disabled when title is empty
- Shows validation errors for invalid input
- Calls TasksService.createTask() on valid submission
- Clears form after successful submission

**tasks-board Component**:
- Renders three columns (New Tasks, In Progress, Done)
- Displays tasks in correct columns based on status
- Empty state messages when no tasks in a column

#### Service Tests
Test TasksService with mocked HttpClient:

1. getTasks() calls GET /api/tasks
2. getTasksByStatus(status) calls GET /api/tasks?status={status}
3. createTask(task) calls POST /api/tasks with task data
4. updateTask(id, task) calls PUT /api/tasks/{id}
5. deleteTask(id) calls DELETE /api/tasks/{id}
6. HTTP errors are properly caught and handled

### E2E Testing (Playwright)

#### Setup
- Project location: task-e2e/
- Configuration: Chromium browser only
- Base URL: http://localhost:4300
- API must be running on http://localhost:8090

#### Test Scenarios

**CRUD Operations**:
1. Create new task
   - Navigate to application
   - Click add task button
   - Fill in title and description
   - Submit form
   - Verify task appears in "New Tasks" column

2. Update task (drag and drop)
   - Create a task in "New Tasks"
   - Drag task to "In Progress" column
   - Verify task appears in correct column
   - Drag task to "Done" column
   - Verify task appears in "Done" column

3. Delete task
   - Create a task
   - Click delete button
   - Verify task is removed from UI

**Data Persistence**:
1. Create multiple tasks
2. Refresh the page
3. Verify all tasks still display in correct columns

**Drag and Drop**:
1. Verify drag handle is visible on tasks
2. Test dragging within same column (reorder)
3. Test dragging between columns (status change)
4. Verify visual feedback during drag operation
5. Verify backend receives status update after drop

## Data Migration

### Approach
Use Spring Boot data initialization via CommandLineRunner or data.sql

### Sample Data
Migrate existing tasks from all-tasks.json to H2 on application startup:
- Read existing task data structure (new-tasks, in-progress, done arrays)
- Transform into unified Task entities with appropriate status values
- Insert into H2 database on first run
- Provide at least 3-5 sample tasks for demonstration purposes

### Implementation Options

**Option 1: data.sql**
- Create src/main/resources/data.sql with INSERT statements
- Spring Boot automatically executes on startup

**Option 2: CommandLineRunner**
- Create a component that implements CommandLineRunner
- Parse task data and use repository to save entities
- More flexible for complex data transformation

## Implementation Phases

### Phase 1: Backend Setup (task-api/)
1. Initialize Spring Boot project with Maven
2. Add dependencies (Spring Web, Spring Data JPA, H2, Lombok, Spring Boot Test)
3. Create Task entity with Lombok annotations
4. Create TaskRepository interface extending JpaRepository
5. Create TaskService with business logic
6. Create TaskController with REST endpoints
7. Implement validation and error handling with @ControllerAdvice
8. Configure H2 console (optional for debugging)
9. Configure CORS for frontend access
10. Create data initialization (CommandLineRunner or data.sql)

### Phase 2: Backend Testing
1. Write controller tests for all endpoints
2. Write integration tests with H2
3. Run `mvn clean package` to verify build
4. Test API manually with curl or Postman
5. Verify sample data loads correctly

### Phase 3: Frontend Migration (task-client/)
1. Update Angular to version 19 using `ng update`
2. Migrate all components to standalone
3. Replace *ngIf/*ngFor with @if/@for control flow
4. Introduce signals for state management
5. Replace constructor injection with inject() function
6. Update TasksService to call new Spring Boot API
7. Update environment configuration files
8. Implement error handling and user notifications

### Phase 4: Frontend Testing Setup
1. Install Angular Testing Library and Jest
2. Configure Jest to replace Karma
3. Write component tests for all components
4. Write service tests for TasksService
5. Run tests with `npm test`

### Phase 5: E2E Testing Setup
1. Create task-e2e/ directory
2. Initialize Playwright project
3. Configure for Chromium only
4. Write e2e test scenarios (CRUD, drag-drop, persistence)
5. Run tests with Playwright

### Phase 6: Integration & Cleanup
1. Start Spring Boot backend (port 8090)
2. Start Angular frontend (port 4300)
3. Verify complete integration (view, create, drag tasks)
4. Remove json-server from package.json
5. Delete server/all-tasks.json
6. Update npm scripts (remove serve:api, update start)
7. Stop all running processes
8. Final verification of all success criteria

## Cleanup & Configuration Changes

### Files to Delete
- `/task-client/server/all-tasks.json`

### Dependencies to Remove
From task-client/package.json:
- `json-server`
- `concurrently` (if only used for json-server)

### Scripts to Update
In task-client/package.json:
```
Remove:
  "serve:api": "json-server --watch server/all-tasks.json --port 3000"
  "serve:all": "concurrently \"npm run serve:api\" \"npm run serve:web\""

Update:
  "start": "ng serve --port 4300"
```

### New Directory Structure
```
task-api/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/taskdemo/
│   │   │       ├── TaskApiApplication.java
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       ├── model/
│   │   │       └── exception/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql (optional)
│   └── test/
│       └── java/
└── pom.xml

task-e2e/
├── tests/
├── playwright.config.ts
└── package.json
```

## Definition of Done Checklist

### Backend (task-api/)
- [ ] Spring Boot project created with correct dependencies
- [ ] Task entity created with Lombok annotations
- [ ] All REST endpoints implemented and functional
- [ ] Validation implemented with proper error responses
- [ ] CORS configured for frontend access
- [ ] Sample data loads on startup
- [ ] Controller tests written and passing
- [ ] Integration tests written and passing
- [ ] `mvn clean package` succeeds
- [ ] JAR runs on port 8090 without errors

### Frontend (task-client/)
- [ ] Angular upgraded to version 19
- [ ] All components migrated to standalone
- [ ] Control flow syntax updated (@if/@for)
- [ ] Signals implemented for state management
- [ ] inject() function used for dependency injection
- [ ] TasksService updated to call Spring Boot API
- [ ] Component tests written with Testing Library
- [ ] Service tests written with mocked HTTP
- [ ] Jest configured and Karma removed
- [ ] All tests passing
- [ ] `npm run build` succeeds
- [ ] `npm start` runs on port 4300

### E2E Tests (task-e2e/)
- [ ] Playwright project initialized
- [ ] Configured for Chromium only
- [ ] CRUD test scenarios implemented
- [ ] Drag and drop tests implemented
- [ ] Data persistence tests implemented
- [ ] All e2e tests passing

### Integration
- [ ] Frontend connects to backend successfully
- [ ] Tasks display from backend API
- [ ] New task can be created via UI
- [ ] Tasks can be dragged between columns
- [ ] Status changes persist after drag-drop
- [ ] Page refresh maintains task state

### Cleanup
- [ ] json-server removed from package.json
- [ ] concurrently removed (if applicable)
- [ ] server/all-tasks.json deleted
- [ ] npm scripts updated (start command simplified)
- [ ] All running processes stopped
- [ ] No background servers left running

### Documentation
- [ ] README updated with new setup instructions
- [ ] API endpoints documented
- [ ] Development commands verified
- [ ] Port configuration documented

## Notes

- Development approach: Parallel development of backend and frontend
- Both frontend and backend can be developed simultaneously and integrated at the end
- All validation must be consistent between frontend and backend
- Error messages should be user-friendly and actionable
- Follow framework conventions for project structure
- Maintain code quality and readability throughout migration
