const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const TARGETS = [
  { title: "The Last of Us", url: "https://www.themoviedb.org/tv/100088" },
  { title: "Arcane", url: "https://www.themoviedb.org/tv/94605" },
  { title: "John Wick: Chapter 4", url: "https://www.themoviedb.org/movie/603692" },
  { title: "A Quiet Place: Day One", url: "https://www.themoviedb.org/movie/762441" },
  { title: "Hereditary", url: "https://www.themoviedb.org/movie/493922" },
  { title: "Schindler's List", url: "https://www.themoviedb.org/movie/424" },
  { title: "The Green Mile", url: "https://www.themoviedb.org/movie/497" },
  { title: "Tears of Steel", url: "https://www.themoviedb.org/movie/131157" }
];

async function run() {
  for (const item of TARGETS) {
    try {
      const res = await fetch(item.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });
      const html = await res.text();
      const match = html.match(/property="og:image"\s+content="(https:\/\/[^"]+w500[^"]+)"/i) ||
                    html.match(/property="og:image"\s+content="([^"]+)"/i);
      
      if (match && match[1]) {
        let posterUrl = match[1];
        if (posterUrl.startsWith('/')) {
          posterUrl = 'https://image.tmdb.org' + posterUrl;
        }
        await p.movie.updateMany({
          where: { title: item.title },
          data: { thumbnailUrl: posterUrl }
        });
        console.log(`✓ Updated ${item.title} -> ${posterUrl}`);
      } else {
        console.log(`✗ No og:image found for ${item.title}`);
      }
    } catch (e) {
      console.error(`Error on ${item.title}:`, e.message);
    }
  }
}

run().catch(console.error).finally(() => p.$disconnect());
