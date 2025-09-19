import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../env';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token =
        req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload & {
            role?: string;
        };

        req.user = payload; // ✅ typed now
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
}
