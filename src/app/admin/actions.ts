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
