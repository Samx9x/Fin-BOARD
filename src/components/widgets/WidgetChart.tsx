'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Settings, Trash2, GripVertical, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Widget } from '@/types';
import { useDashboardStore } from '@/store/dashboardStore';
import { useWidgetData } from '@/hooks/useWidgetData';
import { getValueByPath } from '@/services/apiService';

interface WidgetChartProps {
    widget: Widget;
}

type IntervalType = 'daily' | 'weekly' | 'monthly';

// Generate simulated historical data from a single current value
function generateHistoricalData(currentValue: number, interval: IntervalType): { name: string; value: number }[] {
    const data: { name: string; value: number }[] = [];
    const now = new Date();

    let points: number;
    let getLabel: (date: Date) => string;
    let getOffset: (i: number) => number;

    switch (interval) {
        case 'daily':
            points = 24;
            getLabel = (d) => `${d.getHours()}:00`;
            getOffset = (i) => i * 60 * 60 * 1000; // hours
            break;
        case 'weekly':
            points = 7;
            getLabel = (d) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
            getOffset = (i) => i * 24 * 60 * 60 * 1000; // days
            break;
        case 'monthly':
            points = 30;
            getLabel = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
            getOffset = (i) => i * 24 * 60 * 60 * 1000; // days
            break;
    }

    // Generate values around the current value with some variance
    const variance = currentValue * 0.15; // 15% variance

    for (let i = points - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - getOffset(i));
        // Create a somewhat realistic trend that ends at current value
        const progress = (points - 1 - i) / (points - 1); // 0 to 1
        const randomWalk = (Math.random() - 0.5) * variance;
        const trendValue = currentValue - variance * 0.5 + (variance * 0.5 * progress) + randomWalk;

        data.push({
            name: getLabel(date),
            value: Math.max(0, i === 0 ? currentValue : trendValue),
        });
    }

    return data;
}

