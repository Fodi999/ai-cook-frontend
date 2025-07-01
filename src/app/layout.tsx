import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TolgeeWrapper from "../components/TolgeeWrapper";
import { ThemeProvider } from "../contexts/ThemeContext";
import PWAInstallPrompt from "../components/PWAInstallPrompt";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";
import MobileBottomNavigation from "../components/MobileBottomNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IT Cook - Современная платформа для кулинарных рецептов",
  description: "Готовьте с удовольствием! Более 10,000 проверенных рецептов от шеф-поваров и любителей кулинарии.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'IT Cook',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="IT Cook" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        <ThemeProvider>
          <TolgeeWrapper>
            <div className="relative min-h-screen pb-16 md:pb-0">
              <ServiceWorkerRegister />
              {children}
              <MobileBottomNavigation />
              <PWAInstallPrompt />
            </div>
          </TolgeeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
