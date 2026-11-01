"use client";

import { Shield, Zap, Lock, ExternalLink, ArrowRight } from "lucide-react";

export default function VpnAffiliateBanner({
  affiliateUrl,
}: {
  affiliateUrl?: string;
}) {
  const targetUrl = affiliateUrl && affiliateUrl.startsWith("http") 
    ? affiliateUrl 
    : "https://consciousdunkvastly.com/vkcab8pm?key=2d7f9ab1644671035abd720ada6bab69";

  return (
    <div className="w-full bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 border border-purple-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-gradient-to-br from-rose-500/20 to-purple-500/20 text-rose-400 border border-rose-500/30 rounded-2xl shrink-0 mt-0.5 shadow-inner">
            <Shield className="w-6 h-6 text-rose-400" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="bg-rose-500/20 text-rose-300 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-rose-500/30 tracking-wider">
                Buffer-Free 4K Streaming
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline">•</span>
              <span className="text-slate-400 text-xs flex items-center space-x-1">
                <Lock className="w-3 h-3 text-purple-400 inline" />
                <span>100% Anonymous & Encrypted</span>
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-extrabold text-white">
              Experiencing Buffering or ISP Video Throttling?
            </h3>
            <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
              Internet providers often intentionally slow down streaming traffic. Bypass ISP throttling and unlock maximum speed on all servers.
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0 flex items-center">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-600 via-purple-600 to-rose-600 hover:from-rose-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-rose-500/20 transition-all hover:scale-105 cursor-pointer text-center"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Protect Privacy & Boost Speed</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
