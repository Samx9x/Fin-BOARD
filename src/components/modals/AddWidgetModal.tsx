'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, X, CheckCircle, AlertCircle, Loader2,
    LayoutGrid, Table, LineChart, ArrowLeft, ArrowRight, Bitcoin
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useDashboardStore } from '@/store/dashboardStore';
import { testApiConnection } from '@/services/apiService';
import { Widget, WidgetDisplayMode, SelectedField, ApiField } from '@/types';

type Step = 'config' | 'fields';

const displayModes = [
    { id: 'card' as WidgetDisplayMode, label: 'Card', icon: LayoutGrid, description: 'Display as info cards' },
    { id: 'table' as WidgetDisplayMode, label: 'Table', icon: Table, description: 'Display as data table' },
    { id: 'chart' as WidgetDisplayMode, label: 'Chart', icon: LineChart, description: 'Display as chart' },
];

// Pre-configured API templates
const apiTemplates = [
    {
        id: 'bitcoin',
        name: 'Bitcoin Price',
        icon: '₿',
        apiUrl: 'https://api.coinbase.com/v2/prices/BTC-USD/spot',
        description: 'Using built-in API configuration'
    },
    {
        id: 'ethereum',
        name: 'Ethereum Price',
        icon: 'Ξ',
        apiUrl: 'https://api.coinbase.com/v2/prices/ETH-USD/spot',
        description: 'Using built-in API configuration'
    },
    {
        id: 'custom',
        name: 'Custom API',
        icon: '🔗',
        apiUrl: '',
        description: 'Enter your own API endpoint'
    },
];

