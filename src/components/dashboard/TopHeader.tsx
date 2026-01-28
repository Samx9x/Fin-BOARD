'use client';

import { Search, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '@/store/dashboardStore';

interface TopHeaderProps {
    userName: string;
}

export function TopHeader({ userName }: TopHeaderProps) {
    const { theme, setTheme } = useDashboardStore();
    const isDark = theme === 'dark';

    return (
        <header className="
      sticky top-0 z-40
      flex items-center justify-between
      h-28 px-[50px]
      bg-gradient-to-r from-[var(--bg-base)] via-[var(--bg-surface)] to-[var(--bg-base)]
      border-b border-[var(--border-subtle)]
    ">
            {/* Logo / Brand */}
            <div className="flex items-center -ml-[148px]">
                <img
                    src={isDark ? "/logo-dark.png" : "/logo-light.png"}
                    alt="Fin-BOARD"
                    className="w-[500px] h-auto object-contain"
                />
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
                <div className="
          relative flex items-center
          bg-[var(--bg-elevated)]/60 rounded-full
          border border-[var(--border-subtle)]
          px-4 py-2.5
          focus-within:border-[var(--primary)]/50
          transition-colors
        ">
                    <Search className="w-4 h-4 text-[var(--text-muted)] mr-3" />
                    <input
                        type="text"
                        placeholder="Search bar"
                        className="
              flex-1 bg-transparent border-none outline-none
              text-[var(--text-primary)] text-sm
              placeholder:text-[var(--text-muted)]
            "
                    />
                </div>
            </div>

            {/* Right Section: Theme Toggle + User Profile */}
            <div className="flex items-center gap-6">
                {/* Theme Toggle */}
                <motion.button
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
            relative flex items-center
            w-14 h-7 rounded-full
            transition-colors duration-300
            ${isDark ? 'bg-[var(--bg-elevated)]' : 'bg-yellow-100'}
            border border-[var(--border-subtle)]
          `}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    <motion.div
                        animate={{ x: isDark ? 2 : 26 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className={`
              w-5 h-5 rounded-full
              flex items-center justify-center
              ${isDark
                                ? 'bg-[var(--primary)] text-black'
                                : 'bg-yellow-500 text-white'
                            }
            `}
                    >
                        {isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                    </motion.div>
                </motion.button>

                {/* User Info Group */}
                <div className="flex items-center gap-3">
                    <span className="text-lg font-medium text-[var(--text-primary)]">
                        Hi {userName}!
                    </span>
                    <div className="
                        w-12 h-12 rounded-full
                        bg-[#00d09c]
                        flex items-center justify-center
                        text-white font-bold text-xl
                        shadow-lg shadow-[#00d09c]/20
                    ">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
}
