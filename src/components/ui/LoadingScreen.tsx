'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '@/store/dashboardStore';
import { useEffect, useState } from 'react';

export function LoadingScreen() {
    const theme = useDashboardStore(state => state.theme);
    const isDark = theme === 'dark';
    const [isZooming, setIsZooming] = useState(false);

    useEffect(() => {
        // Start zoom-in animation after 2.5 seconds
        const timer = setTimeout(() => {
            setIsZooming(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
                fixed inset-0 z-[100] flex flex-col items-center justify-center
                ${isDark
                    ? 'bg-[#0b1426]'
                    : 'bg-[#f1f5f9]'
                }
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
                transition={{
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1]
                }}
                className="relative z-10 mb-8"
            >
                <img
                    src={isDark ? "/logo-dark.png" : "/logo-light.png"}
                    alt="Logo"
                    className="w-[500px] h-auto object-contain pointer-events-none"
                    style={{ filter: isDark ? 'drop-shadow(0 0 30px rgba(0,208,156,0.3))' : 'none' }}
                />
            </motion.div>

            {/* Welcome Text Section */}
            <div className="relative z-10 h-10 overflow-hidden">
                <motion.h1
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={isZooming
                        ? { scale: 1.5, opacity: 0 }
                        : { scale: 0.8, opacity: 1 }
                    }
                    transition={{
                        duration: isZooming ? 0.8 : 1.5,
                        ease: "easeOut"
                    }}
                    className="text-4xl font-black text-[var(--text-primary)] tracking-tight uppercase"
                >
                    Welcome back <span className="text-[var(--primary)]">SHRIANSH</span>
                </motion.h1>
            </div>

            {/* Loading Bar */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 h-1 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear"
                    }}
                    className="w-1/2 h-full bg-[var(--primary)]"
                />
            </div>
        </motion.div>
    );
}
