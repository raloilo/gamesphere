require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('./models/Game');
const News = require('./models/News');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamesphere';

// 25+ globally popular games with high-quality, realistic data
// Schema: name, slug, description, shortDescription, developer, publisher, category,
// platforms, releaseDate, isUpcoming, coverImage, screenshots, trailerUrl, rating, trending, featured

const games = [
  {
    name: 'Grand Theft Auto V',
    slug: 'grand-theft-auto-v',
    description: 'Grand Theft Auto V is a vast open-world action-adventure game set in the fictional state of San Andreas, based on Southern California. Play as three uniquely different criminals—Michael, Franklin, and Trevor—as they risk everything in a series of daring and dangerous heists that could set them up for life. It features a massive and diverse open world, groundbreaking missions, and an incredible level of detail. Experience the story through three playable protagonists, explore the sprawling city of Los Santos and the surrounding Blaine County, and engage in seamless online multiplayer with GTA Online.',
    shortDescription: 'The definitive open-world experience. Three criminals, one city, endless possibilities.',
    developer: 'Rockstar North',
    publisher: 'Rockstar Games',
    category: 'Action',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    releaseDate: new Date('2013-09-17'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/Ep5QfWMba-s',
    rating: { average: 9.6, count: 185000 },
    trending: true,
    featured: true,
    recentUpdate: 'Next-gen update with ray tracing and performance improvements',
    updateDate: new Date('2022-03-15')
  },
  {
    name: 'Grand Theft Auto VI',
    slug: 'grand-theft-auto-vi',
    description: 'Grand Theft Auto VI returns to the neon-soaked streets of Vice City, a fictionalized Miami, in the most ambitious and immersive entry in the series. Rockstar Games has crafted a living, breathing world filled with unprecedented detail, dynamic weather, and a story that pushes the boundaries of interactive entertainment. Featuring the franchise\'s first female protagonist, Lucia, and her partner Jason, the game promises a narrative-driven experience alongside the sandbox chaos GTA is known for. Officially set to launch November 19, 2026.',
    shortDescription: 'Welcome to Leonida. The next chapter in the Grand Theft Auto saga.',
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    category: 'Action',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    releaseDate: new Date('2026-11-19'),
    isUpcoming: true,
    coverImage: '/images/gta-vi-cover.png',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/eOrb93UZfPU',
    trailerUrls: [
      'https://www.youtube.com/embed/eOrb93UZfPU',
      'https://www.youtube.com/embed/VQRLujxTm3c'
    ],
    rating: { average: 0, count: 0 },
    trending: true,
    featured: true
  },
  {
    name: 'Fortnite',
    slug: 'fortnite',
    description: 'Fortnite is a free-to-play battle royale game where 100 players compete to be the last one standing. Drop onto a massive island, scavenge for weapons and resources, build defensive structures, and outlast your opponents. With regular content updates, crossover events with major franchises, and a creative mode that lets players build their own games, Fortnite has become a cultural phenomenon. The game features a unique building mechanic that sets it apart from other battle royales, allowing for dynamic combat and strategic gameplay.',
    shortDescription: 'Drop in. Gear up. Build. Survive. Battle royale meets endless creativity.',
    developer: 'Epic Games',
    publisher: 'Epic Games',
    category: 'Shooter',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
    releaseDate: new Date('2017-09-26'),
    isUpcoming: false,
    coverImage: 'https://cdn2.unrealengine.com/fortnite-battle-royale-chapter-5-season-2-1920x1080-6008298f0e0f.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/2gUtfBmw86Y',
    rating: { average: 8.1, count: 420000 },
    trending: true,
    featured: true,
    recentUpdate: 'Chapter 5 Season 2: Myths & Mortals',
    updateDate: new Date('2024-03-08')
  },
  {
    name: 'Call of Duty: Warzone',
    slug: 'call-of-duty-warzone',
    description: 'Call of Duty: Warzone is a free-to-play battle royale game and part of the Call of Duty franchise. Drop into Verdansk or the new Al Mazrah map with up to 150 players in squads of 1-4. Scavenge weapons, complete contracts, and fight to be the last squad standing. With tight gunplay, the signature Call of Duty feel, and integration with Modern Warfare and Black Ops content, Warzone delivers a premium battle royale experience. Features include the Gulag for second chances, buy stations, and a constantly evolving map.',
    shortDescription: 'The definitive Call of Duty battle royale. Last squad standing wins.',
    developer: 'Infinity Ward',
    publisher: 'Activision',
    category: 'Shooter',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    releaseDate: new Date('2020-03-10'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1962660/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/8e0npWf3pYg',
    rating: { average: 7.8, count: 195000 },
    trending: true,
    featured: true,
    recentUpdate: 'Warzone Mobile launch, Verdansk returns',
    updateDate: new Date('2024-03-21')
  },
  {
    name: 'Call of Duty: Modern Warfare III',
    slug: 'call-of-duty-modern-warfare-iii',
    description: 'Call of Duty: Modern Warfare III continues the story of Task Force 141 as they face off against the ultimate threat: Vladimir Makarov. The campaign picks up immediately after Modern Warfare II, featuring blockbuster set pieces and globe-trotting missions. Multiplayer brings back all 16 launch maps from 2009\'s Modern Warfare 2, reimagined for modern gameplay, plus new modes and weapons. Zombies mode returns with an open-world PvE experience. Full integration with Warzone ensures your progression carries across the entire Call of Duty ecosystem.',
    shortDescription: 'Task Force 141 faces the ultimate threat. The fight continues.',
    developer: 'Sledgehammer Games',
    publisher: 'Activision',
    category: 'Shooter',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    releaseDate: new Date('2023-11-10'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2519060/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/mHDEDDrGYvo',
    rating: { average: 5.8, count: 42000 },
    trending: true,
    recentUpdate: 'Season 2 Reloaded: new maps and weapons',
    updateDate: new Date('2024-02-07')
  },
  {
    name: 'Minecraft',
    slug: 'minecraft',
    description: 'Minecraft is a sandbox game that lets you build, explore, and survive in blocky, procedurally generated 3D worlds. With nearly infinite possibilities, you can build anything from simple shelters to elaborate castles, explore vast caves and biomes, fight creatures, mine resources, and craft tools. Play solo or with friends in multiplayer. Survival mode tests your nerves, Creative mode unleashes unlimited building potential, and Adventure mode lets you experience custom maps. Minecraft has become the best-selling video game of all time, beloved by players of all ages.',
    shortDescription: 'Place blocks. Build anything. Explore infinite worlds. The ultimate sandbox.',
    developer: 'Mojang Studios',
    publisher: 'Xbox Game Studios',
    category: 'Simulation',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
    releaseDate: new Date('2011-11-18'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/239160/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/MmB9b5njVbA',
    rating: { average: 9.3, count: 892000 },
    trending: true,
    featured: true,
    recentUpdate: '1.21 Tricky Trials Update - June 2024',
    updateDate: new Date('2024-06-13')
  },
  {
    name: 'Red Dead Redemption 2',
    slug: 'red-dead-redemption-2',
    description: 'Red Dead Redemption 2 is an epic tale of life in America\'s unforgiving heartland. The game follows Arthur Morgan and the Van der Linde gang as they flee across the vast and rugged American frontier. As deepening internal divisions threaten to tear the gang apart, Arthur must make a choice between his own ideals and loyalty to the people who raised him. From the creators of Grand Theft Auto V, RDR2 features a meticulously crafted open world, profound storytelling, and gameplay that rewards patience and immersion. A masterpiece of interactive narrative.',
    shortDescription: 'America, 1899. The end of the outlaw era. One man\'s redemption.',
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    category: 'Action',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    releaseDate: new Date('2018-10-26'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/gmA6MrX81z4',
    rating: { average: 9.7, count: 125000 },
    trending: true,
    featured: true
  },
  {
    name: 'EA Sports FC 24',
    slug: 'ea-sports-fc-24',
    description: 'EA Sports FC 24 is the evolution of the FIFA series, rebranded as EA\'s flagship football simulation. It features HyperMotionV technology for realistic player movement, PlayStyles powered by Opta data for authentic player abilities, and enhanced Frostbite engine visuals. Build your ultimate team in Ultimate Team, manage clubs in Career Mode, or compete in VOLTA Football. With over 19,000 players, 700+ teams, and 30+ leagues, EA Sports FC 24 delivers the most authentic football experience ever created.',
    shortDescription: 'The world\'s game. Your way. The next era of football.',
    developer: 'EA Vancouver',
    publisher: 'Electronic Arts',
    category: 'Sports',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    releaseDate: new Date('2023-09-29'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2195250/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1543326727-cf6c39e8e8b0?w=800',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/Xh3jh9I_8u4',
    rating: { average: 7.8, count: 28000 },
    trending: true,
    recentUpdate: 'Title Update 8 - gameplay improvements',
    updateDate: new Date('2024-03-12')
  },
  {
    name: 'Valorant',
    slug: 'valorant',
    description: 'Valorant is a free-to-play tactical hero shooter from Riot Games. Two teams of five compete in round-based matches where attackers plant a spike and defenders attempt to stop them. Each agent has unique abilities that require strategy and teamwork. Precise gunplay meets strategic ability usage in this competitive 5v5 experience. With a constantly evolving cast of agents, regular balance updates, and a thriving esports scene, Valorant has established itself as a premier competitive FPS.',
    shortDescription: 'Tactical shooter meets hero abilities. Defuse or detonate.',
    developer: 'Riot Games',
    publisher: 'Riot Games',
    category: 'Shooter',
    platforms: ['PC'],
    releaseDate: new Date('2020-06-02'),
    isUpcoming: false,
    coverImage: 'https://cmsassets.rgpub.io/assets/vpb/vg-1/overview/valorant-key-art.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/e_E9W3vs5H8',
    rating: { average: 8.2, count: 156000 },
    trending: true,
    featured: true,
    recentUpdate: 'Clove agent, Episode 8 Act 2',
    updateDate: new Date('2024-03-05')
  },
  {
    name: 'League of Legends',
    slug: 'league-of-legends',
    description: 'League of Legends is a free-to-play multiplayer online battle arena (MOBA) game where two teams of five powerful champions compete to destroy the enemy\'s Nexus. Choose from over 160 champions, each with unique abilities and playstyles. Master your role, coordinate with your team, and outplay your opponents in matches that blend strategy, skill, and teamwork. With regular updates, new champions, and a global esports scene that draws millions of viewers, League of Legends remains one of the most popular games in the world.',
    shortDescription: 'Choose your champion. Dominate the Rift. Become a legend.',
    developer: 'Riot Games',
    publisher: 'Riot Games',
    category: 'Strategy',
    platforms: ['PC'],
    releaseDate: new Date('2009-10-27'),
    isUpcoming: false,
    coverImage: 'https://www.leagueoflegends.com/static/open-graph-2e582ae9fae8b0b396ca46ff21fd47a8.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800',
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/vzHrjOMfPnY',
    rating: { average: 8.2, count: 892000 },
    trending: true,
    featured: true,
    recentUpdate: 'Patch 14.6 - Skaarl rework',
    updateDate: new Date('2024-03-20')
  },
  {
    name: 'Cyberpunk 2077',
    slug: 'cyberpunk-2077',
    description: 'Cyberpunk 2077 is an open-world, action-adventure RPG set in the dark future of Night City—a dangerous megalopolis obsessed with power, glamour, and body modification. Play as V, a mercenary outlaw going after a one-of-a-kind implant that holds the key to immortality. Your choices shape the story and the world around you. With the Phantom Liberty expansion and 2.0 update, Cyberpunk 2077 has been transformed into the experience it was meant to be: a deep RPG with thrilling combat and a compelling narrative.',
    shortDescription: 'Night City awaits. Become a legend in the dark future.',
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    category: 'RPG',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    releaseDate: new Date('2020-12-10'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/LembwKDo1Dk',
    rating: { average: 8.6, count: 245000 },
    trending: true,
    featured: true,
    recentUpdate: 'Phantom Liberty expansion, Update 2.1',
    updateDate: new Date('2023-12-05')
  },
  {
    name: 'The Witcher 3: Wild Hunt',
    slug: 'the-witcher-3-wild-hunt',
    description: 'The Witcher 3: Wild Hunt is a story-driven open world RPG set in a dark fantasy universe. You play as Geralt of Rivia, a professional monster slayer. The world is in chaos—the Empire is attacking the kingdoms of the North, and the Wild Hunt, a cavalcade of ghastly riders, brings blood and destruction. Your task is to find the Child of Prophecy, a living weapon that can alter the shape of the world. With hundreds of quests, a rich narrative, and two massive expansions—Hearts of Stone and Blood and Wine—The Witcher 3 is a masterpiece of role-playing.',
    shortDescription: 'You are Geralt of Rivia. Monster slayer. The fate of the world awaits.',
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    category: 'RPG',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    releaseDate: new Date('2015-05-19'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/c0i88t0Kacs',
    rating: { average: 9.3, count: 312000 },
    trending: true,
    featured: true
  },
  {
    name: 'Elden Ring',
    slug: 'elden-ring',
    description: 'Elden Ring is an action RPG set in the Lands Between, a world created by Hidetaka Miyazaki and George R. R. Martin. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord. Explore a vast open world with dense forests, towering castles, and treacherous dungeons. Face fearsome creatures and formidable bosses. With deep customization, countless weapons and spells, and the signature challenging gameplay FromSoftware is known for, Elden Ring is a landmark achievement in action RPG design.',
    shortDescription: 'Rise, Tarnished. The Lands Between await. Become the Elden Lord.',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco Entertainment',
    category: 'RPG',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    releaseDate: new Date('2022-02-25'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/E3Huy2cdih0',
    rating: { average: 9.6, count: 198000 },
    trending: true,
    featured: true,
    recentUpdate: 'Shadow of the Erdtree expansion - June 21, 2024',
    updateDate: new Date('2024-06-21')
  },
  {
    name: 'God of War Ragnarök',
    slug: 'god-of-war-ragnarok',
    description: 'God of War Ragnarök continues the saga of Kratos and Atreus as they navigate the freezing Norse wilds and face the coming of Ragnarök. Atreus seeks knowledge to understand his identity as Loki, while Kratos struggles with his past and the possibility of being the father his son needs. Together they must choose between their own safety and the safety of the realms. With evolved combat, breathtaking scale, and emotional depth, Ragnarök delivers an epic conclusion to the Norse saga. The Valhalla DLC adds roguelike endgame content.',
    shortDescription: 'Ragnarök is coming. Kratos and Atreus must choose their path.',
    developer: 'Santa Monica Studio',
    publisher: 'Sony Interactive Entertainment',
    category: 'Action',
    platforms: ['PlayStation', 'PC'],
    releaseDate: new Date('2022-11-09'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800',
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/EE-4Gvj1c2U',
    rating: { average: 9.4, count: 68000 },
    trending: true,
    featured: true,
    recentUpdate: 'PC release September 19, 2024; Valhalla DLC included',
    updateDate: new Date('2024-09-19')
  },
  {
    name: 'Marvel\'s Spider-Man 2',
    slug: 'marvel-spider-man-2',
    description: 'Marvel\'s Spider-Man 2 continues the saga of both Peter Parker and Miles Morales as they face new threats in an expanded New York City. Swing through the boroughs with the new Web Wings, battle iconic villains including Venom and Kraven the Hunter, and switch seamlessly between Peter and Miles. With expanded combat, new abilities, and a story that pushes both heroes to their limits, Spider-Man 2 delivers the definitive Spider-Man experience. The city has never looked better, and the stakes have never been higher.',
    shortDescription: 'Be greater. Together. Two Spider-Men. One city.',
    developer: 'Insomniac Games',
    publisher: 'Sony Interactive Entertainment',
    category: 'Action',
    platforms: ['PlayStation'],
    releaseDate: new Date('2023-10-20'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1817190/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/qIQ3xNqXVCg',
    rating: { average: 9.1, count: 42000 },
    trending: true,
    featured: true,
    recentUpdate: 'New Game+ and additional suits',
    updateDate: new Date('2023-12-20')
  },
  {
    name: 'Assassin\'s Creed Mirage',
    slug: 'assassins-creed-mirage',
    description: 'Assassin\'s Creed Mirage returns to the roots of the franchise with a focused, narrative-driven experience. Play as Basim, a cunning street thief with a mysterious past, in 9th-century Baghdad during its golden age. Experience a modern take on the stealth-action gameplay that defined the early Assassin\'s Creed games. Parkour through bustling streets, use your tools and abilities to assassinate targets, and uncover the mysteries of the Hidden Ones. A shorter, more intimate adventure that honors the series\' foundations.',
    shortDescription: 'Experience the violent foundation of the Creed. Baghdad awaits.',
    developer: 'Ubisoft Bordeaux',
    publisher: 'Ubisoft',
    category: 'Action',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    releaseDate: new Date('2023-10-05'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2459450/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/x55lAl533hA',
    rating: { average: 7.6, count: 18500 },
    trending: false,
    featured: false
  },
  {
    name: 'PUBG: Battlegrounds',
    slug: 'pubg-battlegrounds',
    description: 'PUBG: Battlegrounds is the game that pioneered the battle royale genre. 100 players parachute onto a massive island, scavenge for weapons and supplies, and fight to be the last one standing. Strategic gameplay, realistic ballistics, and a shrinking play zone create intense, unpredictable matches. Choose from multiple maps including Erangel, Miramar, and Vikendi. Play solo, in duos, or squads. With regular updates, new maps, and a thriving competitive scene, PUBG remains a staple of the battle royale experience.',
    shortDescription: '100 players. One island. Last one standing wins.',
    developer: 'KRAFTON',
    publisher: 'KRAFTON',
    category: 'Shooter',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Mobile'],
    releaseDate: new Date('2017-12-21'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/ODWCbu_cuqk',
    rating: { average: 8.2, count: 892000 },
    trending: true,
    recentUpdate: 'Update 29.1 - Rondo map',
    updateDate: new Date('2024-01-17')
  },
  {
    name: 'Apex Legends',
    slug: 'apex-legends',
    description: 'Apex Legends is a free-to-play battle royale shooter where legendary competitors fight for glory, fame, and fortune on the fringes of the Frontier. Master a growing roster of diverse Legends with deep tactical abilities, build your crew, and compete in ever-evolving modes. The innovative ping system, respawn mechanics, and character-based gameplay revolutionized the genre. With seasonal updates, new Legends, and a vibrant esports scene, Apex Legends continues to evolve as one of the premier battle royale experiences.',
    shortDescription: 'Conquer with character. The next evolution of battle royale.',
    developer: 'Respawn Entertainment',
    publisher: 'Electronic Arts',
    category: 'Shooter',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
    releaseDate: new Date('2019-02-04'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/oQtHENM_GU0',
    rating: { average: 8.5, count: 245000 },
    trending: true,
    featured: true,
    recentUpdate: 'Season 20: Breakout',
    updateDate: new Date('2024-02-13')
  },
  {
    name: 'Rocket League',
    slug: 'rocket-league',
    description: 'Rocket League is soccer meets driving in this high-octane hybrid. Boost and fly through the air to score incredible goals with rocket-powered cars. Easy to learn, difficult to master, Rocket League offers competitive ranking, casual matches, and numerous special modes. Customize your car with countless items, compete in tournaments, and experience the thrill of that perfect aerial goal. Free-to-play and cross-platform, Rocket League has created a unique competitive experience enjoyed by millions.',
    shortDescription: 'Soccer meets driving. Supersonic acrobatic rocket-powered cars.',
    developer: 'Psyonix',
    publisher: 'Epic Games',
    category: 'Sports',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    releaseDate: new Date('2015-07-07'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/SgSX3gRsjD4',
    rating: { average: 9.0, count: 312000 },
    trending: true,
    featured: true
  },
  {
    name: 'Tom Clancy\'s Rainbow Six Siege',
    slug: 'rainbow-six-siege',
    description: 'Rainbow Six Siege is a tactical shooter where precision and planning win the day. Attack or defend in close-quarters combat with destructible environments. Choose from a roster of Operators, each with unique gadgets and abilities. Reinforce walls, breach barricades, deploy drones, and outthink your opponents. With regular content updates bringing new Operators, maps, and balance changes, Siege has evolved into one of the most competitive and rewarding tactical shooters ever made.',
    shortDescription: 'Tactical destruction. Strategic teamwork. One life per round.',
    developer: 'Ubisoft Montreal',
    publisher: 'Ubisoft',
    category: 'Shooter',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    releaseDate: new Date('2015-12-01'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/359550/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/6wlvYh0h63k',
    rating: { average: 8.4, count: 185000 },
    trending: true,
    recentUpdate: 'Operation Dead Ops - Year 9',
    updateDate: new Date('2024-03-12')
  },
  {
    name: 'Among Us',
    slug: 'among-us',
    description: 'Among Us is a multiplayer social deduction game where you work with your crewmates to complete tasks and identify the Impostors before they murder everyone. Crewmates win by completing all tasks or finding and ejecting all Impostors. Impostors win by sabotaging the ship and eliminating Crewmates without being discovered. With simple mechanics, cross-platform play, and endless replayability with friends, Among Us became a cultural phenomenon. Suspect everyone. Trust no one.',
    shortDescription: 'Complete tasks. Find the Impostor. Or eliminate them all.',
    developer: 'Innersloth',
    publisher: 'Innersloth',
    category: 'Indie',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
    releaseDate: new Date('2018-11-16'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/ZHhk0dYw8sw',
    rating: { average: 8.1, count: 425000 },
    trending: true,
    featured: true
  },
  {
    name: 'Baldur\'s Gate 3',
    slug: 'baldurs-gate-3',
    description: 'Baldur\'s Gate 3 is a narrative-driven RPG from the creators of Divinity: Original Sin 2. Shape your story in the Forgotten Realms—a vast world of adventure, intrigue, and danger. Capture a mind flayer parasite in your brain. Choose from a wide cast of characters, each with unique stories and motivations. Make meaningful choices that impact the world around you. With turn-based combat rooted in D&D 5th edition, branching narratives, and co-op multiplayer, Baldur\'s Gate 3 sets a new standard for the CRPG genre. Winner of numerous Game of the Year awards.',
    shortDescription: 'Gather your party. Venture forth. The fate of the Realms awaits.',
    developer: 'Larian Studios',
    publisher: 'Larian Studios',
    category: 'RPG',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    releaseDate: new Date('2023-08-03'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/1T22wNvoNiU',
    rating: { average: 9.6, count: 385000 },
    trending: true,
    featured: true,
    recentUpdate: 'Patch 6 - kisses, legendary bugs, and more',
    updateDate: new Date('2024-02-16')
  },
  {
    name: 'Starfield',
    slug: 'starfield',
    description: 'Starfield is Bethesda Game Studios\' first new universe in over 25 years. Explore the vast reaches of space in this next-generation role-playing game. Create your character and embark on an epic journey to answer humanity\'s greatest mystery. With over 1,000 planets to explore across hundreds of star systems, deep character customization, and the freedom to play your way, Starfield delivers an expansive sci-fi RPG experience. Build ships, recruit crew, engage in space combat, and uncover the secrets of the cosmos.',
    shortDescription: 'Discover the galaxy. This is the beginning of your journey.',
    developer: 'Bethesda Game Studios',
    publisher: 'Bethesda Softworks',
    category: 'RPG',
    platforms: ['PC', 'Xbox'],
    releaseDate: new Date('2023-09-06'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/kBLaClnn1JI',
    rating: { average: 8.3, count: 125000 },
    trending: true,
    featured: true,
    recentUpdate: 'Update 1.10.31 - bug fixes and improvements',
    updateDate: new Date('2024-03-19')
  },
  {
    name: 'Hogwarts Legacy',
    slug: 'hogwarts-legacy',
    description: 'Hogwarts Legacy is an open-world action RPG set in the wizarding world of the 1800s. You are a student who holds the key to an ancient secret that threatens to tear the wizarding world apart. Attend classes, forge friendships, battle dark wizards, and decide the fate of the wizarding world. Explore Hogwarts Castle, Hogsmeade, the Forbidden Forest, and beyond. Create your character, learn spells, brew potions, and tame magical beasts. Live the wizard life you\'ve always dreamed of.',
    shortDescription: 'Live the wizard life. Your legacy begins at Hogwarts.',
    developer: 'Avalanche Software',
    publisher: 'Warner Bros. Games',
    category: 'Action',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    releaseDate: new Date('2023-02-10'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/1O6Qstn5NdE',
    rating: { average: 8.4, count: 95000 },
    trending: true,
    featured: true,
    recentUpdate: 'Avalanche Software Update',
    updateDate: new Date('2023-12-14')
  },
  {
    name: 'Forza Horizon 5',
    slug: 'forza-horizon-5',
    description: 'Forza Horizon 5 is the ultimate open-world racing experience set in stunning Mexico. Drive hundreds of the world\'s greatest cars across vibrant landscapes—from lush jungles to historic cities, epic canyons to coastal towns. Create your own expressions with the new EventLab game builder. Take on awe-inspiring seasonal events. Explore the world with new driving effects including thunderstorms and dust storms. With over 500 cars and endless customization, Forza Horizon 5 delivers the most diverse and exhilarating Horizon experience yet.',
    shortDescription: 'Your ultimate automotive adventure. Mexico awaits.',
    developer: 'Playground Games',
    publisher: 'Xbox Game Studios',
    category: 'Racing',
    platforms: ['PC', 'Xbox'],
    releaseDate: new Date('2021-11-09'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/FYH9n37B7Yw',
    rating: { average: 9.2, count: 125000 },
    trending: true,
    featured: true,
    recentUpdate: 'Car Pass and expansion content',
    updateDate: new Date('2024-01-15')
  },
  {
    name: 'Horizon Forbidden West',
    slug: 'horizon-forbidden-west',
    description: 'Horizon Forbidden West continues Aloy\'s journey as she ventures into a far-future America ruled by vast machine beings. Explore distant lands, fight larger and more formidable machines, and encounter astonishing new tribes. The land is dying—blight spreads, storms rage, and machine behavior grows increasingly erratic. Aloy must uncover the secrets behind these threats to restore order and balance to the world. With improved combat, a stunning open world, and a compelling narrative, Forbidden West expands the Horizon universe in every way.',
    shortDescription: 'Aloy\'s journey continues. The Forbidden West awaits.',
    developer: 'Guerrilla Games',
    publisher: 'Sony Interactive Entertainment',
    category: 'Action',
    platforms: ['PlayStation', 'PC'],
    releaseDate: new Date('2022-02-18'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2420110/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/Lq594XmpPBg',
    rating: { average: 9.0, count: 52000 },
    trending: true,
    featured: true,
    recentUpdate: 'Burning Shores DLC, PC release',
    updateDate: new Date('2024-03-21')
  },
  {
    name: 'God of War',
    slug: 'god-of-war',
    description: 'God of War (2018) reinvents the legendary franchise. Living as a man outside the shadow of the gods, Kratos must adapt to unfamiliar lands and unexpected responsibilities. With his son Atreus, he will venture into the brutal Norse wilds and fight to fulfill a deeply personal quest. The combat is visceral and impactful, the world is rich with Norse mythology, and the father-son relationship forms the emotional core of an unforgettable journey. A masterpiece that redefined what action games can be.',
    shortDescription: 'His past will not define him. A new legend begins.',
    developer: 'Santa Monica Studio',
    publisher: 'Sony Interactive Entertainment',
    category: 'Action',
    platforms: ['PlayStation', 'PC'],
    releaseDate: new Date('2018-04-20'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800',
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/K0u_kAWLJOA',
    rating: { average: 9.4, count: 89000 },
    trending: true,
    featured: true
  },
  {
    name: 'The Last of Us Part I',
    slug: 'the-last-of-us-part-i',
    description: 'The Last of Us Part I is a faithful remake of the original game, rebuilt from the ground up for PS5 and PC. In a ravaged civilization, where infected and hardened survivors run rampant, Joel, a weary protagonist, is hired to smuggle 14-year-old Ellie out of a military quarantine zone. However, what starts as a small job soon transforms into a brutal cross-country journey. Experience the emotional storytelling and unforgettable characters in this genre-defining action-adventure game.',
    shortDescription: 'Endure and survive. Relive the game that changed everything.',
    developer: 'Naughty Dog',
    publisher: 'Sony Interactive Entertainment',
    category: 'Action',
    platforms: ['PlayStation', 'PC'],
    releaseDate: new Date('2022-09-02'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/WxjeV10H1F0',
    rating: { average: 9.2, count: 65000 },
    trending: true,
    featured: true
  },
  {
    name: 'Ghost of Tsushima Director\'s Cut',
    slug: 'ghost-of-tsushima',
    description: 'Ghost of Tsushima is an open-world action-adventure game set in feudal Japan during the first Mongol invasion. Play as Jin Sakai, one of the last samurai on Tsushima Island. To reclaim his home, he must break away from the traditions that shaped him and wage a new kind of war to free Tsushima. Master the katana, use stealth tactics, and explore a vast, beautiful island filled with ancient shrines, bamboo forests, and war-torn villages.',
    shortDescription: 'A storm is coming. Become the Ghost.',
    developer: 'Sucker Punch Productions',
    publisher: 'Sony Interactive Entertainment',
    category: 'Action',
    platforms: ['PlayStation', 'PC'],
    releaseDate: new Date('2021-08-20'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      'https://images.unsplash.com/photo-1493711662062-fa541f8c9b3c?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/A5gRo0e66bE',
    rating: { average: 9.1, count: 58000 },
    trending: true,
    featured: true
  },
  {
    name: 'Uncharted 4: A Thief\'s End',
    slug: 'uncharted-4',
    description: 'Uncharted 4: A Thief\'s End is the conclusion to Nathan Drake\'s story. Several years after his last adventure, retired fortune hunter Nathan Drake is forced back into the world of thieves. With the stakes much more personal, Drake embarks on a globe-trotting journey in pursuit of a historical conspiracy behind a fabled pirate treasure. His greatest adventure will test his physical limits, his resolve, and ultimately what he\'s willing to sacrifice to save the ones he loves.',
    shortDescription: 'Every treasure has its price. Nathan Drake\'s final adventure.',
    developer: 'Naughty Dog',
    publisher: 'Sony Interactive Entertainment',
    category: 'Action',
    platforms: ['PlayStation', 'PC'],
    releaseDate: new Date('2016-05-10'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1659040/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/hh5HV4iic1Y',
    rating: { average: 9.4, count: 112000 },
    trending: true,
    featured: true
  },
  {
    name: 'Marvel\'s Spider-Man: Miles Morales',
    slug: 'spider-man-miles-morales',
    description: 'Marvel\'s Spider-Man: Miles Morales follows the rise of Miles Morales as he masters new powers to become his own Spider-Man. In the latest adventure in the Marvel\'s Spider-Man universe, teenager Miles Morales is adjusting to his new home while following in the footsteps of his mentor, Peter Parker. But when a fierce power struggle threatens to destroy his new home, the aspiring hero realizes that with great power, there must also come great responsibility.',
    shortDescription: 'Be yourself. Be greater. Miles Morales is Spider-Man.',
    developer: 'Insomniac Games',
    publisher: 'Sony Interactive Entertainment',
    category: 'Action',
    platforms: ['PlayStation', 'PC'],
    releaseDate: new Date('2020-11-12'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/NTunTURbyUU',
    rating: { average: 8.8, count: 76000 },
    trending: true,
    featured: true
  },
  {
    name: 'Grand Theft Auto: San Andreas - The Definitive Edition',
    slug: 'gta-san-andreas',
    description: 'Grand Theft Auto: San Andreas follows Carl \'CJ\' Johnson as he returns home to Los Santos in the early 90s. His mother has been murdered, his family has fallen apart, and his childhood friends are heading towards disaster. On his return to the neighborhood, a couple of corrupt cops frame him for homicide. CJ is forced on a journey that takes him across the entire state of San Andreas, to save his family and to take control of the streets.',
    shortDescription: 'Five years ago, Carl Johnson escaped the pressures of life in Los Santos...',
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    category: 'Action',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
    releaseDate: new Date('2021-11-11'),
    isUpcoming: false,
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1546990/header.jpg',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800'
    ],
    trailerUrl: 'https://www.youtube.com/embed/D71cBUeAL58',
    rating: { average: 9.0, count: 240000 },
    trending: true,
    featured: true
  }
];

const newsItems = [
  { title: 'GTA VI Release Date Announced', slug: 'gta-vi-release-date-announced', excerpt: 'Rockstar Games has finally revealed the release date for the highly anticipated GTA VI.', content: 'After years of speculation, Rockstar Games has confirmed that Grand Theft Auto VI will launch on November 19, 2026. The game returns to Vice City (Leonida) with Lucia and Jason as the franchise\'s first dual protagonists. The release was delayed to ensure the level of polish expected from Rockstar.', category: 'Release', featured: true, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg' },
  { title: 'God of War Ragnarök Valhalla DLC Released', slug: 'god-of-war-ragnarok-valhalla-dlc-released', excerpt: 'Santa Monica Studio releases free roguelike DLC for God of War Ragnarök.', content: 'The Valhalla DLC brings roguelike gameplay to the Norse saga. Players can expect new challenges, rewards, and deeper story content exploring Kratos\' past.', category: 'Update', featured: true, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/header.jpg' },
  { title: 'Horizon Forbidden West PC Port Confirmed', slug: 'horizon-forbidden-west-pc-port-confirmed', excerpt: 'Guerrilla Games brings Aloy to PC in 2024.', content: 'The acclaimed open-world action RPG is coming to PC with enhanced graphics, ultrawide support, and full customization options.', category: 'News', featured: true, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2420110/header.jpg' },
  { title: 'Baldur\'s Gate 3 Wins Game of the Year', slug: 'baldurs-gate-3-wins-game-of-the-year', excerpt: 'Larian Studios\' RPG sweeps The Game Awards 2023.', content: 'Baldur\'s Gate 3 took home Game of the Year, Best RPG, Best Multiplayer, and Best Community Support at The Game Awards, cementing its place as a modern classic.', category: 'News', featured: true, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg' },
  { title: '2024 Gaming Industry Trends', slug: '2024-gaming-industry-trends', excerpt: 'A look at what to expect in the gaming world this year.', content: 'AI integration, cloud gaming expansion, and next-gen exclusives dominate the 2024 landscape. Indie games continue to thrive alongside blockbuster releases.', category: 'Industry', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800' }
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Game.deleteMany({});
  await News.deleteMany({});

  await Game.insertMany(games);
  await News.insertMany(newsItems);

  // Create admin user if not exists
  const adminExists = await User.findOne({ email: 'admin@gamesphere.com' });
  if (!adminExists) {
    await User.create({
      username: 'admin',
      email: 'admin@gamesphere.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin user created: admin@gamesphere.com / admin123');
  }

  console.log(`Seed completed! ${games.length} games and ${newsItems.length} news items added.`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
