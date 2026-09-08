const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function fix() {
  await p.movie.updateMany({
    where: { title: 'Sintel' },
    data: { thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg' }
  });
  await p.movie.updateMany({
    where: { title: 'Big Buck Bunny' },
    data: { thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg' }
  });
  await p.movie.updateMany({
    where: { title: 'Tears of Steel' },
    data: { thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Tears_of_Steel_poster.jpg' }
  });
  await p.movie.updateMany({
    where: { title: 'Night of the Living Dead' },
    data: {
      thumbnailUrl: 'https://image.tmdb.org/t/p/w500/vaEjxG5uZShh3AZwl6l5PAV5tmS.jpg',
      videoUrl: '10330'
    }
  });

  console.log('Fixed posters and streams for Sintel, Big Buck Bunny, Tears of Steel, and Night of the Living Dead!');
}

fix().catch(console.error).finally(() => p.$disconnect());
