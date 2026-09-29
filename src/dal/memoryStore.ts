/**
 * Memory Context Data Access Layer (Cloud Spanner DAL)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §4.1
 */

import { MemoryContext, MemoryStatus } from '../types/index.js';
import { auditLogger } from '../services/auditLogger.js';

class MemoryStore {
  private memories: Map<string, MemoryContext> = new Map();

  constructor() {
    this.seedInitialMemories();
  }

  /**
   * Seed initial scenarios for demo and testing
   */
  private seedInitialMemories(): void {
    const defaultUserId = 'usr_google_default';

    const seed: MemoryContext = {
      user_id: defaultUserId,
      memory_id: 'mem_delhi_cafe_001',
      cluster_id: 'clust_delhi_001',
      status: 'active',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      updated_at: new Date().toISOString(),
      user_input: {
        raw_text: 'I met my friend Ramesh at a café in Delhi after two years. We talked about our childhood, had chocolate cake, and later walked towards Rajiv Chowk.',
        input_method: 'text',
        language: 'en',
      },
      extracted_context: {
        people: [
          { name: 'Ramesh', relationship: 'friend', source: 'user' },
        ],
        places: [
          { name: 'Delhi café', type: 'venue', source: 'user' },
          { name: 'Rajiv Chowk', type: 'city', source: 'user' },
        ],
        activities: [
          { label: 'Meeting a friend', source: 'user' },
          { label: 'Eating cake', source: 'user' },
          { label: 'Walking', source: 'user' },
        ],
        objects: [
          { label: 'Chocolate cake', source: 'user' },
          { label: 'Coffee cups', source: 'visual_inferred' },
        ],
        emotions: ['Joyful', 'Nostalgic', 'Warm'],
        purpose: 'Reunion catch-up after 2 years',
        visual_scene: ['Café interior', 'Outdoor colonnade street'],
      },
      summary: {
        short: 'Meeting Ramesh at a Delhi café — old friends, childhood memories, cake, and walking to Rajiv Chowk.',
        keywords: ['Ramesh', 'Delhi café', 'Childhood memories', 'Chocolate cake', 'Rajiv Chowk', 'Old friend'],
      },
      media_associations: [
        { media_id: 'photo_delhi_01', relevance: 0.98, specific_concepts: ['Ramesh', 'Café interior', 'Coffee cups'] },
        { media_id: 'photo_delhi_02', relevance: 0.96, specific_concepts: ['Chocolate cake', 'Dessert'] },
        { media_id: 'photo_delhi_03', relevance: 0.94, specific_concepts: ['Rajiv Chowk', 'Walking'] },
      ],
      privacy: {
        user_consented: true,
        ai_context_stored: true,
        source_labels_preserved: true,
      },
    };

    const goaSeed: MemoryContext = {
      user_id: defaultUserId,
      memory_id: 'mem_goa_beach_002',
      cluster_id: 'clust_goa_004',
      status: 'active',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      updated_at: new Date().toISOString(),
      user_input: {
        raw_text: 'Trip to Goa with Priya, Arjun, Sneha, and Rohan. We ran into the sunset waves at Anjuna beach, rented scooters, and later had grilled fish and fresh coconuts at a beach shack under fairy lights.',
        input_method: 'voice',
        language: 'en',
      },
      extracted_context: {
        people: [
          { name: 'Priya', relationship: 'friend', source: 'user' },
          { name: 'Arjun', relationship: 'friend', source: 'user' },
          { name: 'Sneha', relationship: 'friend', source: 'user' },
          { name: 'Rohan', relationship: 'friend', source: 'user' },
        ],
        places: [
          { name: 'Anjuna Beach', type: 'natural_landmark', source: 'user' },
          { name: 'North Goa', type: 'city', source: 'user' },
        ],
        activities: [
          { label: 'Running into waves', source: 'user' },
          { label: 'Scooter ride', source: 'user' },
          { label: 'Beach shack dinner', source: 'user' },
        ],
        objects: [
          { label: 'Grilled fish', source: 'user' },
          { label: 'Fresh coconuts', source: 'user' },
        ],
        emotions: ['Joyful', 'Nostalgic', 'Free-spirited'],
        purpose: 'College reunion vacation',
        visual_scene: ['Sunset beach waves', 'Beach shack dinner'],
      },
      summary: {
        short: 'Goa beach getaway with college friends Priya, Arjun, Sneha, and Rohan — sunset waves at Anjuna and candlelit shack dinner.',
        keywords: ['Priya', 'Arjun', 'Sneha', 'Rohan', 'Goa', 'Anjuna beach', 'Sunset waves', 'Beach shack'],
      },
      media_associations: [
        { media_id: 'photo_goa_01', relevance: 0.99, specific_concepts: ['Friends', 'Sunset waves', 'Anjuna'] },
        { media_id: 'photo_goa_02', relevance: 0.97, specific_concepts: ['Beach shack', 'Fairy lights', 'Dinner'] },
        { media_id: 'video_goa_01', relevance: 0.96, specific_concepts: ['Ocean waves slow-mo'] },
      ],
      privacy: {
        user_consented: true,
        ai_context_stored: true,
        source_labels_preserved: true,
      },
    };

    const birthdaySeed: MemoryContext = {
      user_id: defaultUserId,
      memory_id: 'mem_birthday_003',
      cluster_id: 'clust_birthday_005',
      status: 'active',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      updated_at: new Date().toISOString(),
      user_input: {
        raw_text: 'Celebrated Mom\'s 60th birthday with the whole family in Bangalore! Dad, Ananya, and the little grandkids surprised her with a mango cream cake and traditional marigold garlands.',
        input_method: 'text',
        language: 'en',
      },
      extracted_context: {
        people: [
          { name: 'Mom (Sunita)', relationship: 'mother', source: 'user' },
          { name: 'Dad', relationship: 'father', source: 'user' },
          { name: 'Ananya', relationship: 'sister', source: 'user' },
          { name: 'Grandkids', relationship: 'family', source: 'user' },
        ],
        places: [
          { name: 'Bangalore house', type: 'venue', source: 'user' },
          { name: 'Indiranagar', type: 'city', source: 'user' },
        ],
        activities: [
          { label: '60th Birthday surprise', source: 'user' },
          { label: 'Cake cutting', source: 'user' },
          { label: 'Garland blessing', source: 'user' },
        ],
        objects: [
          { label: 'Mango cream cake', source: 'user' },
          { label: 'Marigold garlands', source: 'user' },
        ],
        emotions: ['Heartwarming', 'Celebratory', 'Loving'],
        purpose: 'Family milestone celebration',
        visual_scene: ['Living room cake cutting', 'Three generations portrait'],
      },
      summary: {
        short: 'Mom\'s 60th birthday in Bangalore — surprise family party with Dad, Ananya, grandkids, marigold garlands, and birthday cake.',
        keywords: ['Mom', '60th birthday', 'Sunita', 'Dad', 'Ananya', 'Grandkids', 'Mango cake', 'Marigold garlands', 'Bangalore'],
      },
      media_associations: [
        { media_id: 'photo_birthday_01', relevance: 0.99, specific_concepts: ['Mom', 'Family', 'Birthday cake', 'Garlands'] },
        { media_id: 'photo_birthday_02', relevance: 0.97, specific_concepts: ['Cake close-up', 'Candles'] },
        { media_id: 'video_birthday_01', relevance: 0.96, specific_concepts: ['Grandkids singing happy birthday'] },
      ],
      privacy: {
        user_consented: true,
        ai_context_stored: true,
        source_labels_preserved: true,
      },
    };

    this.memories.set(seed.memory_id, seed);
    this.memories.set(goaSeed.memory_id, goaSeed);
    this.memories.set(birthdaySeed.memory_id, birthdaySeed);
  }

