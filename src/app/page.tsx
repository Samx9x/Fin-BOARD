'use client';

import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopHeader } from '@/components/dashboard/TopHeader';
import { HomeSection } from '@/components/sections/HomeSection';
import { WalletSection } from '@/components/sections/WalletSection';
import { AnalyticsSection } from '@/components/sections/AnalyticsSection';
import { AddWidgetModal } from '@/components/modals/AddWidgetModal';
import { TemplatesModal, WidgetTemplate, DashboardTemplate } from '@/components/modals/TemplatesModal';
import { ToastContainer } from '@/components/ui/Toast';

export default function Dashboard() {
  const {
    theme,
    isTemplatesModalOpen,
    closeTemplatesModal,
    openAddWidgetModal,
    openTemplatesModal, // Added this
    addWidget
  } = useDashboardStore();

  const [activeSection, setActiveSection] = useState('home');
  const [templateMode, setTemplateMode] = useState<'widget' | 'dashboard'>('widget');

  // Update html data-theme attribute when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle Template Selection
  const handleSelectWidgetTemplate = (template: WidgetTemplate) => {
    addWidget({
      id: '',
      name: template.name,
      apiUrl: template.apiUrl,
      refreshInterval: template.refreshInterval,
      displayMode: template.displayMode,
      selectedFields: template.fields,
      chartConfig: template.chartConfig,
      data: null,
      lastUpdated: null,
      isLoading: false,
      error: null,
    });
    closeTemplatesModal();
  };

  const handleSelectDashboardTemplate = (template: DashboardTemplate) => {
    template.widgets.forEach(w => {
      addWidget({
        id: '',
        name: w.name,
        apiUrl: w.apiUrl,
        refreshInterval: w.refreshInterval,
        displayMode: w.displayMode,
        selectedFields: w.fields,
        chartConfig: w.chartConfig,
        data: null,
        lastUpdated: null,
        isLoading: false,
        error: null,
      });
    });
    closeTemplatesModal();
  };

  // Render the active section
  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />;
      case 'wallet':
        return <WalletSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'alerts':
        return <AlertsPlaceholder />;
      case 'settings':
        return <SettingsPlaceholder />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-base)]">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-[72px]">
        {/* Top Header */}
        <TopHeader userName="SHRIANSH" />

        {/* Section Content */}
        <div className="flex-1 overflow-auto">
          {renderSection()}
        </div>
      </div>

      {/* Modals */}
      <AddWidgetModal />
      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={closeTemplatesModal}
        onSelectWidgetTemplate={handleSelectWidgetTemplate}
        onSelectDashboardTemplate={handleSelectDashboardTemplate}
        mode={templateMode}
      />
      <ToastContainer />
    </div>
  );
}

// Placeholder components for Alerts and Settings
function AlertsPlaceholder() {
  return (
    <div className="p-6">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Alerts</h2>
        <div className="
          p-12 rounded-2xl
          bg-[var(--bg-surface)]/60
          border border-[var(--border-subtle)]
          text-center
        ">
          <p className="text-[var(--text-muted)]">
            Alerts feature coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}

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