export function WidgetChart({ widget }: WidgetChartProps) {
    const { removeWidget, openAddWidgetModal, setEditingWidget } = useDashboardStore();
    const { data, isLoading, error, lastUpdated, refresh } = useWidgetData(widget.id);
    const [interval, setInterval] = useState<IntervalType>(widget.chartConfig?.interval || 'daily');
    const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

    // Extract and generate chart data
    useEffect(() => {
        if (!data) {
            setChartData([]);
            return;
        }

        // First, try to find an array in the data
        const findArray = (obj: unknown): unknown[] | null => {
            if (Array.isArray(obj)) return obj;
            if (typeof obj === 'object' && obj !== null) {
                for (const value of Object.values(obj)) {
                    const result = findArray(value);
                    if (result) return result;
                }
            }
            return null;
        };

        const arr = findArray(data);

        if (arr && arr.length > 1) {
            // Use array data if available
            const xField = widget.chartConfig?.xAxisField || widget.selectedFields[0]?.path || '';
            const yField = widget.chartConfig?.yAxisField || widget.selectedFields[1]?.path || widget.selectedFields[0]?.path || '';

            const extractedData = arr.slice(0, 30).map((item, i) => ({
                name: String(getValueByPath(item, xField.replace(/^\[0\]\.?/, '')) || `Point ${i + 1}`),
                value: Number(getValueByPath(item, yField.replace(/^\[0\]\.?/, ''))) || 0,
            })).reverse();

            setChartData(extractedData);
        } else {
            // For single value APIs (like Coinbase spot price), generate historical data
            const primaryField = widget.selectedFields[0]?.path;
            if (primaryField) {
                const currentValue = Number(getValueByPath(data, primaryField));
                if (!isNaN(currentValue) && currentValue > 0) {
                    const historicalData = generateHistoricalData(currentValue, interval);
                    setChartData(historicalData);
                } else {
                    setChartData([]);
                }
            } else {
                setChartData([]);
            }
        }
    }, [data, widget.chartConfig, widget.selectedFields, interval]);

    // Get trend info
    const trendInfo = useMemo(() => {
        if (chartData.length < 2) return { isUp: true, percent: 0 };
        const first = chartData[0].value;
        const last = chartData[chartData.length - 1].value;
        const change = ((last - first) / first) * 100;
        return { isUp: change >= 0, percent: Math.abs(change).toFixed(2) };
    }, [chartData]);

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

    // Get current value
    const currentValue = useMemo(() => {
        if (!data || !widget.selectedFields[0]) return null;
        const value = getValueByPath(data, widget.selectedFields[0].path);
        const num = Number(value);
        if (isNaN(num)) return value;
        return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }, [data, widget.selectedFields]);

    const chartType = widget.chartConfig?.type || 'area';

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
                <div className="flex items-center justify-between p-3 border-b border-[var(--border-subtle)]" key={widget.id}>
                    <div className="flex items-center gap-2">
                        <div className="drag-handle cursor-grab active:cursor-grabbing p-1 hover:bg-[var(--bg-elevated)] rounded">
                            <GripVertical className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>

                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[var(--text-primary)] truncate max-w-[120px] text-sm">
                                {widget.name}
                            </h3>
                            <span className="badge badge-chart text-xs">Chart</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <motion.button
                            onClick={refresh}
                            className="widget-action p-1.5"
                            title="Refresh"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9, rotate: 180 }}
                            disabled={isLoading}
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        </motion.button>

                        <motion.button
                            onClick={handleEdit}
                            className="widget-action p-1.5"
                            title="Settings"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Settings className="w-3.5 h-3.5" />
                        </motion.button>

                        <motion.button
                            onClick={() => removeWidget(widget.id)}
                            className="widget-action danger p-1.5"
                            title="Delete"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                    </div>
                </div>

                {/* Current Value + Trend */}
                {currentValue && (
                    <div className="px-4 py-2 border-b border-[var(--border-subtle)] flex items-center justify-between">
                        <div>
                            <p className="text-xl font-bold text-[var(--text-primary)]">${currentValue as any}</p>
                            <p className="text-xs text-[var(--text-muted)]">{(widget.selectedFields[0]?.label as any) || 'Value'}</p>
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${trendInfo.isUp ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                            {trendInfo.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span>{trendInfo.percent}%</span>
                        </div>
                    </div>
                )}

                {/* Interval Selector */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--border-subtle)]">
                    {(['daily', 'weekly', 'monthly'] as IntervalType[]).map((int) => (
                        <button
                            key={int}
                            onClick={() => setInterval(int)}
                            className={`
                px-3 py-1 text-xs rounded-md transition-all
                ${interval === int
                                    ? 'bg-[var(--primary)] text-black font-medium'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                                }
              `}
                        >
                            {int.charAt(0).toUpperCase() + int.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Chart Content */}
                <div className="flex-1 p-3 min-h-[150px]">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <AlertCircle className="w-6 h-6 text-[var(--error)] mb-2" />
                            <p className="text-xs text-[var(--error)]">{error}</p>
                            <button
                                onClick={refresh}
                                className="mt-2 text-xs text-[var(--primary)] hover:underline"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : isLoading && chartData.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="shimmer w-full h-full rounded" />
                        </div>
                    ) : chartData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
                            <p className="text-xs">No chart data available</p>
                            <p className="text-xs mt-1">Try refreshing or selecting different fields</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === 'line' ? (
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
                                        axisLine={false}
                                        tickLine={false}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={40}
                                        tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--bg-elevated)',
                                            border: '1px solid var(--border-default)',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                        }}
                                        formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Value']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="var(--primary)"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4, fill: 'var(--primary)' }}
                                    />
                                </LineChart>
                            ) : (
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id={`gradient-${widget.id}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
                                        axisLine={false}
                                        tickLine={false}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={40}
                                        tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--bg-elevated)',
                                            border: '1px solid var(--border-default)',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                        }}
                                        formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Value']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="var(--primary)"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill={`url(#gradient-${widget.id})`}
                                    />
                                </AreaChart>
                            )}
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Footer */}
                <div className="px-3 py-1.5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/50">
                    <p className="text-xs text-[var(--text-muted)]">
                        Last updated: {formatLastUpdated(lastUpdated ?? null)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
