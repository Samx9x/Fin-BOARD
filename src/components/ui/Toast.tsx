'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { Toast as ToastType } from '@/types';

const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const colorMap = {
    success: 'border-l-[var(--success)] bg-[var(--success)]/10',
    error: 'border-l-[var(--error)] bg-[var(--error)]/10',
    warning: 'border-l-[var(--warning)] bg-[var(--warning)]/10',
    info: 'border-l-[var(--info)] bg-[var(--info)]/10',
};

const iconColorMap = {
    success: 'text-[var(--success)]',
    error: 'text-[var(--error)]',
    warning: 'text-[var(--warning)]',
    info: 'text-[var(--info)]',
};

function ToastItem({ toast }: { toast: ToastType }) {
    const removeToast = useDashboardStore(state => state.removeToast);
    const Icon = iconMap[toast.type];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`
        relative flex items-start gap-3 p-4 pr-10
        glass-strong border-l-4 ${colorMap[toast.type]}
        min-w-[300px] max-w-[400px]
      `}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColorMap[toast.type]}`} />

            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[var(--text-primary)]">
                    {toast.title}
                </p>
                {toast.message && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                        {toast.message}
                    </p>
                )}
            </div>

            <button
                onClick={() => removeToast(toast.id)}
                className="
          absolute top-2 right-2 p-1.5 rounded-md
          text-[var(--text-muted)] hover:text-[var(--text-primary)]
          hover:bg-[var(--bg-elevated)] transition-colors
        "
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

export function ToastContainer() {
    const toasts = useDashboardStore(state => state.toasts);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} />
                ))}
            </AnimatePresence>
        </div>
    );
}
