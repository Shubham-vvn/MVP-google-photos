import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createServer } from '../src/server.js';

describe('Hybrid Search REST Endpoints (api/openapi.yaml)', () => {
  const app = createServer();

  it('POST /v1/memory/search should retrieve photos matching natural memory query', async () => {
    const res = await request(app)
      .post('/v1/memory/search')
      .send({
        query: 'Delhi cafe with Ramesh having cake',
        max_results: 10,
        min_relevance_threshold: 0.3,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('results');
    expect(res.body).toHaveProperty('total_results');
    expect(res.body).toHaveProperty('search_strategy');
    expect(res.body.search_strategy).toBe('hybrid_rrf_vector_keyword');

    expect(res.body.results.length).toBeGreaterThan(0);
    const topMatch = res.body.results[0];
    expect(topMatch).toHaveProperty('media_id');
    expect(topMatch).toHaveProperty('relevance_score');
    expect(topMatch.relevance_score).toBeGreaterThan(0.5);
    expect(topMatch.matched_memory).toBeDefined();
    expect(topMatch.matched_memory.summary).toContain('Ramesh');
  });

  it('POST /v1/memory/search should validate query length and parameters', async () => {
    const res = await request(app)
      .post('/v1/memory/search')
      .send({
        query: '',
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('BAD_REQUEST');
  });
});
