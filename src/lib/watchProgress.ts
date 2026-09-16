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

export function getWatchHistory(): WatchItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
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
    const history = getWatchHistory();
    const duration = Math.max(1, item.duration || 1);
    const currentTime = Math.max(0, item.currentTime || 0);
    const progressPercent = Math.min(100, Math.round((currentTime / duration) * 100));

    // Don't save if progress is less than 5 seconds or over 98% (finished)
    if (currentTime < 5) return;

    const keySeason = item.season || 1;
    const keyEpisode = item.episode || 1;

    const filtered = history.filter(
      (h) => !(h.id === item.id && (h.season || 1) === keySeason && (h.episode || 1) === keyEpisode)
    );

    const newItem: WatchItem = {
      id: item.id,
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
  const history = getWatchHistory();
  return (
    history.find(
      (h) => h.id === id && (h.season || 1) === season && (h.episode || 1) === episode
    ) || null
  );
}

export function clearWatchItem(id: string, season = 1, episode = 1) {
  if (typeof window === "undefined") return;
  try {
    const history = getWatchHistory();
    const filtered = history.filter(
      (h) => !(h.id === id && (h.season || 1) === season && (h.episode || 1) === episode)
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
