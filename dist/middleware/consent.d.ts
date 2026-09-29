/**
 * Privacy Consent Check Middleware
 * Google Photos — AI Memory Context MVP
 * Document Reference: docs/privacyAssessment.md §3, §4
 */
import { Request, Response, NextFunction } from 'express';
export declare function consentMiddleware(req: Request, res: Response, next: NextFunction): Promise<void>;
