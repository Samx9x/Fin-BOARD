// Historical Data Service
// Provides real OHLC data from CoinGecko and Alpha Vantage for charts

export interface OHLCDataPoint {
    timestamp: number;
    name: string;  // Display label
    open: number;
    high: number;
    low: number;
    close: number;
    value: number; // For line/area charts
}

// Check if API response is CoinGecko OHLC format
// CoinGecko returns: [[timestamp, open, high, low, close], ...]
export function isCoinGeckoOHLC(data: unknown): data is number[][] {
    if (!Array.isArray(data)) return false;
    if (data.length === 0) return false;
    const first = data[0];
    return Array.isArray(first) &&
        first.length === 5 &&
        typeof first[0] === 'number' &&
        first[0] > 1000000000000; // Timestamp in ms
}

// Parse CoinGecko OHLC response into chart-ready format
export function parseCoinGeckoOHLC(data: number[][]): OHLCDataPoint[] {
    return data.map(([timestamp, open, high, low, close]) => {
        const date = new Date(timestamp);
        return {
            timestamp,
            name: formatDateLabel(date),
            open,
            high,
            low,
            close,
            value: close, // For line charts, use close price
        };
    });
}

// Check if API response is Alpha Vantage time series format
export function isAlphaVantageTimeSeries(data: unknown): boolean {
    if (!data || typeof data !== 'object') return false;
    const keys = Object.keys(data as object);
    return keys.some(k => k.includes('Time Series') || k.includes('Weekly') || k.includes('Monthly'));
}

// Parse Alpha Vantage time series to OHLC
export function parseAlphaVantageTimeSeries(data: Record<string, unknown>): OHLCDataPoint[] {
    // Find the time series key
    const timeSeriesKey = Object.keys(data).find(
        k => k.includes('Time Series') || k.includes('Weekly') || k.includes('Monthly')
    );

    if (!timeSeriesKey) return [];

    const timeSeries = data[timeSeriesKey] as Record<string, Record<string, string>>;
    const entries = Object.entries(timeSeries);

    // Sort by date (oldest first for charts)
    entries.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

    // Limit to last 30 entries
    const limited = entries.slice(-30);

    return limited.map(([dateStr, values]) => {
        const date = new Date(dateStr);
        const open = parseFloat(values['1. open'] || '0');
        const high = parseFloat(values['2. high'] || '0');
        const low = parseFloat(values['3. low'] || '0');
        const close = parseFloat(values['4. close'] || '0');

        return {
            timestamp: date.getTime(),
            name: formatDateLabel(date),
            open,
            high,
            low,
            close,
            value: close,
        };
    });
}

// Helper: Format date to display label
function formatDateLabel(date: Date): string {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));

    if (diffDays === 0) {
        // Today: show time
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (diffDays < 7) {
        // This week: show day name
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    } else {
        // Older: show date
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }
}

// Main function: Detect and parse historical data from any API response
export function parseHistoricalData(data: unknown): OHLCDataPoint[] | null {
    // Try CoinGecko OHLC format first
    if (isCoinGeckoOHLC(data)) {
        return parseCoinGeckoOHLC(data);
    }

    // Try Alpha Vantage time series
    if (isAlphaVantageTimeSeries(data)) {
        return parseAlphaVantageTimeSeries(data as Record<string, unknown>);
    }

    // No known historical format detected
    return null;
}

// Check if data might be array that could be charted directly
export function isChartableArray(data: unknown): boolean {
    if (!Array.isArray(data)) return false;
    if (data.length < 2) return false;

    const first = data[0];
    if (typeof first !== 'object' || first === null) {
        // Could be CoinGecko OHLC array
        return isCoinGeckoOHLC(data);
    }

    // Check if array of objects with numeric values
    return Object.values(first).some(v => typeof v === 'number');
}
