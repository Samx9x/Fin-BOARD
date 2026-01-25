'use client';

import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface BalanceSummaryCardProps {
    totalBalance: number;
    income: number;
    expenses: number;
}

export function BalanceSummaryCard({ totalBalance, income, expenses }: BalanceSummaryCardProps) {
    return (
        <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 overflow-hidden border border-[var(--border-subtle)]">
            {/* Decorative curved lines background */}
            <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 500 300" preserveAspectRatio="none">
                    <path d="M 0,150 Q 125,50 250,150 T 500,150" stroke="white" strokeWidth="2" fill="none" />
                    <path d="M 0,180 Q 125,80 250,180 T 500,180" stroke="white" strokeWidth="2" fill="none" />
                    <path d="M 0,120 Q 125,20 250,120 T 500,120" stroke="white" strokeWidth="2" fill="none" />
                </svg>
            </div>

            {/* Wallet Icon */}
            <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center backdrop-blur-sm">
                <Wallet className="w-8 h-8 text-[var(--primary)]" />
            </div>

            {/* Total Balance */}
            <div className="relative z-10 mb-12">
                <p className="text-sm text-gray-400 mb-2">Total Balance</p>
                <h2 className="text-5xl font-bold text-white">
                    ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
            </div>

            {/* Income & Expenses Row */}
            <div className="relative z-10 grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
                {/* My Income */}
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <Wallet className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">My Income</p>
                        <p className="text-2xl font-bold text-white">
                            ${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* My Expenses */}
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                        <Wallet className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">My Expenses</p>
                        <p className="text-2xl font-bold text-white">
                            ${expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
