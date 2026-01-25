'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { fetchApiData } from '@/services/apiService';

export function useWidgetData(widgetId: string) {
    const widget = useDashboardStore(state => state.widgets.find(w => w.id === widgetId));
    const updateWidget = useDashboardStore(state => state.updateWidget);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const apiUrl = widget?.apiUrl;
    const refreshInterval = widget?.refreshInterval;

    const fetchData = useCallback(async (forceRefresh = false) => {
        if (!apiUrl) return;

        // If we already have data and this is a background refresh, 
        // don't set global loading to true to avoid UI flickering
        const isInitialFetch = !widget?.data;
        if (isInitialFetch) {
            updateWidget(widgetId, { isLoading: true, error: null });
        }

        const result = await fetchApiData(apiUrl, forceRefresh);

        if (result.success) {
            updateWidget(widgetId, {
                data: result.data,
                lastUpdated: new Date().toISOString(),
                isLoading: false,
                error: null,
            });
        } else {
            // STALE-WHILE-REVALIDATION: 
            // If we have previous data, keep it but stop loading. 
            // Only show error if we have NO data.
            updateWidget(widgetId, {
                isLoading: false,
                error: isInitialFetch ? (result.error || 'Failed to fetch data') : null,
            });

            if (!isInitialFetch) {
                console.warn(`Background refresh failed for widget ${widgetId}, keeping stale data.`);
            }
        }
    }, [widgetId, apiUrl, updateWidget, widget?.data]);

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
