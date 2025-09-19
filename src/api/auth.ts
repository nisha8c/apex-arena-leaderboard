import { http } from './http';

export interface Me {
    id: string; email: string; full_name: string; role: 'admin'|'user';
}

export const User = {
    async me(): Promise<Me | null> {
        const { data } = await http.get<Me | null>('/auth/me');
        return data;
    },
    async login(email: string, password: string) {
        await http.post('/auth/login', { email, password });
        window.location.reload();
    },
    async logout() {
        await http.post('/auth/logout', {});
        window.location.reload();
    }
};
