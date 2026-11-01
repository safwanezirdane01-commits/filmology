"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Film,
  PlusCircle,
  Clapperboard,
  Activity,
  Eye,
  Users,
  TrendingUp,
  DollarSign,
  Compass,
  Smartphone,
  Monitor,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Save,
  X,
  Zap,
  Globe,
  BarChart3,
  Star,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { AnalyticsSummary } from "@/lib/analytics";
import { addMovie, saveAdSettingsAction } from "./actions";

interface AdSettings {
  directLinkUrl: string;
  requiredClicks: number;
  bannerCode: string;
  socialBarCode?: string;
  vpnAffiliateUrl?: string;
  telegramUrl?: string;
  isEnabled: boolean;
}

type Tab = "overview" | "ads" | "add";

export default function AdminDashboard({
  initialMovies,
  initialAdSettings,
  initialAnalytics,
}: {
  initialMovies: any[];
  initialAdSettings: AdSettings;
  initialAnalytics: AnalyticsSummary;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(initialAnalytics);
  const [statsLoading, setStatsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");
  const [pingSuccess, setPingSuccess] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const [adSettings, setAdSettings] = useState<AdSettings>(initialAdSettings);
  const [adSaved, setAdSaved] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const [calcVisitors, setCalcVisitors] = useState(5000);

  // Add movie form state
  const [newTitle, setNewTitle] = useState("");
  const [newGenre, setNewGenre] = useState("Action");
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newThumbnail, setNewThumbnail] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // ── Analytics ─────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setAnalyticsError(null);
    try {
      const res = await fetch("/api/analytics", {
        cache: "no-store",
        headers: { "Cache-Control": "no-store" },
      });
      if (res.ok) {
        const json = await res.json();
        if (json && typeof json.totalViews === "number") {
          setAnalytics(json);
          setLastRefreshed(
            new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          );
        } else {
          setAnalyticsError("Unexpected API response");
        }
      } else {
        setAnalyticsError(`API ${res.status}`);
      }
    } catch (err: any) {
      setAnalyticsError(err?.message || "Network error");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const iv = setInterval(fetchStats, 20000);
    return () => clearInterval(iv);
  }, [fetchStats]);

  const handleTestPing = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "/movie/test",
          title: "Test Stream",
          referrer: "Admin Test",
          device: "desktop",
          isTestPing: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.summary && typeof data.summary.totalViews === "number") {
          setAnalytics(data.summary);
        } else {
          await fetchStats();
        }
        setPingSuccess(true);
        setTimeout(() => setPingSuccess(false), 3000);
      }
    } catch {}
    finally { setStatsLoading(false); }
  };

  const handleResetAnalytics = async () => {
    if (!window.confirm("Reset all analytics to 0?")) return;
    try {
      await fetch("/api/analytics", { method: "DELETE" });
      await fetchStats();
    } catch {}
  };

  // ── Ad settings ───────────────────────────────────────────────────────────
  const handleSaveAds = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdLoading(true);
    setAdSaved(false);
    const fd = new FormData();
    fd.append("directLinkUrl", adSettings.directLinkUrl);
    fd.append("requiredClicks", String(adSettings.requiredClicks));
    fd.append("bannerCode", adSettings.bannerCode || "");
    fd.append("socialBarCode", adSettings.socialBarCode || "");
    fd.append("vpnAffiliateUrl", adSettings.vpnAffiliateUrl || "");
    fd.append("telegramUrl", adSettings.telegramUrl || "");
    if (adSettings.isEnabled) fd.append("isEnabled", "on");
    try {
      const res = await saveAdSettingsAction(fd);
      if (res.success) { setAdSaved(true); setTimeout(() => setAdSaved(false), 4000); }
    } catch {}
    finally { setAdLoading(false); }
  };

  // ── Derived stats ─────────────────────────────────────────────────────────
  const totalDevices = (analytics.devices?.mobile || 0) + (analytics.devices?.desktop || 0) + (analytics.devices?.tablet || 0);
  const mobilePct = totalDevices > 0 ? Math.round(((analytics.devices?.mobile || 0) / totalDevices) * 100) : 65;
  const desktopPct = totalDevices > 0 ? Math.round(((analytics.devices?.desktop || 0) / totalDevices) * 100) : 35;
  const estImpressions = Math.round((analytics.totalViews || 0) * 2.2);

  const revDay =
    Math.round((calcVisitors * 2.2 * 3.2) / 1000) +
    Math.round((calcVisitors * 1.6) / 1000) +
    Math.round(Math.max(1, calcVisitors / 1500) * 30);
  const revMonth = revDay * 30;

  // ── Tabs ──────────────────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Dashboard", icon: <Activity className="w-4 h-4" /> },
    { id: "ads",      label: "Monetization", icon: <DollarSign className="w-4 h-4" /> },
    { id: "add",      label: "Add Movie", icon: <PlusCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex">

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-slate-900 border-r border-white/5 fixed left-0 top-0 z-30">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Clapperboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-black text-white text-sm tracking-tight">FilmologyX</p>
                <p className="text-[10px] text-slate-500 font-medium">Admin Studio v2.6</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer group ${
                  activeTab === t.id
                    ? "bg-gradient-to-r from-rose-600/90 to-purple-600/90 text-white shadow-lg shadow-rose-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={activeTab === t.id ? "text-white" : "text-slate-500 group-hover:text-slate-300"}>
                  {t.icon}
                </span>
                {t.label}
              </button>
            ))}
          </nav>

          {/* Live stats widget */}
          <div className="px-4 pb-5 space-y-2">
            <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-4 space-y-3">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Live Stats</p>
              {[
                { label: "Total Views",  val: (analytics.totalViews || 0).toLocaleString(), color: "text-white" },
                { label: "Visitors",     val: (analytics.uniqueVisitors || 0).toLocaleString(), color: "text-white" },
                { label: "Today",        val: `+${analytics.todayViews || 0}`, color: "text-emerald-400" },
                { label: "Movies",       val: initialMovies.length.toString(), color: "text-purple-300" },
              ].map((s) => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">{s.label}</span>
                  <span className={`font-black text-sm ${s.color}`}>{s.val}</span>
                </div>
              ))}
            </div>
            <a
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 hover:from-rose-500 hover:to-purple-500 transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              View Live Site
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </aside>

        {/* ── Main ────────────────────────────────────────────────────────── */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
            {/* Mobile tabs */}
            <div className="flex items-center gap-2 lg:hidden">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === t.id
                      ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white"
                      : "text-slate-400 bg-slate-900 hover:text-white"
                  }`}
                >
                  {t.icon}
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Live
              </div>
              <span className="text-xs text-slate-500">Updated {lastRefreshed}</span>
            </div>
          </header>

          {/* Content */}
          <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto space-y-8">

            {/* ══════════════════════════════════════════════════════
                TAB 1 — DASHBOARD
               ══════════════════════════════════════════════════════ */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-white">Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Real-time audience analytics · auto-refreshes every 20s</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTestPing}
                      disabled={statsLoading}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow shadow-emerald-600/30"
                    >
                      {pingSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                      <span>{pingSuccess ? "Counted" : "Test Ping"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={fetchStats}
                      disabled={statsLoading}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-white/10 transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${statsLoading ? "animate-spin text-rose-400" : ""}`} />
                      Refresh
                    </button>
                    <button
                      type="button"
                      onClick={handleResetAnalytics}
                      className="p-2 bg-slate-800 hover:bg-rose-950 text-slate-500 hover:text-rose-400 rounded-xl border border-white/10 transition-all cursor-pointer"
                      title="Reset analytics"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {analyticsError && (
                  <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Stats error: {analyticsError} — showing last known data.
                  </div>
                )}

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Views", value: (analytics.totalViews || 0).toLocaleString(), sub: `+${analytics.todayViews || 0} today`, subColor: "text-emerald-400", icon: <Eye className="w-5 h-5" />, iconBg: "bg-blue-500/10 text-blue-400", border: "border-blue-500/20" },
                    { label: "Unique Visitors", value: (analytics.uniqueVisitors || 0).toLocaleString(), sub: "Distinct IPs", subColor: "text-slate-500", icon: <Users className="w-5 h-5" />, iconBg: "bg-rose-500/10 text-rose-400", border: "border-rose-500/20" },
                    { label: "Top Title", value: analytics.topMovies?.[0]?.title || "—", sub: analytics.topMovies?.[0] ? `${analytics.topMovies[0].views} plays` : "No streams yet", subColor: "text-amber-400", icon: <Star className="w-5 h-5" />, iconBg: "bg-amber-500/10 text-amber-400", border: "border-amber-500/20", truncate: true },
                    { label: "Est. Impressions", value: `~${estImpressions.toLocaleString()}`, sub: "2× per visit", subColor: "text-slate-500", icon: <DollarSign className="w-5 h-5" />, iconBg: "bg-emerald-500/10 text-emerald-400", border: "border-emerald-500/20" },
                  ].map((c, i) => (
                    <div key={i} className={`bg-slate-900 border ${c.border} rounded-2xl p-5 space-y-3`}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-400">{c.label}</p>
                        <div className={`w-9 h-9 rounded-xl ${c.iconBg} flex items-center justify-center`}>{c.icon}</div>
                      </div>
                      <p className={`text-2xl font-black text-white leading-none ${c.truncate ? "truncate" : ""}`}>{c.value}</p>
                      <p className={`text-xs font-semibold ${c.subColor}`}>{c.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Traffic + Devices */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Traffic Sources */}
                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center"><Compass className="w-4 h-4 text-rose-400" /></div>
                      <div>
                        <p className="text-sm font-bold text-white">Traffic Sources</p>
                        <p className="text-xs text-slate-500">Where your audience comes from</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {analytics.referrers && analytics.referrers.length > 0 ? analytics.referrers.map((ref) => {
                        const pct = Math.round((ref.count / Math.max(analytics.totalViews || 1, 1)) * 100);
                        return (
                          <div key={ref.source} className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-slate-300">{ref.source}</span>
                              <span className="text-slate-400 font-mono">{ref.count.toLocaleString()} <span className="text-slate-600">({pct}%)</span></span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-rose-500 to-purple-500 rounded-full transition-all duration-700" style={{ width: `${Math.max(4, pct)}%` }} />
                            </div>
                          </div>
                        );
                      }) : (
                        <div className="py-8 text-center">
                          <Globe className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                          <p className="text-xs text-slate-500">No sources yet — send a test ping!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Devices */}
                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"><Smartphone className="w-4 h-4 text-purple-400" /></div>
                      <div>
                        <p className="text-sm font-bold text-white">Device Breakdown</p>
                        <p className="text-xs text-slate-500">Mobile vs Desktop</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Mobile", pct: mobilePct, count: analytics.devices?.mobile || 0, icon: <Smartphone className="w-5 h-5" />, color: "text-purple-400", bg: "bg-purple-500/10", bar: "bg-purple-500" },
                        { label: "Desktop", pct: desktopPct, count: analytics.devices?.desktop || 0, icon: <Monitor className="w-5 h-5" />, color: "text-rose-400", bg: "bg-rose-500/10", bar: "bg-rose-500" },
                      ].map((d) => (
                        <div key={d.label} className="bg-slate-950/80 border border-white/5 rounded-xl p-4 space-y-2">
                          <div className={`w-9 h-9 ${d.bg} rounded-lg flex items-center justify-center ${d.color}`}>{d.icon}</div>
                          <p className="text-xs text-slate-400">{d.label}</p>
                          <p className="text-2xl font-black text-white">{d.pct}%</p>
                          <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                            <div className={`h-full ${d.bar} rounded-full`} style={{ width: `${d.pct}%` }} />
                          </div>
                          <p className="text-[10px] text-slate-600">{d.count.toLocaleString()} visits</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Movies + Live Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center"><BarChart3 className="w-4 h-4 text-amber-400" /></div>
                      <p className="text-sm font-bold text-white">Top Streamed Movies</p>
                    </div>
                    <div className="space-y-2">
                      {analytics.topMovies && analytics.topMovies.length > 0 ? analytics.topMovies.map((m, i) => (
                        <div key={m.title} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-950/60 transition-all">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${i === 0 ? "bg-amber-500/20 text-amber-300" : i === 1 ? "bg-slate-700 text-slate-200" : "bg-slate-800 text-slate-400"}`}>{i + 1}</span>
                          <span className="flex-1 text-xs font-semibold text-white truncate">{m.title}</span>
                          <span className="text-xs font-mono font-bold text-purple-300 shrink-0">{m.views} <span className="text-slate-600">plays</span></span>
                        </div>
                      )) : (
                        <div className="py-8 text-center">
                          <Film className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                          <p className="text-xs text-slate-500">No movies played yet.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Activity className="w-4 h-4 text-emerald-400" /></div>
                      <div>
                        <p className="text-sm font-bold text-white">Live Activity Feed</p>
                        <p className="text-xs text-slate-500">Real-time visitor beacons</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-none">
                      {analytics.recentVisits && analytics.recentVisits.length > 0 ? analytics.recentVisits.map((v, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/[0.03] text-[11px]">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="shrink-0 text-slate-400">
                              {v.device === "mobile" ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                            </span>
                            <span className="text-slate-200 font-medium truncate max-w-[150px]">{v.title}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-slate-600">{v.referrer}</span>
                            <span className="text-emerald-400 font-mono">{v.timeAgo}</span>
                          </div>
                        </div>
                      )) : (
                        <div className="py-8 text-center">
                          <Clock className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                          <p className="text-xs text-slate-500">Waiting for live visitors…</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════
                TAB 2 — MONETIZATION & ADS
               ══════════════════════════════════════════════════════ */}
            {activeTab === "ads" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-white">Monetization & Ads</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Configure Adsterra, VPN affiliate, and Telegram community</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdSettings((p) => ({ ...p, isEnabled: !p.isEnabled }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                      adSettings.isEnabled
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "bg-slate-800 border-white/10 text-slate-400"
                    }`}
                  >
                    {adSettings.isEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    {adSettings.isEnabled ? "Monetization ON" : "Monetization OFF"}
                  </button>
                </div>

                {adSaved && (
                  <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Settings saved! Monetization is now live.
                  </div>
                )}

                <form onSubmit={handleSaveAds} className="space-y-4">
                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      Ad Configuration
                    </h3>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Adsterra Direct Link URL</label>
                      <input
                        type="url"
                        required
                        value={adSettings.directLinkUrl}
                        onChange={(e) => setAdSettings((p) => ({ ...p, directLinkUrl: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-rose-500 transition-colors"
                        placeholder="https://consciousdunkvastly.com/..."
                      />
                      <p className="text-[11px] text-slate-500">Opens in new tab when visitor unlocks the player</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Required Clicks to Unlock</label>
                        <select
                          value={adSettings.requiredClicks}
                          onChange={(e) => setAdSettings((p) => ({ ...p, requiredClicks: Number(e.target.value) }))}
                          className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500"
                        >
                          <option value={1}>1 Click — Casual / Fastest</option>
                          <option value={2}>2 Clicks — Optimal CPM (Recommended)</option>
                          <option value={3}>3 Clicks — Maximum Revenue</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dwell Rule</label>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-sm font-semibold text-emerald-300">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>5 Seconds Minimum</span>
                          </span>
                          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-bold">ACTIVE</span>
                        </div>
                        <p className="text-[11px] text-slate-500">Early returns are told to redo</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Adsterra Social Bar Code</label>
                        <textarea
                          rows={3}
                          value={adSettings.socialBarCode || ""}
                          onChange={(e) => setAdSettings((p) => ({ ...p, socialBarCode: e.target.value }))}
                          className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-rose-500 transition-colors resize-none"
                          placeholder="<script type='text/javascript' src='//...'></script>"
                        />
                        <p className="text-[11px] text-slate-500">Adds native push notifications sitewide (+30–50% revenue)</p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sponsor Banner Code</label>
                        <textarea
                          rows={3}
                          value={adSettings.bannerCode || ""}
                          onChange={(e) => setAdSettings((p) => ({ ...p, bannerCode: e.target.value }))}
                          className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-rose-500 transition-colors resize-none"
                          placeholder="<script ...> or <iframe> banner code..."
                        />
                        <p className="text-[11px] text-slate-500">Shown below the player on every movie page</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">VPN Affiliate Link ($20–$40 / sale)</label>
                        <input
                          type="url"
                          value={adSettings.vpnAffiliateUrl || ""}
                          onChange={(e) => setAdSettings((p) => ({ ...p, vpnAffiliateUrl: e.target.value }))}
                          className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-rose-500 transition-colors"
                          placeholder="https://nordvpn.com/affiliate..."
                        />
                        <p className="text-[11px] text-slate-500">Powers the "Bypass ISP Throttling" banner below the player</p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Telegram Channel URL</label>
                        <input
                          type="url"
                          value={adSettings.telegramUrl || ""}
                          onChange={(e) => setAdSettings((p) => ({ ...p, telegramUrl: e.target.value }))}
                          className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-rose-500 transition-colors"
                          placeholder="https://t.me/FilmologyX"
                        />
                        <p className="text-[11px] text-slate-500">Enables the "Join Community" viral banner and share pills</p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={adLoading}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-rose-500/20 cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {adLoading ? "Saving…" : "Save Monetization Settings"}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Revenue Calculator */}
                <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                        Revenue Estimator
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2">How Much Can FilmologyX Earn?</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Traffic Setting</p>
                      <p className="text-xl font-black text-rose-400">{calcVisitors.toLocaleString()} / day</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500 font-semibold">
                      <span>1,000</span><span>25,000</span><span>50,000</span>
                    </div>
                    <input
                      type="range"
                      min={1000} max={50000} step={1000}
                      value={calcVisitors}
                      onChange={(e) => setCalcVisitors(Number(e.target.value))}
                      className="w-full h-2 accent-rose-500 cursor-pointer rounded-lg bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Direct Link Ads", day: Math.round((calcVisitors * 2.2 * 3.2) / 1000), desc: `${Math.round(calcVisitors * 2.2).toLocaleString()} impressions @ $3.20 CPM`, color: "text-blue-400", border: "border-blue-500/20" },
                      { label: "Social Bar Push", day: Math.round((calcVisitors * 1.6) / 1000), desc: `Native notifications @ $1.60 CPM`, color: "text-purple-400", border: "border-purple-500/20" },
                      { label: "VPN Affiliates", day: Math.round(Math.max(1, calcVisitors / 1500) * 30), desc: `Avg 1 sale / 1,500 views @ $30`, color: "text-emerald-400", border: "border-emerald-500/20" },
                    ].map((s) => (
                      <div key={s.label} className={`bg-slate-950/80 border ${s.border} rounded-xl p-4 space-y-2`}>
                        <p className="text-xs font-semibold text-slate-400">{s.label}</p>
                        <p className={`text-2xl font-black ${s.color}`}>${s.day} <span className="text-sm text-slate-500 font-semibold">/ day</span></p>
                        <p className="text-[10px] text-slate-500">{s.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-emerald-950/60 to-purple-950/60 border-2 border-emerald-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Est. Monthly Earnings</p>
                      <p className="text-xs text-slate-400 mt-0.5">All streams combined</p>
                    </div>
                    <div className="text-center sm:text-right">
                      <span className="text-4xl font-black text-emerald-400">${revMonth.toLocaleString()}</span>
                      <span className="text-slate-500 text-sm block font-semibold">USD / month</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════
                TAB 3 — ADD MOVIE
               ══════════════════════════════════════════════════════ */}
            {activeTab === "add" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-2xl font-black text-white">Add Movie</h1>
                  <p className="text-sm text-slate-500 mt-0.5">Manually add any title with a stream link, TMDb ID, or IMDb ID</p>
                </div>

                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <form action={addMovie} className="lg:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</label>
                          <input name="title" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Inception" className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Genre</label>
                          <input name="genre" required value={newGenre} onChange={(e) => setNewGenre(e.target.value)} placeholder="e.g. Sci-Fi, Action" className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Release Year</label>
                          <input name="releaseYear" type="number" required value={newYear} onChange={(e) => setNewYear(Number(e.target.value))} className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500 transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Poster URL</label>
                          <input name="thumbnailUrl" type="url" value={newThumbnail} onChange={(e) => setNewThumbnail(e.target.value)} placeholder="https://image.tmdb.org/..." className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors" />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Video Stream Source</label>
                          <input name="videoUrl" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="TMDb ID (157336), IMDb ID (tt0816692), or MP4 URL" className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors" />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Synopsis</label>
                          <textarea name="description" required rows={4} value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Movie synopsis..." className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors resize-none" />
                        </div>
                      </div>
                      <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-rose-500/20 cursor-pointer">
                        Publish Movie to Catalog
                      </button>
                    </form>

                    {/* Live preview */}
                    <div className="flex flex-col items-center justify-start bg-slate-950/60 border border-white/5 rounded-2xl p-5 gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Live Preview</span>
                      <div className="w-40 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="aspect-[2/3] bg-slate-950 relative">
                          {newThumbnail ? (
                            <img src={newThumbnail} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 text-xs gap-2">
                              <Film className="w-8 h-8" />
                              <span>Poster Preview</span>
                            </div>
                          )}
                          <span className="absolute top-2 right-2 bg-black/80 text-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded">{newYear}</span>
                        </div>
                        <div className="p-3 space-y-1">
                          <p className="font-bold text-white text-xs truncate">{newTitle || "Movie Title"}</p>
                          <p className="text-[10px] text-purple-300 font-semibold">{newGenre || "Genre"}</p>
                          <p className="text-[9px] text-slate-500 line-clamp-2">{newDescription || "Description…"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
