'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

const revenueData = [
    { month: 'Jun', value: 1800 },
    { month: 'Jul', value: 2200 },
    { month: 'Aug', value: 1600 },
    { month: 'Sep', value: 2800 },
    { month: 'Oct', value: 3200, highlight: true },
    { month: 'Nov', value: 2400 },
    { month: 'Dec', value: 2000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="
        bg-[var(--primary)] text-black
        px-3 py-1.5 rounded-lg
        text-sm font-semibold
        shadow-lg
      ">
                +${payload[0].value.toFixed(2)}
            </div>
        );
    }
    return null;
};

export function RevenueChart() {
    return (
        <div className="
      bg-[var(--bg-surface)]/60 rounded-2xl
      border border-[var(--border-subtle)]
      p-5
    ">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Revenue Flow
                </h3>
                <button className="
          flex items-center gap-1 text-sm text-[var(--text-muted)]
          hover:text-[var(--primary)] transition-colors
        ">
                    View all <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Chart */}
            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} barCategoryGap="20%">
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--border-subtle)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                            tickFormatter={(value) => `${(value / 1000).toFixed(1)}k$`}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'transparent' }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[8, 8, 8, 8]}
                            maxBarSize={40}
                        >
                            {revenueData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.highlight ? '#00d09c' : '#1a3a4a'}
                                    stroke={entry.highlight ? '#00d09c' : 'transparent'}
                                    strokeWidth={entry.highlight ? 2 : 0}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// Filter Tabs Component
interface FilterTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = ['All', 'Withdrawal', 'Savings', 'Deposit'];

export function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
    return (
        <div className="flex items-center gap-2">
            {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <motion.button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
              px-5 py-2 rounded-full text-sm font-medium
              transition-all duration-200
              ${isActive
                                ? 'bg-[var(--primary)] text-black'
                                : 'bg-transparent border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--text-primary)]'
                            }
            `}
                    >
                        {tab}
                    </motion.button>
                );
            })}
        </div>
    );
}

// Income/Expense Cards
interface StatCardProps {
    label: string;
    value: number;
    trend: 'up' | 'down';
    description: string;
}

export function StatCard({ label, value, trend, description }: StatCardProps) {
    return (
        <div className="
      bg-[var(--bg-surface)]/60 rounded-2xl
      border border-[var(--border-subtle)]
      p-5
    ">
            <div className="flex items-start justify-between mb-2">
                <div>
                    <span className="text-sm text-[var(--text-muted)]">{label}</span>
                    <span className={`ml-1 ${trend === 'up' ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                        {trend === 'up' ? '↑' : '↓'}
                    </span>
                </div>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                ${value.toLocaleString()}
            </p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {description}
            </p>
        </div>
    );
}

// Donut Chart for Available percentage
export function AvailableDonut() {
    const percentage = 77;
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const segments = [
        { color: '#00d09c', percent: 35, label: 'Documents' },
        { color: '#3b82f6', percent: 25, label: 'Videos' },
        { color: '#fbbf24', percent: 10, label: 'Photos' },
        { color: '#8b5cf6', percent: 7, label: 'Music' },
    ];

    return (
        <div className="
      bg-[var(--bg-surface)]/60 rounded-2xl
      border border-[var(--border-subtle)]
      p-5
    ">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    Available
                </h3>
                <button className="
          flex items-center gap-1 text-sm text-[var(--text-muted)]
          hover:text-[var(--primary)] transition-colors
        ">
                    View all <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-6">
                {/* Donut Chart */}
                <div className="relative w-24 h-24">
                    <svg className="w-full h-full -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            fill="transparent"
                            stroke="var(--bg-elevated)"
                            strokeWidth="8"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            fill="transparent"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#00d09c" />
                                <stop offset="50%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#fbbf24" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-[var(--text-primary)]">
                            {percentage}%
                        </span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-1.5">
                    {segments.map((seg) => (
                        <div key={seg.label} className="flex items-center gap-2">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: seg.color }}
                            />
                            <span className="text-xs text-[var(--text-muted)]">{seg.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
