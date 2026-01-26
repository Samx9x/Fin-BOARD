'use client';

import { Bitcoin, DollarSign, TrendingUp, PieChart } from 'lucide-react';
import { StockBarChart } from '@/components/analytics/StockBarChart';
import { TrendAreaChart } from '@/components/analytics/TrendAreaChart';
import { PortfolioPieChart } from '@/components/analytics/PortfolioPieChart';

// Crypto data for bar chart
const cryptoData = [
    { name: 'BTC', value: 72000 },
    { name: 'ETH', value: 5200 },
    { name: 'SOL', value: 235 },
    { name: 'XRP', value: 620 },
    { name: 'ADA', value: 580 },
    { name: 'DOT', value: 850 },
];

// Stock data for bar chart
const stockData = [
    { name: 'AAPL', value: 235 },
    { name: 'GOOGL', value: 180 },
    { name: 'MSFT', value: 490 },
    { name: 'NVDA', value: 950 },
    { name: 'TSLA', value: 245 },
    { name: 'AMZN', value: 195 },
];

// Monthly trends for area charts
const cryptoMonthlyTrends = [
    { name: 'Jan', BTC: 42000, ETH: 2800, SOL: 95 },
    { name: 'Feb', BTC: 44500, ETH: 3100, SOL: 110 },
    { name: 'Mar', BTC: 38000, ETH: 2500, SOL: 85 },
    { name: 'Apr', BTC: 46000, ETH: 3300, SOL: 130 },
    { name: 'May', BTC: 52000, ETH: 3800, SOL: 145 },
    { name: 'Jun', BTC: 48000, ETH: 3500, SOL: 125 },
    { name: 'Jul', BTC: 55000, ETH: 4000, SOL: 160 },
    { name: 'Aug', BTC: 58000, ETH: 4200, SOL: 175 },
    { name: 'Sep', BTC: 54000, ETH: 3900, SOL: 155 },
    { name: 'Oct', BTC: 62000, ETH: 4500, SOL: 190 },
    { name: 'Nov', BTC: 68000, ETH: 4800, SOL: 210 },
    { name: 'Dec', BTC: 72000, ETH: 5200, SOL: 235 },
];

const stockMonthlyTrends = [
    { name: 'Jan', AAPL: 180, GOOGL: 140, MSFT: 380 },
    { name: 'Feb', AAPL: 185, GOOGL: 142, MSFT: 395 },
    { name: 'Mar', AAPL: 172, GOOGL: 138, MSFT: 375 },
    { name: 'Apr', AAPL: 178, GOOGL: 145, MSFT: 400 },
    { name: 'May', AAPL: 188, GOOGL: 150, MSFT: 410 },
    { name: 'Jun', AAPL: 195, GOOGL: 155, MSFT: 420 },
    { name: 'Jul', AAPL: 198, GOOGL: 160, MSFT: 435 },
    { name: 'Aug', AAPL: 192, GOOGL: 158, MSFT: 425 },
    { name: 'Sep', AAPL: 205, GOOGL: 165, MSFT: 440 },
    { name: 'Oct', AAPL: 215, GOOGL: 170, MSFT: 455 },
    { name: 'Nov', AAPL: 225, GOOGL: 175, MSFT: 470 },
    { name: 'Dec', AAPL: 235, GOOGL: 180, MSFT: 490 },
];

const cryptoColors = {
    BTC: '#f7931a',
    ETH: '#627eea',
    SOL: '#14f195',
    XRP: '#23292f',
    ADA: '#0033ad',
    DOT: '#e6007a',
};

const stockColors = {
    AAPL: '#555555',
    GOOGL: '#4285f4',
    MSFT: '#00a4ef',
    NVDA: '#76b900',
    TSLA: '#cc0000',
    AMZN: '#ff9900',
};

// Portfolio allocation data
const cryptoPortfolio = [
    { name: 'Bitcoin', value: 45000, color: '#f7931a', percentage: 45 },
    { name: 'Ethereum', value: 28000, color: '#627eea', percentage: 28 },
    { name: 'Solana', value: 15000, color: '#14f195', percentage: 15 },
    { name: 'Others', value: 12000, color: '#666666', percentage: 12 },
];

const stockPortfolio = [
    { name: 'Tech', value: 42000, color: '#4285f4', percentage: 42 },
    { name: 'Finance', value: 25000, color: '#14f195', percentage: 25 },
    { name: 'Healthcare', value: 18000, color: '#f7931a', percentage: 18 },
    { name: 'Energy', value: 15000, color: '#e6007a', percentage: 15 },
];

// Asset performance data
const assetPerformance = [
    { name: 'Stocks', value: 65000, color: '#4285f4', percentage: 48.5 },
    { name: 'Crypto', value: 42000, color: '#f7931a', percentage: 31.3 },
    { name: 'Bonds', value: 18000, color: '#14f195', percentage: 13.4 },
    { name: 'Cash', value: 9000, color: '#666666', percentage: 6.7 },
];

export function AnalyticsSection() {
    return (
        <div className="">
            <div className="max-w-[1400px] mx-auto">
                {/* Page Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Analytics</h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Track and analyze your investment portfolio performance
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Row 1: Current Prices - Bar Charts */}
                    <div className="grid grid-cols-2 gap-6">
                        <StockBarChart
                            title="Crypto Current Prices"
                            data={cryptoData}
                            color="#f7931a"
                        />
                        <StockBarChart
                            title="Stock Current Prices"
                            data={stockData}
                            color="#4285f4"
                        />
                    </div>

                    {/* Row 2: Monthly Trends - Area Charts with Gradients */}
                    <div className="grid grid-cols-2 gap-6">
                        <TrendAreaChart
                            title="Crypto Monthly Trends"
                            data={cryptoMonthlyTrends}
                            items={['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOT']}
                            colors={cryptoColors}
                        />
                        <TrendAreaChart
                            title="Stock Monthly Trends"
                            data={stockMonthlyTrends}
                            items={['AAPL', 'GOOGL', 'MSFT', 'NVDA', 'TSLA', 'AMZN']}
                            colors={stockColors}
                        />
                    </div>

                    {/* Row 3: Portfolio Allocation - Pie Charts */}
                    <div className="grid grid-cols-3 gap-6">
                        <PortfolioPieChart
                            title="Crypto Portfolio"
                            data={cryptoPortfolio}
                        />
                        <PortfolioPieChart
                            title="Stock Sectors"
                            data={stockPortfolio}
                        />
                        <PortfolioPieChart
                            title="Asset Allocation"
                            data={assetPerformance}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
