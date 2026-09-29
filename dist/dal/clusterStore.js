/**
 * Memory Cluster Data Access Layer (Cloud Spanner DAL)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §4.2
 */
import { auditLogger } from '../services/auditLogger.js';
class ClusterStore {
    clusters = new Map();
    dismissals = new Map();
    constructor() {
        this.seedInitialClusters();
    }
    seedInitialClusters() {
        const defaultUserId = 'usr_google_default';
        const clusters = [
            {
                user_id: defaultUserId,
                cluster_id: 'clust_delhi_001',
                status: 'pending_prompt',
                created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
                updated_at: new Date().toISOString(),
                media_items: [
                    { media_id: 'photo_delhi_01', type: 'photo', captured_at: '2026-10-14T14:32:00Z' },
                    { media_id: 'photo_delhi_02', type: 'photo', captured_at: '2026-10-14T14:45:00Z' },
                    { media_id: 'photo_delhi_03', type: 'photo', captured_at: '2026-10-14T15:15:00Z' },
                    { media_id: 'video_delhi_01', type: 'video', captured_at: '2026-10-14T15:20:00Z', duration_s: 42 },
                ],
                clustering_metadata: {
                    time_span: {
                        start: '2026-10-14T14:30:00Z',
                        end: '2026-10-14T15:30:00Z',
                    },
                    location: { lat: 28.6315, lng: 77.2167, locality: 'Connaught Place, New Delhi' },
                    media_count: { photos: 10, videos: 3 },
                    quality_score: 0.92,
                },
                prompt_history: [],
            },
            {
                user_id: defaultUserId,
                cluster_id: 'clust_laptop_002',
                status: 'pending_prompt',
                created_at: new Date(Date.now() - 86400000).toISOString(),
                updated_at: new Date().toISOString(),
                media_items: [
                    { media_id: 'screen_laptop_01', type: 'photo', captured_at: '2026-10-13T18:10:00Z' },
                    { media_id: 'screen_laptop_02', type: 'photo', captured_at: '2026-10-13T18:14:00Z' },
                    { media_id: 'screen_laptop_03', type: 'photo', captured_at: '2026-10-13T18:22:00Z' },
                ],
                clustering_metadata: {
                    time_span: {
                        start: '2026-10-13T18:00:00Z',
                        end: '2026-10-13T18:30:00Z',
                    },
                    location: { lat: 0, lng: 0, locality: 'Saved Screenshots' },
                    media_count: { photos: 8, videos: 0 },
                    quality_score: 0.81,
                },
                prompt_history: [],
            },
            {
                user_id: defaultUserId,
                cluster_id: 'clust_tahoe_003',
                status: 'pending_prompt',
                created_at: new Date(Date.now() - 86400000 * 73).toISOString(),
                updated_at: new Date().toISOString(),
                media_items: [
                    { media_id: 'photo_tahoe_01', type: 'photo', captured_at: '2026-07-15T17:30:00Z' },
                    { media_id: 'photo_tahoe_02', type: 'photo', captured_at: '2026-07-15T18:45:00Z' },
                ],
                clustering_metadata: {
                    time_span: {
                        start: '2026-07-15T15:00:00Z',
                        end: '2026-07-15T20:00:00Z',
                    },
                    location: { lat: 38.9536, lng: -120.1005, locality: 'Emerald Bay, Lake Tahoe' },
                    media_count: { photos: 24, videos: 2 },
                    quality_score: 0.96,
                },
                prompt_history: [],
            },
            {
                user_id: defaultUserId,
                cluster_id: 'clust_goa_004',
                status: 'pending_prompt',
                created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
                updated_at: new Date().toISOString(),
                media_items: [
                    { media_id: 'photo_goa_01', type: 'photo', captured_at: '2026-10-18T17:45:00Z' },
                    { media_id: 'photo_goa_02', type: 'photo', captured_at: '2026-10-18T18:15:00Z' },
                    { media_id: 'video_goa_01', type: 'video', captured_at: '2026-10-18T18:30:00Z', duration_s: 48 },
                    { media_id: 'video_goa_02', type: 'video', captured_at: '2026-10-18T20:10:00Z', duration_s: 84 },
                ],
                clustering_metadata: {
                    time_span: {
                        start: '2026-10-18T17:30:00Z',
                        end: '2026-10-18T21:00:00Z',
                    },
                    location: { lat: 15.5802, lng: 73.7423, locality: 'Anjuna Beach, North Goa' },
                    media_count: { photos: 18, videos: 4 },
                    quality_score: 0.98,
                },
                prompt_history: [],
            },
            {
                user_id: defaultUserId,
                cluster_id: 'clust_birthday_005',
                status: 'pending_prompt',
                created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
                updated_at: new Date().toISOString(),
                media_items: [
                    { media_id: 'photo_birthday_01', type: 'photo', captured_at: '2026-10-19T13:15:00Z' },
                    { media_id: 'photo_birthday_02', type: 'photo', captured_at: '2026-10-19T13:30:00Z' },
                    { media_id: 'video_birthday_01', type: 'video', captured_at: '2026-10-19T13:35:00Z', duration_s: 38 },
                ],
                clustering_metadata: {
                    time_span: {
                        start: '2026-10-19T13:00:00Z',
                        end: '2026-10-19T15:30:00Z',
                    },
                    location: { lat: 12.9784, lng: 77.6408, locality: 'Indiranagar, Bangalore' },
                    media_count: { photos: 16, videos: 3 },
                    quality_score: 0.97,
                },
                prompt_history: [],
            },
            {
                user_id: defaultUserId,
                cluster_id: 'clust_himalaya_006',
                status: 'pending_prompt',
                created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
                updated_at: new Date().toISOString(),
                media_items: [
                    { media_id: 'photo_himalaya_01', type: 'photo', captured_at: '2026-09-20T11:20:00Z' },
                    { media_id: 'photo_himalaya_02', type: 'photo', captured_at: '2026-09-20T12:05:00Z' },
                    { media_id: 'video_himalaya_01', type: 'video', captured_at: '2026-09-20T12:30:00Z', duration_s: 54 },
                    { media_id: 'video_himalaya_02', type: 'video', captured_at: '2026-09-20T14:15:00Z', duration_s: 105 },
                ],
                clustering_metadata: {
                    time_span: {
                        start: '2026-09-20T10:00:00Z',
                        end: '2026-09-20T16:00:00Z',
                    },
                    location: { lat: 32.3716, lng: 77.2466, locality: 'Rohtang Pass (13,050 ft), Himachal Pradesh' },
                    media_count: { photos: 22, videos: 5 },
                    quality_score: 0.99,
                },
                prompt_history: [],
            },
            {
                user_id: defaultUserId,
                cluster_id: 'clust_diwali_007',
                status: 'pending_prompt',
                created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
                updated_at: new Date().toISOString(),
                media_items: [
                    { media_id: 'photo_diwali_01', type: 'photo', captured_at: '2026-11-01T20:45:00Z' },
                    { media_id: 'video_diwali_01', type: 'video', captured_at: '2026-11-01T21:00:00Z', duration_s: 32 },
                    { media_id: 'photo_diwali_02', type: 'photo', captured_at: '2026-11-01T21:20:00Z' },
                ],
                clustering_metadata: {
                    time_span: {
                        start: '2026-11-01T20:00:00Z',
                        end: '2026-11-01T23:00:00Z',
                    },
                    location: { lat: 28.5355, lng: 77.2410, locality: 'South Delhi Rooftop' },
                    media_count: { photos: 15, videos: 4 },
                    quality_score: 0.96,
                },
                prompt_history: [],
            },
            {
                user_id: defaultUserId,
                cluster_id: 'clust_cycling_008',
                status: 'pending_prompt',
                created_at: new Date(Date.now() - 86400000 * 18).toISOString(),
                updated_at: new Date().toISOString(),
                media_items: [
                    { media_id: 'photo_cycling_01', type: 'photo', captured_at: '2026-10-04T06:45:00Z' },
                    { media_id: 'video_cycling_01', type: 'video', captured_at: '2026-10-04T07:15:00Z', duration_s: 64 },
                    { media_id: 'photo_cycling_02', type: 'photo', captured_at: '2026-10-04T08:00:00Z' },
                ],
                clustering_metadata: {
                    time_span: {
                        start: '2026-10-04T06:30:00Z',
                        end: '2026-10-04T08:30:00Z',
                    },
                    location: { lat: 12.9763, lng: 77.5929, locality: 'Cubbon Park, Bangalore' },
                    media_count: { photos: 12, videos: 2 },
                    quality_score: 0.95,
                },
                prompt_history: [],
            },
        ];
        clusters.forEach((c) => this.clusters.set(c.cluster_id, c));
    }
    async create(cluster) {
        this.clusters.set(cluster.cluster_id, cluster);
        return cluster;
    }
    async findById(clusterId, userId) {
        const cluster = this.clusters.get(clusterId);
        if (!cluster || cluster.user_id !== userId)
            return null;
        return cluster;
    }
    async list(userId, statusFilter, pageSize = 10, pageToken) {
        const all = Array.from(this.clusters.values())
            .filter((c) => {
            if (c.user_id !== userId)
                return false;
            if (statusFilter && c.status !== statusFilter)
                return false;
            // Check cooldown dismissal filter
            const dismissalKey = `${userId}:${c.cluster_id}`;
            const dismissal = this.dismissals.get(dismissalKey);
            if (dismissal) {
                const cooldownExpiry = dismissal.dismissedAt + dismissal.cooldownDays * 86400000;
                if (Date.now() < cooldownExpiry)
                    return false;
            }
            return true;
        })
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const startIndex = pageToken ? parseInt(Buffer.from(pageToken, 'base64').toString('utf-8'), 10) : 0;
        const items = all.slice(startIndex, startIndex + pageSize);
        const hasNext = startIndex + pageSize < all.length;
        const nextPageToken = hasNext ? Buffer.from(String(startIndex + pageSize)).toString('base64') : undefined;
        return { clusters: items, nextPageToken };
    }
    async updateStatus(clusterId, userId, status, actionLog) {
        const cluster = await this.findById(clusterId, userId);
        if (!cluster)
            return null;
        cluster.status = status;
        cluster.updated_at = new Date().toISOString();
        if (actionLog) {
            cluster.prompt_history.push({
                prompted_at: new Date().toISOString(),
                action: actionLog,
            });
        }
        this.clusters.set(clusterId, cluster);
        return cluster;
    }
    async recordDismissal(clusterId, userId, reason, cooldownDays = 14) {
        const cluster = await this.findById(clusterId, userId);
        if (!cluster)
            return false;
        cluster.status = 'dismissed';
        cluster.updated_at = new Date().toISOString();
        cluster.prompt_history.push({
            prompted_at: new Date().toISOString(),
            action: `DISMISSED_${reason.toUpperCase()}`,
        });
        const key = `${userId}:${clusterId}`;
        this.dismissals.set(key, {
            dismissedAt: Date.now(),
            cooldownDays,
            reason,
        });
        auditLogger.logEvent({
            action: 'CLUSTER_DISMISSED',
            userId,
            resourceId: clusterId,
            timestamp: new Date().toISOString(),
            metadata: { reason, cooldownDays },
        });
        return true;
    }
}
export const clusterStore = new ClusterStore();
