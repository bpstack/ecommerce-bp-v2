"use client";

import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";

export default function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setShowUpdate(true);
    };

    window.addEventListener("swUpdateAvailable", handleUpdate);

    return () => {
      window.removeEventListener("swUpdateAvailable", handleUpdate);
    };
  }, []);

  const handleUpdate = () => {
    // Recargar la página para activar el nuevo Service Worker
    window.location.reload();
  };

  const handleClose = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-4 duration-300"
      role="alert"
      aria-live="polite"
    >
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-2xl p-4 border border-orange-400/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Nueva versión disponible</h3>
            <p className="text-xs text-white/90 mb-3">
              Actualiza para obtener las últimas mejoras
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="bg-white text-orange-600 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-white/90 transition-colors cursor-pointer"
              >
                Actualizar
              </button>
              <button
                onClick={handleClose}
                className="bg-white/20 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-white/30 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
