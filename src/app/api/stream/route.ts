import { NextRequest, NextResponse } from "next/server";

const TMDB_KEY = process.env.TMDB_API_KEY || "4e44d9029b1270a757cddc766a1bcb63";
const TMDB_BASE = "https://api.themoviedb.org/3";

async function getImdbId(tmdbId: string, isTv: boolean): Promise<string | null> {
  try {
    const endpoint = isTv
      ? `${TMDB_BASE}/tv/${tmdbId}/external_ids?api_key=${TMDB_KEY}`
      : `${TMDB_BASE}/movie/${tmdbId}?api_key=${TMDB_KEY}`;
    const res = await fetch(endpoint);
    if (res.ok) {
      const data = await res.json();
      return data.imdb_id || null;
    }
  } catch {}
  return null;
}

async function tryVidsrcExtract(imdbId: string, isTv: boolean, season: number, episode: number) {
  // vidsrc.me embed pages — we fetch and extract the source iframe/stream
  const embedUrl = isTv
    ? `https://vidsrc.me/embed/tv?imdb=${imdbId}&season=${season}&episode=${episode}`
    : `https://vidsrc.me/embed/movie?imdb=${imdbId}`;
  try {
    const res = await fetch(embedUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    // Look for .m3u8 or direct mp4 in the response
    const m3u8Match = html.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/);
    if (m3u8Match) return { url: m3u8Match[0], type: "application/x-mpegURL" };
    const mp4Match = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/);
    if (mp4Match) return { url: mp4Match[0], type: "video/mp4" };
  } catch {}
  return null;
}

async function tryConsumetFlixhq(imdbId: string, isTv: boolean, season: number, episode: number) {
  // Consumet API - tries to get stream URL from FlixHQ via IMDb ID
  try {
    const infoUrl = `https://api.consumet.org/movies/flixhq/info?id=${imdbId}`;
    const infoRes = await fetch(infoUrl, { signal: AbortSignal.timeout(10000) });
    if (!infoRes.ok) return null;
    const info = await infoRes.json();

    let episodeId: string | null = null;
    let mediaId = info.id;

    if (isTv) {
      const seasons = info.seasons || [];
      const seasonData = seasons.find((s: any) => s.season === season);
      if (!seasonData) return null;
      const ep = seasonData.episodes?.find((e: any) => e.number === episode);
      episodeId = ep?.id || null;
    } else {
      episodeId = info.episodes?.[0]?.id || null;
    }

    if (!episodeId || !mediaId) return null;

    const watchUrl = `https://api.consumet.org/movies/flixhq/watch?episodeId=${encodeURIComponent(episodeId)}&mediaId=${encodeURIComponent(mediaId)}&server=vidcloud`;
    const watchRes = await fetch(watchUrl, { signal: AbortSignal.timeout(10000) });
    if (!watchRes.ok) return null;
    const watchData = await watchRes.json();

    const sources: any[] = watchData.sources || [];
    // Prefer m3u8 quality
    const m3u8 = sources.find((s) => s.url?.includes(".m3u8")) || sources[0];
    if (!m3u8?.url) return null;

    return { url: m3u8.url, type: m3u8.isM3U8 ? "application/x-mpegURL" : "video/mp4" };
  } catch {}
  return null;
}

async function tryVidSrcIcu(imdbId: string, isTv: boolean, season: number, episode: number) {
  // vidsrc.icu provides stream data in JSON
  try {
    const apiUrl = isTv
      ? `https://vidsrc.icu/api/movie/${imdbId}/${season}/${episode}`
      : `https://vidsrc.icu/api/movie/${imdbId}`;
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json();
    const url = data?.url || data?.stream || data?.sources?.[0]?.file;
    if (!url) return null;
    const type = url.includes(".m3u8") ? "application/x-mpegURL" : "video/mp4";
    return { url, type };
  } catch {}
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawId = searchParams.get("id") || "";
  const type = searchParams.get("type") || "movie";
  const season = parseInt(searchParams.get("season") || "1", 10) || 1;
  const episode = parseInt(searchParams.get("episode") || "1", 10) || 1;

  if (!rawId) {
    return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
  }

  const isTv = type === "tv" || type === "series";
  let imdbId = /^tt\d+$/i.test(rawId) ? rawId : await getImdbId(rawId, isTv);

  if (!imdbId) {
    return NextResponse.json({ success: false, error: "Could not resolve IMDb ID" }, { status: 404 });
  }

  // Try multiple providers in order
  const stream =
    (await tryConsumetFlixhq(imdbId, isTv, season, episode)) ||
    (await tryVidSrcIcu(imdbId, isTv, season, episode)) ||
    (await tryVidsrcExtract(imdbId, isTv, season, episode));

  if (!stream) {
    return NextResponse.json({ success: false, error: "No stream found", imdbId }, { status: 404 });
  }

  return NextResponse.json({ success: true, imdbId, ...stream });
}
