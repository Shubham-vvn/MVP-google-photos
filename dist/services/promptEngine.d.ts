/**
 * Intelligent Prompt Engine
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.4
 */
import { MemoryCluster, UserPreferences } from '../types/index.js';
export interface PromptDecision {
    shouldPrompt: boolean;
    reason: string;
    promptText?: string;
    suggestedAction?: 'speak' | 'write';
}
export declare class PromptEngine {
    /**
     * Evaluates whether a cluster is eligible to prompt the user
     */
    evaluatePromptEligibility(cluster: MemoryCluster, preferences: UserPreferences): PromptDecision;
}
export declare const promptEngine: PromptEngine;
