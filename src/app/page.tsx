'use client';

import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopHeader } from '@/components/dashboard/TopHeader';
import { HomeSection } from '@/components/sections/HomeSection';
import { WalletSection } from '@/components/sections/WalletSection';
import { AnalyticsSection } from '@/components/sections/AnalyticsSection';
import { GuideSection } from '@/components/sections/GuideSection';
import { AddWidgetModal } from '@/components/modals/AddWidgetModal';
import { TemplatesModal } from '@/components/modals/TemplatesModal';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from '@/components/ui/Toast';

export default function Dashboard() {
  const {
    theme,
    addWidget
  } = useDashboardStore();

  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  // Initial loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // 4 seconds total to allow for all animations

    return () => clearTimeout(timer);
  }, []);

  // Update html data-theme attribute when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);


  // Render the active section
  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />;
      case 'wallet':
        return <WalletSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'guide':
        return <GuideSection />;
      case 'settings':
        return <SettingsPlaceholder />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <div className="min-h-screen flex bg-[var(--bg-base)]">
        {/* Sidebar */}
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-[120px]">
          {/* Top Header */}
          <TopHeader userName="SHRIANSH" />

          {/* Section Content with proper margins */}
          <div className="flex-1 overflow-auto px-[50px] py-[50px]">
            {renderSection()}
          </div>
        </div>

        {/* Modals */}
        <AddWidgetModal />
        <TemplatesModal />
        <ToastContainer />
      </div>
    </>
  );
}

// Placeholder component for Settings

function SettingsPlaceholder() {
  return (
    <div className="p-6">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Settings</h2>
        <div className="
          p-12 rounded-2xl
          bg-[var(--bg-surface)]/60
          border border-[var(--border-subtle)]
          text-center
        ">
          <p className="text-[var(--text-muted)]">
            Settings feature coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}
