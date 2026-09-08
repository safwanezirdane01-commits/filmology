export interface CatalogMovie {
  title: string;
  genre: string;
  releaseYear: number;
  videoUrl: string; // TMDb ID or Direct Stream URL
  thumbnailUrl: string;
  description: string;
  category: "action" | "scifi" | "animation" | "horror" | "drama" | "classic";
}

export const CURATED_CATALOG: CatalogMovie[] = [
  // --- ACTION & ADVENTURE ---
  {
    title: "Deadpool & Wolverine",
    genre: "Action",
    releaseYear: 2024,
    videoUrl: "533535",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    description: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary Deadpool behind him. But when his homeworld faces an existential threat, he must reluctantly suit-up again with Wolverine.",
    category: "action"
  },
  {
    title: "The Dark Knight",
    genre: "Action",
    releaseYear: 2008,
    videoUrl: "155",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    category: "action"
  },
  {
    title: "Avengers: Endgame",
    genre: "Action",
    releaseYear: 2019,
    videoUrl: "299534",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions.",
    category: "action"
  },
  {
    title: "Gladiator II",
    genre: "Action",
    releaseYear: 2024,
    videoUrl: "558449",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    description: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors.",
    category: "action"
  },
  {
    title: "John Wick: Chapter 4",
    genre: "Action",
    releaseYear: 2023,
    videoUrl: "603692",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/vZloFAK7NKnMGKEslUsZloUfEc4.jpg",
    description: "With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances.",
    category: "action"
  },
  {
    title: "Top Gun: Maverick",
    genre: "Action",
    releaseYear: 2022,
    videoUrl: "361743",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on an impossible mission.",
    category: "action"
  },
  {
    title: "Mad Max: Fury Road",
    genre: "Action",
    releaseYear: 2015,
    videoUrl: "76341",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
    description: "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken, and almost everyone is crazed fighting for the necessities of life.",
    category: "action"
  },

  // --- SCI-FI ---
  {
    title: "Interstellar",
    genre: "Sci-Fi",
    releaseYear: 2014,
    videoUrl: "157336",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    description: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    category: "scifi"
  },
  {
    title: "Inception",
    genre: "Sci-Fi",
    releaseYear: 2010,
    videoUrl: "27205",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    description: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance to regain his old life as payment for a task considered impossible.",
    category: "scifi"
  },
  {
    title: "Dune: Part Two",
    genre: "Sci-Fi",
    releaseYear: 2024,
    videoUrl: "693134",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    description: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    category: "scifi"
  },
  {
    title: "The Matrix",
    genre: "Sci-Fi",
    releaseYear: 1999,
    videoUrl: "603",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    description: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    category: "scifi"
  },
  {
    title: "Avatar: The Way of Water",
    genre: "Sci-Fi",
    releaseYear: 2022,
    videoUrl: "76600",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    description: "Set more than a decade after the events of the first film, learn the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe.",
    category: "scifi"
  },
  {
    title: "Blade Runner 2049",
    genre: "Sci-Fi",
    releaseYear: 2017,
    videoUrl: "335984",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    description: "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
    category: "scifi"
  },

  // --- ANIMATION ---
  {
    title: "Spider-Man: Across the Spider-Verse",
    genre: "Animation",
    releaseYear: 2023,
    videoUrl: "569094",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    description: "After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society.",
    category: "animation"
  },
  {
    title: "Inside Out 2",
    genre: "Animation",
    releaseYear: 2024,
    videoUrl: "1022789",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    description: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust face Anxiety.",
    category: "animation"
  },
  {
    title: "Spirited Away",
    genre: "Animation",
    releaseYear: 2001,
    videoUrl: "129",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    description: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had.",
    category: "animation"
  },
  {
    title: "The Lion King",
    genre: "Animation",
    releaseYear: 1994,
    videoUrl: "8587",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
    description: "A young lion prince is cast out of his pride by his cruel uncle, who claims he killed his father. While the uncle rules with an iron paw, the prince grows beyond the Savannah.",
    category: "animation"
  },
  {
    title: "Sintel",
    genre: "Animation",
    releaseYear: 2010,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&h=750&fit=crop",
    description: "A lonely young woman searches for a baby dragon she befriended and nursed back to health, embarking on an epic, emotional quest across a dangerous desert.",
    category: "animation"
  },
  {
    title: "Big Buck Bunny",
    genre: "Animation",
    releaseYear: 2008,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&h=750&fit=crop",
    description: "A large and lovable rabbit takes revenge on three bullying forest critters after they ruin his peaceful day and harm his butterfly friends.",
    category: "animation"
  },

  // --- DRAMA & THRILLER ---
  {
    title: "Oppenheimer",
    genre: "Drama",
    releaseYear: 2023,
    videoUrl: "872585",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    description: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II, examining the scientific triumph and moral catastrophe.",
    category: "drama"
  },
  {
    title: "Fight Club",
    genre: "Drama",
    releaseYear: 1999,
    videoUrl: "550",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    description: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on with underground fight clubs.",
    category: "drama"
  },
  {
    title: "Pulp Fiction",
    genre: "Thriller",
    releaseYear: 1994,
    videoUrl: "680",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    description: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
    category: "drama"
  },
  {
    title: "The Shawshank Redemption",
    genre: "Drama",
    releaseYear: 1994,
    videoUrl: "278",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    description: "Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",
    category: "drama"
  },
  {
    title: "Joker",
    genre: "Drama",
    releaseYear: 2019,
    videoUrl: "475557",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    description: "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.",
    category: "drama"
  },

  // --- HORROR ---
  {
    title: "A Quiet Place: Day One",
    genre: "Horror",
    releaseYear: 2024,
    videoUrl: "762441",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/yrpPYK2qm9rl5AcwhTCtYflCuHN.jpg",
    description: "As New York City is invaded by alien creatures who hunt by sound, a woman named Sam must fight to survive alongside her cat Frodo on the day the world went quiet.",
    category: "horror"
  },
  {
    title: "The Conjuring",
    genre: "Horror",
    releaseYear: 2013,
    videoUrl: "138843",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
    description: "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
    category: "horror"
  },
  {
    title: "Hereditary",
    genre: "Horror",
    releaseYear: 2018,
    videoUrl: "493922",
    thumbnailUrl: "https://image.tmdb.org/t/p/w500/p9fmuz2Oj3HtEJHG4uI9pYuhTq.jpg",
    description: "When Ellen, the matriarch of the Graham family, passes away, her daughter's family begins to unravel cryptic and increasingly terrifying secrets about their ancestry.",
    category: "horror"
  },
  {
    title: "Night of the Living Dead",
    genre: "Horror",
    releaseYear: 1968,
    videoUrl: "https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead_512kb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1509248961895-40216ac55cff?w=500&h=750&fit=crop",
    description: "A group of disparate people seek refuge from bloodthirsty ghouls in an abandoned Pennsylvania farmhouse in George A. Romero's horror masterpiece.",
    category: "horror"
  }
];
