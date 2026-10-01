import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRouter } from './routes/auth.js';
import { resumesRouter } from './routes/resumes.js';
import { jobsRouter } from './routes/jobs.js';
import { analysesRouter } from './routes/analyses.js';
export const createApp = () => {
    const app = express();
    const configuredOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    const isDevelopment = process.env.NODE_ENV !== 'production';
    // Middleware
    app.use(helmet());
    app.use(cors({
        origin(origin, callback) {
            const isLocalDevelopmentOrigin = Boolean(origin && /^http:\/\/localhost:\d+$/.test(origin));
            if (!origin ||
                configuredOrigins.includes(origin) ||
                (isDevelopment && isLocalDevelopmentOrigin)) {
                callback(null, true);
                return;
            }
            callback(new Error('Origin is not allowed by CORS'));
        },
        credentials: true,
    }));
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ limit: '1mb', extended: true }));
    app.use('/api/auth', authRouter);
    app.use('/api/resumes', resumesRouter);
    app.use('/api/jobs', jobsRouter);
    app.use('/api/analyses', analysesRouter);
    // Health check endpoint
    app.get('/api/health', (_req, res) => {
        res.json({
            success: true,
            message: 'Server is running',
            timestamp: new Date().toISOString(),
        });
    });
    // 404 handler
    app.use((_req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint not found',
            errorCode: 'NOT_FOUND',
        });
    });
    // Error handler
    app.use((err, _req, res, _next) => {
        void _next;
        if (process.env.NODE_ENV !== 'test') {
            process.stderr.write(`Unhandled application error: ${err.message}\n`);
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errorCode: 'INTERNAL_SERVER_ERROR',
        });
    });
    return app;
};
//# sourceMappingURL=app.js.map