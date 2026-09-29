/**
 * Photo Cluster REST Endpoints
 * Google Photos — AI Memory Context MVP
 * Document Reference: api/openapi.yaml
 */

import { Router, Request, Response } from 'express';
import { clusterStore } from '../dal/clusterStore.js';
import { ClusterStatus } from '../types/index.js';

export const clusterRouter = Router();

// GET /v1/memory/clusters - List candidate clusters eligible for prompt
clusterRouter.get('/clusters', async (req: Request, res: Response) => {
  try {
    const userId = req.userId || 'usr_google_default';
    const pageSize = req.query.page_size ? parseInt(req.query.page_size as string, 10) : 10;
    const pageToken = req.query.page_token as string | undefined;
    const status = (req.query.status as ClusterStatus) || 'pending_prompt';

    const { clusters, nextPageToken } = await clusterStore.list(userId, status, pageSize, pageToken);

    // Map to OpenAPI Cluster schema
    const formatted = clusters.map((c) => ({
      cluster_id: c.cluster_id,
      user_id: c.user_id,
      status: c.status,
      created_at: c.created_at,
      media_count: c.clustering_metadata.media_count.photos + c.clustering_metadata.media_count.videos,
      date_range: {
        start_date: c.clustering_metadata.time_span.start,
        end_date: c.clustering_metadata.time_span.end,
      },
      location_label: c.clustering_metadata.location?.locality || 'Outing',
      prompt_suggestion: `Add memory context to find these ${c.media_items.length} items later?`,
      media_preview_urls: c.media_items.map((m) => `/assets/${m.media_id}.jpg`),
    }));

    res.status(200).json({
      clusters: formatted,
      next_page_token: nextPageToken,
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Failed to list memory clusters.',
    });
  }
});

// GET /v1/memory/clusters/:cluster_id - Get cluster details
clusterRouter.get('/clusters/:cluster_id', async (req: Request, res: Response) => {
  try {
    const userId = req.userId || 'usr_google_default';
    const cluster = await clusterStore.findById(req.params.cluster_id, userId);

    if (!cluster) {
      res.status(404).json({
        code: 404,
        status: 'NOT_FOUND',
        message: `Cluster ${req.params.cluster_id} not found.`,
      });
      return;
    }

    res.status(200).json(cluster);
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
});

// POST /v1/memory/clusters/:cluster_id/dismiss - Dismiss cluster prompt
clusterRouter.post('/clusters/:cluster_id/dismiss', async (req: Request, res: Response) => {
  try {
    const userId = req.userId || 'usr_google_default';
    const { reason, cooldown_days } = req.body || {};

    const dismissed = await clusterStore.recordDismissal(
      req.params.cluster_id,
      userId,
      reason || 'not_now',
      cooldown_days || 14
    );

    if (!dismissed) {
      res.status(404).json({
        code: 404,
        status: 'NOT_FOUND',
        message: `Cluster ${req.params.cluster_id} not found.`,
      });
      return;
    }

    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
});
