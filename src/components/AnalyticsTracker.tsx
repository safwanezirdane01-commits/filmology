"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    // Avoid double counting same path in rapid succession
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    // Wait slightly so document.title updates
    const timer = setTimeout(() => {
      try {
        const isMobile = typeof window !== "undefined" && /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent);
        const device = isMobile ? "mobile" : "desktop";
        const title = typeof document !== "undefined" ? document.title.replace(/ \| FilmologyX.*/, "") : "FilmologyX";
        const referrer = typeof document !== "undefined" ? document.referrer : "";

        const payload = JSON.stringify({
          path: pathname,
          title,
          referrer,
          device,
        });

        if (typeof navigator !== "undefined" && navigator.sendBeacon) {
          navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
        } else {
          fetch("/api/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch (err) {
        // Silent fail
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
