import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
  CacheableResponsePlugin,
  ExpirationPlugin,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Páginas HTML - NetworkFirst (siempre intentar obtener la última versión)
    {
      matcher: ({ request }) => request.mode === "navigate",
      handler: new NetworkFirst({
        cacheName: "bpshop-v1-pages",
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200],
          }),
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 24 horas
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
    // Imágenes - CacheFirst (cachear por 30 días)
    {
      matcher: ({ request }) =>
        request.destination === "image" ||
        /\.(png|jpg|jpeg|svg|gif|webp|ico|avif)$/i.test(
          new URL(request.url).pathname,
        ),
      handler: new CacheFirst({
        cacheName: "bpshop-v1-images",
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200],
          }),
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
    // CSS y JS - CacheFirst (tienen hash en el nombre, son inmutables)
    {
      matcher: ({ request }) =>
        request.destination === "style" || request.destination === "script",
      handler: new CacheFirst({
        cacheName: "bpshop-v1-static",
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200],
          }),
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
    // Fuentes de Google - CacheFirst
    {
      matcher: ({ url }) =>
        url.hostname === "fonts.googleapis.com" ||
        url.hostname === "fonts.gstatic.com",
      handler: new CacheFirst({
        cacheName: "bpshop-v1-fonts",
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200],
          }),
          new ExpirationPlugin({
            maxEntries: 30,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
    // API de Strapi - NetworkFirst (productos siempre frescos, con fallback a caché)
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/api/") ||
        url.hostname.includes("strapi") ||
        url.hostname.includes("localhost:1337"),
      handler: new NetworkFirst({
        cacheName: "bpshop-v1-api",
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200],
          }),
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 5 * 60, // 5 minutos (productos pueden cambiar)
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
  ],
});

serwist.addEventListeners();
