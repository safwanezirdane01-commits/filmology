const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear old test movies
  await prisma.review.deleteMany({});
  await prisma.watchlist.deleteMany({});
  await prisma.movie.deleteMany({});
  console.log('Cleared old placeholder movies.');

  const movies = [
    {
      title: 'Interstellar',
      genre: 'Sci-Fi',
      releaseYear: 2014,
      videoUrl: '157336', // TMDb ID -> Plays via VidLink / VidSrc
      thumbnailUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival as Earth faces catastrophic famine.'
    },
    {
      title: 'Inception',
      genre: 'Sci-Fi',
      releaseYear: 2010,
      videoUrl: '27205', // TMDb ID
      thumbnailUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.'
    },
    {
      title: 'The Dark Knight',
      genre: 'Action',
      releaseYear: 2008,
      videoUrl: '155', // TMDb ID
      thumbnailUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.'
    },
    {
      title: 'Dune: Part Two',
      genre: 'Sci-Fi',
      releaseYear: 2024,
      videoUrl: '693134', // TMDb ID
      thumbnailUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.'
    },
    {
      title: 'Spider-Man: Across the Spider-Verse',
      genre: 'Animation',
      releaseYear: 2023,
      videoUrl: '569094', // TMDb ID
      thumbnailUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
      description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.'
    },
    {
      title: 'Oppenheimer',
      genre: 'Drama',
      releaseYear: 2023,
      videoUrl: '872585', // TMDb ID
      thumbnailUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.'
    },
    {
      title: 'Sintel',
      genre: 'Animation',
      releaseYear: 2010,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&h=750&fit=crop',
      description: 'A lonely young woman named Sintel searches for a baby dragon she befriended and nursed back to health, embarking on an epic, emotional quest.'
    },
    {
      title: 'Tears of Steel',
      genre: 'Sci-Fi',
      releaseYear: 2012,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&h=750&fit=crop',
      description: 'In a dystopian future Amsterdam, a group of scientists and soldiers attempt to stage a crucial event in the past to save the world from destructive robots.'
    },
    {
      title: 'Big Buck Bunny',
      genre: 'Comedy',
      releaseYear: 2008,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&h=750&fit=crop',
      description: 'A large and lovable rabbit takes revenge on three bullying forest critters after they ruin his peaceful day and harm his butterfly friends.'
    },
    {
      title: 'Night of the Living Dead',
      genre: 'Horror',
      releaseYear: 1968,
      videoUrl: 'https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead_512kb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509248961895-40216ac55cff?w=500&h=750&fit=crop',
      description: 'A group of disparate people seek refuge from bloodthirsty ghouls in an abandoned Pennsylvania farmhouse in George A. Romero\'s horror masterpiece.'
    }
  ];

  for (const movie of movies) {
    await prisma.movie.create({ data: movie });
    console.log(`Added: ${movie.title} (${movie.videoUrl})`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
