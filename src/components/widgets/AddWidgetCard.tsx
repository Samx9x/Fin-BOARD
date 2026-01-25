'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';

export function AddWidgetCard() {
    const openAddWidgetModal = useDashboardStore(state => state.openAddWidgetModal);

    return (
        <motion.button
            onClick={openAddWidgetModal}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="
        w-full h-full
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
          w-10 h-10 rounded-xl
          bg-[var(--primary)] text-black
          group-hover:shadow-glow
          transition-shadow duration-300
        "
                whileHover={{ rotate: 90 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <Plus className="w-5 h-5" />
            </motion.div>

            <div className="text-center">
                <p className="font-semibold text-[var(--text-primary)]">
                    Add Widget
                </p>
            </div>
        </motion.button>
    );
}
