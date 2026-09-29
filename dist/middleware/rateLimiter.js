/**
 * Redis-style Sliding Window Rate Limiter Middleware
 * Google Photos — AI Memory Context MVP
 * Document Reference: architecture.md §3.1
 */
const clientBuckets = new Map();
export function rateLimiter(limitPerMinute = 100) {
    return (req, res, next) => {
        const key = `${req.userId || 'anon'}:${req.path}`;
        const now = Date.now();
        const windowStart = now - 60000;
        let bucket = clientBuckets.get(key);
        if (!bucket) {
            bucket = { timestamps: [] };
            clientBuckets.set(key, bucket);
        }
        // Filter out timestamps outside current 1-minute window
        bucket.timestamps = bucket.timestamps.filter((ts) => ts > windowStart);
        if (bucket.timestamps.length >= limitPerMinute) {
            res.status(429).json({
                code: 429,
                status: 'RATE_LIMIT_EXCEEDED',
                message: `Too many requests. Limit is ${limitPerMinute} requests per minute.`,
                details: [`Retry after ${Math.ceil((bucket.timestamps[0] + 60000 - now) / 1000)} seconds.`],
            });
            return;
        }
        bucket.timestamps.push(now);
        next();
    };
}
