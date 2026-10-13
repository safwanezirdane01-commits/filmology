"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "ar";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isArabic: boolean;
  dir: "ltr" | "rtl";
  t: (key: string, fallback?: string) => string;
  translateGenre: (genre: string) => string;
}

export const GENRE_TRANSLATIONS: Record<string, string> = {
  "action": "أكشن",
  "adventure": "مغامرة",
  "animation": "رسوم متحركة",
  "comedy": "كوميديا",
  "crime": "جريمة",
  "documentary": "وثائقي",
  "drama": "دراما",
  "family": "عائلي",
  "fantasy": "فنتازيا",
  "history": "تاريخي",
  "horror": "رعب",
  "music": "موسيقى",
  "mystery": "غموض",
  "romance": "رومانسي",
  "science fiction": "خيال علمي",
  "sci-fi": "خيال علمي",
  "scifi": "خيال علمي",
  "tv movie": "فيلم تلفزيوني",
  "thriller": "إثارة وتشويق",
  "war": "حرب",
  "western": "ويسترن",
  "tv series": "مسلسل تلفزيوني",
  "series": "مسلسل تلفزيوني",
  "shows": "مسلسلات",
  "cinema": "سينما",
  "action & adventure": "أكشن ومغامرة",
  "sci-fi & fantasy": "خيال علمي وفنتازيا",
  "crime & mystery": "جريمة وغموض",
  "kids": "أطفال",
  "news": "أخبار",
  "reality": "واقعي",
  "soap": "دراما يومية",
  "talk": "حوارات",
  "war & politics": "حرب وسياسة",
  "all movies": "جميع الأفلام",
  "all series": "جميع المسلسلات",
  "top rated": "الأعلى تقييماً",
  "trending": "الأكثر رواجاً",
};

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar & Global
    "nav.movies": "Movies",
    "nav.series": "TV Series",
    "nav.allMovies": "All Movies",
    "nav.searchPlaceholder": "Search movies, series, genres...",
    "nav.search": "Search",
    "nav.login": "Log In",
    "nav.signup": "Sign Up",
    "nav.profile": "Profile",
    "nav.watchlist": "Watchlist",
    "nav.logout": "Log Out",
    "nav.admin": "Admin Dashboard",
    "nav.language": "Language",
    "nav.options": "More Options",
    "nav.dmca": "DMCA / Legal",
    "nav.contact": "Contact",
    "nav.seeAllResults": "See all results for",
    "nav.english": "English",
    "nav.arabic": "العربية (Arabic)",

    // Hero Spotlight Carousel
    "hero.watchFree": "Watch Free",
    "hero.watchTrailer": "Watch Trailer",
    "hero.moreInfo": "More Info",
    "hero.featured": "Featured Blockbuster",
    "hero.allTime": "All-Time Masterpiece",
    "hero.trending": "#1 Worldwide Trending",

    // Shelves & Sections
    "shelf.trendingTitle": "Trending Worldwide",
    "shelf.trendingBadge": "Live Today",
    "shelf.trendingSubtitle": "The most-watched films across the globe right now",
    "shelf.masterpiecesTitle": "All-Time Masterpieces",
    "shelf.masterpiecesBadge": "IMDb 8.8+",
    "shelf.masterpiecesSubtitle": "Critically acclaimed cinema classics and highest-rated films",
    "shelf.seriesTitle": "Binge-Worthy TV Series",
    "shelf.seriesBadge": "Top Shows",
    "shelf.seriesSubtitle": "Full multi-season series with episode navigator",

    // Catalog & Filters
    "catalog.browse": "Browse Film Collection",
    "catalog.count": "10,000+ Titles & Instant Search",
    "catalog.filterPlaceholder": "Filter by genre or keyword...",
    "catalog.sortBy": "Sort By",
    "catalog.trending": "Trending",
    "catalog.newest": "Release Year",
    "catalog.az": "Title (A-Z)",
    "catalog.loadMore": "Load More Films",
    "catalog.loading": "Loading titles...",
    "catalog.noResults": "No movies match your filter.",
    "catalog.showing": "Showing",
    "catalog.titles": "titles",

    // Categories
    "cat.all": "All Library",
    "cat.imdb_trending": "IMDb Trending",
    "cat.imdb_top": "Top Rated IMDb",
    "cat.series": "TV Series & Shows",
    "cat.action": "Action & Marvel",
    "cat.scifi": "Sci-Fi Universe",
    "cat.drama": "Drama & Hits",
    "cat.horror": "Horror",
    "cat.comedy": "Comedy",
    "cat.romance": "Romance",
    "cat.arabic": "MENA Cinema",

    // Continue Watching
    "continue.title": "Continue Watching",
    "continue.resume": "Resume",
    "continue.completed": "completed",
    "continue.clear": "Clear history",

    // Features Bar
    "features.fastTitle": "Ultra Fast 1080p Streaming",
    "features.fastDesc": "Direct CDN and multi-server failover",
    "features.libraryTitle": "10,000+ Films & Shows Ready",
    "features.libraryDesc": "Full IMDb Library, Marvel, Sci-Fi & Series",
    "features.freeTitle": "100% Free & Open",
    "features.freeDesc": "Watch instantly, no credit card needed",

    // Video Player & Controls
    "player.server": "Server:",
    "player.nextServer": "Next ↻",
    "player.season": "Season:",
    "player.episode": "Episode:",
    "player.prev": "◀ Prev",
    "player.next": "Next ▶",
    "player.theater": "Theater",
    "player.exitTheater": "Exit (ESC)",
    "player.miniPip": "Mini PiP",
    "player.bingeMode": "Auto-Next",
    "player.stepsCompleted": "Steps completed",
    "player.clickToPlay": "Click anywhere inside player to start",
    "player.resumeAt": "Resume at",
    "player.resumeDesc": "Click to jump back to where you left off.",

    // Movie Details Page
    "details.trailer": "Watch Trailer",
    "details.addToWatchlist": "Add to Watchlist",
    "details.inWatchlist": "In Watchlist",
    "details.share": "Share",
    "details.copied": "Link Copied!",
    "details.reviews": "Community Reviews",
    "details.reviewsHeading": "Reviews",
    "details.writeReview": "Write a Review",
    "details.moreLikeThis": "More Like This",
    "details.topCast": "Top Cast",
    "details.cast": "Cast & Crew",
    "details.releaseYear": "Release Year",
    "details.genre": "Genre",
    "details.rating": "IMDb Rating",
    "details.quality": "4K Ultra HD",
    "details.audio": "Dolby 5.1",
    "details.yourRating": "Your Rating",
    "details.comment": "Comment (optional)",
    "details.commentPlaceholder": "What did you think of the movie?",
    "details.submitReview": "Submit Review",
    "details.submitting": "Submitting...",
    "details.loginToReview": "Please log in to leave a review.",
    "details.noReviews": "No reviews yet. Be the first!",

    // Movies Page
    "movies.title": "Explore Free Movies",
    "movies.subtitle": "Stream blockbuster movies and cinema classics in 1080p with multi-server failover.",
    "movies.catalog": "Movies Catalog",

    // Series Page
    "series.title": "Explore TV Series",
    "series.subtitle": "Binge-watch full seasons and episodes with built-in season and episode navigators.",
    "series.catalog": "TV Shows & Series",

    // Search Page
    "search.title": "Search Any Film or Series",
    "search.resultsFor": "Results for",
    "search.subtitle": "Search millions of movies and TV shows from IMDb & TMDb with instant 1080p streaming.",
    "search.library": "Universal IMDb & TMDb Library",
    "search.placeholder": "Search by title, genre, actor...",
    "search.noResults": "No titles found matching your search.",

    // Common Pagination & Filter
    "common.page": "Page",
    "common.next": "Next",
    "common.prev": "Previous",
    "common.genre": "Genre:",
    "common.category": "Category:",

    // Footer
    "footer.hubTitle": "Stream Anything, Anytime in 1080p",
    "footer.hubTag": "Official Streaming Hub",
    "footer.startWatching": "Start Watching Free",
    "footer.disclaimer": "FilmologyX does not host, upload, or store any media files or videos on its servers. All contents are indexed from non-affiliated third-party providers. FilmologyX operates in strict compliance with 17 U.S.C. § 512 (DMCA).",
    "footer.rights": "All rights reserved.",
    "footer.contact": "Contact Support",
  },
  ar: {
    // Navbar & Global
    "nav.movies": "الأفلام",
    "nav.series": "المسلسلات",
    "nav.allMovies": "جميع الأفلام",
    "nav.searchPlaceholder": "ابحث عن فيلم، مسلسل، تصنيف...",
    "nav.search": "بحث",
    "nav.login": "تسجيل الدخول",
    "nav.signup": "إنشاء حساب",
    "nav.profile": "الملف الشخصي",
    "nav.watchlist": "قائمتي",
    "nav.logout": "تسجيل الخروج",
    "nav.admin": "لوحة الإدارة",
    "nav.language": "اللغة",
    "nav.options": "خيارات إضافية",
    "nav.dmca": "إخلاء المسؤولية وDMCA",
    "nav.contact": "تواصل معنا",
    "nav.seeAllResults": "عرض كل النتائج لـ",
    "nav.english": "English (الإنجليزية)",
    "nav.arabic": "العربية (Arabic)",

    // Hero Spotlight Carousel
    "hero.watchFree": "مشاهدة مجاناً",
    "hero.watchTrailer": "الإعلان الرسمي",
    "hero.moreInfo": "تفاصيل العمل",
    "hero.featured": "عمل سينمائي مميز",
    "hero.allTime": "تحفة سينمائية خالدة",
    "hero.trending": "الأكثر رواجاً عالمياً 🔥",

    // Shelves & Sections
    "shelf.trendingTitle": "الأكثر رواجاً عالمياً",
    "shelf.trendingBadge": "اليوم",
    "shelf.trendingSubtitle": "أكثر الأفلام والمسلسلات مشاهدة حول العالم حالياً",
    "shelf.masterpiecesTitle": "أفضل التحف السينمائية",
    "shelf.masterpiecesBadge": "تقييم 8.8+",
    "shelf.masterpiecesSubtitle": "كلاسيكيات سينمائية نالت أعلى التقييمات في تاريخ الفن السابع",
    "shelf.seriesTitle": "مسلسلات مميزة للمتابعة",
    "shelf.seriesBadge": "أقوى المسلسلات",
    "shelf.seriesSubtitle": "مواسم كاملة مع إمكانية التنقل السريع بين الحلقات",

    // Catalog & Filters
    "catalog.browse": "تصفح مكتبة الأفلام",
    "catalog.count": "أكثر من 10,000 عمل وبحث فوري",
    "catalog.filterPlaceholder": "تصفية حسب التصنيف أو الكلمة...",
    "catalog.sortBy": "ترتيب حسب",
    "catalog.trending": "الأكثر شعبية",
    "catalog.newest": "سنة الإصدار",
    "catalog.az": "الاسم (أ - ي)",
    "catalog.loadMore": "تحميل المزيد من الأعمال",
    "catalog.loading": "جاري التحميل...",
    "catalog.noResults": "لم يتم العثور على أعمال مطابقة.",
    "catalog.showing": "عرض",
    "catalog.titles": "عمل",

    // Categories
    "cat.all": "الكل",
    "cat.imdb_trending": "الرائج على IMDb",
    "cat.imdb_top": "الأعلى تقييماً",
    "cat.series": "مسلسلات",
    "cat.action": "أكشن ومارفل",
    "cat.scifi": "خيال علمي",
    "cat.drama": "دراما",
    "cat.horror": "رعب",
    "cat.comedy": "كوميديا",
    "cat.romance": "رومانسي",
    "cat.arabic": "سينما عربية",

    // Continue Watching
    "continue.title": "متابعة المشاهدة",
    "continue.resume": "استئناف",
    "continue.completed": "مكتمل",
    "continue.clear": "مسح السجل",

    // Features Bar
    "features.fastTitle": "بث فائق السرعة بجودة 1080p",
    "features.fastDesc": "سيرفرات سريعة مع استبدال فوري عند التوقف",
    "features.libraryTitle": "أكثر من 10,000 فيلم ومسلسل",
    "features.libraryDesc": "مكتبة كاملة تشمل مارفل، الخيال العلمي وأقوى المسلسلات",
    "features.freeTitle": "مجاني 100% وبدون اشتراك",
    "features.freeDesc": "شاهد فوراً دون الحاجة لبطاقة بنكية",

    // Video Player & Controls
    "player.server": "السيرفر:",
    "player.nextServer": "السيرفر التالي ↻",
    "player.season": "الموسم:",
    "player.episode": "الحلقة:",
    "player.prev": "◀ السابق",
    "player.next": "التالي ▶",
    "player.theater": "وضع السينما",
    "player.exitTheater": "إغلاق (ESC)",
    "player.miniPip": "نافذة مصغرة",
    "player.bingeMode": "تشغيل تلقائي",
    "player.stepsCompleted": "الخطوات المكتملة",
    "player.clickToPlay": "انقر داخل المشغل لبدء المشاهدة",
    "player.resumeAt": "استئناف عند",
    "player.resumeDesc": "انقر للعودة إلى النقطة التي توقفت عندها.",

    // Movie Details Page
    "details.trailer": "الإعلان الرسمي",
    "details.addToWatchlist": "إضافة لقائمتي",
    "details.inWatchlist": "في قائمتي",
    "details.share": "مشاركة",
    "details.copied": "تم نسخ الرابط!",
    "details.reviews": "التقييمات والآراء",
    "details.reviewsHeading": "التقييمات",
    "details.writeReview": "أضف رأيك",
    "details.moreLikeThis": "أعمال مشابهة",
    "details.topCast": "أبرز الممثلين",
    "details.cast": "طاقم العمل",
    "details.releaseYear": "سنة الإصدار",
    "details.genre": "التصنيف",
    "details.rating": "تقييم IMDb",
    "details.quality": "4K فائق الدقة",
    "details.audio": "دولبي 5.1",
    "details.yourRating": "تقييمك",
    "details.comment": "تعليق (اختياري)",
    "details.commentPlaceholder": "ما هو رأيك في العمل؟",
    "details.submitReview": "إرسال التقييم",
    "details.submitting": "جاري الإرسال...",
    "details.loginToReview": "يرجى تسجيل الدخول لكتابة تقييم.",
    "details.noReviews": "لا توجد تقييمات بعد. كن أول من يقيّم!",

    // Movies Page
    "movies.title": "استكشف مكتبة الأفلام",
    "movies.subtitle": "شاهد أحدث الأفلام العالمية وروائع السينما بدقة 1080p مجاناً وبدون تقطيع.",
    "movies.catalog": "دليل الأفلام",

    // Series Page
    "series.title": "استكشف المسلسلات",
    "series.subtitle": "تابع مواسم وحلقات مسلسلاتك المفضلة كاملة مع تنقل سلس بين الحلقات.",
    "series.catalog": "عروض ومسلسلات تلفزيونية",

    // Search Page
    "search.title": "ابحث عن أي فيلم أو مسلسل",
    "search.resultsFor": "نتائج البحث عن",
    "search.subtitle": "ابحث بين ملايين الأفلام والمسلسلات من قاعدة بيانات IMDb و TMDb مع بث فوري بدقة 1080p.",
    "search.library": "مكتبة IMDb و TMDb الشاملة",
    "search.placeholder": "ابحث عن فيلم، مسلسل، ممثل...",
    "search.noResults": "لم نتمكن من العثور على نتائج مطابقة لبحثك.",

    // Common Pagination & Filter
    "common.page": "صفحة",
    "common.next": "التالي",
    "common.prev": "السابق",
    "common.genre": "التصنيف:",
    "common.category": "القسم:",

    // Footer
    "footer.hubTitle": "شاهد أي فيلم أو مسلسل بجودة 1080p مجاناً",
    "footer.hubTag": "المنصة الرسمية للبث",
    "footer.startWatching": "ابدأ المشاهدة مجاناً",
    "footer.disclaimer": "موقع FilmologyX لا يستضيف أو يرفع أي ملفات فيديو على خوادمه الخاصة. جميع المحتويات مفهرسة من مزودي محتوى خارجيين وفقاً لقوانين حماية الألفية لحقوق نشر المواد الرقمية (DMCA).",
    "footer.rights": "جميع الحقوق محفوظة.",
    "footer.contact": "تواصل مع الدعم",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  isArabic: false,
  dir: "ltr",
  t: (key: string, fallback?: string) => fallback || key,
  translateGenre: (genre: string) => genre,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("filmologyx_lang") as Language | null;
      if (saved === "ar" || saved === "en") {
        setLanguageState(saved);
        applyDocumentLanguage(saved);
      }
    } catch {}
    setMounted(true);
  }, []);

  const applyDocumentLanguage = (lang: Language) => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    if (lang === "ar") {
      document.body.classList.add("font-arabic");
    } else {
      document.body.classList.remove("font-arabic");
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("filmologyx_lang", lang);
    } catch {}
    applyDocumentLanguage(lang);
  };

  const toggleLanguage = () => {
    const next: Language = language === "en" ? "ar" : "en";
    setLanguage(next);
  };

  const t = (key: string, fallback?: string): string => {
    const currentDict = translations[language] || translations.en;
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    // Fallback to English dictionary
    if (translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  const isArabic = language === "ar";
  const dir: "ltr" | "rtl" = isArabic ? "rtl" : "ltr";

  const translateGenre = (genre: string): string => {
    if (!genre) return "";
    if (!isArabic) return genre;

    const lower = genre.trim().toLowerCase();
    if (GENRE_TRANSLATIONS[lower]) {
      return GENRE_TRANSLATIONS[lower];
    }

    // Check comma or slash or ampersand separated
    const parts = genre.split(/[,/&]+/).map(p => p.trim());
    if (parts.length > 1) {
      const translatedParts = parts.map(p => {
        const pLower = p.toLowerCase();
        return GENRE_TRANSLATIONS[pLower] || p;
      });
      return translatedParts.join(" • ");
    }

    return genre;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isArabic,
        dir,
        t,
        translateGenre,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
