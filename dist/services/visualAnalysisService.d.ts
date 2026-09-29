/**
 * Visual Analysis Service (Cloud Vision / Gemini Vision)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.6
 */
export interface MediaVisualDetection {
    media_id: string;
    detected_objects: string[];
    scene_type: string;
    detected_text?: string[];
    confidence: number;
}
export declare class VisualAnalysisService {
    /**
     * Analyzes media items in a cluster and returns detected visual concepts
     */
    analyzeClusterMedia(mediaIds: string[]): Promise<MediaVisualDetection[]>;
}
export declare const visualAnalysisService: VisualAnalysisService;
