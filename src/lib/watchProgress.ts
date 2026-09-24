export interface WatchItem {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  currentTime: number; // in seconds
  duration: number; // in seconds
  progressPercent: number;
  genre?: string;
  season?: number;
  episode?: number;
  updatedAt: number; // timestamp
}

const STORAGE_KEY = "filmologyx_watch_history_v1";

export function normalizeWatchId(id: string): string {
  if (!id) return id;
  let clean = id.trim();
  try {
    clean = decodeURIComponent(clean);
  } catch {}
  return clean.replace(/%3a/gi, ":").replace(/^tv:/i, "tv-");
}

export function getWatchHistory(): WatchItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed: WatchItem[] = JSON.parse(data);
    // Auto-migrate legacy items that were stored with 'tv:...' to 'tv-...'
    return parsed.map((item) => ({
      ...item,
      id: normalizeWatchId(item.id),
    }));
  } catch {
    return [];
  }
}

export function saveWatchProgress(item: {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  currentTime: number;
  duration: number;
  genre?: string;
  season?: number;
  episode?: number;
}) {
  if (typeof window === "undefined" || !item.id) return;
  try {
    const cleanId = normalizeWatchId(item.id);
    const history = getWatchHistory();
    const duration = Math.max(1, item.duration || 1);
    const currentTime = Math.max(0, item.currentTime || 0);
    const progressPercent = Math.min(100, Math.round((currentTime / duration) * 100));

    // Don't save if progress is less than 5 seconds or over 98% (finished)
    if (currentTime < 5) return;

    const keySeason = item.season || 1;
    const keyEpisode = item.episode || 1;

    const filtered = history.filter(
      (h) => !(normalizeWatchId(h.id) === cleanId && (h.season || 1) === keySeason && (h.episode || 1) === keyEpisode)
    );

    const newItem: WatchItem = {
      id: cleanId,
      title: item.title,
      thumbnailUrl: item.thumbnailUrl,
      currentTime,
      duration,
      progressPercent: progressPercent >= 95 ? 100 : progressPercent,
      genre: item.genre,
      season: item.season,
      episode: item.episode,
      updatedAt: Date.now(),
    };

    filtered.unshift(newItem);
    // Keep max 30 recent items
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 30)));
  } catch {}
}

export function getWatchProgress(id: string, season = 1, episode = 1): WatchItem | null {
  const cleanId = normalizeWatchId(id);
  const history = getWatchHistory();
  return (
    history.find(
      (h) => normalizeWatchId(h.id) === cleanId && (h.season || 1) === season && (h.episode || 1) === episode
    ) || null
  );
}

export function clearWatchItem(id: string, season = 1, episode = 1) {
  if (typeof window === "undefined") return;
  try {
    const cleanId = normalizeWatchId(id);
    const history = getWatchHistory();
    const filtered = history.filter(
      (h) => !(normalizeWatchId(h.id) === cleanId && (h.season || 1) === season && (h.episode || 1) === episode)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {}
}

export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "00:00";
  const totalMins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
