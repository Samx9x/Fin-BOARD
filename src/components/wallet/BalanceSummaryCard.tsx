'use client';

import { Wallet } from 'lucide-react';

interface BalanceSummaryCardProps {
    totalBalance: number;
    income: number;
    expenses: number;
}

export function BalanceSummaryCard({ totalBalance, income, expenses }: BalanceSummaryCardProps) {
    return (
        <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-6 overflow-hidden border border-[var(--border-subtle)]">
            {/* Decorative curved lines background */}
            <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
                    <path d="M 0,100 Q 250,50 500,100 T 1000,100" stroke="white" strokeWidth="2" fill="none" />
                    <path d="M 0,120 Q 250,70 500,120 T 1000,120" stroke="white" strokeWidth="2" fill="none" />
                    <path d="M 0,80 Q 250,30 500,80 T 1000,80" stroke="white" strokeWidth="2" fill="none" />
                </svg>
            </div>

            {/* Wallet Icon */}
            <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center backdrop-blur-sm">
                <Wallet className="w-6 h-6 text-[var(--primary)]" />
            </div>

            <div className="relative z-10 flex items-center gap-12">
                {/* Total Balance */}
                <div>
                    <p className="text-xs text-gray-400 mb-1">Total Balance</p>
                    <h2 className="text-4xl font-bold text-white">
                        ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                </div>

                {/* Income & Expenses Row */}
                <div className="flex items-center gap-12 flex-1">
                    {/* My Income */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <Wallet className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">My Income</p>
                            <p className="text-lg font-bold text-white">
                                ${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>

                    {/* My Expenses */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                            <Wallet className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">My Expenses</p>
                            <p className="text-lg font-bold text-white">
                                ${expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
