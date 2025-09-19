export const LeaderboardAPI = {
    top: async (limit = 100) => {
        const { data } = await http.get('/leaderboard/top', { params: { limit } });
        return data as import('./entities').Player[];
    }
};
