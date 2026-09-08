const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Update all movie URLs to HTTPS
  const movies = await p.movie.findMany();
  for (const movie of movies) {
    if (movie.videoUrl && movie.videoUrl.startsWith('http://')) {
      await p.movie.update({
        where: { id: movie.id },
        data: { videoUrl: movie.videoUrl.replace('http://', 'https://') },
      });
      console.log('Fixed:', movie.title);
    }
  }
  console.log('All URLs updated to HTTPS!');
  await p.$disconnect();
}

main();
