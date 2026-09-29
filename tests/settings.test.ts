import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createServer } from '../src/server.js';

describe('User Settings REST Endpoints (api/openapi.yaml)', () => {
  const app = createServer();

  it('GET /v1/memory/settings should return user preferences', async () => {
    const res = await request(app).get('/v1/memory/settings');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('memory_prompts_enabled');
    expect(res.body).toHaveProperty('voice_transcription_enabled');
    expect(res.body).toHaveProperty('max_prompts_per_week');
  });

  it('PUT /v1/memory/settings should update preferences', async () => {
    const res = await request(app)
      .put('/v1/memory/settings')
      .send({
        memory_prompts_enabled: true,
        voice_transcription_enabled: true,
        max_prompts_per_week: 5,
        cooldown_days: 7,
      });

    expect(res.status).toBe(200);
    expect(res.body.max_prompts_per_week).toBe(5);
    expect(res.body.cooldown_days).toBe(7);
  });
});
