import { NextRequest, NextResponse } from "next/server";

const TMDB_KEY = process.env.TMDB_API_KEY || "4e44d9029b1270a757cddc766a1bcb63";
const TMDB_BASE = "https://api.themoviedb.org/3";

const FETCH_OPTS = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.google.com/",
  },
};

// ─── TMDb helpers ────────────────────────────────────────────────────────────

async function getImdbId(tmdbId: string, isTv: boolean): Promise<string | null> {
  try {
    const endpoint = isTv
      ? `${TMDB_BASE}/tv/${tmdbId}/external_ids?api_key=${TMDB_KEY}`
      : `${TMDB_BASE}/movie/${tmdbId}/external_ids?api_key=${TMDB_KEY}`;
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const data = await res.json();
      return data.imdb_id || null;
    }
  } catch {}
  return null;
}

// ─── Stream extractors ────────────────────────────────────────────────────────

/** Extract direct URL from an HTML page by scanning for .m3u8 / .mp4 */
function extractUrlFromHtml(html: string): { url: string; type: string } | null {
  // Priority: .m3u8 (HLS adaptive) > .mp4
  const m3u8 = html.match(/https?:\/\/[^"'\s,]+\.m3u8[^"'\s,]*/);
  if (m3u8) return { url: m3u8[0], type: "application/x-mpegURL" };
  const mp4 = html.match(/https?:\/\/[^"'\s,]+\.mp4[^"'\s,]*/);
  if (mp4) return { url: mp4[0], type: "video/mp4" };
  return null;
}

/**
 * Provider 1: VidSrc.xyz — known JSON API
 * GET https://vidsrc.xyz/embed/movie/{imdbId}  (also supports tv/{imdbId}/{s}/{e})
 * The page exposes a __NEXT_DATA__ or sources array we can parse.
 */
async function tryVidSrcXyz(
  imdbId: string,
  isTv: boolean,
  season: number,
  episode: number
): Promise<{ url: string; type: string } | null> {
  const embedUrl = isTv
    ? `https://vidsrc.xyz/embed/tv/${imdbId}/${season}/${episode}`
    : `https://vidsrc.xyz/embed/movie/${imdbId}`;
  try {
    const res = await fetch(embedUrl, {
      ...FETCH_OPTS,
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    return extractUrlFromHtml(html);
  } catch {
    return null;
  }
}

/**
 * Provider 2: VidSrc.to  (uses a sources endpoint)
 * GET https://vidsrc.to/embed/movie/{imdbId}
 */
async function tryVidSrcTo(
  imdbId: string,
  isTv: boolean,
  season: number,
  episode: number
): Promise<{ url: string; type: string } | null> {
  const embedUrl = isTv
    ? `https://vidsrc.to/embed/tv/${imdbId}/${season}/${episode}`
    : `https://vidsrc.to/embed/movie/${imdbId}`;
  try {
    const res = await fetch(embedUrl, {
      ...FETCH_OPTS,
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    return extractUrlFromHtml(html);
  } catch {
    return null;
  }
}

/**
 * Provider 3: VidSrc.me  (classic reliable API)
 */
async function tryVidSrcMe(
  imdbId: string,
  isTv: boolean,
  season: number,
  episode: number
): Promise<{ url: string; type: string } | null> {
  const embedUrl = isTv
    ? `https://vidsrc.me/embed/tv?imdb=${imdbId}&season=${season}&episode=${episode}`
    : `https://vidsrc.me/embed/movie?imdb=${imdbId}`;
  try {
    const res = await fetch(embedUrl, {
      ...FETCH_OPTS,
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    return extractUrlFromHtml(html);
  } catch {
    return null;
  }
}

/**
 * Provider 4: Embed.su  — often has clean HLS streams
 * GET https://embed.su/embed/movie/{imdbId}
 */
async function tryEmbedSu(
  imdbId: string,
  isTv: boolean,
  season: number,
  episode: number
): Promise<{ url: string; type: string } | null> {
  const embedUrl = isTv
    ? `https://embed.su/embed/tv/${imdbId}/${season}/${episode}`
    : `https://embed.su/embed/movie/${imdbId}`;
  try {
    const res = await fetch(embedUrl, {
      ...FETCH_OPTS,
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    return extractUrlFromHtml(html);
  } catch {
    return null;
  }
}

/**
 * Provider 5: SuperEmbed via embed.smashystream.com
 */
async function trySmashyStream(
  tmdbId: string,
  isTv: boolean,
  season: number,
  episode: number
): Promise<{ url: string; type: string } | null> {
  const embedUrl = isTv
    ? `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}&season=${season}&episode=${episode}`
    : `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`;
  try {
    const res = await fetch(embedUrl, {
      ...FETCH_OPTS,
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    return extractUrlFromHtml(html);
  } catch {
    return null;
  }
}

/**
 * Provider 6: VidSrc.in  (alternate domain, same protocol as vidsrc.me)
 */
async function tryVidSrcIn(
  imdbId: string,
  isTv: boolean,
  season: number,
  episode: number
): Promise<{ url: string; type: string } | null> {
  const embedUrl = isTv
    ? `https://vidsrc.in/embed/tv?imdb=${imdbId}&season=${season}&episode=${episode}`
    : `https://vidsrc.in/embed/movie?imdb=${imdbId}`;
  try {
    const res = await fetch(embedUrl, {
      ...FETCH_OPTS,
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    return extractUrlFromHtml(html);
  } catch {
    return null;
  }
}

// ─── Main route handler ───────────────────────────────────────────────────────

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

  // Strip any "tv-" or "tv:" prefix to get numeric TMDb ID
  let tmdbId = rawId
    .replace(/^tv[-:]/i, "")
    .replace(/^tv%3A/i, "");

  // Resolve IMDb ID from TMDb
  const isImdb = /^tt\d+$/i.test(rawId);
  let imdbId = isImdb ? rawId : await getImdbId(tmdbId, isTv);

  if (!imdbId && !isImdb) {
    // Try one more time treating the raw id differently
    imdbId = await getImdbId(rawId, isTv);
  }

  // Run IMDb-based providers in parallel (they need the tt ID)
  // and TMDb-based providers separately
  const imdbProviders: Array<Promise<{ url: string; type: string } | null>> = imdbId
    ? [
        tryVidSrcXyz(imdbId, isTv, season, episode),
        tryVidSrcTo(imdbId, isTv, season, episode),
        tryVidSrcMe(imdbId, isTv, season, episode),
        tryEmbedSu(imdbId, isTv, season, episode),
        tryVidSrcIn(imdbId, isTv, season, episode),
      ]
    : [];

  const tmdbProviders: Array<Promise<{ url: string; type: string } | null>> = [
    trySmashyStream(tmdbId, isTv, season, episode),
  ];

  // Race all providers — take the first non-null result
  const results = await Promise.allSettled([...imdbProviders, ...tmdbProviders]);

  let stream: { url: string; type: string } | null = null;
  for (const r of results) {
    if (r.status === "fulfilled" && r.value) {
      stream = r.value;
      break;
    }
  }

  if (!stream) {
    return NextResponse.json(
      { success: false, error: "No stream found", imdbId, tmdbId },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, imdbId, tmdbId, ...stream });
}
