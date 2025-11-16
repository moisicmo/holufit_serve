import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const RADIO_BROWSER_BASE = "https://de1.api.radio-browser.info/json/stations/bytagexact";

// Detecta décadas
const decadeTags = ["50s","60s","70s","80s","90s","00s"];
const genreTags = ["pop","rock","edm","techno","electro","hiphop",
                   "rap","trap","classical","jazz","lofi","metal","punk","reggae"];

function inferGenre(tags: string[]): string {
  const lower = tags.map(t => t.toLowerCase());
  const isRetro = lower.some(t => decadeTags.includes(t));
  const found = lower.filter(t => genreTags.includes(t));

  let genre = found.slice(0, 2).join("-");
  if (isRetro) genre += " retro";

  return genre.trim();
}

function inferCategory(genre: string): string {
  genre = genre.toLowerCase();

  if (genre.includes("edm") || genre.includes("electro") || genre.includes("techno")) {
    return "cardio";
  }
  if (genre.includes("lofi") || genre.includes("chill")) {
    return "study";
  }
  if (genre.includes("rock")) {
    return "strength";
  }
  if (genre.includes("classical") || genre.includes("jazz")) {
    return "relax";
  }

  return "general";
}

async function seedRadios(tag: string) {
  console.log(`🔎 Buscando radios con el tag: ${tag}`);

  const { data } = await axios.get(`${RADIO_BROWSER_BASE}/${tag}`);

  console.log(`📡 Radios encontradas: ${data.length}`);

  for (const item of data) {
    try {

      const exists = await prisma.radio.findUnique({
        where: { stationUUID: item.stationuuid }
      });
      if (exists) continue;

      const tags = item.tags ? item.tags.split(",") : [];
      const languages = item.languagecodes ? item.languagecodes.split(",") : [];

      const genre = inferGenre(tags);
      const category = inferCategory(genre);

      await prisma.radio.create({
        data: {
          stationUUID: item.stationuuid,
          name: item.name,
          url: item.url,
          resolvedUrl: item.url_resolved ?? null,
          image: item.favicon ?? null,
          country: item.country,
          bitrate: item.bitrate,
          codec: item.codec,
          tags,
          languages,
          genre,
          category,
          createdBy: "system",
        }
      });

      console.log(`🎧 Insertada: ${item.name}`);

    } catch (err) {
      console.error(`❌ Error con ${item.name}:`, err);
    }
  }
}

async function main() {
  await seedRadios("chillout");
  await seedRadios("edm");
  await seedRadios("80s");
  await seedRadios("rock");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
