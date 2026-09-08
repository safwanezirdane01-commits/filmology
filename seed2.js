const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const movies = [
    {
      title: 'Cosmos Laundromat',
      genre: 'Animation',
      releaseYear: 2015,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534996858221-380b92700493?w=400&h=600&fit=crop',
      description: 'On a desolate island, a suicidal sheep named Franck meets a mysterious stranger who offers him an escape.'
    },
    {
      title: 'The Dark Room',
      genre: 'Horror',
      releaseYear: 2022,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509248961895-40216ac55cff?w=400&h=600&fit=crop',
      description: 'A group of friends discover a hidden room that holds terrifying secrets from the past.'
    },
    {
      title: 'Ocean Depths',
      genre: 'Documentary',
      releaseYear: 2023,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop',
      description: 'Dive into the mysterious world beneath the ocean surface and discover creatures beyond imagination.'
    },
    {
      title: 'Speed Racers',
      genre: 'Action',
      releaseYear: 2024,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=600&fit=crop',
      description: 'High-speed racing through the streets of a futuristic city where only the fastest survive.'
    }
  ];

  for (const movie of movies) {
    await prisma.movie.create({
      data: movie
    });
    console.log(`Added movie: ${movie.title}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
