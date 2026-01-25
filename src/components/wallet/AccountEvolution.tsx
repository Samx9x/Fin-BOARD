'use client';

import { useState } from 'react';
import { ChevronDown, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Account {
    id: string;
    name: string;
    bankName: string;
    accountNumber: string;
    interbank: string;
    accountType: string;
    balance: number;
}

interface AccountEvolutionProps {
    accounts: Account[];
    selectedAccountId?: string;
    onAccountChange?: (accountId: string) => void;
}

export function AccountEvolution({ accounts, selectedAccountId, onAccountChange }: AccountEvolutionProps) {
    const [selectedAccount, setSelectedAccount] = useState(selectedAccountId || accounts[0]?.id);
    const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

    const account = accounts.find((a) => a.id === selectedAccount) || accounts[0];

    // Sample data for the graph (in a real app, this would come from an API)
    const generateDataPoints = () => {
        const days = timeRange === 'month' ? 31 : timeRange === 'quarter' ? 90 : 365;
        const points = [];
        const now = new Date();

        for (let i = 0; i <= days; i += Math.floor(days / 16)) {
            const date = new Date(now);
            date.setDate(date.getDate() - (days - i));

            const balanceBase = 80000 + Math.random() * 50000;
            const ingressBase = 60000 + Math.random() * 40000;
            const egressBase = 40000 + Math.random() * 30000;

            points.push({
                day: i === 0 ? '01' : String(Math.floor(i)).padStart(2, '0'),
                balance: balanceBase,
                ingress: ingressBase,
                egress: egressBase,
            });
        }
        return points;
    };

    const dataPoints = generateDataPoints();
    const maxValue = Math.max(...dataPoints.flatMap((d) => [d.balance, d.ingress, d.egress]));
    const minValue = Math.min(...dataPoints.flatMap((d) => [d.balance, d.ingress, d.egress]));

    const normalizeY = (value: number) => {
        return 250 - ((value - minValue) / (maxValue - minValue)) * 200;
    };

    const createPath = (data: number[]) => {
        return data
            .map((value, index) => {
                const x = (index / (data.length - 1)) * 850;
                const y = normalizeY(value);
                return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
            })
            .join(' ');
    };

    const handleAccountChange = (accountId: string) => {
        setSelectedAccount(accountId);
        onAccountChange?.(accountId);
    };

    return (
        <div className="bg-[var(--bg-surface)]/60 rounded-2xl border border-[var(--border-subtle)] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Accounts</h3>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)] hover:border-[var(--primary)]/30 transition-colors flex items-center gap-2">
                        Last month
                        <ChevronDown className="w-3 h-3" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left: Account Details */}
                <div className="col-span-4 space-y-4">
                    {/* Account Selector */}
                    <div className="relative">
                        <select
                            value={selectedAccount}
                            onChange={(e) => handleAccountChange(e.target.value)}
                            className="w-full px-4 py-3 bg-[var(--primary)]/20 border border-[var(--primary)]/30 rounded-xl text-sm font-semibold text-[var(--primary)] cursor-pointer appearance-none pr-10"
                        >
                            {accounts.map((acc) => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--primary)] pointer-events-none" />
                    </div>

                    {account && (
                        <div className="space-y-3">
                            <div className="p-3 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)]">
                                <p className="text-xs text-[var(--text-muted)] mb-1">Bank brand name</p>
                                <p className="text-sm font-semibold text-[var(--text-primary)]">{account.bankName}</p>
                            </div>

                            <div className="p-3 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)]">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-xs text-[var(--text-muted)] mb-1">Account number</p>
                                        <p className="text-sm font-mono text-[var(--text-primary)]">
                                            •••• •••• {account.accountNumber.slice(-4)}
                                        </p>
                                    </div>
                                    <button className="p-2 hover:bg-[var(--bg-surface)] rounded-lg transition-colors">
                                        <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-3 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)]">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-xs text-[var(--text-muted)] mb-1">Account interbank CLABE</p>
                                        <p className="text-sm font-mono text-[var(--text-primary)]">
                                            •••• •••• ••••• {account.interbank.slice(-4)}
                                        </p>
                                    </div>
                                    <button className="p-2 hover:bg-[var(--bg-surface)] rounded-lg transition-colors">
                                        <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-3 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)]">
                                <p className="text-xs text-[var(--text-muted)] mb-1">Account type</p>
                                <p className="text-sm font-semibold text-[var(--text-primary)]">{account.accountType}</p>
                            </div>

                            <div className="p-3 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)]">
                                <p className="text-xs text-[var(--text-muted)] mb-1">Account total balance</p>
                                <p className="text-lg font-bold text-[var(--primary)]">
                                    $ {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                            </div>

                            <div className="p-3 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)]">
                                <p className="text-xs text-[var(--text-muted)] mb-1">Account last update date</p>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    {new Date().toLocaleDateString('en-US', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Evolution Graph */}
                <div className="col-span-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[var(--text-primary)]">Account evolution</h4>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-xs text-[var(--text-secondary)]">Balance</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                                <span className="text-xs text-[var(--text-secondary)]">Ingress</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-pink-500" />
                                <span className="text-xs text-[var(--text-secondary)]">Egress</span>
                            </div>
                        </div>
                    </div>

                    {/* Graph */}
                    <div className="bg-[var(--bg-elevated)] rounded-xl p-4 border border-[var(--border-subtle)]">
                        <svg width="100%" height="300" viewBox="0 0 900 300" preserveAspectRatio="xMidYMid meet">
                            <defs>
                                {/* Gradients for fills */}
                                <linearGradient id="balanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="ingressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="egressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="rgb(236, 72, 153)" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Area fills */}
                            <path
                                d={`${createPath(dataPoints.map((d) => d.balance))} L 850,250 L 0,250 Z`}
                                fill="url(#balanceGradient)"
                            />
                            <path
                                d={`${createPath(dataPoints.map((d) => d.ingress))} L 850,250 L 0,250 Z`}
                                fill="url(#ingressGradient)"
                            />
                            <path
                                d={`${createPath(dataPoints.map((d) => d.egress))} L 850,250 L 0,250 Z`}
                                fill="url(#egressGradient)"
                            />

                            {/* Lines */}
                            <path
                                d={createPath(dataPoints.map((d) => d.balance))}
                                fill="none"
                                stroke="rgb(16, 185, 129)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            <path
                                d={createPath(dataPoints.map((d) => d.ingress))}
                                fill="none"
                                stroke="rgb(6, 182, 212)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            <path
                                d={createPath(dataPoints.map((d) => d.egress))}
                                fill="none"
                                stroke="rgb(236, 72, 153)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />

                            {/* X-axis labels */}
                            {dataPoints.map((point, index) => index % 4 === 0 && (
                                <text
                                    key={index}
                                    x={(index / (dataPoints.length - 1)) * 850}
                                    y="280"
                                    fill="var(--text-muted)"
                                    fontSize="12"
                                    textAnchor="middle"
                                >
                                    {point.day}
                                </text>
                            ))}

                            {/* Month label */}
                            <text
                                x="425"
                                y="298"
                                fill="var(--text-muted)"
                                fontSize="12"
                                textAnchor="middle"
                                fontWeight="600"
                            >
                                July 2025
                            </text>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
