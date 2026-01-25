'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';

export interface PaymentCard {
    id: string;
    type: 'Credit Card' | 'Debit Card';
    bankName: string;
    cardNumber: string;
    expiryDate: string;
    holderName: string;
    currency: string;
    status: 'Active' | 'Inactive' | 'Blocked';
    balance?: number;
    gradient: string; // Tailwind gradient classes
}

interface CardCarouselProps {
    cards: PaymentCard[];
}

export function CardCarousel({ cards }: CardCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentCard = cards[currentIndex];

    const nextCard = () => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const prevCard = () => {
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    return (
        <div className="bg-[var(--bg-surface)]/60 rounded-2xl border border-[var(--border-subtle)] p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Cards</h3>

            <div className="relative">
                {/* Card Display */}
                <div className="relative h-56 mb-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentCard.id}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                            className={`absolute inset-0 rounded-2xl p-6 ${currentCard.gradient} overflow-hidden`}
                            style={{
                                background: currentCard.gradient.includes('gradient')
                                    ? currentCard.gradient
                                    : `linear-gradient(135deg, ${currentCard.gradient})`,
                            }}
                        >
                            {/* Card chip */}
                            <div className="w-12 h-10 rounded-lg bg-white/20 backdrop-blur-sm mb-8" />

                            {/* Card number */}
                            <div className="text-white text-xl font-mono tracking-wider mb-6">
                                {currentCard.cardNumber}
                            </div>

                            {/* Card holder and expiry */}
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-white/60 text-xs mb-1">Card Holder</p>
                                    <p className="text-white font-semibold">{currentCard.holderName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/60 text-xs mb-1">Expires</p>
                                    <p className="text-white font-semibold">{currentCard.expiryDate}</p>
                                </div>
                            </div>

                            {/* Card brand logo (placeholder) */}
                            <div className="absolute top-6 right-6 text-white/80 font-bold text-sm">
                                {currentCard.type === 'Credit Card' ? '💳 Pay' : '🏦 Bank'}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation arrows */}
                    {cards.length > 1 && (
                        <>
                            <button
                                onClick={prevCard}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--primary)]/20 transition-colors z-10"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextCard}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--primary)]/20 transition-colors z-10"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Card Details Below */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
                    <div>
                        <p className="text-xs text-[var(--text-muted)] mb-1">Type</p>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{currentCard.type}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[var(--text-muted)] mb-1">Bank</p>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{currentCard.bankName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[var(--text-muted)] mb-1">Currency</p>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{currentCard.currency}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[var(--text-muted)] mb-1">Status</p>
                        <span
                            className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${currentCard.status === 'Active'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : currentCard.status === 'Blocked'
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-gray-500/20 text-gray-400'
                                }`}
                        >
                            {currentCard.status}
                        </span>
                    </div>
                </div>

                {/* Card indicator dots */}
                {cards.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        {cards.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                        ? 'bg-[var(--primary)] w-6'
                                        : 'bg-[var(--border-subtle)]'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
