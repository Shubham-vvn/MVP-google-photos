import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createServer } from '../src/server.js';

describe('Memory Context REST Endpoints (api/openapi.yaml)', () => {
  const app = createServer();
  let createdMemoryId: string;

  it('POST /v1/memory/contexts should create memory and return 202 Accepted', async () => {
    const res = await request(app)
      .post('/v1/memory/contexts')
      .send({
        cluster_id: 'clust_laptop_002',
        user_text: 'Screenshots of laptops comparing specs before buying a new ultrabook.',
        input_method: 'text',
      });

    expect(res.status).toBe(202);
    expect(res.body).toHaveProperty('memory_id');
    expect(res.body.status).toBe('ready');
    expect(res.body).toHaveProperty('estimated_completion_ms');
    createdMemoryId = res.body.memory_id;
  });

  it('GET /v1/memory/contexts should list saved memories with pagination', async () => {
    const res = await request(app).get('/v1/memory/contexts');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('memories');
    expect(Array.isArray(res.body.memories)).toBe(true);

    const mem = res.body.memories[0];
    expect(mem).toHaveProperty('memory_id');
    expect(mem).toHaveProperty('summary');
    expect(mem).toHaveProperty('extracted_entities');
    expect(mem).toHaveProperty('keywords');
  });

  it('GET /v1/memory/contexts/:memory_id should return single memory details', async () => {
    const res = await request(app).get(`/v1/memory/contexts/${createdMemoryId}`);
    expect(res.status).toBe(200);
    expect(res.body.memory_id).toBe(createdMemoryId);
    expect(res.body.summary).toBeDefined();
    expect(res.body.extracted_entities.objects_food).toContain('Laptop');
  });

  it('PATCH /v1/memory/contexts/:memory_id should update memory summary', async () => {
    const res = await request(app)
      .patch(`/v1/memory/contexts/${createdMemoryId}`)
      .send({
        summary: 'Updated ultrabook comparison notes for work setup.',
      });

    expect(res.status).toBe(200);
    expect(res.body.summary.short).toBe('Updated ultrabook comparison notes for work setup.');
  });

  it('DELETE /v1/memory/contexts/:memory_id should delete memory context', async () => {
    const res = await request(app).delete(`/v1/memory/contexts/${createdMemoryId}`);
    expect(res.status).toBe(204);

    const check = await request(app).get(`/v1/memory/contexts/${createdMemoryId}`);
    expect(check.status).toBe(404);
  });
});
