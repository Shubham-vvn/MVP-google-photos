import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createServer } from '../src/server.js';

describe('Clusters REST Endpoints (api/openapi.yaml)', () => {
  const app = createServer();

  it('GET /v1/memory/clusters should return candidate clusters for prompting', async () => {
    const res = await request(app).get('/v1/memory/clusters');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('clusters');
    expect(Array.isArray(res.body.clusters)).toBe(true);
    expect(res.body.clusters.length).toBeGreaterThan(0);

    const cluster = res.body.clusters[0];
    expect(cluster).toHaveProperty('cluster_id');
    expect(cluster).toHaveProperty('media_count');
    expect(cluster).toHaveProperty('location_label');
    expect(cluster).toHaveProperty('prompt_suggestion');
  });

  it('GET /v1/memory/clusters/:cluster_id should return cluster details', async () => {
    const res = await request(app).get('/v1/memory/clusters/clust_delhi_001');
    expect(res.status).toBe(200);
    expect(res.body.cluster_id).toBe('clust_delhi_001');
    expect(res.body.status).toBe('pending_prompt');
    expect(res.body.clustering_metadata.location.locality).toContain('Connaught Place');
  });

  it('POST /v1/memory/clusters/:cluster_id/dismiss should register cooldown', async () => {
    const res = await request(app)
      .post('/v1/memory/clusters/clust_delhi_001/dismiss')
      .send({ reason: 'not_now', cooldown_days: 14 });
    expect(res.status).toBe(204);
  });
});
