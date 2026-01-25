'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, MousePointer2 } from 'lucide-react';

interface JsonExplorerProps {
    data: any;
    onSelectPath: (path: string, value: any) => void;
    currentPath?: string;
    depth?: number;
}

export function JsonExplorer({ data, onSelectPath, currentPath = '', depth = 0 }: JsonExplorerProps) {
    const [isExpanded, setIsExpanded] = useState(depth < 2);

    if (data === null) return <span className="text-blue-400">null</span>;
    if (typeof data === 'undefined') return <span className="text-gray-500">undefined</span>;

    if (typeof data !== 'object') {
        const displayValue = typeof data === 'string' ? `"${data}"` : String(data);
        const colorClass = typeof data === 'number' ? 'text-amber-400' : typeof data === 'boolean' ? 'text-purple-400' : 'text-emerald-400';

        return (
            <button
                onClick={() => onSelectPath(currentPath, data)}
                className="group inline-flex items-center gap-1 hover:bg-[var(--primary)]/10 px-1 rounded transition-colors"
                title={`Select path: ${currentPath}`}
            >
                <span className={`${colorClass} font-mono text-[11px]`}>{displayValue}</span>
                <MousePointer2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-[var(--primary)]" />
            </button>
        );
    }

    const isArray = Array.isArray(data);
    const keys = Object.keys(data);

    if (keys.length === 0) return <span className="text-gray-500">{isArray ? '[]' : '{}'}</span>;

    return (
        <div className="font-mono text-[11px]">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span>{isArray ? `Array(${data.length})` : 'Object'}</span>
            </button>

            {isExpanded && (
                <div className="ml-4 border-l border-[var(--border-subtle)] pl-2 mt-1 space-y-1">
                    {keys.map((key) => {
                        const path = currentPath ? (isArray ? `${currentPath}[${key}]` : `${currentPath}.${key}`) : key;
                        const value = data[key];

                        return (
                            <div key={key} className="flex flex-wrap items-start gap-1">
                                <span className="text-blue-300 font-semibold">{key}:</span>
                                <JsonExplorer
                                    data={value}
                                    onSelectPath={onSelectPath}
                                    currentPath={path}
                                    depth={depth + 1}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
