import {PrismaClient} from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminPass = await bcrypt.hash('admin', 10);
    const userPass  = await bcrypt.hash('user', 10);

    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: { email: 'admin@example.com', full_name: 'Admin', role: 'admin', password_hash: adminPass }
    });

    await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: { email: 'user@example.com', full_name: 'User', role: 'user', password_hash: userPass }
    });

    const now = new Date();
    for (let i = 1; i <= 20; i++) {
        await prisma.player.upsert({
            where: { username: `Player${i}` },
            update: {},
            create: {
                username: `Player${i}`,
                total_score: Math.floor(Math.random()*10000),
                level: 1 + Math.floor(Math.random()*50),
                games_played: Math.floor(Math.random()*500),
                games_won: Math.floor(Math.random()*300),
                status: 'active',
                last_played: now,
            }
        });
    }
}

main().finally(() => prisma.$disconnect());
