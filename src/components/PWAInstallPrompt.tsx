"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user dismissed recently (within 7 days)
    const dismissedAt = localStorage.getItem("pwa_prompt_dismissed");
    if (dismissedAt && Date.now() - Number(dismissedAt) < 7 * 86400 * 1000) {
      return;
    }

    // Check if already in standalone mode (installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) return;

    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    if (isIosDevice) {
      // Delay showing on iOS so it doesn't interrupt initial page render
      const timer = setTimeout(() => setShowPrompt(true), 4000);
      return () => clearTimeout(timer);
    }

    // Android / Chrome: capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa_prompt_dismissed", String(Date.now()));
  };

  if (!showPrompt) return null;

  return (
    <aside
      aria-label="Install app"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50 bg-slate-900 border border-purple-500/30 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <div className="flex items-center space-x-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-purple-600 flex items-center justify-center font-black text-sm shrink-0 shadow">
          FX
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-white truncate">Install FilmologyX</h4>
          <p className="text-[11px] text-slate-300 truncate">
            {isIos ? "Tap Share → 'Add to Home Screen'" : "Fast streaming right on your phone"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 shrink-0">
        {isIos ? (
          <span className="p-2 bg-slate-800 rounded-xl text-rose-400">
            <Share className="w-4 h-4" />
          </span>
        ) : (
          <button
            type="button"
            onClick={handleInstallClick}
            className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition-transform active:scale-95 flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
        )}
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
