import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TolgeeWrapper from "../components/TolgeeWrapper";
import { ThemeProvider } from "../contexts/ThemeContext";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <TolgeeWrapper>
            {children}
          </TolgeeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
