/**
 * Authentication & Identity Middleware
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.1
 */
import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userEmail?: string;
        }
    }
}
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): void;
