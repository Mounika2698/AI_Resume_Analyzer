# Contributing

Thank you for your interest in contributing to AI Resume Analyzer!

## Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run test && npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Code Quality Standards

- TypeScript strict mode is enabled
- ESLint and Prettier are enforced
- No `any` types without justification
- All new features should include tests
- All PRs must pass CI/CD checks

## Monorepo Commands

```bash
# Install dependencies for both client and server
npm install

# Run dev servers for both
npm run dev

# Run linting for both
npm run lint

# Format code in both
npm run format

# Run tests in both
npm run test

# Database migrations (server only)
npm run db:migrate

# Seed database (server only)
npm run db:seed
```

## Testing

- Write tests for new features
- Target meaningful coverage (not 100% for the sake of it)
- Use Vitest for unit tests
- Use React Testing Library for component tests

## Questions?

Open an issue for discussions!
