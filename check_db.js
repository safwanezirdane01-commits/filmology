const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const movies = await prisma.movie.findMany();
  console.log('Total movies in database:', movies.length);
  
  const badMovies = [];
  movies.forEach(m => {
    const v = (m.videoUrl || '').trim();
    const isImdb = /^tt\d+$/i.test(v);
    const isTmdb = /^\d+$/.test(v);
    const isTvTmdb = /^tv:\d+$/i.test(v);
    const isHttp = v.startsWith('http');
    
    if (!isImdb && !isTmdb && !isTvTmdb && !isHttp) {
      badMovies.push({ id: m.id, title: m.title, videoUrl: m.videoUrl });
    }
  });

  console.log('Movies with invalid videoUrl:', badMovies.length);
  if (badMovies.length > 0) {
    console.log('Invalid movies:', badMovies);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
