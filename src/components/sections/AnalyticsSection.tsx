'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, X, ChevronDown, TrendingUp, TrendingDown,
    Bitcoin, DollarSign, Sun, Moon
} from 'lucide-react';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';
import { useDashboardStore } from '@/store/dashboardStore';

// Current prices for cryptos (bar chart)
const cryptoCurrentPrices = [
    { name: 'BTC', price: 72000, color: '#f7931a' },
    { name: 'ETH', price: 5200, color: '#627eea' },
    { name: 'SOL', price: 235, color: '#14f195' },
    { name: 'XRP', price: 0.62, color: '#23292f' },
    { name: 'ADA', price: 0.58, color: '#0033ad' },
    { name: 'DOT', price: 8.5, color: '#e6007a' },
];

// Current prices for stocks (bar chart)
const stockCurrentPrices = [
    { name: 'AAPL', price: 235, color: '#555555' },
    { name: 'GOOGL', price: 180, color: '#4285f4' },
    { name: 'MSFT', price: 490, color: '#00a4ef' },
    { name: 'NVDA', price: 950, color: '#76b900' },
    { name: 'TSLA', price: 245, color: '#cc0000' },
    { name: 'AMZN', price: 195, color: '#ff9900' },
];

// Monthly trends for cryptos (line chart)
const cryptoMonthlyTrends = [
    { name: 'Jan', BTC: 42000, ETH: 2800, SOL: 95 },
    { name: 'Feb', BTC: 44500, ETH: 3100, SOL: 110 },
    { name: 'Mar', BTC: 38000, ETH: 2500, SOL: 85 },
    { name: 'Apr', BTC: 46000, ETH: 3300, SOL: 130 },
    { name: 'May', BTC: 52000, ETH: 3800, SOL: 145 },
    { name: 'Jun', BTC: 48000, ETH: 3500, SOL: 125 },
    { name: 'Jul', BTC: 55000, ETH: 4000, SOL: 160 },
    { name: 'Aug', BTC: 58000, ETH: 4200, SOL: 175 },
    { name: 'Sep', BTC: 54000, ETH: 3900, SOL: 155 },
    { name: 'Oct', BTC: 62000, ETH: 4500, SOL: 190 },
    { name: 'Nov', BTC: 68000, ETH: 4800, SOL: 210 },
    { name: 'Dec', BTC: 72000, ETH: 5200, SOL: 235 },
];

// Monthly trends for stocks (line chart)
const stockMonthlyTrends = [
    { name: 'Jan', AAPL: 180, GOOGL: 140, MSFT: 380, NVDA: 480 },
    { name: 'Feb', AAPL: 185, GOOGL: 142, MSFT: 395, NVDA: 520 },
    { name: 'Mar', AAPL: 172, GOOGL: 138, MSFT: 375, NVDA: 490 },
    { name: 'Apr', AAPL: 178, GOOGL: 145, MSFT: 400, NVDA: 550 },
    { name: 'May', AAPL: 188, GOOGL: 150, MSFT: 410, NVDA: 600 },
    { name: 'Jun', AAPL: 195, GOOGL: 155, MSFT: 420, NVDA: 650 },
    { name: 'Jul', AAPL: 198, GOOGL: 160, MSFT: 435, NVDA: 720 },
    { name: 'Aug', AAPL: 192, GOOGL: 158, MSFT: 425, NVDA: 680 },
    { name: 'Sep', AAPL: 205, GOOGL: 165, MSFT: 440, NVDA: 750 },
    { name: 'Oct', AAPL: 215, GOOGL: 170, MSFT: 455, NVDA: 820 },
    { name: 'Nov', AAPL: 225, GOOGL: 175, MSFT: 470, NVDA: 880 },
    { name: 'Dec', AAPL: 235, GOOGL: 180, MSFT: 490, NVDA: 950 },
];

const cryptoColors: Record<string, string> = {
    BTC: '#f7931a',
    ETH: '#627eea',
    SOL: '#14f195',
    XRP: '#23292f',
    ADA: '#0033ad',
    DOT: '#e6007a',
};

const stockColors: Record<string, string> = {
    AAPL: '#555555',
    GOOGL: '#4285f4',
    MSFT: '#00a4ef',
    NVDA: '#76b900',
    TSLA: '#cc0000',
    AMZN: '#ff9900',
};

