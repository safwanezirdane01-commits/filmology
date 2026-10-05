import { NextResponse } from "next/server";
import { getTvSeasonInfo, TvSeasonInfo } from "@/lib/tmdb";
import { SERIES_METADATA } from "@/lib/series";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.replace(/^tv[:-]/i, "").trim() || "";

    if (!id) {
      return NextResponse.json({ error: "Invalid TV ID" }, { status: 400 });
    }

    // 1. Fetch from TMDB first (live, real data with latest seasons and aired episodes)
    const info: TvSeasonInfo | null = await getTvSeasonInfo(id);
    if (info && info.totalSeasons > 0) {
      return NextResponse.json({
        source: "tmdb",
        totalSeasons: info.totalSeasons,
        seasons: info.seasons,
      });
    }

    // 2. Fall back to curated static metadata if TMDB request fails
    const cleanNumeric = id.replace(/^[^\d]+/, "");
    if (SERIES_METADATA[cleanNumeric] || SERIES_METADATA[id]) {
      const meta = SERIES_METADATA[cleanNumeric] || SERIES_METADATA[id];
      return NextResponse.json({
        source: "static",
        totalSeasons: meta.totalSeasons,
        seasons: meta.seasons,
      });
    }

    return NextResponse.json({
      source: "fallback",
      totalSeasons: 1,
      seasons: { 1: 10 },
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
