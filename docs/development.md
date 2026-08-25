# Development Guide

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- Git

### Initial Setup

1. **Clone and install**

```bash
git clone https://github.com/yourusername/ai-resume-analyzer.git
cd ai-resume-analyzer
npm install
```

2. **Configure environment**

```bash
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. **Setup database**

```bash
npm run db:migrate
npm run db:seed
```

4. **Start development**

```bash
npm run dev
```

This launches:

- Frontend: http://localhost:5173 (with hot reload)
- Backend: http://localhost:5001 (with auto-restart)

## Project Layout

### Server Structure

```
server/
├── src/
│   ├── app.ts                 # Express app setup
│   ├── controllers/           # Request handlers
│   ├── routes/                # API route definitions
│   ├── services/              # Business logic
│   ├── middleware/            # Express middleware
│   ├── validators/            # Zod schemas for validation
│   └── utils/
│       └── response.ts        # Standard API responses
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Development seed data
├── package.json
├── tsconfig.json
└── .eslintrc.json
```

### Client Structure

```
client/
├── src/
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point
│   ├── index.css              # Tailwind + global styles
│   ├── components/            # Reusable React components
│   ├── pages/                 # Page-level components
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API client services
│   ├── types/                 # TypeScript interfaces
│   └── utils/                 # Utility functions
├── vite.config.ts
├── tailwind.config.js
├── package.json
└── tsconfig.json
```

## Common Commands

### Development

```bash
# Start both frontend and backend
npm run dev

# Start only backend
npm run dev --workspace=server

# Start only frontend
npm run dev --workspace=client
```

### Database

```bash
# Create and apply migrations
npm run db:migrate

# Seed development data
npm run db:seed

# Reset database (caution!)
npm run db:reset
```

### Code Quality

```bash
# Lint both projects
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

### Building

```bash
# Build both projects
npm run build

# Build specific project
npm run build --workspace=server
npm run build --workspace=client
```

## Adding Dependencies

### To Backend

```bash
cd server
npm install package-name
# or from root:
npm install package-name --workspace=server
```

### To Frontend

```bash
cd client
npm install package-name
# or from root:
npm install package-name --workspace=client
```

## Database Changes

### Adding a New Model

1. **Edit `server/prisma/schema.prisma`**

```prisma
model NewModel {
  id        String     @id @default(cuid())
  userId    String
  user      User       @relation(fields: [userId], references: [id])

  name      String
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@map("new_models")
}
```

2. **Create migration**

```bash
npm run db:migrate
```

3. **Generate Prisma client**

```bash
npm run db:generate
```

4. **Use in code**

```typescript
import { prisma } from './client';

const item = await prisma.newModel.create({
  data: { userId: '123', name: 'Test' },
});
```

## API Development

### Creating a New Endpoint

1. **Create validator** (`server/src/validators/user.ts`)

```typescript
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
```

2. **Create service** (`server/src/services/userService.ts`)

```typescript
import { CreateUserInput } from '../validators/user';

export class UserService {
  async createUser(data: CreateUserInput) {
    // Business logic here
  }
}
```

3. **Create controller** (`server/src/controllers/userController.ts`)

```typescript
import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { sendSuccess, sendError } from '../utils/response';

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const service = new UserService();
      const result = await service.createUser(req.body);
      sendSuccess(res, 'User created', result, 201);
    } catch (error) {
      sendError(res, 'Failed to create user', 'USER_CREATE_ERROR');
    }
  }
}
```

4. **Create route** (`server/src/routes/users.ts`)

```typescript
import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();
const controller = new UserController();

router.post('/', (req, res) => controller.create(req, res));

export default router;
```

5. **Register route** (in `app.ts`)

```typescript
import userRoutes from './routes/users';
app.use('/api/users', userRoutes);
```

## Testing

### Writing Unit Tests (Backend)

Create `server/src/services/__tests__/userService.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '../userService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it('should create a user', async () => {
    const result = await service.createUser({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });

    expect(result).toBeDefined();
    expect(result.email).toBe('test@example.com');
  });
});
```

### Writing Component Tests (Frontend)

Create `client/src/components/__tests__/Button.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDefined();
  });
});
```

### Running Tests

```bash
npm run test
npm run test -- --watch
```

## Debugging

### Backend

```bash
# The server uses tsx watch, which auto-restarts on changes
npm run dev --workspace=server

# To debug with console logs:
console.log('Debug info:', variable);
```

### Frontend

- Use React Developer Tools browser extension
- Chrome DevTools for network inspection
- Vite provides source maps for debugging

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=5001
DATABASE_URL=file:./dev.db
JWT_SECRET=your-secret-here
CORS_ORIGIN=http://localhost:5173
OLLAMA_BASE_URL=http://localhost:11434
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5001/api
```

Never commit `.env` files. Use `.env.example` for defaults.

## Git Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "Clear commit message"`
3. Run tests and linting: `npm run lint && npm run test`
4. Push: `git push origin feature/feature-name`
5. Create Pull Request

## Performance Tips

- Use React DevTools Profiler to find slow components
- Monitor network requests with Chrome DevTools
- Use `npm run build` to test production bundle size
- Check database queries with Prisma Studio: `npx prisma studio`

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5001
lsof -i :5001
# Kill it
kill -9 <PID>
```

### Database Issues

```bash
# Reset database
npm run db:reset

# View database with Prisma Studio
npx prisma studio
```

### Dependencies Not Installing

```bash
# Clear cache
npm cache clean --force
# Reinstall
rm -rf node_modules package-lock.json
npm install
```

---

For more information, see [Architecture](architecture.md) and [API Documentation](api.md).
