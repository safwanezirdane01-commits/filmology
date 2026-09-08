import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 });
  }
}
