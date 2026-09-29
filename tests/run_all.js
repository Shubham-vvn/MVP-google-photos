/**
 * Complete End-to-End Automated Test Suite Runner
 * Google Photos — AI Memory Context MVP
 * Executes across all Phase 1-6 deliverables
 */

import assert from 'assert';
import http from 'http';
import { createServer } from '../dist/server.js';
import { clusteringEngine } from '../dist/services/clusteringEngine.js';
import { nluService } from '../dist/services/nluService.js';
import { promptEngine } from '../dist/services/promptEngine.js';
import { auditLogger } from '../dist/services/auditLogger.js';

let server;
let baseUrl;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (body) {
      reqHeaders['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }

    const req = http.request(
      url,
      {
        method,
        headers: reqHeaders,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = data ? JSON.parse(data) : {};
          } catch (e) {
            parsed = data;
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING GOOGLE PHOTOS AI MEMORY CONTEXT MVP TEST SUITE');
  console.log('======================================================\n');

  const app = createServer();
  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(err);
      failed++;
    }
  }

  // --- SUITE 1: HEALTH & READINESS ---
  console.log('▶ Suite 1: Service Health & Gateway');
  await test('GET /healthz returns status UP and 200', async () => {
    const res = await request('GET', '/healthz');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'UP');
  });

  await test('GET /readyz returns dependencies status and 200', async () => {
    const res = await request('GET', '/readyz');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.ready, true);
  });

  await test('GET / returns service metadata and openapi link', async () => {
    const res = await request('GET', '/');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.name, 'Google Photos AI Memory Context Service');
  });

  // --- SUITE 2: PHOTO CLUSTERS ---
  console.log('\n▶ Suite 2: Photo Clusters (Phase 2 & api/openapi.yaml)');
  await test('GET /v1/memory/clusters returns candidate clusters', async () => {
    const res = await request('GET', '/v1/memory/clusters');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.clusters));
    assert.ok(res.body.clusters.length > 0);
    assert.ok(res.body.clusters[0].cluster_id);
    assert.ok(res.body.clusters[0].location_label);
  });

  await test('GET /v1/memory/clusters/:id returns cluster details', async () => {
    const res = await request('GET', '/v1/memory/clusters/clust_delhi_001');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.cluster_id, 'clust_delhi_001');
  });

  await test('POST /v1/memory/clusters/:id/dismiss records cooldown', async () => {
    const res = await request('POST', '/v1/memory/clusters/clust_delhi_001/dismiss', {
      reason: 'not_now',
      cooldown_days: 14,
    });
    assert.strictEqual(res.status, 204);
  });

  // --- SUITE 3: MEMORY CONTEXT CRUD & LIFECYCLE ---
  console.log('\n▶ Suite 3: Memory Context CRUD & AI Extraction (Phase 1 & Phase 3)');
  let createdMemId = '';
  await test('POST /v1/memory/contexts ingests memory and returns 202 Accepted', async () => {
    const res = await request('POST', '/v1/memory/contexts', {
      cluster_id: 'clust_laptop_002',
      user_text: 'Screenshots comparing M3 and Core Ultra laptops before buying new ultrabook.',
      input_method: 'text',
    });
    assert.strictEqual(res.status, 202);
    assert.ok(res.body.memory_id);
    assert.strictEqual(res.body.status, 'ready');
    createdMemId = res.body.memory_id;
  });

  await test('GET /v1/memory/contexts lists user memories', async () => {
    const res = await request('GET', '/v1/memory/contexts');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.memories));
    assert.ok(res.body.memories.length > 0);
  });

  await test('GET /v1/memory/contexts/:id returns memory details with entities', async () => {
    const res = await request('GET', `/v1/memory/contexts/${createdMemId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.memory_id, createdMemId);
    assert.ok(res.body.extracted_entities.objects_food.includes('Laptop'));
  });

  await test('PATCH /v1/memory/contexts/:id updates memory summary', async () => {
    const res = await request('PATCH', `/v1/memory/contexts/${createdMemId}`, {
      summary: 'Updated work laptop research notes.',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.summary.short, 'Updated work laptop research notes.');
  });

  await test('DELETE /v1/memory/contexts/:id deletes memory', async () => {
    const res = await request('DELETE', `/v1/memory/contexts/${createdMemId}`);
    assert.strictEqual(res.status, 204);

    const check = await request('GET', `/v1/memory/contexts/${createdMemId}`);
    assert.strictEqual(check.status, 404);
  });

  // --- SUITE 4: HYBRID SEARCH & RETRIEVAL ---
  console.log('\n▶ Suite 4: Multimodal Hybrid Search (Phase 4)');
  await test('POST /v1/memory/search retrieves photos for natural memory query', async () => {
    const res = await request('POST', '/v1/memory/search', {
      query: 'Delhi cafe with Ramesh having cake',
      max_results: 10,
      min_relevance_threshold: 0.3,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.search_strategy, 'hybrid_rrf_vector_keyword');
    assert.ok(res.body.results.length > 0);
    const top = res.body.results[0];
    assert.ok(top.relevance_score > 0.5);
    assert.ok(top.matched_memory.summary.includes('Ramesh'));
  });

  await test('POST /v1/memory/search validates query length', async () => {
    const res = await request('POST', '/v1/memory/search', { query: '' });
    assert.strictEqual(res.status, 400);
  });

  // --- SUITE 5: USER SETTINGS ---
  console.log('\n▶ Suite 5: User Settings & Privacy Controls (Phase 1)');
  await test('GET /v1/memory/settings returns user preferences', async () => {
    const res = await request('GET', '/v1/memory/settings');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.memory_prompts_enabled, true);
  });

  await test('PUT /v1/memory/settings updates preferences', async () => {
    const res = await request('PUT', '/v1/memory/settings', {
      memory_prompts_enabled: true,
      voice_transcription_enabled: true,
      max_prompts_per_week: 5,
      cooldown_days: 7,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.max_prompts_per_week, 5);
  });

  // --- SUITE 6: PROCESSING PIPELINE ENGINES ---
  console.log('\n▶ Suite 6: Pipeline Engines & Privacy Sanitization (Phase 2 & 3)');
  await test('clusteringEngine groups items by 2-hour temporal windows', () => {
    const rawItems = [
      { media_id: 'm1', type: 'photo', captured_at: '2026-10-14T14:00:00Z' },
      { media_id: 'm2', type: 'photo', captured_at: '2026-10-14T14:30:00Z' },
      { media_id: 'm3', type: 'video', captured_at: '2026-10-14T15:00:00Z' },
      { media_id: 'm4', type: 'photo', captured_at: '2026-10-14T20:00:00Z' },
    ];
    const clusters = clusteringEngine.clusterMedia('user_test', rawItems);
    assert.strictEqual(clusters.length, 1);
    assert.strictEqual(clusters[0].media_items.length, 3);
  });

  await test('nluService extracts people, places, and activities with source labels', async () => {
    const text = 'I met Ramesh at a café in Delhi. We had chocolate cake.';
    const res = await nluService.extractMemoryContext(text);
    assert.ok(res.extracted.people.some((p) => p.name === 'Ramesh' && p.source === 'user'));
    assert.ok(res.extracted.places.some((p) => p.name === 'Delhi' && p.source === 'user'));
    assert.ok(res.summary.keywords.includes('Ramesh'));
  });

  await test('promptEngine generates contextual prompt copy', () => {
    const cluster = {
      user_id: 'u1',
      cluster_id: 'c1',
      status: 'pending_prompt',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      media_items: [],
      clustering_metadata: {
        time_span: { start: '', end: '' },
        location: { lat: 0, lng: 0, locality: 'Connaught Place' },
        media_count: { photos: 10, videos: 3 },
        quality_score: 0.85,
      },
      prompt_history: [],
    };
    const decision = promptEngine.evaluatePromptEligibility(cluster, {
      user_id: 'u1',
      updated_at: '',
      memory_prompts_enabled: true,
      voice_transcription_enabled: true,
      sensitive_detection_enabled: true,
      max_prompts_per_week: 3,
      cooldown_days: 14,
    });
    assert.strictEqual(decision.shouldPrompt, true);
    assert.ok(decision.promptText.includes('10 photos & 3 videos'));
  });

  await test('auditLogger sanitizes private metadata and logs zero PII', () => {
    auditLogger.logEvent({
      action: 'TEST_ACTION',
      userId: 'usr_test',
      resourceId: 'res_test',
      timestamp: new Date().toISOString(),
      metadata: { raw_text: 'secret memories', count: 5 },
    });
    const logs = auditLogger.getAuditLogs('usr_test');
    assert.ok(logs.length > 0);
    const last = logs[logs.length - 1];
    assert.strictEqual(last.metadata.raw_text, undefined);
  });

  server.close();

  console.log('\n======================================================');
  console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test runner error:', err);
  if (server) server.close();
  process.exit(1);
});
