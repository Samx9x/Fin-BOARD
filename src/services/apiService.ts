import { ApiField, ApiTestResult } from '@/types';

// Persistent cache helper
const CACHE_STORAGE_KEY = 'finboard_api_cache';

function loadCache() {
    if (typeof window === 'undefined') return {};
    try {
        const saved = sessionStorage.getItem(CACHE_STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load cache:', e);
    }
    return {};
}

function saveCache(data: Record<string, any>) {
    if (typeof window === 'undefined') return;
    try {
        sessionStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save cache:', e);
    }
}

// In-memory cache synced with storage
let cache: Record<string, { data: unknown; timestamp: number }> = loadCache();
const CACHE_TTL = 300000; // 5 minutes

function getCacheKey(url: string): string {
    return url.toLowerCase().trim();
}

function isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < CACHE_TTL;
}

// Rate limiting per domain
const DOMAIN_LIMITS: Record<string, { delay: number; maxPerMin: number }> = {
    'alphavantage.co': { delay: 12100, maxPerMin: 5 }, // 5 calls per minute -> 12s gap
    'finnhub.io': { delay: 1000, maxPerMin: 60 },
    'indianapi.in': { delay: 2000, maxPerMin: 30 },
};

const domainQueues: Record<string, { queue: Array<() => Promise<void>>; processing: boolean; lastRequest: number }> = {};

async function processDomainQueue(domain: string) {
    const dq = domainQueues[domain];
    if (!dq || dq.processing || dq.queue.length === 0) return;

    dq.processing = true;
    while (dq.queue.length > 0) {
        const next = dq.queue.shift();
        if (next) {
            const limit = DOMAIN_LIMITS[domain] || { delay: 100 };
            const timeSinceLast = Date.now() - dq.lastRequest;
            const waitTime = Math.max(0, limit.delay - timeSinceLast);

            if (waitTime > 0) {
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }

            await next();
            dq.lastRequest = Date.now();
        }
    }
    dq.processing = false;
}

function getDomain(url: string): string {
    try {
        const hostname = new URL(url).hostname;
        return hostname.replace('www.', '').toLowerCase();
    } catch {
        return 'unknown';
    }
}

// Inject API key into URL
function injectKey(url: string, domain: string): string {
    if (typeof window === 'undefined') return url;
    try {
        const storage = localStorage.getItem('finboard-storage');
        if (storage) {
            const state = JSON.parse(storage).state;
            const keys = state.apiKeys || {};
            const key = keys[domain];

            if (key) {
                const urlObj = new URL(url);
                if (domain === 'alphavantage.co') urlObj.searchParams.set('apikey', key);
                else if (domain === 'finnhub.io') urlObj.searchParams.set('token', key);
                else if (domain === 'indianapi.in') urlObj.searchParams.set('api_key', key);
                else if (!urlObj.searchParams.has('apikey')) urlObj.searchParams.set('apikey', key);
                return urlObj.toString();
            }
        }
    } catch (e) {
        console.error('Key injection failed:', e);
    }
    return url;
}

// Recursively extract all fields from JSON
export function extractFields(data: unknown, prefix = ''): ApiField[] {
    const fields: ApiField[] = [];
    if (data === null || data === undefined) return fields;

    if (Array.isArray(data)) {
        fields.push({
            path: prefix || 'root',
            type: 'array',
            value: `Array(${data.length})`,
            isArray: true,
        });
        if (data.length > 0 && typeof data[0] === 'object') {
            const itemFields = extractFields(data[0], prefix ? `${prefix}[0]` : '[0]');
            fields.push(...itemFields);
        }
    } else if (typeof data === 'object') {
        for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
            const path = prefix ? `${prefix}.${key}` : key;
            if (Array.isArray(value)) {
                fields.push({ path, type: 'array', value: `Array(${value.length})`, isArray: true });
                if (value.length > 0 && typeof value[0] === 'object') {
                    const itemFields = extractFields(value[0], `${path}[0]`);
                    fields.push(...itemFields);
                }
            } else if (typeof value === 'object' && value !== null) {
                fields.push({ path, type: 'object', value: '{...}', isArray: false });
                fields.push(...extractFields(value, path));
            } else {
                fields.push({ path, type: typeof value, value, isArray: false });
            }
        }
    }
    return fields;
}

