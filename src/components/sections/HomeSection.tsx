'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, LineChart as ChartIcon, Table, MoreHorizontal } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { WidgetGrid } from '@/components/dashboard/WidgetGrid';
import { EmptyState } from '@/components/dashboard/EmptyState';

// Widget Tab filters
const widgetTabs = [
    { id: 'all', label: 'All Widgets', icon: LayoutGrid },
    { id: 'charts', label: 'Charts', icon: ChartIcon },
    { id: 'tables', label: 'Tables', icon: Table },
    { id: 'more', label: 'More', icon: MoreHorizontal },
];

export function HomeSection() {
    const widgets = useDashboardStore(state => state.widgets);
    const openAddWidgetModal = useDashboardStore(state => state.openAddWidgetModal);
    const [activeTab, setActiveTab] = useState('all');

    // Filter widgets based on active tab
    const filteredWidgets = widgets.filter(widget => {
        if (activeTab === 'all') return true;
        if (activeTab === 'charts') return widget.displayMode === 'chart';
        if (activeTab === 'tables') return widget.displayMode === 'table';
        if (activeTab === 'more') return widget.displayMode === 'card';
        return true;
    });

    return (
        <div className="p-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Page Title */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                        My Dashboard
                    </h2>
                    <motion.button
                        onClick={openAddWidgetModal}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="
              flex items-center gap-2 px-5 py-2.5
              bg-[var(--primary)] text-black
              rounded-xl text-sm font-semibold
              shadow-lg shadow-[var(--primary)]/20
            "
                    >
                        <Plus className="w-4 h-4" />
                        Add Widget
                    </motion.button>
                </div>

                {/* Widget Tabs */}
                <div className="flex items-center gap-2 mb-6">
                    {widgetTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        const count = tab.id === 'all'
                            ? widgets.length
                            : widgets.filter(w => {
                                if (tab.id === 'charts') return w.displayMode === 'chart';
                                if (tab.id === 'tables') return w.displayMode === 'table';
                                if (tab.id === 'more') return w.displayMode === 'card';
                                return false;
                            }).length;

                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${isActive
                                        ? 'bg-[var(--primary)] text-black'
                                        : 'bg-[var(--bg-surface)]/60 border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--text-primary)]'
                                    }
                `}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                                {count > 0 && (
                                    <span className={`
                    px-1.5 py-0.5 rounded-full text-xs
                    ${isActive ? 'bg-black/20' : 'bg-[var(--bg-elevated)]'}
                  `}>
                                        {count}
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Widgets Grid or Empty State */}
                {widgets.length > 0 ? (
                    <div>
                        {filteredWidgets.length > 0 ? (
                            <WidgetGrid widgets={filteredWidgets} />
                        ) : (
                            <div className="
                p-12 text-center rounded-2xl
                border border-dashed border-[var(--border-default)]
              ">
                                <p className="text-[var(--text-muted)]">
                                    No {activeTab === 'charts' ? 'chart' : activeTab === 'tables' ? 'table' : 'card'} widgets found
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
}
