import { NextResponse } from "next/server";
import { getTvSeasonInfo, TvSeasonInfo } from "@/lib/tmdb";
import { SERIES_METADATA } from "@/lib/series";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.replace(/^tv[:-]/i, "").trim() || "";

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json({ error: "Invalid TV ID" }, { status: 400 });
    }

    // 1. Check hardcoded metadata first (instant, no API call needed)
    if (SERIES_METADATA[id]) {
      return NextResponse.json({
        source: "static",
        totalSeasons: SERIES_METADATA[id].totalSeasons,
        seasons: SERIES_METADATA[id].seasons,
      });
    }

    // 2. Fetch from TMDB (live, real data)
    const info: TvSeasonInfo | null = await getTvSeasonInfo(id);
    if (!info) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      source: "tmdb",
      totalSeasons: info.totalSeasons,
      seasons: info.seasons,
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
