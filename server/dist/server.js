import dotenv from 'dotenv';
import { createApp } from './app.js';
dotenv.config();
const port = Number(process.env.PORT ?? 5000);
const app = createApp();
app.listen(port, () => {
    console.info(`API listening on http://localhost:${port}`);
    console.info(`Health check: http://localhost:${port}/api/health`);
});
//# sourceMappingURL=server.js.map