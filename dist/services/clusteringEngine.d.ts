/**
 * Memory Clustering Engine (Temporal & Geospatial Grouping)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.3
 */
import { MemoryCluster } from '../types/index.js';
export interface RawMediaItem {
    media_id: string;
    type: 'photo' | 'video';
    captured_at: string;
    gps?: {
        lat: number;
        lng: number;
    };
    locality?: string;
    is_screenshot?: boolean;
}
export declare class ClusteringEngine {
    private readonly TEMPORAL_GAP_MS;
    private readonly GEO_PROXIMITY_KM;
    /**
     * Distance between two GPS points using Haversine formula
     */
    private haversineDistanceKm;
    /**
     * Calculates memory-worthiness quality score (0.0 to 1.0)
     */
    private computeQualityScore;
    /**
     * Clusters a stream of raw media items into meaningful memory clusters
     */
    clusterMedia(userId: string, rawItems: RawMediaItem[]): MemoryCluster[];
}
export declare const clusteringEngine: ClusteringEngine;