// Get value from nested path
export function getValueByPath(data: unknown, path: string): unknown {
    if (!path || data === null || data === undefined) return data;
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let current: any = data;
    for (const key of keys) {
        if (current === null || current === undefined) return undefined;
        if (typeof current === 'object') current = current[key];
        else return undefined;
    }
    return current;
}

// Test API connection
export async function testApiConnection(url: string): Promise<ApiTestResult> {
    const domain = getDomain(url);
    const finalUrl = injectKey(url, domain);

    try {
        const response = await fetch(finalUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
        });

        if (response.status === 429) {
            return {
                success: false,
                message: `Rate limit exceeded for ${domain}. Please wait a moment.`,
                fields: [],
            };
        }

        if (!response.ok) {
            return {
                success: false,
                message: `HTTP Error: ${response.status} ${response.statusText}`,
                fields: [],
            };
        }

        const data = await response.json();
        const fields = extractFields(data);
        cache[getCacheKey(url)] = { data, timestamp: Date.now() };
        saveCache(cache);

        return {
            success: true,
            message: `API connection successful!`,
            fields,
            data,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS')) {
            return {
                success: false,
                message: 'CORS error: Browser blocked the request. Try a CORS proxy.',
                fields: [],
            };
        }
        return { success: false, message: `Connection failed: ${errorMessage}`, fields: [] };
    }
}

// Fetch API data with caching and domain-aware queueing
export async function fetchApiData(url: string, forceRefresh = false): Promise<{ success: boolean; data?: unknown; error?: string }> {
    const cacheKey = getCacheKey(url);
    const domain = getDomain(url);
    if (!forceRefresh && cache[cacheKey] && isCacheValid(cache[cacheKey].timestamp)) {
        return { success: true, data: cache[cacheKey].data };
    }

    return new Promise((resolve) => {
        if (!domainQueues[domain]) {
            domainQueues[domain] = { queue: [], processing: false, lastRequest: 0 };
        }
        domainQueues[domain].queue.push(async () => {
            try {
                const finalUrl = injectKey(url, domain);
                const response = await fetch(finalUrl, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                });
                if (response.status === 429) {
                    resolve({ success: false, error: `Rate limit exceeded for ${domain}` });
                    return;
                }
                if (!response.ok) {
                    resolve({ success: false, error: `HTTP Error: ${response.status}` });
                    return;
                }
                const data = await response.json();
                cache[cacheKey] = { data, timestamp: Date.now() };
                saveCache(cache);
                resolve({ success: true, data });
            } catch (error) {
                resolve({ success: false, error: error instanceof Error ? error.message : 'Fetch failed' });
            }
        });
        processDomainQueue(domain);
    });
}

// Format value based on type
export function formatValue(value: unknown, format?: 'currency' | 'percentage' | 'number' | 'text'): string {
    if (value === null || value === undefined) return '-';
    switch (format) {
        case 'currency':
            const num = parseFloat(String(value));
            if (isNaN(num)) return String(value);
            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(num);
        case 'percentage':
            const pct = parseFloat(String(value));
            if (isNaN(pct)) return String(value);
            return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
        case 'number':
            const n = parseFloat(String(value));
            if (isNaN(n)) return String(value);
            return new Intl.NumberFormat('en-IN').format(n);
        default:
            return String(value);
    }
}

// Clear cache
export function clearCache(url?: string) {
    if (url) delete cache[getCacheKey(url)];
    else Object.keys(cache).forEach(key => delete cache[key]);
}
