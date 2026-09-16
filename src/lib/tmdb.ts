export interface UniversalItem {
  id: string;
  title: string;
  genre: string;
  releaseYear: number;
  videoUrl: string;
  thumbnailUrl: string;
  backdropUrl?: string | null;
  description: string;
  mediaType: "movie" | "tv";
  voteAverage?: number;
  category?: string;
}

const TMDB_KEY = process.env.TMDB_API_KEY || "4e44d9029b1270a757cddc766a1bcb63";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP = "https://image.tmdb.org/t/p/original";

// Genre dictionary for mapping genre_ids to clean readable genre names
const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

/**
 * Filter out Japanese anime to keep clean real-action films & western movies
 */
function isAnime(item: any): boolean {
  const isAnimation =
    (item.genre_ids && item.genre_ids.includes(16)) ||
    (item.genres && item.genres.some((g: any) => g.id === 16 || g.name === "Animation"));

  const isJapanese =
    item.original_language === "ja" ||
    (item.origin_country && item.origin_country.includes("JP"));

  return Boolean(isAnimation && isJapanese);
}

/**
 * Format a raw TMDb item into a UniversalItem
 */
function formatTmdbItem(item: any, forceType?: "movie" | "tv"): UniversalItem | null {
  if (!item || item.media_type === "person" || isAnime(item)) {
    return null;
  }

  const isTv = forceType === "tv" || item.media_type === "tv" || (!item.title && !!item.name);
  const title = item.title || item.name || "Untitled";
  const date = item.release_date || item.first_air_date || "";
  const releaseYear = date ? parseInt(date.slice(0, 4), 10) || 2024 : 2024;
  
  let genre = isTv ? "TV Series" : "Cinema";
  if (item.genres && item.genres.length > 0) {
    genre = isTv ? "TV Series" : item.genres[0].name;
  } else if (item.genre_ids && item.genre_ids.length > 0) {
    genre = isTv ? "TV Series" : (GENRE_MAP[item.genre_ids[0]] || "Cinema");
  }

  const id = isTv ? `tv-${item.id}` : String(item.id);
  const videoUrl = isTv ? `tv:${item.id}` : String(item.id);
  const thumbnailUrl = item.poster_path ? `${TMDB_IMG}${item.poster_path}` : "/placeholder.png";
  const backdropUrl = item.backdrop_path ? `${TMDB_BACKDROP}${item.backdrop_path}` : null;

  return {
    id,
    title,
    genre,
    releaseYear,
    videoUrl,
    thumbnailUrl,
    backdropUrl,
    description: item.overview || `Watch ${title} in 1080p Full HD on FilmologyX.`,
    mediaType: isTv ? "tv" : "movie",
    voteAverage: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 8.0,
    category: isTv ? "series" : "action",
  };
}

/**
 * Search the entire IMDb / TMDb global catalog of millions of movies & shows
 */
export async function searchUniversal(query: string, page: number = 1): Promise<UniversalItem[]> {
  if (!query || !query.trim()) return [];
  try {
    const res = await fetch(
      `${TMDB_BASE}/search/multi?query=${encodeURIComponent(query.trim())}&page=${page}&api_key=${TMDB_KEY}&include_adult=false`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];

    return data.results
      .map((item: any) => formatTmdbItem(item))
      .filter((item: UniversalItem | null): item is UniversalItem => item !== null && item.thumbnailUrl !== "/placeholder.png");
  } catch (err) {
    console.error("searchUniversal failed:", err);
    return [];
  }
}

/**
 * Get full details for ANY movie or TV show by TMDb ID or IMDb ID
 */
export async function getUniversalMovieOrShow(id: string): Promise<UniversalItem | null> {
  if (!id) return null;
  const clean = id.trim();

  // 1. Check if IMDb ID (e.g. tt0816692)
  if (/^tt\d+$/i.test(clean)) {
    try {
      const res = await fetch(
        `${TMDB_BASE}/find/${clean}?external_source=imdb_id&api_key=${TMDB_KEY}`,
        { next: { revalidate: 86400 } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.movie_results && data.movie_results.length > 0) {
          return formatTmdbItem(data.movie_results[0], "movie");
        }
        if (data.tv_results && data.tv_results.length > 0) {
          return formatTmdbItem(data.tv_results[0], "tv");
        }
      }
    } catch (e) {
      console.warn("IMDb ID resolve failed:", e);
    }
  }

  // 2. Check if explicit TV ID (e.g. tv-1396 or tv:1396)
  const isTvPrefix = clean.startsWith("tv-") || clean.startsWith("tv:");
  const numericId = clean.replace(/^tv[-:]/i, "");

  if (isTvPrefix) {
    try {
      const res = await fetch(
        `${TMDB_BASE}/tv/${numericId}?api_key=${TMDB_KEY}`,
        { next: { revalidate: 86400 } }
      );
      if (res.ok) {
        const data = await res.json();
        return formatTmdbItem(data, "tv");
      }
    } catch (e) {
      console.warn("TMDb TV resolve failed:", e);
    }
  }

  // 3. Try as Movie first
  if (/^\d+$/.test(numericId)) {
    try {
      const res = await fetch(
        `${TMDB_BASE}/movie/${numericId}?api_key=${TMDB_KEY}`,
        { next: { revalidate: 86400 } }
      );
      if (res.ok) {
        const data = await res.json();
        return formatTmdbItem(data, "movie");
      }
      // If movie returns 404, fallback to checking TV
      const tvRes = await fetch(
        `${TMDB_BASE}/tv/${numericId}?api_key=${TMDB_KEY}`,
        { next: { revalidate: 86400 } }
      );
      if (tvRes.ok) {
        const tvData = await tvRes.json();
        return formatTmdbItem(tvData, "tv");
      }
    } catch (e) {
      console.warn("TMDb numeric resolve failed:", e);
    }
  }

  return null;
}

