'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { RevenueChart, StatCard, AvailableDonut } from '@/components/dashboard/RevenueChart';
import { WalletCard, TransactionsList } from '@/components/dashboard/WalletSection';
import { MonthlyExpenditureChart } from '@/components/dashboard/MonthlyExpenditureChart';
import { BalanceSummaryCard } from '@/components/wallet/BalanceSummaryCard';
import { CardCarousel, PaymentCard } from '@/components/wallet/CardCarousel';
import { CardTransactions, Transaction } from '@/components/wallet/CardTransactions';
import { AccountEvolution, Account } from '@/components/wallet/AccountEvolution';

// Filter tabs for wallet
const walletTabs = ['All', 'Withdrawal', 'Savings', 'Deposit'];

// Sample payment cards
const sampleCards: PaymentCard[] = [
    {
        id: '1',
        type: 'Credit Card',
        bankName: 'MahakBank',
        cardNumber: '0918 8124 0042 8129',
        expiryDate: '12/20',
        holderName: 'Juan T.',
        currency: 'US Dollar',
        status: 'Active',
        balance: 23230,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
        id: '2',
        type: 'Debit Card',
        bankName: 'Chase Bank',
        cardNumber: '4532 1234 5678 9012',
        expiryDate: '08/24',
        holderName: 'Juan T.',
        currency: 'US Dollar',
        status: 'Active',
        balance: 15420,
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
        id: '3',
        type: 'Credit Card',
        bankName: 'Wells Fargo',
        cardNumber: '5421 9876 5432 1098',
        expiryDate: '03/25',
        holderName: 'Juan T.',
        currency: 'US Dollar',
        status: 'Active',
        balance: 8900,
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
];

// Sample transactions
const sampleTransactions: Transaction[] = [
    { id: '1', cardId: '1', merchant: 'PayPal', description: 'Sketch anual subscription', amount: -399, type: 'debit', date: 'Today', time: '20:42', category: 'Software', icon: '💳' },
    { id: '2', cardId: '1', merchant: 'Burger King', description: 'Buy in a commerce', amount: -20, type: 'debit', date: 'Today', time: '18:30', category: 'Food', icon: '🍔' },
    { id: '3', cardId: '2', merchant: 'PayPal', description: 'Buy in American Eagle S.A.', amount: -320, type: 'debit', date: 'Friday 31', time: '20:01', category: 'Shopping', icon: '💳' },
    { id: '4', cardId: '2', merchant: 'PayPal', description: 'Received from Josh Smith', amount: 500, type: 'credit', date: 'Friday 31', time: '19:15', category: 'Transfer', icon: '💳' },
    { id: '5', cardId: '1', merchant: 'PayPal', description: 'Notion subscription', amount: -9.99, type: 'debit', date: 'Friday 31', time: '16:30', category: 'Software', icon: '💳' },
    { id: '6', cardId: '3', merchant: 'BestBuy', description: 'Buy in a commerce', amount: -499, type: 'debit', date: 'Friday 31', time: '14:20', category: 'Electronics', icon: '🛒' },
];

// Sample accounts
const sampleAccounts: Account[] = [
    {
        id: '1',
        name: 'Principal Account',
        bankName: 'Bank brand name',
        accountNumber: '2845',
        interbank: '177632',
        accountType: 'Savings account',
        balance: 125320.00,
    },
    {
        id: '2',
        name: 'Secondary Account',
        bankName: 'Chase Bank',
        accountNumber: '5429',
        interbank: '189234',
        accountType: 'Checking account',
        balance: 45200.00,
    },
];

export function WalletSection() {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedCardId, setSelectedCardId] = useState<string | undefined>(sampleCards[0]?.id);

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

                {/* Balance Summary Card */}
                <div className="mb-6">
                    <BalanceSummaryCard
                        totalBalance={20129.00}
                        income={20129.00}
                        expenses={20129.00}
                    />
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column - Charts & Cards */}
                    <div className="col-span-8 space-y-6">
                        {/* Monthly Expenditure Chart */}
                        <MonthlyExpenditureChart />

                        {/* Card Carousel and Transactions */}
                        <div className="grid grid-cols-2 gap-6">
                            <CardCarousel cards={sampleCards} />
                            <CardTransactions
                                transactions={sampleTransactions}
                                selectedCardId={selectedCardId}
                            />
                        </div>

                        {/* Account Evolution */}
                        <AccountEvolution
                            accounts={sampleAccounts}
                            selectedAccountId={sampleAccounts[0].id}
                        />
                    </div>

                    {/* Right Column - Wallet & Stats */}
                    <div className="col-span-4 space-y-6">
                        {/* Bottom Row - Available + Income/Expense */}
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
            </div>
        </div>
    );
}