export function AddWidgetModal() {
    const { isAddWidgetModalOpen, closeAddWidgetModal, addWidget, editingWidget, updateWidget } = useDashboardStore();

    // Form state
    const [step, setStep] = useState<Step>('config');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [apiUrl, setApiUrl] = useState('');
    const [refreshInterval, setRefreshInterval] = useState(30);
    const [displayMode, setDisplayMode] = useState<WidgetDisplayMode>('card');
    const [selectedFields, setSelectedFields] = useState<SelectedField[]>([]);

    // API test state
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string; fieldCount?: number } | null>(null);
    const [availableFields, setAvailableFields] = useState<ApiField[]>([]);
    const [apiData, setApiData] = useState<unknown>(null);

    // Field search
    const [fieldSearch, setFieldSearch] = useState('');

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isAddWidgetModalOpen) {
            if (editingWidget) {
                setName(editingWidget.name);
                setApiUrl(editingWidget.apiUrl);
                setRefreshInterval(editingWidget.refreshInterval);
                setDisplayMode(editingWidget.displayMode);
                setSelectedFields(editingWidget.selectedFields);
                setStep('config');
                setSelectedTemplate('custom');
            } else {
                setName('');
                setApiUrl('');
                setRefreshInterval(30);
                setDisplayMode('card');
                setSelectedFields([]);
                setStep('config');
                setSelectedTemplate(null);
            }
            setTestResult(null);
            setAvailableFields([]);
            setApiData(null);
            setFieldSearch('');
        }
    }, [isAddWidgetModalOpen, editingWidget]);

    // Auto-test when template selected
    useEffect(() => {
        if (selectedTemplate && selectedTemplate !== 'custom') {
            const template = apiTemplates.find(t => t.id === selectedTemplate);
            if (template) {
                setName(template.name);
                setApiUrl(template.apiUrl);
                handleTestApi(template.apiUrl);
            }
        }
    }, [selectedTemplate]);

    // Filter fields
    const filteredFields = useMemo(() => {
        let fields = availableFields;

        if (fieldSearch) {
            fields = fields.filter(f =>
                f.path.toLowerCase().includes(fieldSearch.toLowerCase())
            );
        }

        // Filter out complex objects but keep primitive values
        return fields.filter(f => f.type !== 'object' && !f.isArray);
    }, [availableFields, fieldSearch]);

    const handleTestApi = async (url?: string) => {
        const testUrl = url || apiUrl;
        if (!testUrl) return;

        setIsTesting(true);
        setTestResult(null);

        const result = await testApiConnection(testUrl);

        setIsTesting(false);
        setTestResult({
            success: result.success,
            message: result.message,
            fieldCount: result.fields?.length || 0
        });

        if (result.success) {
            setAvailableFields(result.fields);
            setApiData(result.data);
        }
    };

    const handleAddField = (field: ApiField) => {
        if (selectedFields.some(f => f.path === field.path)) return;

        // Create a nice label from the path
        const pathParts = field.path.split('.');
        const label = pathParts[pathParts.length - 1]
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();

        setSelectedFields(prev => [...prev, {
            path: field.path,
            label: label,
        }]);
    };

    const handleRemoveField = (path: string) => {
        setSelectedFields(prev => prev.filter(f => f.path !== path));
    };

    const handleUpdateFieldLabel = (path: string, newLabel: string) => {
        setSelectedFields(prev => prev.map(f =>
            f.path === path ? { ...f, label: newLabel } : f
        ));
    };

    const handleSubmit = () => {
        if (!name || !apiUrl || selectedFields.length === 0) return;

        const widgetData: Widget = {
            id: editingWidget?.id || '',
            name,
            apiUrl,
            refreshInterval,
            displayMode,
            selectedFields,
            data: apiData,
            lastUpdated: new Date().toISOString(),
            isLoading: false,
            error: null,
        };

        if (editingWidget) {
            updateWidget(editingWidget.id, widgetData);
        } else {
            addWidget(widgetData);
        }

        closeAddWidgetModal();
    };

    const canProceedToFields = testResult?.success && name.trim() !== '';
    const canSubmit = name && apiUrl && selectedFields.length > 0;

    return (
        <Modal
            isOpen={isAddWidgetModalOpen}
            onClose={closeAddWidgetModal}
            title={editingWidget ? 'Edit Widget' : 'Add New Widget'}
            size="lg"
        >
            <div className="p-6">
                <AnimatePresence mode="wait">
                    {step === 'config' ? (
                        <motion.div
                            key="config"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Template Selection (only for new widgets) */}
                            {!editingWidget && !selectedTemplate && (
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                                        Choose a Template
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {apiTemplates.map((template) => (
                                            <motion.button
                                                key={template.id}
                                                onClick={() => setSelectedTemplate(template.id)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="
                                                    p-4 rounded-xl text-left
                                                    bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                                                    hover:border-[var(--primary)] hover:bg-[var(--bg-elevated)]/80
                                                    transition-all
                                                "
                                            >
                                                <div className="text-2xl mb-2">{template.icon}</div>
                                                <p className="font-medium text-[var(--text-primary)]">{template.name}</p>
                                                <p className="text-xs text-[var(--text-muted)] mt-1">{template.description}</p>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Selected Template Info */}
                            {selectedTemplate && (
                                <>
                                    {selectedTemplate !== 'custom' && (
                                        <div className="
                                            p-4 rounded-xl
                                            bg-[var(--primary)]/10 border border-[var(--primary)]/30
                                        ">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">
                                                    {apiTemplates.find(t => t.id === selectedTemplate)?.icon}
                                                </span>
                                                <div>
                                                    <p className="font-medium text-[var(--primary)]">{name}</p>
                                                    <p className="text-xs text-[var(--primary)]/70">Using built-in API configuration</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Widget Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                            Widget Name <span className="text-[var(--error)]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g., Bitcoin Price Tracker"
                                            className="input"
                                        />
                                    </div>

                                    {/* API URL (only for custom) */}
                                    {selectedTemplate === 'custom' && (
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                                API URL <span className="text-[var(--error)]">*</span>
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={apiUrl}
                                                    onChange={(e) => {
                                                        setApiUrl(e.target.value);
                                                        setTestResult(null);
                                                    }}
                                                    placeholder="https://api.example.com/data"
                                                    className="input flex-1"
                                                />
                                                <motion.button
                                                    onClick={() => handleTestApi()}
                                                    disabled={!apiUrl || isTesting}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="btn btn-secondary min-w-[80px]"
                                                >
                                                    {isTesting ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        'Test'
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    )}

                                    {/* API Test Result */}
                                    <AnimatePresence>
                                        {(testResult || isTesting) && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className={`
                                                    p-4 rounded-xl
                                                    ${isTesting
                                                        ? 'bg-[var(--info)]/10 border border-[var(--info)]/30'
                                                        : testResult?.success
                                                            ? 'bg-[var(--success)]/10 border border-[var(--success)]/30'
                                                            : 'bg-[var(--error)]/10 border border-[var(--error)]/30'
                                                    }
                                                `}
                                            >
                                                {isTesting ? (
                                                    <div className="flex items-center gap-2 text-[var(--info)]">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Testing API connection...</span>
                                                    </div>
                                                ) : testResult?.success ? (
                                                    <div>
                                                        <div className="flex items-center gap-2 text-[var(--success)]">
                                                            <CheckCircle className="w-5 h-5" />
                                                            <span className="font-medium">API connection successful!</span>
                                                        </div>
                                                        <p className="text-sm text-[var(--success)]/70 mt-1 ml-7">
                                                            {testResult.fieldCount} top-level fields found.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-[var(--error)]">
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span>{testResult?.message}</span>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Refresh Interval */}
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                            Refresh Interval (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            value={refreshInterval}
                                            onChange={(e) => setRefreshInterval(Math.max(10, Math.min(300, parseInt(e.target.value) || 30)))}
                                            min={10}
                                            max={300}
                                            className="input w-full"
                                        />
                                        <p className="text-xs text-[var(--text-muted)] mt-1">
                                            How often to refresh data (10-300 seconds)
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-between gap-3 pt-4 border-t border-[var(--border-subtle)]">
                                {selectedTemplate ? (
                                    <motion.button
                                        onClick={() => {
                                            setSelectedTemplate(null);
                                            setName('');
                                            setApiUrl('');
                                            setTestResult(null);
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn btn-secondary flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back
                                    </motion.button>
                                ) : (
                                    <div />
                                )}
                                <div className="flex gap-3">
                                    <button onClick={closeAddWidgetModal} className="btn btn-ghost">
                                        Cancel
                                    </button>
                                    {selectedTemplate && (
                                        <motion.button
                                            onClick={() => setStep('fields')}
                                            disabled={!canProceedToFields}
                                            whileHover={{ scale: canProceedToFields ? 1.02 : 1 }}
                                            whileTap={{ scale: canProceedToFields ? 0.98 : 1 }}
                                            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            Continue
                                            <ArrowRight className="w-4 h-4" />
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="fields"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-5"
                        >
                            {/* Back Button */}
                            <motion.button
                                onClick={() => setStep('config')}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </motion.button>

                            {/* Display Mode */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                                    Display Mode
                                </label>
                                <div className="flex gap-3">
                                    {displayModes.map((mode) => {
                                        const Icon = mode.icon;
                                        const isActive = displayMode === mode.id;
                                        return (
                                            <motion.button
                                                key={mode.id}
                                                onClick={() => setDisplayMode(mode.id)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`
                                                    flex items-center gap-3 px-5 py-3 rounded-xl
                                                    transition-all border-2
                                                    ${isActive
                                                        ? 'bg-[var(--primary)] text-black border-[var(--primary)]'
                                                        : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--primary)]'
                                                    }
                                                `}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium">{mode.label}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Field Search */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Search Fields
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={fieldSearch}
                                        onChange={(e) => setFieldSearch(e.target.value)}
                                        placeholder="Search for fields..."
                                        className="input w-full"
                                    />
                                </div>
                            </div>

                            {/* Available Fields */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Available Fields
                                </label>
                                <div className="max-h-48 overflow-y-auto space-y-2">
                                    {filteredFields.length === 0 ? (
                                        <p className="text-sm text-[var(--text-muted)] py-4 text-center bg-[var(--bg-elevated)] rounded-xl">
                                            No fields found
                                        </p>
                                    ) : (
                                        filteredFields.map((field) => {
                                            const isSelected = selectedFields.some(f => f.path === field.path);
                                            return (
                                                <motion.div
                                                    key={field.path}
                                                    className={`
                                                        flex items-center justify-between p-4 rounded-xl
                                                        bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                                                        ${isSelected ? 'opacity-50' : ''}
                                                    `}
                                                >
                                                    <div>
                                                        <p className="font-medium text-[var(--text-primary)]">
                                                            {field.path}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`
                                                                px-2 py-0.5 rounded text-xs font-medium
                                                                ${field.type === 'string'
                                                                    ? 'bg-blue-500/20 text-blue-400'
                                                                    : field.type === 'number'
                                                                        ? 'bg-green-500/20 text-green-400'
                                                                        : 'bg-gray-500/20 text-gray-400'
                                                                }
                                                            `}>
                                                                {field.type}
                                                            </span>
                                                            <span className="text-xs text-[var(--text-muted)]">
                                                                {String(field.value).substring(0, 30)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <motion.button
                                                        onClick={() => handleAddField(field)}
                                                        disabled={isSelected}
                                                        whileHover={{ scale: isSelected ? 1 : 1.1 }}
                                                        whileTap={{ scale: isSelected ? 1 : 0.95 }}
                                                        className={`
                                                            w-8 h-8 rounded-lg flex items-center justify-center
                                                            ${isSelected
                                                                ? 'bg-[var(--bg-surface)] text-[var(--text-muted)]'
                                                                : 'bg-[var(--primary)] text-black'
                                                            }
                                                        `}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </motion.button>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Selected Fields */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Selected Fields ({selectedFields.length})
                                </label>
                                <div className="space-y-2">
                                    {selectedFields.length === 0 ? (
                                        <p className="text-sm text-[var(--text-muted)] py-4 text-center bg-[var(--bg-elevated)] rounded-xl">
                                            Click + on fields above to add them
                                        </p>
                                    ) : (
                                        selectedFields.map((field) => (
                                            <motion.div
                                                key={field.path}
                                                layout
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="
                                                    flex items-center justify-between p-4 rounded-xl
                                                    bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                                                "
                                            >
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={field.label}
                                                        onChange={(e) => handleUpdateFieldLabel(field.path, e.target.value)}
                                                        className="
                                                            bg-transparent border-none outline-none
                                                            font-medium text-[var(--text-primary)]
                                                            w-full
                                                        "
                                                    />
                                                    <p className="text-xs text-[var(--text-muted)] mt-1">
                                                        {field.path}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveField(field.path)}
                                                    className="p-2 rounded-lg hover:bg-[var(--error)]/20 text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between gap-3 pt-4 border-t border-[var(--border-subtle)]">
                                <motion.button
                                    onClick={() => setStep('config')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn btn-secondary flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </motion.button>
                                <motion.button
                                    onClick={handleSubmit}
                                    disabled={!canSubmit}
                                    whileHover={{ scale: canSubmit ? 1.02 : 1 }}
                                    whileTap={{ scale: canSubmit ? 0.98 : 1 }}
                                    className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editingWidget ? 'Save Changes' : 'Add Widget'}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Modal>
    );
}
