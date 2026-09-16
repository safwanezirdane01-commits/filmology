import { NextRequest, NextResponse } from "next/server";
import { discoverByFilter, getTrendingMovies, getPopularMovies, getTopRatedMovies } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || searchParams.get("type") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;

  try {
    const items = await discoverByFilter(category, page);
    return NextResponse.json({
      results: items,
      page,
      category,
    });
  } catch (err) {
    console.error("API /api/discover error:", err);
    return NextResponse.json({ results: [], error: "Discover failed" }, { status: 500 });
  }
}
