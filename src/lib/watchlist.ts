export interface SavedWatchItem {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  genre?: string;
  releaseYear?: number;
  addedAt?: number;
}

const STORAGE_KEY = "filmologyx_saved_watchlist_v1";

export function getSavedWatchlist(): SavedWatchItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function isItemInWatchlist(id: string): boolean {
  if (typeof window === "undefined" || !id) return false;
  const list = getSavedWatchlist();
  const clean = id.trim().toLowerCase();
  return list.some((item) => item.id.trim().toLowerCase() === clean);
}

export function toggleSavedWatchlist(item: SavedWatchItem): boolean {
  if (typeof window === "undefined" || !item.id) return false;
  try {
    const list = getSavedWatchlist();
    const cleanId = item.id.trim().toLowerCase();
    const exists = list.some((i) => i.id.trim().toLowerCase() === cleanId);

    let updated: SavedWatchItem[];
    let added = false;

    if (exists) {
      updated = list.filter((i) => i.id.trim().toLowerCase() !== cleanId);
    } else {
      updated = [
        {
          id: item.id,
          title: item.title,
          thumbnailUrl: item.thumbnailUrl || null,
          genre: item.genre,
          releaseYear: item.releaseYear,
          addedAt: Date.now(),
        },
        ...list,
      ];
      added = true;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("filmologyx_watchlist_updated"));

    // Also attempt server sync if logged in (non-blocking)
    try {
      fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: item.id, action: added ? "add" : "remove" }),
      }).catch(() => {});
    } catch {}

    return added;
  } catch {
    return false;
  }
}
