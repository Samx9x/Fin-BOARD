'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Settings, Trash2, GripVertical, AlertCircle, TrendingUp, TrendingDown, BarChart as BarChartIcon } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Widget } from '@/types';
import { useDashboardStore } from '@/store/dashboardStore';
import { useWidgetData } from '@/hooks/useWidgetData';
import { getValueByPath, formatValue } from '@/services/apiService';

interface WidgetChartProps {
    widget: Widget;
}

type IntervalType = 'daily' | 'weekly' | 'monthly';

interface ChartPoint {
    name: string;
    value: number;
    open?: number;
    close?: number;
    high?: number;
    low?: number;
}

// Generate simulated historical data from a single current value
function generateHistoricalData(currentValue: number, interval: IntervalType, isCandlestick: boolean = false): ChartPoint[] {
    const data: ChartPoint[] = [];
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

        const baseValue = Math.max(0, i === 0 ? currentValue : trendValue);

        if (isCandlestick) {
            const spread = baseValue * 0.05; // 5% spread for OHLC
            const open = baseValue + (Math.random() - 0.5) * spread;
            const close = i === 0 ? currentValue : baseValue + (Math.random() - 0.5) * spread;
            const high = Math.max(open, close) + Math.random() * (spread * 0.5);
            const low = Math.max(0, Math.min(open, close) - Math.random() * (spread * 0.5));

            data.push({
                name: getLabel(date),
                value: close,
                open,
                close,
                high,
                low,
            });
        } else {
            data.push({
                name: getLabel(date),
                value: baseValue,
            });
        }
    }

    return data;
}

