import { Router } from 'express';
import { prisma } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../env';

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, full_name: user.full_name, role: user.role },
        env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false }); // set secure:true in prod over HTTPS
    res.json({ ok: true });
});

router.post('/logout', (_req, res) => {
    res.clearCookie('token');
    res.json({ ok: true });
});

router.get('/me', (req, res) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
        if (!token) return res.json(null);
        const me = jwt.verify(token, env.JWT_SECRET);
        res.json(me);
    } catch {
        res.json(null);
    }
});

export default router;
