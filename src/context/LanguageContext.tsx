"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "ar" | "fr" | "pt" | "es" | "de";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isArabic: boolean;
  dir: "ltr" | "rtl";
  t: (key: string, fallback?: string) => string;
  translateGenre: (genre: string) => string;
}

export const GENRE_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    "action": "Action",
    "adventure": "Adventure",
    "animation": "Animation",
    "comedy": "Comedy",
    "crime": "Crime",
    "documentary": "Documentary",
    "drama": "Drama",
    "family": "Family",
    "fantasy": "Fantasy",
    "history": "History",
    "horror": "Horror",
    "music": "Music",
    "mystery": "Mystery",
    "romance": "Romance",
    "science fiction": "Sci-Fi",
    "sci-fi": "Sci-Fi",
    "scifi": "Sci-Fi",
    "tv movie": "TV Movie",
    "thriller": "Thriller",
    "war": "War",
    "western": "Western",
    "tv series": "TV Series",
    "series": "TV Series",
    "shows": "Shows",
    "cinema": "Cinema",
  },
  ar: {
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
  },
  fr: {
    "action": "Action",
    "adventure": "Aventure",
    "animation": "Animation",
    "comedy": "Comédie",
    "crime": "Policier",
    "documentary": "Documentaire",
    "drama": "Drame",
    "family": "Famille",
    "fantasy": "Fantastique",
    "history": "Histoire",
    "horror": "Horreur",
    "music": "Musique",
    "mystery": "Mystère",
    "romance": "Romance",
    "science fiction": "Science-Fiction",
    "sci-fi": "Science-Fiction",
    "scifi": "Science-Fiction",
    "tv movie": "Téléfilm",
    "thriller": "Thriller",
    "war": "Guerre",
    "western": "Western",
    "tv series": "Série TV",
    "series": "Série TV",
    "shows": "Émissions",
    "cinema": "Cinéma",
  },
  pt: {
    "action": "Ação",
    "adventure": "Aventura",
    "animation": "Animação",
    "comedy": "Comédia",
    "crime": "Crime",
    "documentary": "Documentário",
    "drama": "Drama",
    "family": "Família",
    "fantasy": "Fantasia",
    "history": "História",
    "horror": "Terror",
    "music": "Música",
    "mystery": "Mistério",
    "romance": "Romance",
    "science fiction": "Ficção Científica",
    "sci-fi": "Ficção Científica",
    "scifi": "Ficção Científica",
    "tv movie": "Filme para TV",
    "thriller": "Suspense",
    "war": "Guerra",
    "western": "Faroeste",
    "tv series": "Série de TV",
    "series": "Série de TV",
    "shows": "Programas",
    "cinema": "Cinema",
  },
  es: {
    "action": "Acción",
    "adventure": "Aventura",
    "animation": "Animación",
    "comedy": "Comedia",
    "crime": "Crimen",
    "documentary": "Documental",
    "drama": "Drama",
    "family": "Familia",
    "fantasy": "Fantasía",
    "history": "Historia",
    "horror": "Terror",
    "music": "Música",
    "mystery": "Misterio",
    "romance": "Romance",
    "science fiction": "Ciencia Ficción",
    "sci-fi": "Ciencia Ficción",
    "scifi": "Ciencia Ficción",
    "tv movie": "Película de TV",
    "thriller": "Suspenso",
    "war": "Bélica",
    "western": "Western",
    "tv series": "Serie de TV",
    "series": "Serie de TV",
    "shows": "Programas",
    "cinema": "Cine",
  },
  de: {
    "action": "Action",
    "adventure": "Abenteuer",
    "animation": "Animation",
    "comedy": "Komödie",
    "crime": "Krimi",
    "documentary": "Dokumentation",
    "drama": "Drama",
    "family": "Familie",
    "fantasy": "Fantasy",
    "history": "Geschichte",
    "horror": "Horror",
    "music": "Musik",
    "mystery": "Mystery",
    "romance": "Romantik",
    "science fiction": "Science Fiction",
    "sci-fi": "Science Fiction",
    "scifi": "Science Fiction",
    "tv movie": "TV-Film",
    "thriller": "Thriller",
    "war": "Krieg",
    "western": "Western",
    "tv series": "TV-Serie",
    "series": "TV-Serie",
    "shows": "Shows",
    "cinema": "Kino",
  },
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
    "nav.arabic": "العربية",
    "nav.french": "Français",
    "nav.portuguese": "Português",
    "nav.spanish": "Español",
    "nav.german": "Deutsch",

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
    "nav.english": "English",
    "nav.arabic": "العربية",
    "nav.french": "Français",
    "nav.portuguese": "Português",
    "nav.spanish": "Español",
    "nav.german": "Deutsch",

    // Hero Spotlight Carousel
    "hero.watchFree": "مشاهدة مجاناً",
    "hero.watchTrailer": "الإعلان الرسمي",
    "hero.moreInfo": "تفاصيل العمل",
    "hero.featured": "عمل سينمائي مميز",
    "hero.allTime": "تحفة سينمائية خالدة",
    "hero.trending": "الأكثر رواجاً عالمياً",

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
  fr: {
    // Navbar & Global
    "nav.movies": "Films",
    "nav.series": "Séries TV",
    "nav.allMovies": "Tous les films",
    "nav.searchPlaceholder": "Rechercher des films, séries, genres...",
    "nav.search": "Rechercher",
    "nav.login": "Connexion",
    "nav.signup": "S'inscrire",
    "nav.profile": "Profil",
    "nav.watchlist": "Ma liste",
    "nav.logout": "Déconnexion",
    "nav.admin": "Tableau de bord",
    "nav.language": "Langue",
    "nav.options": "Plus d'options",
    "nav.dmca": "DMCA / Légal",
    "nav.contact": "Contact",
    "nav.seeAllResults": "Voir tous les résultats pour",
    "nav.english": "English",
    "nav.arabic": "العربية",
    "nav.french": "Français",
    "nav.portuguese": "Português",
    "nav.spanish": "Español",
    "nav.german": "Deutsch",

    // Hero Spotlight Carousel
    "hero.watchFree": "Regarder gratuitement",
    "hero.watchTrailer": "Bande-annonce",
    "hero.moreInfo": "Plus d'infos",
    "hero.featured": "Succès du moment",
    "hero.allTime": "Chef-d'œuvre classique",
    "hero.trending": "#1 Tendances mondiales",

    // Shelves & Sections
    "shelf.trendingTitle": "Tendances mondiales",
    "shelf.trendingBadge": "Aujourd'hui",
    "shelf.trendingSubtitle": "Les films les plus regardés dans le monde en ce moment",
    "shelf.masterpiecesTitle": "Chefs-d'œuvre légendaires",
    "shelf.masterpiecesBadge": "IMDb 8.8+",
    "shelf.masterpiecesSubtitle": "Classiques du cinéma acclamés par la critique",
    "shelf.seriesTitle": "Séries TV incontournables",
    "shelf.seriesBadge": "Top Séries",
    "shelf.seriesSubtitle": "Séries intégrales avec navigation rapide par épisodes",

    // Catalog & Filters
    "catalog.browse": "Parcourir le catalogue",
    "catalog.count": "+10 000 titres et recherche instantanée",
    "catalog.filterPlaceholder": "Filtrer par genre ou mot-clé...",
    "catalog.sortBy": "Trier par",
    "catalog.trending": "Tendances",
    "catalog.newest": "Année de sortie",
    "catalog.az": "Titre (A-Z)",
    "catalog.loadMore": "Charger plus de films",
    "catalog.loading": "Chargement en cours...",
    "catalog.noResults": "Aucun film ne correspond à votre filtre.",
    "catalog.showing": "Affichage de",
    "catalog.titles": "titres",

    // Categories
    "cat.all": "Toute la bibliothèque",
    "cat.imdb_trending": "Tendances IMDb",
    "cat.imdb_top": "Mieux notés IMDb",
    "cat.series": "Séries TV",
    "cat.action": "Action & Marvel",
    "cat.scifi": "Science-Fiction",
    "cat.drama": "Drames & Succès",
    "cat.horror": "Horreur",
    "cat.comedy": "Comédie",
    "cat.romance": "Romance",
    "cat.arabic": "Cinéma arabe",

    // Continue Watching
    "continue.title": "Reprendre la lecture",
    "continue.resume": "Reprendre",
    "continue.completed": "terminé",
    "continue.clear": "Effacer l'historique",

    // Features Bar
    "features.fastTitle": "Streaming 1080p ultra rapide",
    "features.fastDesc": "CDN direct et basculement multi-serveurs",
    "features.libraryTitle": "+10 000 films et séries disponibles",
    "features.libraryDesc": "Bibliothèque complète IMDb, Marvel, Sci-Fi et séries",
    "features.freeTitle": "100% gratuit et sans abonnement",
    "features.freeDesc": "Visionnage instantané, sans carte de crédit requise",

    // Video Player & Controls
    "player.server": "Serveur :",
    "player.nextServer": "Suivant ↻",
    "player.season": "Saison :",
    "player.episode": "Épisode :",
    "player.prev": "◀ Précédent",
    "player.next": "Suivant ▶",
    "player.theater": "Mode Cinéma",
    "player.exitTheater": "Quitter (Échap)",
    "player.miniPip": "Mini PiP",
    "player.bingeMode": "Lecture auto",
    "player.stepsCompleted": "Étapes terminées",
    "player.clickToPlay": "Cliquez sur le lecteur pour démarrer",
    "player.resumeAt": "Reprendre à",
    "player.resumeDesc": "Cliquez pour reprendre là où vous vous êtes arrêté.",

    // Movie Details Page
    "details.trailer": "Bande-annonce",
    "details.addToWatchlist": "Ajouter à ma liste",
    "details.inWatchlist": "Dans ma liste",
    "details.share": "Partager",
    "details.copied": "Lien copié !",
    "details.reviews": "Avis de la communauté",
    "details.reviewsHeading": "Avis",
    "details.writeReview": "Laisser un avis",
    "details.moreLikeThis": "Titres similaires",
    "details.topCast": "Acteurs principaux",
    "details.cast": "Distribution & Équipe",
    "details.releaseYear": "Année de sortie",
    "details.genre": "Genre",
    "details.rating": "Note IMDb",
    "details.quality": "4K Ultra HD",
    "details.audio": "Dolby 5.1",
    "details.yourRating": "Votre note",
    "details.comment": "Commentaire (optionnel)",
    "details.commentPlaceholder": "Qu'avez-vous pensé du film ?",
    "details.submitReview": "Publier l'avis",
    "details.submitting": "Envoi en cours...",
    "details.loginToReview": "Veuillez vous connecter pour laisser un avis.",
    "details.noReviews": "Aucun avis pour l'instant. Soyez le premier !",

    // Movies Page
    "movies.title": "Explorer les films gratuits",
    "movies.subtitle": "Regardez les grands classiques et succès du box-office en 1080p sans coupure.",
    "movies.catalog": "Catalogue des films",

    // Series Page
    "series.title": "Explorer les séries TV",
    "series.subtitle": "Regardez des saisons complètes avec un navigateur d'épisodes fluide.",
    "series.catalog": "Séries et émissions",

    // Search Page
    "search.title": "Rechercher un film ou une série",
    "search.resultsFor": "Résultats pour",
    "search.subtitle": "Explorez des millions de films et séries avec streaming instantané en 1080p.",
    "search.library": "Bibliothèque universelle IMDb & TMDb",
    "search.placeholder": "Rechercher un titre, un genre, un acteur...",
    "search.noResults": "Aucun résultat trouvé pour votre recherche.",

    // Common Pagination & Filter
    "common.page": "Page",
    "common.next": "Suivant",
    "common.prev": "Précédent",
    "common.genre": "Genre :",
    "common.category": "Catégorie :",

    // Footer
    "footer.hubTitle": "Regardez n'importe quel film ou série en 1080p gratuitement",
    "footer.hubTag": "Plateforme officielle de streaming",
    "footer.startWatching": "Commencer à regarder",
    "footer.disclaimer": "FilmologyX n'héberge et ne stocke aucun fichier vidéo sur ses serveurs. Tous les contenus sont indexés depuis des tiers non affiliés dans le respect du DMCA.",
    "footer.rights": "Tous droits réservés.",
    "footer.contact": "Contacter le support",
  },
  pt: {
    // Navbar & Global
    "nav.movies": "Filmes",
    "nav.series": "Séries TV",
    "nav.allMovies": "Todos os filmes",
    "nav.searchPlaceholder": "Pesquisar filmes, séries, gêneros...",
    "nav.search": "Buscar",
    "nav.login": "Entrar",
    "nav.signup": "Cadastrar",
    "nav.profile": "Perfil",
    "nav.watchlist": "Minha lista",
    "nav.logout": "Sair",
    "nav.admin": "Painel de controle",
    "nav.language": "Idioma",
    "nav.options": "Mais opções",
    "nav.dmca": "DMCA / Legal",
    "nav.contact": "Contato",
    "nav.seeAllResults": "Ver todos os resultados para",
    "nav.english": "English",
    "nav.arabic": "العربية",
    "nav.french": "Français",
    "nav.portuguese": "Português",
    "nav.spanish": "Español",
    "nav.german": "Deutsch",

    // Hero Spotlight Carousel
    "hero.watchFree": "Assistir grátis",
    "hero.watchTrailer": "Ver trailer",
    "hero.moreInfo": "Mais informações",
    "hero.featured": "Destaque do momento",
    "hero.allTime": "Obra-prima imperdível",
    "hero.trending": "#1 Mais assistido no mundo",

    // Shelves & Sections
    "shelf.trendingTitle": "Em alta no mundo",
    "shelf.trendingBadge": "Hoje",
    "shelf.trendingSubtitle": "Os filmes e séries mais assistidos no mundo neste momento",
    "shelf.masterpiecesTitle": "Obras-primas imperdíveis",
    "shelf.masterpiecesBadge": "IMDb 8.8+",
    "shelf.masterpiecesSubtitle": "Clássicos aclamados pela crítica e os mais bem avaliados do cinema",
    "shelf.seriesTitle": "Séries para maratonar",
    "shelf.seriesBadge": "Top Séries",
    "shelf.seriesSubtitle": "Temporadas completas com navegação intuitiva por episódios",

    // Catalog & Filters
    "catalog.browse": "Explorar catálogo de filmes",
    "catalog.count": "Mais de 10.000 títulos e busca instantânea",
    "catalog.filterPlaceholder": "Filtrar por gênero ou palavra-chave...",
    "catalog.sortBy": "Ordenar por",
    "catalog.trending": "Em alta",
    "catalog.newest": "Ano de lançamento",
    "catalog.az": "Título (A-Z)",
    "catalog.loadMore": "Carregar mais filmes",
    "catalog.loading": "Carregando títulos...",
    "catalog.noResults": "Nenhum filme corresponde ao seu filtro.",
    "catalog.showing": "Exibindo",
    "catalog.titles": "títulos",

    // Categories
    "cat.all": "Biblioteca completa",
    "cat.imdb_trending": "Em alta no IMDb",
    "cat.imdb_top": "Mais bem avaliados IMDb",
    "cat.series": "Séries de TV",
    "cat.action": "Ação e Marvel",
    "cat.scifi": "Ficção Científica",
    "cat.drama": "Drama e Sucessos",
    "cat.horror": "Terror",
    "cat.comedy": "Comédia",
    "cat.romance": "Romance",
    "cat.arabic": "Cinema árabe",

    // Continue Watching
    "continue.title": "Continuar assistindo",
    "continue.resume": "Retomar",
    "continue.completed": "concluído",
    "continue.clear": "Limpar histórico",

    // Features Bar
    "features.fastTitle": "Streaming 1080p ultrarrápido",
    "features.fastDesc": "CDN direto com múltiplos servidores de backup",
    "features.libraryTitle": "Mais de 10.000 filmes e séries prontos",
    "features.libraryDesc": "Catálogo completo IMDb, Marvel, Ficção Científica e Séries",
    "features.freeTitle": "100% gratuito e aberto",
    "features.freeDesc": "Assista agora mesmo, sem necessidade de cartão de crédito",

    // Video Player & Controls
    "player.server": "Servidor:",
    "player.nextServer": "Próximo ↻",
    "player.season": "Temporada:",
    "player.episode": "Episódio:",
    "player.prev": "◀ Anterior",
    "player.next": "Próximo ▶",
    "player.theater": "Modo Cinema",
    "player.exitTheater": "Sair (ESC)",
    "player.miniPip": "Mini PiP",
    "player.bingeMode": "Próximo auto",
    "player.stepsCompleted": "Etapas concluídas",
    "player.clickToPlay": "Clique no player para iniciar",
    "player.resumeAt": "Continuar em",
    "player.resumeDesc": "Clique para voltar de onde você parou.",

    // Movie Details Page
    "details.trailer": "Ver trailer",
    "details.addToWatchlist": "Adicionar à lista",
    "details.inWatchlist": "Na minha lista",
    "details.share": "Compartilhar",
    "details.copied": "Link copiado!",
    "details.reviews": "Avaliações da comunidade",
    "details.reviewsHeading": "Avaliações",
    "details.writeReview": "Deixar avaliação",
    "details.moreLikeThis": "Títulos semelhantes",
    "details.topCast": "Elenco principal",
    "details.cast": "Elenco e equipe",
    "details.releaseYear": "Ano de lançamento",
    "details.genre": "Gênero",
    "details.rating": "Avaliação IMDb",
    "details.quality": "4K Ultra HD",
    "details.audio": "Dolby 5.1",
    "details.yourRating": "Sua avaliação",
    "details.comment": "Comentário (opcional)",
    "details.commentPlaceholder": "O que você achou do filme?",
    "details.submitReview": "Enviar avaliação",
    "details.submitting": "Enviando...",
    "details.loginToReview": "Faça login para deixar uma avaliação.",
    "details.noReviews": "Nenhuma avaliação ainda. Seja o primeiro!",

    // Movies Page
    "movies.title": "Explorar filmes gratuitos",
    "movies.subtitle": "Assista aos maiores sucessos de bilheteria e clássicos em 1080p sem travar.",
    "movies.catalog": "Catálogo de filmes",

    // Series Page
    "series.title": "Explorar séries de TV",
    "series.subtitle": "Maratone temporadas inteiras com navegação rápida entre episódios.",
    "series.catalog": "Séries e programas",

    // Search Page
    "search.title": "Buscar filme ou série",
    "search.resultsFor": "Resultados para",
    "search.subtitle": "Busque em milhões de filmes e séries com streaming imediato em 1080p.",
    "search.library": "Biblioteca universal IMDb & TMDb",
    "search.placeholder": "Buscar por filme, série, ator...",
    "search.noResults": "Nenhum resultado encontrado para sua busca.",

    // Common Pagination & Filter
    "common.page": "Página",
    "common.next": "Próximo",
    "common.prev": "Anterior",
    "common.genre": "Gênero:",
    "common.category": "Categoria:",

    // Footer
    "footer.hubTitle": "Assista a qualquer filme ou série em 1080p grátis",
    "footer.hubTag": "Plataforma oficial de streaming",
    "footer.startWatching": "Começar a assistir",
    "footer.disclaimer": "O FilmologyX não hospeda nem armazena arquivos em seus servidores. Todo o conteúdo é indexado de provedores terceiros em estrita conformidade com o DMCA.",
    "footer.rights": "Todos os direitos reservados.",
    "footer.contact": "Falar com suporte",
  },
  es: {
    // Navbar & Global
    "nav.movies": "Películas",
    "nav.series": "Series de TV",
    "nav.allMovies": "Todas las películas",
    "nav.searchPlaceholder": "Buscar películas, series, géneros...",
    "nav.search": "Buscar",
    "nav.login": "Iniciar sesión",
    "nav.signup": "Registrarse",
    "nav.profile": "Perfil",
    "nav.watchlist": "Mi lista",
    "nav.logout": "Cerrar sesión",
    "nav.admin": "Panel de control",
    "nav.language": "Idioma",
    "nav.options": "Más opciones",
    "nav.dmca": "DMCA / Legal",
    "nav.contact": "Contacto",
    "nav.seeAllResults": "Ver todos los resultados para",
    "nav.english": "English",
    "nav.arabic": "العربية",
    "nav.french": "Français",
    "nav.portuguese": "Português",
    "nav.spanish": "Español",
    "nav.german": "Deutsch",

    // Hero Spotlight Carousel
    "hero.watchFree": "Ver gratis",
    "hero.watchTrailer": "Ver tráiler",
    "hero.moreInfo": "Más información",
    "hero.featured": "Película destacada",
    "hero.allTime": "Obra maestra clásica",
    "hero.trending": "#1 Tendencia mundial",

    // Shelves & Sections
    "shelf.trendingTitle": "Tendencias globales",
    "shelf.trendingBadge": "Hoy",
    "shelf.trendingSubtitle": "Las películas más vistas en todo el mundo en este momento",
    "shelf.masterpiecesTitle": "Obras maestras de todos los tiempos",
    "shelf.masterpiecesBadge": "IMDb 8.8+",
    "shelf.masterpiecesSubtitle": "Clásicos aclamados por la crítica y mejor valorados",
    "shelf.seriesTitle": "Series adictivas",
    "shelf.seriesBadge": "Mejores series",
    "shelf.seriesSubtitle": "Temporadas completas con navegación rápida de episodios",

    // Catalog & Filters
    "catalog.browse": "Explorar catálogo de películas",
    "catalog.count": "Más de 10,000 títulos y búsqueda instantánea",
    "catalog.filterPlaceholder": "Filtrar por género o palabra clave...",
    "catalog.sortBy": "Ordenar por",
    "catalog.trending": "Tendencias",
    "catalog.newest": "Año de estreno",
    "catalog.az": "Título (A-Z)",
    "catalog.loadMore": "Cargar más películas",
    "catalog.loading": "Cargando títulos...",
    "catalog.noResults": "No hay películas que coincidan con tu filtro.",
    "catalog.showing": "Mostrando",
    "catalog.titles": "títulos",

    // Categories
    "cat.all": "Biblioteca completa",
    "cat.imdb_trending": "Tendencias IMDb",
    "cat.imdb_top": "Mejor calificadas IMDb",
    "cat.series": "Series de TV",
    "cat.action": "Acción y Marvel",
    "cat.scifi": "Ciencia Ficción",
    "cat.drama": "Drama y Éxitos",
    "cat.horror": "Terror",
    "cat.comedy": "Comedia",
    "cat.romance": "Romance",
    "cat.arabic": "Cine árabe",

    // Continue Watching
    "continue.title": "Continuar viendo",
    "continue.resume": "Continuar",
    "continue.completed": "completado",
    "continue.clear": "Borrar historial",

    // Features Bar
    "features.fastTitle": "Streaming 1080p ultra rápido",
    "features.fastDesc": "CDN directo y múltiples servidores de respaldo",
    "features.libraryTitle": "Más de 10,000 películas y series disponibles",
    "features.libraryDesc": "Catálogo completo de IMDb, Marvel, Sci-Fi y series",
    "features.freeTitle": "100% gratis y abierto",
    "features.freeDesc": "Mira al instante, sin tarjeta de crédito requerida",

    // Video Player & Controls
    "player.server": "Servidor:",
    "player.nextServer": "Siguiente ↻",
    "player.season": "Temporada:",
    "player.episode": "Episodio:",
    "player.prev": "◀ Anterior",
    "player.next": "Siguiente ▶",
    "player.theater": "Modo Cine",
    "player.exitTheater": "Salir (ESC)",
    "player.miniPip": "Mini PiP",
    "player.bingeMode": "Auto-Siguiente",
    "player.stepsCompleted": "Pasos completados",
    "player.clickToPlay": "Haz clic en el reproductor para iniciar",
    "player.resumeAt": "Continuar en",
    "player.resumeDesc": "Haz clic para volver a donde lo dejaste.",

    // Movie Details Page
    "details.trailer": "Ver tráiler",
    "details.addToWatchlist": "Agregar a mi lista",
    "details.inWatchlist": "En mi lista",
    "details.share": "Compartir",
    "details.copied": "¡Enlace copiado!",
    "details.reviews": "Reseñas de la comunidad",
    "details.reviewsHeading": "Reseñas",
    "details.writeReview": "Escribir una reseña",
    "details.moreLikeThis": "Títulos similares",
    "details.topCast": "Reparto principal",
    "details.cast": "Reparto y equipo",
    "details.releaseYear": "Año de estreno",
    "details.genre": "Género",
    "details.rating": "Calificación IMDb",
    "details.quality": "4K Ultra HD",
    "details.audio": "Dolby 5.1",
    "details.yourRating": "Tu calificación",
    "details.comment": "Comentario (opcional)",
    "details.commentPlaceholder": "¿Qué te pareció la película?",
    "details.submitReview": "Publicar reseña",
    "details.submitting": "Enviando...",
    "details.loginToReview": "Inicia sesión para dejar una reseña.",
    "details.noReviews": "Aún no hay reseñas. ¡Sé el primero!",

    // Movies Page
    "movies.title": "Explorar películas gratis",
    "movies.subtitle": "Transmite películas taquilleras y clásicos en 1080p sin cortes.",
    "movies.catalog": "Catálogo de películas",

    // Series Page
    "series.title": "Explorar series de TV",
    "series.subtitle": "Disfruta de temporadas completas con navegación rápida de episodios.",
    "series.catalog": "Series y programas",

    // Search Page
    "search.title": "Buscar película o serie",
    "search.resultsFor": "Resultados para",
    "search.subtitle": "Busca entre millones de películas y series con streaming inmediato en 1080p.",
    "search.library": "Biblioteca universal de IMDb y TMDb",
    "search.placeholder": "Buscar por película, serie, actor...",
    "search.noResults": "No se encontraron títulos que coincidan con tu búsqueda.",

    // Common Pagination & Filter
    "common.page": "Página",
    "common.next": "Siguiente",
    "common.prev": "Anterior",
    "common.genre": "Género:",
    "common.category": "Categoría:",

    // Footer
    "footer.hubTitle": "Mira cualquier película o serie en 1080p gratis",
    "footer.hubTag": "Plataforma oficial de streaming",
    "footer.startWatching": "Empezar a ver gratis",
    "footer.disclaimer": "FilmologyX no aloja ni almacena ningún archivo de vídeo en sus servidores. Todo el contenido está indexado de terceros en estricto cumplimiento con la DMCA.",
    "footer.rights": "Todos los derechos reservados.",
    "footer.contact": "Contactar soporte",
  },
  de: {
    // Navbar & Global
    "nav.movies": "Filme",
    "nav.series": "TV-Serien",
    "nav.allMovies": "Alle Filme",
    "nav.searchPlaceholder": "Filme, Serien, Genres suchen...",
    "nav.search": "Suchen",
    "nav.login": "Anmelden",
    "nav.signup": "Registrieren",
    "nav.profile": "Profil",
    "nav.watchlist": "Merkliste",
    "nav.logout": "Abmelden",
    "nav.admin": "Dashboard",
    "nav.language": "Sprache",
    "nav.options": "Mehr Optionen",
    "nav.dmca": "DMCA / Rechtliches",
    "nav.contact": "Kontakt",
    "nav.seeAllResults": "Alle Ergebnisse anzeigen für",
    "nav.english": "English",
    "nav.arabic": "العربية",
    "nav.french": "Français",
    "nav.portuguese": "Português",
    "nav.spanish": "Español",
    "nav.german": "Deutsch",

    // Hero Spotlight Carousel
    "hero.watchFree": "Kostenlos ansehen",
    "hero.watchTrailer": "Trailer ansehen",
    "hero.moreInfo": "Mehr Infos",
    "hero.featured": "Blockbuster-Highlight",
    "hero.allTime": "Allzeit-Meisterwerk",
    "hero.trending": "#1 Weltweit im Trend",

    // Shelves & Sections
    "shelf.trendingTitle": "Weltweit im Trend",
    "shelf.trendingBadge": "Heute",
    "shelf.trendingSubtitle": "Die meistgesehenen Filme weltweit im Moment",
    "shelf.masterpiecesTitle": "Meisterwerke aller Zeiten",
    "shelf.masterpiecesBadge": "IMDb 8.8+",
    "shelf.masterpiecesSubtitle": "Kritikerlieblinge und bestbewertete Klassiker der Filmgeschichte",
    "shelf.seriesTitle": "Serien-Highlights",
    "shelf.seriesBadge": "Top-Serien",
    "shelf.seriesSubtitle": "Komplette Staffeln mit praktischem Episoden-Navigator",

    // Catalog & Filters
    "catalog.browse": "Filmkatalog durchsuchen",
    "catalog.count": "10.000+ Titel und Sofortsuche",
    "catalog.filterPlaceholder": "Nach Genre oder Stichwort filtern...",
    "catalog.sortBy": "Sortieren nach",
    "catalog.trending": "Beliebt",
    "catalog.newest": "Erscheinungsjahr",
    "catalog.az": "Titel (A-Z)",
    "catalog.loadMore": "Mehr Filme laden",
    "catalog.loading": "Titel werden geladen...",
    "catalog.noResults": "Keine Filme für diesen Filter gefunden.",
    "catalog.showing": "Zeige",
    "catalog.titles": "Titel",

    // Categories
    "cat.all": "Gesamte Mediathek",
    "cat.imdb_trending": "IMDb Trends",
    "cat.imdb_top": "Top bewertet",
    "cat.series": "TV-Serien",
    "cat.action": "Action & Marvel",
    "cat.scifi": "Sci-Fi",
    "cat.drama": "Drama & Hits",
    "cat.horror": "Horror",
    "cat.comedy": "Komödie",
    "cat.romance": "Romantik",
    "cat.arabic": "Arabisches Kino",

    // Continue Watching
    "continue.title": "Weiterschauen",
    "continue.resume": "Fortsetzen",
    "continue.completed": "abgeschlossen",
    "continue.clear": "Verlauf löschen",

    // Features Bar
    "features.fastTitle": "Ultraschnelles 1080p-Streaming",
    "features.fastDesc": "Direktes CDN mit automatischem Server-Failover",
    "features.libraryTitle": "10.000+ Filme & Serien bereit",
    "features.libraryDesc": "Vollständige IMDb-Bibliothek, Marvel, Sci-Fi & Serien",
    "features.freeTitle": "100% kostenlos und frei",
    "features.freeDesc": "Sofort ansehen, keine Kreditkarte erforderlich",

    // Video Player & Controls
    "player.server": "Server:",
    "player.nextServer": "Nächster ↻",
    "player.season": "Staffel:",
    "player.episode": "Episode:",
    "player.prev": "◀ Zurück",
    "player.next": "Weiter ▶",
    "player.theater": "Kinomodus",
    "player.exitTheater": "Beenden (ESC)",
    "player.miniPip": "Mini PiP",
    "player.bingeMode": "Auto-Weiter",
    "player.stepsCompleted": "Schritte abgeschlossen",
    "player.clickToPlay": "Klicken zum Abspielen",
    "player.resumeAt": "Fortsetzen bei",
    "player.resumeDesc": "Klicken, um an der letzten Stelle fortzusetzen.",

    // Movie Details Page
    "details.trailer": "Trailer ansehen",
    "details.addToWatchlist": "Zur Merkliste hinzufügen",
    "details.inWatchlist": "In der Merkliste",
    "details.share": "Teilen",
    "details.copied": "Link kopiert!",
    "details.reviews": "Community-Bewertungen",
    "details.reviewsHeading": "Bewertungen",
    "details.writeReview": "Bewertung schreiben",
    "details.moreLikeThis": "Ähnliche Titel",
    "details.topCast": "Hauptbesetzung",
    "details.cast": "Besetzung & Crew",
    "details.releaseYear": "Erscheinungsjahr",
    "details.genre": "Genre",
    "details.rating": "IMDb-Bewertung",
    "details.quality": "4K Ultra HD",
    "details.audio": "Dolby 5.1",
    "details.yourRating": "Deine Bewertung",
    "details.comment": "Kommentar (optional)",
    "details.commentPlaceholder": "Wie fandest du den Film?",
    "details.submitReview": "Bewertung absenden",
    "details.submitting": "Wird gesendet...",
    "details.loginToReview": "Bitte anmelden, um eine Bewertung abzugeben.",
    "details.noReviews": "Noch keine Bewertungen. Sei der Erste!",

    // Movies Page
    "movies.title": "Kostenlose Filme entdecken",
    "movies.subtitle": "Blockbuster und Filmklassiker in 1080p ohne Unterbrechung streamen.",
    "movies.catalog": "Filmkatalog",

    // Series Page
    "series.title": "TV-Serien entdecken",
    "series.subtitle": "Komplette Staffeln mit praktischem Episoden-Navigator streamen.",
    "series.catalog": "Serien und Shows",

    // Search Page
    "search.title": "Film oder Serie suchen",
    "search.resultsFor": "Ergebnisse für",
    "search.subtitle": "Millionen Filme und Serien mit sofortigem 1080p-Streaming durchsuchen.",
    "search.library": "Universelle IMDb- & TMDb-Bibliothek",
    "search.placeholder": "Nach Titel, Genre, Darsteller suchen...",
    "search.noResults": "Keine Titel gefunden.",

    // Common Pagination & Filter
    "common.page": "Seite",
    "common.next": "Weiter",
    "common.prev": "Zurück",
    "common.genre": "Genre:",
    "common.category": "Kategorie:",

    // Footer
    "footer.hubTitle": "Jeden Film und jede Serie kostenlos in 1080p ansehen",
    "footer.hubTag": "Offizielle Streaming-Plattform",
    "footer.startWatching": "Kostenlos ansehen",
    "footer.disclaimer": "FilmologyX hostet oder speichert keine Mediendateien auf seinen Servern. Alle Inhalte werden in Übereinstimmung mit dem DMCA indexiert.",
    "footer.rights": "Alle Rechte vorbehalten.",
    "footer.contact": "Support kontaktieren",
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
      if (saved && ["en", "ar", "fr", "pt", "es", "de"].includes(saved)) {
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
    const currentGenreMap = GENRE_TRANSLATIONS[language] || GENRE_TRANSLATIONS.en;
    const lower = genre.trim().toLowerCase();

    if (currentGenreMap[lower]) {
      return currentGenreMap[lower];
    }

    // Check comma or slash or ampersand separated
    const parts = genre.split(/[,/&]+/).map(p => p.trim());
    if (parts.length > 1) {
      const translatedParts = parts.map(p => {
        const pLower = p.toLowerCase();
        return currentGenreMap[pLower] || p;
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
