// src/api/leaderboard.ts
import type { Player } from "@/api/entities";

// Point to your Express server. If client & server are on same origin in dev, you can leave it blank.
const API_BASE =
    import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || ""; // e.g. "http://localhost:4000"

export const LeaderboardAPI = {
    async top(limit: number = 100): Promise<Player[]> {
        const url = `${API_BASE}/api/leaderboard/top?limit=${encodeURIComponent(
            limit
        )}`;
        const res = await fetch(url, {
            // include cookies if you use cookie auth (your middleware checks req.cookies?.token)
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`GET ${url} failed: ${res.status} ${text}`);
        }

        return res.json() as Promise<Player[]>;
    },
};
