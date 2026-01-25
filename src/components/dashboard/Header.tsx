'use client';

import { useDashboardStore } from '@/store/dashboardStore';
import { Plus, Download, Upload, Sun, Moon, LayoutTemplate, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

interface HeaderProps {
    onOpenTemplates: () => void;
}

export function Header({ onOpenTemplates }: HeaderProps) {
    const { widgets, theme, openAddWidgetModal, toggleTheme, exportConfig, importConfig, addToast } = useDashboardStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showMenu, setShowMenu] = useState(false);

    const handleExport = () => {
        const config = exportConfig();
        const blob = new Blob([config], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finboard-config-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        addToast({
            type: 'success',
            title: 'Config Exported',
            message: 'Dashboard configuration has been downloaded',
        });
        setShowMenu(false);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            importConfig(content);
        };
        reader.readAsText(file);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setShowMenu(false);
    };

    return (
        <header className="sticky top-0 z-40 glass border-b border-[var(--border-subtle)] ml-[72px]">
            <div className="max-w-[1600px] mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Title & Breadcrumb */}
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                            My Dashboard
                        </h1>
                        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                            {widgets.length > 0
                                ? `${widgets.length} active widget${widgets.length > 1 ? 's' : ''} • Real-time data`
                                : 'Connect to APIs and build your custom dashboard'
                            }
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Browse Templates Button */}
                        <motion.button
                            onClick={onOpenTemplates}
                            className="btn btn-secondary"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <LayoutTemplate className="w-4 h-4" />
                            <span>Browse Templates</span>
                        </motion.button>

                        {/* Theme Toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            className="widget-action"
                            title="Toggle Theme"
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <AnimatePresence mode="wait">
                                {theme === 'dark' ? (
                                    <motion.div
                                        key="sun"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Sun className="w-5 h-5 text-yellow-400" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="moon"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Moon className="w-5 h-5 text-indigo-400" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* More Menu */}
                        <div className="relative">
                            <motion.button
                                onClick={() => setShowMenu(!showMenu)}
                                className="widget-action"
                                title="More Options"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <MoreVertical className="w-5 h-5" />
                            </motion.button>

                            <AnimatePresence>
                                {showMenu && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setShowMenu(false)}
                                            className="fixed inset-0 z-40"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="
                        absolute right-0 top-full mt-2 z-50
                        w-48 py-2
                        glass-strong rounded-lg
                        shadow-lg
                      "
                                        >
                                            <button
                                                onClick={handleExport}
                                                className="
                          w-full flex items-center gap-2 px-4 py-2
                          text-sm text-[var(--text-primary)]
                          hover:bg-[var(--bg-elevated)]
                        "
                                            >
                                                <Download className="w-4 h-4" />
                                                Export Config
                                            </button>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="
                          w-full flex items-center gap-2 px-4 py-2
                          text-sm text-[var(--text-primary)]
                          hover:bg-[var(--bg-elevated)]
                        "
                                            >
                                                <Upload className="w-4 h-4" />
                                                Import Config
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                            />
                        </div>

                        {/* Add Widget Button */}
                        <motion.button
                            onClick={openAddWidgetModal}
                            className="btn btn-primary ripple"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Widget</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </header>
    );
}
