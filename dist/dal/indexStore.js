/**
 * Semantic Vector Index & Inverted Keyword Index Store
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.7, §4.3
 */
class IndexStore {
    vectorIndex = new Map();
    keywordInvertedIndex = new Map();
    constructor() {
        this.seedIndex();
    }
    /**
     * Generates a deterministic normalized 768-dim pseudo-embedding from text
     */
    generateEmbedding(text) {
        const dim = 768;
        const vec = new Array(dim).fill(0);
        const clean = text.toLowerCase().trim();
        for (let i = 0; i < clean.length; i++) {
            const charCode = clean.charCodeAt(i);
            const targetDim = (charCode * 31 + i * 17) % dim;
            vec[targetDim] += 1.0;
        }
        // L2 Normalize
        let norm = 0;
        for (let i = 0; i < dim; i++)
            norm += vec[i] * vec[i];
        norm = Math.sqrt(norm) || 1;
        for (let i = 0; i < dim; i++)
            vec[i] /= norm;
        return vec;
    }
    /**
     * Computes cosine similarity between two unit vectors
     */
    cosineSimilarity(v1, v2) {
        let dot = 0;
        const len = Math.min(v1.length, v2.length);
        for (let i = 0; i < len; i++) {
            dot += v1[i] * v2[i];
        }
        return Math.max(0, Math.min(1, dot));
    }
    seedIndex() {
        const defaultUserId = 'usr_google_default';
        const text = 'Ramesh Delhi café childhood memories chocolate cake Rajiv Chowk old friend';
        const vec = this.generateEmbedding(text);
        const keywords = ['ramesh', 'delhi', 'cafe', 'café', 'childhood', 'memories', 'cake', 'chocolate', 'rajiv', 'chowk', 'friend'];
        this.upsert({
            memory_id: 'mem_delhi_cafe_001',
            user_id: defaultUserId,
            vector: vec,
            keywords,
            concepts: ['Ramesh', 'Delhi café', 'Childhood memories', 'Chocolate cake', 'Rajiv Chowk'],
            media_ids: ['photo_delhi_01', 'photo_delhi_02', 'photo_delhi_03'],
            created_at: new Date(Date.now() - 7200000).toISOString(),
            summary: 'Meeting Ramesh at a Delhi café — old friends, childhood memories, cake, and walking to Rajiv Chowk.',
        });
        const goaText = 'Goa beach Priya Arjun Sneha Rohan sunset waves Anjuna shack dinner fresh coconuts grilled seafood';
        this.upsert({
            memory_id: 'mem_goa_beach_002',
            user_id: defaultUserId,
            vector: this.generateEmbedding(goaText),
            keywords: ['goa', 'beach', 'sunset', 'waves', 'priya', 'arjun', 'sneha', 'rohan', 'anjuna', 'shack', 'coconuts', 'friends'],
            concepts: ['Goa beach trip', 'Priya', 'Arjun', 'Sneha', 'Rohan', 'Sunset waves', 'Anjuna beach', 'Beach shack dinner'],
            media_ids: ['photo_goa_01', 'photo_goa_02', 'video_goa_01'],
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            summary: 'Goa beach getaway with college friends Priya, Arjun, Sneha, and Rohan — sunset waves at Anjuna and candlelit shack dinner.',
        });
        const birthdayText = 'Mom 60th birthday Sunita Dad Ananya grandkids family celebration mango cake marigold garlands Bangalore';
        this.upsert({
            memory_id: 'mem_birthday_003',
            user_id: defaultUserId,
            vector: this.generateEmbedding(birthdayText),
            keywords: ['mom', 'birthday', '60th', 'sunita', 'dad', 'ananya', 'grandkids', 'cake', 'marigold', 'bangalore', 'family'],
            concepts: ['Mom\'s 60th birthday', 'Sunita', 'Dad', 'Ananya', 'Grandkids', 'Family celebration', 'Mango cake', 'Marigold garlands'],
            media_ids: ['photo_birthday_01', 'photo_birthday_02', 'video_birthday_01'],
            created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
            summary: 'Mom\'s 60th birthday in Bangalore — surprise family party with Dad, Ananya, grandkids, marigold garlands, and birthday cake.',
        });
    }
    upsert(item) {
        this.vectorIndex.set(item.memory_id, item);
        // Update Inverted Keyword Index
        for (const kw of item.keywords) {
            const normalized = kw.toLowerCase().trim();
            if (!this.keywordInvertedIndex.has(normalized)) {
                this.keywordInvertedIndex.set(normalized, new Set());
            }
            this.keywordInvertedIndex.get(normalized).add(item.memory_id);
        }
    }
    remove(memoryId) {
        const existing = this.vectorIndex.get(memoryId);
        if (!existing)
            return;
        for (const kw of existing.keywords) {
            const set = this.keywordInvertedIndex.get(kw.toLowerCase().trim());
            if (set) {
                set.delete(memoryId);
            }
        }
        this.vectorIndex.delete(memoryId);
    }
    /**
     * Hybrid Vector + Inverted Keyword Search
     */
    search(userId, query, queryVec, limit = 20) {
        const stopWords = new Set(['with', 'having', 'about', 'and', 'the', 'for', 'from', 'our', 'later', 'that', 'were', 'when', 'what', 'where']);
        const queryTokens = query
            .toLowerCase()
            .split(/\s+/)
            .filter((t) => t.length > 1 && !stopWords.has(t));
        const candidates = Array.from(this.vectorIndex.values()).filter((m) => m.user_id === userId);
        const scored = candidates.map((cand) => {
            // 1. Vector cosine similarity (55% weight)
            const vectorScore = this.cosineSimilarity(queryVec, cand.vector);
            // 2. Keyword exact / token overlap score (45% weight)
            const matched = [];
            let tokenHits = 0;
            for (const tok of queryTokens) {
                const hasKeyword = cand.keywords.some((kw) => kw.includes(tok));
                const hasConcept = cand.concepts.some((cp) => cp.toLowerCase().includes(tok));
                if (hasKeyword || hasConcept) {
                    tokenHits++;
                    matched.push(tok);
                }
            }
            const keywordScore = queryTokens.length > 0 ? tokenHits / queryTokens.length : 0;
            // Fused hybrid score
            const hybridScore = 0.45 * vectorScore + 0.55 * keywordScore;
            return {
                item: cand,
                score: hybridScore,
                matchedConcepts: Array.from(new Set(matched)),
            };
        });
        return scored
            .filter((res) => res.score > 0.15)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
}
export const indexStore = new IndexStore();
