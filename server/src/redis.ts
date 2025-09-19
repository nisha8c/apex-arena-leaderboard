import IORedis, { type Redis as RedisType, type RedisOptions } from 'ioredis';
import { env } from './env';

let redis: RedisType | null = null;

const url = env.REDIS_URL?.trim();

if (url && /^rediss?:\/\//i.test(url)) {
    const opts: RedisOptions = {
        maxRetriesPerRequest: null,
        enableReadyCheck: true,
    };
    // Add TLS options only for rediss://
    if (url.toLowerCase().startsWith('rediss://')) {
        // Many managed providers use public certs; you can tighten this to true if you want strict cert checks.
        opts.tls = { rejectUnauthorized: false };
    }

    redis = new IORedis(url, opts);

    redis.on('connect', () => console.log('[redis] connected'));
    redis.on('ready', () => console.log('[redis] ready'));
    redis.on('error', (err) => console.error('[redis] error:', err.message));
    redis.on('end', () => console.warn('[redis] connection closed'));
} else {
    if (url) {
        console.warn(
            `[redis] REDIS_URL looks invalid for ioredis: "${url}". Expected redis:// or rediss://`
        );
    } else {
        console.warn('[redis] REDIS_URL not set. Running without Redis cache.');
    }
}

export { redis };
