# REST API Documentation

## Base URL

Development: `http://localhost:5001/api`
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

- `POST /resumes` - Upload a `multipart/form-data` field named `resume`. Accepts PDF, DOCX, and TXT files up to `MAX_FILE_SIZE` (10 MB by default). Requires authentication.
- `GET /resumes` - List the authenticated user's parsed resumes. Requires authentication.
- `GET /resumes/:id` - Get a specific parsed resume, including its extracted text. Requires authentication.
- `DELETE /resumes/:id` - Delete a specific resume record. Requires authentication.

### Job Description Endpoints

- `POST /jobs` - Create a job description. Body: `{ "title", "company?", "content", "requiredSkills?", "preferredSkills?" }`. When required skills are omitted, a keyword set is derived from the description.
- `GET /jobs` - List the authenticated user's job descriptions.
- `DELETE /jobs/:id` - Delete an authenticated user's job description.

### Analysis Endpoints

- `POST /analyses` - Create an ATS analysis. Body: `{ "resumeId", "jobDescriptionId" }`. Returns a 0–100 score, category breakdown, and missing required skills.
- `GET /analyses` - List the authenticated user's analyses.

### Interview Question Endpoints

- `GET /interviews/:analysisId` - Get interview questions
- `POST /interviews/generate` - Generate new questions

---

ATS scores are deterministic and use the weights documented in [ATS Scoring](ats-scoring.md). Analyses and job descriptions are user-scoped.
