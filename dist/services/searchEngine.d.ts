/**
 * Multimodal Hybrid Search Engine (Vector + Inverted Index + Score Fusion)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.7
 */
export interface SearchResult {
    media_id: string;
    relevance_score: number;
    media_url: string;
    thumbnail_url?: string;
    matched_memory?: {
        memory_id: string;
        summary: string;
        matched_concepts: string[];
    };
    visual_confidence: number;
    semantic_confidence: number;
}
export declare class SearchEngine {
    /**
     * Executes hybrid search over memories and returns ranked photo items
     */
    search(userId: string, query: string, maxResults?: number, minThreshold?: number): Promise<{
        results: SearchResult[];
        total: number;
        strategy: string;
    }>;
}
export declare const searchEngine: SearchEngine;
