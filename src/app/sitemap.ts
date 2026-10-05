import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { CURATED_CATALOG } from "@/lib/catalog";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes("localhost")) return process.env.NEXTAUTH_URL.replace(/\/$/, "");
  return "https://streaming-web-ochre.vercel.app";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  // 1. Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // 2. Curated Catalog Titles (Movies & TV Series)
  const seenIds = new Set<string>();
  const catalogRoutes: MetadataRoute.Sitemap = CURATED_CATALOG.map((item) => {
    seenIds.add(item.id);
    return {
      url: `${baseUrl}/movie/${item.id}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.85,
    };
  });

  // 3. Database Custom Added Movies
  let dbRoutes: MetadataRoute.Sitemap = [];
  try {
    const dbMovies = await prisma.movie.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
    });

    dbRoutes = dbMovies
      .filter((m) => !seenIds.has(m.id))
      .map((m) => ({
        url: `${baseUrl}/movie/${m.id}`,
        lastModified: m.updatedAt || now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch (err) {
    // If DB fails during static generation, catalog routes still cover all primary titles
  }

  return [...staticRoutes, ...catalogRoutes, ...dbRoutes];
}
