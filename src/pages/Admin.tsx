import React, { useState, useEffect } from "react";
import type { Player as PlayerModel, PlayerCreate } from "@/api/entities";
import { Player as PlayerAPI } from "@/api/entities";
import { User as AuthAPI, type Me as AuthMe } from "@/api/auth";

import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Shield, Users, Trophy, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import PlayerForm from "../components/admin/PlayerForm";
import StatsCard from "../components/leaderboard/StatsCard";

// Optional UI-only fields your PlayerForm/rows display
type UiExtras = {
    achievements?: string[];
    current_streak?: number;
    best_streak?: number;
};

type UiPlayer = PlayerModel & UiExtras;

type FormPayload = PlayerCreate & UiExtras & { id?: string };

export default function Admin() {
    const [players, setPlayers] = useState<UiPlayer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<AuthMe | null>(null);

    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingPlayer, setEditingPlayer] = useState<UiPlayer | null>(null);
    const [deletingPlayer, setDeletingPlayer] = useState<UiPlayer | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        void checkAuth();
        void loadPlayers();
    }, []);

    const checkAuth = async () => {
        try {
            const userData = await AuthAPI.me();
            if (!userData || userData.role !== "admin") {
                // Redirect non-admin or unauthenticated users
                window.location.href = "/";
                return;
            }
            setUser(userData);
        } catch {
            // Redirect unauthenticated users
            window.location.href = "/";
        }
    };

    const loadPlayers = async () => {
        setLoading(true);
        try {
            // NOTE: your Prisma schema/timestamps likely use "created_at"
            const data = await PlayerAPI.list("-created_at");
            setPlayers(data as UiPlayer[]);
        } catch (error) {
            console.error("Error loading players:", error);
        }
        setLoading(false);
    };

    // Map the form payload to the exact PlayerCreate shape accepted by the API
    const toPlayerCreate = (data: FormPayload): PlayerCreate => ({
        username: data.username,
        total_score: data.total_score,
        level: data.level,
        games_played: data.games_played,
        games_won: data.games_won,
        status: data.status,
        avatar_url: data.avatar_url,
        country: data.country,
        last_played: data.last_played,
    });

    const handleCreatePlayer = async (playerData: FormPayload) => {
        setIsSubmitting(true);
        try {
            await PlayerAPI.create({
                ...toPlayerCreate(playerData),
                last_played: new Date().toISOString(),
            });
            setShowForm(false);
            setEditingPlayer(null);
            await loadPlayers();
        } catch (error) {
            console.error("Error creating player:", error);
        }
        setIsSubmitting(false);
    };

    const handleUpdatePlayer = async (playerData: FormPayload) => {
        if (!editingPlayer?.id) return;
        setIsSubmitting(true);
        try {
            await PlayerAPI.update(editingPlayer.id, toPlayerCreate(playerData));
            setShowForm(false);
            setEditingPlayer(null);
            await loadPlayers();
        } catch (error) {
            console.error("Error updating player:", error);
        }
        setIsSubmitting(false);
    };

    const handleDeletePlayer = async () => {
        if (!deletingPlayer?.id) return;
        try {
            await PlayerAPI.delete(deletingPlayer.id);
            setDeletingPlayer(null);
            await loadPlayers();
        } catch (error) {
            console.error("Error deleting player:", error);
        }
    };

    const getStats = () => {
        const totalPlayers = players.length;
        const activePlayers = players.filter((p) => p.status === "active").length;
        const totalGames = players.reduce((sum, p) => sum + (p.games_played || 0), 0);
        const totalScore = players.reduce((sum, p) => sum + (p.total_score || 0), 0);

        return { totalPlayers, activePlayers, totalGames, totalScore };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-8 rounded-xl">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full" />
                        <span className="text-white font-medium">Loading admin panel...</span>
                    </div>
                </div>
            </div>
        );
    }

    const stats = getStats();

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            >
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                        <p className="text-gray-400">Manage players and game statistics</p>
                    </div>
                </div>

                <Button
                    onClick={() => {
                        setEditingPlayer(null);
                        setShowForm(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 neon-glow"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Player
                </Button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                <StatsCard
                    title="Total Players"
                    value={stats.totalPlayers}
                    icon={Users}
                    color="from-blue-500 to-cyan-500"
                    subtitle="All registered"
                />
                <StatsCard
                    title="Active Players"
                    value={stats.activePlayers}
                    icon={Shield}
                    color="from-green-500 to-emerald-500"
                    subtitle="Currently active"
                />
                <StatsCard
                    title="Games Played"
                    value={stats.totalGames.toLocaleString()}
                    icon={Target}
                    color="from-purple-500 to-pink-500"
                    subtitle="Total matches"
                />
                <StatsCard
                    title="Total Score"
                    value={stats.totalScore.toLocaleString()}
                    icon={Trophy}
                    color="from-yellow-500 to-orange-500"
                    subtitle="Combined points"
                />
            </motion.div>

            {/* Player Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <PlayerForm
                            player={editingPlayer}
                            onSubmit={editingPlayer ? handleUpdatePlayer : handleCreatePlayer}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingPlayer(null);
                            }}
                            isSubmitting={isSubmitting}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Players Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-xl border border-white/10 overflow-hidden"
            >
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">All Players</h2>
                    <p className="text-gray-400">Manage player profiles and statistics</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5">
                        <tr>
                            <th className="text-left p-4 text-gray-300 font-medium">Player</th>
                            <th className="text-left p-4 text-gray-300 font-medium">Score</th>
                            <th className="text-left p-4 text-gray-300 font-medium">Level</th>
                            <th className="text-left p-4 text-gray-300 font-medium">Games</th>
                            <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                            <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {players.map((player, index) => (
                            <motion.tr
                                key={player.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                                <td className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/20">
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
                                        <div>
                                            <div className="font-medium text-white">{player.username}</div>
                                            <div className="text-sm text-gray-400">{player.country || "Unknown"}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-purple-400">
                                        {(player.total_score || 0).toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-white">{player.level || 1}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-white">{player.games_played || 0}</div>
                                    <div className="text-sm text-gray-400">{player.games_won || 0} wins</div>
                                </td>
                                <td className="p-4">
                                    <div
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            player.status === "active"
                                                ? "bg-green-500/20 text-green-300"
                                                : player.status === "inactive"
                                                    ? "bg-yellow-500/20 text-yellow-300"
                                                    : "bg-red-500/20 text-red-300"
                                        }`}
                                    >
                                        {player.status}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setEditingPlayer(player);
                                                setShowForm(true);
                                            }}
                                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setDeletingPlayer(player)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {players.length === 0 && (
                    <div className="text-center py-12">
                        <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Players Yet</h3>
                        <p className="text-gray-400 mb-4">Add your first player to get started</p>
                        <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Player
                        </Button>
                    </div>
                )}
            </motion.div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deletingPlayer} onOpenChange={() => setDeletingPlayer(null)}>
                <AlertDialogContent className="glass-card border-white/20">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Player</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                            Are you sure you want to delete "{deletingPlayer?.username}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeletePlayer}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete Player
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
