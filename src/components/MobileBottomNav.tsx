"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Tv, Search, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function MobileBottomNav({ telegramUrl }: { telegramUrl?: string }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Hide on admin routes to prevent UI overlapping
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const defaultTelegram = "https://t.me/FilmologyX";
  const activeTelegram = (telegramUrl && telegramUrl.startsWith("http")) ? telegramUrl : defaultTelegram;

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Movies",
      href: "/movies",
      icon: Film,
      isActive: pathname === "/movies",
    },
    {
      label: "Series",
      href: "/series",
      icon: Tv,
      isActive: pathname === "/series",
    },
    {
      label: "Search",
      href: "/search",
      icon: Search,
      isActive: pathname === "/search",
    },
    {
      label: "Telegram",
      href: activeTelegram,
      icon: Send,
      isExternal: true,
      highlight: true,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-purple-900/30 px-2 py-1.5 safe-area-pb shadow-[0_-8px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <div
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                item.isActive
                  ? "text-rose-400 font-bold"
                  : item.highlight
                  ? "text-purple-300 hover:text-white"
                  : "text-slate-400 hover:text-slate-200 font-medium"
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  item.isActive
                    ? "scale-110 bg-rose-500/15"
                    : item.highlight
                    ? "bg-gradient-to-tr from-purple-600/30 to-rose-600/30 text-rose-300"
                    : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">
                {item.label}
              </span>
            </div>
          );

          if (item.isExternal) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={item.label} href={item.href} className="cursor-pointer">
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
