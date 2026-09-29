/**
 * NLU Extraction Service (Gemini NLU Wrapper)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.5
 */
import { ExtractedEntityContext, MemorySummary } from '../types/index.js';
export declare class NLUService {
    /**
     * Transforms raw natural-language user memory text into structured context
     */
    extractMemoryContext(userText: string): Promise<{
        extracted: ExtractedEntityContext;
        summary: MemorySummary;
    }>;
}
export declare const nluService: NLUService;
