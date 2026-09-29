import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
const configSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
    PORT: z.coerce.number().default(8080),
    LOG_LEVEL: z.string().default('info'),
    CORS_ORIGIN: z.string().default('*'),
    // GCP Core
    GCP_PROJECT_ID: z.string().default('google-photos-memory-mvp-dev'),
    GCP_REGION: z.string().default('us-central1'),
    // Spanner
    SPANNER_INSTANCE_ID: z.string().default('memory-spanner-dev'),
    SPANNER_DATABASE_ID: z.string().default('memory_db'),
    // Redis
    REDIS_HOST: z.string().default('127.0.0.1'),
    REDIS_PORT: z.coerce.number().default(6379),
    // Vertex AI & Gemini
    GEMINI_MODEL: z.string().default('gemini-1.5-flash-001'),
    GEMINI_FALLBACK_MODEL: z.string().default('gemini-1.5-pro-001'),
    VERTEX_VECTOR_INDEX_ID: z.string().default('dev-index'),
    VERTEX_VECTOR_ENDPOINT_ID: z.string().default('dev-endpoint'),
    // Business Rules
    PROMPT_COOLDOWN_DAYS: z.coerce.number().default(14),
    MAX_WEEKLY_PROMPTS: z.coerce.number().default(3),
});
export const config = configSchema.parse(process.env);
