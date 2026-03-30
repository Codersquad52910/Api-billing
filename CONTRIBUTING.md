# Contributing to API Billing Platform

Thank you for your interest in contributing to the API Billing Platform. This document outlines the development workflow, coding standards, and contribution guidelines.

## Development Workflow

### Branch Naming Convention

```
feature/   – New features (e.g., feature/rate-limiting)
fix/       – Bug fixes (e.g., fix/otp-expiry-validation)
docs/      – Documentation updates (e.g., docs/api-endpoints)
refactor/  – Code refactoring (e.g., refactor/auth-middleware)
```

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Examples:**
```
feat(auth): add password strength validation
fix(billing): correct rate calculation precision
docs(models): add JSDoc to User schema
refactor(middleware): extract role validation logic
```

## Code Standards

### JavaScript / Node.js

- Use **ES Modules** (`import`/`export`) throughout
- Add **JSDoc** comments to all exported functions and modules
- Use `const` by default; use `let` only when reassignment is needed
- Prefer **arrow functions** for callbacks and middleware
- Handle all async operations with `try/catch` blocks

### File Organization

```
backend/
├── config/       # Environment and database configuration
├── middleware/    # Express middleware (auth, tracking)
├── models/       # Mongoose schema definitions
├── routes/       # Route handlers grouped by domain
├── services/     # Background and utility services
└── utils/        # Shared constants, helpers, validators
```

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Files | camelCase | `authMiddleware.js` |
| Models | PascalCase | `APIKey.js` |
| Functions | camelCase | `generateAndSendReports` |
| Constants | UPPER_SNAKE_CASE | `HTTP_STATUS` |
| Routes | kebab-case | `/api/super-admin` |

## API Development Guidelines

### Adding a New Route

1. Create or modify the route file in `backend/routes/`
2. Add appropriate middleware (`protect()`, `adminOnly`, etc.)
3. Wrap handlers in `try/catch` for error handling
4. Register the route in `server.js`
5. Update the `README.md` API endpoints table

### Adding a New Model

1. Create the schema file in `backend/models/`
2. Include JSDoc `@typedef` for the document shape
3. Add appropriate field validations and defaults
4. Export using `mongoose.model()`

## Environment Setup

Refer to the main [README.md](./README.md#getting-started) for setup instructions.
