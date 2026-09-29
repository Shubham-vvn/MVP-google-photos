/**
 * User Preferences & Memory Settings Endpoints
 * Google Photos — AI Memory Context MVP
 * Document Reference: api/openapi.yaml
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { settingsStore } from '../dal/settingsStore.js';

export const settingsRouter = Router();

const UserSettingsSchema = z.object({
  memory_prompts_enabled: z.boolean().default(true),
  voice_transcription_enabled: z.boolean().default(true),
  max_prompts_per_week: z.number().int().min(1).max(10).default(3),
  cooldown_days: z.number().int().default(14),
  sensitive_detection_enabled: z.boolean().default(true),
});

// GET /v1/memory/settings - Get user memory preferences
settingsRouter.get('/settings', async (req: Request, res: Response) => {
  try {
    const userId = req.userId || 'usr_google_default';
    const settings = await settingsStore.getSettings(userId);
    res.status(200).json(settings);
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
});

// PUT /v1/memory/settings - Update user memory preferences
settingsRouter.put('/settings', async (req: Request, res: Response) => {
  try {
    const userId = req.userId || 'usr_google_default';
    const parsed = UserSettingsSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        code: 400,
        status: 'BAD_REQUEST',
        message: 'Invalid settings payload.',
        details: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
      });
      return;
    }

    const updated = await settingsStore.updateSettings(userId, parsed.data);
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
});
