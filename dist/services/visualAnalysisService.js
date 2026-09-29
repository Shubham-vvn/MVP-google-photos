/**
 * Visual Analysis Service (Cloud Vision / Gemini Vision)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.6
 */
export class VisualAnalysisService {
    /**
     * Analyzes media items in a cluster and returns detected visual concepts
     */
    async analyzeClusterMedia(mediaIds) {
        return mediaIds.map((id) => {
            if (id.includes('delhi') || id.includes('cafe')) {
                return {
                    media_id: id,
                    detected_objects: ['Coffee cups', 'Chocolate cake', 'Ceramic plate', '2 people outdoors'],
                    scene_type: 'Café interior & outdoor colonnade',
                    confidence: 0.96,
                };
            }
            else if (id.includes('laptop') || id.includes('screen')) {
                return {
                    media_id: id,
                    detected_objects: ['Dual laptop screens', 'Benchmark charts', 'Keyboard & trackpad'],
                    scene_type: 'Office desk setup',
                    detected_text: ['Core Ultra', 'M3 Chip Benchmarks', 'RAM', 'Specs Comparison'],
                    confidence: 0.98,
                };
            }
            else {
                return {
                    media_id: id,
                    detected_objects: ['Turquoise bay', 'Pine trees', 'Mountain ridge', 'Hiking path'],
                    scene_type: 'Outdoor natural landmark',
                    confidence: 0.95,
                };
            }
        });
    }
}
export const visualAnalysisService = new VisualAnalysisService();
