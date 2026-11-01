import { NextResponse } from "next/server";
import { getAnalyticsSummary, recordPageView, resetAnalyticsStore } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const summary = getAnalyticsSummary();
    return NextResponse.json(summary, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json({ message: "Failed to fetch analytics" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Check exclusion header if explicitly passed
    if (req.headers.get("x-exclude-analytics") === "1") {
      return NextResponse.json({ success: true, ignored: true });
    }

    const body = await req.json();
    const { path, title, referrer, device, isTestPing } = body || {};

    if (!isTestPing && (!path || path.startsWith("/admin") || path.startsWith("/api"))) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "";
    
    // Hash IP for unique visitor count
    let hash = 0;
    const ipStr = isTestPing ? `test-${Date.now()}` : ip;
    for (let i = 0; i < ipStr.length; i++) {
      hash = (hash * 31 + ipStr.charCodeAt(i)) % 10000000;
    }
    const visitorId = `v-${hash}`;

    let detectedDevice: "mobile" | "desktop" | "tablet" = "desktop";
    if (device === "mobile" || device === "tablet" || device === "desktop") {
      detectedDevice = device;
    } else if (/mobile|android|iphone|ipad|ipod/i.test(userAgent)) {
      detectedDevice = /ipad|tablet/i.test(userAgent) ? "tablet" : "mobile";
    }

    recordPageView(
      {
        path: path || "/",
        title: title || "FilmologyX",
        referrer: referrer || "Direct",
        device: detectedDevice,
      },
      visitorId
    );

    const updated = getAnalyticsSummary();
    return NextResponse.json({ success: true, summary: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

export async function DELETE() {
  try {
    resetAnalyticsStore();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Failed to reset analytics" }, { status: 500 });
  }
}
