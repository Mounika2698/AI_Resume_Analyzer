# REST API Documentation

## Base URL

Development: `http://localhost:5000/api`
Production: (varies)

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errorCode": "ERROR_CODE"
}
```

## Authentication

Most endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints (To be implemented in Phases 2+)

### Authentication Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

### Resume Endpoints

- `POST /resumes` - Upload resume
- `GET /resumes` - List user's resumes
- `GET /resumes/:id` - Get specific resume
- `DELETE /resumes/:id` - Delete resume

### Job Description Endpoints

- `POST /jobs` - Create job description
- `GET /jobs` - List user's job descriptions
- `DELETE /jobs/:id` - Delete job description

### Analysis Endpoints

- `POST /analysis` - Create analysis
- `GET /analysis` - List user's analyses
- `GET /analysis/:id` - Get specific analysis
- `DELETE /analysis/:id` - Delete analysis

### Interview Question Endpoints

- `GET /interviews/:analysisId` - Get interview questions
- `POST /interviews/generate` - Generate new questions

---

**Note**: Phase 1 only includes basic project setup. API endpoints will be fully documented as they're implemented in subsequent phases.
