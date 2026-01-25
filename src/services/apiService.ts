import { ApiField, ApiTestResult } from '@/types';

// In-memory cache
const cache: Record<string, { data: unknown; timestamp: number }> = {};
const CACHE_TTL = 30000; // 30 seconds

// Rate limiting queue
const requestQueue: Array<() => Promise<void>> = [];
let isProcessingQueue = false;
const REQUEST_DELAY = 100; // 100ms between requests

async function processQueue() {
    if (isProcessingQueue || requestQueue.length === 0) return;

    isProcessingQueue = true;
    while (requestQueue.length > 0) {
        const request = requestQueue.shift();
        if (request) {
            await request();
            await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
        }
    }
    isProcessingQueue = false;
}

function getCacheKey(url: string): string {
    return url.toLowerCase();
}

function isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < CACHE_TTL;
}

// Recursively extract all fields from JSON
export function extractFields(data: unknown, prefix = ''): ApiField[] {
    const fields: ApiField[] = [];

    if (data === null || data === undefined) {
        return fields;
    }

    if (Array.isArray(data)) {
        fields.push({
            path: prefix || 'root',
            type: 'array',
            value: `Array(${data.length})`,
            isArray: true,
        });

        // Extract fields from first item if exists
        if (data.length > 0 && typeof data[0] === 'object') {
            const itemFields = extractFields(data[0], prefix ? `${prefix}[0]` : '[0]');
            fields.push(...itemFields);
        }
    } else if (typeof data === 'object') {
        for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
            const path = prefix ? `${prefix}.${key}` : key;

            if (Array.isArray(value)) {
                fields.push({
                    path,
                    type: 'array',
                    value: `Array(${value.length})`,
                    isArray: true,
                });

                if (value.length > 0 && typeof value[0] === 'object') {
                    const itemFields = extractFields(value[0], `${path}[0]`);
                    fields.push(...itemFields);
                }
            } else if (typeof value === 'object' && value !== null) {
                fields.push({
                    path,
                    type: 'object',
                    value: '{...}',
                    isArray: false,
                });
                const nestedFields = extractFields(value, path);
                fields.push(...nestedFields);
            } else {
                fields.push({
                    path,
                    type: typeof value,
                    value: value,
                    isArray: false,
                });
            }
        }
    }

    return fields;
}

// Get value from nested path
export function getValueByPath(data: unknown, path: string): unknown {
    if (!path || data === null || data === undefined) {
        return data;
    }

    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let current: unknown = data;

    for (const key of keys) {
        if (current === null || current === undefined) {
            return undefined;
        }

        if (typeof current === 'object') {
            current = (current as Record<string, unknown>)[key];
        } else {
            return undefined;
        }
    }

    return current;
}

// Test API connection
export async function testApiConnection(url: string): Promise<ApiTestResult> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            return {
                success: false,
                message: `HTTP Error: ${response.status} ${response.statusText}`,
                fields: [],
            };
        }

        const data = await response.json();
        const fields = extractFields(data);

        // Cache the result
        cache[getCacheKey(url)] = {
            data,
            timestamp: Date.now(),
        };

        return {
            success: true,
            message: `API connection successful! ${fields.filter(f => !f.path.includes('.')).length} top-level fields found.`,
            fields,
            data,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        // Handle CORS errors specifically
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS')) {
            return {
                success: false,
                message: 'CORS error: The API may not allow browser requests. Try using a CORS proxy or an API that supports CORS.',
                fields: [],
            };
        }

        return {
            success: false,
            message: `Connection failed: ${errorMessage}`,
            fields: [],
        };
    }
}

// Fetch API data with caching
export async function fetchApiData(url: string, forceRefresh = false): Promise<{ success: boolean; data?: unknown; error?: string }> {
    const cacheKey = getCacheKey(url);

    // Check cache first
    if (!forceRefresh && cache[cacheKey] && isCacheValid(cache[cacheKey].timestamp)) {
        return {
            success: true,
            data: cache[cacheKey].data,
        };
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            return {
                success: false,
                error: `HTTP Error: ${response.status}`,
            };
        }

        const data = await response.json();

        // Update cache
        cache[cacheKey] = {
            data,
            timestamp: Date.now(),
        };

        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch data',
        };
    }
}

// Format value based on type
export function formatValue(value: unknown, format?: 'currency' | 'percentage' | 'number' | 'text'): string {
    if (value === null || value === undefined) {
        return '-';
    }

    switch (format) {
        case 'currency':
            const num = parseFloat(String(value));
            if (isNaN(num)) return String(value);
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 2,
            }).format(num);

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
    if (url) {
        delete cache[getCacheKey(url)];
    } else {
        Object.keys(cache).forEach(key => delete cache[key]);
    }
}

// Export for usage in hooks
export { processQueue, requestQueue };