/**
 * Get top trending movies worldwide
 */
export async function getTrendingMovies(page: number = 1): Promise<UniversalItem[]> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/trending/movie/week?api_key=${TMDB_KEY}&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    return data.results
      .map((item: any) => formatTmdbItem(item, "movie"))
      .filter((item: UniversalItem | null): item is UniversalItem => item !== null);
  } catch {
    return [];
  }
}

/**
 * Get top rated cinema masterpieces
 */
export async function getTopRatedMovies(page: number = 1): Promise<UniversalItem[]> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/movie/top_rated?api_key=${TMDB_KEY}&page=${page}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    return data.results
      .map((item: any) => formatTmdbItem(item, "movie"))
      .filter((item: UniversalItem | null): item is UniversalItem => item !== null);
  } catch {
    return [];
  }
}

/**
 * Get popular blockbuster movies
 */
export async function getPopularMovies(page: number = 1): Promise<UniversalItem[]> {
  try {
    const res = await fetch(
      `${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    return data.results
      .map((item: any) => formatTmdbItem(item, "movie"))
      .filter((item: UniversalItem | null): item is UniversalItem => item !== null);
  } catch {
    return [];
  }
}

/**
 * Discover movies or TV shows across any genre / category
 */
export async function discoverByFilter(category: string = "all", page: number = 1): Promise<UniversalItem[]> {
  try {
    let url = "";
    if (category === "series") {
      url = `${TMDB_BASE}/discover/tv?api_key=${TMDB_KEY}&sort_by=popularity.desc&page=${page}&include_adult=false`;
    } else if (category === "arabic") {
      url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&with_original_language=ar&sort_by=popularity.desc&page=${page}&include_adult=false`;
    } else if (category === "action") {
      url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&with_genres=28&sort_by=popularity.desc&page=${page}&include_adult=false`;
    } else if (category === "scifi") {
      url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&with_genres=878&sort_by=popularity.desc&page=${page}&include_adult=false`;
    } else if (category === "horror") {
      url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&with_genres=27&sort_by=popularity.desc&page=${page}&include_adult=false`;
    } else if (category === "comedy") {
      url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&with_genres=35&sort_by=popularity.desc&page=${page}&include_adult=false`;
    } else if (category === "drama") {
      url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&with_genres=18&sort_by=popularity.desc&page=${page}&include_adult=false`;
    } else if (category === "romance") {
      url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&with_genres=10749&sort_by=popularity.desc&page=${page}&include_adult=false`;
    } else if (category === "imdb_trending") {
      url = `${TMDB_BASE}/trending/movie/week?api_key=${TMDB_KEY}&page=${page}`;
    } else if (category === "imdb_top") {
      url = `${TMDB_BASE}/movie/top_rated?api_key=${TMDB_KEY}&page=${page}`;
    } else {
      url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&sort_by=popularity.desc&page=${page}&include_adult=false`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];

    const isTv = category === "series";
    return data.results
      .map((item: any) => formatTmdbItem(item, isTv ? "tv" : "movie"))
      .filter((item: UniversalItem | null): item is UniversalItem => item !== null && item.thumbnailUrl !== "/placeholder.png");
  } catch (err) {
    console.error("discoverByFilter error:", err);
    return [];
  }
}

/**
 * Backward-compatible exports for admin actions
 */
export async function fetchTrendingFromTmdb(apiKey?: string, limit: number = 20): Promise<UniversalItem[]> {
  const items = await getTrendingMovies(1);
  return items.slice(0, limit);
}

export async function fetchFromTmdbById(id: string, apiKey?: string): Promise<UniversalItem | null> {
  return await getUniversalMovieOrShow(id);
}

export async function searchTmdb(query: string, apiKey?: string): Promise<UniversalItem[]> {
  return await searchUniversal(query);
}

