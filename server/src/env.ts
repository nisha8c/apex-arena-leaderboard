// server/src/env.ts
import 'dotenv/config'; // <- ensures .env is loaded before reading process.env
import { z } from 'zod';

const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().default(4000),

    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    DATABASE_URL_POOLED: z.string().optional(), // optional (Neon pooler)

    CLIENT_ORIGIN: z.string().default('http://localhost:5173'),

    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required').default('devsecret'),

    REDIS_URL: z.string().optional(),
    REDIS_TOKEN: z.string().optional(),
});

export const env = schema.parse(process.env);
