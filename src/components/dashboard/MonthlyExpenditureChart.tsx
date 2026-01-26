'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface MonthData {
    month: string;
    value: number;
}

const monthlyData: MonthData[] = [
    { month: 'Apr', value: 2300 },
    { month: 'May', value: 2700 },
    { month: 'Jun', value: 2500 },
    { month: 'Jul', value: 1900 },
    { month: 'Aug', value: 2400 },
    { month: 'Sep', value: 2100 },
    { month: 'Oct', value: 2950 },
    { month: 'Nov', value: 2600 },
    { month: 'Dec', value: 2800 },
    { month: 'Jan', value: 2200 },
    { month: 'Feb', value: 2450 },
    { month: 'Mar', value: 2650 },
];

export function MonthlyExpenditureChart() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const maxValue = Math.max(...monthlyData.map(d => d.value));
    const minValue = 0;
    const range = maxValue - minValue;

    // Generate Y-axis labels
    const yAxisLabels = Array.from({ length: 7 }, (_, i) => {
        const value = (maxValue / 6) * i;
        return value >= 1000 ? `${(value / 1000).toFixed(1)}k$` : `${value.toFixed(0)}$`;
    });

    return (
        <div className="bg-[var(--bg-surface)]/60 rounded-2xl border border-[var(--border-subtle)] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Monthly Expenditure
                </h3>
                <button className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                    View all <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Chart Container */}
            <div className="relative h-[320px]">
                <svg width="100%" height="100%" viewBox="0 0 1020 320" preserveAspectRatio="xMidYMid meet">
                    {/* Define diagonal stripe pattern */}
                    <defs>
                        <pattern id="diagonalStripes" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                            <line x1="0" y1="0" x2="0" y2="8" stroke="var(--primary)" strokeWidth="2" opacity="0.6" />
                        </pattern>

                        {/* Gradient for solid bars */}
                        <linearGradient id="solidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.8" />
                        </linearGradient>
                    </defs>

                    {/* Y-axis grid lines and labels */}
                    <g>
                        {yAxisLabels.map((label, i) => {
                            const y = 280 - (i * 280 / 6);
                            return (
                                <g key={i}>
                                    <line
                                        x1="60"
                                        y1={y}
                                        x2="1000"
                                        y2={y}
                                        stroke="var(--border-subtle)"
                                        strokeWidth="1"
                                        opacity="0.3"
                                    />
                                    <text
                                        x="10"
                                        y={y + 5}
                                        fill="var(--text-muted)"
                                        fontSize="12"
                                        fontFamily="system-ui"
                                    >
                                        {label}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* Bars */}
                    <g>
                        {monthlyData.map((data, index) => {
                            const barWidth = 60;
                            const spacing = 80;
                            const x = 80 + index * spacing;
                            const heightPercent = (data.value - minValue) / range;
                            const barHeight = heightPercent * 260;
                            const y = 280 - barHeight;
                            const isHovered = hoveredIndex === index;

                            return (
                                <g key={index}>
                                    {/* Bar */}
                                    <motion.rect
                                        x={x}
                                        y={y}
                                        width={barWidth}
                                        height={barHeight}
                                        rx="8"
                                        ry="8"
                                        fill={isHovered ? "url(#solidGradient)" : "url(#diagonalStripes)"}
                                        stroke={isHovered ? "none" : "var(--primary)"}
                                        strokeWidth={isHovered ? "0" : "2"}
                                        opacity={isHovered ? "1" : "0.7"}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        style={{ cursor: 'pointer' }}
                                        initial={false}
                                        animate={{
                                            opacity: isHovered ? 1 : 0.7,
                                        }}
                                        transition={{ duration: 0.2 }}
                                    />

                                    {/* Hover tooltip */}
                                    {isHovered && (
                                        <g>
                                            {/* Tooltip bubble */}
                                            <motion.g
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <rect
                                                    x={
                                                        // Adjust tooltip position for edge bars to prevent overflow
                                                        index === 0
                                                            ? x // Align left for first bar
                                                            : index === monthlyData.length - 1
                                                                ? x + barWidth - 90 // Align right for last bar
                                                                : x + barWidth / 2 - 45 // Center for middle bars
                                                    }
                                                    y={Math.max(y - 40, 10)} // Prevent top overflow
                                                    width="90"
                                                    height="32"
                                                    rx="16"
                                                    fill="var(--bg-elevated)"
                                                    stroke="var(--primary)"
                                                    strokeWidth="2"
                                                />
                                                <text
                                                    x={
                                                        index === 0
                                                            ? x + 45
                                                            : index === monthlyData.length - 1
                                                                ? x + barWidth - 45
                                                                : x + barWidth / 2
                                                    }
                                                    y={Math.max(y - 19, 31)}
                                                    fill="var(--text-primary)"
                                                    fontSize="14"
                                                    fontWeight="600"
                                                    textAnchor="middle"
                                                    fontFamily="system-ui"
                                                >
                                                    ${data.value.toLocaleString()}
                                                </text>
                                                {/* Dot connector */}
                                                <circle
                                                    cx={x + barWidth / 2}
                                                    cy={Math.max(y - 5, 47)}
                                                    r="6"
                                                    fill="var(--primary)"
                                                    stroke="var(--bg-elevated)"
                                                    strokeWidth="3"
                                                />
                                            </motion.g>
                                        </g>
                                    )}

                                    {/* Month label */}
                                    <text
                                        x={x + barWidth / 2}
                                        y="305"
                                        fill="var(--text-secondary)"
                                        fontSize="14"
                                        textAnchor="middle"
                                        fontFamily="system-ui"
                                        fontWeight={isHovered ? "600" : "400"}
                                    >
                                        {data.month}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>
        </div>
    );
}
