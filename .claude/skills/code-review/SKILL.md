---
name: code-review
description: Comprehensive code review analyzing quality, security, performance, and best practices. Use when reviewing pull requests, code changes, or conducting quality audits.
allowed-tools: Read, Grep, Glob, Bash
---

# Code Review Skill

This skill provides structured code review capabilities, analyzing code for quality, security vulnerabilities, performance issues, and adherence to best practices.

## Review Categories

### 1. Security Analysis
- **Input Validation**: Check for SQL injection, XSS, command injection vulnerabilities
- **Authentication & Authorization**: Verify proper access controls and session management
- **Sensitive Data**: Look for hardcoded credentials, API keys, or exposed secrets
- **OWASP Top 10**: Screen for common security vulnerabilities
- **Dependencies**: Check for known vulnerable packages

### 2. Code Quality
- **Readability**: Clear naming, proper indentation, logical organization
- **Complexity**: Identify overly complex functions that need refactoring
- **DRY Principle**: Look for code duplication and opportunities for abstraction
- **Error Handling**: Verify appropriate try-catch blocks and error messages
- **Type Safety**: Check for proper type annotations and type checking

### 3. Performance
- **Algorithmic Efficiency**: Identify O(n²) or worse algorithms where better exists
- **Resource Management**: Check for memory leaks, unclosed resources, excessive allocations
- **Database Queries**: Look for N+1 queries, missing indexes, inefficient joins
- **Caching**: Identify opportunities for memoization or caching
- **Async Operations**: Verify proper use of async/await and promise handling

### 4. Best Practices
- **Design Patterns**: Verify appropriate use of established patterns
- **Framework Conventions**: Follow language/framework-specific idioms
- **Testing**: Check for adequate test coverage and quality
- **Documentation**: Verify critical functions have clear documentation
- **Backwards Compatibility**: Flag breaking changes without migration paths

### 5. Maintainability
- **Modularity**: Proper separation of concerns
- **Dependencies**: Avoid circular dependencies, minimize coupling
- **Configuration**: Externalize configuration from code
- **Logging**: Appropriate logging for debugging and monitoring
- **Comments**: Explain "why" not "what", remove dead code and commented blocks

## Review Process

When conducting a code review:

1. **Understand Context**: Read related files to understand the change's purpose
2. **Check Diff**: Focus on what changed and why
3. **Run Tests**: Verify existing tests pass and new tests are appropriate
4. **Security First**: Always prioritize security issues
5. **Be Constructive**: Provide specific, actionable feedback with examples
6. **Acknowledge Good Code**: Recognize well-written implementations

## Output Format

Structure reviews as:

### Summary
Brief overview of changes and overall assessment

### Critical Issues
- Security vulnerabilities
- Bugs or logic errors
- Breaking changes

### Suggestions
- Performance improvements
- Code quality enhancements
- Best practice recommendations

### Positive Notes
- Well-implemented features
- Good practices observed

## Common Patterns to Flag

### JavaScript/TypeScript
- `eval()` usage
- Missing input sanitization
- Unhandled promise rejections
- `any` types in TypeScript
- Mutating props/state directly

### Python
- Using `exec()` or `eval()`
- Bare `except:` clauses
- Mutable default arguments
- Missing type hints in public APIs
- SQL string concatenation

### General
- Hardcoded credentials or secrets
- Commented-out code blocks
- TODO comments without tickets
- Magic numbers without constants
- Deep nesting (>3-4 levels)

## Guidelines

- **Be thorough but focused**: Don't nitpick style if there are security issues
- **Provide examples**: Show how to fix issues when possible
- **Consider impact**: Prioritize issues by severity
- **Respect constraints**: Understand project-specific requirements
- **Stay objective**: Focus on code, not the developer
