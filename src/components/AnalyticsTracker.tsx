"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    // 1. Never track admin studio or internal API paths
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // 2. If user is logged in as ADMIN, automatically mark this device as excluded
    if (session?.user && (session.user as any).role === "ADMIN") {
      try {
        localStorage.setItem("filmology_exclude_analytics", "true");
        document.cookie = "filmology_exclude_analytics=1; path=/; max-age=31536000; SameSite=Lax";
      } catch {}
      return;
    }

    // 3. Check if this device is marked as excluded (admin flag)
    try {
      if (
        localStorage.getItem("filmology_exclude_analytics") === "true" ||
        document.cookie.includes("filmology_exclude_analytics=1")
      ) {
        return; // Excluded! Do not track this user's browsing
      }
    } catch {}

    // Avoid double counting same path in rapid succession
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    // Wait slightly so document.title updates
    const timer = setTimeout(() => {
      try {
        // Re-check exclusion right before sending
        if (
          localStorage.getItem("filmology_exclude_analytics") === "true" ||
          document.cookie.includes("filmology_exclude_analytics=1")
        ) {
          return;
        }

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
  }, [pathname, session]);

  return (
    <Analytics
      beforeSend={(event) => {
        try {
          if (
            typeof window !== "undefined" &&
            (localStorage.getItem("filmology_exclude_analytics") === "true" ||
              document.cookie.includes("filmology_exclude_analytics=1") ||
              window.location.pathname.startsWith("/admin"))
          ) {
            return null; // Exclude from Vercel Analytics
          }
        } catch {}
        return event;
      }}
    />
  );
}
