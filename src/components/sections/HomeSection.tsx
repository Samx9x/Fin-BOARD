'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, LineChart as ChartIcon, Table, MoreHorizontal, RefreshCw } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { WidgetGrid } from '@/components/dashboard/WidgetGrid';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { DashboardSettings } from '@/components/dashboard/DashboardSettings';
import { SettingsModal } from '@/components/modals/SettingsModal';

// Widget Tab filters
const widgetTabs = [
    { id: 'all', label: 'All Widgets', icon: LayoutGrid },
    { id: 'charts', label: 'Charts', icon: ChartIcon },
    { id: 'tables', label: 'Tables', icon: Table },
    { id: 'cards', label: 'Cards', icon: LayoutGrid },
];

export function HomeSection() {
    const widgets = useDashboardStore(state => state.widgets);
    const openAddWidgetModal = useDashboardStore(state => state.openAddWidgetModal);
    const openTemplatesModal = useDashboardStore(state => state.openTemplatesModal);
    const [activeTab, setActiveTab] = useState('all');

    // Filter widgets based on active tab
    const filteredWidgets = widgets.filter(widget => {
        if (activeTab === 'all') return true;
        if (activeTab === 'charts') return widget.displayMode === 'chart';
        if (activeTab === 'tables') return widget.displayMode === 'table';
        if (activeTab === 'cards') return widget.displayMode === 'card';
        return true;
    });

    return (
        <div className="">
            <div className="max-w-[1400px] mx-auto">
                {/* Page Title */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                        My Dashboard <span className="text-[var(--text-muted)] font-normal text-lg ml-1">({widgets.length})</span>
                    </h2>
                    <div className="flex items-center gap-3">
                        <motion.button
                            onClick={() => useDashboardStore.getState().refreshAllWidgets()}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="
                  p-2.5 bg-[var(--bg-elevated)] text-[var(--text-primary)]
                  border border-[var(--border-subtle)] rounded-xl
                  hover:border-[var(--primary)] transition-colors
                "
                            title="Refresh All"
                        >
                            <RefreshCw className="w-4 h-4 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors" />
                        </motion.button>

                        <DashboardSettings />

                        <div className="w-px h-8 bg-[var(--border-subtle)] mx-1" />

                        <motion.button
                            onClick={openTemplatesModal}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="
                  flex items-center gap-2 px-5 py-2.5
                  bg-[var(--bg-elevated)] text-[var(--text-primary)]
                  border border-[var(--border-subtle)]
                  rounded-xl text-sm font-semibold
                  hover:border-[var(--primary)] transition-colors
                "
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Browse Templates
                        </motion.button>

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
                                if (tab.id === 'cards') return w.displayMode === 'card';
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
            <SettingsModal />
        </div>
    );
}
