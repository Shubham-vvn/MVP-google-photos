/**
 * Privacy Consent Check Middleware
 * Google Photos — AI Memory Context MVP
 * Document Reference: docs/privacyAssessment.md §3, §4
 */
import { settingsStore } from '../dal/settingsStore.js';
export async function consentMiddleware(req, res, next) {
    const userId = req.userId || 'usr_google_default';
    const settings = await settingsStore.getSettings(userId);
    // If memory prompts or smart memory is completely disabled
    if (req.method === 'POST' && req.path.includes('/memory/contexts')) {
        if (!settings.memory_prompts_enabled) {
            res.status(403).json({
                code: 403,
                status: 'CONSENT_REQUIRED',
                message: 'AI Memory Context feature is disabled in user settings. Please enable smart memory prompts before creating memories.',
            });
            return;
        }
    }
    next();
}
