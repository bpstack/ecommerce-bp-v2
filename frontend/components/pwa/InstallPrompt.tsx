"use client";

import { useEffect, useState } from "react";
import { Download, X, Share, Plus } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY = "bpshop-install-prompt-dismissed";
const IOS_STORAGE_KEY = "bpshop-ios-install-shown";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Verificar si es iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    // Verificar si ya está instalada como PWA
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return; // Ya está instalada, no mostrar el prompt
    }

    // Verificar si el usuario ya descartó el prompt
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return; // No mostrar si fue descartado hace menos de 7 días
      }
    }

    // Para iOS, mostrar instrucciones personalizadas
    if (isIOSDevice) {
      const iosShown = localStorage.getItem(IOS_STORAGE_KEY);
      if (!iosShown) {
        // Mostrar después de 30 segundos de navegación
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 30000);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Para Android/Chrome, usar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Mostrar después de 20 segundos de navegación
      setTimeout(() => {
        setShowPrompt(true);
      }, 20000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("[PWA] Usuario aceptó la instalación");
      } else {
        console.log("[PWA] Usuario rechazó la instalación");
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());
      }
    } catch (error) {
      console.error("[PWA] Error al instalar:", error);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    if (isIOS) {
      localStorage.setItem(IOS_STORAGE_KEY, "true");
    }
    setShowPrompt(false);
    setShowIOSModal(false);
  };

  // Modal de instrucciones para iOS
  if (showIOSModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Instalar bpshop
            </h3>
            <button
              onClick={handleDismiss}
              className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            Para instalar la app en tu iPhone/iPad:
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                1
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                Pulsa el botón <Share className="w-5 h-5 text-blue-500" /> Compartir
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                2
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                Selecciona <Plus className="w-5 h-5" /> Añadir a pantalla de inicio
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                3
              </div>
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Pulsa &quot;Añadir&quot; en la esquina superior
              </span>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  }

  if (!showPrompt || (!deferredPrompt && !isIOS)) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer animate-in slide-in-from-left-4 duration-300"
      aria-label="Instalar aplicación"
    >
      <Download className="w-5 h-5" />
      <span className="font-medium text-sm">Instalar App</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className="ml-1 p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4" />
      </button>
    </button>
  );
}
