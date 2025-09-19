import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Player as BasePlayer, PlayerStatus } from "@/api/entities";
import { Button } from "@/components/ui/button";

type ExtraPlayerFields = {
    achievements?: string[];
    current_streak?: number;
    best_streak?: number;
};

export type PlayerFormValues = {
    username: string;
    avatar_url?: string;
    total_score: number;
    games_played: number;
    games_won: number;
    level: number;
    achievements: string[];
    current_streak: number;
    best_streak: number;
    country?: string;
    status: PlayerStatus;
};

export interface PlayerFormProps {
    player?: (BasePlayer & ExtraPlayerFields) | null;
    onSubmit: (data: PlayerFormValues) => void | Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const defaultValues: PlayerFormValues = {
    username: "",
    avatar_url: "",
    total_score: 0,
    games_played: 0,
    games_won: 0,
    level: 1,
    achievements: [],
    current_streak: 0,
    best_streak: 0,
    country: "",
    status: "active",
};

export default function PlayerForm({
                                       player,
                                       onSubmit,
                                       onCancel,
                                       isSubmitting = false,
                                   }: PlayerFormProps) {
    const initial: PlayerFormValues = {
        ...defaultValues,
        ...(player
            ? {
                username: player.username ?? "",
                avatar_url: player.avatar_url ?? "",
                total_score: player.total_score ?? 0,
                games_played: player.games_played ?? 0,
                games_won: player.games_won ?? 0,
                level: player.level ?? 1,
                achievements: player.achievements ?? [],
                current_streak: player.current_streak ?? 0,
                best_streak: player.best_streak ?? 0,
                country: player.country ?? "",
                status: player.status,
            }
            : {}),
    };

    const [formData, setFormData] = useState<PlayerFormValues>(initial);
    const [newAchievement, setNewAchievement] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const addAchievement = () => {
        const value = newAchievement.trim();
        if (value && !formData.achievements.includes(value)) {
            setFormData((prev) => ({
                ...prev,
                achievements: [...prev.achievements, value],
            }));
            setNewAchievement("");
        }
    };

    const removeAchievement = (achievement: string) => {
        setFormData((prev) => ({
            ...prev,
            achievements: prev.achievements.filter((a) => a !== achievement),
        }));
    };

    const num = (v: string, fallback = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card p-6 rounded-xl border border-white/20 max-w-2xl mx-auto"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">{player ? "Edit Player" : "Add New Player"}</h3>
                <Button variant="ghost" size="icon" type="button" onClick={onCancel}>
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-gray-300">
                            Username *
                        </Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="country" className="text-gray-300">
                            Country
                        </Label>
                        <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="total_score" className="text-gray-300">
                            Total Score
                        </Label>
                        <Input
                            id="total_score"
                            type="number"
                            value={formData.total_score}
                            onChange={(e) => setFormData((p) => ({ ...p, total_score: num(e.target.value, 0) }))}
                            className="bg-white/10 border-white/20 text-white"
                            inputMode="numeric"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="level" className="text-gray-300">
                            Level
                        </Label>
                        <Input
                            id="level"
                            type="number"
                            min={1}
                            value={formData.level}
                            onChange={(e) => setFormData((p) => ({ ...p, level: Math.max(1, num(e.target.value, 1)) }))}
                            className="bg-white/10 border-white/20 text-white"
                            inputMode="numeric"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="games_played" className="text-gray-300">
                            Games Played
                        </Label>
                        <Input
                            id="games_played"
                            type="number"
                            value={formData.games_played}
                            onChange={(e) => setFormData((p) => ({ ...p, games_played: num(e.target.value, 0) }))}
                            className="bg-white/10 border-white/20 text-white"
                            inputMode="numeric"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="games_won" className="text-gray-300">
                            Games Won
                        </Label>
                        <Input
                            id="games_won"
                            type="number"
                            value={formData.games_won}
                            onChange={(e) => setFormData((p) => ({ ...p, games_won: num(e.target.value, 0) }))}
                            className="bg-white/10 border-white/20 text-white"
                            inputMode="numeric"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="current_streak" className="text-gray-300">
                            Current Streak
                        </Label>
                        <Input
                            id="current_streak"
                            type="number"
                            value={formData.current_streak}
                            onChange={(e) => setFormData((p) => ({ ...p, current_streak: num(e.target.value, 0) }))}
                            className="bg-white/10 border-white/20 text-white"
                            inputMode="numeric"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-gray-300">
                            Status
                        </Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: PlayerStatus) => setFormData((p) => ({ ...p, status: value }))}
                        >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="banned">Banned</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="avatar_url" className="text-gray-300">
                        Avatar URL
                    </Label>
                    <Input
                        id="avatar_url"
                        type="url"
                        value={formData.avatar_url}
                        onChange={(e) => setFormData((p) => ({ ...p, avatar_url: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="https://example.com/avatar.jpg"
                    />
                </div>

                {/* Achievements */}
                <div className="space-y-4">
                    <Label className="text-gray-300">Achievements</Label>

                    <div className="flex gap-2">
                        <Input
                            value={newAchievement}
                            onChange={(e) => setNewAchievement(e.target.value)}
                            placeholder="Enter achievement..."
                            className="bg-white/10 border-white/20 text-white"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addAchievement();
                                }
                            }}
                        />
                        <Button type="button" onClick={addAchievement} size="icon" variant="outline">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {formData.achievements.map((achievement, index) => (
                            <Badge
                                key={`${achievement}-${index}`}
                                variant="outline"
                                className="bg-purple-500/20 text-purple-300 border-purple-400/50 cursor-pointer hover:bg-red-500/20"
                                onClick={() => removeAchievement(achievement)}
                                title="Click to remove"
                            >
                                {achievement} ×
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Saving..." : "Save Player"}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}
