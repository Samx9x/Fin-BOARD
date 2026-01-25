'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { fetchApiData } from '@/services/apiService';

export function useWidgetData(widgetId: string) {
    const widget = useDashboardStore(state => state.widgets.find(w => w.id === widgetId));
    const updateWidget = useDashboardStore(state => state.updateWidget);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchData = useCallback(async (forceRefresh = false) => {
        if (!widget) return;

        updateWidget(widgetId, { isLoading: true, error: null });

        const result = await fetchApiData(widget.apiUrl, forceRefresh);

        if (result.success) {
            updateWidget(widgetId, {
                data: result.data,
                lastUpdated: new Date().toISOString(),
                isLoading: false,
                error: null,
            });
        } else {
            updateWidget(widgetId, {
                isLoading: false,
                error: result.error || 'Failed to fetch data',
            });
        }
    }, [widget, widgetId, updateWidget]);

    // Initial fetch and interval setup
    useEffect(() => {
        if (!widget) return;

        // Initial fetch if no data or needs refresh
        if (!widget.data || !widget.lastUpdated) {
            fetchData();
        }

        // Setup refresh interval
        if (widget.refreshInterval > 0) {
            intervalRef.current = setInterval(() => {
                fetchData(true);
            }, widget.refreshInterval * 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [widget?.refreshInterval, widget?.apiUrl, fetchData]);

    const refresh = useCallback(() => {
        fetchData(true);
    }, [fetchData]);

    return {
        data: widget?.data,
        isLoading: widget?.isLoading || false,
        error: widget?.error,
        lastUpdated: widget?.lastUpdated,
        refresh,
    };
}

// Hook for auto-refresh countdown
export function useRefreshCountdown(widgetId: string) {
    const widget = useDashboardStore(state => state.widgets.find(w => w.id === widgetId));

    if (!widget?.lastUpdated || !widget.refreshInterval) {
        return null;
    }

    const lastUpdate = new Date(widget.lastUpdated).getTime();
    const nextUpdate = lastUpdate + (widget.refreshInterval * 1000);
    const remaining = Math.max(0, Math.ceil((nextUpdate - Date.now()) / 1000));

    return remaining;
}
