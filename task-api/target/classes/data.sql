-- Sample task data migrated from all-tasks.json

-- New Tasks
INSERT INTO task (title, description, status) VALUES
('Update API documentation', 'Review and update API documentation to reflect recent changes in endpoints and data models', 'new'),
('Implement dark mode', 'Add dark mode theme support across the application with user preference persistence', 'new'),
('Optimize database queries', 'Analyze and optimize slow database queries to improve overall application performance', 'new'),
('Set up CI/CD pipeline', 'Configure automated testing and deployment pipeline using GitHub Actions', 'new');

-- In Progress Tasks
INSERT INTO task (title, description, status) VALUES
('Add unit tests for auth', 'Write comprehensive unit tests for authentication service and related components', 'in-progress'),
('Build UI for onboarding flow', 'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps', 'in-progress');

-- Done Tasks
INSERT INTO task (title, description, status) VALUES
('new task', 'add description', 'done');
