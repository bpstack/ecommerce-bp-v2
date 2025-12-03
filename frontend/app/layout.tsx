// frontend/app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF9900',
};

export const metadata: Metadata = {
  title: "bpshop - Headless e-commerce",
  description: "Developer-first marketplace built with Next.js and Strapi. Modular, API-driven architecture designed for extensibility, performance, and seamless integrations.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'bpshop',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <Analytics />
              {/* Desktop: top-center, Mobile: bottom-center */}
              <div className="hidden sm:block">
                <Toaster 
                  position="top-center" 
                  richColors 
                  offset="80px"
                  expand={true} 
                />
              </div>

              <div className="block sm:hidden">
                <Toaster 
                  position="bottom-center" 
                  richColors 
                  offset="50px"
                  expand={true} 
                />
              </div>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}