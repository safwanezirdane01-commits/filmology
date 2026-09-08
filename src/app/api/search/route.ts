import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { CURATED_CATALOG } from "@/lib/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const movies = await prisma.movie.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { genre: { contains: q } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    if (movies && movies.length > 0) {
      return NextResponse.json(movies);
    }
  } catch (error) {
    console.error("Prisma search failed, falling back to catalog:", error);
  }

  // Fallback search over CURATED_CATALOG
  const filtered = CURATED_CATALOG
    .filter(
      (m) =>
        m.title.toLowerCase().includes(q.toLowerCase()) ||
        m.genre.toLowerCase().includes(q.toLowerCase())
    )
    .slice(0, 20)
    .map((m) => ({
      id: m.id || m.videoUrl,
      title: m.title,
      description: m.description,
      videoUrl: m.videoUrl,
      thumbnailUrl: m.thumbnailUrl,
      releaseYear: m.releaseYear,
      genre: m.genre,
    }));

  return NextResponse.json(filtered);
}
