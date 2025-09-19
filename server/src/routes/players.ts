// server/src/routes/players.ts
import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { z } from 'zod';
import { redis } from '../redis';
import type { Prisma } from '@prisma/client';

const router = Router();

const PlayerCreate = z.object({
    username: z.string().min(1),
    total_score: z.coerce.number().int().nonnegative().optional(),
    level: z.coerce.number().int().positive().optional(),
    games_played: z.coerce.number().int().nonnegative().optional(),
    games_won: z.coerce.number().int().nonnegative().optional(),
    status: z.enum(['active', 'inactive', 'banned']).default('active'),
    avatar_url: z
        .union([z.string().url(), z.literal('')])
        .optional()
        .transform((v) => (v ? v : undefined)),
    country: z.string().optional(),
    // Instead of .datetime() use refine on ISO format
    last_played: z
        .string()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid datetime string",
        })
        .optional(),
});

const IdParam = z.object({ id: z.string().uuid() });

const SORTABLE_KEYS = [
    'created_at',
    'total_score',
    'last_played',
    'level',
    'username',
] as const;
type SortKey = (typeof SORTABLE_KEYS)[number];

const LB_GLOBAL = 'leaderboard:global';

router.get('/', requireAuth, async (req, res) => {
    const sortParam = (req.query.sort as string) || '-created_at';
    const desc = sortParam.startsWith('-');
    const rawKey = desc ? sortParam.slice(1) : sortParam;

    const key: SortKey = SORTABLE_KEYS.includes(rawKey as SortKey)
        ? (rawKey as SortKey)
        : 'created_at';

    const orderBy: Prisma.PlayerOrderByWithRelationInput = {
        [key]: desc ? 'desc' : 'asc',
    };

    const players = await prisma.player.findMany({ orderBy });
    res.json(players);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
    const parsed = PlayerCreate.parse(req.body ?? {});

    const data: Prisma.PlayerCreateInput = {
        username: parsed.username,
        status: parsed.status,
        ...(parsed.total_score !== undefined ? { total_score: parsed.total_score } : {}),
        ...(parsed.level !== undefined ? { level: parsed.level } : {}),
        ...(parsed.games_played !== undefined ? { games_played: parsed.games_played } : {}),
        ...(parsed.games_won !== undefined ? { games_won: parsed.games_won } : {}),
        ...(parsed.avatar_url !== undefined ? { avatar_url: parsed.avatar_url } : {}),
        ...(parsed.country !== undefined ? { country: parsed.country } : {}),
        ...(parsed.last_played ? { last_played: new Date(parsed.last_played) } : {}),
    };

    const player = await prisma.player.create({ data });

    // Mirror score to Redis ZSET (avoid overload ambiguity; pass score as string)
    if (redis) {
        await redis.zadd(LB_GLOBAL, String(player.total_score), player.id);
    }

    res.status(201).json(player);
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = IdParam.parse(req.params);
    const parsed = PlayerCreate.partial().parse(req.body ?? {});

    const data: Prisma.PlayerUpdateInput = {
        ...(parsed.username !== undefined ? { username: parsed.username } : {}),
        ...(parsed.total_score !== undefined ? { total_score: parsed.total_score } : {}),
        ...(parsed.level !== undefined ? { level: parsed.level } : {}),
        ...(parsed.games_played !== undefined ? { games_played: parsed.games_played } : {}),
        ...(parsed.games_won !== undefined ? { games_won: parsed.games_won } : {}),
        ...(parsed.status !== undefined ? { status: parsed.status } : {}),
        ...(parsed.avatar_url !== undefined ? { avatar_url: parsed.avatar_url } : {}),
        ...(parsed.country !== undefined ? { country: parsed.country } : {}),
        ...(parsed.last_played ? { last_played: new Date(parsed.last_played) } : {}),
    };

    const updated = await prisma.player.update({ where: { id }, data });

    if (redis) {
        await redis.zadd(LB_GLOBAL, String(updated.total_score), id);
    }

    res.json(updated);
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = IdParam.parse(req.params);

    try {
        await prisma.player.delete({ where: { id } });
    } catch {
        return res.status(404).json({ error: 'Not found' });
    }

    if (redis) {
        await redis.zrem(LB_GLOBAL, id);
    }

    res.status(204).end();
});

export default router;
