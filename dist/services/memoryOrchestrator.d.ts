/**
 * Memory Creation Orchestrator (Saga Pipeline)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.2
 */
import { MemoryContext, UserInputPayload } from '../types/index.js';
export declare class MemoryOrchestrator {
    /**
     * Executes the complete end-to-end memory creation pipeline
     */
    processMemoryIngestion(userId: string, clusterId: string, userInput: UserInputPayload): Promise<MemoryContext>;
}
export declare const memoryOrchestrator: MemoryOrchestrator;
