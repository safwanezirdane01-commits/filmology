export interface SeriesSeasonInfo {
  season: number;
  episodesCount: number;
}

export interface SeriesMeta {
  title: string;
  tmdbId: string;
  totalSeasons: number;
  seasons: Record<number, number>; // seasonNumber -> episodeCount
}

// Complete, verified season & episode counts for real TV series (NO ANIME)
export const SERIES_METADATA: Record<string, SeriesMeta> = {
  // Breaking Bad (5 seasons)
  "1396": {
    title: "Breaking Bad",
    tmdbId: "1396",
    totalSeasons: 5,
    seasons: { 1: 7, 2: 13, 3: 13, 4: 13, 5: 16 },
  },
  // Better Call Saul (6 seasons)
  "60059": {
    title: "Better Call Saul",
    tmdbId: "60059",
    totalSeasons: 6,
    seasons: { 1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 13 },
  },
  // Game of Thrones (8 seasons)
  "1399": {
    title: "Game of Thrones",
    tmdbId: "1399",
    totalSeasons: 8,
    seasons: { 1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 10, 7: 7, 8: 6 },
  },
  // Stranger Things (4 seasons)
  "66732": {
    title: "Stranger Things",
    tmdbId: "66732",
    totalSeasons: 4,
    seasons: { 1: 8, 2: 9, 3: 8, 4: 9 },
  },
  // Peaky Blinders (6 seasons)
  "60574": {
    title: "Peaky Blinders",
    tmdbId: "60574",
    totalSeasons: 6,
    seasons: { 1: 6, 2: 6, 3: 6, 4: 6, 5: 6, 6: 6 },
  },
  // The Last of Us (1 season)
  "100088": {
    title: "The Last of Us",
    tmdbId: "100088",
    totalSeasons: 1,
    seasons: { 1: 9 },
  },
  // Arcane (2 seasons)
  "94605": {
    title: "Arcane",
    tmdbId: "94605",
    totalSeasons: 2,
    seasons: { 1: 9, 2: 9 },
  },
  // Wednesday (1 season)
  "119051": {
    title: "Wednesday",
    tmdbId: "119051",
    totalSeasons: 1,
    seasons: { 1: 8 },
  },
  // Squid Game (2 seasons)
  "93405": {
    title: "Squid Game",
    tmdbId: "93405",
    totalSeasons: 2,
    seasons: { 1: 9, 2: 7 },
  },
  // The Witcher (3 seasons)
  "71912": {
    title: "The Witcher",
    tmdbId: "71912",
    totalSeasons: 3,
    seasons: { 1: 8, 2: 8, 3: 8 },
  },
  // House of the Dragon (2 seasons)
  "94997": {
    title: "House of the Dragon",
    tmdbId: "94997",
    totalSeasons: 2,
    seasons: { 1: 10, 2: 8 },
  },
  // Loki (2 seasons)
  "84958": {
    title: "Loki",
    tmdbId: "84958",
    totalSeasons: 2,
    seasons: { 1: 6, 2: 6 },
  },
  // The Mandalorian (3 seasons)
  "82856": {
    title: "The Mandalorian",
    tmdbId: "82856",
    totalSeasons: 3,
    seasons: { 1: 8, 2: 8, 3: 8 },
  },
  // Money Heist (5 seasons)
  "71446": {
    title: "Money Heist",
    tmdbId: "71446",
    totalSeasons: 5,
    seasons: { 1: 9, 2: 6, 3: 8, 4: 8, 5: 10 },
  },
  // Dark (3 seasons)
  "70523": {
    title: "Dark",
    tmdbId: "70523",
    totalSeasons: 3,
    seasons: { 1: 10, 2: 8, 3: 8 },
  },
  // Narcos (3 seasons)
  "63351": {
    title: "Narcos",
    tmdbId: "63351",
    totalSeasons: 3,
    seasons: { 1: 10, 2: 10, 3: 10 },
  },
  // Chernobyl (1 season)
  "87108": {
    title: "Chernobyl",
    tmdbId: "87108",
    totalSeasons: 1,
    seasons: { 1: 5 },
  },
  // The Boys (4 seasons)
  "76479": {
    title: "The Boys",
    tmdbId: "76479",
    totalSeasons: 4,
    seasons: { 1: 8, 2: 8, 3: 8, 4: 8 },
  },
  // Invincible (2 seasons)
  "95557": {
    title: "Invincible",
    tmdbId: "95557",
    totalSeasons: 2,
    seasons: { 1: 8, 2: 8 },
  },
  // Prison Break (5 seasons)
  "2288": {
    title: "Prison Break",
    tmdbId: "2288",
    totalSeasons: 5,
    seasons: { 1: 22, 2: 22, 3: 13, 4: 24, 5: 9 },
  },
  // The Walking Dead (11 seasons)
  "1402": {
    title: "The Walking Dead",
    tmdbId: "1402",
    totalSeasons: 11,
    seasons: { 1: 6, 2: 13, 3: 16, 4: 16, 5: 16, 6: 16, 7: 16, 8: 16, 9: 16, 10: 22, 11: 24 },
  },
  // Friends (10 seasons)
  "1668": {
    title: "Friends",
    tmdbId: "1668",
    totalSeasons: 10,
    seasons: { 1: 24, 2: 24, 3: 25, 4: 24, 5: 24, 6: 25, 7: 24, 8: 24, 9: 24, 10: 18 },
  },
  // The Office (US) (9 seasons)
  "2316": {
    title: "The Office",
    tmdbId: "2316",
    totalSeasons: 9,
    seasons: { 1: 6, 2: 22, 3: 25, 4: 19, 5: 28, 6: 26, 7: 26, 8: 24, 9: 25 },
  },
  // Dexter (8 seasons)
  "1405": {
    title: "Dexter",
    tmdbId: "1405",
    totalSeasons: 8,
    seasons: { 1: 12, 2: 12, 3: 12, 4: 12, 5: 12, 6: 12, 7: 12, 8: 12 },
  },
  // Vikings (6 seasons)
  "44217": {
    title: "Vikings",
    tmdbId: "44217",
    totalSeasons: 6,
    seasons: { 1: 9, 2: 10, 3: 10, 4: 20, 5: 20, 6: 20 },
  },
  // Suits (9 seasons)
  "37680": {
    title: "Suits",
    tmdbId: "37680",
    totalSeasons: 9,
    seasons: { 1: 12, 2: 16, 3: 16, 4: 16, 5: 16, 6: 16, 7: 16, 8: 16, 9: 10 },
  },
  // Shogun (1 season)
  "126308": {
    title: "Shogun",
    tmdbId: "126308",
    totalSeasons: 1,
    seasons: { 1: 10 },
  },
  // Fallout (1 season)
  "106379": {
    title: "Fallout",
    tmdbId: "106379",
    totalSeasons: 1,
    seasons: { 1: 8 },
  },
};

