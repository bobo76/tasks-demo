Create a new directory task-api, use it to build a Spring Boot application with H2 in-memory only database and Lombok for boilerplate reduction. Replace the old web API entirely.
Add unit tests to task-api
Add a custom checkstyle.xml with relaxed rules

Review the task-client code and fix any issues you find.
Migrate to angular 19

Update the Angular app to remove old server references and start only the web frontend.
Migrate all existing tasks from json-server to H2, then delete file all-tasks.json

Add frontend tests using Angular Testing Library with Jest.

use skill code review and fix issues

Create a Playwright project in the task-e2e directory with e2e tests for the client. Configure it to run only on Chromium, ensure all tests pass.

Stop Condition:

- Backend: mvn clean package succeeds, jar runs on port 8090, sample data loads
- Frontend: npm run build succeeds, npm start runs on port 4300, UI renders
- Integration: Can view tasks in browser, create one task, drag between columns
- Cleanup: Stop all running processes (no background servers)
