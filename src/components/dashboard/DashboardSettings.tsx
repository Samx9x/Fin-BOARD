'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Download, Upload, Trash2, Sun, Moon, X, Shield } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';

export function DashboardSettings() {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme, exportConfig, importConfig, widgets, updateLayout, openSettingsModal } = useDashboardStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const config = exportConfig();
        const blob = new Blob([config], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finboard_config_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsOpen(false);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (importConfig(content)) {
                setIsOpen(false);
            }
        };
        reader.readAsText(file);
        // Clear input
        e.target.value = '';
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to clear all widgets? This will reset your dashboard.')) {
            useDashboardStore.setState({ widgets: [], layout: [] });
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                    p-2.5 bg-[var(--bg-elevated)] text-[var(--text-primary)]
                    border border-[var(--border-subtle)] rounded-xl
                    hover:border-[var(--primary)] transition-colors
                "
                title="Dashboard Settings"
            >
                <Settings className={`w-4 h-4 ${isOpen ? 'rotate-90' : ''} transition-transform duration-300`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-[60]"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10, x: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="
                                absolute right-0 mt-3 w-64 z-[70]
                                bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                                rounded-2xl shadow-2xl overflow-hidden glass
                            "
                        >
                            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
                                <h3 className="font-semibold text-sm">Dashboard Options</h3>
                                <button onClick={() => setIsOpen(false)} className="text-[var(--text-muted)] hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-2 space-y-1">
                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center justify-between p-3 hover:bg-[var(--bg-surface)]/50 rounded-xl transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        {theme === 'dark' ? <Sun className="w-4 h-4 text-orange-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
                                        <span className="text-sm">Appearance</span>
                                    </div>
                                    <span className="text-xs text-[var(--text-muted)] uppercase font-semibold group-hover:text-[var(--primary)] transition-colors">
                                        {theme === 'dark' ? 'Light' : 'Dark'}
                                    </span>
                                </button>

                                <button
                                    onClick={() => {
                                        openSettingsModal();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-[var(--bg-surface)]/50 rounded-xl transition-colors"
                                >
                                    <Shield className="w-4 h-4 text-[var(--primary)]" />
                                    <div className="text-left">
                                        <p className="text-sm">Profile & API Keys</p>
                                        <p className="text-[10px] text-[var(--text-muted)]">Manage name and security</p>
                                    </div>
                                </button>

                                <button
                                    onClick={handleExport}
                                    disabled={widgets.length === 0}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-[var(--bg-surface)]/50 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Download className="w-4 h-4 text-emerald-400" />
                                    <div className="text-left">
                                        <p className="text-sm">Export Config</p>
                                        <p className="text-[10px] text-[var(--text-muted)]">Download as .json</p>
                                    </div>
                                </button>

                                <button
                                    onClick={handleImportClick}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-[var(--bg-surface)]/50 rounded-xl transition-colors"
                                >
                                    <Upload className="w-4 h-4 text-blue-400" />
                                    <div className="text-left">
                                        <p className="text-sm">Import Config</p>
                                        <p className="text-[10px] text-[var(--text-muted)]">Restore from file</p>
                                    </div>
                                </button>

                                <div className="h-px bg-[var(--border-subtle)] my-2 mx-2" />

                                <button
                                    onClick={handleClear}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <div className="text-left">
                                        <p className="text-sm">Clear Board</p>
                                        <p className="text-[10px] opacity-60 font-medium italic">Destructive action</p>
                                    </div>
                                </button>
                            </div>

                            <div className="p-3 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
                                <p className="text-[10px] text-center text-[var(--text-muted)] truncate">
                                    Last Persisted: {new Date().toLocaleTimeString()}
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
            />
        </div>
    );
}
