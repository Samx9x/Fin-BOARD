'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';

export interface Transaction {
    id: string;
    cardId: string;
    merchant: string;
    description: string;
    amount: number;
    type: 'debit' | 'credit';
    date: string;
    time: string;
    category: string;
    icon: string;
}

interface CardTransactionsProps {
    transactions: Transaction[];
    selectedCardId?: string;
}

export function CardTransactions({ transactions, selectedCardId }: CardTransactionsProps) {
    const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

    // Filter transactions by card if a card is selected
    const filteredTransactions = selectedCardId
        ? transactions.filter((t) => t.cardId === selectedCardId)
        : transactions;

    // Calculate card stats
    const totalAmount = filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const debits = filteredTransactions.filter((t) => t.type === 'debit');
    const credits = filteredTransactions.filter((t) => t.type === 'credit');
    const debitSum = debits.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const creditSum = credits.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const expenseChange = debitSum > 0 ? ((debitSum - creditSum) / debitSum) * 100 : 0;

    // Group transactions by date
    const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
        const date = transaction.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {} as Record<string, Transaction[]>);

    return (
        <div className="bg-[var(--bg-surface)]/60 rounded-2xl border border-[var(--border-subtle)] p-6">
            {/* Header with Stats */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Card stats</h3>
                    <p className="text-3xl font-bold text-[var(--primary)]">
                        ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)]">
                    <span className="text-sm text-[var(--text-secondary)]">Expenses</span>
                    <button className="flex items-center gap-1">
                        <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                    </button>
                </div>
            </div>

            {/* Expense Change */}
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-red-400" />
                    <span className="text-2xl font-bold text-red-400">+{Math.abs(expenseChange).toFixed(0)}%</span>
                    <span className="text-sm text-red-400/80">compared to previous week</span>
                </div>
            </div>

            {/* Transaction List Header */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                    Card history last transactions
                </h4>
                <button className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                    Sort
                    <ChevronDown className="w-3 h-3" />
                </button>
            </div>

            {/* Transactions List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
                    <div key={date}>
                        {/* Date Header */}
                        <div className="text-xs font-semibold text-[var(--text-muted)] mb-3 uppercase tracking-wide">
                            {date}
                        </div>

                        {/* Transactions for this date */}
                        <div className="space-y-2">
                            {dateTransactions.map((transaction) => (
                                <motion.div
                                    key={transaction.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-between p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)] hover:border-[var(--primary)]/30 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Icon */}
                                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface)] flex items-center justify-center text-xl shrink-0 border border-[var(--border-subtle)]">
                                            {transaction.icon}
                                        </div>

                                        {/* Details */}
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                                                {transaction.merchant}
                                            </p>
                                            <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                                {transaction.description}
                                            </p>
                                            <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                                {transaction.time}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="text-right">
                                        <p
                                            className={`text-lg font-bold ${transaction.type === 'credit'
                                                    ? 'text-emerald-400'
                                                    : 'text-red-400'
                                                }`}
                                        >
                                            {transaction.type === 'credit' ? '+' : '-'}$
                                            {Math.abs(transaction.amount).toFixed(2)}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
