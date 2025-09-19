import React from 'react';
import { Trophy, Users, Target, Star } from 'lucide-react';
import { Player } from '@/api/entities';
import { LeaderboardAPI } from '@/api/leaderboard';
import PlayerCard from '@/components/leaderboard/PlayerCard';
import StatsCard from '@/components/leaderboard/StatsCard';

export default function Leaderboard() {
    const [players, setPlayers] = React.useState<Player[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            try {
                const top = await LeaderboardAPI.top(100); // Redis-backed
                setPlayers(top);
            } catch (err) {
                console.error('Failed to load leaderboard:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-8 rounded-xl">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full" />
                        <span className="text-white font-medium">Loading leaderboard...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!players.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-8 rounded-xl text-center">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No players yet</h3>
                    <p className="text-gray-400">Check back later when the competition heats up!</p>
                </div>
            </div>
        );
    }

    const stats = {
        totalPlayers: players.length,
        totalGames: players.reduce((sum, p) => sum + (p.games_played ?? 0), 0),
        totalWins: players.reduce((sum, p) => sum + (p.games_won ?? 0), 0),
        totalScore: players.reduce((sum, p) => sum + (p.total_score ?? 0), 0),
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
                    <p className="text-gray-400">Top players in the championship</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatsCard
                    title="Total Players"
                    value={stats.totalPlayers}
                    icon={Users}
                    color="from-blue-500 to-cyan-500"
                    subtitle="Registered"
                />
                <StatsCard
                    title="Total Games"
                    value={stats.totalGames.toLocaleString()}
                    icon={Target}
                    color="from-green-500 to-emerald-500"
                    subtitle="Matches played"
                />
                <StatsCard
                    title="Total Wins"
                    value={stats.totalWins.toLocaleString()}
                    icon={Star}
                    color="from-purple-500 to-pink-500"
                    subtitle="Victories"
                />
                <StatsCard
                    title="Total Score"
                    value={stats.totalScore.toLocaleString()}
                    icon={Trophy}
                    color="from-yellow-500 to-orange-500"
                    subtitle="Points earned"
                />
            </div>

            {/* Players */}
            <div className="grid gap-6">
                {players.map((player, index) => (
                    <PlayerCard
                        key={player.id}
                        player={player}
                        rank={index + 1}
                    />
                ))}
            </div>
        </div>
    );
}
