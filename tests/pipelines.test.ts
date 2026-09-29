import { describe, it, expect } from 'vitest';
import { clusteringEngine } from '../src/services/clusteringEngine.js';
import { nluService } from '../src/services/nluService.js';
import { memoryFusionEngine } from '../src/services/memoryFusionEngine.js';
import { promptEngine } from '../src/services/promptEngine.js';
import { auditLogger } from '../src/services/auditLogger.js';

describe('AI & Processing Pipeline Engines', () => {
  it('clusteringEngine should group media within 2-hour temporal windows', () => {
    const rawItems = [
      { media_id: 'm1', type: 'photo' as const, captured_at: '2026-10-14T14:00:00Z' },
      { media_id: 'm2', type: 'photo' as const, captured_at: '2026-10-14T14:30:00Z' },
      { media_id: 'm3', type: 'video' as const, captured_at: '2026-10-14T15:00:00Z' },
      { media_id: 'm4', type: 'photo' as const, captured_at: '2026-10-14T20:00:00Z' }, // 5 hrs later
      { media_id: 'm5', type: 'photo' as const, captured_at: '2026-10-14T20:45:00Z' },
    ];

    const clusters = clusteringEngine.clusterMedia('user_test', rawItems);
    expect(clusters.length).toBe(2);
    expect(clusters[0].media_items.length).toBe(3);
    expect(clusters[1].media_items.length).toBe(2);
  });

  it('nluService should extract structured entities and preserve user source', async () => {
    const text = 'I met Ramesh at a café in Delhi. We had chocolate cake and talked about childhood.';
    const result = await nluService.extractMemoryContext(text);

    expect(result.extracted.people.some((p) => p.name === 'Ramesh' && p.source === 'user')).toBe(true);
    expect(result.extracted.places.some((p) => p.name === 'Delhi' && p.source === 'user')).toBe(true);
    expect(result.extracted.objects.some((o) => o.label === 'Cake')).toBe(true);
    expect(result.summary.keywords).toContain('Ramesh');
  });

  it('promptEngine should generate contextual prompt text', () => {
    const cluster = {
      user_id: 'u1',
      cluster_id: 'c1',
      status: 'pending_prompt' as const,
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

    expect(decision.shouldPrompt).toBe(true);
    expect(decision.promptText).toContain('10 photos & 3 videos');
    expect(decision.promptText).toContain('Connaught Place');
  });

  it('auditLogger should sanitize entries and avoid logging raw user text', () => {
    auditLogger.logEvent({
      action: 'TEST_ACTION',
      userId: 'usr_test',
      resourceId: 'res_test',
      timestamp: new Date().toISOString(),
      metadata: { raw_text: 'sensitive private memory', count: 5 },
    });

    const logs = auditLogger.getAuditLogs('usr_test');
    expect(logs.length).toBeGreaterThan(0);
    const last = logs[logs.length - 1];
    expect(last.metadata?.raw_text).toBeUndefined();
    expect(last.metadata?.count).toBe(5);
  });
});
