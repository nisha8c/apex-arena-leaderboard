import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { redis } from '../redis';

const router = Router();
const LB_GLOBAL = 'leaderboard:global';

// GET /api/leaderboard/top?limit=100
router.get('/top', requireAuth, async (req, res) => {
    const limit = Math.min(parseInt((req.query.limit as string) || '100', 10), 500);

    if (redis) {
        // 1) read ids+scores from Redis (fast)
        const entries = await redis.zrevrange(LB_GLOBAL, 0, limit - 1, 'WITHSCORES');
        // entries = [id, score, id, score, ...]

        // entries = [id, score, id, score, ...]
        const ids: string[] = [];
        for (let i = 0; i < entries.length; i += 2) {
            const id = entries[i];
            if (id !== undefined) ids.push(id);
        }

        if (ids.length) {
            // 2) hydrate from Postgres
            const players = await prisma.player.findMany({ where: { id: { in: ids } } });
            // 3) order by Redis rank
            const map = new Map(players.map(p => [p.id, p]));
            const ordered = ids.map(id => map.get(id)).filter(Boolean);
            return res.json(ordered);
        }
    }

    // Fallback to Postgres if no Redis
    const players = await prisma.player.findMany({ orderBy: { total_score: 'desc' }, take: limit });
    res.json(players);
});

export default router;
