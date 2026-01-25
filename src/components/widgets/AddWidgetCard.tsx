'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';

export function AddWidgetCard() {
    const openAddWidgetModal = useDashboardStore(state => state.openAddWidgetModal);

    return (
        <motion.button
            onClick={openAddWidgetModal}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
        w-full h-full min-h-[200px]
        flex flex-col items-center justify-center gap-4
        rounded-2xl border-2 border-dashed border-[var(--border-default)]
        bg-[var(--bg-surface)]/30 backdrop-blur-sm
        hover:border-[var(--primary)] hover:bg-[var(--primary)]/5
        transition-all duration-300 cursor-pointer
        group
      "
        >
            <motion.div
                className="
          flex items-center justify-center
          w-14 h-14 rounded-xl
          bg-[var(--primary)] text-black
          group-hover:shadow-glow
          transition-shadow duration-300
        "
                whileHover={{ rotate: 90 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <Plus className="w-7 h-7" />
            </motion.div>

            <div className="text-center">
                <p className="font-semibold text-[var(--text-primary)] mb-1">
                    Add Widget
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                    Connect to a finance API and<br />create a custom widget
                </p>
            </div>
        </motion.button>
    );
}
