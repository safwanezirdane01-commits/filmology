const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  const content = fs.readFileSync('./src/lib/catalog.ts', 'utf8');
  // Simple extraction of the objects
  const movieBlocks = content.split(/\{\s*title:/g).slice(1);
  let added = 0;

  for (const block of movieBlocks) {
    const title = (block.match(/^\s*["'](.*?)["']/m) || [])[1];
    const genre = (block.match(/genre:\s*["'](.*?)["']/m) || [])[1];
    const releaseYear = parseInt((block.match(/releaseYear:\s*(\d+)/m) || [])[1]);
    const videoUrl = (block.match(/videoUrl:\s*["'](.*?)["']/m) || [])[1];
    const thumbnailUrl = (block.match(/thumbnailUrl:\s*["'](.*?)["']/m) || [])[1];
    const description = (block.match(/description:\s*["'](.*?)["']/m) || [])[1];

    if (title && genre && releaseYear && videoUrl) {
      const exists = await prisma.movie.findFirst({ where: { title } });
      if (!exists) {
        await prisma.movie.create({
          data: {
            title,
            genre,
            releaseYear,
            videoUrl,
            thumbnailUrl: thumbnailUrl || null,
            description: description || ''
          }
        });
        added++;
        console.log(`+ Added: ${title} (${genre}, ${releaseYear})`);
      }
    }
  }

  const count = await prisma.movie.count();
  console.log(`\nAuto-import complete! Newly added: ${added}, Total movies in library: ${count}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
