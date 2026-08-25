import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
const authRouter = Router();
const credentialsSchema = z.object({
    email: z.string().trim().email('Enter a valid email address').max(254),
    password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});
const registerSchema = credentialsSchema.extend({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
});
const userSelect = { id: true, name: true, email: true, createdAt: true };
const getSecret = () => process.env.JWT_SECRET || 'development-only-secret';
const issueToken = (user) => jwt.sign({ id: user.id, email: user.email, name: user.name }, getSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d'),
});
const invalidInput = (issues) => ({
    success: false,
    message: issues[0]?.message || 'Invalid request data',
    errorCode: 'VALIDATION_ERROR',
});
authRouter.post('/register', async (req, res, next) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json(invalidInput(parsed.error.issues));
        const email = parsed.data.email.toLowerCase();
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing)
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists',
                errorCode: 'EMAIL_IN_USE',
            });
        const password = await bcrypt.hash(parsed.data.password, 12);
        const user = await prisma.user.create({
            data: { ...parsed.data, email, password },
            select: userSelect,
        });
        const token = issueToken(user);
        return res
            .status(201)
            .json({ success: true, message: 'Account created successfully', data: { user, token } });
    }
    catch (error) {
        return next(error);
    }
});
authRouter.post('/login', async (req, res, next) => {
    try {
        const parsed = credentialsSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json(invalidInput(parsed.error.issues));
        const user = await prisma.user.findUnique({
            where: { email: parsed.data.email.toLowerCase() },
        });
        if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                errorCode: 'INVALID_CREDENTIALS',
            });
        }
        const token = issueToken(user);
        const { password: _password, ...safeUser } = user;
        void _password;
        return res.json({
            success: true,
            message: 'Signed in successfully',
            data: { user: safeUser, token },
        });
    }
    catch (error) {
        return next(error);
    }
});
authRouter.get('/me', requireAuth, async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: userSelect });
        if (!user)
            return res
                .status(401)
                .json({ success: false, message: 'Account no longer exists', errorCode: 'UNAUTHORIZED' });
        return res.json({ success: true, data: { user } });
    }
    catch (error) {
        return next(error);
    }
});
export { authRouter };
//# sourceMappingURL=auth.js.map