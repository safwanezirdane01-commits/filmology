"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    // 1. Never track internal admin studio or API routes
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Check optional manual exclusion if user explicitly turned it on
    try {
      if (localStorage.getItem("filmology_exclude_analytics") === "true") {
        return;
      }
    } catch {}

    // Avoid double counting same path in rapid succession
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    try {
      const isMobile = typeof window !== "undefined" && /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent);
      const isTablet = typeof window !== "undefined" && /ipad|tablet/i.test(navigator.userAgent);
      const device = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";
      const title = typeof document !== "undefined" ? document.title.replace(/ \| FilmologyX.*/, "") : "FilmologyX";
      const referrer = typeof document !== "undefined" ? document.referrer : "";

      const payload = JSON.stringify({
        path: pathname,
        title: title || "FilmologyX",
        referrer: referrer || "",
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
  }, [pathname]);

  return <Analytics />;
}
