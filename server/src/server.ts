import dotenv from 'dotenv';
import { createApp } from './app.js';

dotenv.config();

const port = Number(process.env.PORT ?? 5001);
const app = createApp();

app.listen(port, () => {
  process.stdout.write(`API listening on http://localhost:${port}\n`);
  process.stdout.write(`Health check: http://localhost:${port}/api/health\n`);
});
