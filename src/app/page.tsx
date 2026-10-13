import { prisma } from "@/lib/prisma";
import { CURATED_CATALOG } from "@/lib/catalog";
import { getTrendingMovies, getTopRatedMovies } from "@/lib/tmdb";
import Link from "next/link";
import { Search } from "lucide-react";
import MovieCatalogView from "@/components/MovieCatalogView";
import HeroSpotlightCarousel, { SpotlightItem } from "@/components/HeroSpotlightCarousel";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";
import HomeClientWrapper from "@/components/HomeClientWrapper";
import HomeBannerFooter from "@/components/HomeBannerFooter";
import HomeSearchBox from "@/components/HomeSearchBox";

export const dynamic = "force-dynamic";

export default async function Home() {
  let dbMovies: any[] = [];
  try {
    dbMovies = await prisma.movie.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("Prisma findMany failed on Home, using catalog fallback:", err);
  }

  // Combine CURATED_CATALOG with database movies
  const movieMap = new Map<string, any>();
  for (const item of CURATED_CATALOG) {
    movieMap.set(item.title.toLowerCase().trim(), item);
  }
  for (const dbItem of dbMovies) {
    const key = dbItem.title.toLowerCase().trim();
    if (movieMap.has(key)) {
      const existing = movieMap.get(key);
      movieMap.set(key, {
        ...existing,
        ...dbItem,
        id: existing.id,
        thumbnailUrl: existing.thumbnailUrl || dbItem.thumbnailUrl,
        genre: existing.genre || dbItem.genre,
      });
    } else {
      movieMap.set(key, dbItem);
    }
  }
  const movies = Array.from(movieMap.values());

  // Fetch live worldwide trending and top rated movies in parallel from TMDb
  const [liveTrending, liveTopRated] = await Promise.all([
    getTrendingMovies(1).catch(() => []),
    getTopRatedMovies(1).catch(() => []),
  ]);

  // Curate Spotlight Carousel (top 6-8 standout blockbusters & trending hits)
  const spotlightCandidates: SpotlightItem[] = [];

  // Add top trending hits from TMDb
  for (const t of liveTrending.slice(0, 4)) {
    spotlightCandidates.push({
      id: t.id,
      title: t.title,
      genre: t.genre,
      releaseYear: t.releaseYear,
      description: t.description,
      descriptionAr: (t as any).descriptionAr,
      descriptions: (t as any).descriptions,
      thumbnailUrl: t.thumbnailUrl,
      backdropUrl: t.backdropUrl,
      voteAverage: t.voteAverage || 8.8,
      tag: "🔥 #1 Worldwide Trending",
    });
  }

  // Add curated top blockbusters from library (Dune 2, Deadpool, Interstellar, Gladiator, Oppenheimer)
  const topBlockbusters = movies.filter(m =>
    /dune|deadpool|gladiator|interstellar|oppenheimer|dark knight|spider-man/i.test(m.title)
  ).slice(0, 4);

  for (const b of topBlockbusters) {
    spotlightCandidates.push({
      id: b.id,
      title: b.title,
      genre: b.genre,
      releaseYear: b.releaseYear,
      description: b.description,
      descriptionAr: (b as any).descriptionAr,
      descriptions: (b as any).descriptions,
      thumbnailUrl: b.thumbnailUrl,
      backdropUrl: b.thumbnailUrl,
      voteAverage: 8.9,
      tag: "⭐ All-Time Masterpiece",
    });
  }

  // Fallback if needed
  if (spotlightCandidates.length === 0 && movies.length > 0) {
    for (const m of movies.slice(0, 6)) {
      spotlightCandidates.push({
        id: m.id,
        title: m.title,
        genre: m.genre,
        releaseYear: m.releaseYear,
        description: m.description,
        descriptionAr: (m as any).descriptionAr,
        descriptions: (m as any).descriptions,
        thumbnailUrl: m.thumbnailUrl,
        backdropUrl: m.thumbnailUrl,
        voteAverage: 8.8,
      });
    }
  }

  // Curate TV Series list
  const tvSeries = movies.filter(
    (m) => m.category === "series" || /series|show/i.test(m.genre)
  );

  // Curate Top Rated Masterpieces
  const topRatedShelves = movies.filter(
    (m) => m.category !== "series" && !/series|show/i.test(m.genre)
  ).slice(0, 15);

  return (
    <div className="flex flex-col min-h-screen font-sans -mt-4 space-y-8 sm:space-y-12">
      {/* 🎬 DYNAMIC ROTATING HERO SPOTLIGHT CAROUSEL */}
      <HeroSpotlightCarousel movies={spotlightCandidates} />

      {/* Modern Floating Search Box */}
      <HomeSearchBox />

      {/* Continue Watching Row (Active Playback History) */}
      <ContinueWatchingRow />

      {/* 
        HomeClientWrapper handles all translatable sections:
        - Feature Highlights Bar
        - Curated Shelves (Trending, Masterpieces, TV Series)
        - Browse Film Collection heading
      */}
      <HomeClientWrapper
        liveTrending={liveTrending as any[]}
        topRatedShelves={topRatedShelves as any[]}
        tvSeries={tvSeries as any[]}
      />

      {/* Main Movies Catalog with Live Filtering */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-24">
        <MovieCatalogView movies={movies} />
      </main>

      {/* Banner + Footer (client component for translations) */}
      <HomeBannerFooter />
    </div>
  );
}
