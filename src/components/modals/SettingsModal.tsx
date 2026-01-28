'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X, Key, Shield, Info, ExternalLink,
    Save, Trash2, CheckCircle2, Globe, Plus, Edit2
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useDashboardStore } from '@/store/dashboardStore';
import { ApiProvider } from '@/types';

export function SettingsModal() {
    const {
        isSettingsModalOpen,
        closeSettingsModal,
        apiKeys,
        apiProviders,
        setApiKey,
        addApiProvider,
        updateApiProvider,
        removeApiProvider,
        addToast
    } = useDashboardStore();

    const [editingKeys, setEditingKeys] = useState<Record<string, string>>({});
    const [isAddingProvider, setIsAddingProvider] = useState(false);
    const [newProvider, setNewProvider] = useState<Partial<ApiProvider>>({
        name: '',
        domain: '',
        rateLimit: { callsPerMinute: 60, delay: 1000 },
        keyParamName: 'apikey'
    });

    const handleSaveKey = (domain: string) => {
        const value = editingKeys[domain];
        if (value !== undefined) {
            setApiKey(domain, value);
            addToast({
                type: 'success',
                title: 'Key Saved',
                message: `API Key for ${domain} has been updated.`
            });
        }
    };

    const handleClearKey = (domain: string) => {
        setApiKey(domain, '');
        setEditingKeys({ ...editingKeys, [domain]: '' });
        addToast({
            type: 'info',
            title: 'Key Removed',
            message: `API Key for ${domain} has been cleared.`
        });
    };

    const handleAddProvider = () => {
        if (!newProvider.name || !newProvider.domain) {
            addToast({
                type: 'error',
                title: 'Invalid Provider',
                message: 'Please fill in all required fields'
            });
            return;
        }

        const provider: ApiProvider = {
            id: `custom-${Date.now()}`,
            name: newProvider.name!,
            domain: newProvider.domain!.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, ''),
            rateLimit: newProvider.rateLimit || { callsPerMinute: 60, delay: 1000 },
            keyParamName: newProvider.keyParamName || 'apikey'
        };

        addApiProvider(provider);
        setIsAddingProvider(false);
        setNewProvider({
            name: '',
            domain: '',
            rateLimit: { callsPerMinute: 60, delay: 1000 },
            keyParamName: 'apikey'
        });

        addToast({
            type: 'success',
            title: 'Provider Added',
            message: `${provider.name} has been added to your providers`
        });
    };

    return (
        <Modal
            isOpen={isSettingsModalOpen}
            onClose={closeSettingsModal}
            title="API Keys & Security Settings"
            size="lg"
        >
            <div className="p-6 overflow-y-auto max-h-[80vh] custom-scrollbar space-y-8">
                {/* Header Info */}
                <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-xl p-4 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">Secure Local Storage</h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                            Your API keys are stored locally in your browser. They are never sent to our servers.
                        </p>
                    </div>
                </div>

                {/* API Provider List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                        <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-[var(--primary)]" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                                API Providers
                            </h3>
                        </div>
                        <button
                            onClick={() => setIsAddingProvider(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 rounded-lg text-xs text-[var(--primary)] font-medium transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Custom API
                        </button>
                    </div>

                    {/* Add Provider Form */}
                    {isAddingProvider && (
                        <div className="bg-[var(--bg-elevated)] border-2 border-[var(--primary)]/30 rounded-xl p-4 space-y-3">
                            <div className="flex justify-between items-center mb-2">
                                <h5 className="font-bold text-sm text-[var(--text-primary)]">Add Custom API Provider</h5>
                                <button onClick={() => setIsAddingProvider(false)}>
                                    <X className="w-4 h-4 text-[var(--text-muted)]" />
                                </button>
                            </div>

                            <div className="grid gap-3">
                                <div>
                                    <label className="text-xs text-[var(--text-muted)] mb-1 block">Provider Name</label>
                                    <input
                                        type="text"
                                        value={newProvider.name}
                                        onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                                        placeholder="e.g., CoinGecko"
                                        className="input text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-[var(--text-muted)] mb-1 block">Domain</label>
                                    <input
                                        type="text"
                                        value={newProvider.domain}
                                        onChange={(e) => setNewProvider({ ...newProvider, domain: e.target.value })}
                                        placeholder="e.g., api.coingecko.com"
                                        className="input text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-[var(--text-muted)] mb-1 block">Calls/Min</label>
                                        <input
                                            type="number"
                                            value={newProvider.rateLimit?.callsPerMinute}
                                            onChange={(e) => setNewProvider({
                                                ...newProvider,
                                                rateLimit: {
                                                    ...newProvider.rateLimit!,
                                                    callsPerMinute: parseInt(e.target.value)
                                                }
                                            })}
                                            className="input text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-[var(--text-muted)] mb-1 block">Key Param</label>
                                        <input
                                            type="text"
                                            value={newProvider.keyParamName}
                                            onChange={(e) => setNewProvider({ ...newProvider, keyParamName: e.target.value })}
                                            placeholder="apikey"
                                            className="input text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleAddProvider}
                                className="w-full btn btn-primary py-2 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Provider
                            </button>
                        </div>
                    )}

                    {/* Provider Cards */}
                    <div className="grid gap-4">
                        {apiProviders.map((provider) => {
                            const isStored = !!apiKeys[provider.domain];
                            const currentValue = editingKeys[provider.domain] !== undefined
                                ? editingKeys[provider.domain]
                                : (apiKeys[provider.domain] || '');
                            const isCustom = provider.id.startsWith('custom-');
                            const isFree = provider.isFreeApi;

                            return (
                                <div
                                    key={provider.id}
                                    className={`bg-[var(--bg-elevated)] border rounded-xl p-4 transition-all hover:border-[var(--primary)]/30 ${isFree ? 'border-[var(--success)]/30' : 'border-[var(--border-subtle)]'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-bold text-[var(--text-primary)]">{provider.name}</h5>
                                                {isFree && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--success)]/20 text-[var(--success)] font-bold">
                                                        FREE
                                                    </span>
                                                )}
                                                {isCustom && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">
                                                        Custom
                                                    </span>
                                                )}
                                                {provider.authMethod === 'header' && !isFree && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-medium">
                                                        Header Auth
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-[var(--text-muted)] mt-1">{provider.domain}</p>
                                            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                                                {provider.rateLimit.callsPerMinute} calls/min
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {provider.getKeyUrl && !isFree && (
                                                <a
                                                    href={provider.getKeyUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] flex items-center gap-1 text-[var(--primary)] hover:underline"
                                                >
                                                    Get Key <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                            {isCustom && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Remove ${provider.name}?`)) {
                                                            removeApiProvider(provider.id);
                                                        }
                                                    }}
                                                    className="text-[var(--error)] hover:bg-[var(--error-subtle)] p-1 rounded"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {isFree ? (
                                        <div className="bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-lg px-4 py-3 text-sm text-[var(--success)] flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                            <span>No API key required - Public endpoints available</span>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    type="password"
                                                    value={currentValue}
                                                    onChange={(e) => setEditingKeys({ ...editingKeys, [provider.domain]: e.target.value })}
                                                    placeholder={`Enter your ${provider.name} API key`}
                                                    className="input w-full pr-10"
                                                />
                                                {isStored && !editingKeys[provider.domain] && (
                                                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--success)]" />
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleSaveKey(provider.domain)}
                                                className="btn btn-primary px-4 shadow-none shrink-0"
                                                disabled={currentValue === (apiKeys[provider.domain] || '')}
                                            >
                                                <Save className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleClearKey(provider.domain)}
                                                className="btn btn-ghost px-4 text-[var(--error)] hover:bg-[var(--error-subtle)] shrink-0"
                                                disabled={!isStored}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>

                {/* Info Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2">
                        <Globe className="w-4 h-4 text-[var(--primary)]" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                            How It Works
                        </h3>
                    </div>
                    <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-4">
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-xs text-[var(--text-secondary)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />
                                <span><strong>Automatic Injection</strong>: Saved keys are automatically added to requests for that domain</span>
                            </li>
                            <li className="flex gap-3 text-xs text-[var(--text-secondary)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />
                                <span><strong>Smart Queueing</strong>: Requests are spaced based on each provider's rate limit</span>
                            </li>
                            <li className="flex gap-3 text-xs text-[var(--text-secondary)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />
                                <span><strong>Dropdown Selection</strong>: Configured providers appear in the widget creation modal</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-[var(--border-subtle)] flex justify-end">
                <button onClick={closeSettingsModal} className="btn btn-primary px-8">
                    Done
                </button>
            </div>
        </Modal>
    );
}
