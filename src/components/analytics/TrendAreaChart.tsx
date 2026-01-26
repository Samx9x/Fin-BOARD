'use client';

import { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrendData {
    name: string;
    [key: string]: string | number;
}

interface TrendAreaChartProps {
    title: string;
    data: TrendData[];
    items: string[];
    colors: Record<string, string>;
}

export function TrendAreaChart({ title, data, items, colors }: TrendAreaChartProps) {
    const [selectedItems, setSelectedItems] = useState(items.slice(0, 3));
    const [showDropdown, setShowDropdown] = useState(false);
    const [hoveredPoint, setHoveredPoint] = useState<{ month: string; x: number } | null>(null);

    const availableItems = items.filter(item => !selectedItems.includes(item));

    const toggleItem = (item: string) => {
        if (selectedItems.includes(item)) {
            if (selectedItems.length > 1) {
                setSelectedItems(selectedItems.filter(i => i !== item));
            }
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    // Calculate max value across all selected items
    const maxValue = Math.max(
        ...data.flatMap(d => selectedItems.map(item => d[item] as number))
    );

    // Generate path for a line
    const generatePath = (item: string) => {
        const points = data.map((d, i) => {
            const x = 70 + (i * (520 / (data.length - 1)));
            const value = d[item] as number;
            const y = 240 - ((value / maxValue) * 200);
            return { x, y };
        });

        return points.map((point, i) =>
            i === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
        ).join(' ');
    };

    // Generate area path (path + close to bottom)
    const generateAreaPath = (item: string) => {
        const linePath = generatePath(item);
        const lastPoint = 70 + ((data.length - 1) * (520 / (data.length - 1)));
        return `${linePath} L ${lastPoint} 240 L 70 240 Z`;
    };

    return (
        <div className="bg-[var(--bg-surface)]/60 rounded-2xl border border-[var(--border-subtle)] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>

                {/* Add Button */}
                <div className="relative">
                    <motion.button
                        onClick={() => setShowDropdown(!showDropdown)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={availableItems.length === 0}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[var(--bg-elevated)] rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50"
                    >
                        <Plus className="w-3 h-3" />
                        Add
                        <ChevronDown className="w-3 h-3" />
                    </motion.button>

                    <AnimatePresence>
                        {showDropdown && availableItems.length > 0 && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowDropdown(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 top-full mt-2 z-50 w-28 py-2 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)] shadow-lg"
                                >
                                    {availableItems.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => {
                                                toggleItem(item);
                                                setShowDropdown(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                                        >
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: colors[item] }}
                                            />
                                            {item}
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Selected Items */}
            <div className="flex flex-wrap gap-2 mb-4">
                {selectedItems.map((item) => (
                    <motion.span
                        key={item}
                        layout
                        className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--bg-elevated)] rounded-lg text-xs"
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colors[item] }}
                        />
                        <span className="text-[var(--text-primary)]">{item}</span>
                        {selectedItems.length > 1 && (
                            <button
                                onClick={() => toggleItem(item)}
                                className="p-0.5 rounded hover:bg-[var(--error)]/20 text-[var(--text-muted)] hover:text-[var(--error)]"
                            >
                                <X className="w-2.5 h-2.5" />
                            </button>
                        )}
                    </motion.span>
                ))}
            </div>

            {/* Chart */}
            <div className="relative h-[260px]">
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 600 260"
                    preserveAspectRatio="xMidYMid meet"
                    onMouseLeave={() => setHoveredPoint(null)}
                >
                    {/* Gradients for area fills */}
                    <defs>
                        {selectedItems.map((item) => (
                            <linearGradient key={`gradient-${item}`} id={`area-gradient-${item}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={colors[item]} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={colors[item]} stopOpacity="0.05" />
                            </linearGradient>
                        ))}
                    </defs>

                    {/* Y-axis grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => {
                        const y = 240 - (i * 200 / 4);
                        const value = (maxValue / 4) * i;
                        return (
                            <g key={i}>
                                <line
                                    x1="70"
                                    y1={y}
                                    x2="590"
                                    y2={y}
                                    stroke="var(--border-subtle)"
                                    strokeWidth="1"
                                    opacity="0.2"
                                />
                                <text
                                    x="10"
                                    y={y + 4}
                                    fill="var(--text-muted)"
                                    fontSize="10"
                                    fontFamily="system-ui"
                                >
                                    ${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toFixed(0)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Area fills (drawn first, behind lines) */}
                    {selectedItems.map((item) => (
                        <path
                            key={`area-${item}`}
                            d={generateAreaPath(item)}
                            fill={`url(#area-gradient-${item})`}
                        />
                    ))}

                    {/* Lines */}
                    {selectedItems.map((item) => (
                        <path
                            key={`line-${item}`}
                            d={generatePath(item)}
                            fill="none"
                            stroke={colors[item]}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}

                    {/* Hover vertical line */}
                    {hoveredPoint && (
                        <line
                            x1={hoveredPoint.x}
                            y1="40"
                            x2={hoveredPoint.x}
                            y2="240"
                            stroke="var(--text-muted)"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            opacity="0.5"
                        />
                    )}

                    {/* X-axis labels and hover areas */}
                    {data.map((d, i) => {
                        const x = 70 + (i * (520 / (data.length - 1)));
                        return (
                            <g key={i}>
                                <text
                                    x={x}
                                    y="255"
                                    fill="var(--text-muted)"
                                    fontSize="11"
                                    textAnchor="middle"
                                    fontFamily="system-ui"
                                >
                                    {d.name}
                                </text>
                                {/* Invisible hover area */}
                                <rect
                                    x={x - 20}
                                    y="40"
                                    width="40"
                                    height="200"
                                    fill="transparent"
                                    onMouseEnter={() => setHoveredPoint({ month: d.name as string, x })}
                                />
                            </g>
                        );
                    })}

                    {/* Tooltip on hover */}
                    {hoveredPoint && (
                        <g>
                            {selectedItems.map((item, idx) => {
                                const monthData = data.find(d => d.name === hoveredPoint.month);
                                if (!monthData) return null;

                                const value = monthData[item] as number;
                                if (value == null || isNaN(value)) return null;

                                const y = 240 - ((value / maxValue) * 200);

                                return (
                                    <g key={item}>
                                        {/* Dot */}
                                        <circle
                                            cx={hoveredPoint.x}
                                            cy={y}
                                            r="5"
                                            fill={colors[item]}
                                            stroke="var(--bg-surface)"
                                            strokeWidth="2"
                                        />
                                        {/* Value label */}
                                        <text
                                            x={hoveredPoint.x + 10}
                                            y={y + (idx * 16) - (selectedItems.length * 8) + 4}
                                            fill={colors[item]}
                                            fontSize="11"
                                            fontWeight="600"
                                            fontFamily="system-ui"
                                        >
                                            {item}: ${value.toLocaleString()}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>
                    )}
                </svg>
            </div>
        </div>
    );
}
