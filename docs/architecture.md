# Architecture

## Overview

AI Resume Analyzer is a modern web application built on a monorepo structure with:

- **Frontend**: React SPA with Vite bundler
- **Backend**: Express.js REST API
- **Database**: SQLite with Prisma ORM
- **AI**: Local Ollama for inference (implemented in Phase 6)

## Technology Decisions

### Why React + TypeScript?

- Industry standard for web UIs
- Strong type safety prevents runtime errors
- Large ecosystem and community
- Great developer experience

### Why Express.js?

- Lightweight and flexible
- Perfect for REST APIs
- Large ecosystem of middleware
- Easy to learn and deploy

### Why SQLite + Prisma?

- **Zero setup**: SQLite is a single file
- **Type-safe**: Prisma provides excellent TypeScript integration
- **Easy migrations**: Schema versioning is built-in
- **Scalable**: Can migrate to PostgreSQL later without code changes

### Why Ollama?

- **Free**: No API costs
- **Private**: All data stays on your machine
- **Flexible**: Supports multiple models (Llama, Mistral, Qwen)
- **Offline**: Works without internet connection

### Why Monorepo?

- Shared dependencies
- Easy to run both servers simultaneously
- Clear separation of concerns
- Scalable structure

## Data Flow

```
User Request
    ↓
React Frontend (Vite)
    ↓
Axios HTTP Client
    ↓
Express REST API
    ↓
Future controllers → services → Prisma ORM
    ↓
SQLite Database
    ↓
For future AI tasks:
Ollama (Local LLM)
    ↓
Response back to Frontend
    ↓
React Components render results
```

## Database Schema

### Core Models

- **User**: Authentication and account management
- **Resume**: Uploaded and parsed resume data
- **JobDescription**: Job posting information
- **Analysis**: ATS scores and AI analysis results
- **InterviewQuestion**: Generated interview questions

All models include `createdAt` and `updatedAt` timestamps.

## API Architecture

The planned REST endpoints are organized by domain:

```
/api/auth/*           - Authentication
/api/resumes/*        - Resume management
/api/jobs/*           - Job description management
/api/analysis/*       - Analysis results
/api/interviews/*     - Interview questions
```

Each endpoint follows a consistent response format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

## Security Model

### Authentication (Phase 2)

- JWT-based (stateless)
- Tokens issued on login
- Tokens verified on protected routes
- Tokens expire after configured duration

### Authorization (Phase 2)

- Users can only access their own data
- Middleware enforces user ownership
- Database constraints prevent data leakage

### Data Protection

- Secrets in environment variables
- CORS configured for the local client origin
- Password hashing, validation, and protected ownership checks are future work

## File Upload Strategy

### Planned (Phase 3)

- Files will be stored locally in `/server/uploads/`
- A storage service boundary will permit an S3-compatible replacement later

### Future Scalability

The architecture allows easy migration to:

- AWS S3 (cloud storage)
- Google Cloud Storage
- Azure Blob Storage

Simply replace the storage service without changing the API layer.

## AI Integration Strategy

### Planned (Phase 6)

### Ollama Provider Pattern

```
AIProvider (abstract interface)
    ↓
OllamaProvider (implementation)
    ↓
Future: OpenAIProvider, AnthropicProvider, etc.
```

This design will allow:

- Easy provider swapping
- Testing with mock providers
- Support for multiple AI services simultaneously
- Zero code changes to business logic

## Scaling Considerations

### Database

- SQLite works for development and small deployments
- Migrate to PostgreSQL for production (Prisma supports this)
- Add indexes as needed for performance

### Storage

- Local filesystem for development
- Switch to S3 for production
- CDN for resume files if needed

### API

- Add caching (Redis) if needed
- Implement rate limiting at scale
- Use load balancing (nginx, HAProxy)

### AI

- Ollama can run on separate hardware
- Multiple Ollama instances for parallel processing
- API gateway for model versioning

## Development Workflow

1. **Frontend changes**: No backend restart needed (Vite HMR)
2. **Backend changes**: Auto-restart with tsx watch
3. **Database changes**: Run migrations with Prisma
4. **Schema changes**: Generate types automatically

## Deployment Targets

### Development

- Local machine with `npm run dev`
- Docker for consistency

### Production

- Single VPS with Docker Compose
- Self-hosted Ollama instance
- SQLite or PostgreSQL
- Nginx reverse proxy

### Future

- Kubernetes for scaling
- Managed databases (RDS, Cloud SQL)
- CDN for assets
- Load balancers

---

See [Development Guide](development.md) for setup instructions.