export function WidgetChart({ widget }: WidgetChartProps) {
    const { removeWidget, openAddWidgetModal, setEditingWidget, updateWidget } = useDashboardStore();
    const { data, isLoading, error, lastUpdated, refresh } = useWidgetData(widget.id);
    const [interval, setInterval] = useState<IntervalType>(widget.chartConfig?.interval || 'daily');
    const [chartData, setChartData] = useState<Record<string, any>[]>([]);

    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(widget.name);

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

    // ... (logic omitted for brevity but preserved in the actual file)
    // Actually, I need to make sure I don't break the existing logic.
    // I will use replace_file_content on the header specifically.

    // Get numeric fields for rendering
    const numericFields = useMemo(() => {
        if (!data) return [];
        return widget.selectedFields.filter(f => {
            const val = Number(getValueByPath(data, f.path));
            return !isNaN(val);
        });
    }, [data, widget.selectedFields]);

    // Extract and generate chart data
    useEffect(() => {
        if (!data) {
            setChartData([]);
            return;
        }

        // Helper to find numeric fields
        const numericFields = widget.selectedFields.filter(f => {
            const val = Number(getValueByPath(data, f.path));
            return !isNaN(val) && val > 0;
        });

        // First, try to find an array in the data for time-series extraction
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
            // Use array data if available (e.g. from an API that returns a list)
            const xField = widget.chartConfig?.xAxisField || widget.selectedFields[0]?.path || '';

            const extractedData = arr.slice(0, 30).map((item, i) => {
                const point: any = {
                    name: String(getValueByPath(item, xField.replace(/^\[0\]\.?/, '')) || `Point ${i + 1}`),
                };

                numericFields.forEach(f => {
                    const value = getValueByPath(item, f.path.replace(/^\[0\]\.?/, ''));
                    const numValue = value != null ? Number(value) : 0;
                    point[f.label] = isNaN(numValue) ? 0 : numValue;
                });

                return point;
            }).reverse();

            setChartData(extractedData);
        } else {
            // For single value APIs, generate simulated historical data for all numeric fields
            if (numericFields.length === 0) {
                setChartData([]);
                return;
            }

            const now = new Date();
            let points: number;
            let getLabel: (date: Date) => string;
            let getOffset: (i: number) => number;

            switch (interval) {
                case 'daily': points = 24; getLabel = (d) => `${d.getHours()}:00`; getOffset = (i) => i * 3600000; break;
                case 'weekly': points = 7; getLabel = (d) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]; getOffset = (i) => i * 86400000; break;
                default: points = 30; getLabel = (d) => `${d.getMonth() + 1}/${d.getDate()}`; getOffset = (i) => i * 86400000; break;
            }

            const generatedData: any[] = [];
            const isCandlestick = widget.chartConfig?.type === 'candlestick';

            for (let i = points - 1; i >= 0; i--) {
                const date = new Date(now.getTime() - getOffset(i));
                const point: any = { name: getLabel(date) };

                numericFields.forEach(f => {
                    const rawValue = getValueByPath(data, f.path);
                    const currentVal = rawValue != null ? Number(rawValue) : 0;
                    const safeCurrentVal = isNaN(currentVal) ? 0 : currentVal;

                    const variance = safeCurrentVal * 0.1;
                    const progress = (points - 1 - i) / (points - 1);
                    const randomWalk = (Math.random() - 0.5) * variance;
                    const val = safeCurrentVal - variance * 0.5 + (variance * 0.5 * progress) + randomWalk;

                    point[f.label] = Math.max(0, i === 0 ? safeCurrentVal : val);

                    if (isCandlestick && numericFields.length === 1) {
                        const spread = point[f.label] * 0.05;
                        point.open = point[f.label] + (Math.random() - 0.5) * spread;
                        point.high = Math.max(point.open, point[f.label]) + Math.random() * (spread * 0.5);
                        point.low = Math.max(0, Math.min(point.open, point[f.label]) - Math.random() * (spread * 0.5));
                        point.close = i === 0 ? safeCurrentVal : point[f.label];
                    }
                });

                generatedData.push(point);
            }

            // Final validation: ensure no NaN values
            const validatedData = generatedData.map(point => {
                const validPoint: any = { name: point.name };
                Object.keys(point).forEach(key => {
                    if (key !== 'name') {
                        const value = point[key];
                        validPoint[key] = (typeof value === 'number' && !isNaN(value)) ? value : 0;
                    }
                });
                return validPoint;
            });

            setChartData(validatedData);
        }
    }, [data, widget.chartConfig, widget.selectedFields, interval]);

    // Trend info based on the first numeric field
    const trendInfo = useMemo(() => {
        if (chartData.length < 2 || numericFields.length === 0) return { isUp: true, percent: 0 };
        const primaryLabel = numericFields[0].label;

        const first = Number(chartData[0][primaryLabel]) || 0;
        const last = Number(chartData[chartData.length - 1][primaryLabel]) || 0;
        if (first === 0) return { isUp: true, percent: 0 };
        const change = ((last - first) / first) * 100;
        return { isUp: change >= 0, percent: Math.abs(change).toFixed(2) };
    }, [chartData, numericFields]);

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

    // Get current value (first numeric field preferred)
    const currentValue = useMemo(() => {
        if (!data || numericFields.length === 0) return null;
        const field = numericFields[0];
        const value = getValueByPath(data, field.path);
        return formatValue(value, field.format);
    }, [data, numericFields]);

    const chartType = widget.chartConfig?.type || 'area';
    const chartColors = ['var(--primary)', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

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
                <div className="flex items-center justify-between p-3 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="drag-handle cursor-grab active:cursor-grabbing p-1 hover:bg-[var(--bg-elevated)] rounded shrink-0">
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
                                    className="bg-[var(--bg-elevated)] text-[var(--text-primary)] px-2 py-0.5 rounded border border-[var(--primary)] outline-none text-xs font-semibold w-full"
                                />
                            ) : (
                                <h3
                                    className="font-semibold text-[var(--text-primary)] truncate max-w-[100px] text-sm cursor-text hover:text-[var(--primary)] transition-colors"
                                    onClick={() => setIsEditingName(true)}
                                    title="Click to rename"
                                >
                                    {widget.name}
                                </h3>
                            )}
                            <span className="badge badge-chart text-xs shrink-0">Chart</span>
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
                            <p className="text-xl font-bold text-[var(--text-primary)]">{currentValue as string}</p>
                            <p className="text-xs text-[var(--text-muted)]">{numericFields[0]?.label || 'Value'}</p>
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

                {/* Chart Main Area */}
                <div className="flex-1 p-3 overflow-hidden">
                    {widget.selectedFields.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">
                            <BarChartIcon className="w-8 h-8 text-[var(--text-muted)] mb-3 opacity-20" />
                            <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">No data points selected</p>
                            <p className="text-xs text-[var(--text-muted)] mb-4">Please configure chart fields</p>
                            <button
                                onClick={handleEdit}
                                className="btn btn-primary py-1.5 px-4 text-xs shadow-none"
                            >
                                Configure Chart
                            </button>
                        </div>
                    ) : error ? (
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
                                        formatter={(value: any, name: any) => [`$${Number(value).toLocaleString()}`, name]}
                                    />
                                    {numericFields.map((field, idx) => (
                                        <Line
                                            key={field.path}
                                            type="monotone"
                                            dataKey={field.label}
                                            stroke={chartColors[idx % chartColors.length]}
                                            strokeWidth="var(--chart-line-width)"
                                            dot={false}
                                            activeDot={{ r: 4, fill: chartColors[idx % chartColors.length] }}
                                        />
                                    ))}
                                </LineChart>
                            ) : chartType === 'candlestick' ? (
                                <AreaChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
                                        axisLine={false}
                                        tickLine={false}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        domain={['auto', 'auto']}
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
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const d = payload[0].payload;
                                                return (
                                                    <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] p-2 rounded-lg text-[10px] space-y-1">
                                                        <p className="font-bold border-b border-[var(--border-subtle)] pb-1 mb-1">{d.name}</p>
                                                        <div className="grid grid-cols-2 gap-x-4">
                                                            <span className="text-[var(--text-muted)]">Open:</span> <span className="text-right">${d.open?.toFixed(2)}</span>
                                                            <span className="text-[var(--text-muted)]">High:</span> <span className="text-right text-[var(--success)]">${d.high?.toFixed(2)}</span>
                                                            <span className="text-[var(--text-muted)]">Low:</span> <span className="text-right text-[var(--error)]">${d.low?.toFixed(2)}</span>
                                                            <span className="text-[var(--text-muted)]">Close:</span> <span className="text-right font-bold">${d.close?.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="high"
                                        stroke="transparent"
                                        fill="var(--success)"
                                        fillOpacity={0.1}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="low"
                                        stroke="transparent"
                                        fill="var(--error)"
                                        fillOpacity={0.1}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey={numericFields[0]?.label || 'value'}
                                        stroke="var(--primary)"
                                        strokeWidth="var(--chart-line-width)"
                                        dot={false}
                                    />
                                </AreaChart>
                            ) : (
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id={`gradient-${widget.id}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity="var(--chart-fill-opacity)" />
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
                                        formatter={(value: any, name: any) => [`$${Number(value).toLocaleString()}`, name]}
                                    />
                                    {numericFields.map((field, idx) => (
                                        <Area
                                            key={field.path}
                                            type="monotone"
                                            dataKey={field.label}
                                            stroke={chartColors[idx % chartColors.length]}
                                            strokeWidth="var(--chart-line-width)"
                                            fillOpacity={idx === 0 ? 1 : 0}
                                            fill={idx === 0 ? `url(#gradient-${widget.id})` : 'transparent'}
                                        />
                                    ))}
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
