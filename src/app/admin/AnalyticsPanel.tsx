"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Eye, 
  Film, 
  Smartphone, 
  Monitor, 
  Compass, 
  RefreshCw, 
  DollarSign, 
  Activity, 
  Clock, 
  TrendingUp,
  Trash2,
  ShieldCheck
} from "lucide-react";
import { AnalyticsSummary } from "@/lib/analytics";

export default function AnalyticsPanel({
  initialData,
}: {
  initialData?: AnalyticsSummary;
}) {
  const [data, setData] = useState<AnalyticsSummary | null>(initialData || null);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>("Just now");
  const [isExcluded, setIsExcluded] = useState<boolean>(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastRefreshed(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically exclude admin device on this browser
    try {
      const stored = localStorage.getItem("filmology_exclude_analytics");
      if (stored === null || stored === "true") {
        localStorage.setItem("filmology_exclude_analytics", "true");
        document.cookie = "filmology_exclude_analytics=1; path=/; max-age=31536000; SameSite=Lax";
        setIsExcluded(true);
      } else {
        setIsExcluded(false);
      }
    } catch {}

    if (!initialData) {
      fetchStats();
    }
    // Auto-refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleExclusion = () => {
    const next = !isExcluded;
    setIsExcluded(next);
    try {
      if (next) {
        localStorage.setItem("filmology_exclude_analytics", "true");
        document.cookie = "filmology_exclude_analytics=1; path=/; max-age=31536000; SameSite=Lax";
      } else {
        localStorage.setItem("filmology_exclude_analytics", "false");
        document.cookie = "filmology_exclude_analytics=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    } catch {}
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset analytics test data?")) return;
    try {
      await fetch("/api/analytics", { method: "DELETE" });
      fetchStats();
    } catch {}
  };

  if (!data) {
    return (
      <div className="bg-slate-900/60 border border-purple-900/40 p-8 rounded-3xl backdrop-blur-xl shadow-xl flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
        <span className="ml-3 text-slate-300 text-sm font-semibold">Loading live analytics...</span>
      </div>
    );
  }

  const totalDeviceVisits = (data.devices.mobile || 0) + (data.devices.desktop || 0) + (data.devices.tablet || 0);
  const mobilePct = totalDeviceVisits > 0 ? Math.round(((data.devices.mobile || 0) / totalDeviceVisits) * 100) : 0;
  const desktopPct = totalDeviceVisits > 0 ? Math.round(((data.devices.desktop || 0) / totalDeviceVisits) * 100) : 0;

  // Estimate Monetag ad impressions (each unique visit triggers ~2-3 ad gate clicks)
  const estimatedAdClicks = Math.round(data.totalViews * 2.5);

  return (
    <div className="bg-slate-900/60 border border-purple-900/40 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 sm:space-y-8">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-900/30 pb-5">
        <div>
          <div className="flex items-center space-x-2.5 mb-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live Telemetry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-rose-400" />
            <span>Site Traffic & Visitor Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of page views, audience devices, referral sources, and streamed titles.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-purple-500/20 text-xs font-semibold transition-all shadow"
            title="Refresh now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-rose-400" : ""}`} />
            <span>{loading ? "Updating..." : `Refreshed ${lastRefreshed}`}</span>
          </button>
          <button
            type="button"
            onClick={toggleExclusion}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow ${
              isExcluded
                ? "bg-emerald-900/50 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/70"
                : "bg-slate-800/80 border-purple-500/20 text-slate-400 hover:text-white"
            }`}
            title={isExcluded ? "Your device is excluded from analytics" : "Click to exclude your device from analytics"}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isExcluded ? "My device excluded" : "Exclude my device"}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border border-purple-500/20 text-xs transition-all"
            title="Reset stats counter"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Page Views */}
        <div className="bg-slate-950/80 border border-purple-500/20 p-4 rounded-2xl relative overflow-hidden shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Views</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {data.totalViews.toLocaleString()}
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-semibold mt-1.5">
            <TrendingUp className="w-3 h-3" />
            <span>+{data.todayViews} today</span>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-slate-950/80 border border-purple-500/20 p-4 rounded-2xl relative overflow-hidden shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Unique Visitors</span>
            <Users className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {data.uniqueVisitors.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5">
            Distinct devices & browsers
          </div>
        </div>

        {/* Top Streamed Title */}
        <div className="bg-slate-950/80 border border-purple-500/20 p-4 rounded-2xl relative overflow-hidden shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Top Movie</span>
            <Film className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white truncate" title={data.topMovies[0]?.title || "None"}>
            {data.topMovies[0]?.title || "None yet"}
          </div>
          <div className="text-[11px] text-amber-300 font-semibold mt-1.5">
            {data.topMovies[0] ? `${data.topMovies[0].views} views recorded` : "Waiting for streams"}
          </div>
        </div>

        {/* Est. Monetag Ad Triggers */}
        <div className="bg-slate-950/80 border border-purple-500/20 p-4 rounded-2xl relative overflow-hidden shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Est. Ad Triggers</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            ~{estimatedAdClicks.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5">
            Monetag popup clicks generated
          </div>
        </div>
      </div>

      {/* Middle Grid: Traffic Sources & Device Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Traffic Sources */}
        <div className="bg-slate-950/60 border border-purple-500/20 p-5 rounded-2xl space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Compass className="w-4 h-4 text-rose-400" />
              <span>Traffic Sources</span>
            </h3>
            <span className="text-[11px] text-slate-400">Where visitors come from</span>
          </div>

          <div className="space-y-2.5">
            {data.referrers.length > 0 ? (
              data.referrers.map((ref) => {
                const pct = Math.round((ref.count / (data.totalViews || 1)) * 100);
                return (
                  <div key={ref.source} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">{ref.source}</span>
                      <span className="text-slate-400 font-mono">{ref.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-500 to-purple-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 py-3">No referral sources yet.</p>
            )}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-slate-950/60 border border-purple-500/20 p-5 rounded-2xl space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span>Device Breakdown</span>
            </h3>
            <span className="text-[11px] text-slate-400">Mobile vs Desktop</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-900/90 border border-purple-500/10 p-4 rounded-xl flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Mobile</p>
                <p className="text-xl font-bold text-white">{mobilePct}%</p>
                <p className="text-[10px] text-slate-500">{data.devices.mobile} visits</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-purple-500/10 p-4 rounded-xl flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Desktop</p>
                <p className="text-xl font-bold text-white">{desktopPct}%</p>
                <p className="text-[10px] text-slate-500">{data.devices.desktop} visits</p>
              </div>
            </div>
          </div>

          {/* Ratio bar */}
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-purple-500 h-full" style={{ width: `${mobilePct}%` }} title={`Mobile: ${mobilePct}%`} />
            <div className="bg-rose-500 h-full" style={{ width: `${desktopPct}%` }} title={`Desktop: ${desktopPct}%`} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
              <span>Mobile ({mobilePct}%)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              <span>Desktop ({desktopPct}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Streamed Movies & Live Real-Time Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Top 5 Streamed Titles */}
        <div className="bg-slate-950/60 border border-purple-500/20 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Film className="w-4 h-4 text-amber-400" />
              <span>Top Streamed Movies</span>
            </h3>
            <span className="text-[11px] text-slate-400">Most clicked titles</span>
          </div>

          <div className="space-y-2">
            {data.topMovies && data.topMovies.length > 0 ? (
              data.topMovies.map((movie, idx) => (
                <div
                  key={movie.title}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-purple-500/10 hover:border-purple-500/30 transition-all text-xs"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      idx === 0 ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" :
                      idx === 1 ? "bg-slate-700 text-slate-200" :
                      idx === 2 ? "bg-amber-900/30 text-amber-500" :
                      "bg-slate-800 text-slate-400"
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-[240px]">
                      {movie.title}
                    </span>
                  </div>
                  <span className="text-purple-300 font-mono font-bold shrink-0">
                    {movie.views} views
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-3">No movies streamed yet. As visitors stream titles, they will appear here ranked by views.</p>
            )}
          </div>
        </div>

        {/* Real-Time Live Feed */}
        <div className="bg-slate-950/60 border border-purple-500/20 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Recent Activity Feed</span>
            </h3>
            <span className="text-[11px] text-slate-400">Live stream beacons</span>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-none">
            {data.recentVisits.length > 0 ? (
              data.recentVisits.map((visit, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-purple-500/5 text-[11px]"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 border border-purple-500/20 uppercase font-bold shrink-0">
                      {visit.device === "mobile" ? "📱 Mobile" : "💻 PC"}
                    </span>
                    <span className="text-slate-300 font-medium truncate max-w-[170px] sm:max-w-[200px]">
                      {visit.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 text-slate-500">
                    <span className="text-[10px] text-slate-400">{visit.referrer}</span>
                    <span>•</span>
                    <span className="text-emerald-400/90 font-mono text-[10px]">{visit.timeAgo}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-3">No activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
