'use client';

import { motion } from 'framer-motion';
import { Bitcoin, Coins, Table, Wrench, Layout, TrendingUp, Building2, BarChart3 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

// Widget Templates
export interface WidgetTemplate {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    apiUrl: string;
    refreshInterval: number;
    displayMode: 'card' | 'table' | 'chart';
    fields: { path: string; label: string }[];
}

export const widgetTemplates: WidgetTemplate[] = [
    {
        id: 'bitcoin-price',
        name: 'Bitcoin Price',
        description: 'Real-time Bitcoin price in USD',
        icon: <Bitcoin className="w-6 h-6 text-[#f7931a]" />,
        apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
        refreshInterval: 30,
        displayMode: 'card',
        fields: [
            { path: 'data.currency', label: 'currency' },
            { path: 'data.rates.USD', label: 'USD' },
            { path: 'data.rates.INR', label: 'INR' },
        ],
    },
    {
        id: 'ethereum-price',
        name: 'Ethereum Price',
        description: 'Real-time Ethereum price in USD',
        icon: <Coins className="w-6 h-6 text-[#627eea]" />,
        apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=ETH',
        refreshInterval: 30,
        displayMode: 'card',
        fields: [
            { path: 'data.currency', label: 'currency' },
            { path: 'data.rates.USD', label: 'USD' },
            { path: 'data.rates.INR', label: 'INR' },
        ],
    },
    {
        id: 'crypto-market-table',
        name: 'Crypto Market Table',
        description: 'Top cryptocurrencies with prices and volume',
        icon: <Table className="w-6 h-6 text-[var(--primary)]" />,
        apiUrl: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1',
        refreshInterval: 60,
        displayMode: 'table',
        fields: [
            { path: '[0].name', label: 'name' },
            { path: '[0].symbol', label: 'symbol' },
            { path: '[0].current_price', label: 'price' },
            { path: '[0].price_change_percentage_24h', label: '24h Change' },
        ],
    },
    {
        id: 'custom-api',
        name: 'Custom API (Advanced)',
        description: 'Connect to any REST API endpoint',
        icon: <Wrench className="w-6 h-6 text-[var(--text-muted)]" />,
        apiUrl: '',
        refreshInterval: 30,
        displayMode: 'card',
        fields: [],
    },
];

// Dashboard Templates
export interface DashboardTemplate {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    widgetCount: number;
    widgets: WidgetTemplate[];
}

export const dashboardTemplates: DashboardTemplate[] = [
    {
        id: 'crypto-starter',
        name: 'Crypto Starter',
        description: 'Track Bitcoin and Ethereum prices',
        icon: <span className="text-3xl">🪙</span>,
        widgetCount: 2,
        widgets: [widgetTemplates[0], widgetTemplates[1]],
    },
    {
        id: 'tech-giants',
        name: 'Tech Giants',
        description: 'Real-time quotes for Apple and Microsoft',
        icon: <Building2 className="w-8 h-8 text-[#3b82f6]" />,
        widgetCount: 2,
        widgets: [], // Would need stock API
    },
    {
        id: 'market-overview',
        name: 'Market Overview',
        description: 'Comprehensive view with BTC chart and top 100 coin table',
        icon: <BarChart3 className="w-8 h-8 text-[var(--primary)]" />,
        widgetCount: 2,
        widgets: [widgetTemplates[0], widgetTemplates[2]],
    },
];

interface TemplatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectWidgetTemplate: (template: WidgetTemplate) => void;
    onSelectDashboardTemplate: (template: DashboardTemplate) => void;
    mode: 'widget' | 'dashboard';
}

export function TemplatesModal({
    isOpen,
    onClose,
    onSelectWidgetTemplate,
    onSelectDashboardTemplate,
    mode
}: TemplatesModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'widget' ? 'Add New Widget' : 'Dashboard Templates'}
            size="lg"
        >
            <div className="p-6">
                {mode === 'widget' ? (
                    <>
                        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">
                            Choose a Widget Template
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {widgetTemplates.map((template) => (
                                <motion.button
                                    key={template.id}
                                    onClick={() => onSelectWidgetTemplate(template)}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="
                    flex flex-col items-start gap-3 p-5
                    bg-[var(--bg-elevated)] rounded-xl
                    border border-[var(--border-subtle)]
                    hover:border-[var(--primary)] hover:bg-[var(--bg-surface)]
                    transition-colors text-left
                  "
                                >
                                    <div className="
                    flex items-center justify-center
                    w-12 h-12 rounded-xl
                    bg-[var(--bg-surface)] border border-[var(--border-subtle)]
                  ">
                                        {template.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[var(--text-primary)]">
                                            {template.name}
                                        </h4>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">
                                            {template.description}
                                        </p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {dashboardTemplates.map((template) => (
                            <motion.button
                                key={template.id}
                                onClick={() => onSelectDashboardTemplate(template)}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="
                  flex flex-col items-start gap-3 p-5
                  bg-[var(--bg-elevated)] rounded-xl
                  border border-[var(--border-subtle)]
                  hover:border-[var(--primary)] hover:bg-[var(--bg-surface)]
                  transition-colors text-left
                "
                            >
                                <div className="
                  flex items-center justify-center
                  w-14 h-14 rounded-xl
                  bg-[var(--bg-surface)] border border-[var(--border-subtle)]
                ">
                                    {template.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--text-primary)]">
                                        {template.name}
                                    </h4>
                                    <p className="text-xs text-[var(--text-muted)] mt-1">
                                        {template.description}
                                    </p>
                                    <p className="text-xs text-[var(--primary)] mt-2">
                                        {template.widgetCount} Widgets
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}

                {/* Cancel Button */}
                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}
