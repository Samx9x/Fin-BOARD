'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Settings, Trash2, GripVertical, Search, ChevronLeft, ChevronRight, ArrowUpDown, AlertCircle } from 'lucide-react';
import { Widget } from '@/types';
import { useDashboardStore } from '@/store/dashboardStore';
import { useWidgetData } from '@/hooks/useWidgetData';
import { getValueByPath, formatValue } from '@/services/apiService';

interface WidgetTableProps {
    widget: Widget;
}

export function WidgetTable({ widget }: WidgetTableProps) {
    const { removeWidget, openAddWidgetModal, setEditingWidget } = useDashboardStore();
    const { data, isLoading, error, lastUpdated, refresh } = useWidgetData(widget.id);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const ITEMS_PER_PAGE = 6;

    // Extract array data for table
    const tableData = useMemo(() => {
        if (!data) return [];

        // Find the first array in the data
        const findArray = (obj: unknown, path = ''): { array: unknown[]; path: string } | null => {
            if (Array.isArray(obj)) {
                return { array: obj, path };
            }
            if (typeof obj === 'object' && obj !== null) {
                for (const [key, value] of Object.entries(obj)) {
                    const result = findArray(value, path ? `${path}.${key}` : key);
                    if (result) return result;
                }
            }
            return null;
        };

        const result = findArray(data);
        return result?.array || [];
    }, [data]);

    // Filter and sort data
    const processedData = useMemo(() => {
        let filtered = [...tableData];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(item =>
                JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort
        if (sortField) {
            filtered.sort((a, b) => {
                const aVal = getValueByPath(a, sortField);
                const bVal = getValueByPath(b, sortField);

                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
                }

                const aStr = String(aVal || '');
                const bStr = String(bVal || '');
                return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
            });
        }

        return filtered;
    }, [tableData, searchQuery, sortField, sortDir]);

    // Pagination
    const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
    const paginatedData = processedData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

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

    const columns = widget.selectedFields.map(f => ({
        key: f.path.split('.').pop() || f.path,
        path: f.path.replace(/^\[0\]\.?/, ''),
        label: f.label,
        format: f.format,
    }));

    return (
        <motion.div
            className="h-full"
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
                            <span className="badge badge-table">Table</span>
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

                {/* Search & Info Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search table..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="input pl-9 py-2 text-sm"
                        />
                    </div>

                    <p className="text-xs text-[var(--text-muted)]">
                        {processedData.length} of {tableData.length} items
                    </p>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-auto">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <AlertCircle className="w-8 h-8 text-[var(--error)] mb-2" />
                            <p className="text-sm text-[var(--error)]">{error}</p>
                            <button
                                onClick={refresh}
                                className="mt-3 text-xs text-[var(--primary)] hover:underline"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : isLoading && tableData.length === 0 ? (
                        <div className="p-4 space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="shimmer h-10 rounded" />
                            ))}
                        </div>
                    ) : tableData.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
                            No data available
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead className="sticky top-0 bg-[var(--bg-surface)] z-10">
                                <tr>
                                    {columns.map((col) => (
                                        <th
                                            key={col.key}
                                            onClick={() => handleSort(col.path)}
                                            className="cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                                        >
                                            <div className="flex items-center gap-1">
                                                {col.label}
                                                <ArrowUpDown className={`w-3 h-3 ${sortField === col.path ? 'text-[var(--primary)]' : ''}`} />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((row, i) => (
                                    <motion.tr
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        {columns.map((col) => (
                                            <td key={col.key}>
                                                {formatValue(getValueByPath(row, col.path), col.format)}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer with Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/50">
                    <p className="text-xs text-[var(--text-muted)]">
                        Last updated: {formatLastUpdated(lastUpdated ?? null)}
                    </p>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="widget-action disabled:opacity-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <span className="text-xs text-[var(--text-secondary)]">
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="widget-action disabled:opacity-50"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
