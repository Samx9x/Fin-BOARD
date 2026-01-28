'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User, Save, Edit2, Shield, Key, CheckCircle2,
    Trash2, Plus, X, ExternalLink, Globe
} from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { ApiProvider } from '@/types';

export function SettingsSection() {
    const {
        userName,
        setUserName,
        apiKeys,
        apiProviders,
        setApiKey,
        addApiProvider,
        removeApiProvider,
        addToast
    } = useDashboardStore();

    const [tempUserName, setTempUserName] = useState(userName);
    const [editingKeys, setEditingKeys] = useState<Record<string, string>>({});
    const [isAddingProvider, setIsAddingProvider] = useState(false);
    const [newProvider, setNewProvider] = useState<Partial<ApiProvider>>({
        name: '',
        domain: '',
        rateLimit: { callsPerMinute: 60, delay: 1000 },
        keyParamName: 'apikey'
    });

    useEffect(() => {
        setTempUserName(userName);
    }, [userName]);

    const handleSaveUserName = () => {
        if (!tempUserName.trim()) {
            addToast({
                type: 'error',
                title: 'Invalid Name',
                message: 'Username cannot be empty.'
            });
            return;
        }
        setUserName(tempUserName.trim());
        addToast({
            type: 'success',
            title: 'Profile Updated',
            message: `Your name has been updated to ${tempUserName.trim()}.`
        });
    };

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
        <div className="max-w-[1000px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div>
                <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Settings</h2>
                <p className="text-[var(--text-muted)] mt-1">Manage your profile and external API integrations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile & Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* User Profile section */}
                    <section className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-[var(--primary)]" />
                            </div>
                            <h3 className="font-bold text-[var(--text-primary)]">User Profile</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">
                                    Display Name
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={tempUserName}
                                        onChange={(e) => setTempUserName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="input w-full pr-10 focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                                    />
                                    <Edit2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] opacity-50 group-focus-within:text-[var(--primary)] transition-colors" />
                                </div>
                            </div>

                            <button
                                onClick={handleSaveUserName}
                                disabled={tempUserName === userName || !tempUserName.trim()}
                                className="btn btn-primary w-full py-3 shadow-lg shadow-[var(--primary)]/10 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Profile
                            </button>
                        </div>
                    </section>

                    {/* Security Info */}
                    <section className="bg-[var(--primary)]/5 border border-[var(--primary)]/10 rounded-2xl p-6">
                        <div className="flex gap-4">
                            <Shield className="w-6 h-6 text-[var(--primary)] shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-[var(--text-primary)]">Zero-Knowledge Storage</h4>
                                <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                                    Your API keys and profile data are stored locally in your browser. We never transmit or store them on our servers.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Quick Guide */}
                    <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Globe className="w-4 h-4 text-[var(--primary)]" />
                            <h4 className="text-sm font-bold text-[var(--text-primary)]">Privacy Controls</h4>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-xs text-[var(--text-secondary)]">
                                <div className="w-1 h-1 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />
                                <span>Export your configuration to back up your settings.</span>
                            </li>
                            <li className="flex gap-3 text-xs text-[var(--text-secondary)]">
                                <div className="w-1 h-1 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />
                                <span>Clear your board to permanently erase all local data.</span>
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Right Column: API Keys */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <Key className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--text-primary)]">API Management</h3>
                                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Configure authentication for premium data providers.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsAddingProvider(true)}
                                className="btn btn-ghost text-xs border border-[var(--border-subtle)] px-4 py-2"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                Add Custom
                            </button>
                        </div>

                        {/* Add Provider Inline */}
                        {isAddingProvider && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 p-6 border-2 border-[var(--primary)]/20 bg-[var(--bg-surface)] rounded-2xl space-y-4"
                            >
                                <div className="flex justify-between items-center">
                                    <h5 className="font-bold text-sm">New Data Provider</h5>
                                    <button onClick={() => setIsAddingProvider(false)} className="text-[var(--text-muted)] hover:text-white">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Name (e.g. Polygon)"
                                        className="input"
                                        value={newProvider.name}
                                        onChange={e => setNewProvider({ ...newProvider, name: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="API Domain (api.polygon.io)"
                                        className="input"
                                        value={newProvider.domain}
                                        onChange={e => setNewProvider({ ...newProvider, domain: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button onClick={() => setIsAddingProvider(false)} className="btn btn-ghost px-6">Cancel</button>
                                    <button onClick={handleAddProvider} className="btn btn-primary px-8 shadow-lg shadow-[var(--primary)]/20">Add Provider</button>
                                </div>
                            </motion.div>
                        )}

                        {/* Provider Grid */}
                        <div className="grid gap-4">
                            {apiProviders.map((provider) => {
                                const isStored = !!apiKeys[provider.domain];
                                const currentValue = editingKeys[provider.domain] !== undefined
                                    ? editingKeys[provider.domain]
                                    : (apiKeys[provider.domain] || '');
                                const isFree = provider.isFreeApi;

                                return (
                                    <div
                                        key={provider.id}
                                        className="p-5 border border-[var(--border-subtle)] rounded-2xl bg-[var(--bg-surface)]/40 hover:bg-[var(--bg-surface)]/60 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-5">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center border border-[var(--border-subtle)] overflow-hidden">
                                                    <span className="text-xl font-bold opacity-20">{provider.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h5 className="font-bold text-sm">{provider.name}</h5>
                                                        {isFree && <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded tracking-widest">FREE</span>}
                                                    </div>
                                                    <p className="text-xs text-[var(--text-muted)] mt-1">{provider.domain}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {provider.getKeyUrl && !isFree && (
                                                    <a href={provider.getKeyUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[var(--primary)] hover:underline flex items-center gap-1">
                                                        Get Key <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                                {provider.id.startsWith('custom-') && (
                                                    <button
                                                        onClick={() => confirm('Remove provider?') && removeApiProvider(provider.id)}
                                                        className="p-1.5 hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {!isFree ? (
                                            <div className="flex gap-3">
                                                <div className="relative flex-1 group">
                                                    <input
                                                        type="password"
                                                        value={currentValue}
                                                        onChange={(e) => setEditingKeys({ ...editingKeys, [provider.domain]: e.target.value })}
                                                        placeholder="Enter API Key"
                                                        className="input w-full pr-10 focus:ring-1"
                                                    />
                                                    {isStored && !editingKeys[provider.domain] && (
                                                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleSaveKey(provider.domain)}
                                                    className="btn btn-primary px-5 shrink-0"
                                                    disabled={currentValue === (apiKeys[provider.domain] || '')}
                                                >
                                                    <Save className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleClearKey(provider.domain)}
                                                    className="btn btn-ghost px-4 text-red-400 hover:bg-red-500/10 shrink-0"
                                                    disabled={!isStored}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-400">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Public access - No key required
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
