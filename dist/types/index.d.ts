/**
 * Core Data Models & Type Definitions
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §4.1 - §4.4
 */
export type MemoryStatus = 'processing' | 'active' | 'archived' | 'tombstone';
export type ClusterStatus = 'pending_prompt' | 'prompted' | 'dismissed' | 'completed';
export type InputMethod = 'voice' | 'text';
export interface UserInputPayload {
    raw_text: string;
    input_method: InputMethod;
    language?: string;
    text_from_stt?: boolean;
}
export interface ExtractedPerson {
    name: string;
    relationship?: string;
    source: 'user' | 'visual_inferred';
}
export interface ExtractedPlace {
    name: string;
    type?: 'city' | 'venue' | 'country' | 'natural_landmark';
    source: 'user' | 'visual_inferred';
}
export interface ExtractedEntityContext {
    people: ExtractedPerson[];
    places: ExtractedPlace[];
    activities: Array<{
        label: string;
        source: 'user' | 'visual_inferred';
    }>;
    objects: Array<{
        label: string;
        source: 'user' | 'visual_inferred';
    }>;
    emotions: string[];
    purpose?: string;
    visual_scene?: string[];
}
export interface MemorySummary {
    short: string;
    keywords: string[];
}
export interface MediaAssociation {
    media_id: string;
    relevance: number;
    specific_concepts: string[];
}
export interface MemoryPrivacyPolicy {
    user_consented: boolean;
    ai_context_stored: boolean;
    source_labels_preserved: boolean;
}
export interface MemoryContext {
    user_id: string;
    memory_id: string;
    cluster_id: string;
    status: MemoryStatus;
    created_at: string;
    updated_at: string;
    user_input: UserInputPayload;
    extracted_context: ExtractedEntityContext;
    summary: MemorySummary;
    media_associations: MediaAssociation[];
    privacy: MemoryPrivacyPolicy;
    embedding_model?: string;
}
export interface MediaClusterItem {
    media_id: string;
    type: 'photo' | 'video';
    captured_at: string;
    duration_s?: number;
}
export interface MemoryCluster {
    user_id: string;
    cluster_id: string;
    status: ClusterStatus;
    created_at: string;
    updated_at: string;
    media_items: MediaClusterItem[];
    clustering_metadata: {
        time_span: {
            start: string;
            end: string;
        };
        location?: {
            lat: number;
            lng: number;
            locality: string;
        };
        media_count: {
            photos: number;
            videos: number;
        };
        quality_score: number;
    };
    prompt_history: Array<{
        prompted_at: string;
        action: string;
        memory_id?: string;
    }>;
}
export interface UserPreferences {
    user_id: string;
    updated_at: string;
    memory_prompts_enabled: boolean;
    voice_transcription_enabled: boolean;
    sensitive_detection_enabled: boolean;
    max_prompts_per_week: number;
    cooldown_days: number;
}
export interface SearchQueryRequest {
    query: string;
    max_results?: number;
    min_relevance_threshold?: number;
    include_memory_context?: boolean;
}
export interface SearchResultItem {
    media_id: string;
    relevance_score: number;
    media_url: string;
    thumbnail_url?: string;
    matched_memory?: {
        memory_id: string;
        summary: string;
        matched_concepts: string[];
    };
}
