/**
 * User Settings Data Access Layer (Firestore / Redis cached)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §4.4
 */

import { UserPreferences } from '../types/index.js';
import { auditLogger } from '../services/auditLogger.js';

class SettingsStore {
  private settingsMap: Map<string, UserPreferences> = new Map();

  private getDefaultSettings(userId: string): UserPreferences {
    return {
      user_id: userId,
      updated_at: new Date().toISOString(),
      memory_prompts_enabled: true,
      voice_transcription_enabled: true,
      sensitive_detection_enabled: true,
      max_prompts_per_week: 3,
      cooldown_days: 14,
    };
  }

  async getSettings(userId: string): Promise<UserPreferences> {
    if (!this.settingsMap.has(userId)) {
      const defaults = this.getDefaultSettings(userId);
      this.settingsMap.set(userId, defaults);
      return defaults;
    }
    return this.settingsMap.get(userId)!;
  }

  async updateSettings(userId: string, patch: Partial<UserPreferences>): Promise<UserPreferences> {
    const current = await this.getSettings(userId);
    const updated: UserPreferences = {
      ...current,
      ...patch,
      user_id: userId,
      updated_at: new Date().toISOString(),
    };

    this.settingsMap.set(userId, updated);
    auditLogger.logEvent({
      action: 'USER_SETTINGS_UPDATED',
      userId,
      resourceId: 'SETTINGS',
      timestamp: new Date().toISOString(),
      metadata: { ...patch },
    });

    return updated;
  }
}

export const settingsStore = new SettingsStore();
