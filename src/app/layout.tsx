import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fin-BOARD | Next Gen Financial Analytics",
  description: "Advanced financial dashboard with real-time crypto/stock data, customizable widgets, and premium aesthetics.",
  keywords: ["finance", "dashboard", "stocks", "crypto", "real-time", "widgets", "analytics"],
  authors: [{ name: "Fin-BOARD Team" }],
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {/* Animated Background */}
          <div className="animated-bg" />

          {/* Floating Particles */}
          <div className="particles">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 15}s`,
                  animationDuration: `${15 + Math.random() * 10}s`,
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <main className="relative z-10 min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
