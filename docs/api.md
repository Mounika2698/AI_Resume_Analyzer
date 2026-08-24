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

### Authentication Endpoints

- `POST /auth/register` - Creates an account. Body: `{ "name", "email", "password" }`. Returns the safe user profile and JWT.
- `POST /auth/login` - Signs in with `{ "email", "password" }`. Returns the safe user profile and JWT.
- `GET /auth/me` - Returns the signed-in user's profile. Requires `Authorization: Bearer <jwt_token>`.

Passwords must be 8–128 characters; names must be 2–100 characters. Registration returns `409 EMAIL_IN_USE` for an existing email, and invalid login credentials return `401 INVALID_CREDENTIALS`.

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

**Note**: Resume and analysis endpoints are planned for subsequent phases.
