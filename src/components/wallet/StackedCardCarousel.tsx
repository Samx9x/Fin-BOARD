'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    gradient: string;
}

interface StackedCardCarouselProps {
    cards: PaymentCard[];
    onCardChange?: (cardId: string) => void;
}

export function StackedCardCarousel({ cards, onCardChange }: StackedCardCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextCard = () => {
        const newIndex = (currentIndex + 1) % cards.length;
        setCurrentIndex(newIndex);
        onCardChange?.(cards[newIndex].id);
    };

    const prevCard = () => {
        const newIndex = (currentIndex - 1 + cards.length) % cards.length;
        setCurrentIndex(newIndex);
        onCardChange?.(cards[newIndex].id);
    };

    return (
        <div className="bg-[var(--bg-surface)]/60 rounded-2xl border border-[var(--border-subtle)] p-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-6">Cards</h3>

            {/* Stacked Cards Container */}
            <div className="relative h-48 mb-4">
                {/* Navigation arrows */}
                {cards.length > 1 && (
                    <>
                        <button
                            onClick={prevCard}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--primary)]/20 transition-colors z-20"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={nextCard}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--primary)]/20 transition-colors z-20"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </>
                )}

                {/* Stacked Cards */}
                <div className="relative w-full h-full flex items-center justify-center">
                    {cards.map((card, index) => {
                        const offset = index - currentIndex;
                        const isActive = index === currentIndex;

                        // Don't render cards that are too far away
                        if (Math.abs(offset) > 2) return null;

                        return (
                            <motion.div
                                key={card.id}
                                initial={false}
                                animate={{
                                    x: offset * 15,
                                    scale: isActive ? 1 : 0.9 - Math.abs(offset) * 0.05,
                                    opacity: isActive ? 1 : 0.4 - Math.abs(offset) * 0.15,
                                    zIndex: 10 - Math.abs(offset),
                                }}
                                transition={{ duration: 0.3 }}
                                className="absolute w-full h-full rounded-2xl p-5 shadow-2xl"
                                style={{
                                    background: card.gradient.includes('gradient')
                                        ? card.gradient
                                        : `linear-gradient(135deg, ${card.gradient})`,
                                }}
                            >
                                {/* Card chip */}
                                <div className="w-10 h-8 rounded-md bg-white/20 backdrop-blur-sm mb-6" />

                                {/* Card number */}
                                <div className="text-white text-base font-mono tracking-wider mb-4">
                                    {card.cardNumber}
                                </div>

                                {/* Card holder and expiry */}
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-white/60 text-[10px] mb-0.5">Card Holder</p>
                                        <p className="text-white text-sm font-semibold">{card.holderName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/60 text-[10px] mb-0.5">Expires</p>
                                        <p className="text-white text-sm font-semibold">{card.expiryDate}</p>
                                    </div>
                                </div>

                                {/* Card brand logo */}
                                <div className="absolute top-5 right-5 text-white/80 font-bold text-xs">
                                    {card.type === 'Credit Card' ? '💳 Pay' : '🏦 Bank'}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Pagination dots */}
            {cards.length > 1 && (
                <div className="flex justify-center gap-1.5">
                    {cards.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentIndex(index);
                                onCardChange?.(cards[index].id);
                            }}
                            className={`h-1.5 rounded-full transition-all ${index === currentIndex
                                    ? 'bg-[var(--primary)] w-6'
                                    : 'bg-[var(--border-subtle)] w-1.5'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