// Custom gradient bar shape
const GradientBar = (props: any) => {
    const { x, y, width, height, fill, index } = props;
    const gradientId = `gradient-${index}`;

    return (
        <g>
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={fill} stopOpacity={1} />
                    <stop offset="100%" stopColor={fill} stopOpacity={0.3} />
                </linearGradient>
            </defs>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={`url(#${gradientId})`}
                rx={4}
                ry={4}
            />
        </g>
    );
};

// Current Prices Bar Chart (X-axis = cryptos/stocks)
interface PriceBarChartProps {
    title: string;
    data: { name: string; price: number; color: string }[];
    icon: React.ReactNode;
}

function PriceBarChart({ title, data, icon }: PriceBarChartProps) {
    return (
        <div className="
      bg-[var(--bg-surface)]/60 rounded-2xl
      border border-[var(--border-subtle)]
      p-5
    ">
            <div className="flex items-center gap-3 mb-4">
                {icon}
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
            </div>

            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barCategoryGap="20%">
                        <defs>
                            {data.map((item, index) => (
                                <linearGradient key={item.name} id={`bar-gradient-${item.name}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={item.color} stopOpacity={1} />
                                    <stop offset="100%" stopColor={item.color} stopOpacity={0.2} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                            tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-elevated)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '12px',
                                padding: '12px',
                            }}
                            formatter={(value) => value !== undefined ? [`$${Number(value).toLocaleString()}`, 'Price'] : null}
                            labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                        />
                        <Bar
                            dataKey="price"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={60}
                        >
                            {data.map((entry, index) => (
                                <rect key={entry.name} fill={`url(#bar-gradient-${entry.name})`} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// Monthly Trends Line Chart (X-axis = months)
interface TrendLineChartProps {
    title: string;
    data: any[];
    items: string[];
    colors: Record<string, string>;
    icon: React.ReactNode;
}

function TrendLineChart({ title, data, items, colors, icon }: TrendLineChartProps) {
    const [selectedItems, setSelectedItems] = useState(items.slice(0, 3));
    const [showDropdown, setShowDropdown] = useState(false);

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

    return (
        <div className="
      bg-[var(--bg-surface)]/60 rounded-2xl
      border border-[var(--border-subtle)]
      p-5
    ">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {icon}
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
                </div>

                {/* Add Item Dropdown */}
                <div className="relative">
                    <motion.button
                        onClick={() => setShowDropdown(!showDropdown)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={availableItems.length === 0}
                        className="
              flex items-center gap-1 px-3 py-2
              bg-[var(--bg-elevated)] rounded-lg
              text-sm text-[var(--text-secondary)]
              hover:text-[var(--text-primary)]
              disabled:opacity-50
            "
                    >
                        <Plus className="w-4 h-4" />
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
                                    className="
                    absolute right-0 top-full mt-2 z-50
                    w-32 py-2
                    bg-[var(--bg-elevated)] rounded-lg
                    border border-[var(--border-subtle)]
                    shadow-lg
                  "
                                >
                                    {availableItems.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => {
                                                toggleItem(item);
                                                setShowDropdown(false);
                                            }}
                                            className="
                        w-full flex items-center gap-2 px-3 py-2
                        text-sm text-[var(--text-primary)]
                        hover:bg-[var(--bg-surface)]
                      "
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full"
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

            {/* Selected Items Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {selectedItems.map((item) => (
                    <motion.span
                        key={item}
                        layout
                        className="
              inline-flex items-center gap-2 px-3 py-1.5
              bg-[var(--bg-elevated)] rounded-lg
              text-sm
            "
                    >
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors[item] }}
                        />
                        <span className="text-[var(--text-primary)]">{item}</span>
                        {selectedItems.length > 1 && (
                            <button
                                onClick={() => toggleItem(item)}
                                className="p-0.5 rounded hover:bg-[var(--error)]/20 text-[var(--text-muted)] hover:text-[var(--error)]"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </motion.span>
                ))}
            </div>

            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                            tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-elevated)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '12px',
                                padding: '12px',
                            }}
                        />
                        <Legend />
                        {selectedItems.map((item) => (
                            <Line
                                key={item}
                                type="monotone"
                                dataKey={item}
                                stroke={colors[item]}
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 2 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// Statistics Line Chart (Income vs Expense style)
function StatisticsChart() {
    const data = [
        { name: 'Jan', Income: 1500, Expense: 1200 },
        { name: 'Feb', Income: 100, Expense: 1400 },
        { name: 'Mar', Income: 1200, Expense: -100 },
        { name: 'Apr', Income: 1800, Expense: 1000 },
        { name: 'May', Income: 3000, Expense: 100 },
        { name: 'Jun', Income: 2800, Expense: 150 },
        { name: 'Jul', Income: 20, Expense: 200 },
        { name: 'Aug', Income: 1000, Expense: 2200 },
        { name: 'Sep', Income: 1200, Expense: 2500 },
        { name: 'Oct', Income: 800, Expense: 1200 },
        { name: 'Nov', Income: -100, Expense: 1800 },
        { name: 'Dec', Income: 1000, Expense: 5000 },
    ];

    return (
        <div className="
      bg-[var(--bg-surface)]/60 rounded-2xl
      border border-[var(--border-subtle)]
      p-5
    ">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Statistics</h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#1a5a4a]" />
                        <span className="text-sm text-[var(--text-muted)]">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#c4d94a]" />
                        <span className="text-sm text-[var(--text-muted)]">Expense</span>
                    </div>
                </div>
            </div>

            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-elevated)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '8px',
                            }}
                        />
                        <Line type="basis" dataKey="Income" stroke="#1a5a4a" strokeWidth={3} dot={false} />
                        <Line type="basis" dataKey="Expense" stroke="#c4d94a" strokeWidth={3} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// Monthly Spending Trend (Area Chart)
function SpendingTrendChart() {
    const data = [
        { name: 'Jan', value: 680 },
        { name: 'Feb', value: 720 },
        { name: 'Mar', value: 620 },
        { name: 'Apr', value: 750 },
        { name: 'May', value: 850 },
        { name: 'Jun', value: 920 },
        { name: 'Jul', value: 880 },
        { name: 'Aug', value: 820 },
        { name: 'Sep', value: 800 },
        { name: 'Oct', value: 780 },
        { name: 'Nov', value: 740 },
        { name: 'Dec', value: 790 },
    ];

    const [selectedYear, setSelectedYear] = useState('2024');

    return (
        <div className="
      bg-[var(--bg-surface)]/60 rounded-2xl
      border border-[var(--border-subtle)]
      p-5
    ">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Monthly Spending Trend</h3>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="
            px-3 py-1.5 rounded-lg
            bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
            text-sm text-[var(--text-primary)]
            outline-none cursor-pointer
          "
                >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                </select>
            </div>

            <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-elevated)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '8px',
                            }}
                            formatter={(value) => value !== undefined ? [`$${value}`, 'Spending'] : null}
                        />
                        <Area
                            type="stepAfter"
                            dataKey="value"
                            stroke="#3b82f6"
                            fill="url(#blueGradient)"
                            strokeWidth={2}
                        />
                        <defs>
                            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}



export function AnalyticsSection() {
    return (
        <div className="p-6 overflow-auto">
            <div className="max-w-[1400px] mx-auto">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Analytics</h2>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            Compare stocks and cryptocurrencies with interactive charts
                        </p>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="space-y-6">
                    {/* Top Row - Current Prices (Bar Charts with X-axis = assets) */}
                    <div className="grid grid-cols-2 gap-6">
                        <PriceBarChart
                            title="Crypto Current Prices"
                            data={cryptoCurrentPrices}
                            icon={<Bitcoin className="w-5 h-5 text-[#f7931a]" />}
                        />
                        <PriceBarChart
                            title="Stock Current Prices"
                            data={stockCurrentPrices}
                            icon={<DollarSign className="w-5 h-5 text-[var(--success)]" />}
                        />
                    </div>

                    {/* Middle Row - Monthly Trends (Line Charts with X-axis = months) */}
                    <div className="grid grid-cols-2 gap-6">
                        <TrendLineChart
                            title="Crypto Monthly Trends"
                            data={cryptoMonthlyTrends}
                            items={['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOT']}
                            colors={cryptoColors}
                            icon={<TrendingUp className="w-5 h-5 text-[var(--primary)]" />}
                        />
                        <TrendLineChart
                            title="Stock Monthly Trends"
                            data={stockMonthlyTrends}
                            items={['AAPL', 'GOOGL', 'MSFT', 'NVDA', 'TSLA', 'AMZN']}
                            colors={stockColors}
                            icon={<TrendingUp className="w-5 h-5 text-[var(--info)]" />}
                        />
                    </div>

                    {/* Bottom Row - Statistics & Spending Trend */}
                    <div className="grid grid-cols-2 gap-6">
                        <StatisticsChart />
                        <SpendingTrendChart />
                    </div>
                </div>
            </div>
        </div>
    );
}
