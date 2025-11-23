"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function DevPartnerLogin() {
    const { devImpersonate } = useAuth();
    const [email, setEmail] = useState('dev@local');
    const [password, setPassword] = useState('dev');

    // Only render in development mode
    if (process.env.NODE_ENV !== 'development') return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        devImpersonate(email, password);
    };

    return (
        <div className='flex mt-2 w-full flex-col items-center justify-center gap-4 rounded-xl bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-6 sm:p-8 shadow-2xl'>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-sm text-muted">Dev quick-login (partner)</div>
                <div className="flex gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-2/3 rounded-lg border px-3 py-2"
                        aria-label="dev email"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-1/3 rounded-lg border px-3 py-2"
                        aria-label="dev password"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="flex w-full items-center justify-center rounded-lg bg-primary h-12 px-6 text-base font-bold text-charcoal-800 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Go to Partner Dashboard
                    </button>
                </div>
            </form>

            <div>
                <h2>email: {email}</h2>
                <h2>password: {password}</h2>
            </div>
        </div>
    );
}
