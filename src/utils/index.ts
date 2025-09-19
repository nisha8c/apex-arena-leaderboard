// src/utils/index.ts
export function createPageUrl(name: string) {
    // mirror your generated project’s behavior:
    // "/" for Leaderboard; "/Players", "/Admin", "/Login" for others
    const clean = name.trim().toLowerCase();
    if (clean === "leaderboard" || clean === "") return "/";
    // Preserve original casing in URL if you like:
    return `/${name}`;
}
