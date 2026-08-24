import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

describe('GET /api/health', () => {
  it('reports that the API is available', async () => {
    const response = await request(createApp()).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: 'Server is running',
    });
    expect(response.body.timestamp).toEqual(expect.any(String));
  });

  it('allows a Vite development origin when its default port is unavailable', async () => {
    const response = await request(createApp())
      .get('/api/health')
      .set('Origin', 'http://localhost:5174');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5174');
  });
});
