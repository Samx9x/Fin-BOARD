'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, Download, X } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';

interface ClearConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ClearConfirmModal({ isOpen, onClose }: ClearConfirmModalProps) {
    const { clearAllWidgets, exportConfig, widgets } = useDashboardStore();
    const [step, setStep] = useState<'confirm' | 'saved'>('confirm');

    const handleExportFirst = () => {
        const config = exportConfig();
        const blob = new Blob([config], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finboard-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setStep('saved');
    };

    const handleClearNow = () => {
        clearAllWidgets();
        onClose();
        setStep('confirm');
    };

    const handleClose = () => {
        onClose();
        setStep('confirm');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md mx-4 p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-2xl"
                >
                    {step === 'confirm' ? (
                        <>
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 rounded-full bg-red-500/10">
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                                        Clear All Widgets?
                                    </h2>
                                    <p className="text-[var(--text-secondary)] text-sm">
                                        This will remove all {widgets.length} widget{widgets.length !== 1 ? 's' : ''} from your dashboard. This action cannot be undone.
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleExportFirst}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[var(--accent-primary)] hover:opacity-90 text-white font-medium transition-opacity"
                                >
                                    <Download className="w-4 h-4" />
                                    Save Config First, Then Clear
                                </button>
                                <button
                                    onClick={handleClearNow}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear Without Saving
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="w-full py-3 px-4 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-base)] text-[var(--text-secondary)] font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Saved - now confirm clear */}
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <Download className="w-6 h-6 text-green-500" />
                                </div>
                                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                                    Config Saved! ✅
                                </h2>
                                <p className="text-[var(--text-secondary)] text-sm">
                                    Your configuration has been downloaded. Ready to clear?
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleClearNow}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear All Widgets Now
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="w-full py-3 px-4 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-base)] text-[var(--text-secondary)] font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
