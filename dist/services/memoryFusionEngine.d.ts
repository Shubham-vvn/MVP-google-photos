/**
 * Memory Fusion Engine
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.6
 */
import { ExtractedEntityContext, MemoryContext, MemorySummary, UserInputPayload } from '../types/index.js';
import { MediaVisualDetection } from './visualAnalysisService.js';
export declare class MemoryFusionEngine {
    /**
     * Fuses User NLU output with Visual detections and cluster metadata
     */
    fuseMemory(userId: string, clusterId: string, userInput: UserInputPayload, nluContext: {
        extracted: ExtractedEntityContext;
        summary: MemorySummary;
    }, visualDetections: MediaVisualDetection[], mediaIds: string[]): MemoryContext;
}
export declare const memoryFusionEngine: MemoryFusionEngine;
