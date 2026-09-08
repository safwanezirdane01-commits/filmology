const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function diag() {
  const movies = await p.movie.findMany();
  console.log('Total movies:', movies.length);
  
  const issues = [];
  for (const m of movies) {
    const hasThumb = m.thumbnailUrl && m.thumbnailUrl.startsWith('http');
    const hasVideo = m.videoUrl && m.videoUrl.length > 0;
    const isUnsplash = m.thumbnailUrl && m.thumbnailUrl.includes('unsplash');
    
    // Check if videoUrl is working or if thumb is missing
    if (!hasThumb || !hasVideo || isUnsplash) {
      issues.push({
        id: m.id,
        title: m.title,
        videoUrl: m.videoUrl,
        thumbnailUrl: m.thumbnailUrl,
        reason: !hasThumb ? 'Missing poster' : isUnsplash ? 'Generic Unsplash image' : 'No video'
      });
    }
  }

  console.log(`Diagnosis: Found ${issues.length} movies needing maintenance:`);
  console.table(issues);
}

diag().catch(console.error).finally(() => p.$disconnect());
