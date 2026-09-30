import { NextRequest, NextResponse } from "next/server";
import { getMovieTrailer } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type") || "movie";

  if (!id) {
    return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
  }

  const isTv = type === "tv" || type === "series" || id.startsWith("tv-") || id.startsWith("tv:");
  const trailerKey = await getMovieTrailer(id, isTv);

  return NextResponse.json({
    success: !!trailerKey,
    trailerKey,
  });
}
