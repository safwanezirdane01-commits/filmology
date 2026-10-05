"use client";

import { useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

export default function CatalogSortBar({
  currentSort = "popular",
  basePath = "/movies",
  currentGenre = "all",
}: {
  currentSort?: string;
  basePath?: string;
  currentGenre?: string;
}) {
  const router = useRouter();

  const handleSortChange = (newSort: string) => {
    router.push(`${basePath}?genre=${encodeURIComponent(currentGenre)}&page=1&sort=${encodeURIComponent(newSort)}`);
  };

  return (
    <div className="flex items-center space-x-2 shrink-0">
      <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-medium bg-slate-900/90 border border-purple-500/30 px-3 py-1.5 rounded-full shadow-sm hover:border-purple-500/50 transition-colors">
        <ArrowUpDown className="w-3.5 h-3.5 text-rose-400" />
        <span className="hidden sm:inline text-slate-400">Sort by:</span>
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
        >
          <option value="popular" className="bg-slate-900 text-white">Most Popular</option>
          <option value="rating" className="bg-slate-900 text-white">Highest Rated (IMDb)</option>
          <option value="year" className="bg-slate-900 text-white">Newest Releases</option>
          <option value="title" className="bg-slate-900 text-white">Title (A - Z)</option>
        </select>
      </div>
    </div>
  );
}
