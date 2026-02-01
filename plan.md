Create a new directory task-api, use it to build a Spring Boot application with java 17, H2 in-memory only database and Lombok for boilerplate reduction. port will be 8090. Replace the old web API entirely.
Add unit tests to task-api

Review the task-client code and fix any issues you find.

Update the Angular app to remove old server references and start only the web frontend.
Migrate all existing tasks from json-server to H2, then delete file all-tasks.json

Add frontend tests using Angular Testing Library with Jest.

Create a Playwright project in the task-e2e directory with e2e tests for the client. Configure it to run only on Chromium, ensure all tests pass.
