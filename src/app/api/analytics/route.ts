import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAnalyticsSummary, recordPageView, resetAnalyticsStore } from "@/lib/analytics";

export async function GET() {
  try {
    const summary = getAnalyticsSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json({ message: "Failed to fetch analytics" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { path, title, referrer, device } = body || {};

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "";
    
    // Hash IP for visitor count
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      hash = (hash * 31 + ip.charCodeAt(i)) % 10000000;
    }
    const visitorId = `v-${hash}`;

    let detectedDevice: "mobile" | "desktop" | "tablet" = "desktop";
    if (device) {
      detectedDevice = device;
    } else if (/mobile|android|iphone|ipad|ipod/i.test(userAgent)) {
      detectedDevice = /ipad|tablet/i.test(userAgent) ? "tablet" : "mobile";
    }

    recordPageView(
      {
        path: path || "/",
        title: title || "FilmologyX",
        referrer: referrer || "",
        device: detectedDevice,
      },
      visitorId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    // Silent fail for analytics beacon
    return NextResponse.json({ success: false });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    resetAnalyticsStore();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Failed to reset analytics" }, { status: 500 });
  }
}
