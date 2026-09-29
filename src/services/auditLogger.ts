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

class AuditLogger {
  private inMemoryAuditTrail: AuditLogEntry[] = [];

  logEvent(entry: AuditLogEntry): void {
    // Sanitization check: Ensure no raw text or sensitive PII leaked in metadata
    const sanitizedMeta = { ...entry.metadata };
    delete sanitizedMeta.raw_text;
    delete sanitizedMeta.user_text;

    const record: AuditLogEntry = {
      ...entry,
      metadata: sanitizedMeta,
    };

    this.inMemoryAuditTrail.push(record);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[AUDIT_LOG] [${record.action}] user=${record.userId} res=${record.resourceId} at=${record.timestamp}`);
    }
  }

  getAuditLogs(userId?: string): AuditLogEntry[] {
    if (!userId) return [...this.inMemoryAuditTrail];
    return this.inMemoryAuditTrail.filter((e) => e.userId === userId);
  }

  clearLogs(): void {
    this.inMemoryAuditTrail = [];
  }
}

export const auditLogger = new AuditLogger();
