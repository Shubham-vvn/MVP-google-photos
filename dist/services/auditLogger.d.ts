/**
 * Privacy & Compliance Audit Logger
 * Google Photos — AI Memory Context MVP
 * Document Reference: docs/privacyAssessment.md §5
 */
export interface AuditLogEntry {
    action: string;
    userId: string;
    resourceId: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
}
declare class AuditLogger {
    private inMemoryAuditTrail;
    logEvent(entry: AuditLogEntry): void;
    getAuditLogs(userId?: string): AuditLogEntry[];
    clearLogs(): void;
}
export declare const auditLogger: AuditLogger;
export {};
