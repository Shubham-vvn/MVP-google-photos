/**
 * User Settings Data Access Layer (Firestore / Redis cached)
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §4.4
 */
import { UserPreferences } from '../types/index.js';
declare class SettingsStore {
    private settingsMap;
    private getDefaultSettings;
    getSettings(userId: string): Promise<UserPreferences>;
    updateSettings(userId: string, patch: Partial<UserPreferences>): Promise<UserPreferences>;
}
export declare const settingsStore: SettingsStore;
export {};
