'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { RevenueChart, StatCard, AvailableDonut } from '@/components/dashboard/RevenueChart';
import { WalletCard, TransactionsList } from '@/components/dashboard/WalletSection';

// Filter tabs for wallet
const walletTabs = ['All', 'Withdrawal', 'Savings', 'Deposit'];

// Sample transactions data
const sampleTransactions = [
    { id: '1', name: 'Figma', icon: 'F', amount: 1400, isPositive: false, color: 'figma' },
    { id: '2', name: 'Linkedin', icon: 'in', amount: 100, isPositive: true, color: 'linkedin' },
    { id: '3', name: 'Shopify', icon: 'S', amount: 1200, isPositive: false, color: 'shopify' },
    { id: '4', name: 'Facebook', icon: 'f', amount: 10, isPositive: true, color: 'facebook' },
];

export function WalletSection() {
    const [activeTab, setActiveTab] = useState('All');

    return (
        <div className="p-6 overflow-auto">
            <div className="max-w-[1400px] mx-auto">
                {/* Page Title & Tabs */}
                <div className="flex items-center gap-6 mb-6">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                        My Wallet
                    </h2>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 mb-6">
                    {walletTabs.map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <motion.button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                  px-5 py-2 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${isActive
                                        ? 'bg-[var(--primary)] text-black'
                                        : 'bg-transparent border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--text-primary)]'
                                    }
                `}
                            >
                                {tab}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column - Charts & Stats */}
                    <div className="col-span-8 space-y-6">
                        {/* Revenue Chart */}
                        <RevenueChart />

                        {/* Bottom Row - Available + Income/Expense */}
                        <div className="grid grid-cols-3 gap-6">
                            {/* Available Donut */}
                            <AvailableDonut />

                            {/* Income Card */}
                            <StatCard
                                label="Income"
                                value={4585}
                                trend="up"
                                description="Monitor your income regularly to stay on track and allocate a portion to savings each month for better financial growth."
                            />

                            {/* Expense Card */}
                            <StatCard
                                label="Expense"
                                value={2585}
                                trend="down"
                                description="Track your expenses daily to avoid overspending and categorize them to better manage your budget."
                            />
                        </div>
                    </div>

                    {/* Right Column - Wallet & Transactions */}
                    <div className="col-span-4 space-y-6">
                        {/* Revenue Flow Card with Wallet */}
                        <div className="
              bg-[var(--bg-surface)]/60 rounded-2xl
              border border-[var(--border-subtle)]
              p-5
            ">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                    Revenue Flow
                                </h3>
                                <button className="
                  flex items-center gap-1 text-sm text-[var(--text-muted)]
                  hover:text-[var(--primary)] transition-colors
                ">
                                    View all <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Wallet Card */}
                            <WalletCard
                                balance={456000}
                                cardNumber="4500 1212 0202 1894"
                                expiryDate="08/24"
                            />
                        </div>

                        {/* Transactions */}
                        <TransactionsList transactions={sampleTransactions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
