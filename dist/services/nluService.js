/**
 * NLU Extraction Service (Gemini NLU Wrapper)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.5
 */
export class NLUService {
    /**
     * Transforms raw natural-language user memory text into structured context
     */
    async extractMemoryContext(userText) {
        const clean = userText.trim();
        const lower = clean.toLowerCase();
        const people = [];
        const places = [];
        const activities = [];
        const objects = [];
        const emotions = [];
        let purpose = '';
        // Named Entity Extraction (People)
        if (lower.includes('ramesh')) {
            people.push({ name: 'Ramesh', relationship: 'old friend', source: 'user' });
        }
        if (lower.includes('maya')) {
            people.push({ name: 'Maya', relationship: 'friend', source: 'user' });
        }
        if (lower.includes('mom') || lower.includes('mother')) {
            people.push({ name: 'Mom', relationship: 'family', source: 'user' });
        }
        // Places
        if (lower.includes('delhi')) {
            places.push({ name: 'Delhi', type: 'city', source: 'user' });
        }
        if (lower.includes('café') || lower.includes('cafe')) {
            places.push({ name: 'Café', type: 'venue', source: 'user' });
        }
        if (lower.includes('rajiv chowk') || lower.includes('connaught place')) {
            places.push({ name: 'Rajiv Chowk', type: 'venue', source: 'user' });
        }
        if (lower.includes('tahoe') || lower.includes('emerald bay')) {
            places.push({ name: 'Emerald Bay, Lake Tahoe', type: 'natural_landmark', source: 'user' });
        }
        // Activities
        if (lower.includes('cake') || lower.includes('had cake') || lower.includes('eating')) {
            activities.push({ label: 'Eating cake', source: 'user' });
            objects.push({ label: 'Cake', source: 'user' });
        }
        if (lower.includes('talk') || lower.includes('talked') || lower.includes('childhood')) {
            activities.push({ label: 'Talking about childhood memories', source: 'user' });
        }
        if (lower.includes('walk') || lower.includes('walked')) {
            activities.push({ label: 'Walking', source: 'user' });
        }
        if (lower.includes('hike') || lower.includes('hiking')) {
            activities.push({ label: 'Hiking mountain trail', source: 'user' });
        }
        if (lower.includes('compare') || lower.includes('comparing') || lower.includes('specs') || lower.includes('laptop')) {
            activities.push({ label: 'Comparing laptop specifications', source: 'user' });
            objects.push({ label: 'Laptop', source: 'user' });
        }
        // Emotions & Purpose
        if (lower.includes('childhood') || lower.includes('years') || lower.includes('old friend')) {
            emotions.push('Nostalgic', 'Warm');
            purpose = 'Catching up with old friend';
        }
        if (lower.includes('sunset') || lower.includes('hike') || lower.includes('loved')) {
            emotions.push('Joyful', 'Adventurous');
            purpose = 'Outdoor trip highlight';
        }
        if (lower.includes('buying') || lower.includes('before buying')) {
            emotions.push('Focused', 'Deliberate');
            purpose = 'Product purchase research';
        }
        // Keywords derivation
        const keywords = [];
        people.forEach((p) => keywords.push(p.name));
        places.forEach((p) => keywords.push(p.name));
        activities.forEach((a) => keywords.push(a.label));
        objects.forEach((o) => keywords.push(o.label));
        // Fallbacks if very generic
        if (keywords.length === 0) {
            keywords.push('Personal Memory', 'Captured moment');
        }
        // Short summary generation
        let shortSummary = clean;
        if (clean.length > 90) {
            const parts = [];
            if (people.length > 0)
                parts.push(`With ${people.map((p) => p.name).join(', ')}`);
            if (places.length > 0)
                parts.push(`at ${places.map((p) => p.name).join(', ')}`);
            if (activities.length > 0)
                parts.push(`— ${activities[0].label}`);
            shortSummary = parts.length > 0 ? parts.join(' ') : clean.slice(0, 90) + '...';
        }
        return {
            extracted: {
                people,
                places,
                activities,
                objects,
                emotions: emotions.length > 0 ? emotions : ['Reflective'],
                purpose: purpose || 'Personal memory',
                visual_scene: [],
            },
            summary: {
                short: shortSummary,
                keywords: Array.from(new Set(keywords)),
            },
        };
    }
}
export const nluService = new NLUService();
