# 🦈 Fin-BOARD

**Next-Gen Financial Analytics Dashboard**

Fin-BOARD is an advanced, real-time financial dashboard built with Next.js 14, TypeScript, and modern web technologies. It features a fully customizable widget system, interactive charts, secure API key management, and a premium dark/light theme aesthetic designed for financial data visualization.

## 🌟 Key Features

### 1. Widget Management System

**Add Widgets:** Users can create new finance data widgets by connecting to any financial API with three display modes:

- **Table View**: Paginated list or grid of stocks with advanced filters and search functionality
- **Finance Cards**: Single or multi-card layouts for:
  - Watchlists
  - Market Gainers & Losers
  - Performance Metrics
  - Real-time Financial Data
- **Charts**: Interactive candlestick or line graphs showing stock prices over customizable intervals (Daily, Weekly, Monthly)

**Remove Widgets:** Easy one-click deletion of widgets from the dashboard

**Rearrange Layout:** Drag-and-drop functionality powered by React Grid Layout to reorganize widget positions

**Widget Configuration:** Each widget includes a comprehensive configuration panel for:
- Display mode selection (Card/Chart/Table)
- Field mapping and selection
- Custom formatting (currency, percentage, number, text)
- Refresh interval settings
- Widget naming and descriptions

### 2. API Integration & Data Handling

**Dynamic Data Mapping:** Built-in API explorer that lets users:
- Test API connections in real-time
- Browse JSON response structures
- Select specific fields to display
- Preview data before widget creation

**Real-time Updates:** 
- Automatic data refresh with configurable intervals (30s, 1m, 5m, 15m, 30m, 1h)
- "Refresh All" functionality for manual updates
- Individual widget refresh controls

**Data Caching:** 
- Intelligent 5-minute cache system to optimize API calls
- Reduces redundant requests and preserves API quotas
- Session-based storage for fast data retrieval

**API Security:**
- Secure local storage for API keys (never sent to servers)
- Per-domain rate limiting (Alpha Vantage: 5 calls/min, Finnhub: 60 calls/min)
- Automatic key injection into API requests
- Request queueing to respect provider limits
- Graceful handling of rate limit errors (429 responses)

### 3. Wallet & Account Management

**Balance Overview:**
- Total balance card with income/expense breakdown
- Decorative curved-line background design
- Real-time balance calculations

**Card Management:**
- Multiple credit/debit card support with carousel navigation
- Gradient card designs with glassmorphism effects
- Card details display (type, bank, currency, status)
- Swipeable interface with pagination indicators

**Transaction History:**
- Filtered transactions by selected card
- Grouped by date with merchant icons
- Color-coded amounts (green for credits, red for debits)
- Expense tracking with percentage comparisons
- Sort and filter options

**Account Evolution:**
- Multi-line trend graphs showing Balance, Ingress, and Egress
- Account selector for multiple accounts
- Masked account numbers with copy-to-clipboard
- Detailed account information (CLABE, type, balance, last update)
- Time-series visualization with gradient area fills

**Monthly Expenditure Chart:**
- 12-month financial year view (April to March)
- Diagonal stripe pattern for non-hovered bars
- Solid fill on hover with animated tooltips
- Y-axis grid with value labels

### 4. User Interface & Experience

**Customizable Widgets:** 
- Finance card displays with editable titles
- User-selected metrics and data fields
- Per-field custom formatting options
- Widget descriptions and metadata

**Responsive Design:** 
- Fully responsive layout supporting desktop, tablet, and mobile
- Adaptive grid system that reflows on different screen sizes
- Touch-friendly interactions

**Loading & Error States:** 
- Skeleton loaders during data fetches
- Comprehensive error messages with retry options
- Empty state designs for no-data scenarios
- Toast notifications for user actions

**Theme System:**
- Dark and Light mode with smooth transitions
- Persistent theme preference
- Custom CSS variables for easy theming
- Glassmorphism and gradient effects

### 5. Data Persistence

**Browser Storage Integration:** 
- All widget configurations saved in localStorage
- Dashboard layouts persist across sessions
- API provider settings and keys stored securely

**State Recovery:** 
- Complete dashboard restoration on page refresh
- Widget data and positions preserved
- User preferences maintained

**Configuration Backup:** 
- Export dashboard as JSON file
- Import configurations from backup files
- Includes widgets, layout, theme, and API keys

