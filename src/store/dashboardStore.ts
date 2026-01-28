'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Widget, LayoutItem, Toast, ApiProvider } from '@/types';

interface DashboardStore {
    // State
    widgets: Widget[];
    layout: LayoutItem[];
    theme: 'dark' | 'light';
    isAddWidgetModalOpen: boolean;
    isTemplatesModalOpen: boolean;
    isSettingsModalOpen: boolean;
    editingWidget: Widget | null;
    toasts: Toast[];
    apiKeys: Record<string, string>;
    apiProviders: ApiProvider[];
    urlHistory: string[]; // Previously used API URLs
    useCorsProxy: boolean; // Whether to use CORS proxy for blocked APIs
    userName: string; // User's name for personalized greeting
    isFirstVisit: boolean; // True if user hasn't entered their name yet

    // Widget Actions
    addWidget: (widget: Widget) => void;
    removeWidget: (id: string) => void;
    updateWidget: (id: string, updates: Partial<Widget>) => void;
    refreshWidget: (id: string) => void;
    refreshAllWidgets: () => void;

    // Layout Actions
    updateLayout: (layout: LayoutItem[]) => void;

    // Modal Actions
    openAddWidgetModal: () => void;
    closeAddWidgetModal: () => void;
    openTemplatesModal: () => void;
    closeTemplatesModal: () => void;
    openSettingsModal: () => void;
    closeSettingsModal: () => void;
    setEditingWidget: (widget: Widget | null) => void;

    // Theme Actions
    toggleTheme: () => void;
    setTheme: (theme: 'dark' | 'light') => void;

    // API Key Actions
    setApiKey: (domain: string, key: string) => void;
    addApiProvider: (provider: ApiProvider) => void;
    updateApiProvider: (id: string, updates: Partial<ApiProvider>) => void;
    removeApiProvider: (id: string) => void;

    // URL History & CORS Actions
    addUrlToHistory: (url: string) => void;
    toggleCorsProxy: () => void;
    setCorsProxy: (enabled: boolean) => void;

    // Toast Actions
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;

    // Data Export/Import
    exportConfig: () => string;
    importConfig: (config: string) => boolean;

    // User Actions
    setUserName: (name: string) => void;
    clearAllWidgets: () => void;
}


const generateId = () => Math.random().toString(36).substring(2, 15);

