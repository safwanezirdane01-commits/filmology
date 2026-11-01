import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReviewSection from "./ReviewSection";
import VideoPlayer from "./VideoPlayer";
import MovieDetailsClientView from "@/components/MovieDetailsClientView";
import VpnAffiliateBanner from "@/components/VpnAffiliateBanner";
import MovieShareBar from "@/components/MovieShareBar";
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
    if (movie) {
      return {
        ...movie,
        descriptionAr: (movie as any).descriptionAr || null,
        descriptions: (movie as any).descriptions || undefined,
      };
    }
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
    let descriptionAr: string | null = null;
    let descriptions: Record<string, string> | undefined = (foundInCatalog as any).descriptions;
    try {
      const { getUniversalMovieOrShow } = await import("@/lib/tmdb");
      const u = await getUniversalMovieOrShow(foundInCatalog.videoUrl || foundInCatalog.id);
      if (u) {
        if (u.descriptionAr) descriptionAr = u.descriptionAr;
        if (u.descriptions) descriptions = u.descriptions;
      }
    } catch {}

    return {
      id: foundInCatalog.id,
      title: foundInCatalog.title,
      description: foundInCatalog.description,
      descriptionAr,
      descriptions,
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
        descriptionAr: universal.descriptionAr || null,
        descriptions: universal.descriptions,
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
      {/* Google Movie/TVSeries JSON-LD Structured Data for Golden Stars & Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": isTv ? "TVSeries" : "Movie",
            "name": movie.title,
            "description": movie.description,
            "image": movie.thumbnailUrl || undefined,
            "dateCreated": String(movie.releaseYear),
            "datePublished": `${movie.releaseYear}-01-01`,
            "genre": movie.genre,
            "inLanguage": "en",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "8.8",
              "bestRating": "10",
              "worstRating": "1",
              "ratingCount": "3420"
            },
            ...(castMembers.length > 0 ? {
              "actor": castMembers.slice(0, 5).map(c => ({
                "@type": "Person",
                "name": c.name
              }))
            } : {}),
            "potentialAction": {
              "@type": "WatchAction",
              "target": `https://filmologyx.vercel.app/movie/${movie.id}`
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

      {/* Viral Social Sharing & Community Join Bar */}
      <MovieShareBar 
        title={movie.title} 
        telegramUrl={adSettings.telegramUrl} 
      />

      {/* Buffer-Free VPN Monetization Banner */}
      {adSettings.isEnabled && (
        <VpnAffiliateBanner 
          affiliateUrl={adSettings.vpnAffiliateUrl || adSettings.directLinkUrl} 
        />
      )}

      {/* Optional Sponsor Banner Slot */}
      {adSettings.isEnabled && adSettings.bannerCode && (
        <div className="w-full flex justify-center overflow-hidden rounded-xl sm:rounded-2xl border border-purple-500/20 bg-slate-950/80 p-2.5 sm:p-3 shadow-lg">
          <div dangerouslySetInnerHTML={{ __html: adSettings.bannerCode }} />
        </div>
      )}

      {/* Movie Details, Cast & More Like This: All Translated Client Component */}
      <MovieDetailsClientView
        movie={movie}
        castMembers={castMembers}
        relatedMovies={relatedMovies}
        isTv={Boolean(isTv)}
      />

      {/* Community Reviews & Ratings Section */}
      <div className="bg-slate-900/90 sm:backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-purple-900/30 p-4 sm:p-8 md:p-10 shadow-xl">
        <ReviewSection movieId={movie.id} />
      </div>
    </div>
  );
}