### 6. Advanced Widget Features

**Field Selection Interface:** 
- Interactive JSON explorer for API responses
- Visual field browser with type indicators
- Array handling with nested field support
- Path-based field selection

**Custom Formatting:** 
- Currency formatting (₹, $, €)
- Percentage display with +/- indicators
- Number formatting with locale support
- Text truncation and display options

**Widget Naming:** 
- User-defined titles and descriptions
- Emoji support in widget names
- Metadata for better organization

**API Endpoint Management:** 
- Easy switching between API endpoints
- Saved API provider dropdown in widget creation
- Template library for quick setup
- Custom API provider creation with rate limit configuration

## 🔌 API Integration Guidelines

### Supported Financial APIs

- **Alpha Vantage**: Stock market, Forex, and Crypto data
- **Finnhub**: Real-time stock news and financials
- **IndianAPI**: Indian stock market data
- **Coinbase**: Cryptocurrency prices (no key required)
- **Custom APIs**: Add any JSON-based financial API

### API Key Management

1. Navigate to **Dashboard Settings** → **API Keys & Security**
2. Click **"+ Add Custom API"** for new providers or select existing ones
3. Enter your API key for each provider
4. Keys are stored locally and automatically injected into requests
5. "Get Key" links provided for easy registration

### Rate Limiting

- **Alpha Vantage**: 5 calls/minute (12-second delay between requests)
- **Finnhub**: 60 calls/minute (1-second delay)
- **Custom APIs**: Configurable rate limits per provider

### Security Best Practices

- API keys never sent to external servers
- Keys stored in browser's localStorage
- Automatic key injection per domain
- Per-domain request queueing
- Rate limit error handling with user notifications

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Git installed

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/groww-web_intern.git
   cd groww-web_intern
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000)

### Setting Up API Keys

1. Create accounts on your preferred financial API providers
2. Generate API keys from their dashboards
3. In Fin-BOARD, go to Settings → API Keys & Security
4. Add your keys for each provider
5. Start creating widgets with real-time data!

## 🛠️ Tech Stack

**Frontend Framework:**
- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [React 18](https://react.dev/) - UI library

**Styling & UI:**
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- Custom CSS variables for theming
- Glassmorphism and gradient effects

**State Management:**
- [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
- Persistent middleware for localStorage sync

**Layout & Interactions:**
- [React Grid Layout](https://github.com/react-grid-layout/react-grid-layout) - Drag-and-drop grid
- [Lucide React](https://lucide.dev/) - Icon library

**Data Handling:**
- Native Fetch API for HTTP requests
- Session/localStorage for caching
- Custom rate limiting implementation

**Development Tools:**
- ESLint - Code linting
- Prettier - Code formatting
- Git - Version control

## 📁 Project Structure

```
groww-web_intern/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Main dashboard page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── dashboard/         # Dashboard components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopHeader.tsx
│   │   │   ├── WidgetGrid.tsx
│   │   │   └── DashboardSettings.tsx
│   │   ├── modals/            # Modal components
│   │   │   ├── AddWidgetModal.tsx
│   │   │   ├── SettingsModal.tsx
│   │   │   └── TemplatesModal.tsx
│   │   ├── sections/          # Page sections
│   │   │   ├── HomeSection.tsx
│   │   │   ├── WalletSection.tsx
│   │   │   └── AnalyticsSection.tsx
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   └── wallet/            # Wallet-specific components
│   │       ├── BalanceSummaryCard.tsx
│   │       ├── CardCarousel.tsx
│   │       ├── CardTransactions.tsx
│   │       └── AccountEvolution.tsx
│   ├── services/
│   │   └── apiService.ts      # API utilities & caching
│   ├── store/
│   │   └── dashboardStore.ts  # Zustand store
│   └── types/
│       └── index.ts           # TypeScript types
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎨 Theme Customization

The application uses CSS variables for easy theming. Edit `globals.css` to customize:

```css
[data-theme="dark"] {
  --bg-primary: #0a0a0a;
  --bg-surface: #111827;
  --primary: #00d09c;
  /* ... more variables */
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-surface: #f9fafb;
  --primary: #00a876;
  /* ... more variables */
}
```

## 🚢 Production Build

```bash
npm run build
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

Built with ❤️ for financial data enthusiasts

---

**Fin-BOARD** - Empowering financial decisions through beautiful data visualization
