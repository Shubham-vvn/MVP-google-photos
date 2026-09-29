/**
 * Memory Creation Orchestrator (Saga Pipeline)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.2
 */

import { MemoryContext, UserInputPayload } from '../types/index.js';
import { clusterStore } from '../dal/clusterStore.js';
import { memoryStore } from '../dal/memoryStore.js';
import { nluService } from './nluService.js';
import { visualAnalysisService } from './visualAnalysisService.js';
import { memoryFusionEngine } from './memoryFusionEngine.js';

export class MemoryOrchestrator {
  /**
   * Executes the complete end-to-end memory creation pipeline
   */
  async processMemoryIngestion(
    userId: string,
    clusterId: string,
    userInput: UserInputPayload
  ): Promise<MemoryContext> {
    // 1. Validate Cluster
    const cluster = await clusterStore.findById(clusterId, userId);
    const mediaIds = cluster
      ? cluster.media_items.map((m) => m.media_id)
      : ['photo_default_01', 'photo_default_02'];

    // 2. Parallel Execution: NLU + Visual Analysis
    const [nluResult, visualResult] = await Promise.all([
      nluService.extractMemoryContext(userInput.raw_text),
      visualAnalysisService.analyzeClusterMedia(mediaIds),
    ]);

    // 3. Concept Fusion & Embedding Generation
    const memory = memoryFusionEngine.fuseMemory(
      userId,
      clusterId,
      userInput,
      nluResult,
      visualResult,
      mediaIds
    );

    // 4. Persist in Spanner Store
    await memoryStore.create(memory);

    // 5. Update Cluster Status to Completed
    if (cluster) {
      await clusterStore.updateStatus(clusterId, userId, 'completed', `MEMORY_SAVED_${memory.memory_id}`);
    }

    return memory;
  }
}

export const memoryOrchestrator = new MemoryOrchestrator();
