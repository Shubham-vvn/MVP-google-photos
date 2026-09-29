/**
 * Privacy & Compliance Audit Logger
 * Google Photos — AI Memory Context MVP
 * Document Reference: docs/privacyAssessment.md §5
 */
class AuditLogger {
    inMemoryAuditTrail = [];
    logEvent(entry) {
        // Sanitization check: Ensure no raw text or sensitive PII leaked in metadata
        const sanitizedMeta = { ...entry.metadata };
        delete sanitizedMeta.raw_text;
        delete sanitizedMeta.user_text;
        const record = {
            ...entry,
            metadata: sanitizedMeta,
        };
        this.inMemoryAuditTrail.push(record);
        if (process.env.NODE_ENV !== 'test') {
            console.log(`[AUDIT_LOG] [${record.action}] user=${record.userId} res=${record.resourceId} at=${record.timestamp}`);
        }
    }
    getAuditLogs(userId) {
        if (!userId)
            return [...this.inMemoryAuditTrail];
        return this.inMemoryAuditTrail.filter((e) => e.userId === userId);
    }
    clearLogs() {
        this.inMemoryAuditTrail = [];
    }
}
export const auditLogger = new AuditLogger();
