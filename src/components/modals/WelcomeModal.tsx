'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';

export function WelcomeModal() {
    const { userName, isFirstVisit, setUserName } = useDashboardStore();
    const [name, setName] = useState('');
    const [isEntered, setIsEntered] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [isReturning, setIsReturning] = useState(false);

    useEffect(() => {
        // Small delay to let hydration complete
        const timer = setTimeout(() => {
            if (isFirstVisit) {
                // First-time user - show name prompt
                setShowWelcome(true);
                setIsReturning(false);
            } else if (userName) {
                // Returning user - show welcome back briefly
                setShowWelcome(true);
                setIsReturning(true);
                // Auto-hide after 2 seconds
                setTimeout(() => setShowWelcome(false), 2500);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, []); // Only run once on mount

    useEffect(() => {
        if (showWelcome && isFirstVisit) {
            // Ensure name is reset when showing modal for the first time
            setName('');
            setIsEntered(false);
        }
    }, [showWelcome, isFirstVisit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            setIsEntered(true);
            // Wait for 2 seconds to show the welcome message before setting store state
            setTimeout(() => {
                setUserName(name.trim());
            }, 2000);
        }
    };

    const theme = useDashboardStore(state => state.theme);
    const isDark = theme === 'dark';

    // Only show if it's the first visit. 
    // LoadingScreen handles the welcome back message for subsequent visits.
    if (!showWelcome || !isFirstVisit) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`
                    fixed inset-0 z-[100] flex flex-col items-center justify-center
                    ${isDark ? 'bg-[#0b1426]' : 'bg-[#f1f5f9]'}
                    overflow-hidden
                `}
            >
                {/* Themed Gradient Background */}
                <div className={`
                    absolute inset-0 opacity-40
                    ${isDark
                        ? 'bg-[radial-gradient(circle_at_center,rgba(0,208,156,0.15)_0%,transparent_70%)]'
                        : 'bg-[radial-gradient(circle_at_center,rgba(0,208,156,0.1)_0%,transparent_70%)]'
                    }
                `} />

                {/* Logo Section */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 mb-8"
                >
                    <img
                        src={isDark ? "/logo-dark.png" : "/logo-light.png"}
                        alt="Logo"
                        className="w-[400px] h-auto object-contain pointer-events-none"
                        style={{ filter: isDark ? 'drop-shadow(0 0 30px rgba(0,208,156,0.3))' : 'none' }}
                    />
                </motion.div>

                {/* Content Section */}
                <div className="relative z-20 w-full max-w-md px-6 text-center">
                    {isEntered ? (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="space-y-4"
                        >
                            <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight uppercase">
                                Welcome <span className="text-[var(--primary)]">{name}</span>
                            </h1>
                            <div className="w-64 h-1 bg-[var(--border-subtle)] rounded-full overflow-hidden mx-auto mt-8">
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                    className="w-1/2 h-full bg-[var(--primary)]"
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="space-y-6"
                        >
                            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight uppercase">
                                Let's <span className="text-[var(--primary)]">Get Started</span>
                            </h1>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="ENTER YOUR NAME"
                                    autoFocus
                                    className={`
                                        w-full px-6 py-4 text-center text-xl font-bold uppercase tracking-widest
                                        rounded-xl border-2 transition-all outline-none
                                        ${isDark
                                            ? 'bg-black/20 border-white/10 text-white focus:border-[var(--primary)]/50'
                                            : 'bg-white/50 border-black/5 text-black focus:border-[var(--primary)]/50'}
                                    `}
                                />
                                <button
                                    type="submit"
                                    disabled={!name.trim()}
                                    className="w-full py-4 px-8 rounded-xl bg-[var(--primary)] text-black font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 shadow-[0_0_20px_rgba(0,208,156,0.3)]"
                                >
                                    Login to Dashboard
                                </button>
                            </form>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