export const useDashboardStore = create<DashboardStore>()(
    persist(
        (set, get) => ({
            // Initial State
            widgets: [],
            layout: [],
            theme: 'dark',
            isAddWidgetModalOpen: false,
            isTemplatesModalOpen: false,
            isSettingsModalOpen: false,
            editingWidget: null,
            toasts: [],
            apiKeys: {},
            apiProviders: [
                {
                    id: 'coinbase',
                    name: 'Coinbase',
                    domain: 'api.coinbase.com',
                    rateLimit: { callsPerMinute: 30, delay: 2000 },
                    isFreeApi: true,
                    defaultEndpoint: 'https://api.coinbase.com/v2/prices/BTC-USD/spot',
                    getKeyUrl: 'https://www.coinbase.com/cloud'
                },
                {
                    id: 'alphavantage',
                    name: 'Alpha Vantage',
                    domain: 'alphavantage.co',
                    rateLimit: { callsPerMinute: 5, delay: 12100 },
                    keyParamName: 'apikey',
                    authMethod: 'query',
                    getKeyUrl: 'https://www.alphavantage.co/support/#api-key',
                    defaultEndpoint: 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD'
                },
                {
                    id: 'finnhub',
                    name: 'Finnhub',
                    domain: 'finnhub.io',
                    rateLimit: { callsPerMinute: 60, delay: 1000 },
                    keyParamName: 'token',
                    authMethod: 'query',
                    getKeyUrl: 'https://finnhub.io/register',
                    defaultEndpoint: 'https://finnhub.io/api/v1/news?category=general'
                },
                {
                    id: 'indianapi',
                    name: 'IndianAPI',
                    domain: 'indianapi.in',
                    rateLimit: { callsPerMinute: 30, delay: 2000 },
                    authMethod: 'header',
                    headerName: 'X-API-Key',
                    getKeyUrl: 'https://indianapi.in/',
                    defaultEndpoint: 'https://indianapi.in/api/v1/stock'
                },
                {
                    id: 'coingecko',
                    name: 'CoinGecko',
                    domain: 'api.coingecko.com',
                    rateLimit: { callsPerMinute: 30, delay: 2000 },
                    authMethod: 'header',
                    headerName: 'x-cg-demo-api-key',
                    getKeyUrl: 'https://www.coingecko.com/en/api',
                    defaultEndpoint: 'https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=7'
                }
            ],
            urlHistory: [],
            useCorsProxy: false,
            userName: '',
            isFirstVisit: true,

            // Widget Actions
            addWidget: (widget) => {
                const newWidget = { ...widget, id: generateId() };
                const widgetCount = get().widgets.length;

                // Calculate position for new widget
                const newLayoutItem: LayoutItem = {
                    i: newWidget.id,
                    x: (widgetCount * 4) % 12,
                    y: Math.floor(widgetCount / 3) * 4,
                    w: widget.displayMode === 'table' ? 8 : 4,
                    h: widget.displayMode === 'table' ? 5 : 4,
                    minW: 3,
                    minH: 3,
                };

                set((state) => ({
                    widgets: [...state.widgets, newWidget],
                    layout: [...state.layout, newLayoutItem],
                }));

                get().addToast({
                    type: 'success',
                    title: 'Widget Added',
                    message: `${widget.name} has been added to your dashboard`,
                });
            },

            removeWidget: (id) => {
                const widget = get().widgets.find(w => w.id === id);
                set((state) => ({
                    widgets: state.widgets.filter((w) => w.id !== id),
                    layout: state.layout.filter((l) => l.i !== id),
                }));

                if (widget) {
                    get().addToast({
                        type: 'info',
                        title: 'Widget Removed',
                        message: `${widget.name} has been removed`,
                    });
                }
            },

            updateWidget: (id, updates) => {
                set((state) => ({
                    widgets: state.widgets.map((w) =>
                        w.id === id ? { ...w, ...updates } : w
                    ),
                }));
            },

            refreshWidget: (id) => {
                // This triggers a re-fetch in the widget component
                set((state) => ({
                    widgets: state.widgets.map((w) =>
                        w.id === id ? { ...w, lastUpdated: null } : w
                    ),
                }));
            },

            refreshAllWidgets: () => {
                set((state) => ({
                    widgets: state.widgets.map((w) => ({ ...w, lastUpdated: null }))
                }));
                get().addToast({
                    type: 'info',
                    title: 'Refreshing All',
                    message: 'All widgets are being updated...',
                });
            },

            // Layout Actions
            updateLayout: (layout) => {
                set({ layout });
            },

            // Modal Actions
            openAddWidgetModal: () => set({ isAddWidgetModalOpen: true }),
            closeAddWidgetModal: () => set({ isAddWidgetModalOpen: false, editingWidget: null }),
            openTemplatesModal: () => set({ isTemplatesModalOpen: true }),
            closeTemplatesModal: () => set({ isTemplatesModalOpen: false }),
            openSettingsModal: () => set({ isSettingsModalOpen: true }),
            closeSettingsModal: () => set({ isSettingsModalOpen: false }),
            setEditingWidget: (widget) => set({ editingWidget: widget }),
            toggleTheme: () => {
                set((state) => ({
                    theme: state.theme === 'dark' ? 'light' : 'dark',
                }));
            },

            setTheme: (theme) => {
                set({ theme });
            },

            // API Key Actions
            setApiKey: (domain, key) => {
                set((state) => ({
                    apiKeys: { ...state.apiKeys, [domain.toLowerCase()]: key }
                }));
            },

            addApiProvider: (provider) => {
                set((state) => ({
                    apiProviders: [...state.apiProviders, provider]
                }));
            },

            updateApiProvider: (id, updates) => {
                set((state) => ({
                    apiProviders: state.apiProviders.map(p =>
                        p.id === id ? { ...p, ...updates } : p
                    )
                }));
            },

            removeApiProvider: (id) => {
                set((state) => ({
                    apiProviders: state.apiProviders.filter(p => p.id !== id)
                }));
            },

            // URL History & CORS Actions
            addUrlToHistory: (url) => {
                set((state) => {
                    // Remove duplicates and add to front, limit to 50
                    const filtered = state.urlHistory.filter(u => u !== url);
                    return { urlHistory: [url, ...filtered].slice(0, 50) };
                });
            },

            toggleCorsProxy: () => {
                set((state) => ({ useCorsProxy: !state.useCorsProxy }));
            },

            setCorsProxy: (enabled) => {
                set({ useCorsProxy: enabled });
            },

            // Toast Actions
            addToast: (toast) => {
                const id = generateId();
                const newToast = { ...toast, id };

                set((state) => ({
                    toasts: [...state.toasts, newToast],
                }));

                // Auto-remove toast after duration
                setTimeout(() => {
                    get().removeToast(id);
                }, toast.duration || 4000);
            },

            removeToast: (id) => {
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id),
                }));
            },

            // Data Export/Import
            exportConfig: () => {
                const { widgets, layout, theme, apiKeys, apiProviders } = get();
                return JSON.stringify({ widgets, layout, theme, apiKeys, apiProviders }, null, 2);
            },

            importConfig: (config) => {
                try {
                    const parsed = JSON.parse(config);
                    if (parsed.widgets && parsed.layout) {
                        set({
                            widgets: parsed.widgets,
                            layout: parsed.layout,
                            theme: parsed.theme || 'dark',
                            apiKeys: parsed.apiKeys || {},
                            apiProviders: parsed.apiProviders || get().apiProviders,
                        });
                        get().addToast({
                            type: 'success',
                            title: 'Config Imported',
                            message: 'Dashboard configuration has been restored',
                        });
                        return true;
                    }
                    return false;
                } catch {
                    get().addToast({
                        type: 'error',
                        title: 'Import Failed',
                        message: 'Invalid configuration file',
                    });
                    return false;
                }
            },

            // User Actions
            setUserName: (name) => {
                set({ userName: name, isFirstVisit: false });
            },

            clearAllWidgets: () => {
                set({ widgets: [], layout: [] });
                get().addToast({
                    type: 'success',
                    title: 'Dashboard Cleared',
                    message: 'All widgets have been removed.',
                });
            },
        }),
        {
            name: 'finboard-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                widgets: state.widgets,
                layout: state.layout,
                theme: state.theme,
                apiKeys: state.apiKeys,
                urlHistory: state.urlHistory,
                useCorsProxy: state.useCorsProxy,
                userName: state.userName,
                isFirstVisit: state.isFirstVisit,
                // Don't persist apiProviders - always use code-defined ones
            }),
            merge: (persistedState: any, currentState) => ({
                ...currentState,
                ...persistedState,
                // Always use code-defined providers (not persisted ones)
                apiProviders: currentState.apiProviders,
            }),
        }

    )
);
