'use client';

import { useDashboardStore } from '@/store/dashboardStore';

interface StockBarChartProps {
    title: string;
    data: { name: string; value: number }[];
    color?: string;
}

export function StockBarChart({ title, data, color = '#3b82f6' }: StockBarChartProps) {
    const maxValue = Math.max(...data.map(d => d.value));
    const theme = useDashboardStore(state => state.theme);
    const isDark = theme === 'dark';

    return (
        <div className="bg-[var(--bg-surface)]/60 rounded-2xl border border-[var(--border-subtle)] p-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-6">{title}</h3>

            {/* Chart Container */}
            <div className="relative h-[280px] bg-white/5 rounded-lg">
                <svg width="100%" height="100%" viewBox="0 0 600 280" preserveAspectRatio="xMidYMid meet">
                    {/* White background for entire chart area */}
                    <rect x="0" y="0" width="600" height="280" fill={isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.5)"} />

                    {/* Y-axis grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => {
                        const y = 250 - (i * 250 / 4);
                        const value = (maxValue / 4) * i;
                        return (
                            <g key={i}>
                                <line
                                    x1="50"
                                    y1={y}
                                    x2="580"
                                    y2={y}
                                    stroke="var(--border-subtle)"
                                    strokeWidth="1"
                                    opacity="0.3"
                                />
                                <text
                                    x="10"
                                    y={y + 5}
                                    fill="var(--text-muted)"
                                    fontSize="11"
                                    fontFamily="system-ui"
                                >
                                    ${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(0)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Define gradient */}
                    <defs>
                        <linearGradient id={`bar-grad-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.7" />
                            <stop offset="60%" stopColor={color} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    {/* Bars */}
                    {data.map((item, index) => {
                        const barWidth = 50;
                        const spacing = 80;
                        const x = 65 + index * spacing;
                        const heightPercent = item.value / maxValue;
                        const barHeight = heightPercent * 230;
                        const y = 250 - barHeight;

                        return (
                            <g key={item.name}>
                                {/* White base to prevent black showing */}
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    fill="white"
                                    opacity={isDark ? "0.1" : "0.8"}
                                />

                                {/* Colored gradient bar */}
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    fill={`url(#bar-grad-${title.replace(/\s+/g, '-')})`}
                                />

                                {/* Top border line */}
                                <line
                                    x1={x}
                                    y1={y}
                                    x2={x + barWidth}
                                    y2={y}
                                    stroke={color}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />

                                {/* Company name label */}
                                <text
                                    x={x + barWidth / 2}
                                    y="270"
                                    fill="var(--text-secondary)"
                                    fontSize="13"
                                    fontWeight="500"
                                    textAnchor="middle"
                                    fontFamily="system-ui"
                                >
                                    {item.name}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
