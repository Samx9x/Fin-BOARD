# 🦈 Fin-BOARD

**Next Gen Financial Analytics Dashboard**

Fin-BOARD is a premium, real-time financial dashboard built with Next.js 14, TypeScript, and TailwindCSS. It features a customizable widget system, interactive charts, and a stunning dark/light aesthetic.

![Fin-BOARD Demo](https://placehold.co/1200x600/111827/00d09c?text=Fin-BOARD+Preview)

## 🌟 Features

*   **Real-time Data**: Live crypto prices via Coinbase API.
*   **Customizable Dashboard**: Drag-and-drop widgets with resize capabilities.
*   **Advanced Analytics**:
    *   Interactive Line/Area/Bar charts
    *   Comparison tools for Stocks & Crypto
*   **Premium Aesthetics**:
    *   Glassmorphism design
    *   Smooth animations (Framer Motion)
    *   Dark/Light mode support with persistent state
*   **Secure & Fast**: Built on Next.js 14 App Router for optimal performance.

## 🚀 Getting Started

### Prerequisites

*   Node.js 18+ installed

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone https://github.com/your-username/fin-board.git
    cd fin-board
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open in Browser**:
    Visit [http://localhost:3000](http://localhost:3000)

## 📦 Deployment Guide

### Option 1: Vercel (Recommended)

1.  **Push to GitHub**:
    *   Initialize git: `git init`
    *   Add files: `git add .`
    *   Commit: `git commit -m "Initial commit"`
    *   Create a NEW repository on GitHub (do not initialize with README).
    *   Link remote and push:
        ```bash
        git remote add origin https://github.com/YOUR_GITHUB_USERNAME/fin-board.git
        git branch -M main
        git push -u origin main
        ```

2.  **Deploy on Vercel**:
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **"Add New..."** -> **"Project"**.
    *   Import your `fin-board` repository from GitHub.
    *   **Framework Preset**: Next.js (should detect automatically).
    *   **Root Directory**: `./` (default).
    *   Click **Deploy**.

### Option 2: Netlify

1.  Push your code to GitHub as shown above.
2.  Log in to Netlify and click "New site from Git".
3.  Choose GitHub and select your repository.
4.  **Build Command**: `next build`
5.  **Publish Directory**: `.next` (or leave default for Next.js plugin).
6.  Click **Deploy Site**.

## 🛠️ Built With

*   [Next.js 14](https://nextjs.org/) - React Framework
*   [TypeScript](https://www.typescriptlang.org/) - Type Safety
*   [Tailwind CSS](https://tailwindcss.com/) - Styling
*   [Framer Motion](https://www.framer.com/motion/) - Animations
*   [Recharts](https://recharts.org/) - Data Visualization
*   [Zustand](https://github.com/pmndrs/zustand) - State Management
*   [React Grid Layout](https://github.com/react-grid-layout/react-grid-layout) - Drag & Drop

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
