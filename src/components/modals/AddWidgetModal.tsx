'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, X, CheckCircle, AlertCircle, Loader2,
    LayoutGrid, Table, LineChart as ChartIcon, ArrowLeft, ArrowRight, Bitcoin,
    RefreshCw, Zap, TrendingUp, Heart
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useDashboardStore } from '@/store/dashboardStore';
import { testApiConnection } from '@/services/apiService';
import { Widget, WidgetDisplayMode, SelectedField, ApiField } from '@/types';
import { JsonExplorer } from '@/components/ui/JsonExplorer';

type Step = 'config' | 'fields';

const displayModes = [
    { id: 'card' as WidgetDisplayMode, label: 'Card', icon: LayoutGrid, description: 'Display as info cards' },
    { id: 'table' as WidgetDisplayMode, label: 'Table', icon: Table, description: 'Display as data table' },
    { id: 'chart' as WidgetDisplayMode, label: 'Chart', icon: ChartIcon, description: 'Display as chart' },
];

const chartSubTypes = [
    { id: 'line', label: 'Line', icon: ChartIcon },
    { id: 'area', label: 'Area', icon: Zap },
    { id: 'candlestick', label: 'Candlestick', icon: TrendingUp },
];

// Pre-configured API templates
const apiTemplates = [
    {
        id: 'av-apple',
        name: 'Apple Stock (AV)',
        icon: '🍎',
        apiUrl: 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=5min',
        description: 'Real-time intraday data for AAPL'
    },
    {
        id: 'av-forex',
        name: 'Forex BTC-USD',
        icon: '💵',
        apiUrl: 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD',
        description: 'Alpha Vantage Forex Rate'
    },
    {
        id: 'finnhub-news',
        name: 'Market News',
        icon: '📰',
        apiUrl: 'https://finnhub.io/api/v1/news?category=general',
        description: 'Top global market news (Finnhub)'
    },
    {
        id: 'bitcoin',
        name: 'Bitcoin (Coinbase)',
        icon: '₿',
        apiUrl: 'https://api.coinbase.com/v2/prices/BTC-USD/spot',
        description: 'Public API (No key required)'
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
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [apiUrl, setApiUrl] = useState('');
    const [refreshInterval, setRefreshInterval] = useState(30);
    const [displayMode, setDisplayMode] = useState<WidgetDisplayMode>('card');
    const [selectedFields, setSelectedFields] = useState<SelectedField[]>([]);
    const [showArraysOnly, setShowArraysOnly] = useState(false);

    // API test state
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string; fieldCount?: number } | null>(null);
    const [availableFields, setAvailableFields] = useState<ApiField[]>([]);
    const [apiData, setApiData] = useState<unknown>(null);

    // Field search
    const [fieldSearch, setFieldSearch] = useState('');

    const [chartType, setChartType] = useState<'line' | 'area' | 'candlestick'>('area');
    const [explorerMode, setExplorerMode] = useState<'fields' | 'json'>('fields');

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isAddWidgetModalOpen) {
            if (editingWidget) {
                setName(editingWidget.name);
                setDescription(editingWidget.description || '');
                setApiUrl(editingWidget.apiUrl);
                setRefreshInterval(editingWidget.refreshInterval);
                setDisplayMode(editingWidget.displayMode);
                setSelectedFields(editingWidget.selectedFields);
                setChartType(editingWidget.chartConfig?.type || 'area');
            } else {
                setName('');
                setDescription('');
                setApiUrl('');
                setRefreshInterval(30);
                setDisplayMode('card');
                setSelectedFields([]);
                setChartType('area');
            }
            setTestResult(null);
            setAvailableFields([]);
            setApiData(null);
            setFieldSearch('');
            setShowArraysOnly(false);
            setExplorerMode('fields');
        }
    }, [isAddWidgetModalOpen, editingWidget]);

    // Apply template
    const applyTemplate = (template: typeof apiTemplates[0]) => {
        setName(template.name);
        setApiUrl(template.apiUrl);
        handleTestApi(template.apiUrl);
    };

    // Filter fields
    const filteredFields = useMemo(() => {
        let fields = availableFields;

        if (fieldSearch) {
            fields = fields.filter(f =>
                f.path.toLowerCase().includes(fieldSearch.toLowerCase())
            );
        }

        if (showArraysOnly) {
            return fields.filter(f => f.isArray);
        }

        // Filter out complex objects but keep primitive values for standard view
        return fields.filter(f => f.type !== 'object');
    }, [availableFields, fieldSearch, showArraysOnly]);

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
        let rawLabel = pathParts[pathParts.length - 1];

        // Remove index markers like [0] from label
        rawLabel = rawLabel.replace(/\[\d+\]/g, '');

        const label = rawLabel
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();

        setSelectedFields(prev => [...prev, {
            path: field.path,
            label: label,
            format: 'text'
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

    const handleUpdateFieldFormat = (path: string, format: SelectedField['format']) => {
        setSelectedFields(prev => prev.map(f =>
            f.path === path ? { ...f, format } : f
        ));
    };

    const handleSubmit = () => {
        if (!name || !apiUrl || selectedFields.length === 0) return;

        const widgetData: Widget = {
            id: editingWidget?.id || '',
            name,
            description,
            apiUrl,
            refreshInterval,
            displayMode,
            selectedFields,
            data: apiData,
            lastUpdated: new Date().toISOString(),
            isLoading: false,
            error: null,
            chartConfig: displayMode === 'chart' ? {
                type: chartType,
                interval: refreshInterval > 3600 ? 'monthly' : refreshInterval > 300 ? 'weekly' : 'daily',
            } : undefined,
        };

        if (editingWidget) {
            updateWidget(editingWidget.id, widgetData);
        } else {
            addWidget(widgetData);
        }

        closeAddWidgetModal();
    };

    const canSubmit = name && apiUrl && selectedFields.length > 0;

    return (
        <Modal
            isOpen={isAddWidgetModalOpen}
            onClose={closeAddWidgetModal}
            title={editingWidget ? 'Edit Widget' : 'Add New Widget'}
            size="lg"
        >
            <div className="p-6 overflow-y-auto max-h-[85vh] space-y-5 custom-scrollbar bg-[var(--bg-surface)]">
                {/* Widget Name */}
                <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">
                        Widget Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Bitcoin"
                        className="input bg-[var(--bg-elevated)] border-[var(--border-default)] text-[var(--text-primary)]"
                    />
                </div>

                {/* Widget Description */}
                <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">
                        Description (Optional)
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what this widget shows..."
                        className="input min-h-[80px] py-3 resize-none bg-[var(--bg-elevated)] border-[var(--border-default)] text-[var(--text-primary)]"
                    />
                </div>

                {/* Saved API Providers Dropdown */}
                <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">
                        Saved API Providers
                    </label>
                    <select
                        onChange={(e) => {
                            const provider = useDashboardStore.getState().apiProviders.find(p => p.id === e.target.value);
                            if (provider) {
                                setName(provider.name);
                                // Leave the URL empty so user can complete it with their specific endpoint
                                setApiUrl(`https://${provider.domain}/`);
                            }
                        }}
                        className="input bg-[var(--bg-elevated)] border-[var(--border-default)] text-[var(--text-primary)]"
                        defaultValue=""
                    >
                        <option value="" disabled className="bg-[var(--bg-surface)]">Select a configured API provider...</option>
                        {useDashboardStore.getState().apiProviders.map(provider => {
                            const hasKey = !!useDashboardStore.getState().apiKeys[provider.domain];
                            return (
                                <option key={provider.id} value={provider.id} className="bg-[var(--bg-surface)]">
                                    {provider.name} {hasKey ? '✓' : '(⚠ No Key)'} - {provider.domain}
                                </option>
                            );
                        })}
                    </select>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                        Select a provider or enter a custom URL below. ✓ indicates a saved API key.
                    </p>
                </div>

                {/* API URL */}
                <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">
                        API URL
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={apiUrl}
                            onChange={(e) => {
                                setApiUrl(e.target.value);
                                setTestResult(null);
                            }}
                            placeholder="https://api.coinbase.com/v2/prices/BTC-USD/spot"
                            className="input flex-1 bg-[var(--bg-elevated)] border-[var(--border-default)] text-[var(--text-primary)]"
                        />
                        <button
                            onClick={() => handleTestApi()}
                            disabled={!apiUrl || isTesting}
                            className="btn btn-primary flex items-center gap-2 px-4 shadow-none min-w-[100px]"
                        >
                            {isTesting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                            Test
                        </button>
                    </div>
                </div>

                {/* API Test Result */}
                {testResult && (
                    <div
                        className={`
                            px-4 py-2.5 rounded-lg text-sm flex items-center gap-2
                            ${testResult.success
                                ? 'bg-[var(--success-subtle)] text-[var(--success)] border border-[var(--success-border)]'
                                : 'bg-[var(--error-subtle)] text-[var(--error)] border border-[var(--error-border)]'
                            }
                        `}
                    >
                        {testResult.success ? (
                            <CheckCircle className="w-4 h-4 shrink-0" />
                        ) : (
                            <AlertCircle className="w-4 h-4 shrink-0" />
                        )}
                        <span>{testResult.message}</span>
                    </div>
                )}

                {/* Refresh Interval */}
                <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">
                        Refresh Interval (seconds)
                    </label>
                    <input
                        type="number"
                        value={refreshInterval}
                        onChange={(e) => setRefreshInterval(parseInt(e.target.value) || 30)}
                        className="input bg-[var(--bg-elevated)] border-[var(--border-default)] text-[var(--text-primary)]"
                    />
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)]">
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">Select Fields to Display</h4>

                    {/* Display Mode */}
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                            Display Mode
                        </label>
                        <div className="flex gap-2">
                            {displayModes.map((mode) => {
                                const Icon = mode.icon;
                                const isActive = displayMode === mode.id;
                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => setDisplayMode(mode.id)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all
                                            ${isActive
                                                ? 'bg-[var(--primary)] text-black font-semibold'
                                                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]'
                                            }
                                        `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {mode.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Chart Sub-types */}
                    {displayMode === 'chart' && (
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                                Chart Type
                            </label>
                            <div className="flex gap-2">
                                {chartSubTypes.map((type) => {
                                    const Icon = type.icon;
                                    const isActive = chartType === type.id;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => setChartType(type.id as any)}
                                            className={`
                                                flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all
                                                ${isActive
                                                    ? 'bg-[var(--primary)] text-black font-semibold'
                                                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]'
                                                }
                                            `}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {type.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Data Explorer Tabs */}
                    <div className="flex gap-4 border-b border-[var(--border-subtle)] mb-4">
                        <button
                            onClick={() => setExplorerMode('fields')}
                            className={`pb-2 text-sm font-medium transition-colors relative ${explorerMode === 'fields' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                        >
                            Fields List
                            {explorerMode === 'fields' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />}
                        </button>
                        <button
                            onClick={() => setExplorerMode('json')}
                            className={`pb-2 text-sm font-medium transition-colors relative ${explorerMode === 'json' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                        >
                            Raw Response
                            {explorerMode === 'json' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />}
                        </button>
                    </div>

                    {explorerMode === 'fields' ? (
                        <>
                            {/* Field Search */}
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                                    Search Fields
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                    <input
                                        type="text"
                                        value={fieldSearch}
                                        onChange={(e) => setFieldSearch(e.target.value)}
                                        placeholder="Search for fields..."
                                        className="input pl-9 bg-[var(--bg-elevated)] border-[var(--border-default)] text-[var(--text-primary)]"
                                    />
                                </div>
                            </div>

                            {/* Array Filter Checkbox */}
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="checkbox"
                                    id="showArraysOnly"
                                    checked={showArraysOnly}
                                    onChange={(e) => setShowArraysOnly(e.target.checked)}
                                    className="w-4 h-4 rounded border-[var(--border-default)] accent-[var(--primary)]"
                                />
                                <label htmlFor="showArraysOnly" className="text-sm text-[var(--text-secondary)] font-medium">
                                    Show arrays only (for table view)
                                </label>
                            </div>

                            {/* Available Fields */}
                            <div className="mb-6">
                                <p className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                                    Available Fields
                                </p>
                                <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl divide-y divide-[var(--border-subtle)] max-h-56 overflow-y-auto custom-scrollbar">
                                    {filteredFields.length === 0 ? (
                                        <div className="p-8 text-center text-[var(--text-muted)] text-sm italic">
                                            {availableFields.length === 0 ? 'Test API to see available fields' : 'No fields match search'}
                                        </div>
                                    ) : (
                                        filteredFields.map((field) => {
                                            const isSelected = selectedFields.some(f => f.path === field.path);
                                            return (
                                                <div key={field.path} className="flex items-center justify-between p-3 hover:bg-[var(--bg-surface)]/40 transition-colors">
                                                    <div className="min-w-0 flex-1 pr-4">
                                                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{field.path}</p>
                                                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5 truncate uppercase">
                                                            {field.type} | {String(field.value).substring(0, 50)}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddField(field)}
                                                        disabled={isSelected}
                                                        className={`
                                                            w-6 h-6 rounded flex items-center justify-center transition-all
                                                            ${isSelected ? 'text-[var(--text-muted)] cursor-not-allowed' : 'text-[var(--primary)] hover:bg-[var(--primary)] hover:text-black'}
                                                        `}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                                    Interactive JSON Explorer
                                </p>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(JSON.stringify(apiData, null, 2));
                                    }}
                                    className="text-[10px] text-[var(--primary)] hover:underline"
                                >
                                    Copy JSON
                                </button>
                            </div>
                            <div className="bg-[#0e1525] border border-[var(--border-subtle)] rounded-xl p-4 max-h-80 overflow-auto custom-scrollbar">
                                {apiData ? (
                                    <JsonExplorer
                                        data={apiData}
                                        onSelectPath={(path, value) => {
                                            handleAddField({
                                                path,
                                                value,
                                                type: typeof value,
                                                isArray: Array.isArray(value)
                                            });
                                        }}
                                    />
                                ) : (
                                    <p className="text-xs text-[var(--text-muted)] italic">No data loaded. Test API to see response.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Selected Fields */}
                    <div>
                        <p className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                            Selected Fields
                        </p>
                        <div className="space-y-2">
                            {selectedFields.length === 0 ? (
                                <div className="p-4 border border-dashed border-[var(--border-default)] rounded-xl text-center text-xs text-[var(--text-muted)] font-medium">
                                    No fields selected yet
                                </div>
                            ) : (
                                <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl overflow-hidden divide-y divide-[var(--border-subtle)]">
                                    {selectedFields.map((field) => (
                                        <div key={field.path} className="p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] text-[var(--text-muted)] font-mono">{field.path}</span>
                                                <button
                                                    onClick={() => handleRemoveField(field.path)}
                                                    className="text-[var(--text-muted)] hover:text-[var(--error)]"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    value={field.label}
                                                    onChange={(e) => handleUpdateFieldLabel(field.path, e.target.value)}
                                                    placeholder="Label"
                                                    className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] focus:border-[var(--primary)] outline-none"
                                                />
                                                <select
                                                    value={field.format}
                                                    onChange={(e) => handleUpdateFieldFormat(field.path, e.target.value as SelectedField['format'])}
                                                    className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] focus:border-[var(--primary)] outline-none"
                                                >
                                                    <option value="text">Standard Text</option>
                                                    <option value="number">Number</option>
                                                    <option value="currency">Currency ($)</option>
                                                    <option value="percentage">Percentage (%)</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-8 flex justify-end gap-3 pb-2 transition-all">
                    <button onClick={closeAddWidgetModal} className="btn btn-ghost text-sm font-medium">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className={`btn btn-primary px-10 shadow-lg text-sm font-bold ${!canSubmit ? 'opacity-50 cursor-not-allowed transform-none' : 'shadow-[var(--primary)]/10'}`}
                    >
                        {editingWidget ? 'Save Changes' : 'Add Widget'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
