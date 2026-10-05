import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import WatchlistButton from "./WatchlistButton";
import ReviewSection from "./ReviewSection";
import VideoPlayer from "./VideoPlayer";
import { Star, Sparkles, Film, Play, Tv, Share2, Users } from "lucide-react";
import WatchTrailerButton from "@/components/WatchTrailerButton";
import ShareButton from "@/components/ShareButton";

import { CURATED_CATALOG } from "@/lib/catalog";

async function getMovieSafely(id: string) {
  let cleanId = id.trim();
  try {
    cleanId = decodeURIComponent(cleanId).trim();
  } catch {}
  cleanId = cleanId.replace(/%3a/gi, ":").replace(/%2d/gi, "-");

  const normalizedLower = cleanId.toLowerCase();
  const tvStripped = normalizedLower.replace(/^tv[:-]/i, "");

  // 1. Database query with multiple ID format fallbacks
  try {
    const movie = await prisma.movie.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { id: id },
          { videoUrl: cleanId },
          { videoUrl: id },
          ...(normalizedLower.startsWith("tv:") || normalizedLower.startsWith("tv-") ? [
            { id: `tv-${tvStripped}` },
            { id: `tv:${tvStripped}` },
            { videoUrl: `tv:${tvStripped}` },
            { videoUrl: `tv-${tvStripped}` },
            { videoUrl: tvStripped },
          ] : [])
        ]
      }
    });
    if (movie) return movie;
  } catch (err) {
    console.warn("Database query failed in getMovieSafely, using catalog fallback:", err);
  }

  // 2. Fallback to CURATED_CATALOG matching by exact id, videoUrl (TMDb ID), or title slug
  const foundInCatalog = CURATED_CATALOG.find(
    (c) =>
      c.id.toLowerCase() === normalizedLower ||
      c.id.toLowerCase() === tvStripped ||
      c.videoUrl.toLowerCase() === normalizedLower ||
      c.videoUrl.toLowerCase() === tvStripped ||
      c.videoUrl.toLowerCase() === `tv:${tvStripped}` ||
      c.title.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedLower
  );

  if (foundInCatalog) {
    return {
      id: foundInCatalog.id,
      title: foundInCatalog.title,
      description: foundInCatalog.description,
      videoUrl: foundInCatalog.videoUrl,
      thumbnailUrl: foundInCatalog.thumbnailUrl,
      backdropUrl: (foundInCatalog as any).backdropUrl || null,
      releaseYear: foundInCatalog.releaseYear,
      genre: foundInCatalog.genre,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // 3. Universal Resolver: Fetch from entire global IMDb & TMDb library
  try {
    const { getUniversalMovieOrShow } = await import("@/lib/tmdb");
    const universal = await getUniversalMovieOrShow(cleanId);
    if (universal) {
      return {
        id: universal.id,
        title: universal.title,
        description: universal.description,
        videoUrl: universal.videoUrl,
        thumbnailUrl: universal.thumbnailUrl,
        backdropUrl: universal.backdropUrl || null,
        releaseYear: universal.releaseYear,
        genre: universal.genre,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  } catch (err) {
    console.warn("Universal TMDb fetch failed in getMovieSafely:", err);
  }

  return null;
}

export async function generateStaticParams() {
  return CURATED_CATALOG.map((m) => ({ id: m.id }));
}

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const movie = await getMovieSafely(id);
    if (!movie) return { title: "Movie Not Found | FilmologyX" };

    const imageUrl = (movie as any).backdropUrl || movie.thumbnailUrl;
    return {
      title: `Watch ${movie.title} (${movie.releaseYear}) Free Online in 1080p | FilmologyX`,
      description: movie.description || `Stream ${movie.title} in HD quality for free on FilmologyX.`,
      openGraph: {
        title: `${movie.title} (${movie.releaseYear}) - Watch Free in HD | FilmologyX`,
        description: movie.description || `Stream ${movie.title} online free in 1080p Full HD on FilmologyX.`,
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: movie.title }] : [],
        type: "video.movie",
        siteName: "FilmologyX",
      },
      twitter: {
        card: "summary_large_image",
        title: `Watch ${movie.title} (${movie.releaseYear}) Free on FilmologyX`,
        description: movie.description || `Stream ${movie.title} in 1080p Full HD online for free.`,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch {
    return { title: "Watch Movies Free Online | FilmologyX" };
  }
}

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieSafely(id);

  if (!movie) {
    notFound();
  }

  // Fetch dynamic, variable Recommended / Related Movies specifically for this title
  const isTv = movie.genre?.toLowerCase().includes("series") || movie.videoUrl?.startsWith("tv:");
  let relatedMovies: Array<{ id: string; title: string; genre: string; thumbnailUrl: string | null }> = [];
  let castMembers: Array<{ id: number; name: string; character: string; profileUrl: string | null }> = [];

  try {
    const { getRecommendations, getMovieCredits } = await import("@/lib/tmdb");
    const [recs, credits] = await Promise.all([
      getRecommendations(movie.videoUrl || movie.id, Boolean(isTv)),
      getMovieCredits(movie.videoUrl || movie.id, Boolean(isTv))
    ]);

    if (credits && credits.length > 0) {
      castMembers = credits;
    }

    if (recs && recs.length > 0) {
      relatedMovies = recs
        .filter((r) => r.title.toLowerCase() !== movie.title.toLowerCase() && r.id !== movie.id)
        .slice(0, 10)
        .map((r) => ({
          id: r.id,
          title: r.title,
          genre: r.genre,
          thumbnailUrl: r.thumbnailUrl,
        }));
    }
  } catch (err) {
    console.warn("Failed to fetch TMDb data:", err);
  }

  // Fallback or fill: match by genre from CURATED_CATALOG & database, shuffled so it's always variable
  if (relatedMovies.length < 10) {
    const genreWord = (movie.genre || "").split(/[\s,&/-]+/)[0].toLowerCase();

    const candidates = CURATED_CATALOG.filter((c) => {
      if (c.title.toLowerCase() === movie.title.toLowerCase() || c.id === movie.id) return false;
      if (isTv) return c.category === "series" || /series|show/i.test(c.genre);
      return !(/series|show/i.test(c.genre)) && c.genre.toLowerCase().includes(genreWord);
    });

    // Random shuffle to make it truly variable and fresh
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());

    for (const c of shuffled) {
      if (relatedMovies.length >= 10) break;
      if (!relatedMovies.some((r) => r.title.toLowerCase() === c.title.toLowerCase())) {
        relatedMovies.push({
          id: c.id,
          title: c.title,
          genre: c.genre,
          thumbnailUrl: c.thumbnailUrl,
        });
      }
    }
  }

  const { getAdSettings } = await import("@/lib/ads");
  const adSettings = getAdSettings();

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10 font-sans pb-16 sm:pb-20">
      {/* Google Movie JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Movie",
            "name": movie.title,
            "description": movie.description,
            "image": movie.thumbnailUrl || undefined,
            "dateCreated": String(movie.releaseYear),
            "genre": movie.genre,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "8.8",
              "bestRating": "10",
              "ratingCount": "2450"
            }
          })
        }}
      />

      {/* Video Player with Cinematic Ambilight Glow */}
      <div className="relative group">
        {/* Ambient Glow Background Effect */}
        <div className="absolute -inset-2 sm:-inset-6 bg-gradient-to-r from-rose-600/30 via-purple-600/25 to-rose-600/30 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-1000 -z-10" />

        <VideoPlayer 
          movieId={movie.id}
          movieVideoUrl={movie.videoUrl} 
          thumbnailUrl={movie.thumbnailUrl} 
          genre={movie.genre}
          title={movie.title}
          adDirectLink={adSettings.directLinkUrl}
          requiredClicks={adSettings.requiredClicks}
          adsEnabled={adSettings.isEnabled}
        />
      </div>

      {/* Optional Sponsor Banner Slot */}
      {adSettings.isEnabled && adSettings.bannerCode && (
        <div className="w-full flex justify-center overflow-hidden rounded-xl sm:rounded-2xl border border-purple-500/20 bg-slate-950/80 p-2.5 sm:p-3 shadow-lg">
          <div dangerouslySetInnerHTML={{ __html: adSettings.bannerCode }} />
        </div>
      )}

      {/* Movie Details & Action Header */}
      <div className="bg-slate-900/90 sm:backdrop-blur-2xl p-4 sm:p-7 md:p-10 rounded-2xl sm:rounded-3xl border border-purple-900/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500"></div>
        <div className="absolute top-0 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-rose-500/10 blur-[80px] sm:blur-[100px] pointer-events-none rounded-full"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-4 sm:mb-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-2.5 sm:mb-3">
              <span className="bg-rose-500/15 text-rose-300 border border-rose-500/30 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider text-[10px] sm:text-xs font-bold">
                {movie.genre}
              </span>
              <span className="bg-slate-800/80 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-purple-500/20 text-[10px] sm:text-xs font-semibold text-purple-200">
                {movie.releaseYear}
              </span>
              <span className="bg-amber-500/10 text-amber-300 border border-amber-500/25 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center space-x-1">
                <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-current text-amber-400" />
                <span>8.8 / 10 IMDb</span>
              </span>
              <span className="bg-slate-800/80 text-purple-300 border border-purple-500/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
                4K Ultra HD
              </span>
              <span className="bg-slate-800/80 text-purple-300 border border-purple-500/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
                Dolby 5.1
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-purple-200 tracking-tight leading-tight">
              {movie.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
            <WatchTrailerButton id={movie.videoUrl || movie.id} title={movie.title} isTv={Boolean(isTv)} variant="primary" />
            <WatchlistButton 
              movieId={movie.id} 
              title={movie.title}
              thumbnailUrl={movie.thumbnailUrl}
              genre={movie.genre}
              releaseYear={movie.releaseYear}
            />
            <ShareButton title={movie.title} />
          </div>
        </div>
        
        <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-light relative z-10 max-w-4xl">
          {movie.description}
        </p>
      </div>

      {/* Top Cast Shelf */}
      {castMembers.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
              <Users className="w-4 sm:w-5 h-4 sm:h-5 text-rose-400" />
              <span>Top Cast</span>
            </h2>
          </div>

          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none contain-paint">
            {castMembers.map((actor) => (
              <div
                key={actor.id}
                className="flex flex-col items-center text-center shrink-0 w-24 sm:w-28 group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-800 border-2 border-purple-500/20 group-hover:border-rose-500/60 transition-colors mb-2 shadow-md">
                  {actor.profileUrl ? (
                    <img
                      src={actor.profileUrl}
                      alt={actor.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                      <Users className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <h4 className="text-white text-xs font-semibold line-clamp-1 group-hover:text-rose-300 transition-colors">
                  {actor.name}
                </h4>
                {actor.character && (
                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {actor.character}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "More Like This" Recommended Movies Row */}
      {relatedMovies.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-rose-400" />
              <span>More Like This</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {relatedMovies.map((rel) => (
              <Link
                href={`/movie/${rel.id}`}
                key={rel.id}
                className="group relative flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[2/3] bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden border border-purple-900/30 transition-all duration-300 sm:group-hover:-translate-y-1.5 sm:group-hover:shadow-[0_15px_30px_rgba(244,63,94,0.3)] sm:group-hover:border-rose-500/50 contain-paint gpu-layer">
                  {rel.thumbnailUrl ? (
                    <img
                      src={rel.thumbnailUrl}
                      alt={rel.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-300 sm:group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-3 text-center">
                      <Film className="w-8 h-8 text-purple-900/50 mb-1" />
                      <span className="text-purple-300/50 text-[10px]">{rel.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-gradient-to-r from-rose-600 to-purple-600 rounded-full p-2.5 sm:p-3 shadow-lg">
                      <Play className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                    <p className="text-[9px] sm:text-[10px] text-rose-400 font-bold uppercase line-clamp-1">{rel.genre}</p>
                    <h4 className="text-white text-xs font-bold truncate group-hover:text-rose-200 transition-colors">
                      {rel.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Community Reviews & Ratings Section */}
      <div className="bg-slate-900/90 sm:backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-purple-900/30 p-4 sm:p-8 md:p-10 shadow-xl">
        <ReviewSection movieId={movie.id} />
      </div>
    </div>
  );
}