  async create(memory: MemoryContext): Promise<MemoryContext> {
    this.memories.set(memory.memory_id, memory);
    auditLogger.logEvent({
      action: 'MEMORY_CREATED',
      userId: memory.user_id,
      resourceId: memory.memory_id,
      timestamp: new Date().toISOString(),
      metadata: { cluster_id: memory.cluster_id, status: memory.status },
    });
    return memory;
  }

  async findById(memoryId: string, userId: string): Promise<MemoryContext | null> {
    const memory = this.memories.get(memoryId);
    if (!memory || memory.user_id !== userId || memory.status === 'tombstone') {
      return null;
    }
    return memory;
  }

  async listByUser(
    userId: string,
    pageSize: number = 20,
    pageToken?: string
  ): Promise<{ memories: MemoryContext[]; nextPageToken?: string }> {
    const all = Array.from(this.memories.values())
      .filter((m) => m.user_id === userId && m.status !== 'tombstone')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const startIndex = pageToken ? parseInt(Buffer.from(pageToken, 'base64').toString('utf-8'), 10) : 0;
    const items = all.slice(startIndex, startIndex + pageSize);
    const hasNext = startIndex + pageSize < all.length;
    const nextPageToken = hasNext ? Buffer.from(String(startIndex + pageSize)).toString('base64') : undefined;

    return { memories: items, nextPageToken };
  }

  async update(
    memoryId: string,
    userId: string,
    patch: Partial<MemoryContext>
  ): Promise<MemoryContext | null> {
    const existing = await this.findById(memoryId, userId);
    if (!existing) return null;

    const updated: MemoryContext = {
      ...existing,
      ...patch,
      updated_at: new Date().toISOString(),
    };

    this.memories.set(memoryId, updated);
    auditLogger.logEvent({
      action: 'MEMORY_UPDATED',
      userId,
      resourceId: memoryId,
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async delete(memoryId: string, userId: string, hardDelete: boolean = false): Promise<boolean> {
    const existing = await this.findById(memoryId, userId);
    if (!existing) return false;

    if (hardDelete) {
      this.memories.delete(memoryId);
    } else {
      existing.status = 'tombstone' as MemoryStatus;
      existing.updated_at = new Date().toISOString();
      this.memories.set(memoryId, existing);
    }

    auditLogger.logEvent({
      action: hardDelete ? 'MEMORY_HARD_DELETED' : 'MEMORY_SOFT_DELETED',
      userId,
      resourceId: memoryId,
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  async deleteAll(userId: string): Promise<number> {
    let count = 0;
    for (const [id, m] of this.memories.entries()) {
      if (m.user_id === userId) {
        this.memories.delete(id);
        count++;
      }
    }
    auditLogger.logEvent({
      action: 'ALL_USER_MEMORIES_PURGED',
      userId,
      resourceId: 'ALL',
      timestamp: new Date().toISOString(),
      metadata: { deletedCount: count },
    });
    return count;
  }
}

export const memoryStore = new MemoryStore();
