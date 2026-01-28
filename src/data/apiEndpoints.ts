// API Endpoint Suggestions for each provider
// Used for autocomplete in AddWidgetModal

export interface ApiEndpoint {
    url: string;
    label: string;
    description: string;
    category?: string;
}

export const API_ENDPOINT_SUGGESTIONS: Record<string, ApiEndpoint[]> = {
    'api.coinbase.com': [
        // Spot Prices
        { url: 'https://api.coinbase.com/v2/prices/BTC-USD/spot', label: 'Bitcoin Spot Price (USD)', description: 'Current BTC price in USD', category: 'Crypto Prices' },
        { url: 'https://api.coinbase.com/v2/prices/ETH-USD/spot', label: 'Ethereum Spot Price (USD)', description: 'Current ETH price in USD', category: 'Crypto Prices' },
        { url: 'https://api.coinbase.com/v2/prices/SOL-USD/spot', label: 'Solana Spot Price (USD)', description: 'Current SOL price in USD', category: 'Crypto Prices' },
        { url: 'https://api.coinbase.com/v2/prices/DOGE-USD/spot', label: 'Dogecoin Spot Price (USD)', description: 'Current DOGE price in USD', category: 'Crypto Prices' },
        // Exchange Rates
        { url: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC', label: 'Bitcoin Exchange Rates', description: 'BTC rates against all currencies', category: 'Exchange Rates' },
        { url: 'https://api.coinbase.com/v2/exchange-rates?currency=USD', label: 'USD Exchange Rates', description: 'USD rates for all cryptos', category: 'Exchange Rates' },
        // Buy/Sell Prices
        { url: 'https://api.coinbase.com/v2/prices/BTC-USD/buy', label: 'Bitcoin Buy Price', description: 'Current BTC buy price', category: 'Buy/Sell' },
        { url: 'https://api.coinbase.com/v2/prices/BTC-USD/sell', label: 'Bitcoin Sell Price', description: 'Current BTC sell price', category: 'Buy/Sell' },
        // Currencies
        { url: 'https://api.coinbase.com/v2/currencies', label: 'Fiat Currencies List', description: 'Supported fiat currencies', category: 'Reference' },
        { url: 'https://api.coinbase.com/v2/currencies/crypto', label: 'Cryptocurrencies List', description: 'Supported cryptocurrencies', category: 'Reference' },
    ],

    'finnhub.io': [
        // Stock Quotes
        { url: 'https://finnhub.io/api/v1/quote?symbol=AAPL', label: 'Apple Stock Quote', description: 'Real-time AAPL stock price', category: 'Stock Quotes' },
        { url: 'https://finnhub.io/api/v1/quote?symbol=MSFT', label: 'Microsoft Stock Quote', description: 'Real-time MSFT stock price', category: 'Stock Quotes' },
        { url: 'https://finnhub.io/api/v1/quote?symbol=GOOGL', label: 'Google Stock Quote', description: 'Real-time GOOGL stock price', category: 'Stock Quotes' },
        { url: 'https://finnhub.io/api/v1/quote?symbol=TSLA', label: 'Tesla Stock Quote', description: 'Real-time TSLA stock price', category: 'Stock Quotes' },
        { url: 'https://finnhub.io/api/v1/quote?symbol=NVDA', label: 'Nvidia Stock Quote', description: 'Real-time NVDA stock price', category: 'Stock Quotes' },
        // News
        { url: 'https://finnhub.io/api/v1/news?category=general', label: 'General Market News', description: 'Latest market news', category: 'News' },
        { url: 'https://finnhub.io/api/v1/news?category=forex', label: 'Forex News', description: 'Currency market news', category: 'News' },
        { url: 'https://finnhub.io/api/v1/news?category=crypto', label: 'Crypto News', description: 'Cryptocurrency news', category: 'News' },
        // Company Info
        { url: 'https://finnhub.io/api/v1/stock/profile2?symbol=AAPL', label: 'Apple Company Profile', description: 'Company information', category: 'Company' },
        // Crypto
        { url: 'https://finnhub.io/api/v1/crypto/symbol?exchange=binance', label: 'Binance Crypto Symbols', description: 'Available crypto pairs', category: 'Crypto' },
    ],

    'alphavantage.co': [
        // Stock Quotes
        { url: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM', label: 'IBM Stock Quote', description: 'Real-time IBM quote', category: 'Stock Quotes' },
        { url: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL', label: 'Apple Stock Quote', description: 'Real-time AAPL quote', category: 'Stock Quotes' },
        // Time Series
        { url: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&outputsize=compact', label: 'IBM Daily Time Series', description: 'Daily OHLCV data', category: 'Time Series' },
        { url: 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=IBM', label: 'IBM Weekly Time Series', description: 'Weekly OHLCV data', category: 'Time Series' },
        // Currency Exchange
        { url: 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=INR', label: 'USD to INR Rate', description: 'Currency exchange rate', category: 'Forex' },
        { url: 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR', label: 'USD to EUR Rate', description: 'Currency exchange rate', category: 'Forex' },
        // Crypto
        { url: 'https://www.alphavantage.co/query?function=CRYPTO_RATING&symbol=BTC', label: 'Bitcoin Rating', description: 'Crypto rating score', category: 'Crypto' },
    ],

    'indianapi.in': [
        // Stock Data
        { url: 'https://indianapi.in/api/v1/stock?name=reliance', label: 'Reliance Stock Data', description: 'Reliance Industries data', category: 'Stock Data' },
        { url: 'https://indianapi.in/api/v1/stock?name=tcs', label: 'TCS Stock Data', description: 'Tata Consultancy data', category: 'Stock Data' },
        { url: 'https://indianapi.in/api/v1/stock?name=infosys', label: 'Infosys Stock Data', description: 'Infosys stock data', category: 'Stock Data' },
        { url: 'https://indianapi.in/api/v1/stock?name=hdfc', label: 'HDFC Stock Data', description: 'HDFC Bank data', category: 'Stock Data' },
        // Trending
        { url: 'https://indianapi.in/api/v1/trending_stocks', label: 'Trending Stocks', description: 'Top gainers/losers', category: 'Market' },
        { url: 'https://indianapi.in/api/v1/bse_most_active', label: 'BSE Most Active', description: 'Most active BSE stocks', category: 'Market' },
        { url: 'https://indianapi.in/api/v1/nse_most_active', label: 'NSE Most Active', description: 'Most active NSE stocks', category: 'Market' },
        // Other
        { url: 'https://indianapi.in/api/v1/ipo', label: 'IPO Data', description: 'Upcoming IPOs', category: 'IPO' },
        { url: 'https://indianapi.in/api/v1/commodities', label: 'Commodities Data', description: 'Gold, Silver prices', category: 'Commodities' },
        { url: 'https://indianapi.in/api/v1/mutual_funds', label: 'Mutual Funds', description: 'Mutual fund data', category: 'Mutual Funds' },
    ],

    'api.coingecko.com': [
        // Bitcoin OHLC - Real Historical Data
        { url: 'https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=1', label: 'Bitcoin OHLC (24h)', description: 'Real 30-min candles', category: 'OHLC Charts' },
        { url: 'https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=7', label: 'Bitcoin OHLC (7 days)', description: 'Real 4-hour candles', category: 'OHLC Charts' },
        { url: 'https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=30', label: 'Bitcoin OHLC (30 days)', description: 'Real daily candles', category: 'OHLC Charts' },
        { url: 'https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=90', label: 'Bitcoin OHLC (90 days)', description: 'Real 4-day candles', category: 'OHLC Charts' },
        // Ethereum OHLC
        { url: 'https://api.coingecko.com/api/v3/coins/ethereum/ohlc?vs_currency=usd&days=7', label: 'Ethereum OHLC (7 days)', description: 'Real ETH candlestick', category: 'OHLC Charts' },
        { url: 'https://api.coingecko.com/api/v3/coins/ethereum/ohlc?vs_currency=usd&days=30', label: 'Ethereum OHLC (30 days)', description: 'Real ETH daily candles', category: 'OHLC Charts' },
        // Solana OHLC  
        { url: 'https://api.coingecko.com/api/v3/coins/solana/ohlc?vs_currency=usd&days=7', label: 'Solana OHLC (7 days)', description: 'Real SOL candlestick', category: 'OHLC Charts' },
        // Market Data
        { url: 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7', label: 'Bitcoin Price History (7 days)', description: 'Historical prices, market caps', category: 'Market Data' },
        { url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10', label: 'Top 10 Cryptos', description: 'Top cryptos by market cap', category: 'Market Data' },
        { url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25', label: 'Top 25 Cryptos', description: 'Extended market overview', category: 'Market Data' },
        { url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100', label: 'Top 100 Cryptos', description: 'Full market board', category: 'Market Data' },
        { url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd', label: 'Multi-Coin Prices', description: 'BTC, ETH, SOL current prices', category: 'Simple' },
    ],
};

// Get suggestions for a domain or filter by search term
export function getEndpointSuggestions(domain?: string, searchTerm?: string): ApiEndpoint[] {
    let suggestions: ApiEndpoint[] = [];

    if (domain) {
        // Get suggestions for specific domain
        const domainKey = Object.keys(API_ENDPOINT_SUGGESTIONS).find(
            key => domain.includes(key) || key.includes(domain)
        );
        if (domainKey) {
            suggestions = API_ENDPOINT_SUGGESTIONS[domainKey] || [];
        }
    } else {
        // Get all suggestions
        suggestions = Object.values(API_ENDPOINT_SUGGESTIONS).flat();
    }

    // Filter by search term if provided
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        suggestions = suggestions.filter(s =>
            s.url.toLowerCase().includes(term) ||
            s.label.toLowerCase().includes(term) ||
            s.description.toLowerCase().includes(term)
        );
    }

    return suggestions;
}

// CORS Proxy wrapper - using allorigins.win raw endpoint
export const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

export function wrapWithCorsProxy(url: string): string {
    return `${CORS_PROXY_URL}${encodeURIComponent(url)}`;
}
