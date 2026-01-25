'use client';

import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Settings, Trash2, GripVertical, AlertCircle } from 'lucide-react';
import { Widget, SelectedField } from '@/types';
import { useDashboardStore } from '@/store/dashboardStore';
import { useWidgetData } from '@/hooks/useWidgetData';
import { getValueByPath, formatValue } from '@/services/apiService';

interface WidgetCardProps {
    widget: Widget;
}

export function WidgetCard({ widget }: WidgetCardProps) {
    const { removeWidget, openAddWidgetModal, setEditingWidget } = useDashboardStore();
    const { data, isLoading, error, lastUpdated, refresh } = useWidgetData(widget.id);
    const cardRef = useRef<HTMLDivElement>(null);

    // 3D tilt effect
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        cardRef.current.style.setProperty('--rx', `${rotateX}deg`);
        cardRef.current.style.setProperty('--ry', `${rotateY}deg`);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!cardRef.current) return;
        cardRef.current.style.setProperty('--rx', '0deg');
        cardRef.current.style.setProperty('--ry', '0deg');
    }, []);

    const handleEdit = () => {
        setEditingWidget(widget);
        openAddWidgetModal();
    };

    const formatLastUpdated = (date: string | null) => {
        if (!date) return 'Never';
        const d = new Date(date);
        return d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getDisplayValue = (field: SelectedField) => {
        if (!data) return '-';
        const value = getValueByPath(data, field.path);
        return formatValue(value, field.format);
    };

    return (
        <motion.div
            ref={cardRef}
            className="card-3d h-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            <div className="
        h-full glass overflow-hidden
        flex flex-col
        hover:border-[var(--border-hover)]
        transition-colors duration-300
      ">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-3">
                        <div className="drag-handle cursor-grab active:cursor-grabbing">
                            <GripVertical className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>

                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[var(--text-primary)] truncate max-w-[150px]">
                                {widget.name}
                            </h3>
                            <span className="badge badge-live flex items-center gap-1">
                                <span className="pulse-dot" />
                                Live
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <motion.button
                            onClick={refresh}
                            className="widget-action"
                            title="Refresh"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9, rotate: 180 }}
                            disabled={isLoading}
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </motion.button>

                        <motion.button
                            onClick={handleEdit}
                            className="widget-action"
                            title="Settings"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Settings className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                            onClick={() => removeWidget(widget.id)}
                            className="widget-action danger"
                            title="Delete"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <AlertCircle className="w-8 h-8 text-[var(--error)] mb-2" />
                            <p className="text-sm text-[var(--error)]">{error}</p>
                            <button
                                onClick={refresh}
                                className="mt-3 text-xs text-[var(--primary)] hover:underline"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : isLoading && !data ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="shimmer h-4 w-20 rounded" />
                                    <div className="shimmer h-5 w-32 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {widget.selectedFields.map((field) => (
                                <div key={field.path} className="flex justify-between items-center">
                                    <span className="text-sm text-[var(--text-secondary)] truncate max-w-[40%]">
                                        {field.label}
                                    </span>
                                    <motion.span
                                        key={String(getValueByPath(data, field.path))}
                                        initial={{ opacity: 0.5, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="font-mono font-semibold text-[var(--text-primary)] truncate max-w-[55%]"
                                    >
                                        {getDisplayValue(field)}
                                    </motion.span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/50">
                    <p className="text-xs text-[var(--text-muted)]">
                        Last updated: {formatLastUpdated(lastUpdated ?? null)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
