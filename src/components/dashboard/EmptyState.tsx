'use client';

import { motion } from 'framer-motion';
import { LineChart, Plus } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';

export function EmptyState() {
    const openAddWidgetModal = useDashboardStore(state => state.openAddWidgetModal);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center min-h-[60vh] px-4"
        >
            {/* Animated Icon */}
            <motion.div
                className="empty-state-icon mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
            >
                <div className="
          relative flex items-center justify-center
          w-24 h-24 rounded-2xl
          bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-surface)]
          border border-[var(--border-subtle)]
        ">
                    {/* Glowing ring */}
                    <div className="
            absolute inset-0 rounded-2xl
            bg-gradient-to-r from-[var(--primary)]/20 via-transparent to-[var(--primary)]/20
            animate-pulse
          " />

                    <LineChart className="w-10 h-10 text-[var(--primary)]" />

                    {/* Floating dots */}
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-[var(--primary)]"
                            style={{
                                top: `${20 + i * 20}%`,
                                right: `-${10 + i * 5}px`,
                            }}
                            animate={{
                                y: [0, -10, 0],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                delay: i * 0.3,
                                repeat: Infinity,
                            }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Title */}
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-[var(--text-primary)] mb-3 text-center"
            >
                Build Your Finance Dashboard
            </motion.h2>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-[var(--text-secondary)] text-center max-w-md mb-8 leading-relaxed"
            >
                Create custom widgets by connecting to any finance API. Track stocks, crypto, forex, or economic indicators - all in real time.
            </motion.p>

            {/* CTA Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openAddWidgetModal}
                className="
          btn btn-primary text-base px-8 py-3
          shadow-lg shadow-[var(--primary)]/25
        "
            >
                <Plus className="w-5 h-5" />
                <span>Add Your First Widget</span>
            </motion.button>

            {/* Hint Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center gap-4 mt-12"
            >
                {[
                    { icon: '📈', label: 'Stock Prices' },
                    { icon: '₿', label: 'Cryptocurrency' },
                    { icon: '💱', label: 'Forex Rates' },
                    { icon: '📊', label: 'Market Data' },
                ].map((item, i) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                        whileHover={{ y: -3, scale: 1.02 }}
                        className="
              flex items-center gap-2 px-4 py-2
              glass rounded-full
              text-sm text-[var(--text-secondary)]
              cursor-default
            "
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}
