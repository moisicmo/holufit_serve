import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const RADIO_BROWSER_BASE = "https://de1.api.radio-browser.info/json/stations/bytagexact";

// Detecta décadas
const decadeTags = ["50s", "60s", "70s", "80s", "90s", "00s"];
const genreTags = [
  "pop", "rock", "edm", "techno", "electro", "hiphop", "rap",
  "trap", "classical", "jazz", "lofi", "metal", "punk", "reggae"
];

// ------------------------------
// HELPERS
// ------------------------------

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

  if (genre.includes("edm") || genre.includes("electro") || genre.includes("techno"))
    return "cardio";

  if (genre.includes("lofi") || genre.includes("chill"))
    return "study";

  if (genre.includes("rock"))
    return "strength";

  if (genre.includes("classical") || genre.includes("jazz"))
    return "relax";

  return "general";
}

// ------------------------------
// MAIN SEED FUNCTION
// ------------------------------

async function seedRadios(tag: string) {
  console.log(`🔎 Cargando radios para tag: ${tag}`);

  const { data } = await axios.get(`${RADIO_BROWSER_BASE}/${tag}`);
  console.log(`📡 Encontradas: ${data.length}`);

  for (const item of data) {
    try {
      // Evitar duplicados por UUID
      const exists = await prisma.radio.findUnique({
        where: { stationUUID: item.stationuuid }
      });

      if (exists) continue;

      const tags = item.tags ? item.tags.split(",") : [];
      const languages = item.languagecodes ? item.languagecodes.split(",") : [];

      const genre = inferGenre(tags);
      const category = inferCategory(genre);

      const categoryRecord = await prisma.radioCategory.upsert({
        where: { name: category },
        update: {},
        create: { name: category },
      });

      console.log(categoryRecord)

      await prisma.radio.create({
        data: {
          stationUUID: item.stationuuid,
          categoryId: categoryRecord.id,
          name: item.name,
          url: item.url,
          resolvedUrl: item.url_resolved ?? null,
          image: item.favicon || null,
          country: item.country ?? '',
          bitrate: item.bitrate ?? 0,
          codec: item.codec ?? 'UNKNOWN',
          tags,
          languages,
          genre,
          isOnline: item.lastcheckok === 1,
          isHls: item.hls === 1,
          lastCheck: item.lastchecktime ? new Date(item.lastchecktime) : null,
          lastCheckOk: item.lastcheckok === 1,
          latitude: item.geo_lat ?? null,
          longitude: item.geo_long ?? null,
          createdBy: "system",
        }
      });

      console.log(`✔️ Insertada: ${item.name}`);

    } catch (err) {
      console.error(`❌ Error con ${item.name}:`, err);
    }
  }
}

// ------------------------------
// RUN SEED
// ------------------------------

async function main() {
  await seedRadios("chillout");
  await seedRadios("edm");
  await seedRadios("80s");
  await seedRadios("rock");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
