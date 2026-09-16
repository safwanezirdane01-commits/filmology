import { NextRequest, NextResponse } from "next/server";
import { getTrendingMovies, getPopularMovies, getTopRatedMovies } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "trending";
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;

  try {
    let items = [];
    if (type === "popular") {
      items = await getPopularMovies(page);
    } else if (type === "top_rated") {
      items = await getTopRatedMovies(page);
    } else {
      items = await getTrendingMovies(page);
    }

    return NextResponse.json({ results: items });
  } catch (err) {
    console.error("API /api/discover error:", err);
    return NextResponse.json({ results: [], error: "Discover failed" }, { status: 500 });
  }
}
