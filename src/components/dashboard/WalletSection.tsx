'use client';

import { motion } from 'framer-motion';
import { Plus, ArrowRight } from 'lucide-react';

interface WalletCardProps {
    balance: number;
    cardNumber: string;
    expiryDate: string;
}

export function WalletCard({ balance, cardNumber, expiryDate }: WalletCardProps) {
    return (
        <div className="relative">
            {/* Card Container with 3D effect */}
            <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className="
          relative overflow-hidden
          w-full aspect-[1.6/1]
          rounded-2xl
          bg-gradient-to-br from-[#00d09c] via-[#00b386] to-[#008f6b]
          p-5
          shadow-lg shadow-[#00d09c]/20
        "
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                        <rect x="100" y="0" width="100" height="100" fill="#0a5" opacity="0.5" />
                        <rect x="150" y="50" width="50" height="100" fill="#073" opacity="0.4" />
                        <rect x="120" y="80" width="40" height="60" fill="#095" opacity="0.3" />
                    </svg>
                </div>

                {/* Add Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="
            absolute top-4 right-4
            w-8 h-8 rounded-full
            bg-white/20 backdrop-blur-sm
            flex items-center justify-center
            text-white
            border border-white/30
          "
                >
                    <Plus className="w-4 h-4" />
                </motion.button>

                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col justify-end">
                    <p className="text-white/80 text-xs mb-1">Total Balance</p>
                    <p className="text-white text-3xl font-bold mb-3">
                        ${balance.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between">
                        <p className="text-white/70 text-xs font-mono tracking-wider">
                            {cardNumber}
                        </p>
                        <p className="text-white/70 text-xs">{expiryDate}</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

interface Transaction {
    id: string;
    name: string;
    icon: string;
    amount: number;
    isPositive: boolean;
    color: string;
}

interface TransactionsListProps {
    transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
    const brandColors: Record<string, string> = {
        Figma: 'bg-gradient-to-br from-pink-500 to-purple-600',
        Linkedin: 'bg-[#0077b5]',
        Shopify: 'bg-[#96bf48]',
        Facebook: 'bg-[#1877f2]',
    };

    return (
        <div className="
      bg-[var(--bg-surface)]/80 rounded-2xl
      border border-[var(--border-subtle)]
      p-5
    ">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Transactions
                </h3>
                <button className="
          flex items-center gap-1 text-sm text-[var(--text-muted)]
          hover:text-[var(--primary)] transition-colors
        ">
                    View all <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Transaction Items */}
            <div className="space-y-3">
                {transactions.map((tx) => (
                    <motion.div
                        key={tx.id}
                        whileHover={{ x: 4 }}
                        className="
              flex items-center justify-between
              p-3 rounded-xl
              hover:bg-[var(--bg-elevated)]/50
              transition-colors cursor-pointer
            "
                    >
                        <div className="flex items-center gap-3">
                            {/* Brand Icon */}
                            <div className={`
                w-10 h-10 rounded-xl
                flex items-center justify-center
                text-white text-sm font-bold
                ${brandColors[tx.name] || 'bg-gray-500'}
              `}>
                                {tx.icon}
                            </div>
                            <span className="font-medium text-[var(--text-primary)]">
                                {tx.name}
                            </span>
                        </div>
                        <span className={`
              font-semibold
              ${tx.isPositive ? 'text-[var(--success)]' : 'text-[var(--text-primary)]'}
            `}>
                            {tx.isPositive ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export function RevenueFlowCard() {
    return (
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
    );
}
