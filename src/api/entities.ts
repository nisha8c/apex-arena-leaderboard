export type PlayerStatus = 'active'|'inactive'|'banned';
export interface Player {
    id: string; username: string;
    total_score: number; level: number;
    games_played: number; games_won: number;
    status: PlayerStatus; avatar_url?: string; country?: string;
    last_played: string; created_at: string; updated_at: string;
}

export interface PlayerCreate {
    username: string;
    total_score?: number; level?: number;
    games_played?: number; games_won?: number;
    status?: PlayerStatus; avatar_url?: string; country?: string;
    last_played?: string;
}

import { http } from './http';

export const Player = {
    list: async (sort?: string) => {
        const { data } = await http.get<Player[]>('/players', { params: { sort } });
        return data;
    },
    create: async (payload: PlayerCreate) => {
        const { data } = await http.post<Player>('/players', payload);
        return data;
    },
    update: async (id: string, payload: Partial<PlayerCreate>) => {
        const { data } = await http.put<Player>(`/players/${id}`, payload);
        return data;
    },
    delete: async (id: string) => {
        await http.delete(`/players/${id}`);
    },
};
