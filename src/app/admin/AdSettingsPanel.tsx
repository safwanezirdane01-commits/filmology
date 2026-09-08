"use client";

import { useState } from "react";
import { saveAdSettingsAction } from "./actions";
import { 
  DollarSign, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle, 
  Save, 
  MousePointerClick, 
  LayoutTemplate,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

interface AdSettingsPanelProps {
  initialSettings: {
    directLinkUrl: string;
    requiredClicks: number;
    bannerCode: string;
    isEnabled: boolean;
  };
}

export default function AdSettingsPanel({ initialSettings }: AdSettingsPanelProps) {
  const [directLinkUrl, setDirectLinkUrl] = useState(initialSettings.directLinkUrl || "");
  const [requiredClicks, setRequiredClicks] = useState(initialSettings.requiredClicks || 2);
  const [bannerCode, setBannerCode] = useState(initialSettings.bannerCode || "");
  const [isEnabled, setIsEnabled] = useState(initialSettings.isEnabled ?? true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const formData = new FormData();
    formData.append("directLinkUrl", directLinkUrl);
    formData.append("requiredClicks", String(requiredClicks));
    formData.append("bannerCode", bannerCode);
    if (isEnabled) {
      formData.append("isEnabled", "on");
    }

    try {
      const res = await saveAdSettingsAction(formData);
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      }
    } catch (err) {
      console.error("Failed to save ad settings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/10 p-2.5 rounded-2xl border border-emerald-500/20 text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Ad Monetization & Revenue Manager
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Connect your CPM ad network links to start earning money from every stream click.
            </p>
          </div>
        </div>

        {/* Global Ads Switch */}
        <button
          type="button"
          onClick={() => setIsEnabled(!isEnabled)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-xs font-bold transition-all ${
            isEnabled 
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" 
              : "bg-slate-800 border-purple-500/20 text-slate-400"
          }`}
        >
          {isEnabled ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
          <span>{isEnabled ? "Ads Active (Earning)" : "Ads Paused"}</span>
        </button>
      </div>

      {saved && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Ad settings saved successfully! Live streams are now using your ad link.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Direct Link / Smartlink Setting */}
        <div className="bg-slate-950/60 p-5 rounded-2xl border border-purple-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center space-x-2">
              <MousePointerClick className="w-4 h-4 text-rose-400" />
              <span>CPM Direct Link / Smartlink (Highest Paying)</span>
            </label>
            <span className="text-[11px] text-purple-300/70 font-semibold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Avg: $2 - $15 CPM
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            When users click the Play button on any film, this link opens in a new tab. This is how streaming sites earn the vast majority of their income.
          </p>
          <input
            type="url"
            value={directLinkUrl}
            onChange={(e) => setDirectLinkUrl(e.target.value)}
            placeholder="e.g. https://www.highcpmgate.com/xyz123abc... (from Adsterra or Monetag)"
            className="w-full bg-slate-900 border border-purple-500/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-rose-500 font-mono"
          />
        </div>

        {/* Required Clicks before Video Plays */}
        <div className="bg-slate-950/60 p-5 rounded-2xl border border-purple-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Required Sponsor Clicks per Movie</h4>
            <p className="text-xs text-slate-400">
              How many times a user must click before the video starts playing. (Recommended: 2 or 3).
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setRequiredClicks(num)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all border ${
                  requiredClicks === num
                    ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white border-rose-400 shadow-md shadow-rose-500/20 scale-105"
                    : "bg-slate-900 text-purple-200/70 border-purple-500/20 hover:bg-slate-800"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Banner Code */}
        <div className="bg-slate-950/60 p-5 rounded-2xl border border-purple-900/40 space-y-3">
          <label className="text-sm font-bold text-white flex items-center space-x-2">
            <LayoutTemplate className="w-4 h-4 text-purple-400" />
            <span>Banner Ad HTML / Script (Optional)</span>
          </label>
          <p className="text-xs text-slate-400">
            Paste your 728x90 leaderboard or 300x250 banner code here to display beneath the video player.
          </p>
          <textarea
            rows={3}
            value={bannerCode}
            onChange={(e) => setBannerCode(e.target.value)}
            placeholder="<script type='text/javascript' src='//...banner.js'></script>"
            className="w-full bg-slate-900 border border-purple-500/30 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-sm"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Saving Settings..." : "Save Ad Monetization Settings"}</span>
        </button>
      </form>

      {/* Network Recommendation Helper */}
      <div className="mt-8 pt-6 border-t border-purple-900/30">
        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center space-x-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Recommended Ad Networks for FilmologyX</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <a
            href="https://adsterra.com"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-purple-500/20 hover:border-rose-500/40 transition-all flex items-center justify-between group"
          >
            <div>
              <p className="text-white font-bold group-hover:text-rose-300 transition-colors">Adsterra (Top Pick)</p>
              <p className="text-slate-400 text-[11px]">Instant approval • Direct Links • Pays via PayPal, Crypto, Bank</p>
            </div>
            <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-white shrink-0" />
          </a>
          <a
            href="https://monetag.com"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-purple-500/20 hover:border-rose-500/40 transition-all flex items-center justify-between group"
          >
            <div>
              <p className="text-white font-bold group-hover:text-rose-300 transition-colors">Monetag (PropellerAds)</p>
              <p className="text-slate-400 text-[11px]">Instant approval • AI Smartlinks • Global high fill rates</p>
            </div>
            <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-white shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
}
