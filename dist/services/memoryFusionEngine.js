/**
 * Memory Fusion Engine
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.6
 */
import { indexStore } from '../dal/indexStore.js';
export class MemoryFusionEngine {
    /**
     * Fuses User NLU output with Visual detections and cluster metadata
     */
    fuseMemory(userId, clusterId, userInput, nluContext, visualDetections, mediaIds) {
        const memoryId = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        // 1. Concept Alignment & Priority Merging:
        // P0: User concepts are canonical
        // P1: Visual signals enrich objects and visual_scene
        const visualObjects = [];
        const visualScenes = [];
        visualDetections.forEach((det) => {
            visualScenes.push(det.scene_type);
            det.detected_objects.forEach((obj) => {
                // Only add if not already in user objects
                const alreadyInUser = nluContext.extracted.objects.some((o) => o.label.toLowerCase() === obj.toLowerCase());
                if (!alreadyInUser) {
                    visualObjects.push({ label: obj, source: 'visual_inferred' });
                }
            });
        });
        const mergedContext = {
            people: nluContext.extracted.people,
            places: nluContext.extracted.places,
            activities: nluContext.extracted.activities,
            objects: [...nluContext.extracted.objects, ...visualObjects.slice(0, 4)],
            emotions: nluContext.extracted.emotions,
            purpose: nluContext.extracted.purpose,
            visual_scene: Array.from(new Set(visualScenes)),
        };
        // 2. Per-media Association Relevance Scoring
        const mediaAssociations = mediaIds.map((id, index) => {
            const visual = visualDetections.find((v) => v.media_id === id);
            const score = visual ? visual.confidence : 0.85;
            return {
                media_id: id,
                relevance: Math.max(0.7, score - index * 0.03),
                specific_concepts: visual ? visual.detected_objects.slice(0, 3) : ['Captured Moment'],
            };
        });
        // 3. Generate 768-dim Embedding
        const textForEmbedding = [
            userInput.raw_text,
            ...nluContext.summary.keywords,
            ...(mergedContext.visual_scene || []),
        ].join(' ');
        const vec = indexStore.generateEmbedding(textForEmbedding);
        // 4. Index in Vector & Keyword Store
        indexStore.upsert({
            memory_id: memoryId,
            user_id: userId,
            vector: vec,
            keywords: nluContext.summary.keywords,
            concepts: [
                ...mergedContext.people.map((p) => p.name),
                ...mergedContext.places.map((p) => p.name),
                ...mergedContext.activities.map((a) => a.label),
            ],
            media_ids: mediaIds,
            created_at: new Date().toISOString(),
            summary: nluContext.summary.short,
        });
        return {
            user_id: userId,
            memory_id: memoryId,
            cluster_id: clusterId,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_input: userInput,
            extracted_context: mergedContext,
            summary: nluContext.summary,
            media_associations: mediaAssociations,
            privacy: {
                user_consented: true,
                ai_context_stored: true,
                source_labels_preserved: true,
            },
            embedding_model: 'text-embedding-005',
        };
    }
}
export const memoryFusionEngine = new MemoryFusionEngine();
