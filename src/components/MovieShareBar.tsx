"use client";

import { useState } from "react";
import { Share2, Check, Copy, Send, MessageCircle } from "lucide-react";

export default function MovieShareBar({
  title,
  telegramUrl = "https://t.me/FilmologyX",
}: {
  title: string;
  telegramUrl?: string;
}) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    return typeof window !== "undefined" ? window.location.href : "https://filmologyx.vercel.app";
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const shareText = encodeURIComponent(`Watch "${title}" in 1080p Full HD free on FilmologyX!`);
  const shareUrl = encodeURIComponent(getShareUrl());

  const whatsappHref = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
  const telegramHref = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 border border-purple-500/20 p-3.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg">
      <div className="flex items-center space-x-2 text-slate-300 text-xs font-semibold">
        <Share2 className="w-4 h-4 text-rose-400" />
        <span>Share with friends:</span>
      </div>

      <div className="flex items-center space-x-2 flex-wrap gap-y-2 w-full sm:w-auto">
        {/* WhatsApp */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>

        {/* Telegram */}
        <a
          href={telegramHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-xs font-bold transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Telegram</span>
        </a>

        {/* X / Twitter */}
        <a
          href={twitterHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-purple-500/20 text-xs font-bold transition-all"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X / Twitter</span>
        </a>

        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-purple-500/20 text-xs font-semibold transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-rose-400" />}
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </button>

        {/* Join Telegram Channel */}
        {telegramUrl && (
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs transition-all shadow cursor-pointer ml-auto sm:ml-2"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span>Join Telegram</span>
          </a>
        )}
      </div>
    </div>
  );
}
