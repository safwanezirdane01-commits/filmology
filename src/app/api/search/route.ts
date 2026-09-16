import { NextRequest, NextResponse } from "next/server";
import { searchUniversal, UniversalItem } from "@/lib/tmdb";
import { CURATED_CATALOG } from "@/lib/catalog";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const qLower = query.toLowerCase();

    // 1. Local Curated Matches
    const localMatches: UniversalItem[] = CURATED_CATALOG.filter(
      (m) =>
        m.title.toLowerCase().includes(qLower) ||
        m.genre.toLowerCase().includes(qLower)
    ).map((m) => ({
      id: m.id,
      title: m.title,
      genre: m.genre,
      releaseYear: m.releaseYear,
      videoUrl: m.videoUrl,
      thumbnailUrl: m.thumbnailUrl,
      description: m.description,
      mediaType: m.category === "series" || /series|tv/i.test(m.genre) ? "tv" : "movie",
      category: m.category,
    }));

    // 2. Universal IMDb / TMDb Matches (millions of films & series)
    const tmdbResults = await searchUniversal(query);

    // 3. Deduplicate (avoid duplicates if already in localMatches)
    const existingTitles = new Set(localMatches.map((m) => m.title.toLowerCase().trim()));
    const uniqueTmdb = tmdbResults.filter(
      (t) => !existingTitles.has(t.title.toLowerCase().trim())
    );

    const merged = [...localMatches, ...uniqueTmdb];

    return NextResponse.json({
      results: merged,
      total: merged.length,
    });
  } catch (err) {
    console.error("API /api/search error:", err);
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
  }
}
