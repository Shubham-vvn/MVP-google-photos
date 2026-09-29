/**
 * Intelligent Prompt Engine
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.4
 */
export class PromptEngine {
    /**
     * Evaluates whether a cluster is eligible to prompt the user
     */
    evaluatePromptEligibility(cluster, preferences) {
        // 1. Check user opt-in
        if (!preferences.memory_prompts_enabled) {
            return { shouldPrompt: false, reason: 'User disabled smart memory prompts.' };
        }
        // 2. Check cluster status
        if (cluster.status !== 'pending_prompt') {
            return { shouldPrompt: false, reason: `Cluster status is ${cluster.status}.` };
        }
        // 3. Quality threshold check
        if (cluster.clustering_metadata.quality_score < 0.4) {
            return { shouldPrompt: false, reason: 'Cluster quality score below memory threshold.' };
        }
        // 4. Generate dynamic, natural prompt text
        const { photos, videos } = cluster.clustering_metadata.media_count;
        const loc = cluster.clustering_metadata.location?.locality;
        let mediaPhrase = '';
        if (photos > 0 && videos > 0) {
            mediaPhrase = `${photos} photos & ${videos} videos`;
        }
        else if (videos > 0) {
            mediaPhrase = `${videos} videos`;
        }
        else {
            mediaPhrase = `${photos} photos`;
        }
        const locPhrase = loc ? ` from your visit to ${loc}` : '';
        const promptText = `Today you captured ${mediaPhrase}${locPhrase}. Want to add a little context while it's fresh so you can easily find these moments later?`;
        return {
            shouldPrompt: true,
            reason: 'ELIGIBLE_FOR_PROMPT',
            promptText,
            suggestedAction: preferences.voice_transcription_enabled ? 'speak' : 'write',
        };
    }
}
export const promptEngine = new PromptEngine();
