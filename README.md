# 🦈 Fin-BOARD
**Next-Gen Financial Analytics Dashboard**

Fin-BOARD is a premium, real-time financial dashboard designed for high-impact data visualization and seamless API integration.

## 🌟 Features

### 💎 User Experience & Design
- **Premium Onboarding Flow**: Immersive, multi-stage entry sequence (Animated Logo ➔ Named Setup ➔ Dashboard Welcome).
- **Glassmorphism UI**: High-fidelity dark mode with dynamic shadows, glass blurs, and Framer Motion animations.
- **Persistent Personalization**: User name, dashboard layout, and API configurations are saved across sessions using local storage.
- **One-Click Cleanup**: Specialized "Clear All" utility with data backup/export options.

### 🛡️ Smart API Engine
- **Intelligent Autocomplete**: Real-time URL suggestions powered by global history and curated financial providers.
- **URL Memory**: Remembers and prioritizes previously used successful API endpoints.
- **Integrated CORS Proxy**: One-click toggle to bypass browser restrictions for third-party financial sources.
- **Automated Authentication**: Securely injects saved API keys and symbols into both proxied and direct requests.

### 📈 Advanced Visualization
- **Real Historical Benchmarks**: Native support for **CoinGecko OHLC** and Alpha Vantage datasets.
- **Adaptive Chart Intervals**: Auto-detects chart granularity (Daily/Weekly/Monthly) with glowing "Refresh Required" indicators.
- **Dynamic Field Mapping**: Interactive JSON explorer to map any nested API field to cards, tables, or charts.
- **Universal Currency Detection**: Automatic formatting for:
  - 💵 **USD ($)** | 💶 **EUR (€)** | 💷 **GBP (£)**
  - 🇮🇳 **INR (₹)** | ₿ **BTC** | Ξ **ETH**

### 🧩 Instant Templates
- **Top 25 Crypto Board**: Pre-configured table tracking the top assets by market capitalization.
- **Real-Time Candlesticks**: One-click setup for Bitcoin and Ethereum historical performance charts.
- **Live Exchange Rates**: Multi-currency conversion cards (BTC/INR/USD).

## 📸 Visual Showcase

| Login & Branding | Registration / Name Entry |
| :---: | :---: |
| ![Splash Screen](screenshots/image.png) | ![Name Setup](screenshots/image%20copy.png) |

| Dashboard Overview | Live Market Table |
| :---: | :---: |
| ![Dashboard](screenshots/image%20copy%202.png) | ![Market Table](screenshots/image%20copy%203.png) |

| Add Widget (Smart Search) | JSON Field Explorer |
| :---: | :---: |
| ![Add Widget](screenshots/image%20copy%204.png) | ![Field Explorer](screenshots/image%20copy%205.png) |

| BTC Candlestick Chart | ETH Historical Data |
| :---: | :---: |
| ![BTC Chart](screenshots/image%20copy%206.png) | ![ETH Chart](screenshots/image%20copy%207.png) |

| Advanced Settings | API Key Management |
| :---: | :---: |
| ![Settings 1](screenshots/image%20copy%208.png) | ![Settings 2](screenshots/image%20copy%209.png) |

| Multi-Stage Greeting | Final Dashboard View |
| :---: | :---: |
| ![Welcome](screenshots/image%20copy%2010.png) | ![Full Dashboard](screenshots/image%20copy%2011.png) |

## 🚀 Getting Started
1. **Clone & Install**:
   ```bash
   git clone https://github.com/Samx9x/Fin-BOARD.git
   cd groww-web_intern
   npm install
   ```
2. **Run Dev Server**:
   ```bash
   npm run dev
   ```
3. **Explore**: Open [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS, Custom CSS Variables
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State**: Zustand (with Persist)
- **Grid**: React Grid Layout

## ❤️ Thank You!
Thank you for exploring Fin-BOARD! We hope this dashboard empowers your financial data journey.

---
Built with ❤️ by **SHRIANSH**
