'use client';

import { motion } from 'framer-motion';
import {
    Home, Wallet, BarChart3, Bell, Settings, LogOut
} from 'lucide-react';

interface SidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

const topNavItems = [
    { id: 'home', icon: Home, label: 'Dashboard' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
];

const bottomNavItems = [
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
    return (
        <aside className="
      fixed left-0 top-0 bottom-0 z-50
      flex flex-col items-center
      w-[72px] py-6
      bg-[var(--bg-base)]
    ">
            {/* Top Navigation Group */}
            <nav className="flex flex-col items-center">
                <div className="
          flex flex-col items-center gap-1 p-2
          bg-[var(--bg-elevated)]/80 rounded-full
        ">
                    {topNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <motion.button
                                key={item.id}
                                onClick={() => onSectionChange(item.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                  w-12 h-12 rounded-full
                  flex items-center justify-center
                  transition-all duration-300
                  ${isActive
                                        ? 'bg-white text-[#00d09c] shadow-lg'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                    }
                `}
                                title={item.label}
                            >
                                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                            </motion.button>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom Navigation Group */}
            <nav className="flex flex-col items-center mt-6">
                <div className="
          flex flex-col items-center gap-1 p-2
          bg-[#1a2332]/80 rounded-full
        ">
                    {bottomNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <motion.button
                                key={item.id}
                                onClick={() => onSectionChange(item.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                  w-12 h-12 rounded-full
                  flex items-center justify-center
                  transition-all duration-300
                  ${isActive
                                        ? 'bg-white text-[#00d09c] shadow-lg'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                    }
                `}
                                title={item.label}
                            >
                                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                            </motion.button>
                        );
                    })}
                </div>
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Logout Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="
          w-10 h-10 rounded-full
          flex items-center justify-center
          bg-red-500/20 text-red-500
          hover:bg-red-500/30
          transition-colors
        "
                title="Logout"
            >
                <LogOut className="w-5 h-5" />
            </motion.button>
        </aside>
    );
}