/**
 * Clean a videoUrl or TMDb ID string to get the pure TV ID
 */
export function extractTvId(videoUrlOrId: string): string {
  let clean = videoUrlOrId.trim();
  if (clean.startsWith("tv:")) {
    clean = clean.replace("tv:", "").trim();
  }
  return clean;
}

/**
 * Check whether a videoUrl or genre represents a real TV series (never a movie)
 */
export function isRealSeries(videoUrlOrId: string | null | undefined, genre?: string): boolean {
  if (!videoUrlOrId) return false;
  const trimmed = videoUrlOrId.trim();
  if (trimmed.startsWith("tv:")) return true;
  if (genre && /series|show/i.test(genre)) return true;
  return false;
}

/**
 * Get series seasons and episode info.
 * Returns NULL for movies so regular movies NEVER show fake seasons or episode pickers!
 */
export function getSeriesMetadata(videoUrlOrId: string | null | undefined, genre?: string): SeriesMeta | null {
  if (!videoUrlOrId) return null;
  const isSeries = isRealSeries(videoUrlOrId, genre);
  if (!isSeries) {
    // It is a MOVIE, return null immediately so movies never have season controls!
    return null;
  }

  const tvId = extractTvId(videoUrlOrId);
  if (SERIES_METADATA[tvId]) {
    return SERIES_METADATA[tvId];
  }

  // Fallback for custom added TV series (only when explicitly a series)
  return {
    title: "Series",
    tmdbId: tvId,
    totalSeasons: 1, // Start with real 1 season, never fake 10!
    seasons: { 1: 10 },
  };
}

/**
 * Get episode count for a specific season
 */
export function getEpisodesForSeason(videoUrlOrId: string | null | undefined, season: number, genre?: string): number {
  const meta = getSeriesMetadata(videoUrlOrId, genre);
  if (!meta) return 0;
  return meta.seasons[season] || 10;
}
