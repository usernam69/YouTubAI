export type Video = {
  id: number;
  slug: string;
  title: string;
  channel: string;
  channelSlug: string;
  avatar: string;
  accent: string;
  views: string;
  ago: string;
  seconds: number;
  dur: string;
  cat: string;
  year: number;
  src: string;
  poster: string;
  license: string;
  licenseUrl: string;
  studio: string;
  blurb: string;
  tags: string[];
};

const IA = "https://archive.org/download";

export const VIDEOS: Video[] = [
  {
    id: 1,
    slug: "big-buck-bunny",
    title: "Big Buck Bunny",
    channel: "Blender Studio",
    channelSlug: "blender-studio",
    avatar: "BS",
    accent: "#7cb342",
    views: "31M",
    ago: "18 years ago",
    seconds: 596,
    dur: "9:56",
    cat: "Animation",
    year: 2008,
    src: `${IA}/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4`,
    poster: `${IA}/big-buck-bunny-512kb_202601/big-buck-bunny-512kb_202601.thumbs/BigBuckBunny_000147.jpg`,
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    studio: "Blender Foundation",
    blurb:
      "A gentle giant of a rabbit wakes to a perfect spring morning, and three woodland rodents decide to ruin it. The open movie that introduced the world to Blender's animation pipeline — fur, foliage and slapstick revenge rendered entirely in Blender.",
    tags: ["fur simulation", "comedy", "open movie", "classic"],
  },
  {
    id: 2,
    slug: "elephants-dream",
    title: "Elephants Dream",
    channel: "Blender Studio",
    channelSlug: "blender-studio",
    avatar: "BS",
    accent: "#7cb342",
    views: "8.4M",
    ago: "20 years ago",
    seconds: 654,
    dur: "10:54",
    cat: "Sci-Fi",
    year: 2006,
    src: `${IA}/ElephantsDream/ed_1024.mp4`,
    poster: `${IA}/elephants-dream_202601/elephants-dream_202601.thumbs/Elephants%20Dream_000087.jpg`,
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    studio: "Orange Open Movie Project",
    blurb:
      "Inside a vast, impossible machine, an old man named Proog tours a young man named Emo through rooms that may not exist. The first Blender open movie, and still the strangest — a surreal descent into a mechanical dreamscape.",
    tags: ["surreal", "sci-fi", "open movie", "landmark"],
  },
  {
    id: 3,
    slug: "sintel",
    title: "Sintel",
    channel: "Blender Studio",
    channelSlug: "blender-studio",
    avatar: "BS",
    accent: "#7cb342",
    views: "24M",
    ago: "16 years ago",
    seconds: 888,
    dur: "14:48",
    cat: "Fantasy",
    year: 2010,
    src: `${IA}/Sintel/sintel-2048-stereo_512kb.mp4`,
    poster: `${IA}/sintel-open-movie-by-blender/sintel-open-movie-by-blender.thumbs/Sintel%20-%20Open%20Movie%20by%20Blender~1_000117.jpg`,
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    studio: "Blender Foundation",
    blurb:
      "A lone wanderer crosses a hostile world searching for the dragon she once raised and lost. Sintel is the film that proved open-source 3D could carry genuine emotional weight, from its snowbound opening to its devastating final shot.",
    tags: ["fantasy", "dragon", "drama", "open movie"],
  },
  {
    id: 4,
    slug: "tears-of-steel",
    title: "Tears of Steel",
    channel: "Blender Studio",
    channelSlug: "blender-studio",
    avatar: "BS",
    accent: "#7cb342",
    views: "19M",
    ago: "14 years ago",
    seconds: 734,
    dur: "12:14",
    cat: "Sci-Fi",
    year: 2012,
    src: `${IA}/tearsofsteelblendervfxopenmovie800p/Tears%20of%20Steel%20-%20Blender%20VFX%20Open%20Movie%20800p.mp4`,
    poster: `${IA}/tearsofsteelblendervfxopenmovie800p/tearsofsteelblendervfxopenmovie800p.thumbs/Tears%20of%20Steel%20-%20Blender%20VFX%20Open%20Movie%20800p_000119.jpg`,
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    studio: "Blender Foundation",
    blurb:
      "Amsterdam, decades after the machines won. A team of scientists tries to rebuild a broken relationship to save the city, blending live-action plates with computer-generated robots and destruction on a scale no open project had attempted before.",
    tags: ["live action", "vfx", "robots", "dystopia"],
  },
  {
    id: 5,
    slug: "spring",
    title: "Spring",
    channel: "Blender Studio",
    channelSlug: "blender-studio",
    avatar: "BS",
    accent: "#7cb342",
    views: "12M",
    ago: "7 years ago",
    seconds: 464,
    dur: "7:44",
    cat: "Fantasy",
    year: 2019,
    src: `${IA}/spring_blenderopenmovie/Spring%20-%20Blender%20Open%20Movie%20-%20YouTube.mp4`,
    poster: `${IA}/spring_blenderopenmovie/spring_blenderopenmovie.thumbs/Spring%20-%20Blender%20Open%20Movie%20-%20YouTube_000118.jpg`,
    license: "CC0 (Public Domain)",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    studio: "Blender Studio",
    blurb:
      "A shepherd girl and her dog climb into the mountains to face a spirit that has kept the valley in eternal winter. Hand-painted textures and a fully procedural cloud system make this one of the most beautiful things ever rendered in the open.",
    tags: ["hand painted", "fantasy", "procedural", "short film"],
  },
  {
    id: 6,
    slug: "agent-327-operation-barbershop",
    title: "Agent 327: Operation Barbershop",
    channel: "Blender Studio",
    channelSlug: "blender-studio",
    avatar: "BS",
    accent: "#7cb342",
    views: "16M",
    ago: "9 years ago",
    seconds: 232,
    dur: "3:52",
    cat: "Action",
    year: 2017,
    src: `${IA}/agent327operationbarbershop/agent327.mp4`,
    poster: `${IA}/agent327operationbarbershop/agent327operationbarbershop.thumbs/agent327-1080_000001.jpg`,
    license: "CC BY-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nd/4.0/",
    studio: "Blender Animation Studio",
    blurb:
      "A bald secret agent with an unlikely head of hair walks into a barbershop in 1960s Amsterdam and walks out with a gunfight. A stylised spy pastiche built to stress-test Blender's hair, cloth and crowd systems.",
    tags: ["spy", "action", "stylised", "amsterdam"],
  },
  {
    id: 7,
    slug: "sprite-fright",
    title: "Sprite Fright",
    channel: "Blender Studio",
    channelSlug: "blender-studio",
    avatar: "BS",
    accent: "#7cb342",
    views: "9.1M",
    ago: "5 years ago",
    seconds: 630,
    dur: "10:30",
    cat: "Horror",
    year: 2021,
    src: `${IA}/sprite-fright-blender-open-movie/Sprite%20Fright%20-%20Blender%20Open%20Movie.mp4`,
    poster: `${IA}/sprite-fright-blender-open-movie/sprite-fright-blender-open-movie.thumbs/Sprite%20Fright%20-%20Blender%20Open%20Movie_000087.jpg`,
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    studio: "Blender Studio",
    blurb:
      "A group of city kids head to a remote forest for a weekend of drinking, and the local sprites take violent exception. A loving 1980s B-movie homage — practical-looking gore, terrible decisions, and a very good synth score.",
    tags: ["horror", "80s homage", "creature", "gore"],
  },
  {
    id: 8,
    slug: "wing-it",
    title: "Wing It!",
    channel: "Blender Studio",
    channelSlug: "blender-studio",
    avatar: "BS",
    accent: "#7cb342",
    views: "7.3M",
    ago: "3 years ago",
    seconds: 238,
    dur: "3:58",
    cat: "Comedy",
    year: 2023,
    src: `${IA}/wing_it/wing_it.mp4`,
    poster: `${IA}/wing_it/wing_it.thumbs/wing_it_000118.jpg`,
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    studio: "Blender Studio",
    blurb:
      "An awkward young bird would rather do anything than fly, and the whole flock is not going to let that slide. A brisk, warm-hearted comedy about the least dignified possible route into the air.",
    tags: ["comedy", "birds", "coming of age", "short film"],
  },
  {
    id: 9,
    slug: "coffee-run",
    title: "Coffee Run",
    channel: "Blender Studio",
    channelSlug: "blender-studio",
    avatar: "BS",
    accent: "#7cb342",
    views: "13M",
    ago: "6 years ago",
    seconds: 185,
    dur: "3:05",
    cat: "Comedy",
    year: 2020,
    src: `${IA}/coffee-run/Coffee%20Run.mp4`,
    poster: `${IA}/coffee-run/coffee-run.thumbs/Coffee%20Run_000060.jpg`,
    license: "CC BY-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nd/4.0/",
    studio: "Blender Institution",
    blurb:
      "A caffeine-starved barista has one job: get the coffee across town without spilling it. The city becomes an obstacle course, and every shortcut makes things worse. Made by students at the Blender Institution.",
    tags: ["comedy", "chase", "city", "student film"],
  },
  {
    id: 10,
    slug: "hero",
    title: "Hero",
    channel: "Blender Studio",
    channelSlug: "blender-studio",
    avatar: "BS",
    accent: "#7cb342",
    views: "11M",
    ago: "8 years ago",
    seconds: 237,
    dur: "3:57",
    cat: "Drama",
    year: 2018,
    src: `${IA}/hero_20260106/hero.mp4`,
    poster: `${IA}/hero_20260106/hero_20260106.thumbs/hero_000057.jpg`,
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    studio: "Blender Studio / Daniel Martinez Lara",
    blurb:
      "A father and daughter, a lonely stretch of coast, and a story about what gets passed down. Directed by Daniel Martinez Lara, it is the quietest film Blender ever shipped — and one of the most carefully lit.",
    tags: ["drama", "family", "character", "lighting"],
  },
];

export const byId = (id: number) => VIDEOS.find(v => v.id === id);
export const bySlug = (slug: string) => VIDEOS.find(v => v.slug === slug);
export const thumb = (v: Video) => v.poster;
export const nextIn = (v: Video) => VIDEOS[(VIDEOS.findIndex(x => x.id === v.id) + 1) % VIDEOS.length];
export const related = (v: Video, n = 8) => {
  const same = VIDEOS.filter(x => x.id !== v.id && x.cat === v.cat);
  const rest = VIDEOS.filter(x => x.id !== v.id && x.cat !== v.cat);
  return [...same, ...rest].slice(0, n);
};

export const CATEGORIES = [
  "All",
  ...Array.from(new Set(VIDEOS.map(v => v.cat))).sort(),
];

export const CHANNELS = Array.from(
  VIDEOS.reduce((m, v) => {
    const cur = m.get(v.channelSlug) || { slug: v.channelSlug, name: v.channel, avatar: v.avatar, accent: v.accent, count: 0 };
    cur.count += 1;
    m.set(v.channelSlug, cur);
    return m;
  }, new Map<string, { slug: string; name: string; avatar: string; accent: string; count: number }>())
    .values()
).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

export type Channel = (typeof CHANNELS)[number];