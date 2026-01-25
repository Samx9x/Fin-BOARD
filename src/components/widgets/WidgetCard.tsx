'use client';

import { useRef, useCallback, useState } from 'react';
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
    const { removeWidget, openAddWidgetModal, setEditingWidget, updateWidget } = useDashboardStore();
    const { data, isLoading, error, lastUpdated, refresh } = useWidgetData(widget.id);
    const cardRef = useRef<HTMLDivElement>(null);

    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(widget.name);

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

    const handleNameSave = () => {
        if (editedName.trim() && editedName !== widget.name) {
            updateWidget(widget.id, { name: editedName.trim() });
        }
        setIsEditingName(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleNameSave();
        if (e.key === 'Escape') {
            setEditedName(widget.name);
            setIsEditingName(false);
        }
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
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="drag-handle cursor-grab active:cursor-grabbing shrink-0">
                            <GripVertical className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>

                        <div className="flex items-center gap-2 overflow-hidden">
                            {isEditingName ? (
                                <input
                                    autoFocus
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    onBlur={handleNameSave}
                                    onKeyDown={handleKeyDown}
                                    className="bg-[var(--bg-elevated)] text-[var(--text-primary)] px-2 py-0.5 rounded border border-[var(--primary)] outline-none text-sm font-semibold w-full"
                                />
                            ) : (
                                <h3
                                    className="font-semibold text-[var(--text-primary)] truncate max-w-[120px] cursor-text hover:text-[var(--primary)] transition-colors"
                                    onClick={() => setIsEditingName(true)}
                                    title="Click to rename"
                                >
                                    {widget.name}
                                </h3>
                            )}
                            <span className="badge badge-live flex items-center gap-1 shrink-0">
                                <span className="pulse-dot" />
                                Live
                            </span>
                        </div>
                        {widget.description && (
                            <p className="text-[10px] text-[var(--text-muted)] truncate max-w-[200px] mt-0.5" title={widget.description}>
                                {widget.description}
                            </p>
                        )}
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
                <div className="flex-1 p-4 flex flex-col justify-center">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">
                            <AlertCircle className="w-8 h-8 text-[var(--error)] mb-2 opacity-50" />
                            <p className="text-xs text-[var(--error)] font-medium mb-1">Failed to load data</p>
                            <p className="text-[10px] text-[var(--text-muted)] leading-tight mb-3 italic">{error}</p>
                            <button
                                onClick={refresh}
                                className="btn btn-ghost py-1 px-3 text-[10px] border border-[var(--error-border)] text-[var(--error)] hover:bg-[var(--error-subtle)]"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : widget.selectedFields.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <Settings className="w-8 h-8 text-[var(--text-muted)] mb-3 opacity-20" />
                            <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">No metrics selected</p>
                            <p className="text-xs text-[var(--text-muted)] mb-4">Please configure fields to display</p>
                            <button
                                onClick={handleEdit}
                                className="btn btn-primary py-1.5 px-4 text-xs shadow-none"
                            >
                                Configure Fields
                            </button>
                        </div>
                    ) : isLoading && !data ? (
                        <div className="space-y-4">
                            <div className="text-center py-2">
                                <div className="shimmer h-3 w-24 mx-auto rounded mb-2" />
                                <div className="shimmer h-8 w-32 mx-auto rounded" />
                            </div>
                            {widget.selectedFields.length > 1 && (
                                <div className="space-y-3 pt-2">
                                    {[...Array(Math.min(widget.selectedFields.length - 1, 3))].map((_, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div className="shimmer h-3 w-20 rounded" />
                                            <div className="shimmer h-4 w-16 rounded" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {widget.selectedFields.length === 1 ? (
                                <div className="text-center py-2">
                                    <p className="text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wider">
                                        {widget.selectedFields[0].label}
                                    </p>
                                    <motion.p
                                        key={String(getValueByPath(data, widget.selectedFields[0].path))}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-3xl font-bold text-[var(--text-primary)] tracking-tight"
                                    >
                                        {getDisplayValue(widget.selectedFields[0])}
                                    </motion.p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {widget.selectedFields.map((field) => (
                                        <div key={field.path} className="flex justify-between items-center group/field">
                                            <span className="text-sm text-[var(--text-secondary)] truncate max-w-[45%] group-hover/field:text-[var(--text-primary)] transition-colors">
                                                {field.label}
                                            </span>
                                            <motion.span
                                                key={String(getValueByPath(data, field.path))}
                                                initial={{ opacity: 0.5, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="font-mono font-semibold text-[var(--text-primary)] truncate max-w-[50%] bg-[var(--bg-elevated)] px-2 py-0.5 rounded border border-transparent group-hover/field:border-[var(--border-subtle)]"
                                            >
                                                {getDisplayValue(field)}
                                            </motion.span>
                                        </div>
                                    ))}
                                </div>
                            )}
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
