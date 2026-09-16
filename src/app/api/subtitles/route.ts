import { NextRequest, NextResponse } from "next/server";

const TMDB_KEY = process.env.TMDB_API_KEY || "4e44d9029b1270a757cddc766a1bcb63";
const TMDB_BASE = "https://api.themoviedb.org/3";

/**
 * Resolve IMDb ID from TMDb ID if needed
 */
async function resolveImdbId(idOrUrl: string, isTv: boolean): Promise<string | null> {
  let clean = idOrUrl.trim();
  if (clean.startsWith("tv:") || clean.startsWith("tv-")) {
    clean = clean.replace(/^tv[-:]/i, "");
    isTv = true;
  }

  // Already an IMDb ID (e.g. tt0816692)
  if (/^tt\d+$/i.test(clean)) {
    return clean;
  }

  // Numeric TMDb ID -> Fetch external IDs
  if (/^\d+$/.test(clean)) {
    try {
      const endpoint = isTv
        ? `${TMDB_BASE}/tv/${clean}/external_ids?api_key=${TMDB_KEY}`
        : `${TMDB_BASE}/movie/${clean}?api_key=${TMDB_KEY}`;
      const res = await fetch(endpoint, { next: { revalidate: 86400 } });
      if (res.ok) {
        const data = await res.json();
        if (data.imdb_id) return data.imdb_id;
      }
      // If movie lookup failed or returned no IMDb ID, try TV
      if (!isTv) {
        const tvRes = await fetch(`${TMDB_BASE}/tv/${clean}/external_ids?api_key=${TMDB_KEY}`, { next: { revalidate: 86400 } });
        if (tvRes.ok) {
          const tvData = await tvRes.json();
          if (tvData.imdb_id) return tvData.imdb_id;
        }
      }
    } catch (e) {
      console.warn("Failed to resolve IMDb ID from TMDb:", e);
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawId = searchParams.get("id") || "";
  const type = searchParams.get("type") || "movie";
  const season = parseInt(searchParams.get("season") || "1", 10) || 1;
  const episode = parseInt(searchParams.get("episode") || "1", 10) || 1;

  if (!rawId) {
    return NextResponse.json({ success: false, error: "Missing id parameter" }, { status: 400 });
  }

  try {
    const isTv = type === "tv" || type === "series" || rawId.startsWith("tv:") || rawId.startsWith("tv-");
    const imdbId = await resolveImdbId(rawId, isTv);

    if (!imdbId) {
      return NextResponse.json({ success: false, error: "Could not find IMDb ID for title" }, { status: 404 });
    }

    // Query Stremio OpenSubtitles addon
    const stremioUrl = isTv
      ? `https://opensubtitles-v3.strem.io/subtitles/series/${imdbId}:${season}:${episode}.json`
      : `https://opensubtitles-v3.strem.io/subtitles/movie/${imdbId}.json`;

    const subRes = await fetch(stremioUrl, { next: { revalidate: 3600 } });
    if (!subRes.ok) {
      return NextResponse.json({ success: false, error: "Failed to fetch subtitle list" }, { status: 502 });
    }

    const subData = await subRes.json();
    const allSubs: any[] = subData.subtitles || [];

    // Filter Arabic tracks
    const arabicTracks = allSubs
      .filter((s) => s.lang === "ara" || s.lang === "ar" || s.language?.toLowerCase() === "arabic")
      .map((s, idx) => ({
        id: `ar-${idx + 1}`,
        label: `Arabic (العربية) #${idx + 1}`,
        lang: "ar",
        url: s.url,
      }));

    return NextResponse.json({
      success: true,
      imdbId,
      totalTracks: allSubs.length,
      arabicCount: arabicTracks.length,
      tracks: arabicTracks,
      defaultArabicUrl: arabicTracks.length > 0 ? arabicTracks[0].url : null,
    });
  } catch (err: any) {
    console.error("Subtitles API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
