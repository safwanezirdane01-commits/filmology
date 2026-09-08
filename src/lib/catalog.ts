export interface CatalogMovie {
  id: string;
  title: string;
  genre: string;
  releaseYear: number;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  category: "action" | "scifi" | "animation" | "horror" | "drama" | "classic" | "series" | string;
}

export const CURATED_CATALOG: CatalogMovie[] = [
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
    "description": "Teenager Riley",
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
    "description": "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN",
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
    "thumbnailUrl": "https://media.themoviedb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
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
    "description": "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos",
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
    "description": "When Ellen, the matriarch of the Graham family, passes away, her daughter",
    "category": "horror"
  },
  {
    "id": "cmtt295h30008vkswq6sjtncv",
    "title": "Blade Runner 2049",
    "genre": "Sci-Fi",
    "releaseYear": 2017,
    "videoUrl": "335984",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    "description": "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what",
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
    "id": "cmtt295hp000avkswbfcn8bw3",
    "title": "Spirited Away",
    "genre": "Animation",
    "releaseYear": 2001,
    "videoUrl": "129",
    "thumbnailUrl": "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    "description": "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had.",
    "category": "animation"
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
    "description": "A burger-loving hit man, his philosophical partner, a drug-addled gangster",
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
  }
];
