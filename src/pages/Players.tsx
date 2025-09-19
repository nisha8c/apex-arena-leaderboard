import React, { useState, useEffect, useCallback } from "react";
import type { Player as PlayerModel } from "@/api/entities"; // the interface
import { Player as PlayerAPI } from "@/api/entities";        // the API client
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid, List, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Extend the server Player model with optional fields referenced in UI
type UiPlayer = PlayerModel & {
    achievements?: string[];
    current_streak?: number;
    best_streak?: number;
};

type SortKey = "total_score" | "username" | "level" | "games_played";
type FilterStatus = "all" | "active" | "inactive" | "banned";
type ViewMode = "grid" | "list";

export default function Players() {
    const [players, setPlayers] = useState<UiPlayer[]>([]);
    const [filteredPlayers, setFilteredPlayers] = useState<UiPlayer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortBy, setSortBy] = useState<SortKey>("total_score");
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    useEffect(() => {
        void loadPlayers();
    }, []);

    const loadPlayers = async () => {
        setLoading(true);
        try {
            const data = await PlayerAPI.list("-total_score");
            setPlayers(data as UiPlayer[]);
        } catch (error) {
            console.error("Error loading players:", error);
        }
        setLoading(false);
    };

    const filterAndSortPlayers = useCallback(() => {
        let filtered = [...players];

        // Filter by search term
        if (searchTerm && searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(
                (player) =>
                    (player.username &&
                        player.username.toLowerCase().includes(searchLower)) ||
                    (player.country && player.country.toLowerCase().includes(searchLower))
            );
        }

        // Filter by status
        if (filterStatus !== "all") {
            filtered = filtered.filter((player) => player.status === filterStatus);
        }

        // Sort players
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "total_score":
                    return (b.total_score ?? 0) - (a.total_score ?? 0);
                case "username":
                    return a.username.localeCompare(b.username);
                case "level":
                    return (b.level ?? 0) - (a.level ?? 0);
                case "games_played":
                    return (b.games_played ?? 0) - (a.games_played ?? 0);
                default:
                    return 0;
            }
        });

        setFilteredPlayers(filtered);
    }, [players, searchTerm, sortBy, filterStatus]);

    useEffect(() => {
        filterAndSortPlayers();
    }, [filterAndSortPlayers]);

    type PlayerItemProps = {
        player: UiPlayer;
        index: number;
    };

    const PlayerGridItem: React.FC<PlayerItemProps> = ({ player, index }) => {
        const winRate =
            player.games_played > 0
                ? ((player.games_won / player.games_played) * 100).toFixed(1)
                : "0";
        const rank = players.findIndex((p) => p.id === player.id) + 1;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card p-6 rounded-xl border border-white/10 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />

                {/* Rank Badge */}
                <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {rank}
                    </div>
                </div>

                {/* Status Indicator */}
                <div
                    className={`absolute top-4 left-4 w-3 h-3 rounded-full ${
                        player.status === "active"
                            ? "bg-green-400 animate-pulse"
                            : player.status === "inactive"
                                ? "bg-yellow-400"
                                : "bg-red-400"
                    }`}
                />

                <div className="relative pt-4">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/20">
                                {player.avatar_url ? (
                                    <img
                                        src={player.avatar_url}
                                        alt={player.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {player.username.charAt(0).toUpperCase()}
                    </span>
                                    </div>
                                )}
                            </div>
                            {player.level && (
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                    {player.level}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Player Info */}
                    <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-white mb-1">
                            {player.username}
                        </h3>
                        {player.country && (
                            <p className="text-sm text-gray-400">{player.country}</p>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                        <div>
                            <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {(player.total_score ?? 0).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">Score</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-white">
                                {player.games_played ?? 0}
                            </div>
                            <div className="text-xs text-gray-400">Played</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-green-400">{winRate}%</div>
                            <div className="text-xs text-gray-400">Win Rate</div>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="flex flex-wrap justify-center gap-1">
                        {player.achievements?.slice(0, 2).map((achievement, idx) => (
                            <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs bg-purple-500/20 text-purple-300 border-purple-400/50"
                            >
                                {achievement}
                            </Badge>
                        ))}
                        {(player.achievements?.length ?? 0) > 2 && (
                            <Badge
                                variant="outline"
                                className="text-xs bg-gray-500/20 text-gray-300 border-gray-400/50"
                            >
                                +{(player.achievements?.length ?? 0) - 2}
                            </Badge>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    const PlayerListItem: React.FC<PlayerItemProps> = ({ player, index }) => {
        const winRate =
            player.games_played > 0
                ? ((player.games_won / player.games_played) * 100).toFixed(1)
                : "0";
        const rank = players.findIndex((p) => p.id === player.id) + 1;

        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="glass-card p-4 rounded-lg border border-white/10 flex items-center space-x-4 hover:border-purple-400/50 transition-all duration-300"
            >
                <div className="text-2xl font-bold text-purple-400 w-12 text-center">
                    #{rank}
                </div>

                <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-white/20">
                        {player.avatar_url ? (
                            <img
                                src={player.avatar_url}
                                alt={player.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {player.username.charAt(0).toUpperCase()}
                </span>
                            </div>
                        )}
                    </div>
                    <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                            player.status === "active"
                                ? "bg-green-400"
                                : player.status === "inactive"
                                    ? "bg-yellow-400"
                                    : "bg-red-400"
                        }`}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-white truncate">{player.username}</h3>
                        {player.level && (
                            <Badge className="text-xs bg-blue-500/20 text-blue-300">
                                Lv.{player.level}
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-gray-400">{player.country || "Unknown"}</p>
                </div>

                <div className="hidden md:flex items-center space-x-8 text-center">
                    <div>
                        <div className="text-lg font-bold text-purple-400">
                            {(player.total_score ?? 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">Score</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-white">
                            {player.games_played ?? 0}
                        </div>
                        <div className="text-xs text-gray-400">Played</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-green-400">{winRate}%</div>
                        <div className="text-xs text-gray-400">Win Rate</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-yellow-400">
                            {player.current_streak ?? 0}
                        </div>
                        <div className="text-xs text-gray-400">Streak</div>
                    </div>
                </div>
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-8 rounded-xl">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full" />
                        <span className="text-white font-medium">Loading players...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    PLAYERS
                </h1>
                <p className="text-gray-300 text-lg">
                    Discover and explore our gaming community
                </p>
            </motion.div>

            {/* Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 rounded-xl border border-white/10 mb-8"
            >
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search players or countries... (e.g., 'Dragon', 'Canada')"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Select
                            value={sortBy}
                            onValueChange={(v) => setSortBy(v as SortKey)}
                        >
                            <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="total_score">Score</SelectItem>
                                <SelectItem value="username">Name</SelectItem>
                                <SelectItem value="level">Level</SelectItem>
                                <SelectItem value="games_played">Games</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filterStatus}
                            onValueChange={(v) => setFilterStatus(v as FilterStatus)}
                        >
                            <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="banned">Banned</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex bg-white/10 rounded-lg p-1 border border-white/20">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode("grid")}
                                className={
                                    viewMode === "grid"
                                        ? "bg-purple-500 text-white"
                                        : "text-gray-400"
                                }
                            >
                                <Grid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode("list")}
                                className={
                                    viewMode === "list"
                                        ? "bg-purple-500 text-white"
                                        : "text-gray-400"
                                }
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {searchTerm && (
                    <div className="mt-2 text-sm text-gray-400">
                        Searching for: "{searchTerm}" - Found {filteredPlayers.length} results
                    </div>
                )}
            </motion.div>

            {/* Results Count */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6">
                <p className="text-gray-400 text-center">
                    Showing {filteredPlayers.length} of {players.length} players
                    {searchTerm && ` (filtered by "${searchTerm}")`}
                </p>
            </motion.div>

            {/* Players Grid/List */}
            <AnimatePresence>
                {viewMode === "grid" ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPlayers.map((player, index) => (
                            <PlayerGridItem key={player.id} player={player} index={index} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        {filteredPlayers.map((player, index) => (
                            <PlayerListItem key={player.id} player={player} index={index} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {filteredPlayers.length === 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                    <div className="glass-card p-8 rounded-xl max-w-md mx-auto">
                        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Players Found</h3>
                        <p className="text-gray-400">Try adjusting your search criteria</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
