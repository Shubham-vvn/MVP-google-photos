/**
 * Memory Context Data Access Layer (Cloud Spanner DAL)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §4.1
 */
import { MemoryContext } from '../types/index.js';
declare class MemoryStore {
    private memories;
    constructor();
    /**
     * Seed initial scenarios for demo and testing
     */
    private seedInitialMemories;
    create(memory: MemoryContext): Promise<MemoryContext>;
    findById(memoryId: string, userId: string): Promise<MemoryContext | null>;
    listByUser(userId: string, pageSize?: number, pageToken?: string): Promise<{
        memories: MemoryContext[];
        nextPageToken?: string;
    }>;
    update(memoryId: string, userId: string, patch: Partial<MemoryContext>): Promise<MemoryContext | null>;
    delete(memoryId: string, userId: string, hardDelete?: boolean): Promise<boolean>;
    deleteAll(userId: string): Promise<number>;
}
export declare const memoryStore: MemoryStore;
export {};
