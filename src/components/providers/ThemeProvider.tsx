'use client';

import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useDashboardStore(state => state.theme);

    useEffect(() => {
        const root = window.document.documentElement;
        root.setAttribute('data-theme', theme);

        // Also update the class for standard Tailwind-like dark mode support if needed
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    return <>{children}</>;
}
