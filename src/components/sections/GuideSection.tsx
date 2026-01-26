'use client';

import { motion } from 'framer-motion';
import {
    BookOpen, Play, Lightbulb, Zap, TrendingUp,
    LayoutGrid, Link2, Settings, MousePointer, Eye
} from 'lucide-react';

const guideSteps = [
    {
        id: 1,
        title: 'Getting Started',
        icon: Play,
        color: '#00d09c',
        steps: [
            'Click the "+ Add Widget" button to create your first data visualization',
            'Choose from our library of templates or connect to any API endpoint',
            'Customize your widget\'s appearance and data display options',
        ]
    },
    {
        id: 2,
        title: 'Connecting Data Sources',
        icon: Link2,
        color: '#4285f4',
        steps: [
            'Enter any REST API endpoint URL in the widget configuration',
            'The system automatically detects the response structure',
            'Select which fields to display from your API response',
        ]
    },
    {
        id: 3,
        title: 'Customizing Widgets',
        icon: Settings,
        color: '#f7931a',
        steps: [
            'Choose between Chart, Table, or Card display modes',
            'Adjust refresh intervals for real-time data updates',
            'Configure chart types: Line, Bar, Area, or Candlestick',
        ]
    },
    {
        id: 4,
        title: 'Dashboard Organization',
        icon: LayoutGrid,
        color: '#e6007a',
        steps: [
            'Drag and drop widgets to rearrange your dashboard layout',
            'Resize widgets by dragging their edges for optimal viewing',
            'Filter widgets by type using the tab menu (All, Charts, Tables, Cards)',
        ]
    },
];

const quickTips = [
    {
        icon: Lightbulb,
        title: 'Use Templates',
        description: 'Start with pre-configured widgets for crypto, stocks, and weather data',
    },
    {
        icon: Zap,
        title: 'Real-time Updates',
        description: 'Set auto-refresh intervals to keep your data current (30s, 1m, 5m, 15m)',
    },
    {
        icon: TrendingUp,
        title: 'Track Trends',
        description: 'Historical data is automatically generated for chart visualizations',
    },
    {
        icon: Eye,
        title: 'Multiple Views',
        description: 'Switch between chart, table, and card views to explore your data differently',
    },
    {
        icon: MousePointer,
        title: 'Interactive Charts',
        description: 'Hover over charts for detailed tooltips and data point information',
    },
];

export function GuideSection() {
    return (
        <div className="">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-8 h-8 text-[var(--primary)]" />
                        <h2 className="text-3xl font-bold text-[var(--text-primary)]">User Guide</h2>
                    </div>
                    <p className="text-[var(--text-muted)] text-lg">
                        Learn how to make the most of Fin-BOARD and create stunning financial dashboards
                    </p>
                </div>

                {/* Main Guide Steps */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {guideSteps.map((guide, index) => {
                        const Icon = guide.icon;
                        return (
                            <motion.div
                                key={guide.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[var(--bg-surface)]/60 rounded-2xl border border-[var(--border-subtle)] p-6 hover:border-[var(--primary)]/30 transition-colors"
                            >
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${guide.color}20` }}
                                    >
                                        <Icon className="w-6 h-6" style={{ color: guide.color }} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-[var(--text-muted)] mb-1">
                                            STEP {guide.id}
                                        </div>
                                        <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                            {guide.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Steps List */}
                                <ul className="space-y-3">
                                    {guide.steps.map((step, idx) => (
                                        <li key={idx} className="flex gap-3">
                                            <div
                                                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                                                style={{
                                                    backgroundColor: `${guide.color}20`,
                                                    color: guide.color
                                                }}
                                            >
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                                {step}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quick Tips Section */}
                <div className="bg-gradient-to-br from-[var(--primary)]/10 to-transparent rounded-2xl border border-[var(--primary)]/20 p-6">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-[var(--primary)]" />
                        Pro Tips
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                        {quickTips.map((tip, index) => {
                            const Icon = tip.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                    className="bg-[var(--bg-surface)]/60 rounded-xl p-4 border border-[var(--border-subtle)]"
                                >
                                    <Icon className="w-5 h-5 text-[var(--primary)] mb-3" />
                                    <h4 className="font-semibold text-[var(--text-primary)] mb-2 text-sm">
                                        {tip.title}
                                    </h4>
                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                        {tip.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Need Help Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center p-8 bg-[var(--bg-surface)]/40 rounded-2xl border border-[var(--border-subtle)]"
                >
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                        Need More Help?
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] mb-4">
                        Explore our extensive documentation or try out the demo templates to get started quickly
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <button className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                            View Templates
                        </button>
                        <button className="px-6 py-2 bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-lg font-semibold hover:bg-[var(--bg-surface)] transition-colors">
                            Browse Examples
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
