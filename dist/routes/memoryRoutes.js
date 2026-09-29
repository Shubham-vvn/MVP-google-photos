/**
 * Memory Context REST Endpoints
 * Google Photos — AI Memory Context MVP
 * Document Reference: api/openapi.yaml
 */
import { Router } from 'express';
import { z } from 'zod';
import { memoryStore } from '../dal/memoryStore.js';
import { memoryOrchestrator } from '../services/memoryOrchestrator.js';
import { indexStore } from '../dal/indexStore.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { consentMiddleware } from '../middleware/consent.js';
export const memoryRouter = Router();
// Validation Schemas matching OpenAPI components
const CreateMemorySchema = z.object({
    cluster_id: z.string().min(1, 'cluster_id is required'),
    user_text: z.string().min(1, 'user_text is required').max(2000, 'user_text exceeds 2000 characters'),
    input_method: z.enum(['voice', 'text']).default('text'),
    client_timestamp: z.string().optional(),
});
const UpdateMemorySchema = z.object({
    summary: z.string().optional(),
    raw_input: z.string().optional(),
    extracted_entities: z.record(z.any()).optional(),
    added_media_ids: z.array(z.string()).optional(),
    removed_media_ids: z.array(z.string()).optional(),
});
// POST /v1/memory/contexts - Ingest memory context and trigger AI extraction
memoryRouter.post('/contexts', rateLimiter(20), // 20 creates per minute
consentMiddleware, async (req, res) => {
    try {
        const userId = req.userId || 'usr_google_default';
        const parsed = CreateMemorySchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                code: 400,
                status: 'BAD_REQUEST',
                message: 'Invalid memory context creation payload.',
                details: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
            });
            return;
        }
        const { cluster_id, user_text, input_method } = parsed.data;
        // Orchestrate NLU + Visual + Fusion + Persistence
        const memory = await memoryOrchestrator.processMemoryIngestion(userId, cluster_id, {
            raw_text: user_text,
            input_method,
        });
        // Return 202 Accepted response as specified in OpenAPI
        res.status(202).json({
            memory_id: memory.memory_id,
            status: 'ready',
            estimated_completion_ms: 250,
        });
    }
    catch (err) {
        res.status(500).json({
            code: 500,
            status: 'INTERNAL_SERVER_ERROR',
            message: err.message || 'Failed to process memory context.',
        });
    }
});
// GET /v1/memory/contexts - List active memories
memoryRouter.get('/contexts', async (req, res) => {
    try {
        const userId = req.userId || 'usr_google_default';
        const pageSize = req.query.page_size ? parseInt(req.query.page_size, 10) : 20;
        const pageToken = req.query.page_token;
        const { memories, nextPageToken } = await memoryStore.listByUser(userId, pageSize, pageToken);
        // Map to OpenAPI MemoryContext representation
        const formatted = memories.map((m) => ({
            memory_id: m.memory_id,
            user_id: m.user_id,
            cluster_id: m.cluster_id,
            created_at: m.created_at,
            updated_at: m.updated_at,
            status: m.status,
            raw_input: m.user_input.raw_text,
            summary: m.summary.short,
            extracted_entities: {
                people: m.extracted_context.people.map((p) => p.name),
                places: m.extracted_context.places.map((p) => p.name),
                events: m.extracted_context.activities.map((a) => a.label),
                objects_food: m.extracted_context.objects.map((o) => o.label),
                emotions: m.extracted_context.emotions,
            },
            keywords: m.summary.keywords,
            linked_media_ids: m.media_associations.map((a) => a.media_id),
        }));
        res.status(200).json({
            memories: formatted,
            next_page_token: nextPageToken,
        });
    }
    catch (err) {
        res.status(500).json({
            code: 500,
            status: 'INTERNAL_SERVER_ERROR',
            message: err.message,
        });
    }
});
// GET /v1/memory/contexts/:memory_id - Get memory details
memoryRouter.get('/contexts/:memory_id', async (req, res) => {
    try {
        const userId = req.userId || 'usr_google_default';
        const memory = await memoryStore.findById(req.params.memory_id, userId);
        if (!memory) {
            res.status(404).json({
                code: 404,
                status: 'NOT_FOUND',
                message: `Memory context ${req.params.memory_id} not found.`,
            });
            return;
        }
        res.status(200).json({
            memory_id: memory.memory_id,
            user_id: memory.user_id,
            cluster_id: memory.cluster_id,
            created_at: memory.created_at,
            updated_at: memory.updated_at,
            status: memory.status,
            raw_input: memory.user_input.raw_text,
            summary: memory.summary.short,
            extracted_entities: {
                people: memory.extracted_context.people.map((p) => p.name),
                places: memory.extracted_context.places.map((p) => p.name),
                events: memory.extracted_context.activities.map((a) => a.label),
                objects_food: memory.extracted_context.objects.map((o) => o.label),
                emotions: memory.extracted_context.emotions,
            },
            keywords: memory.summary.keywords,
            linked_media_ids: memory.media_associations.map((a) => a.media_id),
        });
    }
    catch (err) {
        res.status(500).json({
            code: 500,
            status: 'INTERNAL_SERVER_ERROR',
            message: err.message,
        });
    }
});
// PATCH /v1/memory/contexts/:memory_id - Edit memory context
memoryRouter.patch('/contexts/:memory_id', async (req, res) => {
    try {
        const userId = req.userId || 'usr_google_default';
        const memory = await memoryStore.findById(req.params.memory_id, userId);
        if (!memory) {
            res.status(404).json({
                code: 404,
                status: 'NOT_FOUND',
                message: `Memory context ${req.params.memory_id} not found.`,
            });
            return;
        }
        const parsed = UpdateMemorySchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                code: 400,
                status: 'BAD_REQUEST',
                message: 'Invalid update payload.',
            });
            return;
        }
        const { summary, raw_input } = parsed.data;
        const patch = {};
        if (summary) {
            patch.summary = { ...memory.summary, short: summary };
        }
        if (raw_input) {
            patch.user_input = { ...memory.user_input, raw_text: raw_input };
        }
        const updated = await memoryStore.update(req.params.memory_id, userId, patch);
        res.status(200).json(updated);
    }
    catch (err) {
        res.status(500).json({
            code: 500,
            status: 'INTERNAL_SERVER_ERROR',
            message: err.message,
        });
    }
});
// DELETE /v1/memory/contexts/:memory_id - Delete memory context
memoryRouter.delete('/contexts/:memory_id', async (req, res) => {
    try {
        const userId = req.userId || 'usr_google_default';
        const deleted = await memoryStore.delete(req.params.memory_id, userId);
        if (!deleted) {
            res.status(404).json({
                code: 404,
                status: 'NOT_FOUND',
                message: `Memory context ${req.params.memory_id} not found.`,
            });
            return;
        }
        // Clean from vector index
        indexStore.remove(req.params.memory_id);
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({
            code: 500,
            status: 'INTERNAL_SERVER_ERROR',
            message: err.message,
        });
    }
});
