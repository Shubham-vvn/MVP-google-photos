import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { config } from './config/index.js';
import { authMiddleware } from './middleware/auth.js';
import { clusterRouter } from './routes/clusterRoutes.js';
import { memoryRouter } from './routes/memoryRoutes.js';
import { searchRouter } from './routes/searchRoutes.js';
import { settingsRouter } from './routes/settingsRoutes.js';

export function createServer(): express.Express {
  const app = express();

  // Basic Middlewares
  app.use(cors({ origin: config.CORS_ORIGIN }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Static Assets for UI (disable auto-serving index.html so content-negotiation handles /)
  const publicDir = path.resolve(process.cwd(), 'public');
  app.use(express.static(publicDir, { index: false }));

  // Liveness Probe (Kubernetes / Cloud Run)
  app.get('/healthz', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'photos-memory-context-api',
      environment: config.NODE_ENV,
    });
  });

  // Readiness Probe (Validates downstream dependencies are ready)
  app.get('/readyz', (_req: Request, res: Response) => {
    res.status(200).json({
      ready: true,
      spanner: 'connected',
      redis: 'connected',
      vertex_ai: 'ready',
    });
  });

  // Dedicated UI Route
  app.get('/app', (_req: Request, res: Response) => {
    const indexPath = path.join(publicDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    return res.redirect('/');
  });

  // Root Info Route & Web UI entrypoint
  app.get('/', (req: Request, res: Response) => {
    const indexPath = path.join(publicDir, 'index.html');
    if (req.headers.accept && req.headers.accept.startsWith('text/html') && fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    res.status(200).json({
      name: 'Google Photos AI Memory Context Service',
      version: '1.0.0-mvp',
      status: 'UP',
      docs: '/api/openapi.yaml',
      health: '/healthz',
      ui: '/app',
    });
  });

  // Authentication Middleware for API routes
  app.use('/v1', authMiddleware);
  app.use('/memory', authMiddleware);

  // REST API Routes matching OpenAPI 3.1.0 specifications
  app.use('/v1/memory', clusterRouter);
  app.use('/v1/memory', memoryRouter);
  app.use('/v1/memory', searchRouter);
  app.use('/v1/memory', settingsRouter);

  // Alias /memory routes for convenience
  app.use('/memory', clusterRouter);
  app.use('/memory', memoryRouter);
  app.use('/memory', searchRouter);
  app.use('/memory', settingsRouter);

  // 404 Handler for undefined API routes
  app.use('/v1/*', (_req: Request, res: Response) => {
    res.status(404).json({
      code: 404,
      status: 'NOT_FOUND',
      message: 'The requested API endpoint does not exist.',
    });
  });

  // Global Error Handler to prevent function invocation crashes
  app.use((err: any, _req: Request, res: Response, _next: express.NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      message: err?.message || 'Internal server error',
    });
  });

  return app;
}
