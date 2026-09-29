/**
 * Semantic Vector Index & Inverted Keyword Index Store
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.7, §4.3
 */
export interface IndexedMemory {
    memory_id: string;
    user_id: string;
    vector: number[];
    keywords: string[];
    concepts: string[];
    media_ids: string[];
    created_at: string;
    summary: string;
}
declare class IndexStore {
    private vectorIndex;
    private keywordInvertedIndex;
    constructor();
    /**
     * Generates a deterministic normalized 768-dim pseudo-embedding from text
     */
    generateEmbedding(text: string): number[];
    /**
     * Computes cosine similarity between two unit vectors
     */
    cosineSimilarity(v1: number[], v2: number[]): number;
    private seedIndex;
    upsert(item: IndexedMemory): void;
    remove(memoryId: string): void;
    /**
     * Hybrid Vector + Inverted Keyword Search
     */
    search(userId: string, query: string, queryVec: number[], limit?: number): Array<{
        item: IndexedMemory;
        score: number;
        matchedConcepts: string[];
    }>;
}
export declare const indexStore: IndexStore;
export {};
