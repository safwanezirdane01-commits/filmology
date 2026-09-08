import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://filmologyx.com";

  const movies = await prisma.movie.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const movieUrls: MetadataRoute.Sitemap = movies.map((movie) => ({
    url: `${baseUrl}/movie/${movie.id}`,
    lastModified: movie.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...movieUrls,
  ];
}
