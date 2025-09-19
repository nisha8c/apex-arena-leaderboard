import React, { useState } from 'react';
import { User } from '@/api/auth';

export default function Login() {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('admin');

    return (
        <div className="min-h-screen grid place-items-center">
            <div className="glass-card p-6 rounded-xl w-[320px]">
                <h1 className="text-white text-xl mb-4">Login</h1>
                <input className="w-full mb-2" value={email} onChange={e=>setEmail(e.target.value)} />
                <input className="w-full mb-4" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                <button className="glass-card px-4 py-2 text-white" onClick={() => User.login(email, password)}>
                    Sign in
                </button>
            </div>
        </div>
    );
}
