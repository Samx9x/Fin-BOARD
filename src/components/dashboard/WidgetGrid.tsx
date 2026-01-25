'use client';

import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { motion } from 'framer-motion';
import { useDashboardStore } from '@/store/dashboardStore';
import { WidgetCard } from '@/components/widgets/WidgetCard';
import { WidgetTable } from '@/components/widgets/WidgetTable';
import { WidgetChart } from '@/components/widgets/WidgetChart';
import { AddWidgetCard } from '@/components/widgets/AddWidgetCard';
import { Widget, LayoutItem } from '@/types';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface WidgetGridProps {
    widgets?: Widget[];
}

export function WidgetGrid({ widgets: propWidgets }: WidgetGridProps) {
    const ReactGridLayout = GridLayout as any;
    const storeWidgets = useDashboardStore(state => state.widgets);
    const layout = useDashboardStore(state => state.layout);
    const updateLayout = useDashboardStore(state => state.updateLayout);

    const widgets = propWidgets || storeWidgets;
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(1200);

    // Measure container width
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setContainerWidth(width > 100 ? width : 1200);
            }
        };

        // Initial measurement
        updateWidth();

        // Setup resize observer for more reliable width tracking
        const resizeObserver = new ResizeObserver(updateWidth);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        window.addEventListener('resize', updateWidth);
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    // Fixed columns
    const cols = 12;

    // Convert layout to react-grid-layout format with guaranteed positioning
    const gridLayout = useMemo(() => {
        const widgetLayouts: LayoutItem[] = [];
        const usedPositions = new Set<string>();

        // First, map existing layouts
        widgets.forEach((widget, index) => {
            const existingLayout = layout.find(l => l.i === widget.id);

            if (existingLayout) {
                widgetLayouts.push({
                    ...existingLayout,
                    minW: 3,
                    minH: 3,
                    maxW: 12,
                    maxH: 10,
                });
            } else {
                // Calculate new position for widgets without layout
                const defaultW = widget.displayMode === 'table' ? 8 : widget.displayMode === 'chart' ? 6 : 4;
                const defaultH = widget.displayMode === 'table' ? 5 : widget.displayMode === 'chart' ? 5 : 4;

                // Find first available position
                let x = (index * defaultW) % cols;
                let y = Math.floor((index * defaultW) / cols) * defaultH;

                // Ensure no overlap
                let attempts = 0;
                while (usedPositions.has(`${x},${y}`) && attempts < 20) {
                    x += defaultW;
                    if (x + defaultW > cols) {
                        x = 0;
                        y += defaultH;
                    }
                    attempts++;
                }

                usedPositions.add(`${x},${y}`);

                widgetLayouts.push({
                    i: widget.id,
                    x,
                    y,
                    w: defaultW,
                    h: defaultH,
                    minW: 3,
                    minH: 3,
                    maxW: 12,
                    maxH: 10,
                });
            }
        });

        // Add placeholder for "Add Widget" card
        const maxY = widgetLayouts.length > 0
            ? widgetLayouts.reduce((max, item) => Math.max(max, item.y + item.h), 0)
            : 0;

        widgetLayouts.push({
            i: 'add-widget',
            x: 8,
            y: maxY,
            w: 4,
            h: 4,
            static: true,
            minW: 4,
            minH: 4,
        });

        return widgetLayouts;
    }, [layout, widgets, cols]);

    const handleLayoutChange = useCallback((newLayout: any) => {
        // Filter out the add-widget placeholder and save
        const widgetLayout: LayoutItem[] = (newLayout as any[])
            .filter(item => item.i !== 'add-widget')
            .map(({ i, x, y, w, h }) => ({
                i,
                x,
                y,
                w,
                h,
                minW: 3,
                minH: 3,
                maxW: 12,
                maxH: 10,
            }));

        updateLayout(widgetLayout);
    }, [updateLayout]);

    const renderWidget = (widgetId: string) => {
        if (widgetId === 'add-widget') {
            return <AddWidgetCard />;
        }

        const widget = widgets.find(w => w.id === widgetId);
        if (!widget) return null;

        switch (widget.displayMode) {
            case 'table':
                return <WidgetTable widget={widget} />;
            case 'chart':
                return <WidgetChart widget={widget} />;
            default:
                return <WidgetCard widget={widget} />;
        }
    };

    const allIds = [...widgets.map(w => w.id), 'add-widget'];

    return (
        <div ref={containerRef} className="w-full min-h-[500px]">
            <ReactGridLayout
                className="widget-grid"
                layout={gridLayout as any}
                cols={cols}
                rowHeight={70}
                width={containerWidth}
                margin={[16, 16]}
                containerPadding={[0, 0]}
                onLayoutChange={handleLayoutChange as any}
                isDraggable={true}
                isResizable={true}
                draggableHandle=".drag-handle"
                useCSSTransforms={true}
                compactType="vertical"
                preventCollision={false}
            >
                {allIds.map((id, index) => (
                    <div
                        key={id}
                        className="widget-wrapper"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                delay: Math.min(index * 0.05, 0.3),
                                type: 'spring',
                                stiffness: 300,
                                damping: 25,
                            }}
                            className="h-full"
                        >
                            {renderWidget(id)}
                        </motion.div>
                    </div>
                ))}
            </ReactGridLayout>
        </div>
    );
}
