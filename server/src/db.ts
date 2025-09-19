// server/src/db.ts
import { PrismaClient } from '@prisma/client';
import { env } from './env';

// If pooled URL is set, use it; otherwise Prisma will use prisma/schema.prisma -> env("DATABASE_URL")
export const prisma = new PrismaClient(
    env.DATABASE_URL_POOLED
        ? { datasources: { db: { url: env.DATABASE_URL_POOLED } } }
        : undefined
);
