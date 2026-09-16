"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, RefreshCw, CheckCircle2, ShieldOff } from "lucide-react";

export default function AdBlockDetector() {
  const [isAdBlockActive, setIsAdBlockActive] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  const checkAdBlocker = async () => {
    setChecking(true);
    let detected = false;

    // Test 1: DOM Bait Element Test
    try {
      const bait = document.createElement("div");
      bait.className = "adsbygoogle ad-zone ad-banner pub_300x250 sponsor-ad";
      bait.style.position = "absolute";
      bait.style.left = "-9999px";
      bait.style.top = "-9999px";
      bait.style.height = "10px";
      bait.style.width = "10px";
      bait.innerHTML = "&nbsp;";
      document.body.appendChild(bait);

      window.setTimeout(() => {
        if (
          bait.offsetHeight === 0 ||
          bait.clientHeight === 0 ||
          bait.offsetParent === null ||
          window.getComputedStyle(bait).display === "none" ||
          window.getComputedStyle(bait).visibility === "hidden"
        ) {
          detected = true;
        }
        if (document.body.contains(bait)) {
          document.body.removeChild(bait);
        }
      }, 100);
    } catch {
      detected = true;
    }

    // Test 2: Network Fetch Bait Test (googleadservices)
    try {
      const res = await fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-store",
      }).catch(() => null);

      if (!res) {
        detected = true;
      }
    } catch {
      detected = true;
    }

    // Test 3: Brave Browser Specific Check
    try {
      // @ts-ignore
      if (navigator.brave && (await navigator.brave.isBrave())) {
        detected = true;
      }
    } catch {}

    setTimeout(() => {
      setIsAdBlockActive(detected);
      setChecking(false);
    }, 400);
  };

  useEffect(() => {
    checkAdBlocker();
  }, []);

  if (checking || !isAdBlockActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none">
      <div className="max-w-lg w-full bg-slate-900 border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(244,63,94,0.3)] text-center relative overflow-hidden">
        {/* Ambient Top Red Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Shield Icon */}
        <div className="w-16 sm:w-20 h-16 sm:h-20 bg-rose-500/10 border border-rose-500/30 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-inner text-rose-500">
          <ShieldAlert className="w-8 sm:w-10 h-8 sm:h-10 animate-pulse" />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 tracking-tight">
          AdBlocker / Shields Detected
        </h2>

        {/* Subtitle */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
          We noticed you are using an <strong className="text-rose-400 font-bold">AdBlocker or Brave Shields</strong>. FilmologyX relies on sponsors to keep 100% of our 1080p HD films and series completely free.
        </p>

        {/* Step-by-Step Box */}
        <div className="bg-slate-950/80 border border-purple-500/20 rounded-2xl p-4 mb-6 text-left space-y-2.5">
          <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center space-x-1.5">
            <ShieldOff className="w-4 h-4 text-rose-400" />
            <span>How to disable and enter:</span>
          </h4>
          <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside font-medium">
            <li>Click your AdBlocker extension icon (or the Lion icon in Brave).</li>
            <li>Select <strong className="text-white">"Disable on this site"</strong> or turn off <strong className="text-white">Shields</strong>.</li>
            <li>Click the button below to refresh and start streaming!</li>
          </ol>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            setChecking(true);
            window.location.reload();
          }}
          className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl transition-transform hover:scale-[1.02] flex items-center justify-center space-x-2 text-sm cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>I Have Disabled My AdBlocker (Refresh)</span>
        </button>
      </div>
    </div>
  );
}
