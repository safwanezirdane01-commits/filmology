import { prisma } from "@/lib/prisma";
import { CURATED_CATALOG } from "@/lib/catalog";
import Link from "next/link";
import { Play, Film, Search as SearchIcon } from "lucide-react";

type SearchProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: SearchProps) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : "";
  
  let movies: any[] = [];
  
  if (q) {
    try {
      movies = await prisma.movie.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { genre: { contains: q } }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (err) {
      console.warn("Prisma search failed, falling back to CURATED_CATALOG:", err);
    }

    if (!movies || movies.length === 0) {
      const qLower = q.toLowerCase();
      movies = CURATED_CATALOG.filter(
        (m) =>
          m.title.toLowerCase().includes(qLower) ||
          m.genre.toLowerCase().includes(qLower)
      );
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center">
          <SearchIcon className="mr-3 text-blue-500 w-8 h-8" />
          {q ? `Search Results for "${q}"` : "Search Movies"}
        </h1>

        {/* Search Input for Mobile/Page */}
        <div className="mb-12 max-w-2xl">
          <form action="/search" method="GET" className="relative">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-4 w-6 h-6 text-gray-400" />
              <input 
                type="text" 
                name="q" 
                defaultValue={q}
                placeholder="Search movies, genres..." 
                className="w-full bg-gray-800 border border-gray-700 text-white px-12 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg text-lg"
              />
              <button type="submit" className="absolute right-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
                Search
              </button>
            </div>
          </form>
        </div>

        {!q ? (
          <div className="text-center text-gray-500 py-20 bg-gray-800/50 rounded-2xl border border-gray-700">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-xl">Enter a search term to find movies or genres.</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center text-gray-500 py-20 bg-gray-800/50 rounded-2xl border border-gray-700">
            <Film className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-xl">No movies found matching "{q}".</p>
            <p className="mt-2 text-gray-400">Try checking your spelling or searching for another term.</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-400 mb-6">Found {movies.length} result{movies.length === 1 ? '' : 's'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {movies.map((movie) => (
                <Link href={`/movie/${movie.id}`} key={movie.id} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:border-blue-500/50">
                    {movie.thumbnailUrl ? (
                      <img src={movie.thumbnailUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 p-4 text-center">
                        <Film className="w-12 h-12 text-gray-600 mb-2" />
                        <span className="text-gray-400 text-sm">{movie.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-80" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-blue-600/90 rounded-full p-4 transform scale-50 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-8 h-8 text-white fill-current ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <div className="text-xs font-bold text-blue-400 mb-1 uppercase tracking-wider">{movie.genre}</div>
                      <h3 className="font-bold text-white text-lg leading-tight truncate drop-shadow-md">{movie.title}</h3>
                      <div className="text-sm text-gray-300 mt-1">{movie.releaseYear}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
