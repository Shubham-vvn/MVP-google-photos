/**
 * Memory Cluster Data Access Layer (Cloud Spanner DAL)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §4.2
 */
import { MemoryCluster, ClusterStatus } from '../types/index.js';
declare class ClusterStore {
    private clusters;
    private dismissals;
    constructor();
    private seedInitialClusters;
    create(cluster: MemoryCluster): Promise<MemoryCluster>;
    findById(clusterId: string, userId: string): Promise<MemoryCluster | null>;
    list(userId: string, statusFilter?: ClusterStatus, pageSize?: number, pageToken?: string): Promise<{
        clusters: MemoryCluster[];
        nextPageToken?: string;
    }>;
    updateStatus(clusterId: string, userId: string, status: ClusterStatus, actionLog?: string): Promise<MemoryCluster | null>;
    recordDismissal(clusterId: string, userId: string, reason: string, cooldownDays?: number): Promise<boolean>;
}
export declare const clusterStore: ClusterStore;
export {};
