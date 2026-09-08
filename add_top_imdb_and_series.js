const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const TITLES = [
  // --- TOP ALL-TIME IMDB MOVIES ---
  {
    title: "The Godfather",
    genre: "Drama",
    releaseYear: 1972,
    videoUrl: "238",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    description: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in."
  },
  {
    title: "The Godfather Part II",
    genre: "Drama",
    releaseYear: 1974,
    videoUrl: "240",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
    description: "In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York. In the 1950s, Michael Corleone attempts to expand the family business into Las Vegas, Hollywood and Cuba."
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    genre: "Action",
    releaseYear: 2003,
    videoUrl: "122",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    description: "As armies mass for a final battle that will decide the fate of the world--and powerful, ancient forces of Light and Dark compete to determine the outcome--one member of the fellowship of the ring is revealed as the noble heir to the throne of the Kings of Men."
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    genre: "Action",
    releaseYear: 2001,
    videoUrl: "120",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    description: "Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home behind in order to begin an epic quest to the Mount of Doom in order to destroy it among his fellowship."
  },
  {
    title: "Schindler's List",
    genre: "Drama",
    releaseYear: 1993,
    videoUrl: "424",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQYR0.jpg",
    description: "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II."
  },
  {
    title: "12 Angry Men",
    genre: "Drama",
    releaseYear: 1957,
    videoUrl: "389",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",
    description: "The defense and the prosecution have rested and the jury is filing into the jury room to decide if an 18-year-old native boy is guilty of murdering his father."
  },
  {
    title: "Forrest Gump",
    genre: "Drama",
    releaseYear: 1994,
    videoUrl: "13",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    description: "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do."
  },
  {
    title: "The Green Mile",
    genre: "Drama",
    releaseYear: 1999,
    videoUrl: "497",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/8VG8fDNiy5087BelbBa5m8Knsq2.jpg",
    description: "A supernatural tale for the ages set along death row in a southern prison, where gentle giant John Coffey possesses the mysterious power to heal people's ailments and take their pain away."
  },
  {
    title: "Se7en",
    genre: "Thriller",
    releaseYear: 1995,
    videoUrl: "807",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg",
    description: "Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the 'seven deadly sins' in this dark and haunting psychological thriller."
  },
  {
    title: "The Silence of the Lambs",
    genre: "Thriller",
    releaseYear: 1991,
    videoUrl: "274",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
    description: "Clarice Starling is a top student at the FBI's training academy. Jack Crawford wants Clarice to interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath serving life behind bars."
  },

  // --- TOP TV SERIES (WITH SEASONS & EPISODES) ---
  {
    title: "Breaking Bad",
    genre: "TV Series",
    releaseYear: 2008,
    videoUrl: "tv:1396",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
    description: "Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of two years left to live. He turns to manufacturing and selling methamphetamine to secure his family's future."
  },
  {
    title: "Game of Thrones",
    genre: "TV Series",
    releaseYear: 2011,
    videoUrl: "tv:1399",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    description: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north."
  },
  {
    title: "Stranger Things",
    genre: "TV Series",
    releaseYear: 2016,
    videoUrl: "tv:66732",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl with telekinetic powers."
  },
  {
    title: "The Last of Us",
    genre: "TV Series",
    releaseYear: 2023,
    videoUrl: "tv:100088",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/uKvVjK19yM2Ijs0jvt16yqQ5Uv9.jpg",
    description: "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone."
  },
  {
    title: "Arcane",
    genre: "TV Series",
    releaseYear: 2021,
    videoUrl: "tv:94605",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/abf8tJaynedFQARBiHGzPWJ5Z76.jpg",
    description: "Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and incompatible convictions in this animated masterpiece."
  },
  {
    title: "Peaky Blinders",
    genre: "TV Series",
    releaseYear: 2013,
    videoUrl: "tv:60574",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    description: "A gangster family epic set in 1919 Birmingham, England and centered on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby."
  }
];

async function addAll() {
  let added = 0;
  for (const item of TITLES) {
    const exists = await p.movie.findFirst({ where: { title: item.title } });
    if (!exists) {
      await p.movie.create({
        data: {
          title: item.title,
          genre: item.genre,
          releaseYear: item.releaseYear,
          videoUrl: item.videoUrl,
          thumbnailUrl: item.thumbnailUrl,
          description: item.description
        }
      });
      added++;
      console.log(`+ Added: ${item.title} (${item.genre})`);
    } else {
      console.log(`- Already exists: ${item.title}`);
    }
  }

  const total = await p.movie.count();
  console.log(`\nDone! Added ${added} new titles. Total library size: ${total}`);
}

addAll().catch(console.error).finally(() => p.$disconnect());
