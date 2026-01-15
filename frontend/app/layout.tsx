// frontend/app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from 'sonner';
import { ServiceWorkerRegister, UpdateNotification, InstallPrompt } from '@/components/pwa';

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
  maximumScale: 5,
  userScalable: true,
  themeColor: '#FF9900',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://e-shop.stackbp.es'),
  title: {
    default: "bpshop - Headless e-commerce",
    template: '%s | bpshop',
  },
  description: "Developer-first marketplace built with Next.js and Strapi. Modular, API-driven architecture designed for extensibility, performance, and seamless integrations.",
  keywords: [
    'bpshop', 'e-commerce', 'headless commerce', 'Next.js', 'Strapi',
    'online store', 'shopping', 'marketplace', 'stackbp',
  ],
  authors: [{ name: 'bpstack' }],
  creator: 'bpstack',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'bpshop',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://e-shop.stackbp.es',
    title: 'bpshop - Headless e-commerce',
    description: 'Developer-first marketplace built with Next.js and Strapi',
    siteName: 'bpshop',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'bpshop',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'bpshop - Headless e-commerce',
    description: 'Developer-first marketplace built with Next.js and Strapi',
    images: ['/android-chrome-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Favicons explícitos para Google Search */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5HNQG5WY80"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-5HNQG5WY80');`
          }}
        />

        {/* Structured Data - Organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'bpshop',
              url: 'https://e-shop.stackbp.es',
              logo: 'https://e-shop.stackbp.es/android-chrome-512x512.png',
              description: 'Developer-first marketplace built with Next.js and Strapi',
              sameAs: [
                'https://github.com/bpstack',
              ],
            }),
          }}
        />

        {/* Structured Data - WebSite */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'bpshop',
              url: 'https://e-shop.stackbp.es',
              description: 'Developer-first marketplace built with Next.js and Strapi',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://e-shop.stackbp.es/products?search={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
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
        <ServiceWorkerRegister />
        <UpdateNotification />
        <InstallPrompt />
      </body>
    </html>
  );
}
