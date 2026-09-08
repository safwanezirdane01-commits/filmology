"use server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addMovie(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  // For local development, we'll allow it if there's a session. 
  // In production, you would enforce session.user.role === "ADMIN"
  if (!session) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const thumbnailUrl = formData.get("thumbnailUrl") as string;
  const releaseYear = parseInt(formData.get("releaseYear") as string);
  const genre = formData.get("genre") as string;

  await prisma.movie.create({
    data: {
      title,
      description,
      videoUrl: videoUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      releaseYear: isNaN(releaseYear) ? new Date().getFullYear() : releaseYear,
      genre,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteMovie(movieId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Delete associated watchlists and reviews first
  await prisma.watchlist.deleteMany({ where: { movieId } });
  await prisma.review.deleteMany({ where: { movieId } });
  
  await prisma.movie.delete({
    where: { id: movieId },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function importCatalogMovies(category?: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { CURATED_CATALOG } = await import("@/lib/catalog");
  const filtered = category 
    ? CURATED_CATALOG.filter(m => m.category === category)
    : CURATED_CATALOG;

  let addedCount = 0;
  for (const m of filtered) {
    const exists = await prisma.movie.findFirst({
      where: { title: m.title }
    });

    if (!exists) {
      await prisma.movie.create({
        data: {
          title: m.title,
          genre: m.genre,
          releaseYear: m.releaseYear,
          videoUrl: m.videoUrl,
          thumbnailUrl: m.thumbnailUrl,
          description: m.description
        }
      });
      addedCount++;
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, count: addedCount, totalProcessed: filtered.length };
}

export async function importTmdbTrendingMovies(apiKey?: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { fetchTrendingFromTmdb } = await import("@/lib/tmdb");
  const movies = await fetchTrendingFromTmdb(apiKey, 20);

  if (!movies || movies.length === 0) {
    return { success: false, error: "No movies found or TMDB API key is missing." };
  }

  let addedCount = 0;
  for (const m of movies) {
    const exists = await prisma.movie.findFirst({
      where: { title: m.title }
    });

    if (!exists) {
      await prisma.movie.create({
        data: {
          title: m.title,
          genre: m.genre,
          releaseYear: m.releaseYear,
          videoUrl: m.videoUrl,
          thumbnailUrl: m.thumbnailUrl,
          description: m.description
        }
      });
      addedCount++;
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, count: addedCount, totalProcessed: movies.length };
}

export async function importTmdbById(id: string, apiKey?: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { fetchFromTmdbById } = await import("@/lib/tmdb");
  const movie = await fetchFromTmdbById(id, apiKey);

  if (!movie) {
    return { success: false, error: "Movie not found on TMDB with this ID." };
  }

  const exists = await prisma.movie.findFirst({
    where: { title: movie.title }
  });

  if (exists) {
    return { success: false, error: `"${movie.title}" is already in your library.` };
  }

  const created = await prisma.movie.create({
    data: {
      title: movie.title,
      genre: movie.genre,
      releaseYear: movie.releaseYear,
      videoUrl: movie.videoUrl,
      thumbnailUrl: movie.thumbnailUrl,
      description: movie.description
    }
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, movie: created };
}

export async function searchTmdbMovies(query: string, apiKey?: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { searchTmdb } = await import("@/lib/tmdb");
  return await searchTmdb(query, apiKey);
}
