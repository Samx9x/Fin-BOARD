// Widget Types
export type WidgetDisplayMode = 'card' | 'table' | 'chart';

export interface SelectedField {
    path: string;
    label: string;
    format?: 'currency' | 'percentage' | 'number' | 'text';
}

export interface Widget {
    id: string;
    name: string;
    apiUrl: string;
    refreshInterval: number;
    displayMode: WidgetDisplayMode;
    selectedFields: SelectedField[];
    chartConfig?: {
        type: 'line' | 'candlestick' | 'area';
        xAxisField?: string;
        yAxisField?: string;
        interval?: 'daily' | 'weekly' | 'monthly';
    };
    data: unknown;
    lastUpdated: string | null;
    isLoading: boolean;
    error: string | null;
}

export interface LayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
}

// API Response Types
export interface ApiField {
    path: string;
    type: string;
    value: unknown;
    isArray: boolean;
}

export interface ApiTestResult {
    success: boolean;
    message: string;
    fields: ApiField[];
    data?: unknown;
}

// Dashboard State
export interface DashboardState {
    widgets: Widget[];
    layout: LayoutItem[];
    theme: 'dark' | 'light';
    isAddWidgetModalOpen: boolean;
}

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

// Command Palette
export interface Command {
    id: string;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    action: () => void;
    keywords?: string[];
}
