/**
 * Redis-style Sliding Window Rate Limiter Middleware
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.1
 */
import { Request, Response, NextFunction } from 'express';
export declare function rateLimiter(limitPerMinute?: number): (req: Request, res: Response, next: NextFunction) => void;
