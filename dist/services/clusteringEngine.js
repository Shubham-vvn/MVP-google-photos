/**
 * Memory Clustering Engine (Temporal & Geospatial Grouping)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.3
 */
export class ClusteringEngine {
    TEMPORAL_GAP_MS = 2 * 60 * 60 * 1000; // 2 hours
    GEO_PROXIMITY_KM = 0.5; // 500 meters
    /**
     * Distance between two GPS points using Haversine formula
     */
    haversineDistanceKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    /**
     * Calculates memory-worthiness quality score (0.0 to 1.0)
     */
    computeQualityScore(items) {
        if (items.length < 3)
            return 0.2;
        let score = 0.5;
        // Count bonus
        if (items.length >= 8)
            score += 0.2;
        // Mix bonus (photos + videos)
        const hasPhoto = items.some((i) => i.type === 'photo');
        const hasVideo = items.some((i) => i.type === 'video');
        if (hasPhoto && hasVideo)
            score += 0.15;
        // Location present
        if (items.some((i) => i.gps))
            score += 0.15;
        return Math.min(0.99, Math.round(score * 100) / 100);
    }
    /**
     * Clusters a stream of raw media items into meaningful memory clusters
     */
    clusterMedia(userId, rawItems) {
        if (rawItems.length === 0)
            return [];
        // Sort by capture timestamp ascending
        const sorted = [...rawItems].sort((a, b) => new Date(a.captured_at).getTime() - new Date(b.captured_at).getTime());
        const clusters = [];
        let currentCluster = [sorted[0]];
        for (let i = 1; i < sorted.length; i++) {
            const prev = sorted[i - 1];
            const curr = sorted[i];
            const timeDiff = new Date(curr.captured_at).getTime() - new Date(prev.captured_at).getTime();
            let isSameCluster = timeDiff <= this.TEMPORAL_GAP_MS;
            // Geospatial check if GPS available
            if (isSameCluster && prev.gps && curr.gps) {
                const dist = this.haversineDistanceKm(prev.gps.lat, prev.gps.lng, curr.gps.lat, curr.gps.lng);
                if (dist > this.GEO_PROXIMITY_KM) {
                    isSameCluster = false;
                }
            }
            if (isSameCluster) {
                currentCluster.push(curr);
            }
            else {
                clusters.push(currentCluster);
                currentCluster = [curr];
            }
        }
        clusters.push(currentCluster);
        // Filter and transform into MemoryCluster objects
        return clusters
            .filter((group) => group.length >= 2)
            .map((group, idx) => {
            const start = group[0].captured_at;
            const end = group[group.length - 1].captured_at;
            const photosCount = group.filter((i) => i.type === 'photo').length;
            const videosCount = group.filter((i) => i.type === 'video').length;
            const qualityScore = this.computeQualityScore(group);
            const mediaItems = group.map((i) => ({
                media_id: i.media_id,
                type: i.type,
                captured_at: i.captured_at,
                duration_s: i.type === 'video' ? 30 : undefined,
            }));
            const loc = group.find((i) => i.gps)?.gps;
            const locLabel = group.find((i) => i.locality)?.locality || 'Outing';
            return {
                user_id: userId,
                cluster_id: `clust_${Date.now()}_${idx}`,
                status: 'pending_prompt',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                media_items: mediaItems,
                clustering_metadata: {
                    time_span: { start, end },
                    location: loc ? { lat: loc.lat, lng: loc.lng, locality: locLabel } : undefined,
                    media_count: { photos: photosCount, videos: videosCount },
                    quality_score: qualityScore,
                },
                prompt_history: [],
            };
        });
    }
}
export const clusteringEngine = new ClusteringEngine();
