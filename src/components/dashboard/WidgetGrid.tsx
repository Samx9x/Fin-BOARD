'use client';

import { useMemo, useCallback } from 'react';
// @ts-ignore - WidthProvider moved to legacy in RGL v2
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { motion } from 'framer-motion';
import { useDashboardStore } from '@/store/dashboardStore';
import { WidgetCard } from '@/components/widgets/WidgetCard';
import { WidgetTable } from '@/components/widgets/WidgetTable';
import { WidgetChart } from '@/components/widgets/WidgetChart';
import { AddWidgetCard } from '@/components/widgets/AddWidgetCard';
import { Widget, LayoutItem } from '@/types';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface WidgetGridProps {
    widgets?: Widget[];
}

export function WidgetGrid({ widgets: propWidgets }: WidgetGridProps) {
    const storeWidgets = useDashboardStore(state => state.widgets);
    const layout = useDashboardStore(state => state.layout);
    const updateLayout = useDashboardStore(state => state.updateLayout);

    const widgets = propWidgets || storeWidgets;

    // Breakpoints and Column configuration
    const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
    const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

    // Convert fixed layout to responsive layouts object
    const gridLayouts = useMemo(() => {
        const widgetLayouts: any[] = [];

        widgets.forEach((widget) => {
            const existingLayout = layout.find(l => l.i === widget.id);

            if (existingLayout) {
                widgetLayouts.push({
                    ...existingLayout,
                    minW: 2,
                    minH: 2,
                });
            } else {
                // Default fallback positioning
                widgetLayouts.push({
                    i: widget.id,
                    x: 0,
                    y: Infinity, // Put at bottom
                    w: widget.displayMode === 'table' ? 12 : 6,
                    h: widget.displayMode === 'table' ? 6 : 4,
                    minW: 2,
                    minH: 2,
                });
            }
        });

        // Add "Add Widget" card logic
        const maxY = widgetLayouts.length > 0
            ? Math.max(...widgetLayouts.map(l => l.y + l.h))
            : 0;

        widgetLayouts.push({
            i: 'add-widget',
            x: 0,
            y: maxY,
            w: 12,
            h: 2,
            static: false,
            isResizable: false,
            isDraggable: false,
        });

        return { lg: widgetLayouts, md: widgetLayouts, sm: widgetLayouts, xs: widgetLayouts, xxs: widgetLayouts };
    }, [layout, widgets]);

    const handleLayoutChange = useCallback((currentLayout: any) => {
        // Only save non-'add-widget' items
        const newLayoutItems: LayoutItem[] = (currentLayout as any[])
            .filter(item => item.i !== 'add-widget')
            .map(({ i, x, y, w, h }) => ({
                i, x, y, w, h,
                minW: 2, minH: 2
            }));

        updateLayout(newLayoutItems);
    }, [updateLayout]);

    const renderWidget = (widgetId: string) => {
        if (widgetId === 'add-widget') return <AddWidgetCard />;
        const widget = widgets.find(w => w.id === widgetId);
        if (!widget) return null;

        switch (widget.displayMode) {
            case 'table': return <WidgetTable widget={widget} />;
            case 'chart': return <WidgetChart widget={widget} />;
            default: return <WidgetCard widget={widget} />;
        }
    };

    const allIds = [...widgets.map(w => w.id), 'add-widget'];

    return (
        <div className="w-full min-h-[500px]">
            <ResponsiveGridLayout
                className="widget-grid"
                layouts={gridLayouts}
                breakpoints={breakpoints}
                cols={cols}
                rowHeight={70}
                margin={[16, 16]}
                containerPadding={[0, 0]}
                onLayoutChange={handleLayoutChange}
                isDraggable={true}
                isResizable={true}
                resizeHandles={['s', 'e', 'se']}
                draggableHandle=".drag-handle"
                useCSSTransforms={true}
                compactType="vertical"
            >
                {allIds.map((id, index) => (
                    <div key={id} className="widget-wrapper">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(index * 0.05, 0.3) }}
                            className="h-full"
                        >
                            {renderWidget(id)}
                        </motion.div>
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}
