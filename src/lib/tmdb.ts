export interface MovieImportData {
  title: string;
  genre: string;
  releaseYear: number;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
}

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
  37: "Western"
};

export async function fetchFromTmdbById(id: string, apiKey?: string): Promise<MovieImportData | null> {
  const token = apiKey || process.env.TMDB_API_KEY;
  if (!token) return null;

  try {
    const isBearer = token.length > 50;
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const headers: Record<string, string> = { "accept": "application/json" };
    
    let fetchUrl = url;
    if (isBearer) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      fetchUrl = `${url}?api_key=${token}`;
    }

    const res = await fetch(fetchUrl, { headers });
    if (!res.ok) return null;

    const data = await res.json();
    const releaseYear = data.release_date ? new Date(data.release_date).getFullYear() : new Date().getFullYear();
    const genre = data.genres && data.genres.length > 0 ? data.genres[0].name : "General";
    const thumbnailUrl = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "";

    return {
      title: data.title,
      genre,
      releaseYear,
      videoUrl: String(data.id),
      thumbnailUrl,
      description: data.overview || "No description provided."
    };
  } catch (error) {
    console.error("Error fetching from TMDB by ID:", error);
    return null;
  }
}

export async function fetchTrendingFromTmdb(apiKey?: string, count: number = 20): Promise<MovieImportData[]> {
  const token = apiKey || process.env.TMDB_API_KEY;
  if (!token) return [];

  try {
    const isBearer = token.length > 50;
    const url = `https://api.themoviedb.org/3/trending/movie/week`;
    const headers: Record<string, string> = { "accept": "application/json" };
    
    let fetchUrl = url;
    if (isBearer) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      fetchUrl = `${url}?api_key=${token}`;
    }

    const res = await fetch(fetchUrl, { headers });
    if (!res.ok) return [];

    const data = await res.json();
    const results = data.results || [];

    return results.slice(0, count).map((item: any) => {
      const releaseYear = item.release_date ? new Date(item.release_date).getFullYear() : new Date().getFullYear();
      const genreId = item.genre_ids && item.genre_ids[0];
      const genre = (genreId && GENRE_MAP[genreId]) || "General";
      const thumbnailUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "";

      return {
        title: item.title,
        genre,
        releaseYear,
        videoUrl: String(item.id),
        thumbnailUrl,
        description: item.overview || "No description provided."
      };
    });
  } catch (error) {
    console.error("Error fetching trending from TMDB:", error);
    return [];
  }
}

export async function searchTmdb(query: string, apiKey?: string): Promise<MovieImportData[]> {
  const token = apiKey || process.env.TMDB_API_KEY;
  if (!token) return [];

  try {
    const isBearer = token.length > 50;
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`;
    const headers: Record<string, string> = { "accept": "application/json" };
    
    let fetchUrl = url;
    if (isBearer) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      fetchUrl = `${url}&api_key=${token}`;
    }

    const res = await fetch(fetchUrl, { headers });
    if (!res.ok) return [];

    const data = await res.json();
    const results = data.results || [];

    return results.slice(0, 10).map((item: any) => {
      const releaseYear = item.release_date ? new Date(item.release_date).getFullYear() : new Date().getFullYear();
      const genreId = item.genre_ids && item.genre_ids[0];
      const genre = (genreId && GENRE_MAP[genreId]) || "General";
      const thumbnailUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "";

      return {
        title: item.title,
        genre,
        releaseYear,
        videoUrl: String(item.id),
        thumbnailUrl,
        description: item.overview || "No description provided."
      };
    });
  } catch (error) {
    console.error("Error searching TMDB:", error);
    return [];
  }
}
