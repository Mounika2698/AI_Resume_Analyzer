# AI Resume Analyzer

> An open-source, $0-cost resume analyzer foundation that will use local Ollama for AI inference.

**Status: Phase 1 complete.** The monorepo, client, API health check, Prisma +
SQLite setup, Docker configuration, and quality tooling are operational.
Authentication, uploads, ATS scoring, AI analysis, and interview generation are
planned later phases and are not presented as implemented functionality.

## 🚀 Features

- ✅ React + TypeScript client foundation
- ✅ Express + TypeScript API with health endpoint
- ✅ Prisma ORM + local SQLite schema and fictional development seed
- ✅ Optional Docker Compose configuration
- ✅ ESLint, Prettier, Vitest, and GitHub Actions foundation
- ⏳ Authentication, upload parsing, ATS scoring, AI analysis, and dashboard

## 💰 Cost

**$0 USD**

This project is designed to run entirely locally using open-source software:

- No paid AI APIs (OpenAI, Anthropic, Google Gemini, etc.)
- No cloud database costs (SQLite is local)
- No cloud hosting required (run on your laptop or cheap VPS)
- No authentication service costs (JWT-based)
- No file storage costs (local file system)

## 📋 Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- Zod
- Axios
- Recharts

### Backend

- Node.js
- Express
- TypeScript
- REST API
- JWT Authentication
- bcryptjs

### Database

- SQLite
- Prisma ORM

### AI

- Ollama (local LLM inference)
- Llama 3 / Mistral / Qwen (configurable)

### DevOps

- Docker & Docker Compose
- GitHub Actions (CI/CD)

## 🏗️ Project Structure

```
ai-resume-analyzer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── validators/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
│
├── docs/                   # Documentation
├── .github/workflows/      # CI/CD
├── docker-compose.yml
├── package.json           # Root monorepo
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) Docker & Docker Compose

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ai-resume-analyzer.git
   cd ai-resume-analyzer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

4. **Initialize the database**

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development servers**

   ```bash
   npm run dev
   ```

   This starts:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

6. **Verify everything works**
   - Frontend should load: http://localhost:5173
   - Backend health check: http://localhost:5000/api/health

### Docker Setup

```bash
docker compose up --build
```

## 📱 Next Steps (Phase 2)

- [ ] User authentication (registration/login)
- [ ] JWT token management
- [ ] Protected API routes
- [ ] Authentication UI

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch
```

## 📚 Documentation

- [Architecture Guide](docs/architecture.md) - System design and decisions
- [API Documentation](docs/api.md) - REST API endpoints
- [Database Schema](docs/database.md) - Prisma models and relationships
- [Development Guide](docs/development.md) - Contributing and development workflow

## 🛡️ Security

Phase 1 includes the following baseline security setup:

- Helmet.js for HTTP headers
- CORS configuration
- 1 MB JSON/request body limit
- Centralized controlled error responses

Zod validation, password hashing, JWT authentication, rate limiting, and
strict upload validation are implemented in subsequent phases.

- Environment variables for secrets

## 📄 Environment Variables

See `.env.example` for complete configuration.

Key variables:

- `NODE_ENV` - development/production
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - SQLite database path
- `JWT_SECRET` - Secret for signing tokens
- `CORS_ORIGIN` - Frontend URL for CORS
- `OLLAMA_BASE_URL` - Ollama API endpoint (used in later phases)

## 🤝 Contributing

This is a portfolio project. Feel free to fork and extend!

## 📄 License

MIT

## 🙋 FAQ

**Q: Does this cost money?**
A: No, it's completely free. Ollama is open-source, SQLite is free, and all npm packages are free.

**Q: Can I use it with paid AI APIs?**
A: Yes, you can swap the AI provider in Phase 7 without rewriting the application.

**Q: What resume formats are supported?**
A: PDF, DOCX, and TXT files (implemented in Phase 3).

**Q: How does ATS scoring work?**
A: A transparent algorithm based on keyword match (30%), skills match (25%), job title relevance (10%), experience (15%), structure (10%), education (5%), and formatting (5%). See docs/ats-scoring.md for details.

**Q: Why SQLite instead of MongoDB/PostgreSQL?**
A: SQLite requires zero setup, is file-based (easy to backup), and is perfect for local development and small deployments. It can be easily migrated to PostgreSQL later.

---

**Status**: Phase 1 - Foundation Complete ✅

Next Phase: Authentication (Phase 2)
