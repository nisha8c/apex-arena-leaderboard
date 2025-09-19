import './env';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './env';
import authRouter from './routes/auth';
import playersRouter from './routes/players';
import leaderboardRouter from './routes/leaderboard';

const app = express();

app.use(cors({ origin: [env.CLIENT_ORIGIN], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/players', playersRouter);
app.use('/api/leaderboard', leaderboardRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running http://localhost:${PORT}`));
