import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createServer } from '../src/server.js';

describe('Service Health & Readiness Endpoints', () => {
  const app = createServer();

  it('GET /healthz should return 200 OK and status UP', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'UP');
    expect(res.body).toHaveProperty('service', 'photos-memory-context-api');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET /readyz should return 200 OK and dependency status', async () => {
    const res = await request(app).get('/readyz');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ready', true);
    expect(res.body).toHaveProperty('spanner', 'connected');
    expect(res.body).toHaveProperty('redis', 'connected');
  });

  it('GET / should return service info and openapi link', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Google Photos AI Memory Context Service');
  });
});
