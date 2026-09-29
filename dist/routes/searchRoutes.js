/**
 * Hybrid Multimodal Search Endpoints
 * Google Photos — AI Memory Context MVP
 * Document Reference: api/openapi.yaml
 */
import { Router } from 'express';
import { z } from 'zod';
import { searchEngine } from '../services/searchEngine.js';
export const searchRouter = Router();
const SearchRequestSchema = z.object({
    query: z.string().min(1, 'query is required').max(300, 'query exceeds 300 characters'),
    max_results: z.number().int().min(1).max(100).default(30),
    min_relevance_threshold: z.number().min(0).max(1).default(0.4),
    include_memory_context: z.boolean().default(true),
});
// POST /v1/memory/search - Hybrid natural language search
searchRouter.post('/search', async (req, res) => {
    try {
        const userId = req.userId || 'usr_google_default';
        const parsed = SearchRequestSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                code: 400,
                status: 'BAD_REQUEST',
                message: 'Invalid search request parameters.',
                details: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
            });
            return;
        }
        const { query, max_results, min_relevance_threshold } = parsed.data;
        const searchResponse = await searchEngine.search(userId, query, max_results, min_relevance_threshold);
        res.status(200).json({
            results: searchResponse.results,
            total_results: searchResponse.total,
            search_strategy: searchResponse.strategy,
        });
    }
    catch (err) {
        res.status(500).json({
            code: 500,
            status: 'INTERNAL_SERVER_ERROR',
            message: err.message || 'Search execution failed.',
        });
    }
});
