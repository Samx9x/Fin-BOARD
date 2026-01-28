'use client';

import { motion } from 'framer-motion';
import { X, TrendingUp, LineChart, Table, BarChart } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useDashboardStore } from '@/store/dashboardStore';

export interface WidgetTemplate {
    id: string;
    name: string;
    icon: string;
    description: string;
    displayMode: 'card' | 'chart' | 'table';
    apiUrl: string;
    fields: Array<{ path: string; label: string; format?: 'currency' | 'percentage' | 'number' | 'text' }>;
    refreshInterval?: number;
    chartConfig?: {
        type: 'line' | 'area' | 'candlestick';
        xAxisField?: string;
        yAxisField?: string;
        interval?: 'daily' | 'weekly' | 'monthly';
    };
}

export interface DashboardTemplate {
    id: string;
    name: string;
    description: string;
    widgets: Omit<WidgetTemplate, 'id'>[];
}

const widgetTemplates: WidgetTemplate[] = [
    {
        id: 'btc-multi-currency',
        name: 'BTC Multi-Currency',
        icon: '💰',
        description: 'Live Bitcoin rates in INR, USD, and ETH',
        displayMode: 'card',
        apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
        fields: [
            { path: 'data.rates.INR', label: 'INR', format: 'currency' },
            { path: 'data.rates.USD', label: 'USD', format: 'currency' },
            { path: 'data.rates.ETH', label: 'ETH', format: 'number' }
        ]
    },
    {
        id: 'crypto-market',
        name: 'Crypto Market Overview',
        icon: '📊',
        description: 'Top 25 cryptocurrencies by market cap (via CoinGecko)',
        displayMode: 'table',
        apiUrl: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false',
        fields: [
            { path: 'name', label: 'Name', format: 'text' },
            { path: 'symbol', label: 'Symbol', format: 'text' },
            { path: 'current_price', label: 'Price (USD)', format: 'currency' },
            { path: 'price_change_percentage_24h', label: '24h Change', format: 'percentage' },
            { path: 'market_cap', label: 'Market Cap', format: 'currency' }
        ]
    },
    {
        id: 'btc-candlestick',
        name: 'Bitcoin OHLC (Real Data)',
        icon: '📊',
        description: '7-day real OHLC candlestick chart from CoinGecko',
        displayMode: 'chart',
        apiUrl: 'https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=7',
        fields: [
            { path: '[0][4]', label: 'Price', format: 'currency' }
        ],
        chartConfig: {
            type: 'candlestick',
            interval: 'weekly'
        }
    },
    {
        id: 'eth-ohlc',
        name: 'Ethereum OHLC (Real Data)',
        icon: '📈',
        description: '30-day real OHLC from CoinGecko',
        displayMode: 'chart',
        apiUrl: 'https://api.coingecko.com/api/v3/coins/ethereum/ohlc?vs_currency=usd&days=30',
        fields: [
            { path: '[0][4]', label: 'Price', format: 'currency' }
        ],
        chartConfig: {
            type: 'candlestick',
            interval: 'monthly'
        }
    },
    {
        id: 'eth-price',
        name: 'Ethereum Price',
        icon: 'Ξ',
        description: 'Live ETH to USD price',
        displayMode: 'card',
        apiUrl: 'https://api.coinbase.com/v2/prices/ETH-USD/spot',
        fields: [
            { path: 'data.amount', label: 'Price', format: 'currency' }
        ]
    }
];

export function TemplatesModal() {
    const { isTemplatesModalOpen, closeTemplatesModal, addWidget } = useDashboardStore();

    const handleApplyTemplate = (template: WidgetTemplate) => {
        addWidget({
            name: template.name,
            displayMode: template.displayMode,
            apiUrl: template.apiUrl,
            selectedFields: template.fields,
            chartConfig: template.chartConfig,
            refreshInterval: 60,
            lastUpdated: null,
            description: template.description,
            id: '',
            data: null,
            isLoading: false,
            error: null
        });
        closeTemplatesModal();
    };

    return (
        <Modal
            isOpen={isTemplatesModalOpen}
            onClose={closeTemplatesModal}
            title="Widget Templates"
            size="lg"
        >
            <div className="p-6 space-y-4">
                <p className="text-sm text-[var(--text-secondary)]">
                    Choose from pre-configured widgets to quickly add to your dashboard
                </p>

                <div className="grid gap-4">
                    {widgetTemplates.map((template) => (
                        <div
                            key={template.id}
                            className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-4 hover:border-[var(--primary)]/30 transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                    <div className="text-2xl">{template.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-[var(--text-primary)]">{template.name}</h4>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">{template.description}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleApplyTemplate(template)}
                                    className="btn btn-primary px-4 py-1.5 text-sm"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}
