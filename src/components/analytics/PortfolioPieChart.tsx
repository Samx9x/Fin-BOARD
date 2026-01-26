'use client';

import { motion } from 'framer-motion';

interface PortfolioItem {
    name: string;
    value: number;
    color: string;
    percentage: number;
}

interface PortfolioPieChartProps {
    title: string;
    data: PortfolioItem[];
}

export function PortfolioPieChart({ title, data }: PortfolioPieChartProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Calculate pie chart segments
    let currentAngle = -90; // Start from top
    const segments = data.map((item) => {
        const percentage = (item.value / total) * 100;
        const angle = (percentage / 100) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;

        // Calculate SVG path
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const radius = 80;
        const innerRadius = 48; // For donut effect
        const centerX = 120;
        const centerY = 120;

        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);

        const innerX1 = centerX + innerRadius * Math.cos(startRad);
        const innerY1 = centerY + innerRadius * Math.sin(startRad);
        const innerX2 = centerX + innerRadius * Math.cos(endRad);
        const innerY2 = centerY + innerRadius * Math.sin(endRad);

        const largeArc = angle > 180 ? 1 : 0;

        const path = [
            `M ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            `L ${innerX2} ${innerY2}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerX1} ${innerY1}`,
            'Z'
        ].join(' ');

        return {
            ...item,
            path,
            percentage,
            midAngle: startAngle + angle / 2,
        };
    });

    return (
        <div className="bg-[var(--bg-surface)]/60 rounded-2xl border border-[var(--border-subtle)] p-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-6">{title}</h3>

            <div className="flex items-center gap-8">
                {/* Pie Chart */}
                <div className="flex-shrink-0">
                    <svg width="200" height="200" viewBox="0 0 240 240">
                        {segments.map((segment, index) => (
                            <motion.g
                                key={segment.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                            >
                                <path
                                    d={segment.path}
                                    fill={segment.color}
                                    stroke="var(--bg-surface)"
                                    strokeWidth="3"
                                    className="transition-opacity hover:opacity-80 cursor-pointer"
                                />
                            </motion.g>
                        ))}

                        {/* Center circle for donut effect */}
                        <circle
                            cx="120"
                            cy="120"
                            r="48"
                            fill="var(--bg-surface)"
                        />

                        {/* Total value in center */}
                        <text
                            x="120"
                            y="115"
                            fill="var(--text-muted)"
                            fontSize="11"
                            textAnchor="middle"
                            fontFamily="system-ui"
                        >
                            Total
                        </text>
                        <text
                            x="120"
                            y="130"
                            fill="var(--text-primary)"
                            fontSize="16"
                            fontWeight="700"
                            textAnchor="middle"
                            fontFamily="system-ui"
                        >
                            ${(total / 1000).toFixed(1)}k
                        </text>
                    </svg>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-4">
                    {data.map((item, index) => {
                        const percentage = ((item.value / total) * 100).toFixed(1);
                        return (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className="flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div
                                        className="w-3 h-3 rounded-sm flex-shrink-0"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm text-[var(--text-secondary)] truncate">{item.name}</span>
                                </div>
                                <div className="flex-shrink-0">
                                    <span className="text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap">
                                        ${item.value.toLocaleString()}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
