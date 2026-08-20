import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
export const createApp = () => {
    const app = express();
    // Middleware
    app.use(helmet());
    app.use(cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
    }));
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ limit: '1mb', extended: true }));
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
            console.error('Unhandled application error:', err.message);
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