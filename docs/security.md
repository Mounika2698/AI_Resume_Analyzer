# Security baseline

Phase 1 enables Helmet and a configured CORS origin, limits JSON and URL-encoded
request bodies to 1 MB, and uses a centralized error response shape.

Later phases add rate limiting, Zod request validation, JWT authentication,
password hashing, protected ownership checks, and strict upload validation.
Resume content, authentication tokens, and passwords must never be logged.
