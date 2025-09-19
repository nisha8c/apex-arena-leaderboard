import React from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Flame, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Player as BasePlayer } from "@/api/entities";

// Your Player model from the API may not include these.
// Make them optional so the component stays flexible.
type ExtraPlayerFields = {
    current_streak?: number;
    best_streak?: number;
    achievements?: string[];
};

export interface PlayerCardProps {
    player: BasePlayer & ExtraPlayerFields;
    rank: number;
    isTop3?: boolean;
}

export default function PlayerCard({ player, rank, isTop3 = false }: PlayerCardProps) {
    const getRankIcon = (position: number) => {
        switch (position) {
            case 1:
                return <Crown className="w-6 h-6 text-yellow-400" />;
            case 2:
                return <Medal className="w-6 h-6 text-gray-300" />;
            case 3:
                return <Medal className="w-6 h-6 text-orange-400" />;
            default:
                return <span className="text-2xl font-bold text-white">#{position}</span>;
        }
    };

    const getRankStyle = (position: number) => {
        switch (position) {
            case 1:
                return "gold-glow bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30";
            case 2:
                return "bg-gradient-to-r from-gray-400/20 to-gray-600/20 border-gray-300/30";
            case 3:
                return "bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/30";
            default:
                return "glass-card border-white/10";
        }
    };

    const gamesPlayed = player.games_played ?? 0;
    const gamesWon = player.games_won ?? 0;
    const totalScore = player.total_score ?? 0;
    const level = player.level ?? 1;

    const winRate =
        gamesPlayed > 0 ? ((gamesWon / gamesPlayed) * 100).toFixed(1) : "0";

    // Progress bar demo: percentage based on score mod 1000
    const progressPct = Math.min(((totalScore % 1000) / 10), 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: rank * 0.05 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`relative p-6 rounded-xl border ${getRankStyle(rank)} ${isTop3 ? "animate-float" : ""}`}
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-xl" />

            {/* Rank Badge */}
            <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                {getRankIcon(rank)}
            </div>

            {/* Status Indicator */}
            {player.status === "active" && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                </div>
            )}

            <div className="relative flex items-center space-x-4 mb-4">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/20">
                        {player.avatar_url ? (
                            <img
                                src={player.avatar_url}
                                alt={player.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {player.username.charAt(0).toUpperCase()}
                </span>
                            </div>
                        )}
                    </div>
                    {!!level && (
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {level}
                        </div>
                    )}
                </div>

                {/* Player Info */}
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{player.username}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                        {player.country && <span className="text-sm text-gray-400">{player.country}</span>}
                        {(player.current_streak ?? 0) > 0 && (
                            <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-400/50">
                                <Flame className="w-3 h-3 mr-1" />
                                {player.current_streak} streak
                            </Badge>
                        )}
                    </div>

                    {/* Achievements */}
                    {player.achievements && player.achievements.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {player.achievements.slice(0, 3).map((achievement, index) => (
                                <Badge
                                    key={`${player.id}-ach-${index}`}
                                    variant="outline"
                                    className="text-xs bg-purple-500/20 text-purple-300 border-purple-400/50"
                                >
                                    {achievement}
                                </Badge>
                            ))}
                            {player.achievements.length > 3 && (
                                <Badge variant="outline" className="text-xs bg-gray-500/20 text-gray-300 border-gray-400/50">
                                    +{player.achievements.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {totalScore.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center justify-center">
                        <Target className="w-3 h-3 mr-1" />
                        Score
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="text-2xl font-bold text-white">{gamesPlayed}</div>
                    <div className="text-xs text-gray-400 flex items-center justify-center">
                        <Zap className="w-3 h-3 mr-1" />
                        Played
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="text-2xl font-bold text-green-400">{winRate}%</div>
                    <div className="text-xs text-gray-400 flex items-center justify-center">
                        <Trophy className="w-3 h-3 mr-1" />
                        Win Rate
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Level {level}</span>
                    <span>{player.best_streak ?? 0} best streak</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
    );
}
