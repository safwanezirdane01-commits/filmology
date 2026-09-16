export interface CatalogMovie {
  id: string;
  title: string;
  genre: string;
  releaseYear: number;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  category: "action" | "scifi" | "animation" | "horror" | "drama" | "classic" | "series" | "comedy" | "romance" | "arabic" | string;
}

export const CURATED_CATALOG: CatalogMovie[] = [
  // ============================================================
  //  ORIGINAL 42 ENTRIES (unchanged)
  // ============================================================
  {
    "id": "cmtt1wf490003vk8s6gevvgd8",
    "title": "Dune: Part Two",
    "genre": "Sci-Fi",
    "releaseYear": 2024,
    "videoUrl": "693134",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    "description": "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    "category": "scifi"
  },
  {
    "id": "cmtt295eh0000vkswak8x8hsu",
    "title": "Deadpool & Wolverine",
    "genre": "Action",
    "releaseYear": 2024,
    "videoUrl": "533535",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    "description": "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary Deadpool behind him. But when his homeworld faces an existential threat, he must reluctantly suit-up again with Wolverine.",
    "category": "action"
  },
  {
    "id": "cmtt295f70002vksw50ww6ha4",
    "title": "Gladiator II",
    "genre": "Action",
    "releaseYear": 2024,
    "videoUrl": "558449",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    "description": "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors.",
    "category": "action"
  },
  {
    "id": "cmtt295he0009vkswdpuaovcz",
    "title": "Inside Out 2",
    "genre": "Animation",
    "releaseYear": 2024,
    "videoUrl": "1022789",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    "description": "Teenager Riley's mind headquarters welcomes new emotions as she navigates the challenges of growing up.",
    "category": "animation"
  },
  {
    "id": "cmtt295jj000gvkswq3hn4z0c",
    "title": "A Quiet Place: Day One",
    "genre": "Horror",
    "releaseYear": 2024,
    "videoUrl": "762441",
    "thumbnailUrl": "https://media.themoviedb.org/t/p/w500/hU42CRk14JuPEdqZG3AWmagiPAP.jpg",
    "description": "As New York City is invaded by alien creatures who hunt by sound, a woman named Sam must fight to survive alongside her cat Frodo on the day the world went quiet.",
    "category": "horror"
  },
  {
    "id": "cmtt1wf4k0004vk8snya3iqlg",
    "title": "Spider-Man: Across the Spider-Verse",
    "genre": "Animation",
    "releaseYear": 2023,
    "videoUrl": "569094",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    "description": "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    "category": "animation"
  },
  {
    "id": "cmtt1wf4u0005vk8sfi6lgtq0",
    "title": "Oppenheimer",
    "genre": "Drama",
    "releaseYear": 2023,
    "videoUrl": "872585",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    "description": "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    "category": "drama"
  },
  {
    "id": "cmtt295fi0003vkswklqkhp8t",
    "title": "John Wick: Chapter 4",
    "genre": "Action",
    "releaseYear": 2023,
    "videoUrl": "603692",
    "thumbnailUrl": "https://media.themoviedb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    "description": "With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances.",
    "category": "action"
  },
  {
    "id": "cmtt7udh1000dvkeoa5xetq8l",
    "title": "The Last of Us",
    "genre": "TV Series",
    "releaseYear": 2023,
    "videoUrl": "tv:100088",
    "thumbnailUrl": "https://media.themoviedb.org/t/p/w500/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg",
    "description": "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone.",
    "category": "series"
  },
  {
    "id": "cmtt295fs0004vkswtq0dlwku",
    "title": "Top Gun: Maverick",
    "genre": "Action",
    "releaseYear": 2022,
    "videoUrl": "361743",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    "description": "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission.",
    "category": "action"
  },
  {
    "id": "cmtt295gq0007vkswlhmth8mx",
    "title": "Avatar: The Way of Water",
    "genre": "Sci-Fi",
    "releaseYear": 2022,
    "videoUrl": "76600",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    "description": "Set more than a decade after the events of the first film, learn the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe.",
    "category": "scifi"
  },
  {
    "id": "cmtt7udik000evkeoyixtrvfs",
    "title": "Arcane",
    "genre": "TV Series",
    "releaseYear": 2021,
    "videoUrl": "tv:94605",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
    "description": "Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and incompatible convictions in this animated masterpiece.",
    "category": "series"
  },
  {
    "id": "cmtt295eu0001vkswh8nmvnx5",
    "title": "Avengers: Endgame",
    "genre": "Action",
    "releaseYear": 2019,
    "videoUrl": "299534",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    "description": "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions.",
    "category": "action"
  },
  {
    "id": "cmtt295j8000fvksw930wqmlj",
    "title": "Joker",
    "genre": "Drama",
    "releaseYear": 2019,
    "videoUrl": "475557",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    "description": "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.",
    "category": "drama"
  },
  {
    "id": "cmtt295k5000ivkswje37uz1d",
    "title": "Hereditary",
    "genre": "Horror",
    "releaseYear": 2018,
    "videoUrl": "493922",
    "thumbnailUrl": "https://media.themoviedb.org/t/p/w500/4GFPuL14eXi66V96xBWY73Y9PfR.jpg",
    "description": "When Ellen, the matriarch of the Graham family, passes away, her daughter's family begins to unravel cryptic and increasingly terrifying secrets.",
    "category": "horror"
  },
  {
    "id": "cmtt295h30008vkswq6sjtncv",
    "title": "Blade Runner 2049",
    "genre": "Sci-Fi",
    "releaseYear": 2017,
    "videoUrl": "335984",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    "description": "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
    "category": "scifi"
  },
  {
    "id": "cmtt7udgo000cvkeojupvidmp",
    "title": "Stranger Things",
    "genre": "TV Series",
    "releaseYear": 2016,
    "videoUrl": "tv:66732",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    "description": "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl with telekinetic powers.",
    "category": "series"
  },
  {
    "id": "cmtt295g30005vkswz7nilxil",
    "title": "Mad Max: Fury Road",
    "genre": "Action",
    "releaseYear": 2015,
    "videoUrl": "76341",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
    "description": "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken, and almost everyone is crazed fighting for the necessities of life.",
    "category": "action"
  },
  {
    "id": "cmtt1wf3g0000vk8sgc7cejok",
    "title": "Interstellar",
    "genre": "Sci-Fi",
    "releaseYear": 2014,
    "videoUrl": "157336",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces catastrophic famine.",
    "category": "scifi"
  },
  {
    "id": "cmtt295ju000hvkswhl1zwe4m",
    "title": "The Conjuring",
    "genre": "Horror",
    "releaseYear": 2013,
    "videoUrl": "138843",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
    "description": "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
    "category": "horror"
  },
  {
    "id": "cmtt7udju000fvkeo8oloxzya",
    "title": "Peaky Blinders",
    "genre": "TV Series",
    "releaseYear": 2013,
    "videoUrl": "tv:60574",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    "description": "A gangster family epic set in 1919 Birmingham, England and centered on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.",
    "category": "series"
  },
  {
    "id": "cmtt1wf5e0007vk8s8n5w6zv7",
    "title": "Tears of Steel",
    "genre": "Sci-Fi",
    "releaseYear": 2012,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "thumbnailUrl": "https://media.themoviedb.org/t/p/w500/wHe75qNZkfJI9eUlTzNNn7kxtYc.jpg",
    "description": "In a dystopian future Amsterdam, a group of scientists and soldiers attempt to stage a crucial event in the past to save the world from destructive robots.",
    "category": "scifi"
  },
  {
    "id": "cmtt7udg3000bvkeons37i5j6",
    "title": "Game of Thrones",
    "genre": "TV Series",
    "releaseYear": 2011,
    "videoUrl": "tv:1399",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    "description": "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north.",
    "category": "series"
  },
  {
    "id": "cmtt1wf3p0001vk8sq3ovskdw",
    "title": "Inception",
    "genre": "Sci-Fi",
    "releaseYear": 2010,
    "videoUrl": "27205",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    "category": "scifi"
  },
  {
    "id": "cmtt1wf540006vk8svknk986j",
    "title": "Sintel",
    "genre": "Animation",
    "releaseYear": 2010,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg",
    "description": "A lonely young woman named Sintel searches for a baby dragon she befriended and nursed back to health, embarking on an epic, emotional quest.",
    "category": "animation"
  },
  {
    "id": "cmtt1wf3z0002vk8s9j6cv8p4",
    "title": "The Dark Knight",
    "genre": "Action",
    "releaseYear": 2008,
    "videoUrl": "155",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    "category": "action"
  },
  {
    "id": "cmtt1wf5o0008vk8spa1fvl9h",
    "title": "Big Buck Bunny",
    "genre": "Comedy",
    "releaseYear": 2008,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg",
    "description": "A large and lovable rabbit takes revenge on three bullying forest critters after they ruin his peaceful day and harm his butterfly friends.",
    "category": "action"
  },
  {
    "id": "cmtt7udfn000avkeosjjbytl4",
    "title": "Breaking Bad",
    "genre": "TV Series",
    "releaseYear": 2008,
    "videoUrl": "tv:1396",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
    "description": "Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of two years left to live. He turns to manufacturing and selling methamphetamine to secure his family's future.",
    "category": "series"
  },
  {
    "id": "cmtt7udbc0002vkeotae8hxkb",
    "title": "The Lord of the Rings: The Return of the King",
    "genre": "Action",
    "releaseYear": 2003,
    "videoUrl": "122",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    "description": "As armies mass for a final battle that will decide the fate of the world--and powerful, ancient forces of Light and Dark compete to determine the outcome--one member of the fellowship of the ring is revealed as the noble heir to the throne of the Kings of Men.",
    "category": "action"
  },
  {
    "id": "cat_wolf_wall_street",
    "title": "The Wolf of Wall Street",
    "genre": "Drama",
    "releaseYear": 2013,
    "videoUrl": "106646",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg",
    "description": "A New York stockbroker refuses to cooperate in a large securities fraud case involving corruption on Wall Street, the corporate banking world and mob infiltration.",
    "category": "drama"
  },
  {
    "id": "cmtt7udbm0003vkeos62q87u4",
    "title": "The Lord of the Rings: The Fellowship of the Ring",
    "genre": "Action",
    "releaseYear": 2001,
    "videoUrl": "120",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    "description": "Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home behind in order to begin an epic quest to the Mount of Doom in order to destroy it among his fellowship.",
    "category": "action"
  },
  {
    "id": "cmtt295gg0006vkswtqhex945",
    "title": "The Matrix",
    "genre": "Sci-Fi",
    "releaseYear": 1999,
    "videoUrl": "603",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    "description": "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    "category": "scifi"
  },
  {
    "id": "cmtt295ic000cvkswi761ygn2",
    "title": "Fight Club",
    "genre": "Drama",
    "releaseYear": 1999,
    "videoUrl": "550",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "description": "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on with underground fight clubs.",
    "category": "drama"
  },
  {
    "id": "cmtt7udee0007vkeorvli9tt5",
    "title": "The Green Mile",
    "genre": "Drama",
    "releaseYear": 1999,
    "videoUrl": "497",
    "thumbnailUrl": "https://media.themoviedb.org/t/p/w500/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg",
    "description": "A supernatural tale for the ages set along death row in a southern prison, where gentle giant John Coffey possesses the mysterious power to heal people's ailments and take their pain away.",
    "category": "drama"
  },
  {
    "id": "cmtt7udex0008vkeog5aoy0o3",
    "title": "Se7en",
    "genre": "Thriller",
    "releaseYear": 1995,
    "videoUrl": "807",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg",
    "description": "Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the 'seven deadly sins' in this dark and haunting psychological thriller.",
    "category": "drama"
  },
  {
    "id": "cmtt295i0000bvksw170r5gh0",
    "title": "The Lion King",
    "genre": "Animation",
    "releaseYear": 1994,
    "videoUrl": "8587",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
    "description": "A young lion prince is cast out of his pride by his cruel uncle, who claims he killed his father. While the uncle rules with an iron paw, the prince grows beyond the Savannah.",
    "category": "animation"
  },
  {
    "id": "cmtt295in000dvksw7uunnwzq",
    "title": "Pulp Fiction",
    "genre": "Thriller",
    "releaseYear": 1994,
    "videoUrl": "680",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    "description": "A burger-loving hit man, his philosophical partner, a drug-addled gangster's wife, and a washed-up boxer intertwine in four tales of violence and redemption.",
    "category": "drama"
  },
  {
    "id": "cmtt295iz000evkswi3ay0fgt",
    "title": "The Shawshank Redemption",
    "genre": "Drama",
    "releaseYear": 1994,
    "videoUrl": "278",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    "description": "Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",
    "category": "drama"
  },
  {
    "id": "cmtt7uddw0006vkeoxykyq78t",
    "title": "Forrest Gump",
    "genre": "Drama",
    "releaseYear": 1994,
    "videoUrl": "13",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    "description": "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.",
    "category": "drama"
  },
  {
    "id": "cmtt7udcy0004vkeoel9k38et",
    "title": "Schindler's List",
    "genre": "Drama",
    "releaseYear": 1993,
    "videoUrl": "424",
    "thumbnailUrl": "https://media.themoviedb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    "description": "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.",
    "category": "drama"
  },
  {
    "id": "cmtt7udf90009vkeofqzsg8cs",
    "title": "The Silence of the Lambs",
    "genre": "Thriller",
    "releaseYear": 1991,
    "videoUrl": "274",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
    "description": "Clarice Starling is a top student at the FBI's training academy. Jack Crawford wants Clarice to interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath serving life behind bars.",
    "category": "drama"
  },
  {
    "id": "cmtt7udb30001vkeo9eiififd",
    "title": "The Godfather Part II",
    "genre": "Drama",
    "releaseYear": 1974,
    "videoUrl": "240",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
    "description": "In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York. In the 1950s, Michael Corleone attempts to expand the family business into Las Vegas, Hollywood and Cuba.",
    "category": "drama"
  },
  {
    "id": "cmtt7udan0000vkeo3ifs2e23",
    "title": "The Godfather",
    "genre": "Drama",
    "releaseYear": 1972,
    "videoUrl": "238",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    "description": "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in.",
    "category": "drama"
  },
  {
    "id": "cmtt1wf5y0009vk8s0glp9r6s",
    "title": "Night of the Living Dead",
    "genre": "Horror",
    "releaseYear": 1968,
    "videoUrl": "10330",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/vaEjxG5uZShh3AZwl6l5PAV5tmS.jpg",
    "description": "A group of disparate people seek refuge from bloodthirsty ghouls in an abandoned Pennsylvania farmhouse in George A. Romero's horror masterpiece.",
    "category": "horror"
  },
  {
    "id": "cmtt7uddd0005vkeov3f8aumh",
    "title": "12 Angry Men",
    "genre": "Drama",
    "releaseYear": 1957,
    "videoUrl": "389",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",
    "description": "The defense and the prosecution have rested and the jury is filing into the jury room to decide if an 18-year-old native boy is guilty of murdering his father.",
    "category": "drama"
  },

  // ============================================================
  //  NEW ACTION & SUPERHERO
  // ============================================================
  {
    "id": "cat_avengers_infinity_war",
    "title": "Avengers: Infinity War",
    "genre": "Action",
    "releaseYear": 2018,
    "videoUrl": "299536",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    "description": "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation puts an end to the universe.",
    "category": "action"
  },
  {
    "id": "cat_the_batman",
    "title": "The Batman",
    "genre": "Action",
    "releaseYear": 2022,
    "videoUrl": "414906",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    "description": "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
    "category": "action"
  },
  {
    "id": "cat_black_panther",
    "title": "Black Panther",
    "genre": "Action",
    "releaseYear": 2018,
    "videoUrl": "284054",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
    "description": "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and confront a challenger from his country's past.",
    "category": "action"
  },
  {
    "id": "cat_captain_america_civil_war",
    "title": "Captain America: Civil War",
    "genre": "Action",
    "releaseYear": 2016,
    "videoUrl": "271110",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg",
    "description": "Political involvement in the Avengers' affairs causes a rift between Captain America and Iron Man, splitting the team in two.",
    "category": "action"
  },
  {
    "id": "cat_thor_ragnarok",
    "title": "Thor: Ragnarok",
    "genre": "Action",
    "releaseYear": 2017,
    "videoUrl": "284053",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg",
    "description": "Thor must fight for survival and race against time to prevent the all-powerful Hela from destroying his home and the Asgardian civilization.",
    "category": "action"
  },
  {
    "id": "cat_iron_man",
    "title": "Iron Man",
    "genre": "Action",
    "releaseYear": 2008,
    "videoUrl": "1726",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
    "description": "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
    "category": "action"
  },
  {
    "id": "cat_doctor_strange_mom",
    "title": "Doctor Strange in the Multiverse of Madness",
    "genre": "Action",
    "releaseYear": 2022,
    "videoUrl": "453395",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
    "description": "Doctor Strange, with the help of mystical allies, traverses the mind-bending and dangerous alternate realities of the Multiverse to confront a mysterious new adversary.",
    "category": "action"
  },
  {
    "id": "cat_guardians_galaxy",
    "title": "Guardians of the Galaxy",
    "genre": "Action",
    "releaseYear": 2014,
    "videoUrl": "118340",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg",
    "description": "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.",
    "category": "action"
  },
  {
    "id": "cat_guardians_galaxy_3",
    "title": "Guardians of the Galaxy Vol. 3",
    "genre": "Action",
    "releaseYear": 2023,
    "videoUrl": "447365",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
    "description": "The Guardians must protect Rocket from his creator, the High Evolutionary, in a final mission that could mean the end of the team as we know it.",
    "category": "action"
  },
  {
    "id": "cat_fast_x",
    "title": "Fast X",
    "genre": "Action",
    "releaseYear": 2023,
    "videoUrl": "385687",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",
    "description": "Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes in a globe-trotting high-speed battle.",
    "category": "action"
  },
  {
    "id": "cat_mi_dead_reckoning",
    "title": "Mission: Impossible – Dead Reckoning Part One",
    "genre": "Action",
    "releaseYear": 2023,
    "videoUrl": "575264",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
    "description": "Ethan Hunt and his IMF team must track down a terrifying new weapon that threatens all of humanity before it falls into the wrong hands.",
    "category": "action"
  },
  {
    "id": "cat_mi_fallout",
    "title": "Mission: Impossible – Fallout",
    "genre": "Action",
    "releaseYear": 2018,
    "videoUrl": "353081",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg",
    "description": "Ethan Hunt and the IMF team race against time after a mission gone wrong as the fate of three nuclear weapons hangs in the balance.",
    "category": "action"
  },
  {
    "id": "cat_aquaman",
    "title": "Aquaman",
    "genre": "Action",
    "releaseYear": 2018,
    "videoUrl": "297802",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/5Kg76ldv7VxeX9YlcQXiowHgdX6.jpg",
    "description": "Arthur Curry learns that he is the heir to the underwater kingdom of Atlantis, and must step forward to lead his people against his half-brother who seeks to unite the ocean and surface worlds.",
    "category": "action"
  },
  {
    "id": "cat_wonder_woman",
    "title": "Wonder Woman",
    "genre": "Action",
    "releaseYear": 2017,
    "videoUrl": "297762",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/gfJGlDaHuWimErCr5Ql0I8x9QSy.jpg",
    "description": "When an American pilot crashes on the shores of the Amazon warrior island of Themyscira, Diana Prince leaves her home to fight a war, discovering her full powers and true destiny.",
    "category": "action"
  },
  {
    "id": "cat_shang_chi",
    "title": "Shang-Chi and the Legend of the Ten Rings",
    "genre": "Action",
    "releaseYear": 2021,
    "videoUrl": "566525",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg",
    "description": "Shang-Chi, the master of unarmed weaponry-based Kung Fu, is forced to confront the past he thought he left behind when drawn into the web of the mysterious Ten Rings organization.",
    "category": "action"
  },
  {
    "id": "cat_extraction_2",
    "title": "Extraction 2",
    "genre": "Action",
    "releaseYear": 2023,
    "videoUrl": "697843",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/7gKI9hpEMcZUQpNgKrkDzJpbnNS.jpg",
    "description": "After barely surviving his near-fatal injuries, Tyler Rake is back as the Australian black ops mercenary with another impossible mission.",
    "category": "action"
  },
  {
    "id": "cat_john_wick",
    "title": "John Wick",
    "genre": "Action",
    "releaseYear": 2014,
    "videoUrl": "245891",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
    "description": "An ex-hitman comes out of retirement to track down the gangsters that killed his dog and took everything from him.",
    "category": "action"
  },
  {
    "id": "cat_kill_bill_1",
    "title": "Kill Bill: Vol. 1",
    "genre": "Action",
    "releaseYear": 2003,
    "videoUrl": "24",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg",
    "description": "After awakening from a four-year coma, a former assassin wreaks vengeance on the team of killers who betrayed her.",
    "category": "action"
  },
  {
    "id": "cat_the_raid",
    "title": "The Raid",
    "genre": "Action",
    "releaseYear": 2011,
    "videoUrl": "123757",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/sQmBGBIjDvX2nMwUHI3yQv4YAJ9.jpg",
    "description": "A S.W.A.T. team becomes trapped in a tenement run by a ruthless mobster and his army of killers and thugs in this Indonesian martial arts action masterpiece.",
    "category": "action"
  },

  // ============================================================
  //  NEW SCI-FI
  // ============================================================
  {
    "id": "cat_arrival",
    "title": "Arrival",
    "genre": "Sci-Fi",
    "releaseYear": 2016,
    "videoUrl": "329865",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    "description": "A linguist is recruited by the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
    "category": "scifi"
  },
  {
    "id": "cat_ex_machina",
    "title": "Ex Machina",
    "genre": "Sci-Fi",
    "releaseYear": 2014,
    "videoUrl": "264660",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg",
    "description": "A young programmer is selected to participate in a groundbreaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid A.I.",
    "category": "scifi"
  },
  {
    "id": "cat_the_martian",
    "title": "The Martian",
    "genre": "Sci-Fi",
    "releaseYear": 2015,
    "videoUrl": "286217",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg",
    "description": "An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal that he is alive.",
    "category": "scifi"
  },
  {
    "id": "cat_gravity",
    "title": "Gravity",
    "genre": "Sci-Fi",
    "releaseYear": 2013,
    "videoUrl": "49047",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/kZ2nZw8D681aphje8NJi8EfbL1U.jpg",
    "description": "Two astronauts work together to survive after an accident leaves them stranded in orbit with dwindling oxygen and no link to Earth.",
    "category": "scifi"
  },
  {
    "id": "cat_alien",
    "title": "Alien",
    "genre": "Sci-Fi",
    "releaseYear": 1979,
    "videoUrl": "348",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg",
    "description": "The crew of a commercial spacecraft encounter a deadly lifeform after investigating an unknown transmission from a desolate planet.",
    "category": "scifi"
  },
  {
    "id": "cat_aliens",
    "title": "Aliens",
    "genre": "Sci-Fi",
    "releaseYear": 1986,
    "videoUrl": "679",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/r1x5JGpyqZU8PYhbs4UcrO1Xb6x.jpg",
    "description": "Ellen Ripley is rescued after drifting through space for 57 years and returns with a unit of colonial marines to the moon where her crew encountered the alien creatures.",
    "category": "scifi"
  },
  {
    "id": "cat_edge_of_tomorrow",
    "title": "Edge of Tomorrow",
    "genre": "Sci-Fi",
    "releaseYear": 2014,
    "videoUrl": "137113",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/nBM9MMa2WCwvMG4IJ3eiGUdbPe6.jpg",
    "description": "A soldier fighting aliens gets to relive the same day over and over again, the day restarting every time he dies, and gets better with each loop.",
    "category": "scifi"
  },
  {
    "id": "cat_tenet",
    "title": "Tenet",
    "genre": "Sci-Fi",
    "releaseYear": 2020,
    "videoUrl": "577922",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
    "description": "Armed with only one word, a CIA operative journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.",
    "category": "scifi"
  },
  {
    "id": "cat_annihilation",
    "title": "Annihilation",
    "genre": "Sci-Fi",
    "releaseYear": 2018,
    "videoUrl": "300668",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/4YRplSk6BhH6PRuE9gfyw9byUJ6.jpg",
    "description": "A biologist signs up for a dangerous, secret expedition into a mysterious zone where the laws of nature don't apply.",
    "category": "scifi"
  },
  {
    "id": "cat_district_9",
    "title": "District 9",
    "genre": "Sci-Fi",
    "releaseYear": 2009,
    "videoUrl": "17654",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/tuGlQkqLxnodDSk6mp5c2wvxUEd.jpg",
    "description": "Violence ensues after an idealistic government agent is exposed to alien biotechnology in a Johannesburg slum, turning him into a fugitive.",
    "category": "scifi"
  },
  {
    "id": "cat_prometheus",
    "title": "Prometheus",
    "genre": "Sci-Fi",
    "releaseYear": 2012,
    "videoUrl": "70981",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/qsYQflQhOuhDpQ0W2aOcwqgDAeI.jpg",
    "description": "A team of explorers discover a clue to the origins of mankind on Earth, leading them on a journey to the darkest corners of the universe.",
    "category": "scifi"
  },
  {
    "id": "cat_pacific_rim",
    "title": "Pacific Rim",
    "genre": "Sci-Fi",
    "releaseYear": 2013,
    "videoUrl": "68726",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/8wo4eN8dWKaKlxhSvBz19uvj8gA.jpg",
    "description": "As monstrous creatures rise from the sea, humanity fights back using giant robots controlled simultaneously by two pilots whose minds are locked in a neural bridge.",
    "category": "scifi"
  },
  {
    "id": "cat_the_fifth_element",
    "title": "The Fifth Element",
    "genre": "Sci-Fi",
    "releaseYear": 1997,
    "videoUrl": "18",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/fPtlCO1yQtnoLHOwKtWz7db6RGU.jpg",
    "description": "In the colorful future, a cab driver unwittingly becomes the central figure in the search for a legendary cosmic weapon to keep Evil and Mr. Zorg at bay.",
    "category": "scifi"
  },

  // ============================================================
  //  NEW DRAMA
  // ============================================================
  {
    "id": "cat_the_departed",
    "title": "The Departed",
    "genre": "Drama",
    "releaseYear": 2006,
    "videoUrl": "1422",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg",
    "description": "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.",
    "category": "drama"
  },
  {
    "id": "cat_goodfellas",
    "title": "Goodfellas",
    "genre": "Drama",
    "releaseYear": 1990,
    "videoUrl": "769",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg",
    "description": "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.",
    "category": "drama"
  },
  {
    "id": "cat_the_prestige",
    "title": "The Prestige",
    "genre": "Drama",
    "releaseYear": 2006,
    "videoUrl": "1124",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg",
    "description": "Two rival magicians in Victorian London engage in a bitter battle of wits and deception, each obsessed with creating the ultimate illusion.",
    "category": "drama"
  },
  {
    "id": "cat_django_unchained",
    "title": "Django Unchained",
    "genre": "Drama",
    "releaseYear": 2012,
    "videoUrl": "68718",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg",
    "description": "With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.",
    "category": "drama"
  },
  {
    "id": "cat_inglourious_basterds",
    "title": "Inglourious Basterds",
    "genre": "Drama",
    "releaseYear": 2009,
    "videoUrl": "16869",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg",
    "description": "In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner's vengeful plans.",
    "category": "drama"
  },
  {
    "id": "cat_whiplash",
    "title": "Whiplash",
    "genre": "Drama",
    "releaseYear": 2014,
    "videoUrl": "244786",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    "description": "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    "category": "drama"
  },
  {
    "id": "cat_parasite",
    "title": "Parasite",
    "genre": "Drama",
    "releaseYear": 2019,
    "videoUrl": "496243",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    "description": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    "category": "drama"
  },
  {
    "id": "cat_social_network",
    "title": "The Social Network",
    "genre": "Drama",
    "releaseYear": 2010,
    "videoUrl": "37799",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
    "description": "As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by the twins who claimed he stole their idea.",
    "category": "drama"
  },
  {
    "id": "cat_the_truman_show",
    "title": "The Truman Show",
    "genre": "Drama",
    "releaseYear": 1998,
    "videoUrl": "37165",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/vuza0WqY239yBXOadKlGwJsZJFE.jpg",
    "description": "An insurance salesman discovers his whole life is actually a reality TV show and begins to question everything he knows.",
    "category": "drama"
  },
  {
    "id": "cat_the_pianist",
    "title": "The Pianist",
    "genre": "Drama",
    "releaseYear": 2002,
    "videoUrl": "423",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg",
    "description": "A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto of World War II.",
    "category": "drama"
  },
  {
    "id": "cat_no_country",
    "title": "No Country for Old Men",
    "genre": "Drama",
    "releaseYear": 2007,
    "videoUrl": "6977",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/6d5XOczc226jECq0LIX0siKtgHR.jpg",
    "description": "Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and more than two million dollars in cash near the Rio Grande.",
    "category": "drama"
  },
  {
    "id": "cat_shutter_island",
    "title": "Shutter Island",
    "genre": "Drama",
    "releaseYear": 2010,
    "videoUrl": "11324",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg",
    "description": "In 1954, a U.S. Marshal investigates the disappearance of a murderer who escaped from a hospital for the criminally insane on a remote island.",
    "category": "drama"
  },
  {
    "id": "cat_gone_girl",
    "title": "Gone Girl",
    "genre": "Drama",
    "releaseYear": 2014,
    "videoUrl": "210577",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/ts996lKsxvjkO2yiYG0ht4qAicO.jpg",
    "description": "With his wife's disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when it's suspected that he may not be innocent.",
    "category": "drama"
  },
  {
    "id": "cat_wolf_wall_street",
    "title": "The Wolf of Wall Street",
    "genre": "Drama",
    "releaseYear": 2013,
    "videoUrl": "106646",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg",
    "description": "Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.",
    "category": "drama"
  },
  {
    "id": "cat_prisoners",
    "title": "Prisoners",
    "genre": "Drama",
    "releaseYear": 2013,
    "videoUrl": "146233",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/uhviyknTT5cEQXbn6vWIqfM4vGm.jpg",
    "description": "When Keller Dover's daughter and her friend go missing, he takes matters into his own hands as the police pursue multiple leads and the pressure mounts.",
    "category": "drama"
  },
  {
    "id": "cat_the_revenant",
    "title": "The Revenant",
    "genre": "Drama",
    "releaseYear": 2015,
    "videoUrl": "281957",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/ji3ecJphATlVgWNY0B0RVXZizdf.jpg",
    "description": "A frontiersman on a fur trading expedition in the 1820s fights for survival after being mauled by a bear and left for dead by members of his own hunting team.",
    "category": "drama"
  },

  // ============================================================
  //  NEW HORROR
  // ============================================================
  {
    "id": "cat_get_out",
    "title": "Get Out",
    "genre": "Horror",
    "releaseYear": 2017,
    "videoUrl": "419430",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
    "description": "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
    "category": "horror"
  },
  {
    "id": "cat_us",
    "title": "Us",
    "genre": "Horror",
    "releaseYear": 2019,
    "videoUrl": "487558",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/ux2dU1jQ2ACIMShzB3yP93Udpzc.jpg",
    "description": "A family's serene beach vacation turns to chaos when their doppelgängers appear and begin to terrorize them.",
    "category": "horror"
  },
  {
    "id": "cat_it_2017",
    "title": "It",
    "genre": "Horror",
    "releaseYear": 2017,
    "videoUrl": "346364",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg",
    "description": "In the summer of 1989, a group of bullied kids band together to destroy a shape-shifting monster that disguises itself as a clown and preys on the children of Derry, Maine.",
    "category": "horror"
  },
  {
    "id": "cat_the_shining",
    "title": "The Shining",
    "genre": "Horror",
    "releaseYear": 1980,
    "videoUrl": "694",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/nRj5511mZdTl4saWEPoj9QroTIu.jpg",
    "description": "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings.",
    "category": "horror"
  },
  {
    "id": "cat_midsommar",
    "title": "Midsommar",
    "genre": "Horror",
    "releaseYear": 2019,
    "videoUrl": "530385",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/7LEI8ulZzO5gy9Ww2NVCrKmHeDZ.jpg",
    "description": "A couple travels to Northern Europe to visit a rural hometown's fabled Swedish mid-summer festival, but what begins as an idyllic retreat quickly devolves into an increasingly violent and bizarre competition.",
    "category": "horror"
  },
  {
    "id": "cat_the_exorcist",
    "title": "The Exorcist",
    "genre": "Horror",
    "releaseYear": 1973,
    "videoUrl": "9552",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/4ucLGcXVVSVnsfkGtbLY4XAius8.jpg",
    "description": "When a 12-year-old girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her daughter.",
    "category": "horror"
  },
  {
    "id": "cat_scream",
    "title": "Scream",
    "genre": "Horror",
    "releaseYear": 1996,
    "videoUrl": "4232",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/lr9ZIrmuwVmZhpZuTCW8D9g0ZJe.jpg",
    "description": "A year after the murder of her mother, a teenage girl is terrorized by a new killer who targets her and her friends by using horror films as part of a deadly game.",
    "category": "horror"
  },
  {
    "id": "cat_saw",
    "title": "Saw",
    "genre": "Horror",
    "releaseYear": 2004,
    "videoUrl": "176",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/rLNSOudrayDBo1uqXjrhxcjODIC.jpg",
    "description": "Two strangers awaken in a room with no recollection of how they got there, and soon discover they're pawns in a deadly game perpetrated by a notorious serial killer.",
    "category": "horror"
  },
  {
    "id": "cat_insidious",
    "title": "Insidious",
    "genre": "Horror",
    "releaseYear": 2010,
    "videoUrl": "49018",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/8su4HXNbbOHBDT3dIc9aWlL5aZ6.jpg",
    "description": "A family looks to prevent evil spirits from trapping their comatose child in a realm called The Further.",
    "category": "horror"
  },
  {
    "id": "cat_the_ring",
    "title": "The Ring",
    "genre": "Horror",
    "releaseYear": 2002,
    "videoUrl": "565",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/AeRpUynJKDpJveklBJipOYrVxCS.jpg",
    "description": "A journalist must investigate a mysterious videotape which seems to cause the death of anyone in a week of viewing it.",
    "category": "horror"
  },
  {
    "id": "cat_smile",
    "title": "Smile",
    "genre": "Horror",
    "releaseYear": 2022,
    "videoUrl": "882598",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/aPqcQwu4VGEewPhagWNncDbJ9Xp.jpg",
    "description": "After witnessing a bizarre, traumatic incident involving a patient, Dr. Rose Cotter starts experiencing frightening occurrences that she can't explain.",
    "category": "horror"
  },
  {
    "id": "cat_talk_to_me",
    "title": "Talk to Me",
    "genre": "Horror",
    "releaseYear": 2023,
    "videoUrl": "1008042",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/kdPMUMJzyYAc4roD52qavX0nLIC.jpg",
    "description": "When a group of friends discover how to conjure spirits using an embalmed hand, they become hooked on the new thrill, until one of them goes too far.",
    "category": "horror"
  },

  // ============================================================
  //  NEW ANIMATION
  // ============================================================
  {
    "id": "cat_finding_nemo",
    "title": "Finding Nemo",
    "genre": "Animation",
    "releaseYear": 2003,
    "videoUrl": "12",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg",
    "description": "After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.",
    "category": "animation"
  },
  {
    "id": "cat_toy_story",
    "title": "Toy Story",
    "genre": "Animation",
    "releaseYear": 1995,
    "videoUrl": "862",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    "description": "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
    "category": "animation"
  },
  {
    "id": "cat_toy_story_3",
    "title": "Toy Story 3",
    "genre": "Animation",
    "releaseYear": 2010,
    "videoUrl": "10193",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/AbbXspMOwdvwWZgVN0nabZq03Ec.jpg",
    "description": "The toys are mistakenly delivered to a day-care center instead of the attic right before Andy leaves for college, and it's up to Woody to convince the other toys that they weren't abandoned.",
    "category": "animation"
  },
  {
    "id": "cat_frozen",
    "title": "Frozen",
    "genre": "Animation",
    "releaseYear": 2013,
    "videoUrl": "109445",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/itAKcobTYGpYT8Phwjd8c9hleTo.jpg",
    "description": "When the newly crowned Queen Elsa accidentally uses her power to turn things into ice to curse her home in infinite winter, her sister Anna teams up with a mountain man to change the weather condition.",
    "category": "animation"
  },
  {
    "id": "cat_coco",
    "title": "Coco",
    "genre": "Animation",
    "releaseYear": 2017,
    "videoUrl": "354912",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg",
    "description": "Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.",
    "category": "animation"
  },
  {
    "id": "cat_ratatouille",
    "title": "Ratatouille",
    "genre": "Animation",
    "releaseYear": 2007,
    "videoUrl": "2062",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/t3vaWRPSf6WjDSamIkKDs1iQWna.jpg",
    "description": "A rat who can cook makes an unusual alliance with a young kitchen worker at a famous restaurant in Paris.",
    "category": "animation"
  },
  {
    "id": "cat_wall_e",
    "title": "WALL·E",
    "genre": "Animation",
    "releaseYear": 2008,
    "videoUrl": "10681",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg",
    "description": "In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.",
    "category": "animation"
  },
  {
    "id": "cat_up",
    "title": "Up",
    "genre": "Animation",
    "releaseYear": 2009,
    "videoUrl": "14160",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/mFvoEwSfLqbcWwFsDjQebn9bzFe.jpg",
    "description": "78-year-old Carl Fredricksen travels to Paradise Falls in his house equipped with balloons, inadvertently taking a young wilderness explorer along.",
    "category": "animation"
  },
  {
    "id": "cat_how_to_train_dragon",
    "title": "How to Train Your Dragon",
    "genre": "Animation",
    "releaseYear": 2010,
    "videoUrl": "10191",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/ygGmAO60t8GyqUo9xYeYxSZAR3b.jpg",
    "description": "A hapless young Viking who aspires to hunt dragons becomes the unlikely friend of a young dragon himself, and learns there may be more to the creatures than he assumed.",
    "category": "animation"
  },
  {
    "id": "cat_shrek",
    "title": "Shrek",
    "genre": "Animation",
    "releaseYear": 2001,
    "videoUrl": "808",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg",
    "description": "A mean lord exiles fairytale creatures to the swamp of a grumpy ogre, who must go on a quest and rescue a princess for the lord in order to get his land back.",
    "category": "animation"
  },
  {
    "id": "cat_kung_fu_panda",
    "title": "Kung Fu Panda",
    "genre": "Animation",
    "releaseYear": 2008,
    "videoUrl": "9502",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/wWt4JYXTg5Wr3xBW2phBrMKgp3x.jpg",
    "description": "The Dragon Warrior has to clash against the savage Tai Lung as China's fate hangs in the balance. An unlikely hero, Po the panda, must embrace his true destiny.",
    "category": "animation"
  },
  {
    "id": "cat_moana",
    "title": "Moana",
    "genre": "Animation",
    "releaseYear": 2016,
    "videoUrl": "277834",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/4JeejGugONWpJkbnvL12hVoYEDa.jpg",
    "description": "In Ancient Polynesia, when a terrible curse incurred by the demigod Maui reaches Moana's island, she answers the Ocean's call to seek out Maui to set things right.",
    "category": "animation"
  },
  {
    "id": "cat_zootopia",
    "title": "Zootopia",
    "genre": "Animation",
    "releaseYear": 2016,
    "videoUrl": "269149",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/hlK0e0wAQ3VLuJcsfIYPvb4JVud.jpg",
    "description": "In a city of anthropomorphic animals, a rookie bunny cop and a cynical con artist fox must work together to uncover a conspiracy.",
    "category": "animation"
  },
  {
    "id": "cat_encanto",
    "title": "Encanto",
    "genre": "Animation",
    "releaseYear": 2021,
    "videoUrl": "568124",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg",
    "description": "A young Colombian girl has to face the frustration of being the only member of her family without magical powers.",
    "category": "animation"
  },
  {
    "id": "cat_the_incredibles",
    "title": "The Incredibles",
    "genre": "Animation",
    "releaseYear": 2004,
    "videoUrl": "9806",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/2LqaLgk4Z226KkgPJuiOQ58wvrm.jpg",
    "description": "A family of undercover superheroes, while trying to live the quiet suburban life, are forced into action to save the world.",
    "category": "animation"
  },

  // ============================================================
  //  NEW COMEDY
  // ============================================================
  {
    "id": "cat_the_hangover",
    "title": "The Hangover",
    "genre": "Comedy",
    "releaseYear": 2009,
    "videoUrl": "18785",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/A0uS9rHR56FeBtpjVki16M5xxSW.jpg",
    "description": "Three buddies wake up from a bachelor party in Las Vegas with no memory of the previous night and the bachelor missing. They must piece together the events to find their friend before his wedding.",
    "category": "comedy"
  },
  {
    "id": "cat_superbad",
    "title": "Superbad",
    "genre": "Comedy",
    "releaseYear": 2007,
    "videoUrl": "8363",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg",
    "description": "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.",
    "category": "comedy"
  },
  {
    "id": "cat_home_alone",
    "title": "Home Alone",
    "genre": "Comedy",
    "releaseYear": 1990,
    "videoUrl": "771",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/onTSipZ8R3bliBdKfPtsDuHTdlL.jpg",
    "description": "An eight-year-old troublemaker must protect his house from a pair of burglars when he is accidentally left home alone by his family during Christmas vacation.",
    "category": "comedy"
  },
  {
    "id": "cat_mean_girls",
    "title": "Mean Girls",
    "genre": "Comedy",
    "releaseYear": 2004,
    "videoUrl": "10625",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/2ZkuQXvVhh45uSvkBej4S7Ix1NJ.jpg",
    "description": "Cady Heron is a hit with The Plastics, the A-list girl clique at her new school, until she makes the mistake of falling for Aaron Samuels, the ex-boyfriend of alpha Plastic Regina George.",
    "category": "comedy"
  },
  {
    "id": "cat_the_mask",
    "title": "The Mask",
    "genre": "Comedy",
    "releaseYear": 1994,
    "videoUrl": "854",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/jPC2eYub74zwf2tPGVtzSlBW6Oy.jpg",
    "description": "A bank clerk discovers a magical mask that transforms him into a zany green-faced superhero with unlimited powers.",
    "category": "comedy"
  },
  {
    "id": "cat_rush_hour",
    "title": "Rush Hour",
    "genre": "Comedy",
    "releaseYear": 1998,
    "videoUrl": "2109",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/nwPhAsfnb7f46bZkWLG7IRP5HXr.jpg",
    "description": "A loyal and dedicated Hong Kong Inspector teams up with a reckless and loudmouthed L.A.P.D. detective to rescue the Chinese Consul's kidnapped daughter.",
    "category": "comedy"
  },
  {
    "id": "cat_jumanji_jungle",
    "title": "Jumanji: Welcome to the Jungle",
    "genre": "Comedy",
    "releaseYear": 2017,
    "videoUrl": "353486",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/bXrZ5iHBEjH7WMidbUDQ0U2xbmr.jpg",
    "description": "Four teenagers are sucked into a magical video game, and the only way they can escape is to work together to finish the game.",
    "category": "comedy"
  },
  {
    "id": "cat_grand_budapest",
    "title": "The Grand Budapest Hotel",
    "genre": "Comedy",
    "releaseYear": 2014,
    "videoUrl": "120467",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    "description": "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under its legendary concierge.",
    "category": "comedy"
  },
  {
    "id": "cat_knives_out",
    "title": "Knives Out",
    "genre": "Comedy",
    "releaseYear": 2019,
    "videoUrl": "546554",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg",
    "description": "A detective investigates the death of the patriarch of an eccentric, combative family in this sharp and witty whodunit.",
    "category": "comedy"
  },
  {
    "id": "cat_jojo_rabbit",
    "title": "Jojo Rabbit",
    "genre": "Comedy",
    "releaseYear": 2019,
    "videoUrl": "515001",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/1mqL7VG4Ix8wmxwypmCA1HTHBky.jpg",
    "description": "A young German boy in the Hitler Youth whose imaginary friend is Adolf Hitler discovers that his single mother is hiding a Jewish girl in their attic.",
    "category": "comedy"
  },

  // ============================================================
  //  NEW ROMANCE
  // ============================================================
  {
    "id": "cat_titanic",
    "title": "Titanic",
    "genre": "Romance",
    "releaseYear": 1997,
    "videoUrl": "597",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    "description": "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
    "category": "romance"
  },
  {
    "id": "cat_the_notebook",
    "title": "The Notebook",
    "genre": "Romance",
    "releaseYear": 2004,
    "videoUrl": "11036",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg",
    "description": "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.",
    "category": "romance"
  },
  {
    "id": "cat_la_la_land",
    "title": "La La Land",
    "genre": "Romance",
    "releaseYear": 2016,
    "videoUrl": "313369",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    "description": "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
    "category": "romance"
  },
  {
    "id": "cat_eternal_sunshine",
    "title": "Eternal Sunshine of the Spotless Mind",
    "genre": "Romance",
    "releaseYear": 2004,
    "videoUrl": "38",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg",
    "description": "When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories. But it is only through the process of loss that they discover what they had to begin with.",
    "category": "romance"
  },
  {
    "id": "cat_pride_prejudice",
    "title": "Pride and Prejudice",
    "genre": "Romance",
    "releaseYear": 2005,
    "videoUrl": "4348",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/o8UhmEbWPHmTUxP0lMuCoqNkbB3.jpg",
    "description": "Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy. But Mr. Darcy reluctantly finds himself falling in love with a woman beneath his class.",
    "category": "romance"
  },
  {
    "id": "cat_about_time",
    "title": "About Time",
    "genre": "Romance",
    "releaseYear": 2013,
    "videoUrl": "122906",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/ls6zswrOZVhCXQBh96DlbnLBajM.jpg",
    "description": "At the age of 21, Tim discovers he can travel in time and decides to make his world a better place by getting a girlfriend. But things don't always go as planned.",
    "category": "romance"
  },
  {
    "id": "cat_fault_in_our_stars",
    "title": "The Fault in Our Stars",
    "genre": "Romance",
    "releaseYear": 2014,
    "videoUrl": "222935",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/kcVuktIlrn9SAN1uBmPDnocTQmF.jpg",
    "description": "Two teenage cancer patients begin a life-affirming journey to visit a reclusive author in Amsterdam.",
    "category": "romance"
  },

  // ============================================================
  //  NEW TV SERIES
  // ============================================================
  {
    "id": "cat_wednesday",
    "title": "Wednesday",
    "genre": "TV Series",
    "releaseYear": 2022,
    "videoUrl": "tv:119051",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    "description": "Wednesday Addams is sent to Nevermore Academy, a peculiar boarding school where she attempts to master her psychic abilities and solve a mystery.",
    "category": "series"
  },
  {
    "id": "cat_squid_game",
    "title": "Squid Game",
    "genre": "TV Series",
    "releaseYear": 2021,
    "videoUrl": "tv:93405",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
    "description": "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly stakes.",
    "category": "series"
  },
  {
    "id": "cat_the_witcher",
    "title": "The Witcher",
    "genre": "TV Series",
    "releaseYear": 2019,
    "videoUrl": "tv:71912",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    "description": "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
    "category": "series"
  },
  {
    "id": "cat_house_of_dragon",
    "title": "House of the Dragon",
    "genre": "TV Series",
    "releaseYear": 2022,
    "videoUrl": "tv:94997",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
    "description": "The Targaryen civil war — the Dance of the Dragons — told through the eyes of both combatant factions, set 200 years before the events of Game of Thrones.",
    "category": "series"
  },
  {
    "id": "cat_loki",
    "title": "Loki",
    "genre": "TV Series",
    "releaseYear": 2021,
    "videoUrl": "tv:84958",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/voHUmluYmKyleFkTu3lOXQG702u.jpg",
    "description": "The mercurial villain Loki resumes his role as the God of Mischief in a new series that takes place after the events of Avengers: Endgame.",
    "category": "series"
  },
  {
    "id": "cat_mandalorian",
    "title": "The Mandalorian",
    "genre": "TV Series",
    "releaseYear": 2019,
    "videoUrl": "tv:82856",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
    "description": "After the fall of the Galactic Empire, a lone gunfighter makes his way through the lawless galaxy with a mysterious alien child.",
    "category": "series"
  },
  {
    "id": "cat_money_heist",
    "title": "Money Heist",
    "genre": "TV Series",
    "releaseYear": 2017,
    "videoUrl": "tv:71446",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    "description": "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history — stealing billions from the Royal Mint of Spain.",
    "category": "series"
  },
  {
    "id": "cat_dark",
    "title": "Dark",
    "genre": "TV Series",
    "releaseYear": 2017,
    "videoUrl": "tv:70523",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",
    "description": "A family saga with a supernatural twist, set in a German town, where the disappearance of two young children exposes the relationships among four families.",
    "category": "series"
  },
  {
    "id": "cat_narcos",
    "title": "Narcos",
    "genre": "TV Series",
    "releaseYear": 2015,
    "videoUrl": "tv:63351",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/rTmal9fDbwh5F0waol2hq35U4ah.jpg",
    "description": "A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar, as well as the many other drug kingpins who plagued the country through the years.",
    "category": "series"
  },
  {
    "id": "cat_chernobyl",
    "title": "Chernobyl",
    "genre": "TV Series",
    "releaseYear": 2019,
    "videoUrl": "tv:87108",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg",
    "description": "In April 1986, an explosion at the Chernobyl nuclear power plant in the Union of Soviet Socialist Republics becomes one of the world's worst man-made catastrophes.",
    "category": "series"
  },
  {
    "id": "cat_the_boys",
    "title": "The Boys",
    "genre": "TV Series",
    "releaseYear": 2019,
    "videoUrl": "tv:76479",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/in1R2dDc421JxsoRWaIIAqVI2KE.jpg",
    "description": "A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers in this darkly satirical superhero series.",
    "category": "series"
  },
  {
    "id": "cat_better_call_saul",
    "title": "Better Call Saul",
    "genre": "TV Series",
    "releaseYear": 2015,
    "videoUrl": "tv:60059",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/f1VCQIG2iCyOookdgOzwtUpwWC0.jpg",
    "description": "The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to his fateful run-in with Walter White and Jesse Pinkman.",
    "category": "series"
  },
  {
    "id": "cat_prison_break",
    "title": "Prison Break",
    "genre": "TV Series",
    "releaseYear": 2005,
    "videoUrl": "tv:2288",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/wnmNPaLvhnMeOqnWlhNkYCZxtda.jpg",
    "description": "Due to a political conspiracy, an innocent man is sent to death row and his only hope is his brother, who makes it his mission to deliberately get himself sent to the same prison in order to break the both of them out.",
    "category": "series"
  },
  {
    "id": "cat_the_walking_dead",
    "title": "The Walking Dead",
    "genre": "TV Series",
    "releaseYear": 2010,
    "videoUrl": "tv:1402",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/ng3cMtxYKt1OSQYqFlnKWnVsqNO.jpg",
    "description": "Sheriff's deputy Rick Grimes awakens from a coma to find a post-apocalyptic world dominated by flesh-eating zombies. He sets out to find his family and encounters many other survivors along the way.",
    "category": "series"
  },
  {
    "id": "cat_the_office",
    "title": "The Office",
    "genre": "TV Series",
    "releaseYear": 2005,
    "videoUrl": "tv:2316",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/dg9e5fPRRId8PoBE0F6jl5y85Eu.jpg",
    "description": "The everyday lives of office employees in the Scranton, Pennsylvania branch of the fictional Dunder Mifflin Paper Company.",
    "category": "series"
  },
  {
    "id": "cat_friends",
    "title": "Friends",
    "genre": "TV Series",
    "releaseYear": 1994,
    "videoUrl": "tv:1668",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/2koX1xLkpTQM4IZebYvKysFW1Nh.jpg",
    "description": "Six young people from New York City find companionship, romance and laughter as they navigate life and careers in Manhattan.",
    "category": "series"
  },
  {
    "id": "cat_dexter",
    "title": "Dexter",
    "genre": "TV Series",
    "releaseYear": 2006,
    "videoUrl": "tv:1405",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/q8dWfc4JwQuv3HayIZeO84jAXED.jpg",
    "description": "Dexter Morgan, a blood spatter analyst for Miami Police, leads a secret double life as a vigilante serial killer who hunts heinous criminals who escaped justice.",
    "category": "series"
  },
  {
    "id": "cat_vikings",
    "title": "Vikings",
    "genre": "TV Series",
    "releaseYear": 2013,
    "videoUrl": "tv:44217",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/bQLrHIRNEkE3PdIWQrZHynQZazu.jpg",
    "description": "The epic adventures of legendary Norse hero Ragnar Lothbrok and his warrior brothers as they raid, conquer and explore distant shores.",
    "category": "series"
  },
  {
    "id": "cat_suits",
    "title": "Suits",
    "genre": "TV Series",
    "releaseYear": 2011,
    "videoUrl": "tv:37680",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/vQiryp6LioFxQThywxbC6TuoDjy.jpg",
    "description": "While running from a drug deal gone bad, brilliant college-dropout Mike Ross slips into a job interview with top Manhattan lawyer Harvey Specter.",
    "category": "series"
  },
  {
    "id": "cat_shogun",
    "title": "Shogun",
    "genre": "TV Series",
    "releaseYear": 2024,
    "videoUrl": "tv:126308",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg",
    "description": "In 1600s feudal Japan, Lord Yoshii Toranaga fights for his life against political rivals on the Council of Regents while an English navigator washes ashore.",
    "category": "series"
  },
  {
    "id": "cat_fallout_series",
    "title": "Fallout",
    "genre": "TV Series",
    "releaseYear": 2024,
    "videoUrl": "tv:106379",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/c15BtJxCXMrISLVmysdsnZUPQft.jpg",
    "description": "200 years after the nuclear apocalypse, vault dweller Lucy leaves her sheltered bunker to explore the irradiated, bizarre wasteland of Los Angeles.",
    "category": "series"
  },

  // ============================================================
  // ============================================================
  //  MENA CINEMA
  // ============================================================
  {
    "id": "cat_blue_elephant",
    "title": "The Blue Elephant",
    "genre": "Arabic",
    "releaseYear": 2014,
    "videoUrl": "293262",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/tWUhh4v5NEMQwsXMtxlCUFtMfre.jpg",
    "description": "A psychiatrist returns to work at a mental hospital after years of absence and encounters a case that blurs the line between reality and hallucination.",
    "category": "arabic"
  },
  {
    "id": "cat_blue_elephant_2",
    "title": "The Blue Elephant 2",
    "genre": "Arabic",
    "releaseYear": 2019,
    "videoUrl": "598235",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/2ScpOYjA2KdPyi40AyRM5MoFGe4.jpg",
    "description": "Dr. Yehia returns to investigate a new case involving a famous actress, delving deeper into a world of paranormal terror.",
    "category": "arabic"
  },
  {
    "id": "cat_welad_rizk",
    "title": "Welad Rizk",
    "genre": "Arabic",
    "releaseYear": 2015,
    "videoUrl": "341016",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/zJcRCT5JhKrPTPzOMHe3OZZCnh4.jpg",
    "description": "Five brothers from the slums of Cairo plan a daring heist to change their fortune in this action-packed thriller.",
    "category": "arabic"
  },
  {
    "id": "cat_ziko",
    "title": "Men Agl Ziko",
    "genre": "Arabic",
    "releaseYear": 2022,
    "videoUrl": "901046",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/frvCNOTKuCynVAsldWTUt9VM2G5.jpg",
    "description": "A simple Egyptian family embarks on an unforgettable road trip across the country so their genius young son Ziko can participate in a national competition.",
    "category": "arabic"
  },
  {
    "id": "cat_yacoubian_building",
    "title": "The Yacoubian Building",
    "genre": "Arabic",
    "releaseYear": 2006,
    "videoUrl": "77951",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/lkElT9HpOUIjIL20Hwy3LZqgXWc.jpg",
    "description": "Interwoven stories of the residents of a historic Cairo building, exploring corruption, class struggle, and societal hypocrisy in modern Egypt.",
    "category": "arabic"
  },
  {
    "id": "cat_capernaum",
    "title": "Capernaum",
    "genre": "Arabic",
    "releaseYear": 2018,
    "videoUrl": "512200",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/jyw8VKYEiM1UDzPB7NsisUgBeJ8.jpg",
    "description": "A Lebanese boy sues his parents for the 'crime' of giving him life in this devastating yet compassionate film about poverty and resilience.",
    "category": "arabic"
  },
  {
    "id": "cat_the_insult",
    "title": "The Insult",
    "genre": "Arabic",
    "releaseYear": 2017,
    "videoUrl": "449176",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/snIsqVPmlu4LPjvToHpDotxa7Eh.jpg",
    "description": "A minor incident between a Lebanese Christian and a Palestinian refugee in Beirut quickly escalates into a court case that divides the entire nation.",
    "category": "arabic"
  },
  {
    "id": "cat_theeb",
    "title": "Theeb",
    "genre": "Arabic",
    "releaseYear": 2014,
    "videoUrl": "287757",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/uI9enNoQsqseLXQK60YbscDr5L6.jpg",
    "description": "A Bedouin boy's epic journey through the desert during the Arab Revolt of World War I, earning him the name 'The Wolf'.",
    "category": "arabic"
  },
  {
    "id": "cat_omar",
    "title": "Omar",
    "genre": "Arabic",
    "releaseYear": 2013,
    "videoUrl": "221732",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/3sw2YRF0UR4jeZJ2yvpgk4qvMQK.jpg",
    "description": "A Palestinian baker who routinely climbs the separation wall to visit his secret girlfriend becomes embroiled in the struggle for freedom and betrayal.",
    "category": "arabic"
  },
  {
    "id": "cat_perfect_strangers_ar",
    "title": "Perfect Strangers",
    "genre": "Arabic",
    "releaseYear": 2022,
    "videoUrl": "842942",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/yph9PAbmjYPvyvbeZvdYIhCZHEu.jpg",
    "description": "A group of friends agree to share every text and call they receive during a dinner party, exposing secrets that threaten to destroy their relationships.",
    "category": "arabic"
  },
];
